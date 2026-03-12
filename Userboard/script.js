/**
 * 💤 LÓGICA DEL PANEL DE USUARIO
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

    try {
        const userName = sessionStorage.getItem('userName');

        if (!userName) {
            showPendingStatus();
            enableManualSection(false);
            return;
        }

        const response = await fetch(
            `${CONFIG.api.informes}?user=${encodeURIComponent(userName)}`
        );

        if (!response.ok) {
            throw new Error("Error HTTP " + response.status);
        }

        const result = await response.json();

        if (result.success && result.data) {

            const userData = result.data;

            if (userData.Respuestas && userData.Respuestas.trim() !== "") {

                // 🔥 GUARDAMOS TODO EL OBJETO COMPLETO
sessionStorage.setItem(
    "discUserData",
    JSON.stringify(userData)
);

userResult = userData;
showCompletedStatus();
enableManualSection(true, userData);
return;
            }
        }

        showPendingStatus();
        enableManualSection(false);

    } catch (error) {
        console.error("Error consultando informes:", error);
        showPendingStatus();
        enableManualSection(false);
    } finally {
        Helpers.showLoading(false);
    }
}

/**
 * Mostrar estado: Test Pendiente
 */
function showPendingStatus() {
    const container = document.getElementById('testStatusContainer');
    const session = Auth.getSession();

    // Asegurar que los botones del hero estén habilitados
    enableStartButton(true);

    container.innerHTML = `
        <div class="flex justify-center items-center min-h-[60vh] px-4">
            <div class="w-full max-w-3xl p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-950/98 border border-white/10 shadow-[0_60px_160px_rgba(0,0,0,0.9)] text-center relative overflow-hidden">
                
                <!-- Glow Effect -->
                <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-disc-cyan/10 via-transparent to-disc-pink/10 opacity-30 -z-10"></div>
                
                <!-- Warning Icon -->
                <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 flex items-center justify-center rounded-full bg-orange-500/10 text-5xl sm:text-6xl shadow-[0_0_60px_rgba(255,184,108,0.4)]">
                    ⏳
                </div>
                
                <!-- Title -->
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
                    ${session.userName}, aún no realizaste tu evaluación
                </h2>
                
                <!-- Description -->
                <p class="text-base sm:text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
                    El test DISC toma aproximadamente 
                    <strong class="text-white">10 a 15 minutos</strong> y genera un informe 
                    profesional personalizado.
                </p>
                
                <!-- Highlights -->
                <div class="inline-block px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base text-left mb-8">
                    <div class="flex items-start gap-2 mb-2">
                        <span class="text-disc-green">✓</span>
                        <span>Resultados inmediatos</span>
                    </div>
                    <div class="flex items-start gap-2 mb-2">
                        <span class="text-disc-green">✓</span>
                        <span>Perfil conductual completo</span>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="text-disc-green">✓</span>
                        <span>Informe descargable</span>
                    </div>
                </div>
                
                <!-- CTA Button -->
                <button class="px-8 py-4 rounded-full bg-gradient-to-r from-disc-cyan/20 to-disc-pink/20 border border-disc-cyan/40 hover:border-disc-cyan/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(107,225,227,0.4)] font-bold text-lg relative overflow-hidden group" 
                        onclick="startTest()">
                    <div class="absolute inset-0 bg-gradient-to-r from-disc-cyan/30 to-disc-pink/30 blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10"></div>
                    Comenzar Evaluación
                </button>
            </div>
        </div>
    `;
}

/**
 * Mostrar estado: Test Completado
 */
function showCompletedStatus() {
    const container = document.getElementById('testStatusContainer');

    // ✅ FIX 1: Deshabilitar botón "Comenzar evaluación" del header
    enableStartButton(false);

    // ✅ FIX 2: Obtener texto de informe con fallback para evitar "undefined"
    const informeTexto = userResult.Informe || userResult.informe || userResult.TipoPerfil || userResult.Perfil || 'Completado';
    const fechaTexto = userResult.Fecha || userResult.fecha || 'Sin fecha';

    container.innerHTML = `
        <div class="flex justify-center items-center min-h-[60vh] px-4">
            <div class="w-full max-w-3xl p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-950/98 border border-white/10 shadow-[0_60px_160px_rgba(0,0,0,0.9)] text-center relative overflow-hidden">
                
                <!-- Glow Effect -->
                <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-disc-green/10 via-transparent to-disc-cyan/10 opacity-30 -z-10"></div>
                
                <!-- Success Badge -->
                <div class="inline-block px-4 py-2 rounded-full bg-disc-green/10 border border-disc-green/30 text-disc-green text-sm font-semibold mb-6">
                    ✓ Evaluación completada
                </div>
                
                <!-- Title -->
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
                    Tu informe está listo
                </h2>
                
                <!-- Description -->
                <p class="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                    Has finalizado tu evaluación DISC.
                    Puedes acceder a tu informe profesional completo.
                </p>
                
                <!-- Report Summary -->
                <div class="grid sm:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div class="text-xs text-gray-500 mb-1">Fecha</div>
                        <div class="font-bold text-base">${Helpers.formatDate(fechaTexto)}</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div class="text-xs text-gray-500 mb-1">Informe</div>
                        <div class="font-bold text-base">${informeTexto}</div>
                    </div>
                </div>
                
                <!-- CTA Button -->
                <button class="px-8 py-4 rounded-full bg-gradient-to-r from-disc-green/20 to-disc-cyan/20 border border-disc-green/40 hover:border-disc-green/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(80,250,123,0.4)] font-bold text-lg relative overflow-hidden group" 
                        onclick="viewReport()">
                    <div class="absolute inset-0 bg-gradient-to-r from-disc-green/30 to-disc-cyan/30 blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10"></div>
                    Ver Informe Completo
                </button>
            </div>
        </div>
    `;
}

