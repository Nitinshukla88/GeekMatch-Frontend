import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : null,
    reducers : {
        addUser : (state, action) => {
            return action.payload;
        },
        removeUser : (state, action) => {
            return null;
        }, 
        updateIsPremium : (state, action) => {
            return {...state, isPremium: action.payload};
        }
    }
})

export const { addUser, removeUser, updateIsPremium } = userSlice.actions;

export default userSlice.reducer;