import { useEffect, useState } from 'react'
import api from '../../../services/api'

export function useEgreso(){
    
    const [usuarioId, setUsuarioId] = useState('');
    const [fecha, setFecha] = useState('');
    const [nombre, setNombre] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const [movimientoEgreso, setmovimientoEgreso]= useState([]);

    useEffect(()=>{
        if (usuarioId){
            api.get(`/movimientos/egreso/${usuarioId}`)
            .then(res => setmovimientoEgreso(res.data))
            .catch(error => console.log(error))
        }
    }, [usuarioId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            await api.post('/egreso/agregar',{usuarioId: parseInt(usuarioId),fecha,nombre,monto: parseFloat(monto),categoriaId: parseInt(categoriaId),descripcion});
            setMensaje('Registro de egreso exitoso')
            setUsuarioId('');
            setFecha('');
            setNombre('');
            setCategoriaId('');
            setMonto('')
            setDescripcion('')

        } catch (error) {
            setMensaje({error: error.response?.message || error.message})
        }finally{
            setLoading(false)
        }
    }


    return {
        usuarioId,
        setUsuarioId,
        fecha,
        setFecha,
        nombre,
        setNombre,
        categoriaId,
        setCategoriaId,
        monto,
        setMonto,
        descripcion,
        setDescripcion,
        handleSubmit,
        mensaje,
        loading,
        movimientoEgreso
    }
}