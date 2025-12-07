import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutPlan } from "../types";

// Initialize with fallback to prevent white screen of death if key is missing
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const WORKOUT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    goal: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayName: { type: Type.STRING },
          focus: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.NUMBER },
                reps: { type: Type.STRING },
                notes: { type: Type.STRING }
              },
              required: ["name", "sets", "reps"]
            }
          }
        },
        required: ["dayName", "focus", "exercises"]
      }
    }
  },
  required: ["name", "goal", "days"]
};

export const generateWorkoutPlan = async (
  goal: string,
  level: string,
  daysPerWeek: number,
  limitations: string
): Promise<WorkoutPlan | null> => {
  if (!apiKey) {
    console.error("API Key não encontrada. Configure a variável de ambiente API_KEY.");
    return null;
  }
  try {
    const prompt = `Crie uma rotina de treino de musculação completa e estruturada.
    Objetivo: ${goal}.
    Nível de experiência: ${level}.
    Frequência: ${daysPerWeek} dias por semana.
    Limitações/Lesões: ${limitations || "Nenhuma"}.
    
    Retorne APENAS um objeto JSON válido seguindo a estrutura solicitada. Certifique-se de que o treino seja balanceado e adequado ao nível solicitado.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: WORKOUT_SCHEMA,
        temperature: 0.7
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return { ...data, id: crypto.randomUUID() };
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar treino:", error);
    throw error;
  }
};

export const getCoachAdvice = async (
  userMessage: string,
  contextData: string
): Promise<string> => {
  if (!apiKey) {
    return "Erro de configuração: Chave de API não encontrada. Por favor, configure a API Key no painel da Vercel.";
  }
  try {
    const systemInstruction = `Você é o TitanCoach, um personal trainer e nutricionista especialista.
    Seu tom é motivador, direto e baseado em ciência.
    Você tem acesso aos dados do usuário (contexto). Use-os para dar conselhos personalizados sobre treino, dieta e recuperação.
    Responda em português do Brasil.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Contexto do Usuário: ${contextData}\n\nPergunta do Usuário: ${userMessage}`,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "Desculpe, não consegui processar sua resposta agora.";
  } catch (error) {
    console.error("Erro no chat:", error);
    return "Ocorreu um erro ao conectar com seu treinador virtual.";
  }
};