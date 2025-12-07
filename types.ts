export interface BodyMetric {
  id: string;
  date: string;
  weight: number; // kg
  muscleMass?: number; // % or kg
  bodyFat?: number; // %
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string;
  focus: string; // e.g., "Peito e Tríceps"
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  days: WorkoutDay[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  WORKOUTS = 'WORKOUTS',
  METRICS = 'METRICS',
  COACH = 'COACH'
}