'use client';

import React, { useRef, useState, useEffect } from 'react';
import DataTable from '@components/DataTable';

export default function TPSCycleTable({ tpsValue }: { tpsValue?: number }) {
  // We keep only 3 rows in the table, but we let the step counter grow unbounded
  const [tableData, setTableData] = useState([
    ['Step', 'TPS'],
    ['1', '0.00'],
    ['2', '0.00'],
    ['3', '0.00'],
  ]);

  // This increments with each TPS update, so the "Step" column shows the real step count
  const stepCountRef = useRef(1);

  useEffect(() => {
    if (typeof tpsValue === 'number') {
      setTableData((prev) => {
        const newData = [...prev];

        // We only cycle storage rows 1..3, but the step text is the full, infinite count
        const rowIndex = ((stepCountRef.current - 1) % 3) + 1;

        newData[rowIndex] = [
          stepCountRef.current.toString(),
          tpsValue.toFixed(2),
        ];

        stepCountRef.current += 1;
        return newData;
      });
    }
  }, [tpsValue]);

  return <DataTable data={tableData} />;
} 