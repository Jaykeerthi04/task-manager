import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  Appbar,
  Button,
  HelperText,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenProps } from '../navigation/types';
import { useTaskStore } from '../store/taskStore';
import { Priority } from '../types/task';
import { formatLongDate, startOfDay } from '../utils/dateUtils';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TaskFormScreen({ navigation, route }: ScreenProps<'TaskForm'>) {
  const theme = useTheme();
  const taskId = route.params?.taskId;
  const existing = useTaskStore((s) => s.tasks.find((t) => t.id === taskId));
  const { addTask, updateTask } = useTaskStore.getState();
  const isEditing = !!taskId;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [dueDate, setDueDate] = useState<Date>(
    existing ? new Date(existing.dueDate) : startOfDay(new Date()),
  );
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? 'medium');
  const [showPicker, setShowPicker] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const titleError = titleTouched && !title.trim() ? 'Title is required.' : '';

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    // On Android the picker is a dialog that closes itself; on iOS we keep it inline.
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) setDueDate(startOfDay(selected));
  };

  const handleSave = async () => {
    setTitleTouched(true);
    if (!title.trim()) return;

    const input = {
      title: title.trim(),
      description: description.trim(),
      dueDate: startOfDay(dueDate).toISOString(),
      priority,
    };

    setSaving(true);
    setSaveError(null);
    try {
      if (isEditing && taskId) await updateTask(taskId, input);
      else await addTask(input);
      navigation.goBack();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not save the task.');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header mode="small" style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} disabled={saving} />
        <Appbar.Content title={isEditing ? 'Edit task' : 'New task'} />
      </Appbar.Header>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTitleTouched(true)}
            error={!!titleError}
            disabled={saving}
            maxLength={100}
          />
          <HelperText type="error" visible={!!titleError}>
            {titleError}
          </HelperText>

          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.multiline}
            disabled={saving}
          />

          <Text variant="labelLarge" style={styles.sectionLabel}>
            Due date
          </Text>
          <Button
            mode="outlined"
            icon="calendar"
            onPress={() => setShowPicker(true)}
            disabled={saving}
            contentStyle={styles.dateBtn}
          >
            {formatLongDate(dueDate)}
          </Button>
          {showPicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
          )}

          <Text variant="labelLarge" style={styles.sectionLabel}>
            Priority
          </Text>
          <SegmentedButtons
            value={priority}
            onValueChange={(v) => setPriority(v as Priority)}
            buttons={PRIORITIES}
          />

          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              contentStyle={styles.saveBtn}
            >
              {isEditing ? 'Save changes' : 'Add task'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar visible={!!saveError} onDismiss={() => setSaveError(null)} duration={5000}>
        {saveError}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20 },
  multiline: { minHeight: 110 },
  sectionLabel: { marginTop: 20, marginBottom: 8 },
  dateBtn: { justifyContent: 'flex-start', paddingVertical: 4 },
  actions: { marginTop: 32 },
  saveBtn: { paddingVertical: 6 },
});
