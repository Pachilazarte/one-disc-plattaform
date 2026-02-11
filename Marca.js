/**
 * ⚙️ CONFIGURACIÓN CENTRAL DEL SISTEMA DISC
 * Este archivo debe cargarse primero en todos los HTML
 * Centraliza URLs de Google Apps Script, branding y configuración global
 */

const CONFIG = {
    // 🎨 Identidad de Marca
    brand: {
        name: "DISC Assessment System",
        logo: "./img/imagen1.svg",
        logoSecondary: "./img/imagen2.svg",
        primaryColor: "#2A4B7C",
        secondaryColor: "#FFD700",
        accentColor: "#4A90E2",
        backgroundColor: "#F5F7FA",
        textColor: "#333333"
    },

    // 🔗 APIs de Google Apps Script
    api: {
        // WebApp para gestión de SuperAdmin para Admins
        gestion: "https://script.google.com/macros/s/AKfycbz6VzLBS96b1mHhNOPMGkglX0CZLjAAcgKHRpEIBDAU_-2A8EpK_rvsc7MAar9-qH37/exec",
        
        // WebApp para gestión de Admins para Usuarios
        gestionAdmin: "https://script.google.com/macros/s/AKfycbxs0W282XGXlRA-oWUTCqtavaRBXJbzyhyVLMO-vwJawj6EbX2cUhATt7Jq4q-nCPOA/exec",
        
        // WebApp para lectura de resultados y generación de informes
        informes: "link-appscript-informes",
        
        // WebApp para guardar respuestas del test DISC
        testDISC: "link-appscript-test-disc"
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