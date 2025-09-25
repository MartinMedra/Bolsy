const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");

// MIDDLEWARE
const { authMiddleware } = require("../middleware/auth");

const prisma = new PrismaClient();
const router = Router();

// ========================================= RESTful ROUTES ==========================================
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    //Usuario del token verificado
    const userIdFromToken = req.user.id;
    const userIdFromURL = parseInt(req.params.userId);

    if (userIdFromToken !== userIdFromURL) {
      return res
        .status(403)
        .json({ error: "No tiene permiso de ver esta información" });
      // 403 es para decir que "Está autenticado pero NO tiene el permiso"
    }

    // Hacemos una costante de query parameters para filtros y paginacion
    const { 
      tipo,           // INGRESO, EGRESO  
      categoriaId,    // Filtrar por categoría
      fechaDesde,     // Filtrar por rango de fechas
      fechaHasta,
      page = 1, 
      limit = 50 
    } = req.query;

    //skip sirve para la paginación, controlar hasta donde traer los registros
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir where clause dinámicamente
    const whereClause = {
      usuarioId: userIdFromToken,
      activo: true,  // Solo movimientos activos
      ...(tipo && { tipo: tipo.toUpperCase() }), // ... Sirve para agregar propiedades condicionales dentro de un objeto
      ...(categoriaId && { categoriaId: parseInt(categoriaId) }),
      ...(fechaDesde && fechaHasta && {
        fecha: {
          gte: new Date(fechaDesde),
          lte: new Date(fechaHasta)
        }
      })
    };

    // Ejecutar queries en paralelo para performance
    const [movimientos, total] = await Promise.all([     //Promise.all sirve para ejecutar las consultas en pararelo, evitando esperas innecesarias
      prisma.movimiento.findMany({
        where: whereClause,
        include: { categoria: true },
        orderBy: { fecha: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.movimiento.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: movimientos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        tipo,
        categoriaId,
        fechaDesde,
        fechaHasta
      }
    });


  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    res.status(500).json({ error: error.message });
  }
});

// OBTENER MOVIMIENTO ESPECIFICO
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const movimientoId = parseInt(req.params.id);
    const userIdFromToken = req.user.id;

    const movimiento = await prisma.movimiento.findFirst({
      where: { 
        id: movimientoId, 
        usuarioId: userIdFromToken,
        activo: true 
      },
      include: { categoria: true }
    });

    if (!movimiento) {
      return res.status(404).json({ 
        error: "Movimiento no encontrado" 
      });
    }

    res.json({
      success: true,
      data: movimiento
    });
  
  } catch (error) {
    console.error("Error al obtener movimiento:", error);
    res.status(500).json({ error: error.message });
  }
});

// CREAR MOVIMIENTO (INGRESO O EGRESO)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { fecha, nombre, monto, tipo, categoriaId, descripcion } = req.body;

    // Validaciones obligatorias
    if (!nombre || !monto || !tipo || !categoriaId) {
      return res.status(400).json({ 
        error: "Faltan campos obligatorios: nombre, monto, tipo, categoriaId" 
      });
    }

    // Validar tipo
    if (!['INGRESO', 'EGRESO'].includes(tipo.toUpperCase())) {
      return res.status(400).json({ 
        error: "Tipo debe ser INGRESO o EGRESO" 
      });
    }

    // Validar monto
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ 
        error: "Monto debe ser un número positivo" 
      });
    }

    // Verificar que la categoría existe y pertenece al usuario
    const categoriaExiste = await prisma.categoria.findFirst({
      where: { 
        id: parseInt(categoriaId),
        usuarioId  // Solo categorías del usuario
      }
    });

    if (!categoriaExiste) {
      return res.status(400).json({ 
        error: "La categoría no existe o no tienes acceso a ella" 
      });
    }

    const nuevoMovimiento = await prisma.movimiento.create({
      data: {
        usuarioId,
        fecha: fecha ? new Date(fecha) : new Date(),
        nombre: nombre.trim(),
        monto: montoNumerico,
        tipo: tipo.toUpperCase(),
        categoriaId: parseInt(categoriaId),
        descripcion: descripcion?.trim() || null,
        activo: true
      },
      include: { categoria: true }
    });

    res.status(201).json({
      success: true,
      message: "Movimiento creado exitosamente",
      data: nuevoMovimiento
    });

  } catch (error) {
    console.error("Error al crear movimiento:", error);
    res.status(500).json({ error: error.message });
  }
});

