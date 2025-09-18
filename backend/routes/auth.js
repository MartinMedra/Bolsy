const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res) => {
  try {
    //1. RECIBIMOS los Datos
    const { nombre, email, password } = req.body;

    //2. VALIDAMOS los datos
    if (!email ||!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Email Invalido" });
    }
    if (password.length < 8){
      return res.status(400).json({ error: "La contraseña debe tener minimo 8 caracteres" });
    }
    if (!nombre || nombre.trim().length === 0){
        return res.status(400).json({error: 'Es necesario un nombre'})
    }


    //3. VERIFICAMOS si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    //4. HASHEAMOS contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. CREAMOS el usuario en la BD
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hashedPassword },
    });

    // 6. GENERAMOS el JWT token
    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 7. RESPONDEMOS al frontend
    res
      .status(201)
      .json({
        success: true,
        token,
        user: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      });
  } catch (error) {
    console.error("Error en el Register:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // RECIBIR las credenciales
    const { email, password } = req.body;

    //VALIDAR DATOS
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseñas son requeridos" });
    }

    // BUSCAR usuario por email
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // COMPARAR contraseñas
    const isValid = await bcrypt.compare(password, usuario.password);
    if (!isValid){
        return res.status(401).json({error: 'Credenciales inválidas'})
    };

    //GENERAR JWT token
    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({success: true, token, user:{id: usuario.id, email:usuario.email, nombre: usuario.nombre}})

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
