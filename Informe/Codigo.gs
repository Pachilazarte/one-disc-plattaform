/**
 * 📊 GOOGLE APPS SCRIPT - BACKEND DEL SISTEMA DISC
 * Este archivo debe ser copiado a Google Apps Script
 * 
 * CONFIGURACIÓN:
 * 1. Abre Google Sheets con tu planilla de datos
 * 2. Ve a Extensiones > Apps Script
 * 3. Copia este código
 * 4. Publica como Web App (Implementar > Nueva implementación)
 * 5. Copia la URL y pégala en /Marca.js en la sección de APIs
 */

// ============================================
// CONFIGURACIÓN DE HOJAS
// ============================================
const SHEET_NAMES = {
  ADMINS: 'Admins',
  USUARIOS: 'Usuarios',
  RESPUESTAS: 'Respuestas'
};

// ============================================
// FUNCIÓN PRINCIPAL - doPost (Recibe datos)
// ============================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const accion = data.accion;
    
    switch(accion) {
      case 'login':
        return handleLogin(data);
      case 'createAdmin':
        return handleCreateAdmin(data);
      case 'createUser':
        return handleCreateUser(data);
      case 'toggleAdminStatus':
        return handleToggleAdminStatus(data);
      case 'toggleUserStatus':
        return handleToggleUserStatus(data);
      case 'resetAdminPassword':
        return handleResetPassword(data);
      case 'saveTest':
        return handleSaveTest(data);
      default:
        return createResponse(false, 'Acción no válida');
    }
  } catch (error) {
    return createResponse(false, 'Error: ' + error.message);
  }
}

// ============================================
// FUNCIÓN PRINCIPAL - doGet (Lee datos)
// ============================================
function doGet(e) {
  try {
    const accion = e.parameter.accion;
    
    switch(accion) {
      case 'getAdmins':
        return handleGetAdmins();
      case 'getUsers':
        return handleGetUsers(e.parameter.adminEmail);
      case 'getUserResult':
        return handleGetUserResult(e.parameter.email);
      case 'getResults':
        return handleGetResults(e.parameter.adminEmail);
      default:
        return createResponse(false, 'Acción no válida');
    }
  } catch (error) {
    return createResponse(false, 'Error: ' + error.message);
  }
}

// ============================================
// HANDLERS - LOGIN
// ============================================
function handleLogin(data) {
  const rol = data.rol;
  const usuario = data.usuario;
  const password = data.password;
  
  let sheet;
  if (rol === 'superadmin') {
    // SuperAdmin hardcodeado (cambiar por tu usuario)
    if (usuario === 'superadmin' && password === 'admin123') {
      return createResponse(true, 'Login exitoso', {
        rol: 'superadmin',
        usuario: 'superadmin',
        email: 'superadmin@sistema.com'
      });
    }
    return createResponse(false, 'Credenciales de SuperAdmin inválidas');
  } else if (rol === 'admin') {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ADMINS);
  } else if (rol === 'user') {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USUARIOS);
  } else {
    return createResponse(false, 'Rol no válido');
  }
  
  const data_range = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data_range.length; i++) {
    const row = data_range[i];
    if (row[1] === usuario && row[2] === password) {
      // Usuario encontrado
      const userData = {
        rol: rol,
        usuario: row[1],
        email: row[3]
      };
      
      // Si es usuario, incluir datos del admin
      if (rol === 'user' && row[0]) {
        userData.adminEmail = row[0];
        userData.adminUsuario = row[1];
      }
      
      return createResponse(true, 'Login exitoso', userData);
    }
  }
  
  return createResponse(false, 'Credenciales inválidas');
}

// ============================================
// HANDLERS - ADMINISTRADORES
// ============================================
function handleCreateAdmin(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ADMINS);
  
  // Verificar si el usuario ya existe
  const existingData = sheet.getDataRange().getValues();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][1] === data.usuario || existingData[i][3] === data.email) {
      return createResponse(false, 'El usuario o email ya existe');
    }
  }
  
  // Agregar nuevo admin: [Email_SuperAdmin, Usuario_Admin, Pass_Admin, Email_Admin, Fecha_Alta]
  sheet.appendRow([
    'superadmin@sistema.com',
    data.usuario,
    data.password,
    data.email,
    new Date()
  ]);
  
  return createResponse(true, 'Administrador creado exitosamente');
}

function handleGetAdmins() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ADMINS);
  const data = sheet.getDataRange().getValues();
  
  const admins = [];
  for (let i = 1; i < data.length; i++) {
    admins.push({
      usuario: data[i][1],
      email: data[i][3],
      fechaAlta: data[i][4],
      estado: 'activo' // Por defecto
    });
  }
  
  return createResponse(true, 'Datos obtenidos', admins);
}

