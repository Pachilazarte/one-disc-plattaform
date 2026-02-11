/**
 * 📊 LÓGICA DEL DASHBOARD DE ADMINISTRADOR
 * Gestión de usuarios y habilitación para el test DISC
 */

// Proteger la página - Solo Admin
Auth.protectPage(CONFIG.roles.ADMIN);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadUsers();
    setupEventListeners();
});

/**
 * Cargar información del admin logueado
 */
function loadUserInfo() {
    const session = Auth.getSession();
    if (session) {
        document.getElementById('userInfo').textContent = `${session.userName} (${session.userEmail})`;
    }
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    document.getElementById('newUserForm').addEventListener('submit', handleCreateUser);
}

/**
 * Cargar lista de usuarios del admin actual
 */
async function loadUsers() {
    Helpers.showLoading(true);
    const session = Auth.getSession();

    try {
        const response = await Helpers.fetchGET(CONFIG.api.gestionAdmin);

        if (Array.isArray(response)) {

            // Filtrar solo los registros creados por este admin
usersData = response
    .filter(row =>
        String(row.Usuario_Admin).trim() === String(session.userName).trim() &&
        String(row.Pass_Admin).trim() === String(session.userPassword).trim() &&
        row.User &&
        String(row.User).trim() !== ""
    )
    .map(row => ({
        usuario: String(row.User),
        password: String(row.Pass_User),
        email: String(row.Email_User)
    }));


            renderUsersTable();
            updateStats();

        } else {
            Helpers.showAlert('Error al cargar usuarios', 'error');
        }

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        Helpers.showAlert('Error de conexión al cargar usuarios', 'error');
    } finally {
        Helpers.showLoading(false);
    }
}



function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (usersData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; color:#999;">
                    No has creado usuarios aún.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usersData.map(user => `
        <tr>
            <td>${Helpers.sanitizeHTML(user.usuario)}</td>
            <td>${Helpers.sanitizeHTML(user.password)}</td>
            <td>${Helpers.sanitizeHTML(user.email)}</td>
        </tr>
    `).join('');
}




/**
 * Actualizar estadísticas
 * Panel solo usuarios (sin resultados / informes)
 */
function updateStats() {
    const total = usersData.length;

    // Total usuarios
    const totalEl = document.getElementById('totalUsers');
    if (totalEl) totalEl.textContent = String(total);

    // Si existen estos elementos en el HTML (por diseño anterior),
    // los dejamos en 0 y "pendientes = total" para no romper UI.
    const completedEl = document.getElementById('completedTests');
    if (completedEl) completedEl.textContent = '0';

    const pendingEl = document.getElementById('pendingUsers');
    if (pendingEl) pendingEl.textContent = String(total);
}


/**
 * Manejar creación de nuevo usuario
 */
async function handleCreateUser(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('userUsuario').value.trim();
    const password = document.getElementById('userPassword').value;
    const email = document.getElementById('userEmail').value.trim();
    const nombre = document.getElementById('userNombre').value.trim();
    const session = Auth.getSession();
    
    // Validaciones
    if (!usuario || !password || !email || !nombre) {
        Helpers.showAlert('Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (!Helpers.validateEmail(email)) {
        Helpers.showAlert('Email inválido', 'error');
        return;
    }
    
    if (password.length < 6) {
        Helpers.showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    if (!session || !session.userName || !session.userEmail || !session.userPassword) {
        Helpers.showAlert('Error de sesión. Vuelve a iniciar sesión.', 'error');
        return;
    }
    
    Helpers.showLoading(true);
    
    try {

        // 🔥 FORMATO QUE EXIGE GOOGLE APPS SCRIPT
        const payload = {
            fila: [
                session.userName,
                session.userPassword,
                session.userEmail,
                usuario,
                password,
                email
            ]
        };

        // 🔥 ENVÍO SIN CORS (FORM ENCODED)
        const formData = new URLSearchParams();
        formData.append("data", JSON.stringify(payload));

        const response = await fetch(CONFIG.api.gestionAdmin, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result && result.status === "success") {

            Helpers.showAlert('Usuario creado exitosamente', 'success');

            document.getElementById('newUserForm').reset();

            showCredentialsModal(usuario, password, email);

            setTimeout(() => {
                loadUsers();
            }, 1500);

        } else {

            const mensaje = result && result.message
                ? result.message
                : 'Respuesta inválida del servidor';

            Helpers.showAlert('Error al crear usuario: ' + mensaje, 'error');
        }

    } catch (error) {

        console.error('Error al crear usuario:', error);
        Helpers.showAlert('Error de conexión al crear usuario', 'error');

    } finally {

        Helpers.showLoading(false);

    }
}




/**
 * Mostrar modal de credenciales
 */
function showCredentialsModal(usuario, password, email) {
    const modal = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); 
                    display: flex; align-items: center; justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%;">
                <h3 style="color: #2A4B7C; margin-bottom: 20px;">✅ Usuario Creado</h3>
                <div class="credentials-box">
                    <h4>Credenciales de Acceso:</h4>
                    <div class="credential-item">
                        <span class="credential-label">Usuario:</span>
                        <span class="credential-value">${usuario}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Contraseña:</span>
                        <span class="credential-value">${password}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Email:</span>
                        <span class="credential-value">${email}</span>
                    </div>
                </div>
                <p style="color: #666; font-size: 0.9rem; margin-top: 15px;">
                    ⚠️ Guarda estas credenciales. El usuario las necesitará para acceder al sistema.
                </p>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()" style="width: 100%; margin-top: 20px;">
                    Entendido
                </button>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modal;
    document.body.appendChild(modalDiv);
}

/**
 * Mostrar credenciales de usuario existente
 */
function showCredentials(usuario, email) {
    alert(`Credenciales de ${usuario}:\n\nUsuario: ${usuario}\nEmail: ${email}\n\nNota: La contraseña no se puede recuperar. Si el usuario la olvidó, deberás resetearla.`);
}

/**
 * Alternar estado de usuario
 * ⚠️ Actualmente no soportado por el backend (Google Apps Script solo permite appendRow)
 */
async function toggleUserStatus(usuario, estadoActual) {

    Helpers.showAlert(
        'La función de activar/desactivar usuario no está disponible actualmente.',
        'error'
    );

    return;
}


/**
 * Ver informe de usuario
 */
function viewUserReport(email) {
    // Abrir el informe en una nueva ventana
    window.open(`${CONFIG.routes.informe}?email=${encodeURIComponent(email)}`, '_blank');
}
