import express from 'express';
import { body, validationResult } from 'express-validator';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/events
// @desc    Obtener todos los eventos (ordenados por fecha próxima)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id })
            .sort({ date: 1 }) // Más cercanos primero
            .populate('subject', 'name color');
        res.json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener eventos' });
    }
});

// @route   POST /api/events
// @desc    Crear evento
router.post('/', [
    body('title').trim().notEmpty().withMessage('El título es requerido'),
    body('date').notEmpty().withMessage('La fecha es requerida'),
    body('type').isIn(['Examen', 'Exposición', 'Tarea', 'Proyecto', 'Otro']).withMessage('Tipo de evento inválido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const event = await Event.create({
            ...req.body,
            user: req.user.id
        });

        // Si tiene materia, popularla para devolver el objeto completo
        if (req.body.subject) {
            await event.populate('subject', 'name color');
        }

        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear evento' });
    }
});

// @route   PUT /api/events/:id
// @desc    Actualizar evento
router.put('/:id', async (req, res) => {
    try {
        let event = await Event.findOne({ _id: req.params.id, user: req.user.id });
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // Si se actualizó la materia, popularla de nuevo
        if (req.body.subject || event.subject) {
            await event.populate('subject', 'name color');
        }

        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar evento' });
    }
});

// @route   DELETE /api/events/:id
// @desc    Eliminar evento
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar evento' });
    }
});

export default router;
