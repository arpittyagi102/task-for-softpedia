import { API_URL } from "@/utils/constants";
import { User, UserCredentials } from "@/types";

export async function signUp(data: UserCredentials): Promise<AuthResponse> {
    try {
        const response = await fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

        if (!response.ok || !result.token) {
            return {
                success: false,
                token: "",
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, token: result.token, employee: result.employee };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        error.message = customError(error.message);
        return { success: false, message: error.message || "Network error", token: "" };
    }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();

        if (!response.ok || !result.token) {
            return {
                success: false,
                token: "",
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, token: result.token, employee: result.employee };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        error.message = customError(error.message);
        return { success: false, message: error.message || "Network error", token: "" };
    }
}

export async function validateToken(token: string): Promise<AuthResponse> {
    try {
        const response = await fetch(API_URL + "/auth/validate-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
        });
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                token: "",
                message: result.message || "Something went wrong",
            };
        }

        return { success: true, token: token, employee: result.employee };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        error.message = customError(error.message);
        return { success: false, message: error.message || "Network error", token: "" };
    }
}

function customError(message: string): string {
    return message == "Failed to fetch"
        ? "Backend is not running or unreachable"
        : message;
}

type AuthResponse = { success: boolean; token: string, message?: string, employee?: User}