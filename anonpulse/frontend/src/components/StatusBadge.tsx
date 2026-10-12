import React from 'react';

export type TicketStatus = 'Diajukan' | 'Triase' | 'Diinvestigasi' | 'Selesai';

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<TicketStatus, string> = {
    Diajukan: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    Triase: 'bg-blue-950/60 text-blue-300 border-blue-800/80',
    Diinvestigasi: 'bg-purple-950/60 text-purple-300 border-purple-800/80',
    Selesai: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};