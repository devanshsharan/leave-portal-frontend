import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";


import { selectCurrentEmployeeId,selectCurrentRole, setCredentials, logOut, selectCurrentToken } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://leave-portal-backend-1.onrender.com';

const useFetchInterceptor = () => {
    const dispatch = useDispatch();
    const jwtToken = useSelector(selectCurrentToken);
    const employeeId = useSelector(selectCurrentEmployeeId);
    const role = useSelector(selectCurrentRole);
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            const expiryTime = decoded.exp * 1000; 
            return Date.now() > expiryTime;
        } catch (error) {
            console.error("Error decoding token:", error);
            return true;
        }
    };

    const refreshToken = async () => {
        const response = await fetch(`${API_BASE_URL}/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(setCredentials({
                role,
                employeeId,
                accessToken: data.jwt,
            }));
            return data.jwt;
        } else {
            dispatch(logOut());
            navigate('/');
            return null;
        }
    };

    const fetchWithInterceptor = async (url, options = {}) => {
        if (isTokenExpired(jwtToken)) {
            const newToken = await refreshToken();
            if (newToken) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${newToken}`,
                };
            } else {
                throw new Error('Unable to refresh token');
            }
        } else {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${jwtToken}`,
            };
        }
        const response = await fetch(url, options);
        
        if (response.status === 401 || response.status === 403) {
            dispatch(logOut());
            navigate('/');
        }

        return response;
    };

    return fetchWithInterceptor;
};

export default useFetchInterceptor;
