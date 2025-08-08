import { useState } from 'react'
import api from '../../../services/api.js'

export function useIngreso(){
    const [usuarioId, setUsuarioId] = useState();
    const [fecha, setFecha] = useState('');
    const [nombre, setNombre] = useState('');
    const [monto, setMonto] = useState('');
    const [categoriaId, setCategoriaId] = useState();
    const [descripcion, setDescripcion] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try{
            await api.post('/ingreso/agregar',{usuarioId: parseInt(usuarioId),fecha,nombre,monto: parseFloat(monto),categoriaId: parseInt(categoriaId),descripcion});
            setMensaje('Ingreso exitoso');
            setUsuarioId();
            setCategoriaId();
            setDescripcion('');
            setMonto('');
            setNombre('');
            setFecha('');
        }catch(error){
            setMensaje('Error: '+ (error.response?.data?.error || error.message))
        }finally{
            setLoading(false)
        }

    } 
    return{
        usuarioId,
        setUsuarioId,
        fecha,
        setFecha,
        nombre,
        setNombre,
        monto,
        setMonto,
        categoriaId,
        setCategoriaId,
        descripcion,
        setDescripcion,
        mensaje,
        setMensaje,
        loading,
        handleSubmit
    }
}
