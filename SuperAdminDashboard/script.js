/**
 * 👑 LÓGICA DEL DASHBOARD DE SUPER ADMINISTRADOR (VERSIÓN COMPLETA CORREGIDA)
 */

let adminsData = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadAdmins();
    setupEventListeners();
});

function loadUserInfo() {
    const session = Auth.getSession();
    if (session) {
        document.getElementById('userInfo').textContent = `${session.userName} (${session.userEmail})`;
    }
}

function setupEventListeners() {
    const form = document.getElementById('newAdminForm');
    if (form) {
        form.addEventListener('submit', handleCreateAdmin);
    }
}

/**
 * LECTURA: Cargar lista (GET simple)
 */
async function loadAdmins() {
    Helpers.showLoading(true);
    try {
        const response = await fetch(CONFIG.api.gestion);
        if (!response.ok) throw new Error('Error en red');
        adminsData = await response.json();
        renderAdminsTable();
        updateStats();
    } catch (error) {
        console.error('Error al cargar:', error);
        Helpers.showAlert('Error al conectar con Google Sheets', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}

/**
 * ESCRITURA: Crear nuevo administrador (Túnel Iframe)
 */
async function handleCreateAdmin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('adminUsuario').value.trim();
    const password = document.getElementById('adminPassword').value;
    const email = document.getElementById('adminEmail').value.trim();
    
    if (!usuario || !password || !email) {
        Helpers.showAlert('Completa todos los campos', 'error');
        return;
    }

    Helpers.showLoading(true);
    
    try {
        const datos = {
            fila: [
                "superadmin@sistema.com", // Email_SuperAdmin
                usuario,                  // Usuario_Admin
                password,                 // Pass_Admin
                email,                    // Email_Admin
                new Date().toISOString()  // Fecha_Alta
            ],
            nombreHoja: "Admins"
        };

        enviarViaTunel(datos, 'Administrador enviado correctamente');
        e.target.reset();

    } catch (error) {
        console.error('Error en envío:', error);
        Helpers.showAlert('Error al procesar el envío', 'error');
        Helpers.showLoading(false);
    }
}

/**
 * ELIMINAR/BORRAR: Función para dar de baja
 */
async function deleteAdmin(usuario) {
    if (!confirm(`¿Estás seguro de eliminar a ${usuario}?`)) return;
    
    Helpers.showLoading(true);
    const datos = {
        accion: "borrar",
        usuario: usuario,
        nombreHoja: "Admins"
    };
    
    enviarViaTunel(datos, 'Solicitud de eliminación enviada');
}

/**
 * ALTERNAR ESTADO: Activar/Desactivar
 */
async function toggleAdminStatus(usuario, estadoActual) {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    if (!confirm(`¿Deseas cambiar el estado de ${usuario} a ${nuevoEstado}?`)) return;

    Helpers.showLoading(true);
    const datos = {
        accion: "toggleStatus",
        usuario: usuario,
        nuevoEstado: nuevoEstado,
        nombreHoja: "Admins"
    };
    
    enviarViaTunel(datos, 'Actualizando estado...');
}

/**
 * RESET PASSWORD
 */
async function resetAdminPassword(usuario) {
    const nuevaPass = prompt(`Ingresa la nueva contraseña para ${usuario}:`);
    if (!nuevaPass) return;

    Helpers.showLoading(true);
    const datos = {
        accion: "resetPass",
        usuario: usuario,
        nuevaPass: nuevaPass,
        nombreHoja: "Admins"
    };
    
    enviarViaTunel(datos, 'Contraseña actualizada correctamente');
}

/**
 * MOTOR DE ENVÍO (TÚNEL IFRAME)
 */
function enviarViaTunel(obj, mensajeExito) {
    const form = document.getElementById('hidden-form');
    const hiddenInput = document.getElementById('hidden-data');
    
    if (!form || !hiddenInput) {
        alert("Error: No se encontró el túnel de envío en el HTML");
        return;
    }

    hiddenInput.value = JSON.stringify(obj);
    form.action = CONFIG.api.gestion;
    form.submit();

    setTimeout(() => {
        Helpers.showAlert(mensajeExito, 'success');
        loadAdmins();
    }, 2000);
}

/**
 * RENDER: Tabla con todas las acciones originales
 */
function renderAdminsTable() {
    const tbody = document.getElementById('adminsTableBody');
    if (!tbody) return;

    if (!adminsData || adminsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Sin datos</td></tr>';
        return;
    }

    tbody.innerHTML = adminsData.map(admin => {
        const usuario = admin.Usuario_Admin || admin.usuario || '-';
        const estado = admin.Estado || 'activo';
        
        return `
        <tr>
            <td><strong>${Helpers.sanitizeHTML(usuario)}</strong></td>
            <td>${Helpers.sanitizeHTML(admin.Email_Admin || admin.email || '-')}</td>
            <td>${Helpers.formatDate(admin.Fecha_Alta || admin.fechaAlta || new Date())}</td>
            <td>
                <span class="status-badge ${estado === 'activo' ? 'status-active' : 'status-inactive'}">
                    ${estado.charAt(0).toUpperCase() + estado.slice(1)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    </button>
                    <button class="btn btn-small btn-outline" onclick="resetAdminPassword('${usuario}')">Reset Pass</button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function updateStats() {
    const totalElem = document.getElementById('totalAdmins');
    const activeElem = document.getElementById('activeAdmins');
    
    if (totalElem) totalElem.textContent = adminsData.length;
    if (activeElem) {
        const activos = adminsData.filter(a => (a.Estado || a.estado) === 'activo').length;
        activeElem.textContent = activos || adminsData.length;
    }
}