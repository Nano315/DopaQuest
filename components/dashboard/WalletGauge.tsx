import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import Colors from '../../constants/Colors';

interface WalletGaugeProps {
  balance: number; // in minutes
}

export default function WalletGauge({ balance }: WalletGaugeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <View style={[styles.container, { borderColor: colors.serenity }]}>
      <Text style={[styles.label, { color: colors.text }]}>Temps Disponible</Text>
      <Text style={[styles.balance, { color: colors.serenity }]}>
        {formatTime(balance)}
      </Text>
      <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
        Wallet
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.8,
  },
  balance: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  subtext: {
    marginTop: 4,
    fontSize: 14,
  },
});
