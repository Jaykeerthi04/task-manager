import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { PriorityFilter, StatusFilter } from '../types/task';

interface Props {
  status: StatusFilter;
  priority: PriorityFilter;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Incomplete' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'Any' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function FilterBar({ status, priority, onStatusChange, onPriorityChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <Text variant="labelMedium" style={styles.label}>
          Status
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {STATUS_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              selected={status === o.value}
              showSelectedOverlay
              onPress={() => onStatusChange(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.group}>
        <Text variant="labelMedium" style={styles.label}>
          Priority
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {PRIORITY_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              selected={priority === o.value}
              showSelectedOverlay
              onPress={() => onPriorityChange(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8, gap: 6 },
  group: { flexDirection: 'row', alignItems: 'center' },
  label: { width: 64, paddingLeft: 16, opacity: 0.7 },
  chips: { gap: 8, paddingRight: 16 },
});
