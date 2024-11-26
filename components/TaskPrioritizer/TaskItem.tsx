"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { SubtaskList } from './SubtaskList';
import { Task } from './types';

interface TaskItemProps {
  task: Task;
  isDarkMode: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onToggleComplete: (checked: boolean) => void;
  onRemove: () => void;
  onAddSubtask: (text: string) => void;
  onToggleSubtaskComplete: (subtaskId: number) => void;
  onRemoveSubtask: (subtaskId: number) => void;
}

export function TaskItem({
  task,
  isDarkMode,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onRemove,
  onAddSubtask,
  onToggleSubtaskComplete,
  onRemoveSubtask
}: TaskItemProps) {
  const getBackgroundColor = (urgent: boolean, important: boolean): string => {
    if (urgent && important) return 'border-l-4 border-l-red-500';
    if (urgent && !important) return 'border-l-4 border-l-orange-500';
    if (!urgent && important) return 'border-l-4 border-l-yellow-500';
    return 'border-l-4 border-l-green-500';
  };

  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 px-3 py-2 ${getBackgroundColor(task.urgent, task.important)} ${
          isDarkMode ? 'bg-neutral-800' : 'bg-white'
        }`}
      >
        <button
          onClick={() => onToggleExpand(task.id)}
          className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggleComplete(checked as boolean)}
          className="border-neutral-400"
        />
        
        <span className={`flex-grow ${task.completed ? 'line-through text-neutral-500' : ''}`}>
          {task.text}
        </span>
        
        <button
          onClick={onRemove}
          className={`${isDarkMode ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      {isExpanded && (
        <SubtaskList
          taskId={task.id}
          subtasks={task.subtasks}
          isDarkMode={isDarkMode}
          onAdd={onAddSubtask}
          onToggleComplete={onToggleSubtaskComplete}
          onRemove={onRemoveSubtask}
        />
      )}
    </div>
  );
}