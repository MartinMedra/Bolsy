import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./features/login/login";
import Register from "./features/register/register";
import Dashboard from "./features/dashboard/dashboard";
import Import from "./features/ingreso/ingreso"

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/ingreso" element={<Import />}></Route>
      </Routes>
    </Router>
  );
}

export default App