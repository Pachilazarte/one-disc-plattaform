/**
 * ⚙️ CONFIGURACIÓN CENTRAL DEL SISTEMA — ONE DISC
 * Este archivo debe cargarse primero en todos los HTML.
 *
 * Las APIs de cada admin son dinámicas (multi-tenant).
 * Usá siempre los getters:
 *   CONFIG.api.getUsuarios()      → API de la hoja Usuarios del admin
 *   CONFIG.api.getRespuestas()    → API de la hoja Respuestas del admin
 *   CONFIG.api.getVisualizacion() → API del paneldata del admin
 */

const CONFIG = {
    // 🎨 Identidad de Marca: ONE
    brand: {
        name: 'ONE — Evaluación DISC',
        logo: './img/one-iconocolor.png',
        logoSecondary: './img/one-logoletra.png',
        logoConsultora: './img/escencial-logoblanco.png',
        colors: {
            primary:    '#6be1e3',
            secondary:  '#e17bd7',
            accent:     '#e4c76a',
            background: '#000000',
            surface:    '#1a181d',
            text:       '#fefeff',
            muted:      '#a4a8c0'
        },
        fonts: {
            title: "'Exo 2', sans-serif",
            body:  'var(--font-sub)'
        }
    },

    assessment: {
        title:     'Evaluación DISC con criterio profesional',
        subtitle:  'Plataforma de evaluación psicolaboral',
        copyright: '© 2026 Todos los derechos reservados'
    },

    // 🔗 APIs de Google Apps Script
    api: {
        // ── SuperAdmin GAS (FIJO, nunca cambia) ──────────────────
        gestion: 'https://script.google.com/macros/s/AKfycbzGtWNEWr4s27dKfLu_xwyPN-iaAcTYEq8oSNm2uUS4oBiwQXy4lDj4Tf741l-48WB0/exec',

        // ── Fallbacks hardcodeados (desarrollo / primer admin) ───
        gestionAdmin: 'https://script.google.com/macros/s/AKfycbyEjSYIvFx5RBrqMrnKpdjXbsxwNv1h5FyxDe3Cikqf8oM07iw2-q7NrP4BcaJ12Ff0/exec',
        informes:     'https://script.google.com/macros/s/AKfycby2psvvq0o7jm1EmkFKAsXpcxRdVdBMThvjRAmvTDdmUClEHsA2PIMMR2_7hhlaTRNO/exec'
    },

    sheets: {
        hojaAdmins:     'Admins',
        hojaUsuarios:   'Usuarios',
        hojaRespuestas: 'Respuestas'
    },

    roles: {
        SUPERADMIN: 'superadmin',
        ADMIN:      'admin',
        USER:       'user'
    },

    routes: {
        login:               '/index.html',
        superAdminDashboard: '/SuperAdminDashboard/index.html',
        adminDashboard:      '/AdminDashboard/index.html',
        userboard:           '/Userboard/index.html',
        test:                '/Test/index.html',
        informe:             '/Informe/index.html'
    },

    system: {
        sessionTimeout:  3600000,
        defaultLanguage: 'es',
        dateFormat:      'DD/MM/YYYY'
    }
};

// ── APIs dinámicas por sesión ──────────────────────────────────
// Siempre usá estos getters en lugar de CONFIG.api.gestionAdmin
// o CONFIG.api.informes directamente.

CONFIG.api.getUsuarios = function () {
    var api = sessionStorage.getItem('apiUsuarios');
    return (api && api.length > 10) ? api : CONFIG.api.gestionAdmin;
};

CONFIG.api.getRespuestas = function () {
    var api = sessionStorage.getItem('apiRespuestas');
    return (api && api.length > 10) ? api : CONFIG.api.informes;
};

CONFIG.api.getVisualizacion = function () {
    var api = sessionStorage.getItem('apiVisualizacion');
    return (api && api.length > 10) ? api : CONFIG.api.informes;
};

window.CONFIG = CONFIG;