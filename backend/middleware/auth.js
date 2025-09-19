const jwt = require ('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    try {
        //1. COGER el token del header
        const authHeader = req.headers.authorization;
        //Aquí lo que se obtiene es 'Bearer eyd9dsf01fsa3....'
        
        
        if(!authHeader){
            return res.status(401).json({error : 'No se ha encontrado el token de acceso'})
        }
        
        if(!authHeader.startsWith('Bearer ')){
            return res.status(401).json({error:'No se ha encontrado el formato correcto'})
        }
        
        const token = authHeader.split(' ')[1];
        //Aquí lo que se hace es separar el Bearer del token en realidad 'Bearer' 'eyd9dsf01fsa3....'

        if(!token){
            return res.status(401).json({error: 'Token no encontrado'})
        }

        // 2. VERIFICAR el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Aquí recibe el token y lo verifica con el JWT_SECRET para evitar modificaciones
        //Extrae la información que trae (Payload)
        //Verifica que no se haya expirado

        // 3. VERIFICAR que el usuario aún exite
        const user = await prisma.usuario.findUnique({
            where : {id: decoded.userId},
            select: {id: true, email: true, nombre: true}
        })
        //Porque el usuario pudo ser eliminado de la base de datos después de crear el token

        if(!user){
            return res.status(401).json({error: 'Usuario no valido'})
        }

        //4. AGREGAR la informacion del usuario al request
        req.user = user;
        //Esta es la información que se utilizará posteriormente para poder perdir la información

        //5. CONTINUAR al siguiente middleware/controller
        next();

    } catch (error) {
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({error: 'Token Invalido'})
        }
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({error: 'Token Expirado'})
        }

        console.error('Error en el authMiddleware: ', error)
        res.status(500).json({error: 'Error interno del servidor'})
    }
};

module.exports = {authMiddleware};