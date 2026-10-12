export interface ReportTicket {
  token: string;
  category: 'Kekerasan Seksual' | 'Perundungan (Bullying)' | 'Pelecehan' | 'Lainnya';
  createdAt: string;
  status: 'Diajukan' | 'Triase' | 'Diinvestigasi' | 'Selesai';
  summary: string;
  responseCount: number;
}

export const MOCK_TICKETS: Record<string, ReportTicket> = {
  'AP-8F92-K10A-B7F3': {
    token: 'AP-8F92-K10A-B7F3',
    category: 'Perundungan (Bullying)',
    createdAt: '2026-10-10 14:20 WIB',
    status: 'Diinvestigasi',
    summary: 'Laporan perundungan verbal di lingkungan laboratorium komputer.',
    responseCount: 2,
  },
  'AP-4B11-9C2D-E8A0': {
    token: 'AP-4B11-9C2D-E8A0',
    category: 'Pelecehan',
    createdAt: '2026-10-11 09:15 WIB',
    status: 'Triase',
    summary: 'Pengaduan dugaan pelecehan melalui pesan media sosial organisasi.',
    responseCount: 0,
  },
};