import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name : "requests",
    initialState: null, 
    reducers : {
        addRequests : (state, action) => action.payload,
        removeRequest : (state, action) => {
            const newArray = state.filter(request => request?._id !== action.payload);
            return newArray;
        },
        removeAllRequests : (state, action) => null
    }
})

export const {addRequests, removeRequest, removeAllRequests} = requestsSlice.actions;

export default requestsSlice.reducer;