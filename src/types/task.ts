export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 string (local midnight of the chosen day). */
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

/** Fields the user edits in the form. */
export type TaskInput = Pick<Task, 'title' | 'description' | 'dueDate' | 'priority'>;

export type StatusFilter = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | Priority;
