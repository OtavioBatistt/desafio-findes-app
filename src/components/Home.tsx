// src/components/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <h2>Sistema de agendamentos - FINDES v1.0</h2>
            <p>Bem-vindo, {user.username}</p>
            {user.role === 'Admin' && (
                <div className="button-group">
                    <button onClick={() => navigate('/marcar-consulta')}>Marcar Nova Consulta</button>
                    <button onClick={() => navigate('/listar-consultas')}>Listar Consultas</button>
                    <button onClick={() => navigate('/realizar-atendimento')}>Realizar Atendimento</button>
                    <button onClick={() => navigate('/visualizar-atendimentos')}>Visualizar Atendimentos</button>
                </div>
            )}
            {user.role === 'Atendente' && (
                <div className="button-group">
                    <button onClick={() => navigate('/marcar-consulta')}>Marcar Nova Consulta</button>
                    <button onClick={() => navigate('/listar-consultas')}>Listar Consultas</button>
                </div>
            )}
            {user.role === 'Medico' && (
                <div className="button-group">
                    <button onClick={() => navigate('/realizar-atendimento')}>Realizar Atendimento</button>
                    <button onClick={() => navigate('/visualizar-atendimentos')}>Visualizar Atendimentos</button>
                </div>
            )}
            <div className="button-group">
                <button className="button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Home;
