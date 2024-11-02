import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { selectCurrentEmployeeId, selectCurrentToken, logOut } from '../features/auth/authSlice';

import useFetchInterceptor from './useFetchInterceptor';

const useFetchManagerResponses = () => {
    const [managerResponses, setManagerResponses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = useSelector(selectCurrentToken);
  
    const fetchWithInterceptor = useFetchInterceptor();

    const fetchManagerResponses = useCallback(async (leaveId) => {
        setLoading(true); 

        if (!token) {
            setError('No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetchWithInterceptor(`https://leave-portal-backend-1.onrender.com/managerResponseList/${leaveId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    
                    'Content-Type': 'application/json',
                },
            });
           

            if (!response.ok) {
                throw new Error('Failed to fetch manager responses');
            }

            const data = await response.json();
            setManagerResponses(data);
            setError(null); 
        } catch (error) {
            console.error('Error fetching manager responses:', error);
            setError('Error fetching manager responses');
        } finally {
            setLoading(false);  
        }
    }, []); 

    return { managerResponses, error, loading, fetchManagerResponses };
};

export default useFetchManagerResponses;

