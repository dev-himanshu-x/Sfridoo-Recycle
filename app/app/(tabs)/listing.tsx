import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export default function ListingScreen() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/listings`);
            if (res.ok) {
                const data = await res.json();
                setListings(data);
            }
        } catch (err) {
            console.error('Fetch listings error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.image_url ? (
                <Image style={styles.image} source={{ uri: item.image_url }} />
            ) : (
                <View style={[styles.image, styles.noImage]}>
                    <Text style={styles.noImageText}>No Image</Text>
                </View>
            )}
            <View style={styles.info}>
                <Text style={styles.category}>{item.category || 'Uncategorized'}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.label}>Est. Value</Text>
                        <Text style={styles.value}>{item.estimated_value_per_unit || 'TBD'}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.label}>Qty</Text>
                        <Text style={styles.value}>{item.quantity} {item.unit || 'kg'}</Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.province}>{item.province}</Text>
                    <Text style={styles.framing}>{item.framing}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Marketplace</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#111827" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={listings}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No listings found.</Text>}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fafafa' },
    header: { fontSize: 28, fontWeight: '700', margin: 20, color: '#111827' },
    list: { paddingHorizontal: 16, paddingBottom: 20 },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#6b7280' },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    image: { width: '100%', height: 160 },
    noImage: { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
    noImageText: { color: '#9ca3af', fontWeight: '500' },
    info: { padding: 16 },
    category: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
    title: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase' },
    value: { fontSize: 14, fontWeight: '600', color: '#111827' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12, alignItems: 'center' },
    province: { fontSize: 12, color: '#4b5563' },
    framing: { fontSize: 10, backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', color: '#374151', fontWeight: '600' }
});