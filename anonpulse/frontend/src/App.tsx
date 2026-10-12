import { useState } from 'react';
import { Button } from './components/Button';
import { LandingPage } from './pages/LandingPage';
import { ReportFormPage } from './pages/ReportFormPage';
import { TicketTrackerPage } from './pages/TicketTrackerPage';
import { MOCK_TICKETS, type ReportTicket } from './mocks/mockData';

type Page = 'landing' | 'report' | 'tracker';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  // Menggabungkan mock data awal dengan tiket yang disimpan di memori peramban
  const [tickets, setTickets] = useState<Record<string, ReportTicket>>(() => {
    const saved = localStorage.getItem('anonpulse_tickets');
    if (saved) {
      try {
        return { ...MOCK_TICKETS, ...JSON.parse(saved) };
      } catch {
        return MOCK_TICKETS;
      }
    }
    return MOCK_TICKETS;
  });

  // Fungsi menyimpan laporan baru
  const handleAddTicket = (newTicket: ReportTicket) => {
    setTickets((prev) => {
      const updated = { [newTicket.token]: newTicket, ...prev };
      localStorage.setItem('anonpulse_tickets', JSON.stringify(updated));
      return updated;
    });
  };

  // Fitur Darurat: Panic Button
  const handleEmergencyPanic = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace('https://sso.universitaspertamina.ac.id/home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg group-hover:scale-105 transition">
              A
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">AnonPulse</span>
              <span className="text-[10px] text-emerald-400 font-mono block -mt-1 font-semibold">v0.1</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage('landing')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                  currentPage === 'landing' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Beranda
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('report')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                  currentPage === 'report' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Buat Aduan
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('tracker')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                  currentPage === 'tracker' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lacak Tiket
              </button>
            </nav>

            <Button
              variant="panic"
              onClick={handleEmergencyPanic}
              title="Keluar seketika dan buka portal SSO"
              className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider"
            >
              🚨 Panic!
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentPage === 'landing' && <LandingPage onNavigate={(page) => setCurrentPage(page)} />}
        {currentPage === 'report' && (
          <ReportFormPage
            onSuccess={() => setCurrentPage('tracker')}
            onBack={() => setCurrentPage('landing')}
            onAddTicket={handleAddTicket}
          />
        )}
        {currentPage === 'tracker' && (
          <TicketTrackerPage
            onBack={() => setCurrentPage('landing')}
            tickets={tickets}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 AnonPulse • Platform Whistleblowing Kampus Terintegrasi</p>
          <p className="text-slate-400 font-mono">Milestone v0.1 • Ilmu Komputer</p>
        </div>
      </footer>
    </div>
  );
}

export default App;