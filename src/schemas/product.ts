import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    imagen: { type: String },
    status: { type: String, enum: ['proceso', 'disponible', 'finalizada'], default: 'disponible' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        versionKey: false,
        toJSON: {
            transform: function (doc, ret) {
                return ret;
            }
        }
    });

export interface Product extends Document {
    id?: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen: string;
    status: string;
    userId: string; 
}
