import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '@env';

export const useGetCalorie = () => {
  const [calorie, setCalorie] = useState(null);
  const [calorieLoading, setLoading] = useState(true);
  const [calorieError, setError] = useState(null);
  
  const fetchCalorie = async () => {
    try {
      const response = await fetch("https://api.fitbit.com/1/user/-/activities/calories/date/2024-01-01/7d.json", {
        method: 'GET',
        headers: { "Authorization": "Bearer " + ACCESS_TOKEN }
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const json = await response.json();
      //console.log(json);
      const sixthIndex = json['activities-calories'][5];
      setCalorie({ dateTime: sixthIndex.dateTime, value: sixthIndex.value });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalorie();
  }, []);

  return {calorie, calorieLoading, calorieError }; // Returning an object instead of an array
};

export default useGetCalorie;
