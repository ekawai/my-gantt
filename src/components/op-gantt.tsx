'use client';

import { useEffect, useRef, useState } from 'react';
import gantt from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import jaLocale from '@/locales/ja'; 

const ganttAny = gantt as any;

export default function OpGantt() {
  const ganttRef = useRef<HTMLDivElement>(null);

  const [density, setDensity] = useState<'compact' | 'normal' | 'large'>(
    'normal'
  );

  // ---- Apply density ----
  const applyDensity = () => {
    if (density === 'compact') {
      ganttAny.config.row_height = 32;
      ganttAny.config.bar_height = 18;
    }
    if (density === 'normal') {
      ganttAny.config.row_height = 42;
      ganttAny.config.bar_height = 24;
    }
    if (density === 'large') {
      ganttAny.config.row_height = 56;
      ganttAny.config.bar_height = 32;
    }
    ganttAny.setSizes(); // 👈 recalc layout
  };

  useEffect(() => {
    ganttAny.config.xml_date = '%Y-%m-%d';
    ganttAny.config.fit_tasks = true;
    ganttAny.locale = jaLocale;

    ganttAny.config.locale = 'ja';
    ganttAny.config.xml_date = '%Y-%m-%d';
    ganttAny.config.row_height = 42;
    ganttAny.config.bar_height = 24;

    // ✅ ENABLE ZOOM EXTENSION
    ganttAny.ext.zoom.init({
      levels: [
        {
          name: 'day',
          scale_height: 27,
          min_column_width: 80,
          scales: [{ unit: 'day', step: 1, format: '%d %M' }],
        },
        {
          name: 'week',
          scale_height: 50,
          min_column_width: 50,
          scales: [
            {
              unit: 'week',
              step: 1,
              format: (date: Date) => {
                const end = ganttAny.date.add(date, 6, 'day');
                return (
                  ganttAny.date.date_to_str('%d %M')(date) +
                  ' - ' +
                  ganttAny.date.date_to_str('%d %M')(end)
                );
              },
            },
            { unit: 'day', step: 1, format: '%j %D' },
          ],
        },
        {
          name: 'month',
          scale_height: 50,
          min_column_width: 50,
          scales: [{ unit: 'month', step: 1, format: '%F %Y' }],
        },
      ],
    });

    ganttAny.init(ganttRef.current!);

    ganttAny.parse({
      data: [
        { id: 1, text: 'Task 1', start_date: '2025-12-01', duration: 5 },
        { id: 2, text: 'Task 2', start_date: '2025-12-06', duration: 4 },
        { id: 3, text: 'Task 3', start_date: '2025-12-11', duration: 6 },
        { id: 4, text: 'Task 4', start_date: '2025-12-18', duration: 3 },
      ],
    });

    applyDensity();

    return () => {
      ganttAny.clearAll();
    };
  }, []);

  // Re-apply when density changes
  useEffect(() => {
    applyDensity();
  }, [density]);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>
        Gantt (dhtmlx)
      </h1>

      {/* ---- Controls ---- */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
        {/* Zoom */}
        <button onClick={() => ganttAny.ext.zoom.zoomIn()}>Zoom +</button>
        <button onClick={() => ganttAny.ext.zoom.zoomOut()}>Zoom -</button>

        {/* Density */}
        <button onClick={() => setDensity('compact')}>Compact</button>
        <button onClick={() => setDensity('normal')}>Normal</button>
        <button onClick={() => setDensity('large')}>Large</button>
      </div>

      {/* ---- Gantt viewport ---- */}
      <div
        ref={ganttRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 180px)',
          border: '1px solid #ddd',
        }}
      />
    </div>
  );
}
