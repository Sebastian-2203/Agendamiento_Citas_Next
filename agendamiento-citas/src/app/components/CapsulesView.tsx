import React from 'react';

export interface Capsule {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    color: string;
    span: number;
}

interface CapsulesViewProps {
    capsules: Capsule[];
    onBack?: () => void;
}

export default function CapsulesView({ capsules, onBack }: CapsulesViewProps) {

    return (
        <section className="view active animate-fade-in" style={{ paddingBottom: "4rem" }}>
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
                    <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Cápsulas de Salud Mental</h2>
                    <p className="subtitle" style={{ textAlign: "left", margin: 0 }}>
                        Un espacio pensado para tu bienestar. Explora nuestros recursos y consejos.
                    </p>
                </div>
            </div>

            {capsules.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                    <p>No hay cápsulas disponibles por el momento.</p>
                </div>
            ) : (
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
            )}

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
