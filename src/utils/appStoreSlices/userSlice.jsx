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
        updateIsSilverPremium : (state, action) => {
            return {...state, isSilverPremium: action.payload};
        },
        updateIsGoldPremium : (state, action) => {
            return {...state, isGoldPremium: action.payload};
        }
    }
})

export const { addUser, removeUser, updateIsSilverPremium, updateIsGoldPremium } = userSlice.actions;

export default userSlice.reducer;