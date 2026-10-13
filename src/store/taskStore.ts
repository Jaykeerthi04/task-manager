import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  createTask,
  patchTask,
  removeTask,
  subscribeToTasks,
} from '../services/taskService';
import { PriorityFilter, StatusFilter, Task, TaskInput } from '../types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;

  /** Starts the live Firestore listener for this user. */
  subscribe: (uid: string) => void;
  /** Stops the listener and clears all task state (called on logout). */
  reset: () => void;

  addTask: (input: TaskInput) => Promise<void>;
  updateTask: (id: string, input: TaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (task: Task) => Promise<void>;

  setStatusFilter: (filter: StatusFilter) => void;
  setPriorityFilter: (filter: PriorityFilter) => void;
  clearError: () => void;
}

// The listener and current uid are not UI state, so they live outside the store.
let unsubscribe: (() => void) | null = null;
let currentUid: string | null = null;

function requireUid(): string {
  if (!currentUid) throw new Error('You must be signed in.');
  return currentUid;
}

const messageFrom = (e: unknown, fallback: string) =>
  e instanceof Error && e.message ? e.message : fallback;

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      loading: false,
      error: null,
      statusFilter: 'all',
      priorityFilter: 'all',

      subscribe: (uid) => {
        unsubscribe?.();
        currentUid = uid;
        set({ loading: true, error: null });
        unsubscribe = subscribeToTasks(
          uid,
          (tasks) => set({ tasks, loading: false, error: null }),
          (error) => set({ loading: false, error: error.message }),
        );
      },

      reset: () => {
        unsubscribe?.();
        unsubscribe = null;
        currentUid = null;
        set({
          tasks: [],
          loading: false,
          error: null,
          statusFilter: 'all',
          priorityFilter: 'all',
        });
      },

      // Writes surface their error to the caller (the form shows it) instead of swallowing it.
      addTask: async (input) => {
        try {
          await createTask(requireUid(), input);
        } catch (e) {
          throw new Error(messageFrom(e, 'Could not save the task.'));
        }
      },

      updateTask: async (id, input) => {
        try {
          await patchTask(requireUid(), id, input);
        } catch (e) {
          throw new Error(messageFrom(e, 'Could not update the task.'));
        }
      },

      deleteTask: async (id) => {
        try {
          await removeTask(requireUid(), id);
        } catch (e) {
          set({ error: messageFrom(e, 'Could not delete the task.') });
        }
      },

      toggleComplete: async (task) => {
        try {
          await patchTask(requireUid(), task.id, { completed: !task.completed });
        } catch (e) {
          set({ error: messageFrom(e, 'Could not update the task.') });
        }
      },

      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'task-cache-v1',
      storage: createJSONStorage(() => AsyncStorage),
      // Only the task list is cached locally, so the UI has data instantly on launch
      // (and offline). Firestore remains the source of truth and overwrites it.
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
);
