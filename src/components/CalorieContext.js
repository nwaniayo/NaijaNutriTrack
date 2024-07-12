import React, { createContext, useState, useContext } from 'react';

const CalorieContext = createContext();

export const CalorieProvider = ({ children }) => {
  const [calorieRequirement, setCalorieRequirement] = useState(null);

  return (
    <CalorieContext.Provider value={{ calorieRequirement, setCalorieRequirement }}>
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalorie = () => {
  return useContext(CalorieContext);
};
