const {PrismaClient} = require('@prisma/client')
const express = require('express')

const prisma = new PrismaClient();
const app = express();

app.use(express.json())

app.post('/register', async (req, res) =>{
  try {
   const {nombre,email,password} = req.body;

  const usuario = await prisma.usuario.create({
    data : {nombre,email,password}
  });

  res.json(usuario) 
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

