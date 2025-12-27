'use client';

import { useEffect, useRef } from 'react';

type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
  progress?: number;
  dependencies?: string;
};

export default function FrappeGantt() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gantt: any;

    (async () => {
      const mod = await import('frappe-gantt');
      const Gantt = (mod as any).default ?? (mod as any);

      if (!wrapperRef.current) return;

      const tasks: Task[] = [
        { id: '1', name: 'Task 1', start: '2025-12-01', end: '2025-12-05', progress: 20 },
        { id: '2', name: 'Task 2', start: '2025-12-06', end: '2025-12-10', progress: 50, dependencies: '1' },
      ];

      gantt = new Gantt(wrapperRef.current, tasks, {
        view_mode: 'Day',
      });
    })();

    return () => {
      // If the library exposes a destroy/cleanup method, call it here.
      // Some versions don't; then just let React unmount the wrapper.
      if (gantt?.destroy) gantt.destroy();
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Frappe Gantt</h1>
      <div ref={wrapperRef} />
    </div>
  );
}
