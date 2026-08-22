import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function DemandScreen() {
    const [form, setForm] = useState({
        companyName: '',
        contactEmail: '',
        materialName: '',
        category: '',
        quantityNeeded: '',
        province: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!form.companyName || !form.contactEmail || !form.materialName) {
            alert("Please fill required fields (Company, Email, Material)");
            return;
        }
        try {
            setSubmitting(true);
            const res = await fetch(`${API_URL}/demand`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                alert("Failed to submit request.");
            }
        } catch (err) {
            console.error(err);
            alert("Error reaching server");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.successTitle}>Request Registered!</Text>
                <Text style={styles.successText}>We'll email {form.contactEmail} when a match is found.</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setSubmitted(false);
                    setForm({ companyName: '', contactEmail: '', materialName: '', category: '', quantityNeeded: '', province: '' });
                }}>
                    <Text style={styles.buttonText}>Add Another Request</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>Register Material Need</Text>
                <Text style={styles.subtitle}>We'll notify you instantly when a match is found on the marketplace.</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Company Name *</Text>
                    <TextInput style={styles.input} value={form.companyName} onChangeText={(v) => setForm(prev => ({ ...prev, companyName: v }))} placeholder="Acme Industries" />

                    <Text style={styles.label}>Contact Email *</Text>
                    <TextInput style={styles.input} value={form.contactEmail} onChangeText={(v) => setForm(prev => ({ ...prev, contactEmail: v }))} placeholder="procurement@company.com" keyboardType="email-address" />

                    <Text style={styles.label}>Material Needed *</Text>
                    <TextInput style={styles.input} value={form.materialName} onChangeText={(v) => setForm(prev => ({ ...prev, materialName: v }))} placeholder="e.g. Copper wire, ABS Plastic..." />

                    <Text style={styles.label}>Quantity Needed (kg)</Text>
                    <TextInput style={styles.input} value={form.quantityNeeded} onChangeText={(v) => setForm(prev => ({ ...prev, quantityNeeded: v }))} placeholder="e.g. 5000" keyboardType="numeric" />

                    <Text style={styles.label}>Province</Text>
                    <TextInput style={styles.input} value={form.province} onChangeText={(v) => setForm(prev => ({ ...prev, province: v }))} placeholder="e.g. Milan" />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Register Demand & Get Notified</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f6' },
    scroll: { padding: 20 },
    header: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 20 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 16 },
    submitButton: { backgroundColor: '#1a2e1a', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    successTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 12 },
    successText: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginHorizontal: 30, marginBottom: 24 },
    button: { backgroundColor: '#111827', padding: 16, borderRadius: 8 },
    buttonText: { color: '#fff', fontWeight: '600' }
});