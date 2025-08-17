import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name : "connection",
    initialState : null,
    reducers : {
        addConnections : (state, action) => action.payload,
        addNewConnection : (state, action) => {
            state.push(action.payload);
        },
        removeConnections : () => null,
        removeConnection : (state, action) => {
            return state.filter(connection => connection._id !== action.payload);
        }
    }
})

export const { addConnections, removeConnections, addNewConnection, removeConnection } = connectionSlice.actions;

export default connectionSlice.reducer;