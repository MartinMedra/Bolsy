const {PrismaClient}= require('@prisma/client')
const prisma = new PrismaClient();

// app.get('/api/usuario', async (req ,res)=>{
//     try{
//         const usuarios = await prisma.usuario.findMany();
//         res.json(usuarios);
//     }catch (error){
//         res.status(500).json({error: error.mensaje});
//     }
// })

app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password }
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});