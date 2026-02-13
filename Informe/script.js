/**
 * ============================================================================
 * SISTEMA DE INFORME DISC — Cliente Web
 * Porta toda la lógica del código.gs a JavaScript del navegador.
 * Lee datos de sessionStorage (discUserData) y genera el informe interactivo.
 * ============================================================================
 */

// ============================================================================
// CONSTANTES Y DATOS DEL MODELO DISC
// ============================================================================

const GRUPOS_DISC = {
  1:  { D:"Enérgico",       I:"Animado",          S:"Plácido",       C:"Preciso" },
  2:  { D:"Competitivo",    I:"Expresivo",         S:"Leal",          C:"Diplomático" },
  3:  { D:"Directo",        I:"Alentador",         S:"Bondadoso",     C:"Meticuloso" },
  4:  { D:"Atrevido",       I:"Encantador",        S:"Amable",        C:"Sistemático" },
  5:  { D:"Decidido",       I:"Optimista",         S:"Sereno",        C:"Perfeccionista" },
  6:  { D:"Audaz",          I:"Comunicativo",      S:"Paciente",      C:"Reflexivo" },
  7:  { D:"Exigente",       I:"Entusiasta",        S:"Cooperativo",   C:"Lógico" },
  8:  { D:"Dominante",      I:"Popular",           S:"Tolerante",     C:"Analítico" },
  9:  { D:"Arriesgado",     I:"Sociable",          S:"Confiable",     C:"Detallista" },
  10: { D:"Firme",          I:"Persuasivo",        S:"Moderado",      C:"Cauteloso" },
  11: { D:"Orientado a resultados", I:"Entusiasta", S:"Colaborador",  C:"Ordenado" },
  12: { D:"Emprendedor",    I:"Inspirador",        S:"Estable",       C:"Cuidadoso" },
  13: { D:"Desafiante",     I:"Influyente",        S:"Servicial",     C:"Organizado" },
  14: { D:"Impaciente",     I:"Extrovertido",      S:"De apoyo",      C:"Metódico" },
  15: { D:"Independiente",  I:"Amigable",          S:"Moderado",      C:"Convencional" },
  16: { D:"Asertivo",       I:"Estimulante",       S:"Comprensivo",   C:"Reservado" },
  17: { D:"Determinado",    I:"Positivo",          S:"Paciente",      C:"Controlado" },
  18: { D:"Agresivo",       I:"Afectuoso",         S:"Receptivo",     C:"Perfeccionista" },
  19: { D:"Decisiones rápidas", I:"Sociable",      S:"Considerado",   C:"Meticuloso" },
  20: { D:"Líder nato",     I:"Promotor",          S:"Consistente",   C:"Formal" },
  21: { D:"Pragmático",     I:"Emocional",         S:"Conciliador",   C:"Normativo" },
  22: { D:"Obstinado",      I:"Confiado",          S:"Tolerante",     C:"Evasivo" },
  23: { D:"Inflexible",     I:"Egocéntrico",       S:"Indeciso",      C:"Terco" },
  24: { D:"Argumentador",   I:"Descuidado",        S:"Dubitativo",    C:"Quisquilloso" },
  25: { D:"Impulsivo",      I:"Imprudente",        S:"Tímido",        C:"Crítico" },
  26: { D:"Intolerante",    I:"Poco organizado",   S:"Pasivo",        C:"Pesimista" },
  27: { D:"Insensible",     I:"Hablador",          S:"Sin ambición",  C:"Distante" },
  28: { D:"Dominante",      I:"Desordenado",       S:"Dependiente",   C:"Desconfiado" }
};

