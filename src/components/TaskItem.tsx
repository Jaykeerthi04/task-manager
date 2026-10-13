import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { IconButton, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { priorityColors } from '../theme/theme';
import { Task } from '../types/task';
import { formatDueDate, isOverdue } from '../utils/dateUtils';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskItemBase({ task, onToggle, onEdit, onDelete }: Props) {
  const theme = useTheme();
  const overdue = isOverdue(task.dueDate, task.completed);
  const badge = priorityColors[task.priority];

  const confirmDelete = () =>
    Alert.alert('Delete task', `Delete "${task.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task) },
    ]);

  return (
    <Surface style={styles.card} elevation={1}>
      <TouchableRipple onPress={() => onEdit(task)} borderless style={styles.ripple}>
        <View style={styles.row}>
          <IconButton
            icon={task.completed ? 'check-circle' : 'circle-outline'}
            iconColor={task.completed ? theme.colors.primary : theme.colors.outline}
            size={26}
            onPress={() => onToggle(task)}
            accessibilityLabel={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          />

          <View style={styles.body}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={task.completed && styles.done}
            >
              {task.title}
            </Text>
            {!!task.description && (
              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {task.description}
              </Text>
            )}
            <View style={styles.meta}>
              <Text
                variant="labelMedium"
                style={{ color: overdue ? theme.colors.error : theme.colors.onSurfaceVariant }}
              >
                {overdue ? 'Overdue · ' : ''}
                {formatDueDate(task.dueDate)}
              </Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text variant="labelSmall" style={{ color: badge.fg }}>
                  {task.priority.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <IconButton
            icon="trash-can-outline"
            iconColor={theme.colors.error}
            size={22}
            onPress={confirmDelete}
            accessibilityLabel="Delete task"
          />
        </View>
      </TouchableRipple>
    </Surface>
  );
}

// Rows only re-render when their own task changes.
export const TaskItem = React.memo(TaskItemBase);

const styles = StyleSheet.create({
  card: { borderRadius: 14, marginHorizontal: 16, marginVertical: 6 },
  ripple: { borderRadius: 14 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingRight: 2 },
  body: { flex: 1, gap: 2, paddingVertical: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  done: { textDecorationLine: 'line-through', opacity: 0.5 },
});
