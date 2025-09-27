const {PrismaClient} = require("@prisma/client")
const {Router} = require("express")
const {authMiddleware} = require("../middleware/auth")

const prisma = new PrismaClient();
const router = Router();

// ========================================= RESTful ROUTES ==========================================

// RESUMEN PRINCIPAL
router.get("/:userId/summary"), authMiddleware,async(req,res) =>{

    const userIdFromToken = req.user.id;
    const userIdFromUrl = parseInt(req.params.userId);

    if(userIdFromToken !== userIdFromUrl){
        return res.status(403).json({error: 'No tiene permiso para ver esta información'})
    }
    
    //balanceTotal
    //totalIngresos
    //totalegresos
    //periodoActual
    //variacionMensual
    //movimientosRecientes
      
}

router.get("/:userId/budget"), authMiddleware, async (req, res) => {
    
    //Limite Mensual
    //Gasto actual
    //alertas

}
