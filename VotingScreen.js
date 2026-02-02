import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';

const VotingScreen = ({ navigation, route }) => {
  const {
    players,
    imposters,
    currentCategory,
    currentWord,
    isCurrentPlayerImposter,
    selectedCategories,
  } = route.params;
  
  const [votes, setVotes] = useState({});
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [voteResults, setVoteResults] = useState({});
  const [revealedImposters, setRevealedImposters] = useState([]);
  
  const currentVoter = players[currentVoterIndex];
  
  useEffect(() => {
    // Initialize votes object
    const initialVotes = {};
    players.forEach(player => {
      initialVotes[player.id] = [];
    });
    setVotes(initialVotes);
  }, []);
  
  const castVote = (voterId, votedPlayerId) => {
    const newVotes = { ...votes };
    
    // Remove previous vote from this voter
    Object.keys(newVotes).forEach(playerId => {
      newVotes[playerId] = newVotes[playerId].filter(voter => voter !== voterId);
    });
    
    // Add new vote
    newVotes[votedPlayerId] = [...newVotes[votedPlayerId], voterId];
    setVotes(newVotes);
    
    // Move to next voter
    if (currentVoterIndex < players.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    } else {
      calculateResults();
    }
  };
  
  const calculateResults = () => {
    const results = {};
    let maxVotes = 0;
    let votedOutPlayerId = null;
    
    // Count votes for each player
    Object.keys(votes).forEach(playerId => {
      const voteCount = votes[playerId].length;
      results[playerId] = voteCount;
      
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        votedOutPlayerId = playerId;
      }
    });
    
    setVoteResults(results);
    setShowResults(true);
    
    // Reveal if voted out player is imposter
    if (votedOutPlayerId && imposters.includes(votedOutPlayerId)) {
      setRevealedImposters([...revealedImposters, votedOutPlayerId]);
      
      // Check if all imposters are revealed
      const remainingImposters = imposters.filter(id => 
        !revealedImposters.includes(id) && id !== votedOutPlayerId
      );
      
      if (remainingImposters.length === 0) {
        setTimeout(() => {
          Alert.alert(
            'Game Over!',
            'Semua imposter telah ditemukan! Warga menang!',
            [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
          );
        }, 2000);
      }
    }
  };
  
  const continueGame = () => {
    // Navigate back to game with new round
    navigation.navigate('Game', {
      players: players.filter(p => !revealedImposters.includes(p.id)),
      imposters: imposters.filter(id => !revealedImposters.includes(id)),
      selectedCategories,
      imposterHint: true,
      roundDuration: 120,
      initialCategory: currentCategory,
      initialWord: currentWord,
    });
  };
  
  const renderPlayerItem = ({ item }) => {
    const isImposter = imposters.includes(item.id);
    const isRevealed = revealedImposters.includes(item.id);
    const voteCount = votes[item.id]?.length || 0;
    const hasVoted = votes[item.id]?.includes(currentVoter?.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.playerCard,
          hasVoted && styles.votedCard,
          isRevealed && styles.revealedCard,
        ]}
        onPress={() => castVote(currentVoter.id, item.id)}
        disabled={showResults || item.id === currentVoter?.id}
      >
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          {showResults && (
            <Text style={styles.voteCount}>Votes: {voteResults[item.id] || 0}</Text>
          )}
        </View>
        
        {isRevealed && (
          <View style={styles.imposterBadge}>
            <Text style={styles.imposterText}>IMPOSTER</Text>
          </View>
        )}
        
        {!showResults && item.id !== currentVoter?.id && (
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => castVote(currentVoter.id, item.id)}
          >
            <Text style={styles.voteButtonText}>VOTE</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderResultItem = ({ item }) => {
    const isImposter = imposters.includes(item.id);
    const voteCount = voteResults[item.id] || 0;
    
    return (
      <View style={[
        styles.resultCard,
        isImposter && styles.imposterResultCard,
      ]}>
        <View style={styles.resultPlayerInfo}>
          <Text style={styles.resultPlayerName}>{item.name}</Text>
          <Text style={styles.resultPlayerRole}>
            {isImposter ? '⚡ Imposter' : '🛡️ Warga'}
          </Text>
        </View>
        <View style={styles.resultVotes}>
          <Text style={styles.resultVoteCount}>{voteCount}</Text>
          <Text style={styles.resultVoteLabel}>votes</Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voting</Text>
        <Text style={styles.subtitle}>
          {showResults ? 'Hasil Voting' : `${currentVoter?.name} sedang memilih`}
        </Text>
      </View>
      
      <View style={styles.gameInfo}>
        <Text style={styles.categoryText}>Kategori: {currentCategory}</Text>
        <Text style={styles.wordText}>Kata: {currentWord}</Text>
      </View>
      
      {!showResults ? (
        <>
          <View style={styles.votingInstruction}>
            <Text style={styles.instructionText}>
              {currentVoter?.name}, pilih siapa yang menurut Anda adalah Imposter!
            </Text>
            <Text style={styles.instructionNote}>
              Anda tidak dapat memilih diri sendiri
            </Text>
          </View>
          
          <FlatList
            data={players.filter(p => p.id !== currentVoter?.id)}
            renderItem={renderPlayerItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.playerList}
          />
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Pemain {currentVoterIndex + 1} dari {players.length}
            </Text>
            <View style={styles.progressBar}>
              {players.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index <= currentVoterIndex && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Hasil Voting</Text>
            <FlatList
              data={players}
              renderItem={renderResultItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.resultsList}
            />
            
            {revealedImposters.length > 0 && (
              <View style={styles.revealedContainer}>
                <Text style={styles.revealedTitle}>
                  Imposter yang terungkap:
                </Text>
                {players
                  .filter(p => revealedImposters.includes(p.id))
                  .map(player => (
                    <View key={player.id} style={styles.revealedPlayer}>
                      <Text style={styles.revealedPlayerName}>{player.name}</Text>
                      <Text style={styles.revealedPlayerRole}>⚡ Imposter</Text>
                    </View>
                  ))
                }
              </View>
            )}
          </View>
          
          <View style={styles.continueContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={continueGame}
            >
              <Text style={styles.continueButtonText}>LANJUTKAN GAME</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.continueButton, styles.restartButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.restartButtonText}>GAME BARU</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A306D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#DDD',
    marginTop: 5,
  },
  gameInfo: {
    padding: 15,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  votingInstruction: {
    padding: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  playerList: {
    padding: 20,
  },
  playerCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  votedCard: {
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  revealedCard: {
    backgroundColor: '#FFE8E8',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  imposterBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  imposterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  voteButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  voteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  progressContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: '#6C63FF',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imposterResultCard: {
    backgroundColor: '#FFE8E8',
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B6B',
  },
  resultPlayerInfo: {
    flex: 1,
  },
  resultPlayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resultPlayerRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resultVotes: {
    alignItems: 'center',
    minWidth: 60,
  },
  resultVoteCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultVoteLabel: {
    fontSize: 12,
    color: '#666',
  },
  revealedContainer: {
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD54F',
    marginTop: 20,
  },
  revealedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 10,
  },
  revealedPlayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFECB3',
  },
  revealedPlayerName: {
    fontSize: 16,
    color: '#333',
  },
  revealedPlayerRole: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  continueContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  restartButtonText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VotingScreen;