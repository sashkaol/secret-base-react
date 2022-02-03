import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    login: localStorage.user,
    token: null,
    id: localStorage.id,
    rights: localStorage.rights
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.login = action.payload.login;
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.rights = action.payload.rights;
            localStorage.setItem('user', state.login);
            localStorage.setItem('id', state.id);
            localStorage.setItem('rights', state.rights);
        },
        removeUser(state) {
            state.login = null;
            state.token = null;
            state.id = null;
            state.rights = null;
            localStorage.removeItem('user');
            localStorage.removeItem('id');
            localStorage.removeItem('rights');
        },
    }
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;