import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdateAttendances.css';

const UpdateAttendances: React.FC = () => {
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
                const pendingConsultations = response.data.filter((consultation: any) => !consultation.isAttended);
                setConsultations(pendingConsultations);
            } catch (err) {
                setError('Erro ao buscar as consultas.');
            }
        };

        fetchConsultations();
    }, [user.id, navigate]);

    const markAsAttended = async (consultationId: number) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}attendance?userId=${user.id}`, {
                id: consultationId,
                isAttended: true
            });
            setConsultations((prevConsultations) =>
                prevConsultations.filter((consultation: any) => consultation.id !== consultationId)
            );
        } catch (err) {
            setError('Erro ao marcar a consulta como realizada.');
        }
    };

    if (!user.username || (user.role !== 'Medico' && user.role !== 'Admin')) {
        return null;
    }

    return (
        <div className="realizar-atendimento-container">
            <h2>Realizar Atendimento</h2>
            {error && <p className="error">{error}</p>}
            {consultations.length > 0 ? (
                <ul>
                    {consultations.map((consulta: any) => (
                        <li key={consulta.id}>
                            <p>Paciente: {consulta.patientName}</p>
                            <p>Médico: {consulta.doctorName}</p>
                            <p>Data: {new Date(consulta.date).toLocaleString()}</p>
                            <button onClick={() => markAsAttended(consulta.id)}>Marcar como Realizada</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma consulta pendente encontrada.</p>
            )}
        </div>
    );
};

export default UpdateAttendances;
