import React, { useState } from 'react';
import { LayoutDashboard, Dumbbell, Activity, MessageSquare, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import BodyMetrics from './components/BodyMetrics';
import WorkoutTracker from './components/WorkoutTracker';
import AICoach from './components/AICoach';
import { BodyMetric, WorkoutPlan, AppView } from './types';

// Mock Data for initial state
const INITIAL_METRICS: BodyMetric[] = [
  { id: '1', date: '2023-10-01', weight: 80.5, muscleMass: 38.0, bodyFat: 20.0 },
  { id: '2', date: '2023-10-15', weight: 79.8, muscleMass: 38.2, bodyFat: 19.5 },
  { id: '3', date: '2023-11-01', weight: 79.0, muscleMass: 38.5, bodyFat: 18.8 },
  { id: '4', date: '2023-11-15', weight: 78.5, muscleMass: 38.8, bodyFat: 18.2 },
];

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [metrics, setMetrics] = useState<BodyMetric[]>(INITIAL_METRICS);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddMetric = (metric: BodyMetric) => {
    setMetrics([...metrics, metric].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-6 py-4 transition-colors ${
        currentView === view
          ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-500'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 w-64 h-full bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            TitanFit AI
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6 space-y-1">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={AppView.WORKOUTS} icon={Dumbbell} label="Meus Treinos" />
          <NavItem view={AppView.METRICS} icon={Activity} label="Medidas & Peso" />
          <NavItem view={AppView.COACH} icon={MessageSquare} label="AI Coach" />
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
              US
            </div>
            <div>
              <p className="text-sm font-medium text-white">Usuário Demo</p>
              <p className="text-xs text-slate-500">Membro Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300">
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">TitanFit AI</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            {currentView === AppView.DASHBOARD && (
              <Dashboard metrics={metrics} currentPlan={currentPlan} />
            )}
            
            {currentView === AppView.METRICS && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-6">Acompanhamento Corporal</h2>
                <BodyMetrics 
                  metrics={metrics} 
                  onAddMetric={handleAddMetric} 
                  onDeleteMetric={handleDeleteMetric} 
                />
              </div>
            )}

            {currentView === AppView.WORKOUTS && (
               <div className="animate-fade-in">
                 <WorkoutTracker currentPlan={currentPlan} onSetPlan={setCurrentPlan} />
               </div>
            )}

            {currentView === AppView.COACH && (
              <div className="animate-fade-in h-full">
                <h2 className="text-3xl font-bold text-white mb-6">Seu Treinador Virtual</h2>
                <AICoach metrics={metrics} currentPlan={currentPlan} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;