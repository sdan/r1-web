'use client';

import DataTable from '@components/DataTable';

export default function TPSDataTable({ data }: { data: string[][] }) {
  return (
    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
      <DataTable data={data} />
    </div>
  );
} 