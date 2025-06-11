import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useEffect } from 'react';
import { validateToken } from "@/services/auth";
import { setUser, clearUser } from "@/store/slices/userSlice"

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useInitializeAuth = () => {
    const dispatch = useDispatch();

    const initializeAuth = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            const response = await validateToken(token);
            if(response.success && response.employee){
                dispatch(setUser(response.employee))
            }
        } else {
            console.log("NO token foundd");
            dispatch(clearUser());
        }
    }

    useEffect(() => {
        initializeAuth();
    }, []);
}
