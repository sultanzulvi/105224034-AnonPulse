import React, { useState } from 'react';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { StatusBadge, type TicketStatus } from '../components/StatusBadge';
import type { ReportTicket } from '../mocks/mockData';

interface TicketTrackerPageProps {
  onBack: () => void;
  tickets: Record<string, ReportTicket>;
}

export const TicketTrackerPage: React.FC<TicketTrackerPageProps> = ({ onBack, tickets }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [ticketData, setTicketData] = useState<ReportTicket | null>(null);
  const [errorSearch, setErrorSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();

    if (!cleanToken) {
      setErrorSearch('Silakan masukkan Anon Token Anda.');
      setTicketData(null);
      return;
    }

    setHasSearched(true);
    setErrorSearch('');

    // Periksa tiket pada daftar dinamis (termasuk tiket yang baru saja dibuat)
    if (tickets[cleanToken]) {
      setTicketData(tickets[cleanToken]);
    } else {
      setTicketData(null);
      setErrorSearch('Tiket tidak ditemukan. Periksa kembali kombinasi Anon Token Anda.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-left space-y-6 py-2">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
      >
        ← Kembali ke Beranda
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Pelacakan Status Tiket</h1>
        <p className="text-sm text-slate-400 mt-1">
          Pantau progres tindak lanjut aduan secara anonim tanpa login akun.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 space-y-4">
        <InputField
          label="Masukkan Anon Token"
          id="anon-token-search"
          placeholder="Contoh: AP-8F92-K10A-B7F3"
          value={tokenInput}
          onChange={(e) => {
            setTokenInput(e.target.value);
            if (errorSearch) setErrorSearch('');
          }}
          error={errorSearch}
          helperText="Token 16-karakter acak yang Anda dapatkan saat mengirimkan laporan."
        />

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Lacak Aduan
          </Button>
          <button
            type="button"
            onClick={() => {
              setTokenInput('AP-8F92-K10A-B7F3');
              setErrorSearch('');
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline text-left sm:self-center px-1 py-1"
          >
            Coba gunakan contoh token mock
          </button>
        </div>
      </form>

      {ticketData && (
        <section className="bg-slate-800/90 border border-emerald-500/40 rounded-xl p-6 space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-4">
            <div>
              <p className="text-xs text-slate-400">Kode Tiket</p>
              <h2 className="text-lg font-mono font-bold text-white">{ticketData.token}</h2>
            </div>
            <div>
              <StatusBadge status={ticketData.status as TicketStatus} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Kategori Pelanggaran:</span>
              <span className="text-white font-medium text-sm">{ticketData.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Waktu Pengajuan:</span>
              <span className="text-white font-medium text-sm">{ticketData.createdAt}</span>
            </div>
          </div>

          <div className="pt-2 text-xs">
            <span className="text-slate-400 block mb-1">Ringkasan Laporan:</span>
            <p className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 text-slate-300 leading-relaxed whitespace-pre-wrap">
              {ticketData.summary}
            </p>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-300">Respon Satgas Investigator:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
              {ticketData.responseCount} Pesan Baru
            </span>
          </div>
        </section>
      )}

      {hasSearched && !ticketData && !errorSearch && (
        <div className="p-8 text-center bg-slate-800/40 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">Tidak ada data tiket yang cocok.</p>
        </div>
      )}
    </div>
  );
};