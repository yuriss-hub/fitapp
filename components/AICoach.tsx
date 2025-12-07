import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, BodyMetric, WorkoutPlan } from '../types';
import { getCoachAdvice } from '../services/geminiService';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface AICoachProps {
  metrics: BodyMetric[];
  currentPlan: WorkoutPlan | null;
}

const AICoach: React.FC<AICoachProps> = ({ metrics, currentPlan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o TitanCoach. Posso analisar seus dados de treino e peso, ou tirar dúvidas sobre dieta e execução de exercícios. Como posso ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
    const contextData = JSON.stringify({
      currentWorkout: currentPlan ? currentPlan.name : "Sem treino definido",
      latestStats: latestMetric ? {
        weight: latestMetric.weight,
        fat: latestMetric.bodyFat,
        muscle: latestMetric.muscleMass
      } : "Sem dados de medição",
      goals: currentPlan ? currentPlan.goal : "Não especificado"
    });

    try {
      const responseText = await getCoachAdvice(userMsg.text, contextData);
      
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Error handling handled visually by lack of response or retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-3">
            <Bot size={20} className="text-white" />
        </div>
        <div>
            <h3 className="font-bold text-white">TitanCoach AI</h3>
            <p className="text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span> Online
            </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-100 rounded-bl-none'
            }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                <span className="text-[10px] opacity-50 mt-2 block text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-slate-700 rounded-2xl rounded-bl-none p-4 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre sua dieta, treino ou progresso..."
            className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-full px-5 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white p-3 rounded-full transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AICoach;