const express = require('express');
const cors = require('cors')
require('dotenv').config();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const usuario = require('./routes/usuario')
const categoria = require('./routes/categoria')
const movimiento = require('./routes/movimiento')
const auth = require('./routes/auth')

const app = express();
const port  = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', auth)
app.use('/usuario', usuario)
app.use('/categoria', categoria)
app.use('/movimiento', movimiento)

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('we did it!');
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})