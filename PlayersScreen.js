import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PlayersScreen = ({ navigation, route }) => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  
  const addPlayer = () => {
    if (playerName.trim() === '') {
      Alert.alert('Nama Kosong', 'Masukkan nama pemain');
      return;
    }
    
    if (players.some(player => player.name.toLowerCase() === playerName.toLowerCase())) {
      Alert.alert('Nama Duplikat', 'Nama pemain sudah ada');
      return;
    }
    
    const newPlayer = {
      id: Date.now().toString(),
      name: playerName.trim(),
    };
    
    setPlayers([...players, newPlayer]);
    setPlayerName('');
  };
  
  const removePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
  };
  
  const continueToCategories = () => {
    if (players.length < 3) {
      Alert.alert('Pemain Kurang', 'Tambahkan minimal 3 pemain');
      return;
    }
    
    navigation.navigate('Categories', { players });
  };
  
  const renderPlayerItem = ({ item, index }) => (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerNumber}>{index + 1}.</Text>
        <Text style={styles.playerName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => removePlayer(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pemain</Text>
          <Text style={styles.subtitle}>
            {players.length >= 3
              ? `CONTINUE | ${players.length} Players`
              : `Tambahkan ${3 - players.length} lagi untuk melanjutkan`}
          </Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama pemain"
            placeholderTextColor="#999"
            value={playerName}
            onChangeText={setPlayerName}
            onSubmitEditing={addPlayer}
          />
          <TouchableOpacity
            style={[styles.addButton, !playerName.trim() && styles.disabledButton]}
            onPress={addPlayer}
            disabled={!playerName.trim()}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={item => item.id}
          style={styles.playerList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada pemain</Text>
          }
        />
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            players.length < 3 && styles.disabledButton,
          ]}
          onPress={continueToCategories}
          disabled={players.length < 3}
        >
          <Text style={styles.continueButtonText}>
            LANJUT KE KATEGORI
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerList: {
    flex: 1,
    padding: 20,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerNumber: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    width: 30,
  },
  playerName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  continueButton: {
    margin: 20,
    paddingVertical: 15,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlayersScreen;