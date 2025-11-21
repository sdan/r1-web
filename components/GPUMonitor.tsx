'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from '@components/DataTable';
import Text from '@components/Text';
import Badge from '@components/Badge';
import Button from '@components/Button';

const INITIAL_TABLE = [['Sample', 'Time (μs)']];
const MAX_ROWS = 12;

// NOTE: This is an experimental approach. Not all browsers support pipeline statistics queries.
export default function GPUMonitor() {
  const [timeData, setTimeData] = useState<string[][]>(INITIAL_TABLE);
  const [lastSampleUs, setLastSampleUs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const frameIdxRef = useRef(0);
  const stopRef = useRef(false);
  const monitoringRef = useRef(true);

  useEffect(() => {
    monitoringRef.current = isMonitoring;
  }, [isMonitoring]);

  useEffect(() => {
    if (!navigator.gpu) {
      setErrorMessage('WebGPU not supported in this browser');
      return;
    }

    let device: GPUDevice | undefined;
    let querySet: GPUQuerySet | undefined;
    let resultsBuffer: GPUBuffer | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    stopRef.current = false;

    (async () => {
      // Request the adapter
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        setErrorMessage('No suitable GPU adapter found');
        return;
      }

      // Use 'timestamp-query' instead of 'timestamp'
      const requiredFeatures: GPUFeatureName[] = [];
      if (adapter.features.has('timestamp-query')) {
        requiredFeatures.push('timestamp-query');
      }

      // Request the device with the needed features (if supported)
      device = await adapter.requestDevice({
        requiredFeatures,
      });

      // If the device doesn't support timestamp-query, bail
      if (!device.features.has('timestamp-query')) {
        setErrorMessage('timestamp-query not supported on this device');
        return;
      }

      // Create a timestamp QuerySet with 2 slots
      querySet = device.createQuerySet({
        type: 'timestamp',
        count: 2,
      });

      // Allocate a reusable results buffer
      resultsBuffer = device.createBuffer({
        size: 2 * 8, // 2 timestamps * 8 bytes each
        usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.MAP_READ,
      });

      // Called each frame to measure GPU time
      async function measureFrame() {
        if (stopRef.current || !device || !monitoringRef.current) return;
        frameIdxRef.current += 1;

        const commandEncoder = device.createCommandEncoder();

        // Start pass
        const pass = commandEncoder.beginComputePass();
        pass.writeTimestamp(querySet, 0);

        // (Any optional GPU compute/draw calls here)

        pass.writeTimestamp(querySet, 1);
        pass.end();

        commandEncoder.resolveQuerySet(querySet, 0, 2, resultsBuffer, 0);
        device.queue.submit([commandEncoder.finish()]);

        // Wait for GPU to finish
        await device.queue.onSubmittedWorkDone();

        try {
          await resultsBuffer.mapAsync(GPUMapMode.READ);
          const arrayBuf = new BigUint64Array(resultsBuffer.getMappedRange());
          const startTime = arrayBuf[0];
          const endTime = arrayBuf[1];
          resultsBuffer.unmap();

          // Convert ticks to microseconds
          // Officially, you'd multiply by device.limits.timestampPeriod (if available)
          const gpuTimeNs = Number(endTime - startTime);
          const gpuTimeUs = gpuTimeNs / 1000;

          setLastSampleUs(gpuTimeUs);
          setTimeData(prev => [
            [INITIAL_TABLE[0][0], INITIAL_TABLE[0][1]],
            ...[...prev.slice(1), [frameIdxRef.current.toString(), gpuTimeUs.toFixed(2)]] // append new row
              .slice(-MAX_ROWS),
          ]);
        } catch (err) {
          console.error('Timestamp read error:', err);
          setErrorMessage('Unable to read GPU timestamps in this browser.');
        }
      }

      intervalId = setInterval(measureFrame, 1000);
    })();

    // Cleanup if the component unmounts
    return () => {
      stopRef.current = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
      resultsBuffer?.destroy();
      querySet?.destroy();
      device?.destroy();
    };
  }, []);

  const averageUs = useMemo(() => {
    const samples = timeData.slice(1).map(row => parseFloat(row[1]));
    if (!samples.length || samples.some((val) => Number.isNaN(val))) return null;
    const total = samples.reduce((acc, val) => acc + val, 0);
    return total / samples.length;
  }, [timeData]);

  const resetData = () => {
    frameIdxRef.current = 0;
    setTimeData(INITIAL_TABLE);
    setLastSampleUs(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1ch', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1ch', flexWrap: 'wrap' }}>
          <Badge>{isMonitoring ? 'Live' : 'Paused'}</Badge>
          <Text style={{ opacity: 0.85 }}>
            Last: {lastSampleUs !== null ? `${lastSampleUs.toFixed(2)} μs` : 'Waiting...'}
          </Text>
          <Text style={{ opacity: 0.85 }}>
            Avg: {averageUs !== null ? `${averageUs.toFixed(2)} μs` : '—'}
          </Text>
          <Text style={{ opacity: 0.85 }}>Samples: {timeData.length - 1}</Text>
        </div>
        <div style={{ display: 'flex', gap: '0.5ch', flexWrap: 'wrap' }}>
          <Button theme="SECONDARY" onClick={() => setIsMonitoring((prev) => !prev)}>
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
          <Button theme="SECONDARY" onClick={resetData}>Reset</Button>
        </div>
      </div>
      {errorMessage ? (
        <Text style={{ color: 'var(--theme-danger, #ff5a52)' }}>{errorMessage}</Text>
      ) : null}
      <div style={{ maxHeight: '240px', overflow: 'auto', border: '1px solid var(--theme-border, rgba(255,255,255,0.08))', borderRadius: '8px' }}>
        <DataTable data={timeData} />
      </div>
    </div>
  );
}
