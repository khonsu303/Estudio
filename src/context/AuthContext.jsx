import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// URL del backend API
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Verificar si hay un token guardado y validar el usuario
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');

            if (savedToken) {
                try {
                    // Verificar el token con el backend
                    const response = await fetch(`${API_URL}/me`, {
                        headers: {
                            'Authorization': `Bearer ${savedToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                        setToken(savedToken);
                    } else {
                        // Token inválido, limpiar localStorage
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Error al verificar token:', error);
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            if (data.success) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
                return { success: true };
            } else {
                throw new Error(data.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                error: error.message || 'Error de conexión con el servidor'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            if (data.success) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
                return { success: true };
            } else {
                throw new Error(data.message || 'Error al registrar');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                error: error.message || 'Error de conexión con el servidor'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updateProfile = async (name, email) => {
        try {
            const response = await fetch(`${API_URL}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar perfil');
            }

            if (data.success) {
                setUser(data.user);
                return { success: true };
            } else {
                throw new Error(data.message || 'Error al actualizar');
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            return {
                success: false,
                error: error.message || 'Error de conexión con el servidor'
            };
        }
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
