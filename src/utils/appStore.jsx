import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./appStoreSlices/userSlice";

const appStore = configureStore({
    reducer : {
        user : userReducer,
    }
})

export default appStore;