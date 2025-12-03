import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'El título del evento es requerido'],
        trim: true,
        maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    date: {
        type: Date,
        required: [true, 'La fecha del evento es requerida']
    },
    type: {
        type: String,
        enum: ['Examen', 'Exposición', 'Tarea', 'Proyecto', 'Otro'],
        default: 'Otro'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: false // Puede ser un evento general no ligado a una materia
    },
    description: {
        type: String,
        maxlength: [200, 'La descripción no puede tener más de 200 caracteres']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

eventSchema.index({ user: 1, date: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