const PERFILES_DISC = {
  D: {
    nombre: "Dominancia", letra: "D", color: "#dc2626", colorFondo: "#fef2f2", icono: "🎯",
    breve: "Orientado a resultados, directo y decidido",
    pregunta_clave: "¿QUÉ? — Enfocado en resultados y acción",
    descripcion_completa: "Las personas con alta Dominancia (D) se caracterizan por ser directas, decididas y orientadas a resultados. Les gusta tener el control, enfrentan desafíos con determinación y toman decisiones con rapidez. Son competitivas y buscan alcanzar objetivos de manera eficiente. Lideran con firmeza y se destacan en contextos que requieren acción inmediata y gestión bajo presión.",
    motivadores: "Poder, autoridad, competencia, desafíos, resultados tangibles, oportunidades de avance, autonomía.",
    fortalezas: "Liderazgo natural, toma de decisiones ágil, resolución de problemas, orientación a resultados, visión estratégica.",
    areas_mejora: "Puede ser percibido como impaciente, insensible o autoritario. Tendencia a pasar por alto detalles y descuidar necesidades emocionales del equipo.",
    bajo_presion: "Puede volverse agresivo, impaciente, intolerante con errores e imponer su voluntad sin considerar alternativas.",
    entorno_ideal: "Entornos dinámicos y competitivos, con desafíos constantes, autonomía y oportunidades de avance rápido."
  },
  I: {
    nombre: "Influencia", letra: "I", color: "#d97706", colorFondo: "#fffbeb", icono: "🌟",
    breve: "Entusiasta, sociable y persuasivo",
    pregunta_clave: "¿QUIÉN? — Enfocado en personas y relaciones",
    descripcion_completa: "Las personas con alta Influencia (I) son extrovertidas, optimistas y persuasivas. Disfrutan socializar, influir en otros y crear un ambiente positivo. Son comunicativas y les motiva el reconocimiento social. Generan entusiasmo y cohesión en los equipos, son creativas y excelentes para promover proyectos.",
    motivadores: "Reconocimiento social, popularidad, relaciones, trabajo en equipo, libertad de expresión, ambiente positivo.",
    fortalezas: "Comunicación excepcional, persuasión, trabajo en equipo, creatividad, networking, motivar a otros.",
    areas_mejora: "Puede ser percibido como desorganizado o impulsivo. Tendencia a priorizar popularidad sobre productividad y evitar confrontaciones.",
    bajo_presion: "Puede volverse desorganizado, superficial, demasiado emocional y buscar aprobación a toda costa.",
    entorno_ideal: "Entornos colaborativos con interacción frecuente, reconocimiento público, flexibilidad y ambiente optimista."
  },
  S: {
    nombre: "Estabilidad", letra: "S", color: "#059669", colorFondo: "#f0fdf4", icono: "🤝",
    breve: "Paciente, leal y colaborador",
    pregunta_clave: "¿CÓMO? — Enfocado en procesos y cooperación",
    descripcion_completa: "Las personas con alta Estabilidad (S) son pacientes, leales y orientadas al equipo. Valoran la estabilidad y previsibilidad, son confiables y prefieren ambientes armoniosos. Se destacan por mantener la calma en situaciones difíciles, mediar en conflictos y generar un clima de trabajo seguro.",
    motivadores: "Seguridad, estabilidad, relaciones armoniosas, reconocimiento sincero, tiempo para adaptarse.",
    fortalezas: "Lealtad excepcional, paciencia, escucha activa, consistencia, mediación, perseverancia.",
    areas_mejora: "Puede ser percibido como resistente al cambio o indeciso. Dificultad para establecer límites y adaptación lenta.",
    bajo_presion: "Puede volverse pasivo, indeciso, excesivamente complaciente y resistente a cualquier cambio.",
    entorno_ideal: "Entornos estables con relaciones a largo plazo, roles definidos, tiempo para adaptarse y liderazgo comprensivo."
  },
  C: {
    nombre: "Cumplimiento", letra: "C", color: "#2563eb", colorFondo: "#eff6ff", icono: "📋",
    breve: "Analítico, preciso y metódico",
    pregunta_clave: "¿POR QUÉ? — Enfocado en calidad y precisión",
    descripcion_completa: "Las personas con alto Cumplimiento (C) son analíticas, precisas y orientadas a la calidad. Valoran la exactitud, siguen procedimientos y buscan la perfección. Son detallistas y sistemáticas, con capacidad de análisis profundo, pensamiento crítico y habilidad para identificar problemas antes de que ocurran.",
    motivadores: "Calidad, precisión, estándares altos, información detallada, tiempo para analizar, procedimientos claros.",
    fortalezas: "Análisis profundo, precisión técnica, control de calidad, planificación detallada, pensamiento crítico.",
    areas_mejora: "Puede ser percibido como excesivamente crítico o distante. Parálisis por análisis, perfeccionismo excesivo.",
    bajo_presion: "Puede volverse excesivamente crítico, pesimista, aislado y obsesionado con detalles, perdiendo visión global.",
    entorno_ideal: "Entornos estructurados con estándares claros, tiempo para análisis, acceso a datos y valoración de la precisión."
  }
};

