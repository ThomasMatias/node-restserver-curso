const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let productosSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: false },
    img: { type: String, required: false },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

productosSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


module.exports = mongoose.model('Producto', productosSchema);