'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { filteredEmissionsAtom } from '@/store/atoms';

const EmissionsChart: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { month: string; total: number }>();

    emissions.forEach(emission => {
      const key = emission.yearMonth;
      if (!dataMap.has(key)) {
        dataMap.set(key, { month: key, total: 0 });
      }
      const data = dataMap.get(key)!;
      data.total += emission.emissions;
    });

    return Array.from(dataMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [emissions]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '400px'
    }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '700' }}>
        월별 배출량 추이
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsChart;