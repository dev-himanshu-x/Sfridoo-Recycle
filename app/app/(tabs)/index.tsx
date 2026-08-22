import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>Transform Industrial Waste Into New Value</Text>
          <Text style={styles.subtitle}>
            Our platform connects industries to turn one company's waste into another's raw material — automatically, compliantly, profitably.
          </Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/create')}>
            <Text style={styles.primaryButtonText}>Sell Materials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/listing')}>
            <Text style={styles.secondaryButtonText}>Browse Marketplace</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Your guide for the road ahead</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Waste stream optimization</Text>
            <Text style={styles.cardDesc}>Identify hidden value in your waste and unlock new revenue streams through circular practices.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Regulatory compliance</Text>
            <Text style={styles.cardDesc}>Stay ahead of environmental regulations with automated compliance tracking and reporting tools.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  heroSection: {
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#111827', fontSize: 16, fontWeight: '600' },
  infoSection: { marginTop: 24 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
});
