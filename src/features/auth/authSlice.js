import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        role: null,
        employeeId: null,
        token: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { role, employeeId, accessToken } = action.payload;
            state.role = role;
            state.employeeId = employeeId;
            state.token = accessToken;
        },
        logOut: (state) => {
            state.role = null;
            state.employeeId = null;
            state.token = null;
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentRole = (state) => state.auth.role;
export const selectCurrentEmployeeId = (state) => state.auth.employeeId;
export const selectCurrentToken = (state) => state.auth.token;
