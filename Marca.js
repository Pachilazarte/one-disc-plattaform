/**
 * ⚙️ CONFIGURACIÓN CENTRAL DEL SISTEMA DISC
 * Este archivo debe cargarse primero en todos los HTML
 * Centraliza URLs de Google Apps Script, branding y configuración global
 */

const CONFIG = {
    // 🎨 Identidad de Marca: ONE
    brand: {
        name: "ONE — Evaluación DISC",
        logo: "./img/one-iconocolor.png", // Icono circular principal
        logoSecondary: "./img/one-logoletra.png", // Logo con texto para footer/header
        logoConsultora: "./img/escencial-logoblanco.png", // Marca del desarrollador
        
        // Colores extraídos de tu CSS (:root)
        colors: {
            primary: "#6be1e3",   // --c-cyan (Color de acento principal)
            secondary: "#e17bd7", // --c-pink (Color de acento secundario)
            accent: "#e4c76a",    // --c-gold
            background: "#000000", // --c-black
            surface: "#1a181d",    // --c-ink
            text: "#fefeff",       // --c-white
            muted: "#a4a8c0"       // --c-slate
        },
        
        // Tipografías
        fonts: {
            title: "'Exo 2', sans-serif",
            body: "var(--font-sub)"
        }
    },
    
    // Configuración de la Evaluación
    assessment: {
        title: "Evaluación DISC con criterio profesional",
        subtitle: "Plataforma de evaluación psicolaboral",
        copyright: "© 2026 Todos los derechos reservados"
    },

    // 🔗 APIs de Google Apps Script
    api: {
        // WebApp para gestión de SuperAdmin para Admins
        gestion: "https://script.google.com/macros/s/AKfycbyY5VMFUd-aKzYjh40qYDCf1bRYJ-mz__WziNRmxZZrP7hpiKYtT6jrx0WByy-1nbomRg/exec",
        
        // WebApp para gestión de Admins para Usuarios
        gestionAdmin: "https://script.google.com/macros/s/AKfycbwuEuHrCuckE0qewaW2txw45WmDxLS2R61WovJd3F2k_ZIBsUSjX_Q8HZsV0eY8EXPG/exec",
        
        // WebApp para lectura de resultados
        informes: "https://script.google.com/macros/s/AKfycby2psvvq0o7jm1EmkFKAsXpcxRdVdBMThvjRAmvTDdmUClEHsA2PIMMR2_7hhlaTRNO/exec",
        
    },

    // 📊 Configuración de Google Sheets
    sheets: {
        hojaAdmins: "Admins",
        hojaUsuarios: "Usuarios",
        hojaRespuestas: "Respuestas"
    },

    // 🔐 Configuración de Roles
    roles: {
        SUPERADMIN: "superadmin",
        ADMIN: "admin",
        USER: "user"
    },

    // 🎯 Rutas de Navegación
    routes: {
        login: "/index.html",
        inicio: "/inicio/index.html",
        superAdminDashboard: "/SuperAdminDashboard/index.html",
        adminDashboard: "/AdminDashboard/index.html",
        userboard: "/Userboard/index.html",
        test: "/Test/index.html",
        informe: "/Informe/index.html"
    },

    // ⚙️ Configuración del Sistema
    system: {
        sessionTimeout: 3600000, // 1 hora en milisegundos
        defaultLanguage: "es",
        dateFormat: "DD/MM/YYYY"
    }
};

// Hacer CONFIG disponible globalmente
window.CONFIG = CONFIG;