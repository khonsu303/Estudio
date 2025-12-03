import express from 'express';
import { body, validationResult } from 'express-validator';
import Recipe from '../models/Recipe.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// @route   GET /api/recipes
// @desc    Obtener todas las recetas del usuario
// @access  Private
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: recipes.length,
            recipes
        });
    } catch (error) {
        console.error('Error al obtener recetas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener recetas'
        });
    }
});

// @route   GET /api/recipes/:id
// @desc    Obtener una receta por ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada'
            });
        }

        res.json({
            success: true,
            recipe
        });
    } catch (error) {
        console.error('Error al obtener receta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener receta'
        });
    }
});

// @route   POST /api/recipes
// @desc    Crear nueva receta
// @access  Private
router.post('/', [
    body('title').trim().notEmpty().withMessage('El título es requerido'),
    body('category').isIn(['Pasteles', 'Cupcakes', 'Galletas', 'Tartas', 'Postres', 'Otros']).optional(),
    body('ingredients').isArray({ min: 1 }).withMessage('Debes agregar al menos un ingrediente')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const recipeData = {
            ...req.body,
            user: req.user.id
        };

        const recipe = await Recipe.create(recipeData);

        res.status(201).json({
            success: true,
            message: 'Receta creada exitosamente',
            recipe
        });
    } catch (error) {
        console.error('Error al crear receta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear receta',
            error: error.message
        });
    }
});

// @route   PUT /api/recipes/:id
// @desc    Actualizar receta
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let recipe = await Recipe.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada'
            });
        }

        recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Receta actualizada exitosamente',
            recipe
        });
    } catch (error) {
        console.error('Error al actualizar receta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar receta'
        });
    }
});

// @route   DELETE /api/recipes/:id
// @desc    Eliminar receta
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada'
            });
        }

        await Recipe.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Receta eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar receta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar receta'
        });
    }
});

// @route   PATCH /api/recipes/:id/favorite
// @desc    Marcar/desmarcar receta como favorita
// @access  Private
router.patch('/:id/favorite', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada'
            });
        }

        recipe.isFavorite = !recipe.isFavorite;
        await recipe.save();

        res.json({
            success: true,
            message: recipe.isFavorite ? 'Agregada a favoritos' : 'Removida de favoritos',
            recipe
        });
    } catch (error) {
        console.error('Error al actualizar favorito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar favorito'
        });
    }
});

export default router;
