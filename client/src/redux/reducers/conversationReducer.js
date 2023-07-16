import { createReducer, createAction } from "@reduxjs/toolkit";

const initialState = {
    allConversations: []
};

export const getAllConversations = createAction("GET_ALL_CONVERSATIONS");

const conversationReducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllConversations, (state, action) => {
        state.allConversations = action.payload;
    });
});

export default conversationReducer;