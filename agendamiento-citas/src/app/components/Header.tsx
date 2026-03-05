import React from "react";
import { UserType, PsychProfile } from "../page";

interface HeaderProps {
    currentUser: UserType;
    psychProfile: PsychProfile;
    activeTab: "agenda" | "profile" | "capsules";
    onTabChange: (tab: "agenda" | "profile" | "capsules") => void;
    onLogout: () => void;
}

export default function Header({
    currentUser,
    psychProfile,
    activeTab,
    onTabChange,
    onLogout,
}: HeaderProps) {
    return (
        <header className="app-header">
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '8px',
                    fontFamily: '"SF Mono", "Consolas", monospace',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                }}>
                    <span style={{ opacity: 0.9, marginRight: '2px' }}>{'{'}</span>
                    <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 900, letterSpacing: '-0.5px' }}>SV</span>
                    <span style={{ opacity: 0.9, marginLeft: '2px' }}>{'}'}</span>
                </div>
                <span>Contigo profe</span>
            </div>

            {currentUser && (
                <nav id="nav-menu" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>

                    {/* Botones comunes para todos */}
                    <a
                        href="#"
                        className={`nav-link ${activeTab === "agenda" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onTabChange("agenda");
                        }}
                    >
                        Mi Agenda
                    </a>

                    {/* Botones solo de Psicóloga */}
                    {currentUser === "psychologist" && (
                        <>
                            <a
                                href="#"
                                className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabChange("profile");
                                }}
                            >
                                Perfil
                            </a>
                            <a
                                href="#"
                                className={`nav-link ${activeTab === "capsules" ? "active" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabChange("capsules");
                                }}
                            >
                                Cápsulas
                            </a>
                        </>
                    )}

                    <button onClick={onLogout} className="nav-link text-btn">
                        Cerrar Sesión
                    </button>

                    <div className="user-profile">
                        <img
                            src={currentUser === "teacher" ? "https://i.pravatar.cc/150?img=1" : psychProfile.avatarUrl}
                            alt="Avatar"
                            className="avatar"
                        />
                        <div className="user-info">
                            <span className="user-name">
                                {currentUser === "teacher" ? "Paciente" : psychProfile.name}
                            </span>
                            <span className="user-role">
                                {currentUser === "teacher" ? "Modo Paciente" : "Modo Psicóloga"}
                            </span>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
