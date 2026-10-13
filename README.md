# Task Manager (React Native)

A task management app for gig workers, built with React Native (Expo), TypeScript, Firebase and Zustand.

## Features

| Requirement | Implementation |
|---|---|
| **User authentication** | Email/password sign up and login with Firebase Authentication. Friendly error messages for invalid credentials, existing accounts, weak passwords, network failures, etc. Session persists across app restarts. |
| **Task management** | Create, edit, delete and view tasks. Fields: title, description, due date, priority (low / medium / high). Mark tasks complete / incomplete. |
| **Storage** | Cloud Firestore, scoped per user (`users/{uid}/tasks/{taskId}`), with a live listener so changes appear instantly. Tasks are also cached locally in AsyncStorage so the list shows immediately on launch. |
| **Filtering & sorting** | Filter by status (all / incomplete / completed) and priority (any / high / medium / low). Always listed by due date, earliest first. |
| **UI** | Material Design 3 via React Native Paper, responsive, works on iOS and Android. Follows the colour palette and onboarding / login / "My tasks" layout of the reference screens. |

## Tech stack

- Expo + React Native + TypeScript (strict mode)
- Firebase Auth and Cloud Firestore
- **Zustand** for state management (with the `persist` middleware for the local cache)
- React Navigation (native stack)
- React Native Paper (Material Design 3)

## Getting started

### 1. Create a Firebase project

1. In the [Firebase console](https://console.firebase.google.com), create a project.
2. **Authentication → Sign-in method →** enable **Email/Password**.
3. **Firestore Database →** create a database (production mode is fine).
4. **Firestore → Rules →** paste the contents of [`firestore.rules`](./firestore.rules) and publish. These rules make sure users can only access their own tasks.
5. **Project settings → Your apps →** add a **Web app** and copy its config values.

### 2. Configure and run

```bash
npm install
cp .env.example .env      # then fill in the values from step 1.5
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS or Android), or press `a` / `i` to open an emulator.

## Project structure

The code is split into layers so that UI, state, and data access can change independently:

```
src/
  config/        Firebase initialisation
  types/         Domain types (Task, Priority, filters)
  services/      Data access: the only code that talks to Firebase
  store/         Zustand stores (auth, tasks): application state and actions
  utils/         Pure functions: filtering/sorting, date helpers, auth error messages
  navigation/    Root navigator (auth stack vs. app stack) and route types
  screens/       Welcome, Sign up, Log in, Task list, Task form
  components/    Reusable UI: TaskItem, FilterBar, AuthForm, LogoMark
  theme/         Material Design theme and priority colours
```

Dependencies point one way: `screens → store → services → config`. Screens never import Firebase directly.

## Design decisions

- **Zustand over Redux.** The state is small (user, tasks, two filters), so Zustand gives the same predictable single-store model with far less boilerplate.
- **Per-user subcollection** (`users/{uid}/tasks`) instead of a flat `tasks` collection with a `userId` field. It makes the security rule trivial and impossible to get wrong.
- **Filtering and sorting happen on the client** in a pure function (`filterAndSortTasks`). A user's task list is small, this avoids needing composite Firestore indexes, and the function is easy to unit test.
- **Auth and task listeners are tied together.** When the signed-in user changes, the task listener is started or torn down, and the local cache is cleared on logout so one user's tasks never show up for another.
- **Errors are surfaced, not swallowed.** Form saves show a snackbar on failure; list actions (toggle / delete) report failures in the list screen.
- **Delete asks for confirmation** to prevent accidental data loss.

## Notes and possible next steps

- Social login buttons (Google / Facebook / Apple) from the reference screens are not included, since the requirements specify email/password only.
- Dates are stored as ISO strings at local midnight. A "due time" could be added later.
- Next steps I would take: unit tests for the filter/sort utility and stores, pull-to-refresh and offline write queueing, and swipe-to-delete as shown in the reference design.