const TEXTOS_NIVEL = {
  "Muy Alto": {
    color: "#dc2626", icono: "🔴",
    textoMas: "La persona se identifica de forma muy marcada con este grupo de características, seleccionándolas como las que MÁS la describen en la gran mayoría de las situaciones. Esto indica una fuerte afinidad natural con estos rasgos conductuales.",
    textoMenos: "La persona rechaza de forma muy marcada este grupo de características, indicando una baja afinidad natural con estos rasgos."
  },
  "Alto": {
    color: "#ea580c", icono: "🟠",
    textoMas: "La persona muestra una identificación notable con este grupo de características, indicando una preferencia conductual clara.",
    textoMenos: "La persona tiende a rechazar este grupo de características con frecuencia notable."
  },
  "Moderado": {
    color: "#ca8a04", icono: "🟡",
    textoMas: "La persona muestra una identificación equilibrada, sugiriendo flexibilidad para activar estos rasgos según el contexto.",
    textoMenos: "La persona rechaza en nivel moderado, sugiriendo una relación flexible con estos rasgos."
  },
  "Bajo": {
    color: "#2563eb", icono: "🔵",
    textoMas: "La persona se identifica poco con este grupo de características, orientando su perfil hacia otros ejes DISC.",
    textoMenos: "La persona rechaza poco este grupo, indicando cierta comodidad o tolerancia con estos rasgos."
  },
  "Muy Bajo": {
    color: "#059669", icono: "🟢",
    textoMas: "La persona prácticamente no se identifica con estas características. Su perfil se orienta claramente hacia el grupo opuesto.",
    textoMenos: "La persona casi nunca rechaza estas características, sugiriendo alta afinidad natural."
  }
};

const TEXTOS_CONSISTENCIA = {
  consistente_DI: {
    titulo: "✅ Perfil Consistente: Orientación Activa/Extrovertida (D-I)",
    texto: "Existe alta consistencia en el perfil: las características MÁS representativas (D/I) son complementarias con las MENOS representativas (S/C). Esto indica autoconocimiento claro y un patrón conductual definido hacia la acción, el liderazgo y la comunicación."
  },
  consistente_SC: {
    titulo: "✅ Perfil Consistente: Orientación Reservada/Metódica (S-C)",
    texto: "Existe alta consistencia: las características MÁS representativas (S/C) son complementarias con las MENOS representativas (D/I). Esto indica autoconocimiento claro hacia la estabilidad, la cooperación, el análisis y la precisión."
  },
  mixto: {
    titulo: "⚖️ Perfil Mixto: Orientación Adaptable",
    texto: "El perfil muestra un patrón mixto sin orientación predominante marcada. Se seleccionan tanto características activas (D/I) como reservadas (S/C). Esto puede indicar versatilidad y adaptabilidad conductual, o un momento de transición personal/profesional."
  },
  contradictorio: {
    titulo: "⚠️ Perfil a Analizar: Posible Inconsistencia",
    texto: "El perfil muestra un patrón que requiere análisis adicional. Puede ocurrir cuando hay disonancia entre lo que se desea ser y lo que se cree ser, o cuando factores situacionales distorsionan la autopercepción. Se recomienda una entrevista complementaria."
  }
};

// ============================================================================
// FUNCIONES DE CÁLCULO (portadas del código.gs)
// ============================================================================

function parsearRespuestasDISC(respuestasString) {
  try {
    const resultado = { tiempoParte1: "", tiempoParte2: "", respuestas: {} };

    const matchPI = respuestasString.match(/\{PI:\s*([^-]+)\s*-\s*([^}]+)\}/);
    if (matchPI) {
      resultado.tiempoParte1 = matchPI[1].trim();
      matchPI[2].split(',').forEach(par => {
        const [idStr, valStr] = par.trim().split(';');
        const id = parseInt(idStr, 10), val = parseInt(valStr, 10);
        if (!isNaN(id) && !isNaN(val)) resultado.respuestas[id] = val;
      });
    }

    const matchPII = respuestasString.match(/\{PII:\s*([^-]+)\s*-\s*([^}]+)\}/);
    if (matchPII) {
      resultado.tiempoParte2 = matchPII[1].trim();
      matchPII[2].split(',').forEach(par => {
        const [idStr, valStr] = par.trim().split(';');
        const id = parseInt(idStr, 10), val = parseInt(valStr, 10);
        if (!isNaN(id) && !isNaN(val)) resultado.respuestas[id] = val;
      });
    }

    return resultado;
  } catch (e) {
    console.error('Error parseando respuestas:', e);
    return null;
  }
}

