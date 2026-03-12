"use client";

import React, { useState, useEffect, useRef } from 'react';

export interface Capsule {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    color: string;
    span: number;
}

export default function AdminCapsulesView({
    capsules,
    onForceReload,
    profeEnLineaImageUrl
}: {
    capsules: Capsule[],
    onForceReload: () => void,
    profeEnLineaImageUrl: string
}) {
    // Form state for Capsules
    const [isEditing, setIsEditing] = useState(false);
    const [currentCapsule, setCurrentCapsule] = useState<Partial<Capsule> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for Profe en Linea Flyer
    const [flyerUrl, setFlyerUrl] = useState(profeEnLineaImageUrl || "");
    const [isSubmittingFlyer, setIsSubmittingFlyer] = useState(false);

    useEffect(() => {
        setFlyerUrl(profeEnLineaImageUrl || "");
    }, [profeEnLineaImageUrl]);

    // File input ref for capsules
    const fileInputRef = useRef<HTMLInputElement>(null);

    // File input ref for flyer
    const flyerInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás segura de que quieres eliminar esta cápsula?')) return;

        try {
            const res = await fetch(`/api/capsules?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete capsule');
            onForceReload();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Error al eliminar cápsula');
        }
    };

    const handleEditClick = (capsule: Capsule) => {
        setCurrentCapsule(capsule);
        setIsEditing(true);
    };

    const handleCreateClick = () => {
        setCurrentCapsule({
            title: '',
            description: '',
            imageUrl: '',
            color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
            span: 1
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentCapsule(null);
    };

    // Manejo de carga de imagen local via file input -> base64
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño (ej. max 2MB para evitar JSON gigante)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no puede pesar más de 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (currentCapsule) {
                setCurrentCapsule({
                    ...currentCapsule,
                    imageUrl: reader.result as string
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Manejo de carga de imagen para Profe en linea
    const handleFlyerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no puede pesar más de 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFlyerUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFlyerSubmit = async () => {
        if (!flyerUrl) {
            alert("Por favor selecciona o ingresa una URL de imagen.");
            return;
        }

        setIsSubmittingFlyer(true);
        try {
            const res = await fetch('/api/settings/profe-en-linea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: flyerUrl })
            });

            if (!res.ok) throw new Error('Error guardando flyer');

            alert('Flyer guardado exitosamente');
            onForceReload();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Error al guardar el flyer');
        } finally {
            setIsSubmittingFlyer(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCapsule || !currentCapsule.title || !currentCapsule.description || !currentCapsule.imageUrl) {
            alert('Por favor completa todos los campos (Título, Descripción e Imagen)');
            return;
        }

        setIsSubmitting(true);
        const isUpdate = !!currentCapsule.id;

        try {
            const url = isUpdate ? `/api/capsules?id=${currentCapsule.id}` : '/api/capsules';
            const method = isUpdate ? 'PUT' : 'POST';

            // Si es nueva, no mandar ID (se genera en backend)
            const bodyData = { ...currentCapsule };
            if (!isUpdate) {
                delete bodyData.id;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (!res.ok) throw new Error('Error guardando cápsula');

            onForceReload();
            setIsEditing(false);
            setCurrentCapsule(null);
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Error al guardar la cápsula');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <section className="view active animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div className="header-actions" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Administrar Cápsulas</h2>
                    <p className="subtitle" style={{ margin: 0 }}>
                        Gestiona el contenido de bienestar para tus pacientes y docentes.
                    </p>
                </div>
                {!isEditing && (
                    <button onClick={handleCreateClick} className="btn-primary" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nueva Cápsula
                    </button>
                )}
            </div>

            {/* Configuración Profe En Linea */}
            {!isEditing && (
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#1e293b' }}>Configuración: Profe en Línea</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Administra la imagen del flyer de atención y orientación. Esta imagen aparecerá cuando los usuarios hagan clic en &quot;Contigo Profe en Línea&quot;.</p>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div
                            onClick={() => flyerInputRef.current?.click()}
                            style={{
                                width: '200px',
                                height: '280px',
                                borderRadius: '12px',
                                border: '2px dashed #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                backgroundColor: '#f8fafc',
                                flexShrink: 0
                            }}
                        >
                            {flyerUrl ? (
                                <img src={flyerUrl} alt="Preview Flyer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ color: '#64748b', textAlign: 'center' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem block' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    <span style={{ fontSize: '0.9rem' }}>Click para subir</span>
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
                            <input
                                type="file"
                                ref={flyerInputRef}
                                onChange={handleFlyerImageChange}
                                accept="image/jpeg, image/png, image/webp"
                                style={{ display: 'none' }}
                            />

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>URL de Imagen</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ padding: '0.75rem', fontSize: '0.95rem', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    value={flyerUrl?.startsWith('http') ? flyerUrl : ''}
                                    onChange={e => setFlyerUrl(e.target.value)}
                                    placeholder="O pega el link (https://...)"
                                />
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                                <button
                                    onClick={handleFlyerSubmit}
                                    className="btn-primary"
                                    disabled={isSubmittingFlyer || !flyerUrl}
                                >
                                    {isSubmittingFlyer ? 'Guardando...' : 'Guardar Flyer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {isEditing ? (
                // Formulario
                <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{currentCapsule?.id ? 'Editar Cápsula' : 'Crear Nueva Cápsula'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="form-group row" style={{ margin: 0 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Título *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={currentCapsule?.title || ''}
                                    onChange={e => setCurrentCapsule({ ...currentCapsule, title: e.target.value })}
                                    placeholder="Ej: Técnicas de Respiración"
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ width: '150px' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tamaño (Columnas)</label>
                                <select
                                    className="input-field"
                                    value={currentCapsule?.span || 1}
                                    onChange={e => setCurrentCapsule({ ...currentCapsule, span: parseInt(e.target.value, 10) })}
                                >
                                    <option value={1}>Normal (1)</option>
                                    <option value={2}>Ancho (2)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Descripción *</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                value={currentCapsule?.description || ''}
                                onChange={e => setCurrentCapsule({ ...currentCapsule, description: e.target.value })}
                                placeholder="Escribe el consejo o técnica aquí..."
                                required
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Imagen *</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                {/* Image Preview Area */}
                                <div
                                    onClick={handleTriggerFileInput}
                                    style={{
                                        width: '200px',
                                        height: '150px',
                                        borderRadius: '12px',
                                        border: '2px dashed #cbd5e1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        backgroundColor: '#f8fafc'
                                    }}
                                >
                                    {currentCapsule?.imageUrl ? (
                                        <img src={currentCapsule.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ color: '#64748b', textAlign: 'center' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem block' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                            <span style={{ fontSize: '0.9rem' }}>Click para subir</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/jpeg, image/png, image/webp"
                                        style={{ display: 'none' }}
                                    />
                                    <button type="button" onClick={handleTriggerFileInput} className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem' }}>
                                        Subir Archivo de Imagen
                                    </button>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Recomendado: Imágenes de Unsplash o archivos locales peso menor a 2MB.</span>

                                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <hr style={{ flex: 1, borderColor: '#e2e8f0', margin: 0 }} />
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>O usar URL</span>
                                        <hr style={{ flex: 1, borderColor: '#e2e8f0', margin: 0 }} />
                                    </div>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                        value={currentCapsule?.imageUrl?.startsWith('http') ? currentCapsule.imageUrl : ''}
                                        onChange={e => setCurrentCapsule({ ...currentCapsule, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button type="button" onClick={handleCancelEdit} className="btn-secondary" disabled={isSubmitting}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Cápsula'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Lista de cápsulas en estilo tabla o cards pequeñas
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {capsules.map(capsule => (
                        <div key={capsule.id} style={{
                            background: '#fff',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                                <img src={capsule.imageUrl} alt={capsule.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    Span: {capsule.span}
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e293b' }}>{capsule.title}</h4>
                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, flex: 1 }}>
                                    {capsule.description.length > 80 ? capsule.description.substring(0, 80) + '...' : capsule.description}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => handleEditClick(capsule)}
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', justifyContent: 'center' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(capsule.id)}
                                        style={{
                                            background: '#fee2e2',
                                            color: '#b91c1c',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            width: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title="Eliminar"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {capsules.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                            <p>No hay cápsulas creadas. ¡Crea la primera!</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
