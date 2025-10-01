const {PrismaClient} = require("@prisma/client")
const {Router} = require("express")

//MIDDLEWARE
const {authMiddleware} = require("../middleware/auth");
const { empty } = require("@prisma/client/runtime/library");

const prisma = new PrismaClient();
const router = Router();

// ========================================= RESTful ROUTES ==========================================

// RESUMEN FINANCIERO PRINCIPAL
router.get("/:userId/summary", authMiddleware,async(req,res) =>{

    const userIdFromToken = req.user.id;
    const userIdFromUrl = parseInt(req.params.userId);

    if(userIdFromToken !== userIdFromUrl){
        return res.status(403).json({error: 'No tiene permiso para ver esta información'})
    }
    
    try {
        //Para que no se me olvide: Meter todos los movimientos en uno solo y traer absolutamente todo
        //Haciendo la logica por aparte
        const ingresos = await prisma.movimiento.findMany({
            where : {
                usuarioId: userIdFromToken,
                activo:true,
                tipo: 'INGRESO'
            }
        })

        if(!ingresos){
            // res.status(401).json({error: 'No se encontraron ingresos'})
            ingresos = res.json({error: 'No se encontraron ingresos'})
        }

        const egresos = await prisma.movimiento.findMany({
            where: {
                usuarioId: userIdFromToken,
                activo: true,
                tipo: "EGRESO"
            }
        })
        console.log('Egresos antes del condicional' ,egresos);

        if(!egresos || egresos.length === 0){
            egresos.push({message: "No se encontraron egresos"})
        }


        res.json({succes: true, data: {ingresos, egresos}})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    //balanceTotal
    //totalIngresos
    //totalegresos
    //periodoActual
    //variacionMensual
    //movimientosRecientes
      
});

router.get("/:userId/budget", authMiddleware, async (req, res) => {
    
    const userIdFromToken = req.user.id;
    const userIdFromUrl = parseInt(req.params.userId)

    //Limite Mensual
    //Gasto actual
    //alertas

});

module.exports = router;
