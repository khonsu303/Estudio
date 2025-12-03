import express from 'express';
import { body, validationResult } from 'express-validator';
import Subject from '../models/Subject.js';
import Note from '../models/Note.js'; // Para borrar notas en cascada
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/subjects
// @desc    Obtener todas las materias
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json({ success: true, subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener materias' });
    }
});

// @route   POST /api/subjects
// @desc    Crear materia
router.post('/', [
    body('name').trim().notEmpty().withMessage('El nombre es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const subject = await Subject.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json({ success: true, subject });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Ya tienes una materia con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al crear materia' });
    }
});

// @route   PUT /api/subjects/:id
// @desc    Actualizar materia
router.put('/:id', async (req, res) => {
    try {
        let subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        }

        subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, subject });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar materia' });
    }
});

// @route   PUT /api/subjects/:id
// @desc    Actualizar materia
router.put('/:id', [
    body('name').optional().trim().notEmpty().withMessage('El nombre es requerido'),
    body('color').optional().isHexColor().withMessage('Color inválido')
], async (req, res) => {
    try {
        let subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        }

        subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, subject });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar materia' });
    }
});

// @route   DELETE /api/subjects/:id
// @desc    Eliminar materia y sus notas
router.delete('/:id', async (req, res) => {
    try {
        const subject = await Subject.findOne({ _id: req.params.id, user: req.user.id });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        }

        // Eliminar notas asociadas
        await Note.deleteMany({ subject: req.params.id });
        await Subject.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Materia y apuntes eliminados' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar materia' });
    }
});

export default router;
