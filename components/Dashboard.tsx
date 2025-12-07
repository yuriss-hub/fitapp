import React from 'react';
import { BodyMetric, WorkoutPlan } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Dumbbell, Activity } from 'lucide-react';

interface DashboardProps {
  metrics: BodyMetric[];
  currentPlan: WorkoutPlan | null;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, currentPlan }) => {
  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const previousMetric = metrics.length > 1 ? metrics[metrics.length - 2] : null;

  const calculateChange = (current: number, prev: number) => {
    const diff = current - prev;
    return {
      value: Math.abs(diff).toFixed(1),
      direction: diff >= 0 ? 'up' : 'down'
    };
  };

  const weightChange = (latestMetric && previousMetric) 
    ? calculateChange(latestMetric.weight, previousMetric.weight) 
    : { value: '0.0', direction: 'flat' };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Visão Geral</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Peso Atual</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {latestMetric ? `${latestMetric.weight} kg` : '--'}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${weightChange.direction === 'down' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <Activity size={24} />
            </div>
          </div>
          {latestMetric && previousMetric && (
            <div className="flex items-center text-sm">
              {weightChange.direction === 'up' ? <TrendingUp size={16} className="mr-1 text-red-400" /> : <TrendingDown size={16} className="mr-1 text-green-400" />}
              <span className={weightChange.direction === 'up' ? 'text-red-400' : 'text-green-400'}>
                {weightChange.value} kg
              </span>
              <span className="text-slate-500 ml-2">desde a última pesagem</span>
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Gordura Corporal</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {latestMetric?.bodyFat ? `${latestMetric.bodyFat}%` : '--'}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-sm text-slate-500">Mantenha o foco na dieta!</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-medium">Treino Ativo</p>
              <h3 className="text-xl font-bold text-white mt-1 truncate max-w-[200px]">
                {currentPlan ? currentPlan.name : 'Nenhum'}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Dumbbell size={24} />
            </div>
          </div>
          <p className="text-sm text-slate-500">
            {currentPlan ? `${currentPlan.days.length} dias por semana` : 'Crie um treino agora'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6">Evolução de Peso</h3>
        <div className="h-[300px] w-full">
          {metrics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="#94a3b8" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 8 }}
                  name="Peso (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Nenhum dado registrado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;