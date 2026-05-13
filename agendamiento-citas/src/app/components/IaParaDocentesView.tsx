import React, { useState, useEffect } from 'react';

interface IaParaDocentesViewProps {
    onBack: () => void;
}

export default function IaParaDocentesView({ onBack }: IaParaDocentesViewProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const aiTools = [
        {
            name: "ChatGPT",
            description: "Conversaciones generales, explicaciones cotidianas, escritura, verificación de ortografía. La IA más equilibrada, con muchas versiones que se acoplan al uso diario.",
            icon: "💬",
            color: "from-emerald-400 to-teal-500",
            shadow: "rgba(16, 185, 129, 0.4)"
        },
        {
            name: "Gemini",
            description: "Integrada con Google (Docs, Sheets, Gmail, etc). Excelente para generación de documentos largos, búsqueda y análisis profundo, y para realizar investigaciones.",
            icon: "✨",
            color: "from-blue-400 to-indigo-500",
            shadow: "rgba(59, 130, 246, 0.4)"
        },
        {
            name: "Claude",
            description: "Escritura muy avanzada, especializado en programación, respuestas más naturales. Tiene muy buena lógica, código, y análisis más profundo y profesional.",
            icon: "🧠",
            color: "from-orange-400 to-amber-500",
            shadow: "rgba(245, 158, 11, 0.4)"
        },
        {
            name: "SORA",
            description: "Pertenece a OpenAI. Genera videos realistas a base de texto. Ideal para realizar videos con explicaciones, haciendo el contenido mucho más llamativo.",
            icon: "🎬",
            color: "from-purple-400 to-fuchsia-500",
            shadow: "rgba(168, 85, 247, 0.4)"
        },
        {
            name: "MagicSchool AI",
            description: "Planeaciones, rúbricas, exámenes con prompts pre-configurados. Usa lenguaje pedagógico y adapta metodologías a poblaciones con diferentes condiciones (ej. TDAH).",
            icon: "🏫",
            color: "from-pink-400 to-rose-500",
            shadow: "rgba(244, 63, 94, 0.4)"
        },
        {
            name: "Perplexity",
            description: "El mejor investigando por internet. Busca y genera fuentes, tiene la información más actualizada y referencia las páginas. No tiende a inventar lo que no encuentra.",
            icon: "🔍",
            color: "from-cyan-400 to-blue-500",
            shadow: "rgba(6, 182, 212, 0.4)"
        }
    ];

    const considerations = [
        {
            title: "No confundir",
            icon: "⚠️",
            content: "Si bien las IA nos pueden decir lo que nosotros queremos, estas no están hechas para ser terapéuticas o incluso \"Amigos\". La IA generalmente buscará decirnos y darnos la razón en todo, por lo cual debemos tener cuidado con lo que compartimos."
        },
        {
            title: "Verifica",
            icon: "✅",
            content: "Las IA se actualizan a diario con conocimiento nuevo y aprenden del uso diario, pero siempre ten presente que la información puede tener un margen de equivocación o ser inventada. Siempre verifica la información para estar 100% seguro."
        },
        {
            title: "Herramientas detectoras",
            icon: "🛡️",
            content: "Para revisar textos proporcionados por estudiantes, existen herramientas que detectan si se apoyaron en IA o si el 100% fue generado. La misma IA es capaz de detectar su contenido. Detectores recomendados: Textguard.ai."
        }
    ];

    return (
        <section 
            className="view active" 
            style={{ 
                minHeight: '100vh', 
                backgroundColor: '#f5f5f7',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                paddingBottom: '4rem',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                color: '#1d1d1f'
            }}
        >
            {/* Header / Navbar style */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'saturate(180%) blur(20px)',
                WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                padding: '1rem 0',
                transition: 'all 0.3s ease'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "transparent",
                            border: "none",
                            color: "#0066cc",
                            fontSize: "1rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            padding: "0.5rem 0",
                            transition: "opacity 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        Volver
                    </button>
                    <div style={{ fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                        Cápsulas formativas
                    </div>
                    <div style={{ width: '80px' }}></div> {/* Spacer for centering */}
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', paddingTop: '4rem' }}>
                
                {/* Hero Section */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '5rem',
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
                }}>
                    <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                        fontWeight: 700, 
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #1d1d1f 0%, #434345 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Inteligencia Artificial.<br/>
                        <span style={{ 
                            background: 'linear-gradient(135deg, #0066cc 0%, #5ac8fa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Aliado del docente.
                        </span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.5,
                        color: '#86868b',
                        maxWidth: '600px',
                        margin: '0 auto',
                        fontWeight: 400
                    }}>
                        Descubre cómo las herramientas de IA pueden potenciar tu labor pedagógica, optimizar tu tiempo y mejorar las experiencias de aprendizaje.
                    </p>
                </div>

                {/* Grid de IA's */}
                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        letterSpacing: '-0.015em',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        Herramientas principales
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        perspective: '1000px'
                    }}>
                        {aiTools.map((tool, index) => (
                            <div 
                                key={tool.name}
                                className="ai-card"
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '24px',
                                    padding: '2rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                    opacity: isVisible ? 1 : 0,
                                    transitionDelay: `${0.2 + (index * 0.1)}s`,
                                    border: '1px solid rgba(0,0,0,0.02)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = `0 20px 40px ${tool.shadow}`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                    {tool.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                                    {tool.name}
                                </h3>
                                <p style={{ fontSize: '1rem', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
                                    {tool.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prompts Section (Featured) */}
                <div style={{
                    background: 'linear-gradient(145deg, #1d1d1f, #000000)',
                    borderRadius: '32px',
                    padding: 'clamp(2rem, 5vw, 4rem)',
                    color: 'white',
                    marginBottom: '4rem',
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Domina las IA
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                El arte del Prompt
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#a1a1a6', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '600px' }}>
                                Las inteligencias artificiales están hechas para ayudarnos, siempre y cuando usemos los prompts (instrucciones) adecuados. Sé directo y específico con el escenario que buscas.
                            </p>
                            
                            <div style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                padding: '2rem', 
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#5ac8fa' }}></div>
                                <div style={{ fontSize: '0.85rem', color: '#5ac8fa', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ejemplo de un buen Prompt</div>
                                <code style={{ 
                                    fontFamily: '"SF Mono", Menlo, Monaco, Consolas, monospace', 
                                    fontSize: '0.95rem',
                                    color: '#f5f5f7',
                                    lineHeight: 1.6,
                                    display: 'block',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    "Actúa como un docente experto en didáctica de las matemáticas.{"\n\n"}
                                    Diseña un plan de clase completo sobre “ecuaciones lineales de primer grado” para estudiantes de 13 años.{"\n"}
                                    El plan debe durar 60 minutos e incluir:{"\n"}
                                    • Objetivo de aprendizaje{"\n"}
                                    • Competencias a desarrollar{"\n"}
                                    • Explicación paso a paso{"\n"}
                                    • Ejemplo explicado{"\n"}
                                    • Actividad práctica individual{"\n"}
                                    • Actividad grupal dinámica{"\n"}
                                    • Preguntas para evaluar comprensión{"\n"}
                                    • Errores comunes{"\n"}
                                    • Estrategias para dificultades{"\n"}
                                    • Actividad de cierre{"\n"}
                                    • Tarea para casa{"\n\n"}
                                    Usa lenguaje claro y pedagógico, incluye tiempos y materiales."
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recomendations Grid */}
                <div>
                    <h2 style={{ 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        letterSpacing: '-0.015em',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        Cosas a tener en cuenta
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {considerations.map((item, index) => (
                            <div 
                                key={item.title}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '24px',
                                    padding: '2rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                    opacity: isVisible ? 1 : 0,
                                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                    transitionDelay: `${1 + (index * 0.1)}s`,
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{item.title}</h3>
                                <p style={{ fontSize: '1rem', color: '#86868b', lineHeight: 1.5, margin: 0 }}>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </section>
    );
}
