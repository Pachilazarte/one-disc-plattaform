const Auth = {

  async login(usuario, password, rol) {
    try {

      // 🔹 1. SUPERADMIN LOCAL (FIJO)
      if (rol === CONFIG.roles.SUPERADMIN) {

        const superadmin = {
          usuario: "superadmin",
          password: "admin123",
          email: "superadmin@local",
          rol: CONFIG.roles.SUPERADMIN
        };

        if (usuario === superadmin.usuario && password === superadmin.password) {

          this.setSession({
            usuario: superadmin.usuario,
            email: superadmin.email,
            password: superadmin.password,
            rol: superadmin.rol
          });

          return { success: true };
        }

        return { success: false, message: "Credenciales inválidas" };
      }

      // 🔹 2. ADMIN DINÁMICO DESDE GOOGLE SHEETS
      if (rol === CONFIG.roles.ADMIN) {

        const response = await Helpers.fetchGET(CONFIG.api.gestion);

        if (!Array.isArray(response)) {
          return { success: false, message: "Error leyendo administradores" };
        }

        const adminEncontrado = response.find(row =>
          String(row.Usuario_Admin).trim() === String(usuario).trim() &&
          String(row.Pass_Admin).trim() === String(password).trim()
        );

        if (!adminEncontrado) {
          return { success: false, message: "Credenciales inválidas" };
        }

        this.setSession({
          usuario: String(adminEncontrado.Usuario_Admin),
          email: String(adminEncontrado.Email_Admin),
          password: String(adminEncontrado.Pass_Admin),
          rol: CONFIG.roles.ADMIN
        });

        return { success: true };
      }

      // 🔹 3. USER DINÁMICO DESDE GOOGLE SHEETS
      if (rol === CONFIG.roles.USER) {

        const response = await fetch(CONFIG.api.gestionAdmin);
        const data = await response.json();

        if (!Array.isArray(data)) {
          return { success: false, message: "Error leyendo usuarios" };
        }

        const userEncontrado = data.find(row =>
          String(row.User).trim() === String(usuario).trim() &&
          String(row.Pass_User).trim() === String(password).trim()
        );

        if (!userEncontrado) {
          return { success: false, message: "Credenciales inválidas" };
        }

        this.setSession({
          usuario: String(userEncontrado.User),
          email: String(userEncontrado.Email_User),
          password: String(userEncontrado.Pass_User),
          rol: CONFIG.roles.USER
        });

        return { success: true };
      }

      return { success: false, message: "Rol no válido" };

    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error de conexión" };
    }
  },

  setSession(userData) {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userRole", userData.rol);
    sessionStorage.setItem("userName", userData.usuario);
    sessionStorage.setItem("userEmail", userData.email);
    sessionStorage.setItem("userPassword", userData.password);
    sessionStorage.setItem("sessionStartTime", String(Date.now()));
  },

  getSession() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) return null;

    const startTime = parseInt(sessionStorage.getItem("sessionStartTime") || "0", 10);
    const currentTime = Date.now();

    if (currentTime - startTime > CONFIG.system.sessionTimeout) {
      this.logout();
      return null;
    }

    return {
      isLoggedIn: true,
      role: sessionStorage.getItem("userRole"),
      userName: sessionStorage.getItem("userName"),
      userEmail: sessionStorage.getItem("userEmail"),
      userPassword: sessionStorage.getItem("userPassword")
    };
  },

  isAuthenticated() {
    return this.getSession() !== null;
  },

  logout() {
    sessionStorage.clear();
    window.location.href = CONFIG.routes.login;
  },

  protectPage(requiredRole) {
    const session = this.getSession();

    if (!session) {
      window.location.href = CONFIG.routes.login;
      return false;
    }

    if (requiredRole && session.role !== requiredRole) {
      alert("No tienes permisos para acceder a esta página");
      this.redirectToDashboard();
      return false;
    }

    return true;
  },

  redirectToDashboard() {
    const session = this.getSession();
    if (!session) {
      window.location.href = CONFIG.routes.login;
      return;
    }

    if (session.role === CONFIG.roles.SUPERADMIN) {
      window.location.href = CONFIG.routes.superAdminDashboard;
    }

    if (session.role === CONFIG.roles.ADMIN) {
      window.location.href = CONFIG.routes.adminDashboard;
    }

    // 🔹 REDIRECCIÓN USER
    if (session.role === CONFIG.roles.USER) {
      window.location.href = CONFIG.routes.userboard;
    }
  }
};

window.Auth = Auth;
