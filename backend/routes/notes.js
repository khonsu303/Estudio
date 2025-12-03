import express from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note.js';
import Subject from '../models/Subject.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/notes
// @desc    Obtener todas las notas (opcionalmente filtrar por materia ?subject=ID)
router.get('/', async (req, res) => {
    try {
        const query = { user: req.user.id };
        if (req.query.subject) {
            query.subject = req.query.subject;
        }

        const notes = await Note.find(query)
            .sort({ updatedAt: -1 })
            .populate('subject', 'name color icon'); // Traer datos de la materia

        res.json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener apuntes' });
    }
});

// @route   POST /api/notes
// @desc    Crear apunte
router.post('/', [
    body('title').trim().notEmpty().withMessage('El título es requerido'),
    body('content').notEmpty().withMessage('El contenido es requerido'),
    body('subject').notEmpty().withMessage('La materia es requerida')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // Verificar que la materia pertenezca al usuario
        const subject = await Subject.findOne({ _id: req.body.subject, user: req.user.id });
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Materia no válida' });
        }

        const note = await Note.create({
            ...req.body,
            user: req.user.id
        });

        // Popular datos de la materia para el frontend
        await note.populate('subject', 'name color icon');

        res.status(201).json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear apunte' });
    }
});

// @route   PUT /api/notes/:id
// @desc    Actualizar apunte
router.put('/:id', async (req, res) => {
    try {
        let note = await Note.findOne({ _id: req.params.id, user: req.user.id });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Apunte no encontrado' });
        }

        note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('subject', 'name color icon');

        res.json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar apunte' });
    }
});

// @route   DELETE /api/notes/:id
// @desc    Eliminar apunte
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
        if (!note) {
            return res.status(404).json({ success: false, message: 'Apunte no encontrado' });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Apunte eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar apunte' });
    }
});

export default router;