function calcularResultadosDISC(datosParsed) {
  const respuestas = datosParsed.respuestas;

  let masDI = 0, masSC = 0, menosDI = 0, menosSC = 0;
  let masDI_P1 = 0, masSC_P1 = 0, menosDI_P1 = 0, menosSC_P1 = 0;
  let masDI_P2 = 0, masSC_P2 = 0, menosDI_P2 = 0, menosSC_P2 = 0;
  let preguntasRespondidas = 0;
  const detallePreguntas = [];

  for (let q = 1; q <= 28; q++) {
    let idMas, idMenos;
    if (q <= 14) {
      idMas = (q - 1) * 2 + 1;
      idMenos = (q - 1) * 2 + 2;
    } else {
      idMas = 28 + (q - 15) * 2 + 1;
      idMenos = 28 + (q - 15) * 2 + 2;
    }

    const valMas = respuestas[idMas];
    const valMenos = respuestas[idMenos];

    if (valMas !== undefined && valMenos !== undefined) {
      preguntasRespondidas++;

      if (valMas === 5) masDI++; else masSC++;
      if (valMenos === 5) menosDI++; else menosSC++;

      if (q <= 14) {
        if (valMas === 5) masDI_P1++; else masSC_P1++;
        if (valMenos === 5) menosDI_P1++; else menosSC_P1++;
      } else {
        if (valMas === 5) masDI_P2++; else masSC_P2++;
        if (valMenos === 5) menosDI_P2++; else menosSC_P2++;
      }

      const grupo = GRUPOS_DISC[q];
      detallePreguntas.push({
        numero: q,
        parte: q <= 14 ? "I" : "II",
        textoD: grupo ? grupo.D : "",
        textoI: grupo ? grupo.I : "",
        textoS: grupo ? grupo.S : "",
        textoC: grupo ? grupo.C : "",
        masGrupo: valMas === 5 ? "D/I" : "S/C",
        menosGrupo: valMenos === 5 ? "D/I" : "S/C"
      });
    }
  }

  const pctMasDI = Math.round((masDI / 28) * 100);
  const pctMasSC = Math.round((masSC / 28) * 100);
  const pctMenosDI = Math.round((menosDI / 28) * 100);
  const pctMenosSC = Math.round((menosSC / 28) * 100);

  const netoDI = masDI - menosDI;
  const netoSC = masSC - menosSC;

  return {
    masDI, masSC, menosDI, menosSC,
    netoDI, netoSC,
    pctMasDI, pctMasSC, pctMenosDI, pctMenosSC,
    nivelMasDI: obtenerNivel(pctMasDI),
    nivelMasSC: obtenerNivel(pctMasSC),
    nivelMenosDI: obtenerNivel(pctMenosDI),
    nivelMenosSC: obtenerNivel(pctMenosSC),
    masDI_P1, masSC_P1, menosDI_P1, menosSC_P1,
    masDI_P2, masSC_P2, menosDI_P2, menosSC_P2,
    tipoConsistencia: determinarConsistencia(masDI, masSC, menosDI, menosSC),
    detallePreguntas,
    preguntasRespondidas,
    tiempoParte1: datosParsed.tiempoParte1,
    tiempoParte2: datosParsed.tiempoParte2
  };
}

function obtenerNivel(porcentaje) {
  if (porcentaje >= 75) return "Muy Alto";
  if (porcentaje >= 55) return "Alto";
  if (porcentaje >= 35) return "Moderado";
  if (porcentaje >= 15) return "Bajo";
  return "Muy Bajo";
}

function determinarConsistencia(masDI, masSC, menosDI, menosSC) {
  if (masDI >= 18 && menosSC >= 18) return "consistente_DI";
  if (masSC >= 18 && menosDI >= 18) return "consistente_SC";
  const diffMas = Math.abs(masDI - masSC);
  const diffMenos = Math.abs(menosDI - menosSC);
  if (diffMas <= 8 && diffMenos <= 8) return "mixto";
  if (masDI > masSC && menosSC > menosDI) return "consistente_DI";
  if (masSC > masDI && menosDI > menosSC) return "consistente_SC";
  if ((masDI > masSC && menosDI > menosSC) || (masSC > masDI && menosSC > menosDI)) return "contradictorio";
  return "mixto";
}

