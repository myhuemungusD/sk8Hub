import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SkateScreen() {
  return (
    <View style={styles.container}>
      <Text>SKATE Screen (Battles, challenges, videos)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