/**
 * ✅ Habilitar/deshabilitar botón de iniciar test (header + hero)
 */
function enableStartButton(enabled) {
    const btnStart = document.getElementById('btnStartTest');
    if (!btnStart) return;

    if (enabled) {
        btnStart.disabled = false;
        btnStart.classList.remove('opacity-40', 'cursor-not-allowed');
        btnStart.innerHTML = 'Comenzar evaluación';
        btnStart.onclick = () => { window.location.href = CONFIG.routes.test; };
    } else {
        btnStart.disabled = true;
        btnStart.classList.add('opacity-40', 'cursor-not-allowed');
        btnStart.classList.remove('hover:bg-white/10', 'hover:-translate-y-1');
        btnStart.innerHTML = '✓ Evaluación completada';
        btnStart.onclick = (e) => {
            e.preventDefault();
            alert('Ya completaste tu evaluación DISC. Puedes ver tu informe.');
        };
    }
}

/**
 * Iniciar el test DISC
 */
function startTest() {
    // ✅ FIX 1: Doble verificación — si ya tiene resultado, no dejar pasar
    if (userResult) {
        alert('Ya completaste tu evaluación DISC. Puedes ver tu informe.');
        return;
    }

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
    
    // Navegar al informe en la misma página
    window.location.href = `${CONFIG.routes.informe}?email=${encodeURIComponent(session.userEmail)}`;
}


function enableManualSection(enabled, data = null) {
    const section = document.getElementById('manualSection');
    const button = document.getElementById('btnDownloadManual');
    const status = document.getElementById('manualStatusText');

    if (!section || !button || !status) return;

    // ✅ 1. LEEMOS EL PERMISO DESDE LA SESIÓN (Session Storage)
    const session = Auth.getSession();
    const packStatus = session ? String(session.packStatus).trim() : "";
    
    // Validamos si es "1" o "01"
    const hasLiderPack = (packStatus === "1" || packStatus === "01");

    // ✅ 2. LÓGICA DE VISIBILIZACIÓN
    // Solo mostramos la sección si: completó el test (enabled) Y tiene el pack activo (hasLiderPack)
    if (enabled && hasLiderPack) {
        section.classList.remove('hidden');
        button.disabled = false;
        section.classList.remove('manual-section-disabled');

        status.classList.remove('is-error', 'is-loading');
        status.classList.add('is-ready');
        status.textContent = 'Manual habilitado. Ya podés descargarlo.';

        // Guardamos los datos del test (respuestas) para que el generador de PDF los use
        if (data) {
            sessionStorage.setItem('discUserData', JSON.stringify(data));
        }
    } else {
        // Si no cumple ambas condiciones, ocultamos la sección completamente
        section.classList.add('hidden');
        button.disabled = true;
        status.textContent = 'Recurso no disponible para su suscripción.';
    }
}


function setManualButtonState(state, message) {
    const button = document.getElementById('btnDownloadManual');
    const status = document.getElementById('manualStatusText');

    if (!button || !status) return;

    status.classList.remove('is-ready', 'is-loading', 'is-error');

    if (state === 'loading') {
        button.disabled = true;
        status.classList.add('is-loading');
        status.textContent = message || 'Generando manual personalizado...';
        return;
    }

    if (state === 'success') {
        button.disabled = false;
        status.classList.add('is-ready');
        status.textContent = message || 'Manual generado correctamente.';
        return;
    }

    if (state === 'error') {
        button.disabled = false;
        status.classList.add('is-error');
        status.textContent = message || 'No se pudo generar el manual.';
        return;
    }

    button.disabled = false;
    status.textContent = message || 'Preparado para generar el recurso del alumno.';
}

async function downloadStudyManual() {
    try {
        const rawData = sessionStorage.getItem('discUserData');

        if (!rawData) {
            setManualButtonState('error', 'No hay datos del informe para generar el manual.');
            return;
        }

        const data = JSON.parse(rawData);

        setManualButtonState('loading', 'Preparando manual personalizado...');

        if (typeof window.descargarManualPersonalizado === 'function') {
            await window.descargarManualPersonalizado(data);
            setManualButtonState('success', 'Manual descargado correctamente.');
            return;
        }

        if (typeof window.generarManualPersonalizado === 'function') {
            await window.generarManualPersonalizado(data);
            setManualButtonState('success', 'Manual descargado correctamente.');
            return;
        }

        if (window.Manual && typeof window.Manual.descargar === 'function') {
            await window.Manual.descargar(data);
            setManualButtonState('success', 'Manual descargado correctamente.');
            return;
        }

        if (window.Manual && typeof window.Manual.generar === 'function') {
            await window.Manual.generar(data);
            setManualButtonState('success', 'Manual descargado correctamente.');
            return;
        }

        throw new Error('Manual.js no expone una función compatible');
    } catch (error) {
        console.error('Error al generar el manual:', error);
        setManualButtonState('error', 'Ocurrió un error al generar el manual.');
    }
}