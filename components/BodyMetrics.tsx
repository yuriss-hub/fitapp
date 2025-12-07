import React, { useState } from 'react';
import { BodyMetric } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BodyMetricsProps {
  metrics: BodyMetric[];
  onAddMetric: (metric: BodyMetric) => void;
  onDeleteMetric: (id: string) => void;
}

const BodyMetrics: React.FC<BodyMetricsProps> = ({ metrics, onAddMetric, onDeleteMetric }) => {
  const [weight, setWeight] = useState('');
  const [muscle, setMuscle] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const newMetric: BodyMetric = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      muscleMass: muscle ? parseFloat(muscle) : undefined,
      bodyFat: fat ? parseFloat(fat) : undefined,
    };

    onAddMetric(newMetric);
    setWeight('');
    setMuscle('');
    setFat('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-fit">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Plus className="mr-2 text-blue-500" /> Nova Medição
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Peso (kg) *</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: 75.5"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Gordura (%)</label>
              <input
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ex: 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Massa Magra (kg)</label>
              <input
                type="number"
                step="0.1"
                value={muscle}
                onChange={(e) => setMuscle(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ex: 35"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Registrar Progresso
          </button>
        </form>
      </div>

      {/* Composition Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Composição Corporal</h3>
        <div className="h-[300px]">
          {metrics.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
             <LineChart data={metrics}>
               <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
               <XAxis 
                 dataKey="date" 
                 stroke="#94a3b8" 
                 tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
               />
               <YAxis yAxisId="left" stroke="#ef4444" domain={[0, 40]} />
               <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 100]} />
               <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
               <Legend />
               <Line yAxisId="left" type="monotone" dataKey="bodyFat" name="Gordura %" stroke="#ef4444" strokeWidth={2} />
               <Line yAxisId="right" type="monotone" dataKey="muscleMass" name="Massa Magra (kg)" stroke="#10b981" strokeWidth={2} />
             </LineChart>
           </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Sem dados suficientes.
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="col-span-1 lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Histórico</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Peso</th>
                <th className="px-6 py-4">Gordura</th>
                <th className="px-6 py-4">Massa Magra</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {metrics.slice().reverse().map((metric) => (
                <tr key={metric.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {new Date(metric.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">{metric.weight} kg</td>
                  <td className="px-6 py-4">{metric.bodyFat ? `${metric.bodyFat}%` : '-'}</td>
                  <td className="px-6 py-4">{metric.muscleMass ? `${metric.muscleMass} kg` : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDeleteMetric(metric.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {metrics.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BodyMetrics;