import React, { useState } from 'react';
import { WorkoutPlan } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { Dumbbell, Calendar, Info, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface WorkoutTrackerProps {
  currentPlan: WorkoutPlan | null;
  onSetPlan: (plan: WorkoutPlan) => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ currentPlan, onSetPlan }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [goal, setGoal] = useState('Hipertrofia');
  const [level, setLevel] = useState('Intermediário');
  const [days, setDays] = useState(4);
  const [limitations, setLimitations] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const plan = await generateWorkoutPlan(goal, level, days, limitations);
      if (plan) {
        onSetPlan(plan);
      } else {
        setError("Não foi possível gerar o treino. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao conectar com a IA. Verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Generator Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={150} textAnchor="start" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center z-10 relative">
          <Sparkles className="mr-2 text-purple-400" /> Gerador de Treino IA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 z-10 relative">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Objetivo</label>
            <select 
              value={goal} onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option>Hipertrofia (Ganho de Massa)</option>
              <option>Emagrecimento</option>
              <option>Força Pura</option>
              <option>Resistência Muscular</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Nível</label>
            <select 
              value={level} onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option>Iniciante</option>
              <option>Intermediário</option>
              <option>Avançado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Dias / Semana</label>
            <select 
              value={days} onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value={2}>2 Dias</option>
              <option value={3}>3 Dias</option>
              <option value={4}>4 Dias</option>
              <option value={5}>5 Dias</option>
              <option value={6}>6 Dias</option>
            </select>
          </div>
          <div>
             <label className="block text-sm text-slate-400 mb-1">Limitações (Opcional)</label>
             <input 
              type="text" 
              placeholder="Ex: Joelho, Ombro..." 
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
             />
          </div>
        </div>
        
        {error && (
            <div className="mt-4 p-3 bg-red-500/20 text-red-200 rounded-lg flex items-center text-sm">
                <AlertCircle size={16} className="mr-2" /> {error}
            </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mt-6 w-full md:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center z-10 relative"
        >
          {isGenerating ? <><Loader2 className="animate-spin mr-2" /> Gerando Treino...</> : 'Criar Nova Rotina'}
        </button>
      </div>

      {/* Plan Display */}
      {currentPlan ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold text-white">{currentPlan.name}</h2>
                <p className="text-slate-400">Foco: {currentPlan.goal}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentPlan.days.map((day, index) => (
              <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-white flex items-center">
                    <Calendar className="mr-2 text-blue-500" size={18} /> {day.dayName}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                    {day.focus}
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {day.exercises.map((exercise, idx) => (
                      <li key={idx} className="bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-200">{exercise.name}</h4>
                            {exercise.notes && <p className="text-xs text-slate-500 mt-1 flex items-center"><Info size={12} className="mr-1"/> {exercise.notes}</p>}
                          </div>
                          <div className="text-right">
                            <span className="block font-mono text-blue-400 font-bold">{exercise.sets} x {exercise.reps}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-xl">
          <Dumbbell size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-400">Nenhum treino ativo</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Use o gerador de IA acima para criar uma rotina personalizada baseada nos seus objetivos.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;