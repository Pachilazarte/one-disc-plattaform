/**
 * 📄 LÓGICA DEL INFORME DISC
 * Visualización y generación de informes PDF
 */

// Variables globales
let reportData = null;

// Descripciones de perfiles DISC
const profileDescriptions = {
    D: {
        name: "Dominancia",
        description: "Las personas con alto puntaje en Dominancia son directas, decididas y orientadas a resultados. Les gusta tomar el control, enfrentar desafíos y lograr metas de manera rápida y eficiente.",
        characteristics: [
            "Orientado a resultados y metas",
            "Toma decisiones rápidas y con confianza",
            "Directo en la comunicación",
            "Acepta desafíos con entusiasmo",
            "Prefiere tener el control de situaciones",
            "Se enfoca en el panorama general"
        ],
        strengths: [
            "Liderazgo natural",
            "Capacidad para tomar decisiones difíciles",
            "Orientación a la acción",
            "Manejo efectivo de crisis"
        ],
        growth: [
            "Practicar la paciencia con otros",
            "Escuchar más antes de decidir",
            "Considerar los sentimientos de los demás",
            "Delegar con confianza"
        ]
    },
    I: {
        name: "Influencia",
        description: "Las personas con alto puntaje en Influencia son sociables, entusiastas y persuasivas. Disfrutan interactuar con otros, crear relaciones y generar un ambiente positivo y motivador.",
        characteristics: [
            "Comunicativo y expresivo",
            "Optimista y entusiasta",
            "Persuasivo y motivador",
            "Disfruta del trabajo en equipo",
            "Creativo en la resolución de problemas",
            "Busca reconocimiento y aprobación"
        ],
        strengths: [
            "Excelentes habilidades de comunicación",
            "Capacidad para inspirar y motivar",
            "Networking natural",
            "Adaptabilidad social"
        ],
        growth: [
            "Mejorar el seguimiento de tareas",
            "Ser más detallista en proyectos",
            "Manejar mejor el tiempo",
            "Escuchar activamente sin interrumpir"
        ]
    },
    S: {
        name: "Estabilidad",
        description: "Las personas con alto puntaje en Estabilidad son pacientes, confiables y colaborativas. Valoran la armonía, la consistencia y el apoyo mutuo en el trabajo en equipo.",
        characteristics: [
            "Paciente y buen oyente",
            "Leal y confiable",
            "Prefiere la estabilidad y rutina",
            "Excelente en trabajo colaborativo",
            "Evita conflictos",
            "Ritmo de trabajo constante"
        ],
        strengths: [
            "Construcción de relaciones sólidas",
            "Confiabilidad excepcional",
            "Paciencia con procesos largos",
            "Mediación en conflictos"
        ],
        growth: [
            "Ser más asertivo cuando es necesario",
            "Adaptarse mejor a cambios rápidos",
            "Expresar opiniones con más confianza",
            "Aceptar nuevos desafíos"
        ]
    },
    C: {
        name: "Cumplimiento",
        description: "Las personas con alto puntaje en Cumplimiento son analíticas, precisas y orientadas a la calidad. Valoran los datos, la exactitud y seguir procedimientos establecidos.",
        characteristics: [
            "Analítico y detallista",
            "Preciso en su trabajo",
            "Sigue reglas y procedimientos",
            "Valora la calidad sobre la velocidad",
            "Pensamiento lógico y sistemático",
            "Prefiere trabajar de forma independiente"
        ],
        strengths: [
            "Atención excepcional al detalle",
            "Análisis profundo de problemas",
            "Alta calidad en el trabajo",
            "Pensamiento crítico desarrollado"
        ],
        growth: [
            "Ser más flexible con los procedimientos",
            "Tomar decisiones con información incompleta",
            "Delegar tareas de análisis",
            "Aceptar que la perfección no siempre es necesaria"
        ]
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadReport();
});

/**
 * Cargar datos del informe
 */
async function loadReport() {
    // Obtener email del parámetro URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (!email) {
        showError('No se especificó el email del usuario');
        return;
    }
    
    try {
        const response = await Helpers.fetchGET(CONFIG.api.informes, {
            accion: 'getUserResult',
            email: email
        });

        if (response.success && response.data) {
            reportData = response.data;
            renderReport();
        } else {
            showError('No se encontraron resultados para este usuario');
        }
    } catch (error) {
        console.error('Error al cargar informe:', error);
        
        // Datos de ejemplo para desarrollo
        reportData = {
            nombre: 'Juan',
            apellido: 'Pérez',
            email: email,
            fecha: new Date().toISOString(),
            puntajes: { D: 32, I: 28, S: 24, C: 20 },
            perfilDominante: 'D'
        };
        renderReport();
    }
}

/**
 * Renderizar informe completo
 */
