"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { Subtask } from './types';

interface SubtaskListProps {
  taskId: number;
  subtasks: Subtask[];
  isDarkMode: boolean;
  onAdd: (text: string) => void;
  onToggleComplete: (subtaskId: number) => void;
  onRemove: (subtaskId: number) => void;
}

export function SubtaskList({
  subtasks,
  isDarkMode,
  onAdd,
  onToggleComplete,
  onRemove
}: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAdd(newSubtask);
      setNewSubtask('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    }
  };

  return (
    <div className="pl-8 space-y-1">
      <div className="flex gap-2">
        <Input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nova subtarefa..."
          className={`flex-grow border-0 text-sm ${
            isDarkMode ? 'bg-neutral-800 placeholder-neutral-500' : 'bg-neutral-100 placeholder-neutral-400'
          }`}
        />
        <button 
          onClick={handleAddSubtask}
          className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          Adicionar
        </button>
      </div>
      
      {subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className={`flex items-center gap-2 px-3 py-2 ${
            isDarkMode ? 'bg-neutral-800' : 'bg-white'
          }`}
        >
          <div className="w-4" />
          <Checkbox
            checked={subtask.completed}
            onCheckedChange={() => onToggleComplete(subtask.id)}
            className="border-neutral-400"
          />
          <span className={`flex-grow text-sm ${subtask.completed ? 'line-through text-neutral-500' : ''}`}>
            {subtask.text}
          </span>
          <button
            onClick={() => onRemove(subtask.id)}
            className={`${isDarkMode ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}