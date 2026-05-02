import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [link, setLink] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // --- SUBSTITUA PELA SUA URL DO RAILWAY ---
  const API_URL = "https://api-precificador-production.up.railway.app/scraping-shopee";

  const calcularPrecificacao = async () => {
    if (!link.includes('shopee.com.br')) {
      return Alert.alert("Erro", "Por favor, cole um link válido da Shopee.");
    }

    setLoading(true);
    setResultado(null);

    try {
      // Fazendo a chamada real para a sua API de Scraping
      const response = await axios.post(API_URL, { url: link });
      
      setResultado(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível calcular. Verifique se o servidor no Railway está online.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Marques Studio'S</Text>
      <Text style={styles.subtitle}>Precificador Shopee 🚀</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cole o link do produto:</Text>
        <TextInput
          style={styles.input}
          placeholder="https://shopee.com.br/..."
          value={link}
          onChangeText={setLink}
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={calcularPrecificacao}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>CALCULAR PREÇO REAL</Text>
        )}
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultBox}>
          <Text style={styles.productName}>{resultado.nome}</Text>
          <View style={styles.divider} />
          <Text style={styles.infoText}>Custo Fornecedor: R$ {resultado.precoCusto}</Text>
          <Text style={styles.resultText}>Venda Sugerida: R$ {resultado.vendaSugerida}</Text>
          <Text style={styles.profitText}>Lucro Limpo: R$ {resultado.lucro}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', padding: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF4500', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#fff', marginBottom: 30 },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { color: '#bbb', marginBottom: 8 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#FF4500', padding: 18, borderRadius: 10, width: '100%', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultBox: { marginTop: 30, padding: 20, backgroundColor: '#1e1e1e', borderRadius: 10, width: '100%', borderWidth: 1, borderColor: '#FF4500' },
  productName: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#333', marginBottom: 15 },
  infoText: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 5 },
  resultText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  profitText: { color: '#00FF00', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }
});