import React from 'react';

const capsules = [
    {
        id: 1,
        title: "Técnicas de Respiración 4-7-8",
        description: "Una técnica sencilla para reducir la ansiedad rápidamente. Inhala por 4 segundos, sostén 7 segundos y exhala por 8 segundos.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
        color: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        span: 2
    },
    {
        id: 2,
        title: "Pausas Activas",
        description: "Recuerda levantarte y estirar cada hora para prevenir el estrés laboral y mejorar tu circulación.",
        imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800",
        color: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        span: 1
    },
    {
        id: 3,
        title: "Importancia del Sueño",
        description: "Dormir de 7 a 8 horas mejora tu capacidad de concentración, memoria y estado de ánimo durante el día.",
        imageUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=800",
        color: "linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)",
        span: 1
    },
    {
        id: 4,
        title: "Mindfulness para docentes",
        description: "Dedica 5 minutos antes de clases para estar presente. Cierra los ojos y escucha tu entorno sin juzgarlo.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
        color: "linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%)",
        span: 2
    },
    {
        id: 5,
        title: "Manejo de Emociones",
        description: "Está bien no estar bien. Reconocer tus emociones es el primer paso para procesarlas saludablemente.",
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800",
        color: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
        span: 1
    },
    {
        id: 6,
        title: "Límites Saludables",
        description: "Aprender a decir 'no' es cuidar tu energía. Establece horarios de desconexión digital al salir del trabajo.",
        imageUrl: "https://images.unsplash.com/photo-1476683874822-744764a243a9?auto=format&fit=crop&q=80&w=800",
        color: "linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)",
        span: 2
    }
];

export default function CapsulesView() {
    return (
        <section className="view active animate-fade-in" style={{ paddingBottom: "4rem" }}>
            <div className="header-actions" style={{ marginBottom: "2rem", textAlign: "left" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Cápsulas de Salud Mental</h2>
                <p className="subtitle" style={{ textAlign: "left" }}>
                    Un espacio pensado para tu bienestar. Explora nuestros recursos y consejos.
                </p>
            </div>

            <div className="masonry-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                gridAutoRows: 'minmax(250px, auto)'
            }}>
                {capsules.map((capsule) => (
                    <div
                        key={capsule.id}
                        className="capsule-card hover-lift"
                        style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                            gridColumn: capsule.span === 2 ? 'span 2' : 'span 1',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '300px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            height: '60%',
                            width: '100%',
                            backgroundImage: `url(${capsule.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)'
                            }} />
                        </div>

                        <div style={{
                            padding: '1.5rem',
                            background: '#ffffff',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                marginBottom: '0.8rem',
                                color: '#1e293b'
                            }}>
                                {capsule.title}
                            </h3>
                            <p style={{
                                color: '#64748b',
                                fontSize: '0.95rem',
                                lineHeight: 1.5
                            }}>
                                {capsule.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 30px rgba(0,0,0,0.12) !important;
                }
                
                @media (max-width: 768px) {
                    .masonry-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .capsule-card {
                        grid-column: span 1 !important;
                    }
                }
            `}</style>
        </section>
    );
}
