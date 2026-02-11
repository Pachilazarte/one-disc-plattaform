/**
 * 👤 LÓGICA DEL PANEL DE USUARIO
 * Permite al usuario realizar el test DISC o ver su informe
 */

// Proteger la página - Solo User
Auth.protectPage(CONFIG.roles.USER);

// Variables globales
let userResult = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    checkTestStatus();
});

/**
 * Cargar información del usuario
 */
function loadUserInfo() {
    const session = Auth.getSession();
    if (session) {
        document.getElementById('userInfo').textContent = `${session.userName} (${session.userEmail})`;
    }
}

/**
 * Verificar si el usuario ya realizó el test
 */
async function checkTestStatus() {
    Helpers.showLoading(true);
    const session = Auth.getSession();
    
    try {
        const response = await Helpers.fetchGET(CONFIG.api.informes, {
            accion: 'getUserResult',
            email: session.userEmail
        });

        if (response.success && response.data) {
            // Usuario YA realizó el test
            userResult = response.data;
            showCompletedStatus();
        } else {
            // Usuario NO ha realizado el test
            showPendingStatus();
        }
    } catch (error) {
        console.error('Error al verificar estado del test:', error);
        
        // Por defecto, mostrar pendiente si hay error
        showPendingStatus();
    } finally {
        Helpers.showLoading(false);
    }
}

/**
 * Mostrar estado: Test Pendiente
 */
function showPendingStatus() {
    const container = document.getElementById('testStatusContainer');
    
    container.innerHTML = `
        <div class="test-status-card pending">
            <div class="status-icon pending">
                <svg viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>
            <h2>Test Pendiente</h2>
            <p>Aún no has realizado tu evaluación DISC. Haz clic en el botón de abajo para comenzar tu test ahora.</p>
            <p style="font-size: 0.95rem; color: #999;">
                ⏱️ El test toma aproximadamente 10-15 minutos
            </p>
            <button class="btn btn-primary" onclick="startTest()">
                Comenzar Test DISC
            </button>
        </div>
    `;
}

/**
 * Mostrar estado: Test Completado
 */
function showCompletedStatus() {
    const container = document.getElementById('testStatusContainer');
    
    container.innerHTML = `
        <div class="test-status-card completed">
            <div class="status-icon completed">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>
            <h2>¡Test Completado!</h2>
            <p>Ya has realizado tu evaluación DISC. Puedes visualizar tu informe completo haciendo clic en el botón de abajo.</p>
            
            ${userResult ? `
                <div class="report-preview">
                    <h4>Información del Informe:</h4>
                    <div class="report-info">
                        <div class="report-info-item">
                            <label>Fecha de realización:</label>
                            <strong>${Helpers.formatDate(userResult.fecha)}</strong>
                        </div>
                        <div class="report-info-item">
                            <label>Perfil Dominante:</label>
                            <strong>${userResult.perfilDominante || 'N/A'}</strong>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <button class="btn btn-success" onclick="viewReport()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Ver Mi Informe Completo
            </button>
        </div>
    `;
}

/**
 * Iniciar el test DISC
 */
function startTest() {
    // Guardar en sessionStorage que viene del userboard
    sessionStorage.setItem('fromUserboard', 'true');
    
    // Redirigir al test
    window.location.href = CONFIG.routes.test;
}

/**
 * Ver el informe
 */
function viewReport() {
    const session = Auth.getSession();
    
    // Abrir el informe en la misma ventana o nueva pestaña
    window.open(
        `${CONFIG.routes.informe}?email=${encodeURIComponent(session.userEmail)}`,
        '_blank'
    );
}
