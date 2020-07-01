const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ==========================
// Obtener todos los productos
// ==========================

app.get('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let desde = body.desde || 0;
    desde = Number(desde);

    let limite = body.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos: productosDB,
                    cuantos: conteo
                });

            });

        });

});

// ==========================
// Obtener un producto por ID
// ==========================

app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })

        })

});

// ==========================
// Buscar productos
// ==========================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre descripcion')
        .exec((err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            });

        });

});

// ==========================
// Crear un nuevo producto
// ==========================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// ==========================
// Actualizar un producto
// ==========================

app.put('/productos/:id', verificaToken, (req, res) => {

    let body = req.body;

    let id = req.params.id;

    let ActualizarProductos = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible
    }

    Producto.findByIdAndUpdate(id, ActualizarProductos, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// ==========================
// Borrar un producto
// ==========================

app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let ActualizarDisponibilidad = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, ActualizarDisponibilidad, { new: true }, (err, productoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoEliminado,
            message: 'Producto Borrado'
        });
    })

});










module.exports = app;