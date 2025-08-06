import { useEffect, useState } from 'react'
import api from './../login/services/api'

function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(()=>{
    api.get("/usuarios")
    .then((res)=> setUsuarios(res.data))
    .catch((err)=> console.error(err));
  }, [])
  
    return(
    <div className='dashboard-container'>
      <h1>Dashboard</h1>
      <p>Bienvenido al panel principal</p>
    
    <h1>Estos son los usuarios registrados hasta el momento</h1>
    <ul>
        {usuarios.map((user)=> (
            <li key={user.id}>{user.nombre} - {user.email}</li>
        ))}
    </ul>
    </div>
  )
}

export default Dashboard
