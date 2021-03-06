// ==========================
// Puerto
// ==========================
process.env.PORT = process.env.PORT || 3000;


// ==========================
// Entorno
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Vencimiento del Token
// ==========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = '48h';


// ==========================
// SEED de autenticación
// ==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==========================
// Base de Datos
// ==========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = process.env.MONGO_LC || 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// ==========================
// Google Client ID
// ==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '571149244826-aab0mn9vfq58krd6nijjp58fr0f34ie9.apps.googleusercontent.com';