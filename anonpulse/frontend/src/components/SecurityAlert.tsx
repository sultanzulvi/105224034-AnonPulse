import React from 'react';

interface SecurityAlertProps {
  title?: string;
  message: string;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({
  title = 'Protokol Keamanan & Kerahasiaan Identitas',
  message,
}) => {
  return (
    <div
      role="alert"
      className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-sm flex gap-3 text-left"
    >
      <span className="text-emerald-400 text-lg select-none">🛡️</span>
      <div className="flex-1">
        <h4 className="font-semibold text-emerald-300 mb-0.5">{title}</h4>
        <p className="text-xs text-emerald-200/90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};