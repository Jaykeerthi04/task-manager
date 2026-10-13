import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

export function LogoMark({ size = 88 }: { size?: number }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: size / 4, backgroundColor: theme.colors.primary },
      ]}
    >
      <MaterialCommunityIcons name="check-bold" size={size * 0.55} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', elevation: 4 },
});
