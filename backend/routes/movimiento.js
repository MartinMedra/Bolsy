const {PrismaClient} = require('@prisma/client')
const {Router} = require('express')

// MIDDLEWARE
const {authMiddleware} = require('../middleware/auth')

const prisma = new PrismaClient();
const router = Router();

//consultar todos los ingresos
router.get('/movimientos/ingreso/:id', authMiddleware, async (req, res)=>{

    try {
        const ingreso = await prisma.movimiento.findMany({
            where : {usuarioId : parseInt(req.params.id), tipo: 'ingreso'},
            include : {categoria: true},
            orderBy : {fecha : 'desc'}
        });
        res.status(200).json(ingreso)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

//Agregar un nuevo ingreso
router.post('/ingreso/agregar', async (req, res)=>{
    try {
        const { usuarioId, fecha, nombre, monto, categoriaId, descripcion } = req.body;
        const categoriaExiste = await prisma.categoria.findUnique({where: {id: categoriaId}})
        if(!categoriaExiste){
            res.status(400).json("La categoría no se ha encontrado")
        }
        const nuevoIngreso= await prisma.movimiento.create({
            data: {
            usuarioId,
            fecha: new Date(fecha), // Acepta string ISO (ej: "2024-06-10T12:00:00Z") o "YYYY-MM-DD"
            nombre,
            monto: parseFloat(monto),
            tipo: 'ingreso',
            categoriaId,
            descripcion
            }
        })

        

        res.status(200).json(nuevoIngreso)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.get('/movimientos/egreso/:id', async (req,res) =>{
    try {
        const egresos = await prisma.movimiento.findMany({
            where : {usuarioId: parseInt(req.params.id), tipo: 'egreso'},
            include : {categoria: true},
            orderBy : {fecha: 'desc'}
        });
        if(egresos.length > 0){
            res.json(egresos)
        }else{
            res.json({
                message: 'No se encontraron registros',
                data: []
            });
        }
    } catch (error) {
        res.json({
            error: error.message
        })
    }
})

router.post('/egreso/agregar', async (req, res)=>{
    try {
        const {usuarioId,fecha,nombre,monto,categoriaId,descripcion} = req.body;
        const categoriaExiste = await prisma.categoria.findUnique({
            where : {id: parseInt(categoriaId)}
        });
        if(!categoriaExiste){
            res.status(400).json({message:'No se ha encontrado la categoria'})
        }

        const nuevoEgreso = await prisma.movimiento.create({
            data : {
                usuarioId,
                fecha : new Date(fecha),
                nombre,
                tipo: 'egreso',
                monto : parseFloat(monto),
                categoriaId,
                descripcion
            }
        });

        res.json(nuevoEgreso)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


module.exports = router;