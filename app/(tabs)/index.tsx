import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WalletGauge from '../../components/dashboard/WalletGauge';
import Colors from '../../constants/Colors';
import { useStore } from '../../store';

export default function Dashboard() {
  const balance = useStore((state) => state.balance);
  const addTime = useStore((state) => state.addTime);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleDebugAdd = () => {
    addTime(15);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>DopaQuest</Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            Gagne ton temps, mérite ton plaisir.
          </Text>
        </View>

        <View style={styles.gaugeContainer}>
          <WalletGauge balance={balance} />
        </View>

        <View style={styles.debugSection}>
          <Text style={[styles.debugLabel, { color: colors.text }]}>Debug Zone</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.success }]}
            onPress={handleDebugAdd}
          >
            <Text style={styles.buttonText}>+ 15 min (Test)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  gaugeContainer: {
    marginBottom: 40,
  },
  debugSection: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  debugLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    opacity: 0.5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
