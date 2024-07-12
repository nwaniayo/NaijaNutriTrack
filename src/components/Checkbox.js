// Checkbox.js

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const CheckBox = ({ value, onValueChange }) => {
  const [isChecked, setChecked] = useState(value);

  const onPress = () => {
    const newValue = !isChecked;
    setChecked(newValue);
    onValueChange(newValue);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      {isChecked ? (
        <Feather name={'check-square'} size={24} color={'black'} />
      ) : (
        <Feather name={'square'} size={24} color={'black'} />
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;
