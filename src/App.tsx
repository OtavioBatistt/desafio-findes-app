// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import MarcarConsulta from './components/CreateAttendances';
import ListarConsultas from './components/ListAttendances';
import RealizarAtendimento from './components/UpdateAttendances';
import VisualizarAtendimentos from './components/ListAppointments';
import PrivateRoute from './components/PrivateRoute';
import './styles/LoginForm.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/home" element={<PrivateRoute element={<Home />} />} />
                    <Route path="/marcar-consulta" element={<PrivateRoute element={<MarcarConsulta />} />} />
                    <Route path="/listar-consultas" element={<PrivateRoute element={<ListarConsultas />} />} />
                    <Route path="/realizar-atendimento" element={<PrivateRoute element={<RealizarAtendimento />} />} />
                    <Route path="/visualizar-atendimentos" element={<PrivateRoute element={<VisualizarAtendimentos />} />} />
                    <Route path="/" element={<LoginForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
