const express = require('express');
const cors = require('cors')
require('dotenv').config();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const app = express();
const port  = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('we did it!');
});

app.post('/register', async (req,res)=>{
    try {
    const {nombre, email, password} = req.body;

    const usuario = await prisma.usuario.create({
        data : {nombre,email,password}
    });

    res.status(200).json(usuario)

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

app.get('/usuarios', async (req ,res)=>{
    try {
        const Usuario = await prisma.usuario.findMany();
        res.json(Usuario);
    } catch (error) {
        res.json({error:error.message});
    }
});

// app.get('/api/usuario', async (req ,res)=>{
//     try{
//         const usuarios = await prisma.usuario.findMany();
//         res.json(usuarios);
//     }catch (error){
//         res.status(500).json({error: error.mensaje});
//     }
// })

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})