import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import { words } from '../data/words';

const RoleRevealScreen = ({ navigation, route }) => {
  const { players, imposters, selectedCategories, imposterHint, roundDuration } = route.params;
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(new Animated.Value(0));
  const [currentWord, setCurrentWord] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [isImposter, setIsImposter] = useState(false);
  const [showRole, setShowRole] = useState(false);
  
  const currentPlayer = players[currentPlayerIndex];
  const isImposterForThisPlayer = imposters.includes(currentPlayer.id);
  
  // Select random word and category
  useEffect(() => {
    const randomCategory = selectedCategories[
      Math.floor(Math.random() * selectedCategories.length)
    ];
    const categoryWords = words[randomCategory.name];
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    setCurrentCategory(randomCategory.name);
    setCurrentWord(randomWord);
    setIsImposter(isImposterForThisPlayer);
  }, [currentPlayerIndex]);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy < 0) { // Swiping up
        const progress = Math.min(1, Math.abs(gestureState.dy) / 200);
        swipeProgress.setValue(progress);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy < -100) { // Swiped up enough
        revealRole();
      } else {
        Animated.spring(swipeProgress, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });
  
  const revealRole = () => {
    Animated.timing(swipeProgress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowRole(true);
    });
  };
  
  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowRole(false);
      swipeProgress.setValue(0);
    } else {
      startGame();
    }
  };
  
  const startGame = () => {
    navigation.navigate('Game', {
      players,
      imposters,
      selectedCategories,
      imposterHint,
      roundDuration,
      initialCategory: currentCategory,
      initialWord: currentWord,
    });
  };
  
  const swipeAnimation = {
    transform: [
      {
        translateY: swipeProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -300],
        }),
      },
    ],
    opacity: swipeProgress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 0],
    }),
  };
  
  const roleRevealAnimation = {
    transform: [
      {
        scale: swipeProgress.interpolate({
          inputRange: [0.5, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
    opacity: swipeProgress.interpolate({
      inputRange: [0.5, 1],
      outputRange: [0, 1],
    }),
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>
        <Text style={styles.playerCount}>
          {currentPlayerIndex + 1} dari {players.length}
        </Text>
      </View>
      
      <View style={styles.content}>
        {!showRole ? (
          <Animated.View 
            style={[styles.swipeContainer, swipeAnimation]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.swipeInstruction}>
              Geser ke atas untuk mengungkap kata rahasia
            </Text>
            <Text style={styles.swipeArrow}>↑</Text>
          </Animated.View>
        ) : null}
        
        <Animated.View style={[styles.roleContainer, roleRevealAnimation]}>
          {showRole ? (
            <>
              <Text style={styles.roleTitle}>
                {isImposter ? 'IMPOSTER' : 'WARGA'}
              </Text>
              
              <View style={styles.wordContainer}>
                {isImposter ? (
                  <>
                    <Text style={styles.imposterText}>IMPOSTER</Text>
                    {imposterHint && (
                      <View style={styles.hintContainer}>
                        <Text style={styles.hintTitle}>Petunjuk:</Text>
                        <Text style={styles.hintText}>
                          Kata rahasia berkaitan dengan: {currentCategory}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.categoryText}>Kategori: {currentCategory}</Text>
                    <Text style={styles.secretWord}>{currentWord}</Text>
                    <Text style={styles.instruction}>
                      Anda adalah Warga. Ketahui kata ini tetapi jangan beri tahu siapapun!
                    </Text>
                  </>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={nextPlayer}
              >
                <Text style={styles.nextButtonText}>
                  {currentPlayerIndex < players.length - 1 ? 'PEMAIN SELANJUTNYA' : 'MULAI GAME'}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </Animated.View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {players.map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.progressDot,
                  index <= currentPlayerIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A306D',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  playerCount: {
    fontSize: 16,
    color: '#DDD',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  swipeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '30%',
  },
  swipeInstruction: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  swipeArrow: {
    fontSize: 60,
    color: '#FFF',
  },
  roleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  roleTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  wordContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imposterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  hintContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD54F',
    width: '100%',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 5,
  },
  hintText: {
    fontSize: 14,
    color: '#333',
  },
  categoryText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  secretWord: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  nextButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#6C63FF',
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: '#FFF',
  },
});

export default RoleRevealScreen;