// ============================================================================
// UI RENDERING
// ============================================================================

function renderReport(data, resultado) {
  const nombreCompleto = `${data.Nombre || ""} ${data.Apellido || ""}`.trim();

  // Header
  document.getElementById('nombreCompleto').textContent = nombreCompleto;
  document.getElementById('correoUsuario').textContent = data.Correo || '';
  document.getElementById('fechaEval').textContent = data.Fecha ? new Date(data.Fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  document.getElementById('tiempoP1').textContent = resultado.tiempoParte1 || '—';
  document.getElementById('tiempoP2').textContent = resultado.tiempoParte2 || '—';
  document.getElementById('footerNombre').textContent = nombreCompleto;

  // Avatar initials
  const initials = (data.Nombre || '').charAt(0) + (data.Apellido || '').charAt(0);
  document.getElementById('userAvatar').textContent = initials.toUpperCase();

  // Score cards
  renderScoreCard('masDI', resultado.masDI, resultado.pctMasDI, resultado.nivelMasDI);
  renderScoreCard('masSC', resultado.masSC, resultado.pctMasSC, resultado.nivelMasSC);
  renderScoreCard('menosDI', resultado.menosDI, resultado.pctMenosDI, resultado.nivelMenosDI);
  renderScoreCard('menosSC', resultado.menosSC, resultado.pctMenosSC, resultado.nivelMenosSC);

  // Charts
  renderCharts(resultado);

  // Puntuaciones table
  renderTablaPuntuaciones(resultado);

  // Consistency
  renderConsistencia(resultado);

  // Interpretations
  renderInterpretacion('interpMasDI', 'MÁS → D/I (Dominancia / Influencia)', 'Características activas, extrovertidas', resultado.masDI, resultado.pctMasDI, resultado.nivelMasDI, TEXTOS_NIVEL[resultado.nivelMasDI], 'mas');
  renderInterpretacion('interpMasSC', 'MÁS → S/C (Estabilidad / Cumplimiento)', 'Características reservadas, metódicas', resultado.masSC, resultado.pctMasSC, resultado.nivelMasSC, TEXTOS_NIVEL[resultado.nivelMasSC], 'mas');
  renderInterpretacion('interpMenosDI', 'MENOS → D/I (Dominancia / Influencia)', 'Rechazo de características activas', resultado.menosDI, resultado.pctMenosDI, resultado.nivelMenosDI, TEXTOS_NIVEL[resultado.nivelMenosDI], 'menos');
  renderInterpretacion('interpMenosSC', 'MENOS → S/C (Estabilidad / Cumplimiento)', 'Rechazo de características reservadas', resultado.menosSC, resultado.pctMenosSC, resultado.nivelMenosSC, TEXTOS_NIVEL[resultado.nivelMenosSC], 'menos');

  // Partes table
  renderTablaPartes(resultado);

  // Dimensiones DISC
  renderDimensiones();

  // Detalle pregunta por pregunta
  renderDetalle(resultado.detallePreguntas);
}

function renderScoreCard(key, val, pct, nivel) {
  document.getElementById(`val-${key}`).textContent = val;
  document.getElementById(`pct-${key}`).textContent = `${pct}%`;
  document.getElementById(`lvl-${key}`).textContent = `${TEXTOS_NIVEL[nivel].icono} ${nivel}`;

  // Animate bars after a short delay
  setTimeout(() => {
    document.getElementById(`bar-${key}`).style.width = `${pct}%`;
  }, 600);
}

function renderCharts(r) {
  const commonFont = { family: "'DM Sans', sans-serif" };

  // Bar Chart
  new Chart(document.getElementById('chartBar'), {
    type: 'bar',
    data: {
      labels: ['MÁS D/I', 'MÁS S/C', 'MENOS D/I', 'MENOS S/C'],
      datasets: [{
        data: [r.masDI, r.masSC, r.menosDI, r.menosSC],
        backgroundColor: ['#dc262680', '#05966980', '#d9770680', '#2563eb80'],
        borderColor: ['#dc2626', '#059669', '#d97706', '#2563eb'],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 44
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true, max: 28,
          ticks: { stepSize: 4, font: { ...commonFont, size: 11 } },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: { font: { ...commonFont, size: 11 } },
          grid: { display: false }
        }
      }
    }
  });

  // Radar Chart
  new Chart(document.getElementById('chartRadar'), {
    type: 'radar',
    data: {
      labels: ['MÁS D/I', 'MÁS S/C', 'MENOS D/I', 'MENOS S/C'],
      datasets: [{
        data: [r.pctMasDI, r.pctMasSC, r.pctMenosDI, r.pctMenosSC],
        backgroundColor: 'rgba(11, 74, 110, 0.15)',
        borderColor: '#0b4a6e',
        pointBackgroundColor: '#0b4a6e',
        pointRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true, max: 100,
          ticks: { stepSize: 25, font: { ...commonFont, size: 10 }, backdropColor: 'transparent' },
          pointLabels: { font: { ...commonFont, size: 12, weight: 600 } },
          grid: { color: '#e2e8f0' }
        }
      }
    }
  });
}

function renderTablaPuntuaciones(r) {
  const tbody = document.getElementById('tbodyPuntuaciones');
  const rows = [
    { label: 'D/I — Activo/Extrovertido', colorClass: 'color-d', mas: r.masDI, pctMas: r.pctMasDI, nivelMas: r.nivelMasDI, menos: r.menosDI, pctMenos: r.pctMenosDI, nivelMenos: r.nivelMenosDI, neto: r.netoDI, netoColor: r.netoDI > 0 ? '#dc2626' : r.netoDI < 0 ? '#2563eb' : '#718096' },
    { label: 'S/C — Reservado/Metódico', colorClass: 'color-s', mas: r.masSC, pctMas: r.pctMasSC, nivelMas: r.nivelMasSC, menos: r.menosSC, pctMenos: r.pctMenosSC, nivelMenos: r.nivelMenosSC, neto: r.netoSC, netoColor: r.netoSC > 0 ? '#059669' : r.netoSC < 0 ? '#ea580c' : '#718096' }
  ];

  tbody.innerHTML = rows.map(row => {
    const nlMas = TEXTOS_NIVEL[row.nivelMas];
    const nlMenos = TEXTOS_NIVEL[row.nivelMenos];
    return `<tr>
      <td style="font-weight:700;">${row.label}</td>
      <td style="font-weight:800;font-size:18px;">${row.mas}</td>
      <td>${row.pctMas}%</td>
      <td style="color:${nlMas.color};font-weight:600;">${nlMas.icono} ${row.nivelMas}</td>
      <td style="font-weight:800;font-size:18px;">${row.menos}</td>
      <td>${row.pctMenos}%</td>
      <td style="color:${nlMenos.color};font-weight:600;">${nlMenos.icono} ${row.nivelMenos}</td>
      <td style="font-weight:800;font-size:16px;color:${row.netoColor};font-family:var(--font-mono);">${row.neto > 0 ? '+' : ''}${row.neto}</td>
    </tr>`;
  }).join('');
}

function renderConsistencia(r) {
  const card = document.getElementById('consistenciaCard');
  const tc = TEXTOS_CONSISTENCIA[r.tipoConsistencia];
  card.setAttribute('data-type', r.tipoConsistencia);
  document.getElementById('consistenciaTitulo').textContent = tc.titulo;
  document.getElementById('consistenciaTexto').textContent = tc.texto;
  document.getElementById('netoValDI').textContent = `${r.netoDI > 0 ? '+' : ''}${r.netoDI}`;
  document.getElementById('netoValSC').textContent = `${r.netoSC > 0 ? '+' : ''}${r.netoSC}`;
}

function renderInterpretacion(containerId, title, subtitle, freq, pct, nivel, textoNivel, tipo) {
  const container = document.getElementById(containerId);
  const texto = tipo === 'mas' ? textoNivel.textoMas : textoNivel.textoMenos;
  container.style.borderLeftColor = textoNivel.color;
  container.innerHTML = `
    <div class="interp-body">
      <div class="interp-title">${title}</div>
      <div class="interp-subtitle">${subtitle}</div>
      <div class="interp-stats">Frecuencia: <strong>${freq}</strong> de 28 (${pct}%) — Nivel: <strong style="color:${textoNivel.color};">${textoNivel.icono} ${nivel}</strong></div>
      <div class="interp-text">${texto}</div>
    </div>
    <div class="interp-badge" style="background:${textoNivel.color};">${pct}%</div>
  `;
}

function renderTablaPartes(r) {
  const tbody = document.getElementById('tbodyPartes');
  tbody.innerHTML = `
    <tr>
      <td>Parte I (1-14) — Fortalezas</td>
      <td style="font-weight:700;color:#dc2626;">${r.masDI_P1}</td>
      <td style="font-weight:700;color:#059669;">${r.masSC_P1}</td>
      <td style="font-weight:700;color:#d97706;">${r.menosDI_P1}</td>
      <td style="font-weight:700;color:#2563eb;">${r.menosSC_P1}</td>
    </tr>
    <tr>
      <td>Parte II (15-28) — Bajo presión</td>
      <td style="font-weight:700;color:#dc2626;">${r.masDI_P2}</td>
      <td style="font-weight:700;color:#059669;">${r.masSC_P2}</td>
      <td style="font-weight:700;color:#d97706;">${r.menosDI_P2}</td>
      <td style="font-weight:700;color:#2563eb;">${r.menosSC_P2}</td>
    </tr>
    <tr style="background:#f1f5f9;font-weight:800;">
      <td>TOTAL (28 preguntas)</td>
      <td style="color:#dc2626;">${r.masDI}</td>
      <td style="color:#059669;">${r.masSC}</td>
      <td style="color:#d97706;">${r.menosDI}</td>
      <td style="color:#2563eb;">${r.menosSC}</td>
    </tr>
  `;
}

function renderDimensiones() {
  const container = document.getElementById('dimensionesContainer');
  const dims = ['D', 'I', 'S', 'C'];

  container.innerHTML = dims.map(key => {
    const d = PERFILES_DISC[key];
    return `
    <div class="dim-card dim-card-${key} reveal">
      <div class="dim-header">
        <div class="dim-icon">${d.icono}</div>
        <div>
          <div class="dim-letter">${d.letra} — ${d.nombre}</div>
          <div class="dim-name">"${d.breve}"</div>
        </div>
      </div>
      <div class="dim-question">${d.pregunta_clave}</div>
      <div class="dim-desc">${d.descripcion_completa}</div>
      <div class="dim-details">
        <div class="dim-detail-row"><span class="dim-detail-label" style="color:${d.color};">🔑 Motivadores:</span><span>${d.motivadores}</span></div>
        <div class="dim-detail-row"><span class="dim-detail-label" style="color:#059669;">💪 Fortalezas:</span><span>${d.fortalezas}</span></div>
        <div class="dim-detail-row"><span class="dim-detail-label" style="color:#d97706;">⚠️ Áreas de mejora:</span><span>${d.areas_mejora}</span></div>
        <div class="dim-detail-row"><span class="dim-detail-label" style="color:#dc2626;">🔥 Bajo presión:</span><span>${d.bajo_presion}</span></div>
        <div class="dim-detail-row"><span class="dim-detail-label" style="color:#2563eb;">🏢 Entorno ideal:</span><span>${d.entorno_ideal}</span></div>
      </div>
    </div>`;
  }).join('');
}

function renderDetalle(detallePreguntas) {
  const tbody1 = document.getElementById('detalleParte1');
  const tbody2 = document.getElementById('detalleParte2');

  detallePreguntas.forEach((p, i) => {
    const row = `<tr style="background:${i % 2 === 0 ? '#fff' : '#fafbfc'};">
      <td style="text-align:center;color:#64748b;font-weight:600;">${p.numero}</td>
      <td style="text-align:center;">${p.textoD}</td>
      <td style="text-align:center;">${p.textoI}</td>
      <td style="text-align:center;">${p.textoS}</td>
      <td style="text-align:center;">${p.textoC}</td>
      <td style="text-align:center;"><span class="cell-tag" style="background:${p.masGrupo === 'D/I' ? '#fef2f2' : '#f0fdf4'};color:${p.masGrupo === 'D/I' ? '#dc2626' : '#059669'};">${p.masGrupo}</span></td>
      <td style="text-align:center;"><span class="cell-tag" style="background:${p.menosGrupo === 'D/I' ? '#fff7ed' : '#eff6ff'};color:${p.menosGrupo === 'D/I' ? '#ea580c' : '#2563eb'};">${p.menosGrupo}</span></td>
    </tr>`;

    if (p.parte === 'I') tbody1.innerHTML += row;
    else tbody2.innerHTML += row;
  });
}

// ============================================================================
// NAVIGATION
// ============================================================================

function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.section;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      sections.forEach(s => {
        s.classList.remove('active');
        if (s.id === `sec-${target}`) {
          s.classList.add('active');
          // Trigger reveal animations for newly visible section
          setTimeout(() => triggerReveals(s), 50);
        }
      });

      // Scroll to top of section area
      window.scrollTo({ top: document.querySelector('.report-nav').offsetTop, behavior: 'smooth' });
    });
  });
}

