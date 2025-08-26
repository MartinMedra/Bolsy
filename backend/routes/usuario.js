const {PrismaClient} = require('@prisma/client')
const {Router} = require('express') 

const prisma = new PrismaClient();
const router = Router();

router.get('/usuarios', async (req ,res)=>{
    try {
        const Usuario = await prisma.usuario.findMany();
        res.json(Usuario);
    } catch (error) {
        res.json({error:error.message});
    }
});


module.exports = router;
