// src/components/ListAttendances.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ListAttendances.css';

const ListAttendances: React.FC = () => {
    const [consultations, setConsultations] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.username || (user.role !== 'Atendente' && user.role !== 'Admin')) {
            navigate('/home');
            return;
        }

        const fetchConsultations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}attendance?userId=${user.id}`);
                setConsultations(response.data);
            } catch (err) {
                setError('Erro ao buscar as consultas.');
            }
        };

        fetchConsultations();
    }, [navigate, user.id, user.username, user.role]);

    const handleDelete = async (attendanceId: number) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}attendance?userId=${user.id}&attendanceId=${attendanceId}`);
            setConsultations(consultations.filter((consulta: any) => consulta.id !== attendanceId));
        } catch (err) {
            setError('Erro ao deletar a consulta.');
        }
    };

    if (!user.username || (user.role !== 'Atendente' && user.role !== 'Admin')) {
        return null;
    }

    return (
        <div className="listar-consultas-container">
            <h2>Consultas Marcadas</h2>
            {error && <p className="error">{error}</p>}
            {consultations.length > 0 ? (
                <ul>
                {consultations.map((consulta: any) => (
                    <li key={consulta.id} className="consulta-card">
                        <p>Paciente: {consulta.patientName}</p>
                        <p>Médico: {consulta.doctorName}</p>
                        <p>Data: {new Date(consulta.date).toLocaleString()}</p>
                        <p className={`status ${consulta.isAttended ? 'realizada' : 'pendente'}`}>
                            {consulta.isAttended ? 'Consulta realizada' : 'Consulta pendente'}
                        </p>
                        <button onClick={() => handleDelete(consulta.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
            ) : (
                <p>Nenhuma consulta encontrada.</p>
            )}
        </div>
    );
};

export default ListAttendances;
