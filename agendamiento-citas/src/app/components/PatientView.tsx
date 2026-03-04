import React, { useState } from "react";
import { Booking, TeacherProfile } from "../page";

interface PatientViewProps {
    bookings: Booking[];
    teacherProfile: TeacherProfile;
    onBook: (booking: Booking) => void;
}

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dailySchedule = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function PatientView({ bookings, teacherProfile, onBook }: PatientViewProps) {
    const [calendar, setCalendar] = useState({ year: 2026, month: 1 }); // Feb 2026 default
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [reason, setReason] = useState("");

    const changeMonth = (delta: number) => {
        let newMonth = calendar.month + delta;
        let newYear = calendar.year;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setCalendar({ year: newYear, month: newMonth });
        setSelectedDate(null);
        setSelectedSlot(null);
    };

    const handleSelectDate = (dateStr: string) => {
        setSelectedDate(dateStr);
        setSelectedSlot(null);
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && selectedSlot) {
            setIsSubmitting(true);
            const newBooking: Booking = {
                id: Date.now().toString(),
                date: selectedDate,
                time: selectedSlot,
                bookedBy: teacherProfile.name,
                cedula: teacherProfile.cedula,
                school: teacherProfile.school,
                sede: teacherProfile.sede,
                reason,
                status: "pending"
            };

            try {
                // Notificar por correo a la psicóloga
                await fetch('/api/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: teacherProfile.name,
                        cedula: teacherProfile.cedula,
                        school: teacherProfile.school,
                        sede: teacherProfile.sede,
                        date: selectedDate,
                        time: selectedSlot,
                        reason: reason
                    })
                });
            } catch (error) {
                console.error("Error al enviar notificación:", error);
                // Continuamos igual aunque falle el correo para no bloquear al usuario
            }

            onBook(newBooking);
            alert('¡Cita agendada con éxito!');
            setIsSubmitting(false);
            setShowModal(false);
            setReason("");
            setSelectedSlot(null);
        }
    };

    const isDayAllowed = (dayOfWeek: number) => {
        // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
        const { school, sede, isUrgent } = teacherProfile;

        // Si es carácter urgente o fin de semana
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return false;
        }

        if (isUrgent) {
            return true;
        }

        if (school === "Colegio O.E.A IED") {
            if (sede === "Sede A") return dayOfWeek !== 4; // Lunes, Martes, Miércoles, Viernes
            if (sede === "Sede B") return dayOfWeek === 4; // Jueves
        }

        return false;
    };

    const renderDays = () => {
        const firstDay = new Date(calendar.year, calendar.month, 1).getDay();
        const daysInMonth = new Date(calendar.year, calendar.month + 1, 0).getDate();
        let startOffset = firstDay === 0 ? 6 : firstDay - 1;

        const days = [];

        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${calendar.year}-${String(calendar.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dateObj = new Date(calendar.year, calendar.month, day);
            const dayOfWeek = dateObj.getDay();

            const allowed = isDayAllowed(dayOfWeek);
            const isSelected = selectedDate === dateStr;

            if (!allowed) {
                days.push(
                    <div key={day} className="calendar-day disabled" title="Día no habilitado para tu sede">
                        {day}
                    </div>
                );
            } else {
                days.push(
                    <div
                        key={day}
                        className={`calendar-day ${isSelected ? 'selected' : ''}`}
                        data-date={dateStr}
                        onClick={() => handleSelectDate(dateStr)}
                    >
                        {day}
                    </div>
                );
            }
        }
        return days;
    };

    const renderSlots = () => {
        if (!selectedDate) return null;

        const dayBookings = bookings.filter(b => b.date === selectedDate);

        return dailySchedule.map(time => {
            const isBooked = !!dayBookings.find(b => b.time === time);
            const isSelected = selectedSlot === time;

            return (
                <div
                    key={time}
                    className={`slot-card ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isBooked && setSelectedSlot(time)}
                >
                    <div className="slot-time">{time}</div>
                    <div className="slot-status">
                        {isBooked ? 'Ocupado' : 'Disponibles'}
                    </div>
                </div>
            );
        });
    };

    return (
        <section id="teacher-view" className="view active">
            <div className="header-actions" style={{ marginBottom: "0.5rem", textAlign: "left" }}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "0.2rem" }}>Agendar Cita</h2>
                <p className="subtitle" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                    Selecciona una fecha para ver los horarios disponibles.
                </p>
            </div>

            <div className="split-layout">
                {/* Left: Calendar */}
                <div className="calendar-section">
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button className="btn-icon" onClick={() => changeMonth(-1)}>
                                <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
                                    <path d="m15 18-6-6 6-6"></path>
                                </svg>
                            </button>
                            <h3 id="current-month-year">
                                {months[calendar.month]} {calendar.year}
                            </h3>
                            <div className="calendar-header-actions">
                                <button className="btn-icon" onClick={() => changeMonth(1)}>
                                    <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
                                        <path d="m9 18 6-6-6-6"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="calendar-weekdays">
                            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
                        </div>
                        <div id="calendar-days" className="calendar-days">
                            {renderDays()}
                        </div>
                    </div>
                </div>

                {/* Right: Slots */}
                <div id="slots-container" className={`timeslot-section ${!selectedDate ? 'hidden' : ''}`}>
                    {selectedDate && (() => {
                        const [y, m, d] = selectedDate.split('-');
                        return (
                            <h4 id="selected-date-title" className="timeslot-title">
                                Elegí para el {parseInt(d, 10)} de {months[parseInt(m, 10) - 1]}
                            </h4>
                        );
                    })()}
                    <div id="time-slots" className="split-style-slots">
                        {renderSlots()}
                    </div>

                    <button
                        id="confirm-booking-btn"
                        className="btn-primary w-full mt-4"
                        style={{ display: selectedSlot ? 'block' : 'none', marginTop: '1.5rem' }}
                        onClick={() => setShowModal(true)}
                    >
                        Confirmar horario
                    </button>
                </div>
            </div>

            {/* Booking Modal */}
            <div id="booking-modal" className={`modal ${!showModal ? 'hidden' : ''}`}>
                <div className="modal-content">
                    <h3>Completar agendamiento</h3>
                    <p className="modal-desc">
                        Cita para el <strong id="modal-slot-info">
                            {selectedDate && selectedSlot ? (() => {
                                const [y, m, d] = selectedDate.split('-');
                                return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} a las ${selectedSlot}`;
                            })() : ''}
                        </strong>. Por favor completa tus datos.
                    </p>
                    <form id="booking-form" onSubmit={handleBookingSubmit}>
                        <div className="form-group">
                            <label>Docente</label>
                            <input type="text" disabled value={teacherProfile.name} className="form-control" style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Sede asignada</label>
                            <input type="text" disabled value={`${teacherProfile.school} - ${teacherProfile.sede}`} className="form-control" style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="booking-reason">Motivo de consulta (Opcional)</label>
                            <textarea id="booking-reason" rows={3} placeholder="Breve descripción del motivo de la cita..." value={reason} onChange={e => setReason(e.target.value)}></textarea>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancelar</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Agendando...' : 'Confirmar Agendamiento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