function handleToggleAdminStatus(data) {
  // Implementar lógica de activar/desactivar admin
  // Puedes agregar una columna "Estado" en la hoja
  return createResponse(true, 'Estado actualizado');
}

function handleResetPassword(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.ADMINS);
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][1] === data.usuario) {
      sheet.getRange(i + 1, 3).setValue(data.nuevaPassword);
      return createResponse(true, 'Contraseña actualizada');
    }
  }
  
  return createResponse(false, 'Usuario no encontrado');
}

// ============================================
// HANDLERS - USUARIOS
// ============================================
function handleCreateUser(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USUARIOS);
  
  // Verificar si el usuario ya existe
  const existingData = sheet.getDataRange().getValues();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][1] === data.usuario || existingData[i][3] === data.email) {
      return createResponse(false, 'El usuario o email ya existe');
    }
  }
  
  // Agregar nuevo usuario: [Email_Admin, Usuario_User, Pass_User, Email_User, Nombre, Fecha_Alta, Estado]
  sheet.appendRow([
    data.adminEmail,
    data.usuario,
    data.password,
    data.email,
    data.nombre,
    new Date(),
    'activo'
  ]);
  
  return createResponse(true, 'Usuario creado exitosamente');
}

function handleGetUsers(adminEmail) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USUARIOS);
  const data = sheet.getDataRange().getValues();
  
  const users = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === adminEmail) {
      users.push({
        adminEmail: data[i][0],
        usuario: data[i][1],
        email: data[i][3],
        nombre: data[i][4],
        fechaAlta: data[i][5],
        estado: data[i][6] || 'activo'
      });
    }
  }
  
  return createResponse(true, 'Datos obtenidos', users);
}

function handleToggleUserStatus(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.USUARIOS);
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][1] === data.usuario) {
      sheet.getRange(i + 1, 7).setValue(data.nuevoEstado);
      return createResponse(true, 'Estado actualizado');
    }
  }
  
  return createResponse(false, 'Usuario no encontrado');
}

// ============================================
// HANDLERS - TEST Y RESULTADOS
// ============================================
function handleSaveTest(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.RESPUESTAS);
  
  // Agregar resultado: [Admin_Email, Admin_Usuario, Fecha, Nombre, Apellido, Email_User, Respuestas, Puntajes, Perfil]
  sheet.appendRow([
    data.adminEmail || '',
    data.adminUsuario || '',
    new Date(),
    data.nombre,
    data.apellido,
    data.email,
    data.respuestas,
    data.puntajes,
    data.perfilDominante
  ]);
  
  return createResponse(true, 'Test guardado exitosamente');
}

function handleGetUserResult(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.RESPUESTAS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] === email) {
      const puntajesStr = data[i][7];
      const puntajes = JSON.parse(puntajesStr);
      
      return createResponse(true, 'Resultado encontrado', {
        fecha: data[i][2],
        nombre: data[i][3],
        apellido: data[i][4],
        email: data[i][5],
        respuestas: data[i][6],
        puntajes: puntajes,
        perfilDominante: data[i][8]
      });
    }
  }
  
  return createResponse(false, 'No se encontró resultado');
}

function handleGetResults(adminEmail) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.RESPUESTAS);
  const data = sheet.getDataRange().getValues();
  
  const results = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === adminEmail) {
      results.push({
        fecha: data[i][2],
        nombre: data[i][3],
        apellido: data[i][4],
        email: data[i][5],
        perfilDominante: data[i][8]
      });
    }
  }
  
  return createResponse(true, 'Resultados obtenidos', results);
}

// ============================================
// FUNCIÓN AUXILIAR - Crear respuesta JSON
// ============================================
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. Estructura de la Hoja "Admins":
 *    - Columna A: Email_SuperAdmin
 *    - Columna B: Usuario_Admin
 *    - Columna C: Pass_Admin
 *    - Columna D: Email_Admin
 *    - Columna E: Fecha_Alta
 * 
 * 2. Estructura de la Hoja "Usuarios":
 *    - Columna A: Email_Admin
 *    - Columna B: Usuario_User
 *    - Columna C: Pass_User
 *    - Columna D: Email_User
 *    - Columna E: Nombre
 *    - Columna F: Fecha_Alta
 *    - Columna G: Estado
 * 
 * 3. Estructura de la Hoja "Respuestas":
 *    - Columna A: Admin_Email
 *    - Columna B: Admin_Usuario
 *    - Columna C: Fecha
 *    - Columna D: Nombre
 *    - Columna E: Apellido
 *    - Columna F: Email_User
 *    - Columna G: Respuestas (JSON)
 *    - Columna H: Puntajes (JSON)
 *    - Columna I: Perfil_Dominante
 */