// ACTUALIZAR MOVIMIENTO
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const movimientoId = parseInt(req.params.id);
    const userIdFromToken = req.user.id;
    const { fecha, nombre, monto, tipo, categoriaId, descripcion } = req.body;

    // 1. Verificar que el movimiento existe y pertenece al usuario
    const movimientoExistente = await prisma.movimiento.findFirst({
      where: { 
        id: movimientoId, 
        usuarioId: userIdFromToken,
        activo: true
      }
    });

    if (!movimientoExistente) {
      return res.status(404).json({ 
        error: "Movimiento no encontrado o no tienes permiso para modificarlo" 
      });
    }

    // 2. Validar tipo si se envía
    if (tipo && !['INGRESO', 'EGRESO'].includes(tipo.toUpperCase())) {
      return res.status(400).json({ 
        error: "Tipo debe ser INGRESO o EGRESO" 
      });
    }

    // 3. Validar monto si se envía
    if (monto !== undefined) {
      const montoNumerico = parseFloat(monto);
      if (isNaN(montoNumerico) || montoNumerico <= 0) {
        return res.status(400).json({ 
          error: "Monto debe ser un número positivo" 
        });
      }
    }

    // 4. Verificar categoría si se envía
    if (categoriaId) {
      const categoriaExiste = await prisma.categoria.findFirst({
        where: { 
          id: parseInt(categoriaId),
          usuarioId: userIdFromToken  // Solo categorías del usuario
        }
      });

      if (!categoriaExiste) {
        return res.status(400).json({ 
          error: "La categoría no existe o no tienes acceso a ella" 
        });
      }
    }

    // 5. Actualizar solo los campos enviados (partial update)
    const dataToUpdate = {};
    if (fecha !== undefined) dataToUpdate.fecha = new Date(fecha);
    if (nombre !== undefined) dataToUpdate.nombre = nombre.trim();
    if (monto !== undefined) dataToUpdate.monto = parseFloat(monto);
    if (tipo !== undefined) dataToUpdate.tipo = tipo.toUpperCase();
    if (categoriaId !== undefined) dataToUpdate.categoriaId = parseInt(categoriaId);
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion?.trim() || null;
    
    // Siempre actualizar updatedAt
    dataToUpdate.updatedAt = new Date();

    const movimientoActualizado = await prisma.movimiento.update({
      where: { id: movimientoId },
      data: dataToUpdate,
      include: { categoria: true }
    });

    res.json({
      success: true,
      message: "Movimiento actualizado exitosamente",
      data: movimientoActualizado
    });

  } catch (error) {
    console.error("Error al actualizar movimiento:", error);
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR MOVIMIENTO (LÓGICAMENTE)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const movimientoId = parseInt(req.params.id);
    const userIdFromToken = req.user.id;

    // 1. Verificar que el movimiento existe y pertenece al usuario
    const movimientoExistente = await prisma.movimiento.findFirst({
      where: { 
        id: movimientoId, 
        usuarioId: userIdFromToken,
        activo: true
      }
    });

    if (!movimientoExistente) {
      return res.status(404).json({ 
        error: "Movimiento no encontrado o no tienes permiso para eliminarlo" 
      });
    }

    // 2. Eliminación LÓGICA (marcar como inactivo)
    await prisma.movimiento.update({
      where: { id: movimientoId },
      data: { 
        activo: false,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Movimiento eliminado exitosamente"
    });

  } catch (error) {
    console.error("Error al eliminar movimiento:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
