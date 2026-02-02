import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { words } from '../data/words';

const GameScreen = ({ navigation, route }) => {
  const {
    players,
    imposters,
    selectedCategories,
    imposterHint,
    roundDuration,
    initialCategory,
    initialWord,
  } = route.params;
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [currentWord, setCurrentWord] = useState(initialWord);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [isPaused, setIsPaused] = useState(false);
  const [isRoundEnded, setIsRoundEnded] = useState(false);
  
  const currentPlayer = players[currentPlayerIndex];
  const isCurrentPlayerImposter = imposters.includes(currentPlayer.id);
  
  const timerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Timer logic
  useEffect(() => {
    if (!isPaused && !isRoundEnded && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, isRoundEnded]);
  
  const endRound = () => {
    setIsRoundEnded(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to voting after animation
      setTimeout(() => {
        navigation.navigate('Voting', {
          players,
          imposters,
          currentCategory,
          currentWord,
          isCurrentPlayerImposter,
          selectedCategories,
        });
      }, 500);
    });
  };
  
  const pauseGame = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const resumeGame = () => {
    setIsPaused(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const skipTurn = () => {
    Alert.alert(
      'Lewati Giliran',
      'Apakah Anda yakin ingin mengakhiri giliran ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya', onPress: endRound },
      ]
    );
  };
  
  const selectNewWord = () => {
    const randomCategory = selectedCategories[
      Math.floor(Math.random() * selectedCategories.length)
    ];
    const categoryWords = words[randomCategory.name];
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    setCurrentCategory(randomCategory.name);
    setCurrentWord(randomWord);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
          <Text style={styles.playerRole}>
            {isCurrentPlayerImposter ? '⚡ Imposter' : '🛡️ Warga'}
          </Text>
        </View>
        
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Timer</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>
        
        <View style={styles.gameInfo}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryLabel}>Kategori</Text>
            <Text style={styles.categoryName}>{currentCategory}</Text>
          </View>
          
          {!isCurrentPlayerImposter ? (
            <View style={styles.wordCard}>
              <Text style={styles.wordLabel}>Kata Rahasia</Text>
              <Text style={styles.word}>{currentWord}</Text>
              <Text style={styles.wordInstruction}>
                Berikan petunjuk tentang kata ini tanpa mengungkapkannya langsung!
              </Text>
            </View>
          ) : (
            <View style={styles.imposterCard}>
              <Text style={styles.imposterLabel}>Anda adalah IMPOSTER!</Text>
              <Text style={styles.imposterInstruction}>
                {imposterHint 
                  ? `Kata rahasia berkaitan dengan: ${currentCategory}. 
                     Tirulah seperti Anda tahu kata sebenarnya!`
                  : 'Tirulah seperti Anda tahu kata rahasia! Perhatikan petunjuk dari pemain lain.'}
              </Text>
            </View>
          )}
          
          <View style={styles.playerList}>
            <Text style={styles.playerListTitle}>Urutan Giliran:</Text>
            {players.map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.playerItem,
                  index === currentPlayerIndex && styles.currentPlayerItem,
                ]}
              >
                <Text style={styles.playerItemName}>
                  {player.name} {index === currentPlayerIndex && '👈'}
                </Text>
                <Text style={styles.playerItemRole}>
                  {imposters.includes(player.id) ? '⚡' : '🛡️'}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.controls}>
          {isPaused ? (
            <TouchableOpacity style={styles.controlButton} onPress={resumeGame}>
              <Text style={styles.controlButtonText}>▶️ Lanjutkan</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.controlButton} onPress={pauseGame}>
              <Text style={styles.controlButtonText}>⏸️ Jeda</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.controlButton, styles.skipButton]}
            onPress={skipTurn}
          >
            <Text style={styles.skipButtonText}>⏭️ Akhiri Giliran</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.newWordButton]}
            onPress={selectNewWord}
          >
            <Text style={styles.newWordButtonText}>🔀 Kata Baru</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>Game Dijeda</Text>
            <Text style={styles.pauseText}>
              Waktu: {formatTime(timeLeft)}
              {'\n'}
              Giliran: {currentPlayer.name}
            </Text>
            <TouchableOpacity style={styles.resumeButton} onPress={resumeGame}>
              <Text style={styles.resumeButtonText}>Lanjutkan Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A306D',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  playerRole: {
    fontSize: 16,
    color: '#DDD',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  timerLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  gameInfo: {
    flex: 1,
    padding: 20,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  wordCard: {
    backgroundColor: '#6C63FF',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  wordLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
    opacity: 0.9,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  wordInstruction: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  imposterCard: {
    backgroundColor: '#FF6B6B',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imposterLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  imposterInstruction: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  playerList: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
  },
  playerListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  currentPlayerItem: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  playerItemName: {
    fontSize: 16,
    color: '#333',
  },
  playerItemRole: {
    fontSize: 20,
  },
  controls: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  controlButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  skipButton: {
    backgroundColor: '#FFD166',
  },
  skipButtonText: {
    color: '#333',
  },
  newWordButton: {
    backgroundColor: '#06D6A0',
  },
  newWordButtonText: {
    color: '#FFF',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  pauseText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  resumeButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  resumeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;