import React, { useCallback, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterBar } from '../components/FilterBar';
import { TaskItem } from '../components/TaskItem';
import { ScreenProps } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { todayLabel } from '../utils/dateUtils';
import { filterAndSortTasks } from '../utils/taskUtils';

export default function TaskListScreen({ navigation }: ScreenProps<'Tasks'>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((s) => s.signOut);

  const tasks = useTaskStore((s) => s.tasks);
  const loading = useTaskStore((s) => s.loading);
  const error = useTaskStore((s) => s.error);
  const statusFilter = useTaskStore((s) => s.statusFilter);
  const priorityFilter = useTaskStore((s) => s.priorityFilter);
  const { setStatusFilter, setPriorityFilter, toggleComplete, deleteTask, clearError } =
    useTaskStore.getState();

  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, statusFilter, priorityFilter),
    [tasks, statusFilter, priorityFilter],
  );

  const handleEdit = useCallback(
    (task: Task) => navigation.navigate('TaskForm', { taskId: task.id }),
    [navigation],
  );

  const confirmLogout = () =>
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => signOut() },
    ]);

  const filtersActive = statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View>
          <Text variant="labelMedium" style={styles.headerSub}>
            {todayLabel()}
          </Text>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            My tasks
          </Text>
        </View>
        <IconButton icon="logout" iconColor="#FFFFFF" onPress={confirmLogout} accessibilityLabel="Log out" />
      </View>

      <FilterBar
        status={statusFilter}
        priority={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      {loading && tasks.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={visibleTasks}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleComplete}
              onEdit={handleEdit}
              onDelete={(t) => deleteTask(t.id)}
            />
          )}
          contentContainerStyle={
            visibleTasks.length === 0 ? styles.emptyContainer : { paddingBottom: 100 + insets.bottom }
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text variant="titleMedium">
                {filtersActive ? 'No tasks match these filters' : 'No tasks yet'}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {filtersActive ? 'Try changing or clearing a filter.' : 'Tap + to add your first task.'}
              </Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary, bottom: insets.bottom + 24 }]}
        color="#FFFFFF"
        onPress={() => navigation.navigate('TaskForm')}
        accessibilityLabel="Add task"
      />

      <Snackbar visible={!!error} onDismiss={clearError} duration={5000}>
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 8,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerSub: { color: '#E4E2FF' },
  headerTitle: { color: '#FFFFFF', fontWeight: '700' },
  emptyContainer: { flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 24 },
  fab: { position: 'absolute', right: 20, borderRadius: 28 },
});
