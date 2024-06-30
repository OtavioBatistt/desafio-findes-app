import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ListAppointments.css';

const ListAppointments: React.FC = () => {
    const [consultations, setConsultations] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.username || (user.role !== 'Medico' && user.role !== 'Admin')) {
            navigate('/home');
            return;
        }

        const fetchConsultations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}attendance?userId=${user.id}`);
                const attendedConsultations = response.data.filter((consultation: any) => consultation.isAttended);
                setConsultations(attendedConsultations);
            } catch (err) {
                setError('Erro ao buscar as consultas.');
            }
        };

        fetchConsultations();
    }, [user.id, navigate]);

    if (!user.username || (user.role !== 'Medico' && user.role !== 'Admin')) {
        return null;
    }

    return (
        <div className="visualizar-atendimentos-container">
            <h2>Visualizar Atendimentos</h2>
            {error && <p className="error">{error}</p>}
            {consultations.length > 0 ? (
                <ul>
                    {consultations.map((consulta: any) => (
                        <li key={consulta.id}>
                            <p>Paciente: {consulta.patientName}</p>
                            <p>Médico: {consulta.doctorName}</p>
                            <p>Data: {new Date(consulta.date).toLocaleString()}</p>
                            <p className="atendida">Consulta Realizada</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma consulta realizada encontrada.</p>
            )}
        </div>
    );
};

export default ListAppointments;
