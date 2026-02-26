import React, { useState } from "react";
import { PsychProfile } from "../page";

interface ProfileViewProps {
    profile: PsychProfile;
    onSave: (newProfile: PsychProfile) => void;
}

export default function ProfileView({ profile, onSave }: ProfileViewProps) {
    const [name, setName] = useState(profile.name);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (evt.target?.result) {
                    setAvatarUrl(evt.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, avatarUrl });
        alert("Perfil actualizado correctamente");
    };

    return (
        <section id="profile-view" className="view active" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <div className="calendar-container" style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "var(--text-main)" }}>Mi Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                        <img
                            id="profile-preview-img"
                            src={avatarUrl}
                            alt="Avatar"
                            className="avatar"
                            style={{ width: "100px", height: "100px", border: "3px solid white", boxShadow: "var(--shadow-sm)" }}
                        />

                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <label htmlFor="profile-img-upload" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}>
                                Cambiar foto
                            </label>
                            <input
                                type="file"
                                id="profile-img-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ textAlign: "left" }}>
                        <label htmlFor="profile-name">Nombre de Psicóloga</label>
                        <input
                            type="text"
                            id="profile-name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                        />
                    </div>

                    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" className="btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
