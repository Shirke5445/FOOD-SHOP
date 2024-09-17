import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

export const userSliece = createSlice ({
    initialState,
    name: "userSlice",
    reducers: {
        setUser(state,action){
            state.user = action.payload;
        },
        setisAuthenticated (state,action){
          state.isAuthenticated = action.payload;
},
        setLoading(state,action) {  
        state.loading = action.payload;
        }
    },
});

export default userSliece.reducer;

export const {setIsAuthenticated, setUser, setLoading} = userSliece.actions