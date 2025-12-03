import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'El nombre de la materia es requerido'],
        trim: true,
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
    },
    color: {
        type: String,
        default: '#ec4899' // Color rosa por defecto
    },
    icon: {
        type: String,
        default: '📚'
    },
    description: {
        type: String,
        maxlength: [200, 'La descripción no puede tener más de 200 caracteres']
    },
    professor: {
        type: String,
        trim: true,
        maxlength: [50, 'El nombre del profesor no puede tener más de 50 caracteres']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice compuesto para que un usuario no tenga dos materias con el mismo nombre
subjectSchema.index({ user: 1, name: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
