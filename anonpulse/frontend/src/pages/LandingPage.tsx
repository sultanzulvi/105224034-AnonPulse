import React from 'react';
import { Button } from '../components/Button';
import { SecurityAlert } from '../components/SecurityAlert';

interface LandingPageProps {
  onNavigate: (page: 'report' | 'tracker') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto text-left py-4">
      {/* Banner Peringatan Privasi */}
      <SecurityAlert
        title="Protokol Keamanan & Kerahasiaan Kampus"
        message="AnonPulse tidak mencatat alamat IP, lokasi, atau identitas perangkat Anda. Untuk keamanan maksimal, disarankan mengakses portal ini menggunakan mode Penyamaran (Incognito / InPrivate)."
      />

      {/* Bagian Hero */}
      <section className="text-center space-y-4 py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Kerahasiaan Terjamin 100% Bebas Jejak
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Suarakan Kebenaran <br />
          <span className="text-emerald-400">Tanpa Rasa Takut & Tanpa Identitas</span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Ruang aman bagi sivitas akademika untuk melaporkan perundungan (bullying), pelecehan seksual, dan pelanggaran integritas lainnya. Laporan Anda diproses secara independen dan rahasia.
        </p>
        
        {/* Opsi Tindakan */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => onNavigate('report')}
            className="w-full sm:w-auto text-base px-6 py-3"
          >
            Buat Aduan Anonim Baru
          </Button>
          <Button
            variant="secondary"
            onClick={() => onNavigate('tracker')}
            className="w-full sm:w-auto text-base px-6 py-3"
          >
            Lacak Status Tiket Saya
          </Button>
        </div>
      </section>

      {/* Tiga Pilar Hak Pelapor & Jaminan Keamanan */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-2">
          <div className="text-2xl">🔒</div>
          <h2 className="text-lg font-semibold text-white">Tanpa Akun & Identitas</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tidak memerlukan login nama, email, maupun NIM. Seluruh jejak koneksi Anda dilepaskan sebelum laporan diproses.
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-2">
          <div className="text-2xl">🔑</div>
          <h2 className="text-lg font-semibold text-white">Klaim Anon Token</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Setiap aduan menghasilkan satu Anon Token acak berkeamanan tinggi sebagai satu-satunya kunci untuk memantau perkembangan kasus.
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-2">
          <div className="text-2xl">🛡️</div>
          <h2 className="text-lg font-semibold text-white">Integritas Bukti Digital</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Berkas bukti diproteksi digest kriptografi SHA-256 dan metadata kamera/lokasi (EXIF) dihapus seketika.
          </p>
        </div>
      </section>
    </div>
  );
};