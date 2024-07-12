// Foodlist.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '../components/Checkbox';

const Foodlist = ({ foodItem, updateTask }) => {
  const { id, name, protein, carbohydrate, fat } = foodItem;

  return (
    <View style={styles.container}>
      <View style={styles.foodItem}>
        <Text style={styles.foodName}>{name}</Text>
        <View style={styles.nutrientContainer}>
          <Text style={styles.nutrientText}>Protein: {protein}g</Text>
          <Text style={styles.nutrientText}>Carbs: {carbohydrate}g</Text>
          <Text style={styles.nutrientText}>Fat: {fat}g</Text>
        </View>
      </View>
      <CheckBox
        style={styles.checkbox}
        value={!!foodItem.completedAt}
        onValueChange={(isChecked) => updateTask(id, isChecked)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  foodItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nutrientContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  nutrientText: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  checkbox: {
    marginLeft: 10,
  },
});

export default Foodlist;
