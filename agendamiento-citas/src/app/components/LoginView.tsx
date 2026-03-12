import React, { useState } from "react";
import { UserType } from "../page";

interface LoginViewProps {
    onLogin: (role: UserType) => void;
    onViewCapsules: () => void;
    onViewProfeEnLinea: () => void;
}

export default function LoginView({ onLogin, onViewCapsules, onViewProfeEnLinea }: LoginViewProps) {
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
                <h1 className="animate-stagger-1">👋 Bienvenid@, ¡Qué gusto verte!</h1>
                <p className="subtitle animate-stagger-2">Agenda tus citas de forma fácil y rápida ✨</p>

                {!showPsychLogin ? (
                    <div className="login-options animate-stagger-3">
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
                            Acompañamiento psicologico
                        </button>

                        <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
                            <span style={{ color: "#64748b", fontSize: "0.9rem" }}>o explora recursos</span>
                            <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}></div>
                        </div>

                        <button
                            onClick={onViewCapsules}
                            className="btn-secondary"
                            style={{ fontSize: "1.1rem", padding: "1rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#334155" }}
                        >
                            <span>🧠</span>
                            Cápsulas de salud mental
                        </button>

                        <button
                            onClick={onViewProfeEnLinea}
                            className="btn-secondary"
                            style={{ fontSize: "1.1rem", padding: "1rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e3a8a", marginTop: "0.5rem" }}
                        >
                            <span>📱</span>
                            Contigo Profe en Línea
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlePsychSubmit} className="animate-stagger-3" style={{ marginTop: "1.5rem", textAlign: "left" }}>
                        <div className="form-group">
                            <label htmlFor="psych-username">Usuario</label>
                            <input
                                type="text"
                                id="psych-username"
                                required
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
