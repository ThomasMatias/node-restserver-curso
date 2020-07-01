const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ==========================
// Mostrar todas las categorias
// ==========================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}, 'nombre descripcion usuario')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                return res.json({
                    ok: true,
                    categoria: categoriasDB,
                    cuantos: conteo
                });
            });

        });

});

// ==========================
// Mostrar una categoria por ID
// ==========================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ==========================
// Crear nueva categoria
// ==========================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let usuario = req.usuario;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: usuario._id
    });

    categoria.save((err, categoriaDB) => {

        //Si hay un error por la parte del servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Si no crea la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ==========================
// Actualizar categoria
// ==========================

app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let ActualizaCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, ActualizaCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        //Si hay un error por la parte del servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Si no crea la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ==========================
// Crear nueva categoria
// ==========================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, ((err, categoriaEliminada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })

    }));

});






module.exports = app;