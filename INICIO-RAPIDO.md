# ⚡ INICIO RÁPIDO

## 🚀 Empezar en 5 Minutos

### 1️⃣ Ver el Sistema
Abre en tu navegador:
```
/sitemap.html
```

### 2️⃣ Probar el Frontend
**Acceso sin configurar backend:**
```
/inicio/index.html
```
Credenciales SuperAdmin por defecto:
- Usuario: `superadmin`
- Password: `admin123`

⚠️ **Nota:** Sin configurar Google Sheets, verás datos de ejemplo pero no se guardarán cambios reales.

---

## 🔧 Configuración Completa

### Paso 1: Configurar Google Sheets
1. Crea una nueva planilla en Google Sheets
2. Crea 3 pestañas: `Admins`, `Usuarios`, `Respuestas`
3. Añade los encabezados según `CONFIGURACION.md`

### Paso 2: Configurar Apps Script
1. En Google Sheets: **Extensiones → Apps Script**
2. Copia el contenido de `/Informe/Codigo.gs`
3. Implementa como Web App
4. Copia la URL generada

### Paso 3: Actualizar URLs
En `/Marca.js`, reemplaza:
```javascript
api: {
    gestion: "TU_URL_AQUI",
    informes: "TU_URL_AQUI",
    testDISC: "TU_URL_AQUI"
}
```

### Paso 4: Reemplazar Logos
Sustituye los archivos en `/img/`:
- `imagen1.svg` → Tu logo principal
- `imagen2.svg` → Tu logo secundario

---

## 📂 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `/sitemap.html` | Mapa visual del sitio |
| `/README.md` | Documentación completa |
| `/CONFIGURACION.md` | Guía paso a paso |
| `/Marca.js` | Configuración central |
| `/Informe/Codigo.gs` | Backend de Google Apps Script |

---

## 🎯 Rutas Principales

### Acceso
- `/inicio/index.html` - Selección de rol
- `/index.html` - Login

### Dashboards
- `/SuperAdminDashboard/` - Panel SuperAdmin
- `/AdminDashboard/` - Panel Admin
- `/Userboard/` - Panel Usuario

### Funcionalidades
- `/Test/` - Test DISC (24 preguntas)
- `/Informe/` - Visualización de informes

---

## 🔐 Accesos por Defecto

**SuperAdmin (hardcodeado en `/Informe/Codigo.gs`):**
```
Usuario: superadmin
Password: admin123
```

**Admin y Usuarios:**
Deben ser creados desde los paneles superiores.

---

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `/Marca.js`:
```javascript
brand: {
    primaryColor: "#TU_COLOR",
    secondaryColor: "#TU_COLOR",
}
```

### Cambiar Textos
Los archivos HTML son editables directamente.

---

## 🐛 Problemas Comunes

### "No se guardan los datos"
✅ Verifica que hayas configurado Google Apps Script
✅ Comprueba que las URLs en `/Marca.js` sean correctas
✅ Verifica los nombres de las hojas en Google Sheets

### "Error de CORS"
✅ Implementa Apps Script como "Cualquier persona"
✅ Usa la URL que termina en `/exec`

### "Sesión expira muy rápido"
✅ Aumenta `sessionTimeout` en `/Marca.js`

---

## 📱 Características

✅ Sistema multi-rol (SuperAdmin → Admin → Usuario)
✅ Test DISC de 24 preguntas
✅ Cálculo automático de perfiles
✅ Informes personalizados
✅ Impresión/descarga PDF
✅ Diseño responsive
✅ Gestión de usuarios completa

---

## 🎓 Jerarquía de Usuarios

```
SuperAdmin (1)
    ↓ crea
Admin (muchos)
    ↓ crea
Usuarios (muchos)
    ↓ realizan
Tests DISC
    ↓ generan
Informes
```

---

## 📞 Ayuda

**Lee la documentación completa:**
- `README.md` - Información general
- `CONFIGURACION.md` - Configuración detallada

**Verifica el sitemap:**
- Abre `/sitemap.html` en tu navegador

---

## ✅ Checklist de Implementación

- [ ] Planilla de Google Sheets creada con 3 hojas
- [ ] Apps Script configurado e implementado
- [ ] URL del WebApp actualizada en `/Marca.js`
- [ ] Credenciales del SuperAdmin configuradas
- [ ] Logos personalizados en `/img/`
- [ ] Probado el login como SuperAdmin
- [ ] Creado al menos 1 Admin
- [ ] Creado al menos 1 Usuario
- [ ] Realizado un test completo
- [ ] Verificado el informe generado

---

**🎉 ¡Tu Sistema DISC está listo!**

*Versión 1.0 - Febrero 2026*
