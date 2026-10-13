import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task, TaskInput } from '../types/task';

// Each user's tasks live in users/{uid}/tasks, so security rules can scope access by uid.
const tasksCollection = (uid: string) => collection(db, 'users', uid, 'tasks');
const taskDoc = (uid: string, id: string) => doc(db, 'users', uid, 'tasks', id);

export function subscribeToTasks(
  uid: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    tasksCollection(uid),
    (snapshot) => {
      onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) })));
    },
    onError,
  );
}

export async function createTask(uid: string, input: TaskInput): Promise<void> {
  await addDoc(tasksCollection(uid), {
    ...input,
    completed: false,
    createdAt: Date.now(),
  });
}

export async function patchTask(
  uid: string,
  id: string,
  patch: Partial<Omit<Task, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(taskDoc(uid, id), patch);
}

export async function removeTask(uid: string, id: string): Promise<void> {
  await deleteDoc(taskDoc(uid, id));
}
