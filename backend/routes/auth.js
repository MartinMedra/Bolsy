const {PrismaClient} = require('@prisma/client')
const {Router} = require('express') 

const prisma = new PrismaClient();
const router = Router();


router.post('/register', async (req,res)=>{
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


module.exports = router;