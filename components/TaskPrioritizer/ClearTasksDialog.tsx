"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClearTasksDialogProps {
  isDarkMode: boolean;
  onClear: () => void;
}

export function ClearTasksDialog({ isDarkMode, onClear }: ClearTasksDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-red-500 hover:text-red-600 text-sm">
          Limpar Todas
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className={isDarkMode ? "dark:bg-neutral-800" : ""}>
        <AlertDialogHeader>
          <AlertDialogTitle>Limpar todas as tarefas?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Todas as suas tarefas e subtarefas serão removidas permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={isDarkMode ? "dark:bg-neutral-700 dark:hover:bg-neutral-600" : ""}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onClear}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Limpar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}