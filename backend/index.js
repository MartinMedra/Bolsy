const express = require('express');
const cors = require('cors')
require('dotenv').config();
const {PrismaClient} = require('@prisma/client')
const usuario = require('./routes/usuario')
const categoria = require('./routes/categoria')
const movimiento = require('./routes/movimiento')
const auth = require('./routes/auth');

const { authMiddleware } = require('./middleware/auth');


const prisma = new PrismaClient();
prisma.$connect().then(()=>console.log('Conectado a la base de datos')).catch(err => {
    console.error('❌ Error conectando a la base de datos', err)
})
const app = express();

const port  = process.env.PORT || 3001;
if(!process.env.DATABASE_URL){
    console.error("❌ DATABASE_URL no está configurada")
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET no está configurado");
    process.exit(1);
}

if (!process.env.FRONTEND_URL) {
    console.error("❌ FRONTEND_URL no está configurada");
    process.exit(1);
}

app.use(cors({
    // Para que solo mi frontend pueda hacer request
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

app.use('/auth', auth)
app.use('/usuarios', usuario)
app.use('/categorias', categoria)
app.use('/movimientos', movimiento)

app.get('/', (req, res) => {
    res.send('we did it!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

