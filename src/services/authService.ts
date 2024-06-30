// src/services/authService.ts
import axios from 'axios';
import config from '../config';

interface AuthResponse {
    id: number;
    username: string;
    role: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${config.apiBaseUrl}auth/login`, { username, password });
        return response.data;
    } catch (error) {
        throw new Error('Credenciais inválidas!');
    }
};
