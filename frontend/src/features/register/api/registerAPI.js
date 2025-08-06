import React, { useState } from 'react'
import api from '../../../services/api'

export default function RegisterAPI(){
    const [nombre, setNombre]= useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [mensaje, setMensaje]= useState("");
    const [loading, setLoading]= useState(false);
    
    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setLoading(true)
    
        try {
            await api.post('/register',{nombre,email,password});
            setMensaje('Registro Exitoso!');
            setEmail('')                
            setPassword('')                
            setNombre('')                
        } catch (error) {
            setMensaje({error});
        } finally{
            setLoading(false);
        }
    }

    return{
        nombre,
        setNombre,
        email,
        setEmail,
        password,
        setPassword,
        mensaje,
        handleSubmit
    }
}