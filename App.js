import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScannedData(`Tipo: ${type}, Dados: ${data}`);
    setHistory([...history, { id: history.length.toString(), data: data }]);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem permissão para acessar a câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leitor de QR Code e Código de Barras</Text>
      <BarCodeScanner
        onBarCodeScanned={scannedData ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <Text style={styles.scannedData}>
          {scannedData ? scannedData : 'Escaneie um código'}
        </Text>
        <Button title={'Limpar Histórico'} onPress={() => setHistory([])} />
      </View>

      <FlatList
        data={history}
        renderItem={({ item }) => <Text>{item.data}</Text>}
        keyExtractor={(item) => item.id}
        style={styles.history}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  scannedData: {
    fontSize: 16,
    marginBottom: 10,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  history: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
});