function renderReport() {
    document.getElementById('loadingContainer').classList.add('hidden');
    document.getElementById('reportContainer').classList.remove('hidden');
    
    const content = document.getElementById('reportContent');
    const puntajes = reportData.puntajes;
    const perfil = reportData.perfilDominante;
    
    // Obtener perfiles dominantes
    const profiles = perfil.split('').map(letter => profileDescriptions[letter]);
    const mainProfile = profiles[0];
    
    content.innerHTML = `
        <!-- Portada -->
        <div class="report-cover">
            <img src="../img/imagen1.png" alt="Logo" class="logo">
            <h1>Informe de Evaluación DISC</h1>
            <p class="subtitle">Análisis de Perfil de Personalidad</p>
            <div class="user-name">${reportData.nombre} ${reportData.apellido}</div>
            <div class="date">Fecha: ${Helpers.formatDate(reportData.fecha)}</div>
        </div>

        <!-- Resumen Ejecutivo -->
        <div class="report-section">
            <h2>Resumen Ejecutivo</h2>
            <p>
                Este informe presenta los resultados de la evaluación DISC realizada el ${Helpers.formatDate(reportData.fecha)}. 
                La metodología DISC analiza cuatro dimensiones principales del comportamiento: Dominancia, Influencia, 
                Estabilidad y Cumplimiento.
            </p>
            <div class="dominant-profile">
                <h3>Tu Perfil Dominante</h3>
                <div class="profile-letters">${perfil}</div>
                <p style="margin-top: 15px; font-size: 1.1rem;">
                    ${profiles.map(p => p.name).join(' + ')}
                </p>
            </div>
        </div>

        <!-- Puntajes -->
        <div class="report-section">
            <h2>Tus Puntajes DISC</h2>
            <p>Los siguientes son tus puntajes en cada una de las cuatro dimensiones del modelo DISC:</p>
            <div class="scores-grid">
                <div class="score-card dominance">
                    <span class="score-label">D</span>
                    <span class="score-name">Dominancia</span>
                    <span class="score-value">${puntajes.D}</span>
                </div>
                <div class="score-card influence">
                    <span class="score-label">I</span>
                    <span class="score-name">Influencia</span>
                    <span class="score-value">${puntajes.I}</span>
                </div>
                <div class="score-card steadiness">
                    <span class="score-label">S</span>
                    <span class="score-name">Estabilidad</span>
                    <span class="score-value">${puntajes.S}</span>
                </div>
                <div class="score-card compliance">
                    <span class="score-label">C</span>
                    <span class="score-name">Cumplimiento</span>
                    <span class="score-value">${puntajes.C}</span>
                </div>
            </div>
        </div>

        <!-- Descripción del Perfil Principal -->
        <div class="report-section">
            <h2>Descripción de tu Perfil: ${mainProfile.name}</h2>
            <p><strong>${mainProfile.description}</strong></p>
            
            <h3>Características Principales</h3>
            <ul class="characteristics-list">
                ${mainProfile.characteristics.map(char => `<li>${char}</li>`).join('')}
            </ul>

            <h3>Fortalezas</h3>
            <ul class="characteristics-list">
                ${mainProfile.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>

            <h3>Áreas de Desarrollo</h3>
            <ul class="characteristics-list">
                ${mainProfile.growth.map(area => `<li>${area}</li>`).join('')}
            </ul>
        </div>

        <!-- Recomendaciones -->
        <div class="report-section">
            <h2>Recomendaciones Profesionales</h2>
            <div class="recommendations-grid">
                <div class="recommendation-card">
                    <h4>💼 En el Trabajo</h4>
                    <p>Aprovecha tus fortalezas naturales mientras trabajas conscientemente en tus áreas de desarrollo.</p>
                </div>
                <div class="recommendation-card">
                    <h4>👥 En Equipo</h4>
                    <p>Reconoce que otros tienen estilos diferentes y complementarios al tuyo. La diversidad fortalece al equipo.</p>
                </div>
                <div class="recommendation-card">
                    <h4>🎯 Comunicación</h4>
                    <p>Adapta tu estilo de comunicación según el perfil de tu interlocutor para mayor efectividad.</p>
                </div>
                <div class="recommendation-card">
                    <h4>📈 Desarrollo</h4>
                    <p>Continúa desarrollando las áreas de oportunidad identificadas mediante práctica consciente.</p>
                </div>
            </div>
        </div>

        <!-- Conclusión -->
        <div class="report-section">
            <h2>Conclusión</h2>
            <p>
                El perfil DISC no es una etiqueta permanente, sino una herramienta de autoconocimiento. 
                Tu comportamiento puede adaptarse según el contexto, y siempre tienes la capacidad de 
                desarrollar nuevas habilidades y competencias.
            </p>
            <p>
                Utiliza este informe como guía para comprender mejor tus tendencias naturales, mejorar 
                tu efectividad personal y profesional, y construir mejores relaciones con quienes te rodean.
            </p>
        </div>

        <!-- Pie de página -->
        <div class="report-section" style="text-align: center; background: #f8f9fa;">
            <p style="color: #999; font-size: 0.9rem;">
                Este informe fue generado por el Sistema de Evaluación DISC<br>
                © 2026 DISC Assessment System. Todos los derechos reservados.
            </p>
        </div>
    `;
}

/**
 * Mostrar error
 */
function showError(message) {
    document.getElementById('loadingContainer').innerHTML = `
        <div style="text-align: center;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h2 style="color: #F44336; margin: 20px 0;">Error</h2>
            <p style="color: #666;">${message}</p>
            <button class="btn btn-primary" onclick="goBack()" style="margin-top: 20px;">Volver</button>
        </div>
    `;
}

/**
 * Descargar PDF
 */
function downloadPDF() {
    alert('Para descargar el PDF:\n\n1. Haz clic en "Imprimir"\n2. Selecciona "Guardar como PDF"\n3. Guarda el archivo en tu computadora');
    window.print();
}

/**
 * Volver atrás
 */
function goBack() {
    window.history.back();
}
