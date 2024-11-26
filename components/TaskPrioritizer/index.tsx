"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Sun, Moon } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { ClearTasksDialog } from './ClearTasksDialog';
import { Task } from './types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function TaskPrioritizer() {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [expandedTasks, setExpandedTasks] = useLocalStorage<number[]>('expandedTasks', []);
  const [newTask, setNewTask] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  const isDarkMode = theme === 'dark';

  const calculateScore = (urgent: boolean, important: boolean): number => {
    return (urgent ? 2 : 0) + (important ? 1 : 0);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        urgent: isUrgent,
        important: isImportant,
        score: calculateScore(isUrgent, isImportant),
        subtasks: [],
        completed: false
      };
      setTasks(prevTasks => [...prevTasks, task].sort((a, b) => b.score - a.score));
      setNewTask('');
      setIsUrgent(false);
      setIsImportant(false);
    }
  };

  const toggleTaskExpanded = (taskId: number) => {
    setExpandedTasks(prev => {
      const isExpanded = prev.includes(taskId);
      return isExpanded 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const clearAllTasks = () => {
    setTasks([]);
    setExpandedTasks([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-normal">Priorizador de Tarefas</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className={`p-2 ${isDarkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-800'}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {tasks.length > 0 && (
              <ClearTasksDialog isDarkMode={isDarkMode} onClear={clearAllTasks} />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nova tarefa..."
              className={`w-full border-0 ${isDarkMode ? 'bg-neutral-800 placeholder-neutral-500' : 'bg-neutral-100 placeholder-neutral-400'}`}
            />
            
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="urgent"
                  checked={isUrgent}
                  onCheckedChange={(checked) => setIsUrgent(checked as boolean)}
                  className="border-neutral-400"
                />
                <label htmlFor="urgent" className="text-sm">Urgente</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="important"
                  checked={isImportant}
                  onCheckedChange={(checked) => setIsImportant(checked as boolean)}
                  className="border-neutral-400"
                />
                <label htmlFor="important" className="text-sm">Importante</label>
              </div>
              <button 
                onClick={addTask}
                className={`ml-auto text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Adicionar
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {tasks.length === 0 ? (
              <p className={`text-center py-8 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Nenhuma tarefa adicionada ainda.
              </p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isDarkMode={isDarkMode}
                  isExpanded={expandedTasks.includes(task.id)}
                  onToggleExpand={() => toggleTaskExpanded(task.id)}
                  onToggleComplete={(checked) => {
                    setTasks(prevTasks => prevTasks.map(t => {
                      if (t.id === task.id) {
                        return {
                          ...t,
                          completed: checked,
                          subtasks: t.subtasks.map(st => ({
                            ...st,
                            completed: checked
                          }))
                        };
                      }
                      return t;
                    }));
                  }}
                  onRemove={() => setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id))}
                  onAddSubtask={(text) => {
                    setTasks(prevTasks => prevTasks.map(t => {
                      if (t.id === task.id) {
                        return {
                          ...t,
                          subtasks: [...t.subtasks, {
                            id: Date.now(),
                            text,
                            completed: false
                          }]
                        };
                      }
                      return t;
                    }));
                  }}
                  onToggleSubtaskComplete={(subtaskId) => {
                    setTasks(prevTasks => prevTasks.map(t => {
                      if (t.id === task.id) {
                        const updatedSubtasks = t.subtasks.map(st => {
                          if (st.id === subtaskId) {
                            return { ...st, completed: !st.completed };
                          }
                          return st;
                        });
                        return {
                          ...t,
                          subtasks: updatedSubtasks,
                          completed: updatedSubtasks.every(st => st.completed)
                        };
                      }
                      return t;
                    }));
                  }}
                  onRemoveSubtask={(subtaskId) => {
                    setTasks(prevTasks => prevTasks.map(t => {
                      if (t.id === task.id) {
                        return {
                          ...t,
                          subtasks: t.subtasks.filter(st => st.id !== subtaskId)
                        };
                      }
                      return t;
                    }));
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}