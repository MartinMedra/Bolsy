import {useIngreso} from "./api/useIngreso.js";

function Ingreso() {

    const {
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
      handleSubmit,
    } = useIngreso();

    return(
    <>
        <h1>Registro de Ingreso</h1>

        <form onSubmit={handleSubmit}>
            <input 
            type="number"
            placeholder="Ingrese el numero de usuario"
            value={usuarioId}
            onChange={(e)=> setUsuarioId(e.target.value)} />
            <input 
            type="text"
            value={nombre}
            placeholder="Nombre del ingreso"
            onChange={(e)=> setNombre(e.target.value)} />
            <input 
            type="date" 
            value={fecha}
            onChange={(e)=>setFecha(e.target.value)} />
            <input 
            type="text"
            placeholder="Ingrese el monto"
            step="0.01"
            value={monto}
            onChange={(e)=>setMonto(e.target.value)} />
            <input 
            type="number"
            placeholder="Ingrese el numero de categoria"
            value={categoriaId}
            onChange={(e)=> setCategoriaId(e.target.value)} />
            <input 
            type="text"
            placeholder="Descripcion del ingreso"
            value={descripcion}
            onChange={(e)=> setDescripcion(e.target.value)} />
            <button type="submit">Agregar Ingreso</button>
            {mensaje && <p>{mensaje}</p>}
        </form>
    </>
    )
}
export default Ingreso