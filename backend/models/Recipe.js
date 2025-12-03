import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true,
        maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
    },
    category: {
        type: String,
        enum: ['Pasteles', 'Cupcakes', 'Galletas', 'Tartas', 'Postres', 'Otros'],
        default: 'Pasteles'
    },
    difficulty: {
        type: String,
        enum: ['Fácil', 'Media', 'Difícil'],
        default: 'Fácil'
    },
    prepTime: {
        type: Number, // minutos
        min: [0, 'El tiempo de preparación no puede ser negativo']
    },
    cookTime: {
        type: Number, // minutos
        min: [0, 'El tiempo de cocción no puede ser negativo']
    },
    servings: {
        type: Number,
        min: [1, 'Debe tener al menos 1 porción'],
        default: 1
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        }
    }],
    steps: [{
        stepNumber: {
            type: Number,
            required: true
        },
        instruction: {
            type: String,
            required: true
        }
    }],
    tips: {
        type: String,
        maxlength: [500, 'Los tips no pueden tener más de 500 caracteres']
    },
    imageUrl: {
        type: String
    },
    isFavorite: {
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

// Índice para búsqueda rápida
recipeSchema.index({ user: 1, createdAt: -1 });
recipeSchema.index({ title: 'text', description: 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
