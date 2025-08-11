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

//consultar todos los ingresos
app.get('/movimientos/ingreso/:id', async (req, res)=>{

    try {
        const egresos = await prisma.movimiento.findMany({
            where : {usuarioId : parseInt(req.params.id), tipo: 'ingreso'},
            include : {categoria: true},
            orderBy : {fecha : 'desc'}
        });
        res.status(200).json(egresos)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

//Agregar un nuevo ingreso
app.post('/ingreso/agregar', async (req, res)=>{
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

app.get('/movimientos/egreso/:id', async (req,res) =>{
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

app.post('/egreso/agregar', async (req, res)=>{
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
        res.status(200).json({message:error.message})
    }
})

//CATEGORIAS

//Agregar
app.post('/categoria/agregar', async (req, res) =>{
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
app.get('/categoria/consultar', async (req,res)=>{

})
//Modificar
app.put('/categoria/modificar', async (req,res)=>{

})
//Eliminar
app.delete('/categoria/eliminar', async (req, res)=>{
    
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})