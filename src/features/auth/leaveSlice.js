

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leaveRequestId: null, 
};

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        setLeaveRequestId(state, action) {
            state.leaveRequestId = action.payload;
        },
        clearLeaveRequestId(state) {
            state.leaveRequestId = null;
        },
    },
});

export const { setLeaveRequestId, clearLeaveRequestId } = leaveSlice.actions;

export default leaveSlice.reducer;
