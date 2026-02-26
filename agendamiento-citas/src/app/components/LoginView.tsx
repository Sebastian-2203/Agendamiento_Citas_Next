import React, { useState } from "react";
import { UserType } from "../page";

interface LoginViewProps {
    onLogin: (role: UserType) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
    const [showPsychLogin, setShowPsychLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handlePsychSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin" && password === "1234") {
            onLogin("psychologist");
        } else {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <section id="login-view" className="view active">
            <div className="login-card">
                <h1>👋 Bienvenida, ¡Qué gusto verte!</h1>
                <p className="subtitle">Agenda tus citas de forma fácil y rápida ✨</p>

                {!showPsychLogin ? (
                    <div className="login-options">
                        <button
                            onClick={() => setShowPsychLogin(true)}
                            className="btn-primary"
                            style={{ fontSize: "1.1rem", padding: "1rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                        >
                            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                                <path d="M12 11v4"></path>
                                <path d="M10 13h4"></path>
                            </svg>
                            Soy Psicóloga
                        </button>
                        <button
                            onClick={() => onLogin("teacher")}
                            className="btn-patient"
                            style={{ fontSize: "1.1rem", padding: "1rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                        >
                            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Soy Paciente
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlePsychSubmit} style={{ marginTop: "1.5rem", textAlign: "left" }}>
                        <div className="form-group">
                            <label htmlFor="psych-username">Usuario</label>
                            <input
                                type="text"
                                id="psych-username"
                                required
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="psych-password">Contraseña</label>
                            <input
                                type="password"
                                id="psych-password"
                                required
                                placeholder="1234"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && (
                            <div style={{ color: "var(--error-color)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                                {error}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                                type="button"
                                onClick={() => setShowPsychLogin(false)}
                                className="btn-secondary"
                                style={{ flex: 1, borderRadius: "12px" }}
                            >
                                Volver
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 1, borderRadius: "12px" }}
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
