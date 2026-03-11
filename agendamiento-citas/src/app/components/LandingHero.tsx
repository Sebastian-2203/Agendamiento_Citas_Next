import React from "react";

interface LandingHeroProps {
    onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="hero-badge animate-stagger-1">
                    ✨ Nueva plataforma de bienestar estudiantil
                </div>
                <h1 className="hero-title animate-stagger-2">
                    Soporte académico y salud mental en un solo lugar
                </h1>
                <p className="hero-subtitle animate-stagger-3">
                    Sistema integral para colegios: agendamiento inteligente, recursos psicoeducativos diarios y soporte emocional continuo para toda tu comunidad.
                </p>
                <div className="hero-actions animate-stagger-4">
                    <button className="btn-primary hero-btn" onClick={onGetStarted}>
                        Comenzar ahora
                    </button>
                    <button className="btn-secondary hero-btn glass-btn" onClick={() => {
                        const featuresSection = document.getElementById('features');
                        if (featuresSection) {
                            featuresSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}>
                        Ver características
                    </button>
                </div>
            </div>

            <div className="hero-visual animate-stagger-5">
                <div className="glass-card mockup-calendar">
                    <div className="mockup-header">
                        <span className="dot dot-red"></span>
                        <span className="dot dot-yellow"></span>
                        <span className="dot dot-green"></span>
                    </div>
                    <div className="mockup-body">
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Agendamiento Inteligente</h4>
                        <div className="mockup-line"></div>
                        <div className="mockup-line"></div>
                        <div className="mockup-line short"></div>
                        <div className="mockup-btn" style={{ marginTop: '2rem' }}>
                            Confirmar Cita
                        </div>
                    </div>
                </div>

                <div className="glass-card mockup-capsule">
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠</div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Cápsulas de Salud</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Recursos diarios para tu bienestar emocional</p>
                </div>
            </div>
        </section>
    );
}
