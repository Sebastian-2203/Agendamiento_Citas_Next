import React, { useState } from "react";
import { TeacherProfile } from "../page";

interface TeacherProfileFormProps {
    onComplete: (profile: TeacherProfile) => void;
}

export default function TeacherProfileForm({ onComplete }: TeacherProfileFormProps) {
    const [name, setName] = useState("");
    const [cedula, setCedula] = useState("");
    const [school, setSchool] = useState("Colegio O.E.A IED");
    const [sede, setSede] = useState("Sede A");
    const [isUrgent, setIsUrgent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({ name, cedula, school, sede, isUrgent });
    };

    return (
        <section className="view active" style={{ maxWidth: "600px", margin: "2rem auto" }}>
            <div className="calendar-container">
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Bienvenido/a Docente</h2>
                <p className="subtitle" style={{ marginBottom: "2rem" }}>Por favor, completa tus datos para ver los horarios disponibles y agendar tu cita.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="teacher-name">Nombre completo</label>
                        <input
                            type="text"
                            id="teacher-name"
                            required
                            placeholder="Ej. Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="teacher-cedula">Cédula</label>
                        <input
                            type="text"
                            id="teacher-cedula"
                            required
                            placeholder="Ej. 123456789"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="teacher-school">Colegio</label>
                        <select
                            id="teacher-school"
                            required
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="form-control"
                        >
                            <option value="Colegio O.E.A IED">Colegio O.E.A IED</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="teacher-sede">Sede</label>
                        <select
                            id="teacher-sede"
                            required
                            value={sede}
                            onChange={(e) => setSede(e.target.value)}
                            className="form-control"
                        >
                            <option value="Sede A">Sede A</option>
                            <option value="Sede B">Sede B</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                        <input
                            type="checkbox"
                            id="teacher-urgent"
                            checked={isUrgent}
                            onChange={(e) => setIsUrgent(e.target.checked)}
                            style={{ width: "auto", margin: 0 }}
                        />
                        <label htmlFor="teacher-urgent" style={{ marginBottom: 0, fontWeight: "normal" }}>
                            Es de carácter urgente
                        </label>
                    </div>

                    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
                            Continuar al calendario
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
