import {useState, useEffect} from 'react'
import api from '../login/services/api';

function Register() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (evento)=> {
        evento.preventDefault();

        try {
            await api.post("/register",{nombre, email, password});
            setMensaje("Usuario registrado")
            setNombre("");
            setEmail("");
            setPassword("");
        } catch (error) {
            setMensaje("Error al registrar usuario: "+ error.response.data.error)
        }

    };

  return(
    <div>
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
            <input
             type="text"
             placeholder='nombre'
             value={nombre}
             onChange={(evento)=> setNombre(evento.target.value)} />
             <input 
             type="email"
             placeholder='Email'
             value={email}
             onChange={(evento)=> setEmail(evento.target.value)} />
             <input type="password"
             placeholder='Constraseña'
             value={password}
             onChange={(evento)=> setPassword(evento.target.value)} />
             <button type='submit'>Registrarse</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default Register