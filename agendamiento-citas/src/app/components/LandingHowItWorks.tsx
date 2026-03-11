import React from "react";

export default function LandingHowItWorks({ onAction }: { onAction: () => void }) {
    const steps = [
        {
            number: "01",
            title: "El usuario ingresa",
            description: "Docentes o estudiantes acceden a la plataforma de forma segura."
        },
        {
            number: "02",
            title: "Selecciona el servicio",
            description: "Pueden agendar una cita o explorar recursos de salud mental."
        },
        {
            number: "03",
            title: "Soporte inmediato",
            description: "Las citas se confirman instantáneamente respetando la disponibilidad."
        }
    ];

    return (
        <section id="how-it-works" className="hiw-section">
            <div className="hiw-container">
                <div className="hiw-content">
                    <h2 className="section-title">¿Cómo funciona?</h2>
                    <p className="section-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
                        Un flujo de trabajo optimizado que elimina las barreras entre el docente y el apoyo que necesita.
                    </p>

                    <div className="steps-list">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item">
                                <div className="step-number">{step.number}</div>
                                <div className="step-text">
                                    <h4>{step.title}</h4>
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn-primary mt-4" style={{ padding: '1rem 2.5rem', borderRadius: '50px' }} onClick={onAction}>
                        Ver una demostración
                    </button>
                </div>

                <div className="hiw-visual">
                    <div className="abstract-shape">
                        {/* Decorative graphical representation */}
                        <div className="shape-circle blue"></div>
                        <div className="shape-circle green"></div>
                        <div className="shape-glass"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
