import React, { useState } from 'react';
import { Button } from './Button';

interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  token?: string;
  children?: React.ReactNode;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  isOpen,
  onClose,
  title,
  token,
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setIsCopied(true);
      // Notifikasi menghilang otomatis setelah 3 detik
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      >
        <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-left">
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          {children && <div className="text-sm text-slate-300 mb-4">{children}</div>}

          {token && (
            <div className="my-4 p-4 rounded-lg bg-slate-800 border border-emerald-500/30">
              <p className="text-xs text-slate-400 mb-1 font-medium">
                Anon Token Anda (Simpan secara rahasia):
              </p>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded border border-slate-700">
                <code className="text-emerald-400 font-mono font-bold tracking-wider">
                  {token}
                </code>
                <button
                  type="button"
                  onClick={copyToken}
                  className={`text-xs px-2.5 py-1 rounded transition font-medium ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isCopied ? 'Tersalin! ✓' : 'Salin'}
                </button>
              </div>
              <p className="text-[11px] text-amber-400/90 mt-2">
                ⚠️ Peringatan: Token ini adalah satu-satunya bukti klaim tiket aduan Anda. Sistem tidak menyimpan email atau identitas Anda.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="primary" onClick={onClose}>
              Saya Sudah Menyimpan Token
            </Button>
          </div>
        </div>
      </div>

      {/* Pemberitahuan Melayang (Toast Notification) di Pojok Kanan Bawah */}
      {isCopied && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-2xl border border-emerald-400/40 animate-bounce"
        >
          <span>✓</span>
          <span>Anon Token berhasil disalin ke papan klip!</span>
        </div>
      )}
    </>
  );
};