import React, { useState } from 'react';

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
    const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);

    // Suggestion Box State
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const [suggestionName, setSuggestionName] = useState('');
    const [suggestionText, setSuggestionText] = useState('');
    const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

    const handleSuggestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestionText.trim()) return;

        setIsSubmittingSuggestion(true);
        try {
            const res = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: suggestionName,
                    suggestion: suggestionText
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert('¡Gracias! Tu sugerencia ha sido enviada con éxito.');
                setShowSuggestionModal(false);
                setSuggestionName('');
                setSuggestionText('');
            } else {
                throw new Error(data.message || 'Error al enviar');
            }
        } catch (error: any) {
            alert(error.message || 'Hubo un error al enviar tu sugerencia.');
        } finally {
            setIsSubmittingSuggestion(false);
        }
    };

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
                            onClick={() => setSelectedCapsule(capsule)}
                        >
                            <div style={{
                                height: '100%',
                                width: '100%',
                                backgroundImage: `url(${capsule.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 100%)'
                                }} />
                                {/* Título sobre la imagen en la tarjeta */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1rem',
                                    left: '1rem',
                                    right: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}>
                                    <h3 style={{
                                        color: '#ffffff',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        margin: 0,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                    }}>
                                        {capsule.title}
                                    </h3>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            color: '#0f172a',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}>
                                            Abrir Cápsula
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Detalle de Cápsula */}
            {selectedCapsule && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                    onClick={() => setSelectedCapsule(null)}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={e => e.stopPropagation()} // Evitar cerrar al hacer click dentro del modal
                    >
                        {/* Botón Cerrar */}
                        <button
                            onClick={() => setSelectedCapsule(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10,
                                backdropFilter: 'blur(4px)',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* Contenido Scrollable (Imagen Flyer + Texto) */}
                        <div style={{ overflowY: 'auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Imagen completa (flyer) que crece verticalmente */}
                            <div style={{ width: '100%', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', minHeight: '200px' }}>
                                <img
                                    src={selectedCapsule.imageUrl}
                                    alt={selectedCapsule.title}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>

                            {/* Contenido Texto */}
                            <div style={{ padding: '2rem', flexShrink: 0, backgroundColor: '#ffffff' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', lineHeight: 1.2 }}>
                                    {selectedCapsule.title}
                                </h2>
                                <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                    {selectedCapsule.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Float Action Button para Sugerencias */}
            <button
                onClick={() => setShowSuggestionModal(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    zIndex: 900,
                    transition: 'transform 0.2s',
                    animation: 'slideUp 0.5s ease-out'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>¡Sugiere un Recurso!</span>
            </button>

            {/* Modal de Buzón de Sugerencias */}
            {showSuggestionModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                    onClick={() => setShowSuggestionModal(false)}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '500px',
                            padding: '2.5rem',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowSuggestionModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"></path><path d="M18 9h2"></path></svg>
                            </div>
                            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Buzón de Sugerencias</h2>
                            <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
                                ¿Hay algún tema o cápsula que te gustaría ver? ¡Escríbele a nuestra Psicóloga!
                            </p>
                        </div>

                        <form onSubmit={handleSuggestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Tu Nombre (Opcional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Ej: Profe Juanita"
                                    value={suggestionName}
                                    onChange={e => setSuggestionName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Tu Sugerencia *</label>
                                <textarea
                                    className="input-field"
                                    rows={5}
                                    placeholder="Me gustaría que subieran una cápsula sobre manejo de estrés en el aula..."
                                    required
                                    value={suggestionText}
                                    onChange={e => setSuggestionText(e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmittingSuggestion}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: isSubmittingSuggestion ? '#94a3b8' : '#3b82f6'
                                }}
                            >
                                {isSubmittingSuggestion ? (
                                    <>
                                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                        Enviar Sugerencia
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
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

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </section>
    );
}
