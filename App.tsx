/**
 * NOTA: Este proyecto está diseñado como un sistema multi-página tradicional
 * con HTML, CSS y JavaScript puro, no como una aplicación React SPA.
 * 
 * El punto de entrada es /index.html para el login
 * o /inicio/index.html para la selección de rol.
 * 
 * Si necesitas una versión React, este sería el punto de partida.
 * Por ahora, este archivo sirve como documentación.
 */

export default function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        Sistema de Evaluación DISC
      </h1>
      
      <div style={{
        background: 'white',
        color: '#333',
        padding: '40px',
        borderRadius: '16px',
        maxWidth: '600px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ color: '#2A4B7C', marginBottom: '20px' }}>
          🚀 Cómo Usar Este Sistema
        </h2>
        
        <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <p><strong>Este es un sistema multi-página tradicional.</strong></p>
          
          <h3 style={{ color: '#2A4B7C', marginTop: '20px' }}>Páginas de Acceso:</h3>
          <ul>
            <li><code>/inicio/index.html</code> - Selección de rol</li>
            <li><code>/index.html</code> - Login general</li>
          </ul>
          
          <h3 style={{ color: '#2A4B7C', marginTop: '20px' }}>Dashboards:</h3>
          <ul>
            <li><code>/SuperAdminDashboard/</code> - Panel SuperAdmin</li>
            <li><code>/AdminDashboard/</code> - Panel Admin</li>
            <li><code>/Userboard/</code> - Panel Usuario</li>
          </ul>
          
          <h3 style={{ color: '#2A4B7C', marginTop: '20px' }}>Módulos:</h3>
          <ul>
            <li><code>/Test/</code> - Test DISC de 24 preguntas</li>
            <li><code>/Informe/</code> - Visualización de informes</li>
          </ul>
          
          <p style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
            📖 Lee <code>README.md</code> y <code>CONFIGURACION.md</code> para instrucciones completas.
          </p>
        </div>
      </div>
    </div>
  );
}
