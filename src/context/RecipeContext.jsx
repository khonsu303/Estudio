import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecipeContext = createContext(null);

const API_URL = 'http://localhost:5000/api/recipes';

export const useRecipes = () => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipes debe ser usado dentro de un RecipeProvider');
    }
    return context;
};

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // Obtener todas las recetas
    const fetchRecipes = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setRecipes(data.recipes);
            }
        } catch (error) {
            console.error('Error al obtener recetas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Crear nueva receta
    const createRecipe = async (recipeData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipeData)
            });

            const data = await response.json();
            if (data.success) {
                setRecipes([data.recipe, ...recipes]);
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Error al crear receta:', error);
            return { success: false, error: 'Error al crear receta' };
        }
    };

    // Actualizar receta
    const updateRecipe = async (id, recipeData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipeData)
            });

            const data = await response.json();
            if (data.success) {
                setRecipes(recipes.map(r => r._id === id ? data.recipe : r));
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Error al actualizar receta:', error);
            return { success: false, error: 'Error al actualizar receta' };
        }
    };

    // Eliminar receta
    const deleteRecipe = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setRecipes(recipes.filter(r => r._id !== id));
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Error al eliminar receta:', error);
            return { success: false, error: 'Error al eliminar receta' };
        }
    };

    // Marcar/desmarcar favorito
    const toggleFavorite = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}/favorite`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setRecipes(recipes.map(r => r._id === id ? data.recipe : r));
                return { success: true };
            }
        } catch (error) {
            console.error('Error al marcar favorito:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRecipes();
        }
    }, [token]);

    const value = {
        recipes,
        loading,
        fetchRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite
    };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );
};
