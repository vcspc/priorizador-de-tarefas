export interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  text: string;
  urgent: boolean;
  important: boolean;
  score: number;
  subtasks: Subtask[];
  completed: boolean;
}