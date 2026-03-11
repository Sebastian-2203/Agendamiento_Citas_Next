import React from "react";

export default function PublicFooter() {
    return (
        <footer className="public-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-col brand-col">
                        <div className="logo footer-logo">
                            <span className="logo-icon">{'{'} SV {'}'}</span> Contigo Profe
                        </div>
                        <p>
                            Transformando el bienestar estudiantil a través de tecnología accesible,
                            inteligente y empática.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Producto</h4>
                        <ul>
                            <li><a href="#features">Características</a></li>
                            <li><a href="#pricing">Planes para Colegios</a></li>
                            <li><a href="#updates">Actualizaciones</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Recursos</h4>
                        <ul>
                            <li><a href="#capsules">Cápsulas de Salud mental</a></li>
                            <li><a href="#blog">Blog Educativo</a></li>
                            <li><a href="#support">Centro de Ayuda</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Compañía</h4>
                        <ul>
                            <li><a href="#about">Sobre nosotros</a></li>
                            <li><a href="#privacy">Privacidad</a></li>
                            <li><a href="#terms">Términos de servicio</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} SYV Solutions. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
