// ==========================
// Puerto
// ==========================
process.env.PORT = process.env.PORT || 3000;


// ==========================
// Entorno
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Base de Datos
// ==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = process.env.MONGO_LC;
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;