import React, { useState } from 'react';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { SecurityAlert } from '../components/SecurityAlert';
import { ModalDialog } from '../components/ModalDialog';
import { validateNarrative, validateAttachment } from '../utils/validation';
import type { ReportTicket } from '../mocks/mockData';

interface ReportFormPageProps {
  onSuccess: () => void;
  onBack: () => void;
  onAddTicket: (ticket: ReportTicket) => void;
}

export const ReportFormPage: React.FC<ReportFormPageProps> = ({
  onSuccess,
  onBack,
  onAddTicket,
}) => {
  const [category, setCategory] = useState<ReportTicket['category']>('Perundungan (Bullying)');
  const [incidentDate, setIncidentDate] = useState('');
  const [narrative, setNarrative] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Status Validasi & UI State
  const [errors, setErrors] = useState<{ narrative?: string; file?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    const validation = validateAttachment(selectedFile);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, file: validation.message }));
      setFile(null);
    } else {
      setErrors((prev) => ({ ...prev, file: undefined }));
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const narrativeVal = validateNarrative(narrative);
    const fileVal = validateAttachment(file);

    if (!narrativeVal.isValid || !fileVal.isValid) {
      setErrors({
        narrative: narrativeVal.message,
        file: fileVal.message,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulasi pembangkitan token acak berformat CSPRNG
    setTimeout(() => {
      const randomHex = () => Math.random().toString(16).substring(2, 6).toUpperCase();
      const mockToken = `AP-${randomHex()}-${randomHex()}-${randomHex()}`;

      // Susun objek laporan baru
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

      const newTicket: ReportTicket = {
        token: mockToken,
        category: category,
        createdAt: formattedDate,
        status: 'Diajukan',
        summary: narrative,
        responseCount: 0,
      };

      // Simpan tiket baru ke state utama
      onAddTicket(newTicket);
      setGeneratedToken(mockToken);
      setIsSubmitting(false);
    }, 1200);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Formulir Aduan Anonim</h1>
        <p className="text-sm text-slate-400 mt-1">
          Lengkapi detail kejadian secara objektif. Identitas Anda tidak akan pernah terekam.
        </p>
      </div>

      <SecurityAlert
        title="Validasi Tanpa Jejak"
        message="Jangan memasukkan data pribadi Anda (seperti nama atau nomor kontak Anda) di dalam narasi kronologi untuk menjaga kerahasiaan penuh."
      />

      <form onSubmit={handleSubmit} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="report-category" className="text-sm font-medium text-slate-200">
            Kategori Pelanggaran <span className="text-rose-400">*</span>
          </label>
          <select
            id="report-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportTicket['category'])}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Kekerasan Seksual">Kekerasan Seksual</option>
            <option value="Perundungan (Bullying)">Perundungan (Bullying)</option>
            <option value="Pelecehan">Pelecehan / Tindak Asusila</option>
            <option value="Lainnya">Pelanggaran Etika & Lainnya</option>
          </select>
        </div>

        <InputField
          label="Perkiraan Waktu / Tanggal Kejadian"
          type="date"
          id="incident-date"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          helperText="Opsional: Membantu tim verifikator memetakan konteks kejadian."
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="narrative" className="text-sm font-medium text-slate-200">
              Narasi Kronologi Kejadian <span className="text-rose-400">*</span>
            </label>
            <span className={`text-xs ${narrative.trim().length < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {narrative.trim().length} / 50 min. karakter
            </span>
          </div>
          <textarea
            id="narrative"
            rows={5}
            value={narrative}
            onChange={(e) => {
              setNarrative(e.target.value);
              if (errors.narrative) {
                setErrors((prev) => ({ ...prev, narrative: undefined }));
              }
            }}
            placeholder="Jelaskan rangkaian kejadian secara rinci, lokasi, dan pihak terkait (minimal 50 karakter)..."
            aria-invalid={!!errors.narrative}
            aria-describedby={errors.narrative ? 'narrative-error' : undefined}
            className={`bg-slate-800 border rounded-lg p-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.narrative
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
            }`}
          />
          {errors.narrative && (
            <p id="narrative-error" className="text-xs text-rose-400 font-medium">
              {errors.narrative}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="attachment" className="text-sm font-medium text-slate-200">
            Unggah Berkas Bukti Lampiran
          </label>
          <input
            id="attachment"
            type="file"
            accept=".png, .jpg, .jpeg, .pdf"
            onChange={handleFileChange}
            aria-invalid={!!errors.file}
            aria-describedby={errors.file ? 'attachment-error' : 'attachment-help'}
            className="text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer"
          />
          <p id="attachment-help" className="text-xs text-slate-400">
            Maksimal 5 MB. Format didukung: PNG, JPG, PDF.
          </p>
          {errors.file && (
            <p id="attachment-error" className="text-xs text-rose-400 font-medium">
              {errors.file}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:flex-1 py-3 text-base"
          >
            Kirim Laporan Secara Rahasia
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="w-full sm:w-auto py-3 px-6"
          >
            Batal
          </Button>
        </div>
      </form>

      <ModalDialog
        isOpen={!!generatedToken}
        onClose={() => {
          setGeneratedToken(null);
          onSuccess();
        }}
        title="Laporan Anda Berhasil Diterima!"
        token={generatedToken || ''}
      >
        Laporan Anda telah berhasil dicatat dengan status <strong>Diajukan</strong>. Salin kode tiket di bawah ini untuk melihat progres tindak lanjut investigasi.
      </ModalDialog>
    </div>
  );
};