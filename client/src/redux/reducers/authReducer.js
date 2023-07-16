import { createReducer, createAction } from "@reduxjs/toolkit";

const initialState = {
    currentUser: {
        token: "",
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        avatar: "",
        expiredDate: new Date()
    }
};

export const login = createAction("LOGIN");
export const logout = createAction("LOGOUT");

const authReducer = createReducer(initialState, (builder) => {
    builder.addCase(login, (state, action) => {
        state.currentUser = action.payload;
    })
    .addCase(logout, (state) => {
        state.currentUser = {
            token: "",
            id: "",
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            avatar: "",
            expiredDate: new Date()
        }
    });
});

export default authReducer;