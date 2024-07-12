import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '@env'; // Ensure this is set up correctly in your environment

export const useGetWatch = () => {
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch('https://api.fitbit.com/1/user/-/profile.json', {
        method: 'GET',
        headers: { "Authorization": "Bearer " + ACCESS_TOKEN }
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const json = await response.json();
      //console.log(json)
      setProfile(json);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

 
    fetchProfile();
  }, []);

  return [profile, loading, error];
};

export default useGetWatch;
