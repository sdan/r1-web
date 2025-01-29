'use client';

import { useEffect, useState } from 'react';
import DataTable from '@components/DataTable';

// NOTE: This is an experimental approach. Not all browsers support pipeline statistics queries.
export default function GPUMonitor() {
  const [timeData, setTimeData] = useState<string[][]>([
    ['Query #', 'Time (μs)'],
    // Data rows populate here
  ]);

  useEffect(() => {
    if (!navigator.gpu) {
      console.error('WebGPU not supported in this browser');
      return;
    }

    let device: GPUDevice | undefined;
    let querySet: GPUQuerySet | undefined;
    let resultsBuffer: GPUBuffer | undefined;
    let frameIdx = 0;
    let stop = false;

    (async () => {
      // Request the adapter
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        console.error('No suitable GPU adapter found');
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
        console.warn('timestamp-query not supported on this device');
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
        if (stop || !device) return;
        frameIdx++;

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

          setTimeData(prev => [
            ...prev,
            [frameIdx.toString(), gpuTimeUs.toFixed(2)],
          ]);
        } catch (err) {
          console.error('Timestamp read error:', err);
        }
      }

      const intervalId = setInterval(measureFrame, 1000);

      // Cleanup
      return () => {
        stop = true;
        clearInterval(intervalId);
        resultsBuffer?.destroy();
        querySet?.destroy();
        device?.destroy();
      };
    })();

    // Cleanup if the component unmounts
    return () => {
      stop = true;
    };
  }, []);

  return <DataTable data={timeData} />;
} 