// src/components/CreateAttendances.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateAttendances.css';

const CreateAttendances: React.FC = () => {
    const [patientName, setPatientName] = useState('');
    const [doctors, setDoctors] = useState<{ id: number, username: string }[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [selectedDoctorName, setSelectedDoctorName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}attendance/doctors`);
                setDoctors(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Erro ao listar médicos.');
                }
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        if (!user.username || (user.role !== 'Atendente' && user.role !== 'Admin')) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatientName(e.target.value);
    };

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setSelectedDoctorId(selectedId);

        const doctor = doctors.find((doc) => doc.id.toString() === selectedId);
        if (doctor) {
            setSelectedDoctorName(doctor.username);
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(e.target.value);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMonth || !selectedDay || !selectedTime) {
            setError('Por favor, selecione o mês, o dia e o horário.');
            return;
        }

        const consultationDate = `2024-${selectedMonth}-${selectedDay.padStart(2, '0')}T${selectedTime}:00`;

        const consultation = {
            Id: 0,
            PatientName: patientName,
            DoctorId: parseInt(selectedDoctorId),
            DoctorName: selectedDoctorName,
            attendantId: user.id,
            Date: consultationDate,
            IsAttended: false
        };

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}attendance`, consultation);
            navigate('/home');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.errors || 'Já existe uma consulta marcada para este horário com o mesmo médico');
            } else {
                setError('Erro ao marcar a consulta.');
            }
        }
    };

    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 8; hour < 17; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            times.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return times;
    };

    const generateDays = (month: string) => {
        const daysInMonth = new Date(2024, parseInt(month), 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    };

    const months = ['07', '08', '09', '10', '11', '12'];

    if (!user.username || (user.role !== 'Atendente' && user.role !== 'Admin')) {
        return null;
    }

    return (
        <div className="marcar-consulta-container">
            <h2>Marcar Nova Consulta</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="patientName">Nome do Paciente:</label>
                    <input
                        type="text"
                        id="patientName"
                        value={patientName}
                        onChange={handlePatientNameChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="doctor">Médico:</label>
                    <select id="doctor" value={selectedDoctorId} onChange={handleDoctorChange} required>
                        <option value="">Selecione um médico</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="month">Mês:</label>
                    <select id="month" value={selectedMonth} onChange={handleMonthChange} required>
                        <option value="">Selecione um mês</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>
                                {new Date(2024, parseInt(month) - 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="day">Dia do Mês:</label>
                    <select id="day" value={selectedDay} onChange={handleDayChange} required>
                        <option value="">Selecione um dia do mês</option>
                        {generateDays(selectedMonth).map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="time">Horário:</label>
                    <select id="time" value={selectedTime} onChange={handleTimeChange} required>
                        <option value="">Selecione um horário</option>
                        {generateTimeSlots().map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Marcar Consulta</button>
            </form>
        </div>
    );
};

export default CreateAttendances;
