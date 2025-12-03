import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(formData.name, formData.email, formData.password);
            }

            if (!result.success) {
                setError(result.error || 'Algo salió mal. Por favor intenta de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-container fade-in">
                <div className="login-card card">
                    <div className="login-header">
                        <div className="logo-container">
                            <div className="logo-icon">
                                🧁
                            </div>
                        </div>
                        <h1 className="login-title gradient-text">
                            {isLogin ? '¡Hola de Nuevo! 💕' : 'Únete a Nosotros 🧁'}
                        </h1>
                        <p className="login-subtitle">
                            {isLogin
                                ? 'Inicia sesión para ver tus recetas dulces'
                                : 'Crea tu cuenta y guarda tus recetas favoritas'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {!isLogin && (
                            <div className="form-group slide-in">
                                <label htmlFor="name" className="form-label">Nombre completo</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="input"
                                    placeholder="Ingresa tu nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    autoComplete="name"
                                />
                            </div>
                        )}

                        <div className="form-group slide-in">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="input"
                                placeholder="nombre@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group slide-in">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                            {!isLogin && (
                                <span className="input-hint">Mínimo 6 caracteres</span>
                            )}
                        </div>

                        {error && (
                            <div className="error-message slide-in" role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Iniciar Sesión 💖' : 'Registrarse 🧁'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="toggle-mode">
                        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                        <button type="button" onClick={toggleMode} className="toggle-link">
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </div>
                </div>

                <div className="login-footer">
                    <p>© 2025 Mis Recetas Dulces. Hecho con amor 💕</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
