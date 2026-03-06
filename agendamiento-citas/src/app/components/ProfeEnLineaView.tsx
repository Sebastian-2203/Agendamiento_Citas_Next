import React from 'react';

interface ProfeEnLineaViewProps {
    onBack?: () => void;
    imageUrl?: string;
}

export default function ProfeEnLineaView({ onBack, imageUrl }: ProfeEnLineaViewProps) {
    return (
        <section className="view active animate-fade-in container" style={{ paddingBottom: "4rem", paddingTop: "2rem" }}>
            <div className="header-actions" style={{ marginBottom: "2rem", textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="btn-secondary"
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "8px" }}
                    >
                        <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        Volver al inicio
                    </button>
                )}
                <div>
                    <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Contigo Profe en Línea</h2>
                    <p className="subtitle" style={{ textAlign: "left", margin: 0 }}>
                        Atención y orientación en salud mental para docentes.
                    </p>
                </div>
            </div>

            <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                minHeight: '300px',
                alignItems: 'center'
            }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Contigo Profe en Línea Flyer"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            maxHeight: '80vh',
                            objectFit: 'contain'
                        }}
                    />
                ) : (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        <p>No hay un flyer configurado actualmente.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </section>
    );
}
