import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./appStoreSlices/userSlice";
import feedReducer from "./appStoreSlices/feedSlice";
import connectionReducer from "./appStoreSlices/connectionSlice";
import requestsReducer from "./appStoreSlices/requestsSlice";

const appStore = configureStore({
    reducer : {
        user : userReducer,
        feed : feedReducer,
        connections : connectionReducer,
        requests : requestsReducer
    }
})

export default appStore;