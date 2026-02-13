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
                return;
            }
        }

        showPendingStatus();

    } catch (error) {
        console.error("Error consultando informes:", error);
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
    const session = Auth.getSession();

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
                        <div class="font-bold text-base">${Helpers.formatDate(userResult.Fecha)}</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div class="text-xs text-gray-500 mb-1">Informe</div>
                        <div class="font-bold text-base">${userResult.Informe}</div>
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
    
    // Navegar al informe en la misma página
    window.location.href = `${CONFIG.routes.informe}?email=${encodeURIComponent(session.userEmail)}`;
}