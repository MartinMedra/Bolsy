const {PrismaClient} = require('@prisma/client')
const {Router} = require('express')

const prisma = new PrismaClient()
const router = Router()

//CATEGORIAS

//Agregar
router.post('/agregar', async (req, res) =>{
    const {usuarioId, nombre} = req.body;

    try {
        const agregarCategoria = await prisma.categoria.create({
            data: {usuarioId: parseInt(usuarioId), nombre}
        })
        res.json(agregarCategoria)
    } catch (error) {
        res.json({message: error.message})
    }
})

//Consultar
router.get('/consultar/:id', async (req,res)=>{
    try {
        categorias = await prisma.categoria.findMany({
            where : {usuarioId: parseInt(req.params.id)}
        })
        res.json(categorias)
        
    } catch (error) {
        res.json({message : error.message})
    }


})
//Modificar
router.put('/modificar', async (req,res)=>{

})
//Eliminar
router.delete('/eliminar', async (req, res)=>{
    
})

module.exports = router;