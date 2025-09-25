const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");

// MIDDLEWARE
const { authMiddleware } = require("../middleware/auth");

const prisma = new PrismaClient();
const router = Router();

// ========================================= CRUD INGRESO ==========================================
router.get("/ingreso/:id", authMiddleware, async (req, res) => {
  try {
    //Usuario del token verificado
    const userIdFromToken = req.user.id;
    const userIdFromURL = parseInt(req.params.id);

    if (userIdFromToken !== userIdFromURL) {
      return res
        .status(403)
        .json({ error: "No tiene permiso de ver esta información" });
      // 403 es para decir que "Está autenticado pero NO tiene el permiso"
    }

    const ingreso = await prisma.movimiento.findMany({
      where: { usuarioId: userIdFromToken, tipo: "INGRESO" },
      include: { categoria: true },
      orderBy: { fecha: "desc" },
    });

    if (ingreso.length > 0) {
      res.json(ingreso);
    } else {
      res.json({
        message: "No se encontraron registros",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ingreso/agregar", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { fecha, nombre, monto, categoriaId, descripcion } = req.body;

    if (!nombre || !monto || !categoriaId) {
      return res.status(400).json({ error: "Faltan datos por ingresar" });
    }

    const categoriaExiste = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoriaExiste) {
      return res
        .status(400)
        .json({ error: "La categoría no se ha encontrado" });
    }

    const nuevoIngreso = await prisma.movimiento.create({
      data: {
        usuarioId,
        fecha: fecha ? new Date(fecha) : new Date(), // Acepta string ISO (ej: "2024-06-10T12:00:00Z") o "YYYY-MM-DD"
        nombre,
        monto: parseFloat(monto),
        tipo: "INGRESO",
        categoriaId: parseInt(categoriaId),
        descripcion,
      },
      include: { categoria: true }, //Incluimos la categoria en la respuesta
    });

    res.status(201).json(nuevoIngreso);
    //201 para la creación de algo
  } catch (error) {
    console.error("Error al agregar ingreso:", error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================= CRUD EGRESO ==========================================

router.get("/egreso/:id", authMiddleware, async (req, res) => {
  try {
    //Usuario del token verificado
    const userIdFromToken = req.user.id;
    const userIdFromURL = parseInt(req.params.id);

    if (userIdFromToken !== userIdFromURL) {
      return res
        .status(403)
        .json({ error: "No tiene permiso de ver esta información" });
      // 403 es para decir que "Está autenticado pero NO tiene el permiso"
    }

    const egresos = await prisma.movimiento.findMany({
      where: { usuarioId: userIdFromToken, tipo: "EGRESO" },
      include: { categoria: true },
      orderBy: { fecha: "desc" },
    });
    if (egresos.length > 0) {
      res.json(egresos);
    } else {
      res.json({
        error: "No se encontraron registros",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/egreso/agregar", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { fecha, nombre, monto, categoriaId, descripcion } = req.body;

    if (!nombre || !monto || !categoriaId) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const categoriaExiste = await prisma.categoria.findUnique({
      where: { id: parseInt(categoriaId) },
    });
    if (!categoriaExiste) {
      return res
        .status(400)
        .json({ error: "No se ha encontrado la categoria" });
    }

    const nuevoEgreso = await prisma.movimiento.create({
      data: {
        usuarioId,
        fecha: fecha ? new Date(fecha) : new Date(),
        nombre,
        tipo: "EGRESO",
        monto: parseFloat(monto),
        categoriaId: parseInt(categoriaId),
        descripcion,
      },
      include: { categoria: true },
    });

    res.status(201).json(nuevoEgreso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
