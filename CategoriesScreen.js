import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { categories } from '../data/categories';

const CategoriesScreen = ({ navigation, route }) => {
  const { players } = route.params;
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  const continueToSettings = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Pilih Kategori', 'Pilih minimal 1 kategori');
      return;
    }
    
    const selectedCategoryObjects = categories.filter(cat => 
      selectedCategories.includes(cat.id)
    );
    
    navigation.navigate('Settings', {
      players,
      selectedCategories: selectedCategoryObjects,
    });
  };
  
  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategories.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { backgroundColor: item.color + (isSelected ? 'FF' : '40') },
        ]}
        onPress={() => toggleCategory(item.id)}
      >
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>✓ TERPILIH</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kategori</Text>
        <Text style={styles.subtitle}>
          Pilih kategori untuk permainan. Minimal 1 kategori.
        </Text>
        <Text style={styles.selectedCount}>
          {selectedCategories.length} kategori terpilih
        </Text>
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.categoryList}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedCategories.length === 0 && styles.disabledButton,
        ]}
        onPress={continueToSettings}
        disabled={selectedCategories.length === 0}
      >
        <Text style={styles.continueButtonText}>
          LANJUT KE PENGATURAN
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
    marginBottom: 10,
  },
  selectedCount: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  categoryList: {
    padding: 20,
  },
  categoryCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#000',
    opacity: 0.9,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  continueButton: {
    margin: 20,
    paddingVertical: 15,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;