import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./appStoreSlices/userSlice";
import feedReducer from "./appStoreSlices/feedSlice";

const appStore = configureStore({
    reducer : {
        user : userReducer,
        feed : feedReducer
    }
})

export default appStore;