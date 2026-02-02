import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';

const SettingsScreen = ({ navigation, route }) => {
  const { players, selectedCategories } = route.params;
  const [imposterCount, setImposterCount] = useState(1);
  const [imposterHint, setImposterHint] = useState(true);
  const [roundDuration, setRoundDuration] = useState(120); // in seconds
  
  const calculateMaxImposters = () => {
    return Math.max(1, Math.floor(players.length / 2));
  };
  
  const increaseImposters = () => {
    if (imposterCount < calculateMaxImposters()) {
      setImposterCount(imposterCount + 1);
    }
  };
  
  const decreaseImposters = () => {
    if (imposterCount > 1) {
      setImposterCount(imposterCount - 1);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const increaseTime = () => {
    if (roundDuration < 300) { // Max 5 minutes
      setRoundDuration(roundDuration + 30);
    }
  };
  
  const decreaseTime = () => {
    if (roundDuration > 60) { // Min 1 minute
      setRoundDuration(roundDuration - 30);
    }
  };
  
  const startGame = () => {
    // Randomly select imposters
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const imposters = shuffledPlayers.slice(0, imposterCount);
    
    navigation.navigate('RoleReveal', {
      players,
      imposters: imposters.map(p => p.id),
      selectedCategories,
      imposterHint,
      roundDuration,
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Pengaturan Game</Text>
          <Text style={styles.subtitle}>
            Konfigurasikan permainan sesuai keinginan
          </Text>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Imposter</Text>
          <Text style={styles.sectionDescription}>
            Berapa banyak pemain yang menjadi imposter rahasia?
            {'\n'}Rekomendasi untuk {players.length} pemain: {Math.max(1, Math.floor(players.length / 3))}
          </Text>
          
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={decreaseImposters}
              disabled={imposterCount <= 1}
            >
              <Text style={[
                styles.counterButtonText,
                imposterCount <= 1 && styles.disabledText
              ]}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.counterValue}>
              <Text style={styles.counterValueText}>{imposterCount}</Text>
              <Text style={styles.counterLabel}>
                {imposterCount === 1 ? 'Imposter' : 'Imposters'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.counterButton}
              onPress={increaseImposters}
              disabled={imposterCount >= calculateMaxImposters()}
            >
              <Text style={[
                styles.counterButtonText,
                imposterCount >= calculateMaxImposters() && styles.disabledText
              ]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Petunjuk untuk Imposter</Text>
          <Text style={styles.sectionDescription}>
            Apakah imposter mendapatkan petunjuk tentang kata rahasia?
          </Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchOption}>
              <Text style={styles.switchLabel}>Nonaktif</Text>
              <Switch
                value={imposterHint}
                onValueChange={setImposterHint}
                trackColor={{ false: '#767577', true: '#6C63FF' }}
                thumbColor={imposterHint ? '#FFF' : '#FFF'}
              />
              <Text style={styles.switchLabel}>Aktif</Text>
            </View>
          </View>
          
          {imposterHint && (
            <View style={styles.hintInfo}>
              <Text style={styles.hintText}>
                Imposter akan mendapatkan petunjuk kategori atau tema kata
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Durasi Ronde</Text>
          <Text style={styles.sectionDescription}>
            Berapa lama setiap ronde diskusi berlangsung?
          </Text>
          
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={decreaseTime}
              disabled={roundDuration <= 60}
            >
              <Text style={[
                styles.counterButtonText,
                roundDuration <= 60 && styles.disabledText
              ]}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.counterValue}>
              <Text style={styles.timeValue}>{formatTime(roundDuration)}</Text>
              <Text style={styles.counterLabel}>Menit</Text>
            </View>
            
            <TouchableOpacity
              style={styles.counterButton}
              onPress={increaseTime}
              disabled={roundDuration >= 300}
            >
              <Text style={[
                styles.counterButtonText,
                roundDuration >= 300 && styles.disabledText
              ]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Ringkasan Game</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Jumlah Pemain:</Text>
            <Text style={styles.summaryValue}>{players.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Jumlah Imposter:</Text>
            <Text style={styles.summaryValue}>{imposterCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Kategori Terpilih:</Text>
            <Text style={styles.summaryValue}>{selectedCategories.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Durasi Ronde:</Text>
            <Text style={styles.summaryValue}>{formatTime(roundDuration)}</Text>
          </View>
        </View>
      </ScrollView>
      
      <TouchableOpacity
        style={styles.startButton}
        onPress={startGame}
      >
        <Text style={styles.startButtonText}>
          MULAI GAME
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 100,
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
  settingsSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  counterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
  counterValue: {
    alignItems: 'center',
    marginHorizontal: 30,
    minWidth: 100,
  },
  counterValueText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  timeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  counterLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  switchContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 15,
  },
  hintInfo: {
    backgroundColor: '#E8F4FD',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  hintText: {
    fontSize: 14,
    color: '#0066CC',
    textAlign: 'center',
  },
  summarySection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  startButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 15,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;