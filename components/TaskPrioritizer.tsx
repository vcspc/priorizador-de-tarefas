"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sun, Moon, ChevronDown, ChevronRight } from 'lucide-react';

interface Subtask {
  id: number;
  text: string;
  completed: boolean;
}

interface Task {
  id: number;
  text: string;
  urgent: boolean;
  important: boolean;
  score: number;
  subtasks: Subtask[];
  completed: boolean;
}

export default function TaskPrioritizer() {
  const { theme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

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

  const addSubtask = (taskId: number) => {
    if (newSubtask.trim()) {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...task.subtasks, {
              id: Date.now(),
              text: newSubtask,
              completed: false
            }]
          };
        }
        return task;
      }));
      setNewSubtask('');
    }
  };

  const toggleTaskExpanded = (taskId: number) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleSubtaskComplete = (taskId: number, subtaskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask => {
          if (subtask.id === subtaskId) {
            return { ...subtask, completed: !subtask.completed };
          }
          return subtask;
        });
        
        const allSubtasksComplete = updatedSubtasks.every(subtask => subtask.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allSubtasksComplete
        };
      }
      return task;
    }));
  };

  const removeTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const removeSubtask = (taskId: number, subtaskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
        };
      }
      return task;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleSubtaskKeyPress = (e: React.KeyboardEvent, taskId: number) => {
    if (e.key === 'Enter') {
      addSubtask(taskId);
    }
  };

  const getBackgroundColor = (urgent: boolean, important: boolean): string => {
    if (urgent && important) return 'border-l-4 border-l-red-500';
    if (urgent && !important) return 'border-l-4 border-l-orange-500';
    if (!urgent && important) return 'border-l-4 border-l-yellow-500';
    return 'border-l-4 border-l-green-500';
  };

  const clearAllTasks = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as tarefas?')) {
      setTasks([]);
      setExpandedTasks(new Set());
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      <div className={`max-w-2xl mx-auto p-4 ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
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
              <button 
                onClick={clearAllTasks}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Limpar Todas
              </button>
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
                <div key={task.id} className="space-y-1">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 ${getBackgroundColor(task.urgent, task.important)} ${
                      isDarkMode ? 'bg-neutral-800' : 'bg-white'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskExpanded(task.id)}
                      className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}
                    >
                      {expandedTasks.has(task.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => {
                        setTasks(prevTasks => prevTasks.map(t => {
                          if (t.id === task.id) {
                            const newCompleted = checked as boolean;
                            return {
                              ...t,
                              completed: newCompleted,
                              subtasks: t.subtasks.map(st => ({
                                ...st,
                                completed: newCompleted
                              }))
                            };
                          }
                          return t;
                        }));
                      }}
                      className="border-neutral-400"
                    />
                    
                    <span className={`flex-grow ${task.completed ? 'line-through text-neutral-500' : ''}`}>
                      {task.text}
                    </span>
                    
                    <button
                      onClick={() => removeTask(task.id)}
                      className={`${isDarkMode ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-400 hover:text-neutral-600'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {expandedTasks.has(task.id) && (
                    <div className="pl-8 space-y-1">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyPress={(e) => handleSubtaskKeyPress(e, task.id)}
                          placeholder="Nova subtarefa..."
                          className={`flex-grow border-0 text-sm ${
                            isDarkMode ? 'bg-neutral-800 placeholder-neutral-500' : 'bg-neutral-100 placeholder-neutral-400'
                          }`}
                        />
                        <button 
                          onClick={() => addSubtask(task.id)}
                          className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          Adicionar
                        </button>
                      </div>
                      
                      {task.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className={`flex items-center gap-2 px-3 py-2 ${
                            isDarkMode ? 'bg-neutral-800' : 'bg-white'
                          }`}
                        >
                          <div className="w-4" />
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={(checked) => toggleSubtaskComplete(task.id, subtask.id)}
                            className="border-neutral-400"
                          />
                          <span className={`flex-grow text-sm ${subtask.completed ? 'line-through text-neutral-500' : ''}`}>
                            {subtask.text}
                          </span>
                          <button
                            onClick={() => removeSubtask(task.id, subtask.id)}
                            className={`${isDarkMode ? 'text-neutral-500 hover:text-neutral-400' : 'text-neutral-400 hover:text-neutral-600'}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}