// ============================================================================
// REVEAL ANIMATIONS (Intersection Observer)
// ============================================================================

function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function triggerReveals(container) {
  const reveals = container.querySelectorAll('.reveal');
  reveals.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 80);
  });
}

// ============================================================================
// MAIN INIT
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  const stored = sessionStorage.getItem("discUserData");

  if (!stored) {
    alert("No hay datos de informe disponibles. Volviendo al panel...");
    window.location.href = "../Userboard/index.html";
    return;
  }

  let data;
  try {
    data = JSON.parse(stored);
  } catch (e) {
    console.error("discUserData no es JSON válido:", e);
    alert("Los datos del informe están corruptos. Volviendo al panel...");
    window.location.href = "../Userboard/index.html";
    return;
  }

  // Parse and calculate
  const respuestasString = data.Respuestas || "";
  const datosParsed = parsearRespuestasDISC(respuestasString);

  if (!datosParsed || Object.keys(datosParsed.respuestas).length === 0) {
    alert("No se pudieron interpretar las respuestas del test.");
    return;
  }

  const resultado = calcularResultadosDISC(datosParsed);

  // Render everything
  renderReport(data, resultado);
  setupNavigation();

  // Hide loading, show report
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('fade-out');
    document.getElementById('reportContainer').classList.remove('hidden');

    // Setup animations after showing
    setTimeout(() => {
      setupRevealAnimations();
      triggerReveals(document.getElementById('sec-resumen'));
    }, 100);
  }, 1200);
});


