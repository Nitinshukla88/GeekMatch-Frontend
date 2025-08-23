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
        },
        updateMembershipType : (state, action) => {
            return {...state, membershipType: action.payload};
        }, 
        addVideoChatUser : (state, action) => {
            return {...state, videoChatUser: action.payload};
        }
    }
})

export const { addUser, removeUser, updateIsPremium, updateMembershipType, addVideoChatUser } = userSlice.actions;

export default userSlice.reducer;