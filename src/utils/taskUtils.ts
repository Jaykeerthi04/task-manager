import { PriorityFilter, StatusFilter, Task } from '../types/task';

/**
 * Applies the status/priority filters and returns tasks sorted by due date,
 * earliest first. Ties are broken by creation time so the order is stable.
 * Pure function: does not mutate the input array.
 */
export function filterAndSortTasks(
  tasks: Task[],
  status: StatusFilter,
  priority: PriorityFilter,
): Task[] {
  return tasks
    .filter((task) => {
      const statusMatch =
        status === 'all' || (status === 'completed' ? task.completed : !task.completed);
      const priorityMatch = priority === 'all' || task.priority === priority;
      return statusMatch && priorityMatch;
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() || a.createdAt - b.createdAt,
    );
}
