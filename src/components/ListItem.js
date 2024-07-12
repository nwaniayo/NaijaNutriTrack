import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import moment from "moment";

const ListItem = (props) => {
  const { dateTime, value } = props

  const { item, date, temp, dateTextWrapper } = styles;

  return (
    <View style={item}>
      <Feather name={'activity'} size={50} color={'white'} />
      <View style={dateTextWrapper}>
        <Text style={date}>{dateTime}</Text>
        <Text style={temp}>{value}</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 5,
    backgroundColor: 'indianred'
  },
  temp: {
    color: 'white',
    fontSize: 20
  },
  date: {
    color: 'white',
    fontSize: 15
  },
  dateTextWrapper: {
    flexDirection: 'column'
  }
});

export default ListItem;
