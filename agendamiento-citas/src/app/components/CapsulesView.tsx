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
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'Hubo un error al enviar tu sugerencia.');
        } finally {
            setIsSubmittingSuggestion(false);
        }
    };

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

            {/* Float Action Button para Sugerencias (Chat Icon) */}
            {!showSuggestionModal && (
                <button
                    onClick={() => setShowSuggestionModal(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        background: 'var(--primary-color, #63a4ff)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(99, 164, 255, 0.4)',
                        zIndex: 900,
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        animation: 'chatPopUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(99, 164, 255, 0.5)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 164, 255, 0.4)';
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </button>
            )}

            {/* Widget de Buzón de Sugerencias (Estilo Chat Flotante) */}
            {showSuggestionModal && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        background: '#ffffff',
                        borderRadius: '24px',
                        width: '360px',
                        maxWidth: 'calc(100vw - 4rem)',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 20px rgba(99, 164, 255, 0.1)',
                        zIndex: 9999,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'chatPopUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        transformOrigin: 'bottom right'
                    }}
                >
                    {/* Header del Chat */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary-color, #63a4ff) 0%, var(--primary-hover, #4e8deb) 100%)',
                        padding: '1.25rem 1.5rem',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary-color)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"></path><path d="M18 9h2"></path></svg>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Sugerencias</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9, fontWeight: 500 }}>Buzón de Ideas</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSuggestionModal(false)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                backdropFilter: 'blur(4px)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Cuerpo del Chat */}
                    <div style={{ padding: '1.5rem', background: '#fafbfc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Mensaje Tipo Burbuja de Chat */}
                        <div style={{
                            background: 'white',
                            padding: '1.25rem',
                            borderRadius: '16px 16px 16px 4px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                            border: '1px solid #f1f5f9',
                            position: 'relative'
                        }}>
                            <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                                ¡Hola! 👋<br /><br />
                                ¿Hay alguna cápsula, recurso o taller que te gustaría ver? Déjanos tu idea aquí abajo para construir esto juntos.
                            </p>
                            <div style={{
                                position: 'absolute',
                                left: '-8px',
                                bottom: '0',
                                width: '16px',
                                height: '16px',
                                background: 'inherit',
                                borderLeft: '1px solid #f1f5f9',
                                borderBottom: '1px solid #f1f5f9',
                                borderBottomLeftRadius: '16px',
                                zIndex: -1,
                                clipPath: 'polygon(0 0, 100% 100%, 100% 0)'
                            }}></div>
                        </div>

                        <form onSubmit={handleSuggestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tu Nombre (Opcional)"
                                    value={suggestionName}
                                    onChange={e => setSuggestionName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1rem',
                                        fontSize: '0.95rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        transition: 'all 0.2s',
                                        outline: 'none',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'var(--primary-color)';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 164, 255, 0.15)';
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.01)';
                                    }}
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={3}
                                    placeholder="Escribe tu sugerencia aquí..."
                                    required
                                    value={suggestionText}
                                    onChange={e => setSuggestionText(e.target.value)}
                                    style={{
                                        width: '100%',
                                        resize: 'none',
                                        padding: '0.9rem 1rem',
                                        fontSize: '0.95rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        transition: 'all 0.2s',
                                        outline: 'none',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = 'var(--primary-color)';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 164, 255, 0.15)';
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.01)';
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                                <button
                                    type="submit"
                                    disabled={isSubmittingSuggestion || !suggestionText.trim()}
                                    style={{
                                        padding: '0.75rem 1.4rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: isSubmittingSuggestion || !suggestionText.trim() ? '#cbd5e1' : 'var(--primary-color, #63a4ff)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '24px',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        cursor: isSubmittingSuggestion || !suggestionText.trim() ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isSubmittingSuggestion || !suggestionText.trim() ? 'none' : '0 4px 12px rgba(99, 164, 255, 0.3)'
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSubmittingSuggestion && suggestionText.trim()) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 15px rgba(99, 164, 255, 0.4)';
                                            e.currentTarget.style.background = 'var(--primary-hover, #4e8deb)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSubmittingSuggestion && suggestionText.trim()) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 164, 255, 0.3)';
                                            e.currentTarget.style.background = 'var(--primary-color, #63a4ff)';
                                        }
                                    }}
                                >
                                    {isSubmittingSuggestion ? (
                                        <>
                                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <span>Enviar Mensaje</span>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                        </>
                                    )}
                                </button>
                            </div>
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

                @keyframes chatPopUp {
                    from { opacity: 0; transform: scale(0.8) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
