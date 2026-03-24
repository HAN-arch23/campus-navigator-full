import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Set axios default header
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    // Load user data
    const loadUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/me`);
            setUser(response.data.user);
        } catch (error) {
            console.error('Error loading user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Signup
    const signup = async (name, email, password, role = 'student') => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/signup`, {
                name,
                email,
                password,
                role
            });

            const { token: newToken, user: newUser } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            const { token: newToken, user: newUser } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // Update profile
    const updateProfile = async (name, email) => {
        try {
            const response = await axios.put(`${API_URL}/api/auth/update-profile`, {
                name,
                email
            });

            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    // Forgot password
    const forgotPassword = async (email) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
                email
            });

            return {
                success: true,
                message: response.data.message,
                resetToken: response.data.resetToken // For development
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Request failed'
            };
        }
    };

    // Reset password
    const resetPassword = async (resetToken, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password/${resetToken}`, {
                password
            });

            const { token: newToken } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Reset failed'
            };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        signup,
        login,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
