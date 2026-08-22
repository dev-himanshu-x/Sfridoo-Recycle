import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function CreateListingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [analyzing, setAnalyzing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Instead of actual image upload (needs expo-image-picker), we'll do a mock bypass form for the app demo
    // because to do multipart natively we'd need more setup.
    const [quantity, setQuantity] = useState('');
    const [province, setProvince] = useState('');

    const [analyzedData, setAnalyzedData] = useState({
        title: 'AI Generated Title for Scrap',
        description: 'AI Generated Description...',
        category: 'Metal',
        framing: 'Warehouse Leftover',
        quantity: '',
        province: ''
    });

    const handleAIAnalyze = () => {
        if (!quantity || !province) {
            Alert.alert("Please provide quantity and province");
            return;
        }
        setAnalyzing(true);
        // Simulate AI taking time
        setTimeout(() => {
            setAnalyzedData({
                ...analyzedData,
                quantity,
                province,
            });
            setAnalyzing(false);
            setStep(2);
        }, 1500);
    };

    const handleFinalSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/listings/create-final`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(analyzedData)
            });
            if (res.ok) {
                Alert.alert("Success", "Listing Created Successfully");
                router.push('/listing');
                setStep(1);
                setQuantity('');
                setProvince('');
            } else {
                Alert.alert("Error", "Failed to create listing");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Network error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {step === 1 ? (
                    <>
                        <Text style={styles.header}>AI Intelligent Listing</Text>
                        <Text style={styles.subtitle}>Upload details of your waste to get started.</Text>

                        <View style={styles.card}>
                            <Text style={styles.label}>Quantity (kg) *</Text>
                            <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="e.g. 500" keyboardType="numeric" />

                            <Text style={styles.label}>Location (Province) *</Text>
                            <TextInput style={styles.input} value={province} onChangeText={setProvince} placeholder="e.g. Milan" />

                            <TouchableOpacity style={styles.aiButton} onPress={handleAIAnalyze} disabled={analyzing}>
                                {analyzing ? <ActivityIndicator color="#fff" /> : <Text style={styles.aiText}>AI Auto-Generate</Text>}
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.header}>Review & Post</Text>
                        <Text style={styles.subtitle}>Review the AI generated details</Text>

                        <View style={styles.card}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput style={styles.input} value={analyzedData.title} onChangeText={v => setAnalyzedData({ ...analyzedData, title: v })} />

                            <Text style={styles.label}>Description</Text>
                            <TextInput style={[styles.input, { height: 80 }]} multiline value={analyzedData.description} onChangeText={v => setAnalyzedData({ ...analyzedData, description: v })} />

                            <Text style={styles.label}>Category</Text>
                            <TextInput style={styles.input} value={analyzedData.category} onChangeText={v => setAnalyzedData({ ...analyzedData, category: v })} />

                            <Text style={styles.label}>Framing</Text>
                            <TextInput style={styles.input} value={analyzedData.framing} onChangeText={v => setAnalyzedData({ ...analyzedData, framing: v })} />

                            <Text style={styles.label}>Quantity (kg)</Text>
                            <TextInput style={styles.input} value={analyzedData.quantity} onChangeText={v => setAnalyzedData({ ...analyzedData, quantity: v })} />

                            <Text style={styles.label}>Province</Text>
                            <TextInput style={styles.input} value={analyzedData.province} onChangeText={v => setAnalyzedData({ ...analyzedData, province: v })} />

                            <TouchableOpacity style={styles.submitButton} onPress={handleFinalSubmit} disabled={submitting}>
                                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Listing</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
                                <Text style={styles.backText}>Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fafafa' },
    scroll: { padding: 20 },
    header: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', elevation: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 16 },
    aiButton: { backgroundColor: '#b200ff', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
    aiText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    submitButton: { backgroundColor: '#111827', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    backButton: { marginTop: 16, alignItems: 'center' },
    backText: { color: '#6b7280', fontSize: 16 }
});