/*/ Imprimir Informe /*/

// ============================================================================
// PDF EXPORT — FIXED
// ============================================================================

async function exportPDF() {
  // Show loading overlay
  const overlay = document.createElement('div');
  overlay.className = 'pdf-overlay';
  overlay.innerHTML = '<div class="pdf-spinner"></div><p>Generando PDF del informe...</p>';
  document.body.appendChild(overlay);

  // Load html2pdf library dynamically
  if (!window.html2pdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Save current state
  const activeSection = document.querySelector('.section.active');

  // Activate PDF mode
  document.body.classList.add('pdf-generating');

  // Show ALL sections
  document.querySelectorAll('.section').forEach(s => {
    s.classList.add('active');
    s.querySelectorAll('.reveal').forEach(r => r.classList.add('visible'));
  });

  // Wait for reflow + charts to render
  await new Promise(r => setTimeout(r, 800));

  // Convert Chart.js canvases to static images so html2canvas captures them
  const canvases = document.querySelectorAll('#reportContainer canvas');
  const canvasBackups = [];
  canvases.forEach(canvas => {
    try {
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');
      img.style.cssText = canvas.style.cssText;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.className = 'pdf-chart-img';
      canvas.parentNode.insertBefore(img, canvas);
      canvas.style.display = 'none';
      canvasBackups.push({ canvas, img });
    } catch(e) {
      console.warn('Could not convert canvas:', e);
    }
  });

  await new Promise(r => setTimeout(r, 300));

  const container = document.getElementById('reportContainer');
  const nombreCompleto = document.getElementById('nombreCompleto').textContent || 'evaluado';

  try {
    await html2pdf().set({
      margin:       [8, 5, 8, 5],
      filename:     `Informe DISC - ${nombreCompleto}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        width: container.scrollWidth,
        windowWidth: container.scrollWidth
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    {
        mode: ['avoid-all', 'css', 'legacy'],
        before: ['.pdf-page-break-before'],
        avoid: ['.score-card', '.dim-card', '.interp-card', '.consistency-card', '.intro-card', '.about-card', '.notes-card', '.chart-container', 'tr']
      }
    }).from(container).save();
  } catch (err) {
    console.error('Error generando PDF:', err);
    alert('Hubo un error al generar el PDF. Intentá de nuevo.');
  }

  // Restore canvases
  canvasBackups.forEach(({ canvas, img }) => {
    canvas.style.display = '';
    img.remove();
  });

  // Restore original state
  document.body.classList.remove('pdf-generating');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (activeSection) activeSection.classList.add('active');

  // Remove overlay
  overlay.remove();
}