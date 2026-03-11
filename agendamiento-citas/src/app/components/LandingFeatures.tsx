import React from "react";

export default function LandingFeatures() {
    const features = [
        {
            icon: "📅",
            title: "Agendamiento Inteligente",
            description: "Sistema de reservas adaptado a los horarios específicos de cada sede, evitando cruces y confusiones."
        },
        {
            icon: "🧠",
            title: "Recursos Psicoeducativos",
            description: "Cápsulas de salud mental accesibles en cualquier momento para apoyar el bienestar emocional de la comunidad."
        },
        {
            icon: "📱",
            title: "Profe en Línea",
            description: "Acceso rápido a canales de orientación académica y apoyo directo para estudiantes y docentes."
        },
        {
            icon: "🔒",
            title: "Privacidad y Control",
            description: "Entorno seguro donde solo la psicóloga asignada maneja la información sensible de sus pacientes."
        }
    ];

    return (
        <section id="features" className="features-section">
            <div className="section-header">
                <h2 className="section-title">Todo lo que tu colegio necesita</h2>
                <p className="section-subtitle">
                    Herramientas diseñadas específicamente para facilitar la gestión del bienestar
                    estudiantil y el soporte psicológico.
                </p>
            </div>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">{feature.icon}</div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-desc">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
