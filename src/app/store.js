import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from '../features/auth/authSlice.js';
import leaveReducer from '../features/auth/leaveSlice.js';
import { logOut } from "../features/auth/authSlice.js";

const persistConfig = {
    key: 'root',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        leave: leaveReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
                ignoredPaths: ['register'], 
            },
        }),
    devTools: process.env.NODE_ENV !== 'production', 
});

export const persistor = persistStore(store);

const token = localStorage.getItem('token'); 

if (token) {
    store.dispatch(setCredentials({ accessToken: token })); 
} else {
    store.dispatch(logOut()); 
}