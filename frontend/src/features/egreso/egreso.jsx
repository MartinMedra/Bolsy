import { useEgreso } from "./api/useEgreso";

export default function Egreso(){

    const {usuarioId,
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
        loading,
        mensaje, movimientoEgreso} = useEgreso();


    return(
        <div>
            <h1>Registro de Egreso</h1>
            <form onSubmit={handleSubmit}>
                <input type="number"
                placeholder="Usuario"
                value={usuarioId}
                onChange={(e)=>setUsuarioId(e.target.value)} />
                <input type="date"
                placeholder="Introduce la fecha"
                value={fecha}
                onChange={(e)=>setFecha(e.target.value)} />
                <input type="text"
                placeholder="nombre"
                value={nombre}
                onChange={(e)=>setNombre(e.target.value)} />
                <input type="number"
                placeholder="Introduce la categoria"
                value={categoriaId}
                onChange={(e)=>setCategoriaId(e.target.value)} />
                <input type="text"
                step={'0.01'}
                placeholder="Introduce el monto"
                value={monto}
                onChange={(e)=>setMonto(e.target.value)} />
                <input type="text"
                placeholder="Introduce la descripcion"
                value={descripcion}
                onChange={(e)=>setDescripcion(e.target.value)} />
                <button type="submit" disabled={loading}>{loading ? 'Cargando egreso' : 'Registrar egreso'}</button>
                {mensaje && <p>{mensaje}</p>}
                
            </form>
        <ul>
            {movimientoEgreso.map((mov)=>(
                <li key={mov.id}>
                    {mov.fecha?.slice(0,10)} | {mov.nombre} | {mov.tipo} | ${mov.monto} | {mov.descripcion}
                </li>
            ))}
        </ul>
        </div>
        
    )
}