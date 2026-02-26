import React from "react";
import { UserType, PsychProfile } from "../page";

interface HeaderProps {
    currentUser: UserType;
    psychProfile: PsychProfile;
    activeTab: "agenda" | "profile";
    onTabChange: (tab: "agenda" | "profile") => void;
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
            <div className="logo">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                    <path d="M12 2v20"></path>
                    <path d="M5 10c0-3.9 3.1-7 7-7s7 3.1 7 7v4"></path>
                    <path d="M2.5 14h19"></path>
                </svg>
                Contigo profe
            </div>

            {currentUser && (
                <nav id="nav-menu">
                    {currentUser === "psychologist" && (
                        <>
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
