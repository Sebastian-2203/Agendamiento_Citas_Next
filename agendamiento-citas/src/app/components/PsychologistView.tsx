import React, { useState } from "react";
import { Booking } from "../page";

interface PsychologistViewProps {
    bookings: Booking[];
    onUpdateBookings: (bookings: Booking[]) => void;
}

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const daysWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function PsychologistView({ bookings, onUpdateBookings }: PsychologistViewProps) {
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

    const sortedBookings = [...bookings].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });

    const handleCancelBooking = (id: string) => {
        setPendingCancelId(id);
        setCancelModalOpen(true);
    };

    const confirmCancel = () => {
        if (pendingCancelId) {
            const updatedBookings = bookings.filter(b => b.id !== pendingCancelId);
            onUpdateBookings(updatedBookings);
            setCancelModalOpen(false);
            setPendingCancelId(null);
        }
    };

    const abortCancel = () => {
        setCancelModalOpen(false);
        setPendingCancelId(null);
    };

    return (
        <section id="psych-view" className="view active">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        ⭐ Estas son tus próximas citas programadas
                    </h2>
                    <p className="subtitle">Dra. Laura Pérez · Psicóloga</p>
                </div>
            </div>

            <div className="schedule-layout-grid">
                <div className="continuous-rows">
                    <div id="upcoming-date-header" className="date-header">
                        {sortedBookings.length > 0 ? (() => {
                            const firstBooking = sortedBookings[0];
                            const [y, m, d] = firstBooking.date.split('-');
                            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                            return `${daysWeek[dateObj.getDay()]} ${parseInt(d)} de ${months[parseInt(m) - 1]}`;
                        })() : ''}
                    </div>

                    <div id="schedule-list" className={sortedBookings.length === 0 ? 'hidden' : ''}>
                        {sortedBookings.map(booking => {
                            const isDone = booking.status === 'done';
                            const avatarSeed = booking.bookedBy.length;

                            return (
                                <div key={booking.id} className={`schedule-item ${isDone ? 'status-done' : ''}`}>
                                    <div className="schedule-patient-info">
                                        <img src={`https://i.pravatar.cc/150?u=${avatarSeed}`} alt="Patient" className="patient-avatar" />
                                        <div className="patient-details">
                                            <span className="patient-name">{booking.bookedBy}</span>
                                            <p className="card-text text-gray-600 mb-2">
                                                <strong>Escuela:</strong> {booking.school} <br />
                                                <strong>Sede:</strong> {booking.sede}
                                            </p>
                                            <span className="patient-time">
                                                {booking.time} - {String(parseInt(booking.time.split(':')[0]) + 1).padStart(2, '0')}:{booking.time.split(':')[1]}
                                            </span>
                                        </div>
                                    </div>

                                    {isDone ? (
                                        <div className="schedule-actions" style={{ color: "var(--success-color)", fontWeight: 600, fontSize: "0.9rem" }}>
                                            Completada
                                        </div>
                                    ) : (
                                        <div className="schedule-actions">
                                            <button className="btn-cancel-appt" onClick={() => handleCancelBooking(booking.id)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                                Cancelar cita
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div id="empty-schedule-card" className={`empty-state-card ${sortedBookings.length > 0 ? 'hidden' : ''}`}>
                    <div className="empty-icon-wrap">
                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                            <line x1="12" x2="12" y1="5" y2="19"></line>
                            <line x1="5" x2="19" y1="12" y2="12"></line>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Aún no tienes citas programadas</h3>
                    <p className="subtitle" style={{ fontSize: "0.95rem" }}>Cuando un paciente reserve,<br />aparecerán aquí.</p>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <div id="cancel-modal" className={`modal ${!cancelModalOpen ? 'hidden' : ''}`}>
                <div className="modal-content" style={{ textAlign: "center", borderRadius: "16px" }}>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>Cancelar Cita</h3>
                    <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        ¿Estás seguro de cancelar esta cita? La hora volverá a estar libre de inmediato para que otro paciente agende.
                    </p>
                    <div className="modal-actions" style={{ justifyContent: "center", width: "100%", gap: "10px" }}>
                        <button type="button" onClick={abortCancel} className="btn-secondary" style={{ flex: 1, borderRadius: "8px" }}>
                            Conservar Cita
                        </button>
                        <button type="button" onClick={confirmCancel} className="btn-primary" style={{ flex: 1, backgroundColor: "var(--error-color)", border: "none", borderRadius: "8px" }}>
                            Sí, cancelar
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
