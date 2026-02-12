/**
 * ============================================================================
 * SISTEMA DE GENERACIÓN DE INFORMES PROFESIONALES - TEST DISC
 * Perfil de Comportamiento Profesional
 * (Basado en el modelo DISC de William Moulton Marston - Método Cleaver)
 * ============================================================================
 * Versión: 1.0 - Sistema Automatizado de Análisis de Perfil Conductual
 */

const CONFIG = {
  // --- CONFIGURACIÓN DE CONEXIÓN ---
  ID_PLANILLA: '1awkAlyEIcQOwby7RovJs_hLEiveA6oFZIOmOkyM3jc8',
  NOMBRE_HOJA: 'Respuestas',
  
  FILA_ENCABEZADOS: 1,
  COLUMNAS: {
    FECHA: 0,           // Columna A
    USUARIO_ADMIN: 1,   // Columna B
    EMAIL_ADMIN: 2,     // Columna C
    NOMBRE: 3,          // Columna D
    APELLIDO: 4,        // Columna E
    CORREO: 5,          // Columna F
    RESPUESTAS: 6,      // Columna G
    INFORME: 7,         // Columna H
    ESTADO: 8           // Columna I
  },
  EMAIL: {
    ASUNTO: 'Informe del Test DISC - Perfil de Comportamiento Profesional',
    REMITENTE: 'ONE - Escencial',
    LOGO: 'https://imgur.com/DU3T7RX.png'
  }
};

// ============================================================================
// DEFINICIÓN DE LOS 28 GRUPOS DE CARACTERÍSTICAS DISC (Método Cleaver)
// Cada grupo contiene 4 adjetivos, uno por cada dimensión D-I-S-C
// Preguntas 1-14: Contexto POSITIVO (fortalezas)
// Preguntas 15-21: Contexto MIXTO (transición)
// Preguntas 22-28: Contexto NEGATIVO (bajo presión)
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

// ============================================================================
// PERFILES DISC - DESCRIPCIONES COMPLETAS DE CADA DIMENSIÓN
// ============================================================================
const PERFILES_DISC = {
  D: {
    nombre: "Dominancia",
    letra: "D",
    color: "#dc2626",
    colorFondo: "#fef2f2",
    icono: "🎯",
    breve: "Orientado a resultados, directo y decidido",
    pregunta_clave: "¿QUÉ? — Enfocado en resultados y acción",
    descripcion_completa: "Las personas con alta Dominancia (D) se caracterizan por ser directas, decididas y orientadas a resultados. Les gusta tener el control de las situaciones, enfrentan desafíos con determinación y toman decisiones con rapidez. Son personas competitivas que buscan alcanzar objetivos de manera eficiente. En el entorno laboral, lideran con firmeza y se destacan en contextos que requieren acción inmediata, resolución de problemas complejos y gestión bajo presión. Suelen ser innovadoras y no temen asumir riesgos calculados para lograr sus metas.",
    motivadores: "Poder, autoridad, competencia, desafíos, resultados tangibles, oportunidades de avance, autonomía para decidir.",
    fortalezas: "Liderazgo natural, toma de decisiones ágil, resolución de problemas, orientación a resultados, capacidad de acción bajo presión, visión estratégica, iniciativa y emprendimiento.",
    areas_mejora: "Puede ser percibido como impaciente, insensible o autoritario. Tendencia a pasar por alto detalles, descuidar las necesidades emocionales del equipo, tomar decisiones precipitadas y generar conflictos por su estilo directo.",
    bajo_presion: "Bajo estrés, puede volverse agresivo, impaciente, intolerante con los errores de otros y excesivamente controlador. Puede imponer su voluntad sin considerar alternativas.",
    entorno_ideal: "Entornos dinámicos y competitivos, con desafíos constantes, autonomía para tomar decisiones, oportunidades de avance rápido y libertad para innovar."
  },
  I: {
    nombre: "Influencia",
    letra: "I",
    color: "#d97706",
    colorFondo: "#fffbeb",
    icono: "🌟",
    breve: "Entusiasta, sociable y persuasivo",
    pregunta_clave: "¿QUIÉN? — Enfocado en personas y relaciones",
    descripcion_completa: "Las personas con alta Influencia (I) son extrovertidas, optimistas y persuasivas. Disfrutan socializar, influir en otros y crear un ambiente positivo y entusiasta. Son comunicativas por naturaleza y les motiva el reconocimiento social y la aprobación de los demás. En el entorno laboral, generan entusiasmo y cohesión en los equipos de trabajo. Su energía contagiosa inspira y moviliza a los demás. Son creativas, visionarias y excelentes para generar ideas y promover proyectos.",
    motivadores: "Reconocimiento social, popularidad, relaciones interpersonales, trabajo en equipo, libertad de expresión, ambiente positivo, oportunidades de socializar.",
    fortalezas: "Comunicación excepcional, persuasión, trabajo en equipo, creatividad, generación de entusiasmo, networking, resolución de conflictos interpersonales y capacidad de motivar a otros.",
    areas_mejora: "Puede ser percibido como desorganizado, impulsivo o poco detallista. Tendencia a priorizar la popularidad sobre la productividad, evitar confrontaciones necesarias y comprometerse en exceso.",
    bajo_presion: "Bajo estrés, puede volverse desorganizado, superficial, demasiado emocional y tender a buscar aprobación a toda costa. Puede perder foco y dispersar su energía.",
    entorno_ideal: "Entornos colaborativos y sociales, con interacción frecuente, reconocimiento público, oportunidades para expresar ideas, flexibilidad y ambiente optimista."
  },
  S: {
    nombre: "Estabilidad",
    letra: "S",
    color: "#059669",
    colorFondo: "#f0fdf4",
    icono: "🤝",
    breve: "Paciente, leal y colaborador",
    pregunta_clave: "¿CÓMO? — Enfocado en procesos y cooperación",
    descripcion_completa: "Las personas con alta Estabilidad (S) son pacientes, leales y orientadas al trabajo en equipo. Valoran la estabilidad y la previsibilidad, son confiables y prefieren ambientes donde las relaciones sean armoniosas. Son excelentes escuchando y apoyando a otros. Su consistencia y dedicación aportan equilibrio y confianza al grupo. Se destacan por su capacidad de mantener la calma en situaciones difíciles, mediar en conflictos y generar un clima de trabajo seguro y confortable.",
    motivadores: "Seguridad, estabilidad, relaciones armoniosas, trabajo en equipo, reconocimiento sincero, tiempo para adaptarse a los cambios, ambiente predecible.",
    fortalezas: "Lealtad excepcional, paciencia, escucha activa, trabajo en equipo, consistencia, capacidad de mediación, confiabilidad, perseverancia en tareas a largo plazo y creación de ambientes seguros.",
    areas_mejora: "Puede ser percibido como resistente al cambio, indeciso o pasivo. Tendencia a evitar confrontaciones necesarias, dificultad para establecer límites, lentitud en la adaptación a nuevas situaciones.",
    bajo_presion: "Bajo estrés, puede volverse pasivo, indeciso, excesivamente complaciente y resistente a cualquier tipo de cambio. Puede interiorizar conflictos y no expresar su descontento.",
    entorno_ideal: "Entornos estables y predecibles, con relaciones a largo plazo, trabajo en equipo colaborativo, roles claramente definidos, tiempo para adaptarse y liderazgo comprensivo."
  },
  C: {
    nombre: "Cumplimiento",
    letra: "C",
    color: "#2563eb",
    colorFondo: "#eff6ff",
    icono: "📋",
    breve: "Analítico, preciso y metódico",
    pregunta_clave: "¿POR QUÉ? — Enfocado en calidad y precisión",
    descripcion_completa: "Las personas con alto Cumplimiento (C) son analíticas, precisas y orientadas a la calidad. Valoran la exactitud por encima de todo, siguen procedimientos establecidos y buscan la perfección en cada tarea. Son detallistas y sistemáticas en su enfoque. Su rigor asegura estándares altos y minimiza errores en los procesos. Se destacan por su capacidad de análisis profundo, pensamiento crítico, atención meticulosa al detalle y habilidad para identificar problemas antes de que ocurran.",
    motivadores: "Calidad, precisión, estándares altos, información detallada, tiempo para analizar, procedimientos claros, autonomía intelectual, reconocimiento por experticia.",
    fortalezas: "Análisis profundo, precisión técnica, control de calidad, planificación detallada, pensamiento crítico, seguimiento riguroso de normas, investigación y resolución de problemas complejos.",
    areas_mejora: "Puede ser percibido como excesivamente crítico, distante emocionalmente o inflexible. Tendencia a la parálisis por análisis, perfeccionismo excesivo, dificultad para delegar y comunicación fría.",
    bajo_presion: "Bajo estrés, puede volverse excesivamente crítico, pesimista, aislado y obsesionado con los detalles. Puede perder la visión global y bloquearse ante la toma de decisiones.",
    entorno_ideal: "Entornos estructurados, con estándares claros de calidad, tiempo suficiente para análisis, acceso a datos, autonomía en la ejecución de tareas complejas y valoración de la precisión."
  }
};

// ============================================================================
// TEXTOS DE INTERPRETACIÓN POR NIVEL DE TENDENCIA
// ============================================================================
const TEXTOS_NIVEL = {
  "Muy Alto": {
    color: "#dc2626", icono: "🔴",
    textoMas: "La persona se identifica de forma muy marcada con este grupo de características, seleccionándolas como las que MÁS la describen en la gran mayoría de las situaciones presentadas. Esto indica una fuerte afinidad natural con estos rasgos conductuales.",
    textoMenos: "La persona rechaza de forma muy marcada este grupo de características, seleccionándolas como las que MENOS la describen en la gran mayoría de las situaciones. Esto indica una baja afinidad natural con estos rasgos."
  },
  "Alto": {
    color: "#ea580c", icono: "🟠",
    textoMas: "La persona muestra una identificación notable con este grupo de características. Tiende a elegirlas como las que MÁS la describen con frecuencia significativa, indicando una preferencia conductual clara.",
    textoMenos: "La persona tiende a rechazar este grupo de características con frecuencia notable, indicando que no se identifica habitualmente con estos rasgos en su comportamiento cotidiano."
  },
  "Moderado": {
    color: "#ca8a04", icono: "🟡",
    textoMas: "La persona muestra una identificación equilibrada con este grupo de características. Las selecciona como MÁS descriptivas en un nivel medio, sugiriendo flexibilidad para activar estos rasgos según el contexto.",
    textoMenos: "La persona rechaza este grupo de características en un nivel moderado. Esto sugiere una relación flexible con estos rasgos: los activa o desactiva según la demanda situacional."
  },
  "Bajo": {
    color: "#2563eb", icono: "🔵",
    textoMas: "La persona se identifica poco con este grupo de características. Rara vez las selecciona como las que MÁS la describen, orientando su perfil preferentemente hacia otros ejes del modelo DISC.",
    textoMenos: "La persona rechaza poco este grupo de características, lo que indica cierta comodidad o tolerancia con estos rasgos, aunque no los considere necesariamente los más representativos."
  },
  "Muy Bajo": {
    color: "#059669", icono: "🟢",
    textoMas: "La persona prácticamente no se identifica con este grupo de características. Su perfil conductual se orienta claramente hacia el grupo opuesto dentro del modelo DISC.",
    textoMenos: "La persona casi nunca rechaza este grupo de características, lo que sugiere alta afinidad o naturalidad con estos rasgos en su comportamiento habitual."
  }
};

// ============================================================================
// TEXTOS PARA RELACIÓN MÁS vs MENOS (Patrón de Consistencia)
// ============================================================================
const TEXTOS_CONSISTENCIA = {
  "consistente_DI": {
    titulo: "✅ Perfil Consistente: Orientación Activa/Extrovertida (D-I)",
    texto: "Existe alta consistencia en el perfil: las características que la persona identifica como MÁS representativas (D/I - activas) son complementarias con las que señala como MENOS representativas (S/C - reservadas). Esto indica un autoconocimiento claro y un patrón conductual definido hacia la acción, el liderazgo, la comunicación y la toma de decisiones. La persona sabe lo que es y lo que no es, y su perfil refleja coherencia interna.",
    color: "#dc2626"
  },
  "consistente_SC": {
    titulo: "✅ Perfil Consistente: Orientación Reservada/Metódica (S-C)",
    texto: "Existe alta consistencia en el perfil: las características que la persona identifica como MÁS representativas (S/C - reservadas) son complementarias con las que señala como MENOS representativas (D/I - activas). Esto indica un autoconocimiento claro y un patrón conductual definido hacia la estabilidad, la cooperación, el análisis y la precisión. La persona tiene una imagen clara de sí misma y su perfil refleja coherencia interna.",
    color: "#059669"
  },
  "mixto": {
    titulo: "⚖️ Perfil Mixto: Orientación Adaptable",
    texto: "El perfil muestra un patrón mixto donde no existe una orientación predominante marcada. La persona selecciona tanto características activas (D/I) como reservadas (S/C) en sus elecciones de MÁS y MENOS. Esto puede indicar versatilidad y adaptabilidad conductual, o bien puede reflejar un momento de transición personal o profesional donde el individuo está redefiniendo su estilo de comportamiento.",
    color: "#7c3aed"
  },
  "contradictorio": {
    titulo: "⚠️ Perfil a Analizar: Posible Inconsistencia",
    texto: "El perfil muestra un patrón donde las selecciones de MÁS y MENOS generan una configuración que requiere análisis adicional. Esto puede ocurrir cuando la persona está experimentando disonancia entre lo que desea ser y lo que cree que es, o cuando factores situacionales (estrés, cambio laboral, conflicto) están distorsionando la autopercepción. Se recomienda una entrevista complementaria para profundizar.",
    color: "#d97706"
  }
};

// ============================================================================
// LÓGICA DE PROCESAMIENTO
// ============================================================================

function obtenerHoja() {
  if (!CONFIG.ID_PLANILLA || CONFIG.ID_PLANILLA.length < 20) {
    throw new Error("⚠️ ERROR CRÍTICO: Debes configurar el ID real de tu planilla en CONFIG.ID_PLANILLA");
  }
  try {
    var ss = SpreadsheetApp.openById(CONFIG.ID_PLANILLA);
    var sheet = ss.getSheetByName(CONFIG.NOMBRE_HOJA);
    if (!sheet) {
      throw new Error("⚠️ ERROR: No encontré la hoja llamada '" + CONFIG.NOMBRE_HOJA + "'");
    }
    return sheet;
  } catch(e) {
    throw new Error("⚠️ ERROR DE CONEXIÓN: " + e.message);
  }
}

function procesarDatosPendientes() {
  try {
    var sheet = obtenerHoja();
    var ultimaFila = sheet.getLastRow();
    
    for (var i = CONFIG.FILA_ENCABEZADOS + 1; i <= ultimaFila; i++) {
      var fila = sheet.getRange(i, 1, 1, 9).getValues()[0];
      
      if (fila[CONFIG.COLUMNAS.ESTADO] !== 'Enviado') {
        procesarYEnviarInforme(sheet, i, fila);
      }
    }
  } catch (e) { 
    Logger.log('ERROR EN PROCESAMIENTO: ' + e); 
  }
}

function procesarYEnviarInforme(sheet, numeroFila, fila) {
  try {
    Logger.log('=== PROCESANDO FILA ' + numeroFila + ' ===');
    
    var fecha = fila[CONFIG.COLUMNAS.FECHA];
    var usuarioAdmin = fila[CONFIG.COLUMNAS.USUARIO_ADMIN];
    var emailAdmin = fila[CONFIG.COLUMNAS.EMAIL_ADMIN];
    var nombre = fila[CONFIG.COLUMNAS.NOMBRE];
    var apellido = fila[CONFIG.COLUMNAS.APELLIDO];
    var correo = fila[CONFIG.COLUMNAS.CORREO];
    var respuestasString = String(fila[CONFIG.COLUMNAS.RESPUESTAS]);
    
    Logger.log('Nombre: ' + nombre + ', Apellido: ' + apellido + ', Correo: ' + correo);
    Logger.log('Admin: ' + usuarioAdmin + ', Email Admin: ' + emailAdmin);
    Logger.log('Respuestas (primeros 100 chars): ' + respuestasString.substring(0, 100));
    
    if (!correo || !respuestasString) {
       Logger.log('❌ ERROR: Datos incompletos');
       sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Datos incompletos');
       return;
    }
    
    // Parsear respuestas
    Logger.log('Parseando respuestas...');
    var datosParsed = parsearRespuestasDISC(respuestasString);
    
    if (!datosParsed) {
       Logger.log('❌ ERROR: Formato de respuestas inválido');
       sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Formato inválido');
       return;
    }
    
    Logger.log('✓ Respuestas parseadas correctamente (' + Object.keys(datosParsed.respuestas).length + ' ítems)');

    // Calcular resultados
    Logger.log('Calculando resultados...');
    var resultado = calcularResultadosDISC(datosParsed);
    
    if (!resultado) {
       Logger.log('❌ ERROR: Fallo en cálculo de resultados');
       sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: Cálculo');
       return;
    }
    
    Logger.log('✓ MÁS: DI=' + resultado.masDI + ' SC=' + resultado.masSC + ' | MENOS: DI=' + resultado.menosDI + ' SC=' + resultado.menosSC + ' | Perfil=' + resultado.tipoConsistencia);
    
    // Generar HTML del informe
    Logger.log('Generando HTML del informe...');
    var htmlInforme = generarInformeHTML(nombre, apellido, fecha, resultado);
    
    if (!htmlInforme || htmlInforme.length < 100) {
       Logger.log('❌ ERROR: HTML generado es inválido o vacío');
       sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: HTML inválido');
       return;
    }
    
    Logger.log('✓ HTML generado correctamente (tamaño: ' + htmlInforme.length + ' caracteres)');
    
    // Guardar resumen en columna H (no el HTML completo)
    sheet.getRange(numeroFila, CONFIG.COLUMNAS.INFORME + 1).setValue(
      '✅ Informe generado (' + htmlInforme.length + ' chars) | MÁS DI=' + resultado.masDI + ' SC=' + resultado.masSC + ' | MENOS DI=' + resultado.menosDI + ' SC=' + resultado.menosSC
    );
    Logger.log('✓ Resumen guardado en columna H');
    
    // Generar PDF
    var htmlParaPdf = limpiarImagenesParaPdf(htmlInforme);
    var pdfBlob = Utilities
      .newBlob(htmlParaPdf, 'text/html', 'informe-disc-' + nombre + '-' + apellido + '.html')
      .getAs(MimeType.PDF);
    pdfBlob.setName('Informe DISC - ' + nombre + ' ' + apellido + '.pdf');
    
    // Enviar email al evaluado
    if (correo) {
      Logger.log('Enviando email al evaluado: ' + correo);
      MailApp.sendEmail({
        to: correo,
        subject: CONFIG.EMAIL.ASUNTO,
        htmlBody: htmlInforme,
        name: CONFIG.EMAIL.REMITENTE,
        attachments: [pdfBlob]
      });
      Logger.log('✓ Email enviado al evaluado');
    }
    
    // Enviar email al admin
    if (emailAdmin) {
      Logger.log('Enviando email al admin: ' + emailAdmin);
      MailApp.sendEmail({
        to: emailAdmin,
        subject: '📊 [Admin] Informe DISC - ' + nombre + ' ' + apellido,
        htmlBody: htmlInforme,
        name: CONFIG.EMAIL.REMITENTE,
        attachments: [pdfBlob]
      });
      Logger.log('✓ Email enviado al admin');
    }
    
    // Marcar como enviado
    sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Enviado');
    Logger.log('✅ ¡PROCESO COMPLETADO EXITOSAMENTE PARA ' + correo + '!');
    
  } catch (error) {
    Logger.log('❌ ERROR CRÍTICO en fila ' + numeroFila + ': ' + error);
    Logger.log('Stack trace: ' + error.stack);
    sheet.getRange(numeroFila, CONFIG.COLUMNAS.ESTADO + 1).setValue('Error: ' + error.message.substring(0, 50));
  }
}

// ============================================================================
// PARSEAR RESPUESTAS DISC
// Formato: {PI: 0m 26s - 1;1, 2;1, ..., 28;1} {PII: 0m 23s - 29;1, 30;5, ..., 56;1}
// PI = Parte I (preguntas 1-14), PII = Parte II (preguntas 15-28)
// Ítems impares = MÁS, Ítems pares = MENOS
// Valores: 5 = D o I seleccionado, 1 = S o C seleccionado
// ============================================================================
function parsearRespuestasDISC(respuestasString) {
  try {
    var resultado = {
      tiempoParte1: "",
      tiempoParte2: "",
      respuestas: {} // { itemId: valor }
    };
    
    // Extraer PI (Parte I)
    var matchPI = respuestasString.match(/\{PI:\s*([^-]+)\s*-\s*([^}]+)\}/);
    if (matchPI) {
      resultado.tiempoParte1 = matchPI[1].trim();
      var pares = matchPI[2].split(',');
      pares.forEach(function(par) {
        var partes = par.trim().split(';');
        if (partes.length === 2) {
          var id = parseInt(partes[0].trim(), 10);
          var valor = parseInt(partes[1].trim(), 10);
          if (!isNaN(id) && !isNaN(valor)) {
            resultado.respuestas[id] = valor;
          }
        }
      });
    }
    
    // Extraer PII (Parte II)
    var matchPII = respuestasString.match(/\{PII:\s*([^-]+)\s*-\s*([^}]+)\}/);
    if (matchPII) {
      resultado.tiempoParte2 = matchPII[1].trim();
      var pares2 = matchPII[2].split(',');
      pares2.forEach(function(par) {
        var partes = par.trim().split(';');
        if (partes.length === 2) {
          var id = parseInt(partes[0].trim(), 10);
          var valor = parseInt(partes[1].trim(), 10);
          if (!isNaN(id) && !isNaN(valor)) {
            resultado.respuestas[id] = valor;
          }
        }
      });
    }
    
    Logger.log('Respuestas parseadas: ' + Object.keys(resultado.respuestas).length + ' ítems');
    return resultado;
    
  } catch (e) {
    Logger.log('Error parseando respuestas DISC: ' + e);
    return null;
  }
}

// ============================================================================
// CALCULAR RESULTADOS DISC
// ============================================================================
function calcularResultadosDISC(datosParsed) {
  var respuestas = datosParsed.respuestas;
  
  // Cada pregunta genera 2 ítems consecutivos:
  // Pregunta 1 → ítems 1(MÁS), 2(MENOS)
  // Pregunta 2 → ítems 3(MÁS), 4(MENOS)
  // ...
  // Pregunta 14 → ítems 27(MÁS), 28(MENOS) [Fin Parte I]
  // Pregunta 15 → ítems 29(MÁS), 30(MENOS) [Inicio Parte II]
  // ...
  // Pregunta 28 → ítems 55(MÁS), 56(MENOS)
  
  var masDI = 0;    // Veces que MÁS fue D/I (valor 5)
  var masSC = 0;    // Veces que MÁS fue S/C (valor 1)
  var menosDI = 0;  // Veces que MENOS fue D/I (valor 5)
  var menosSC = 0;  // Veces que MENOS fue S/C (valor 1)
  
  // Separar por partes
  var masDI_P1 = 0, masSC_P1 = 0, menosDI_P1 = 0, menosSC_P1 = 0;
  var masDI_P2 = 0, masSC_P2 = 0, menosDI_P2 = 0, menosSC_P2 = 0;
  
  var preguntasRespondidas = 0;
  var detallePreguntas = [];
  
  for (var q = 1; q <= 28; q++) {
    var idMas, idMenos;
    
    if (q <= 14) {
      // Parte I: ítems 1-28
      idMas = (q - 1) * 2 + 1;
      idMenos = (q - 1) * 2 + 2;
    } else {
      // Parte II: ítems 29-56
      idMas = 28 + (q - 15) * 2 + 1;
      idMenos = 28 + (q - 15) * 2 + 2;
    }
    
    var valMas = respuestas[idMas];
    var valMenos = respuestas[idMenos];
    
    if (valMas !== undefined && valMenos !== undefined) {
      preguntasRespondidas++;
      
      // Conteos globales
      if (valMas === 5) masDI++;
      else masSC++;
      if (valMenos === 5) menosDI++;
      else menosSC++;
      
      // Conteos por parte
      if (q <= 14) {
        if (valMas === 5) masDI_P1++; else masSC_P1++;
        if (valMenos === 5) menosDI_P1++; else menosSC_P1++;
      } else {
        if (valMas === 5) masDI_P2++; else masSC_P2++;
        if (valMenos === 5) menosDI_P2++; else menosSC_P2++;
      }
      
      var grupo = GRUPOS_DISC[q];
      detallePreguntas.push({
        numero: q,
        parte: q <= 14 ? "I" : "II",
        textoD: grupo ? grupo.D : "",
        textoI: grupo ? grupo.I : "",
        textoS: grupo ? grupo.S : "",
        textoC: grupo ? grupo.C : "",
        valorMas: valMas,
        valorMenos: valMenos,
        masGrupo: valMas === 5 ? "D/I" : "S/C",
        menosGrupo: valMenos === 5 ? "D/I" : "S/C"
      });
    }
  }
  
  // Puntuaciones netas
  var netoDI = masDI - menosDI;
  var netoSC = masSC - menosSC;
  
  // Porcentajes sobre 28
  var pctMasDI = Math.round((masDI / 28) * 100);
  var pctMasSC = Math.round((masSC / 28) * 100);
  var pctMenosDI = Math.round((menosDI / 28) * 100);
  var pctMenosSC = Math.round((menosSC / 28) * 100);
  
  // Niveles
  var nivelMasDI = obtenerNivel(pctMasDI);
  var nivelMasSC = obtenerNivel(pctMasSC);
  var nivelMenosDI = obtenerNivel(pctMenosDI);
  var nivelMenosSC = obtenerNivel(pctMenosSC);
  
  // Determinar tipo de consistencia
  var tipoConsistencia = determinarConsistencia(masDI, masSC, menosDI, menosSC);
  
  return {
    masDI: masDI,
    masSC: masSC,
    menosDI: menosDI,
    menosSC: menosSC,
    netoDI: netoDI,
    netoSC: netoSC,
    pctMasDI: pctMasDI,
    pctMasSC: pctMasSC,
    pctMenosDI: pctMenosDI,
    pctMenosSC: pctMenosSC,
    nivelMasDI: nivelMasDI,
    nivelMasSC: nivelMasSC,
    nivelMenosDI: nivelMenosDI,
    nivelMenosSC: nivelMenosSC,
    masDI_P1: masDI_P1, masSC_P1: masSC_P1,
    menosDI_P1: menosDI_P1, menosSC_P1: menosSC_P1,
    masDI_P2: masDI_P2, masSC_P2: masSC_P2,
    menosDI_P2: menosDI_P2, menosSC_P2: menosSC_P2,
    tipoConsistencia: tipoConsistencia,
    textoConsistencia: TEXTOS_CONSISTENCIA[tipoConsistencia],
    detallePreguntas: detallePreguntas,
    preguntasRespondidas: preguntasRespondidas,
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
  // Perfil consistente DI: MÁS=DI alto Y MENOS=SC alto (rechaza lo opuesto)
  if (masDI >= 18 && menosSC >= 18) return "consistente_DI";
  // Perfil consistente SC: MÁS=SC alto Y MENOS=DI alto
  if (masSC >= 18 && menosDI >= 18) return "consistente_SC";
  // Mixto: no hay patrón claro
  var diffMas = Math.abs(masDI - masSC);
  var diffMenos = Math.abs(menosDI - menosSC);
  if (diffMas <= 8 && diffMenos <= 8) return "mixto";
  // Tendencia DI
  if (masDI > masSC && menosSC > menosDI) return "consistente_DI";
  // Tendencia SC
  if (masSC > masDI && menosDI > menosSC) return "consistente_SC";
  // Contradictorio: MÁS y MENOS apuntan en la misma dirección
  if ((masDI > masSC && menosDI > menosSC) || (masSC > masDI && menosSC > menosDI)) return "contradictorio";
  return "mixto";
}

// ============================================================================
// HELPER: LIMPIAR IMÁGENES PARA PDF
// ============================================================================
function limpiarImagenesParaPdf(html) {
  return html.replace(/<img[^>]*>/gi, '');
}

// ============================================================================
// GENERADOR HTML DEL INFORME
// ============================================================================
function generarInformeHTML(nombre, apellido, fecha, resultado) {
  try {
    Logger.log('=== GENERANDO HTML ===');
    
    var template = HtmlService.createTemplateFromFile('plantilla');
    
    // Datos personales
    template.nombre = nombre;
    template.apellido = apellido;
    template.fecha = fecha;
    template.logoUrl = CONFIG.EMAIL.LOGO;
    
    // Resultados principales
    template.masDI = resultado.masDI;
    template.masSC = resultado.masSC;
    template.menosDI = resultado.menosDI;
    template.menosSC = resultado.menosSC;
    template.netoDI = resultado.netoDI;
    template.netoSC = resultado.netoSC;
    template.pctMasDI = resultado.pctMasDI;
    template.pctMasSC = resultado.pctMasSC;
    template.pctMenosDI = resultado.pctMenosDI;
    template.pctMenosSC = resultado.pctMenosSC;
    
    // Niveles
    template.nivelMasDI = resultado.nivelMasDI;
    template.nivelMasSC = resultado.nivelMasSC;
    template.nivelMenosDI = resultado.nivelMenosDI;
    template.nivelMenosSC = resultado.nivelMenosSC;
    template.textoNivelMasDI = TEXTOS_NIVEL[resultado.nivelMasDI];
    template.textoNivelMasSC = TEXTOS_NIVEL[resultado.nivelMasSC];
    template.textoNivelMenosDI = TEXTOS_NIVEL[resultado.nivelMenosDI];
    template.textoNivelMenosSC = TEXTOS_NIVEL[resultado.nivelMenosSC];
    
    // Por partes
    template.masDI_P1 = resultado.masDI_P1;
    template.masSC_P1 = resultado.masSC_P1;
    template.menosDI_P1 = resultado.menosDI_P1;
    template.menosSC_P1 = resultado.menosSC_P1;
    template.masDI_P2 = resultado.masDI_P2;
    template.masSC_P2 = resultado.masSC_P2;
    template.menosDI_P2 = resultado.menosDI_P2;
    template.menosSC_P2 = resultado.menosSC_P2;
    
    // Consistencia
    template.tipoConsistencia = resultado.tipoConsistencia;
    template.textoConsistencia = resultado.textoConsistencia;
    
    // Perfiles DISC
    template.perfilesDISC = PERFILES_DISC;
    
    // Detalle
    template.detallePreguntas = resultado.detallePreguntas;
    template.preguntasRespondidas = resultado.preguntasRespondidas;
    template.tiempoParte1 = resultado.tiempoParte1;
    template.tiempoParte2 = resultado.tiempoParte2;
    
    // Gráfico de barras
    var chartConfig = {
      type: 'bar',
      data: {
        labels: ['MÁS D/I', 'MÁS S/C', 'MENOS D/I', 'MENOS S/C'],
        datasets: [{
          label: 'Frecuencia (de 28)',
          data: [resultado.masDI, resultado.masSC, resultado.menosDI, resultado.menosSC],
          backgroundColor: ['#dc2626', '#059669', '#ea580c', '#2563eb'],
          borderWidth: 0,
          barThickness: 50
        }]
      },
      options: {
        legend: { display: false },
        scales: { yAxes: [{ ticks: { beginAtZero: true, max: 28, stepSize: 4 } }] },
        plugins: { datalabels: { display: true, color: '#fff', font: { weight: 'bold', size: 16 } } }
      }
    };
    template.chartUrl = 'https://quickchart.io/chart?w=500&h=300&c=' + encodeURIComponent(JSON.stringify(chartConfig));
    
    // Gráfico radar
    var chartRadar = {
      type: 'radar',
      data: {
        labels: ['MÁS D/I', 'MÁS S/C', 'MENOS D/I', 'MENOS S/C'],
        datasets: [{
          label: '%',
          data: [resultado.pctMasDI, resultado.pctMasSC, resultado.pctMenosDI, resultado.pctMenosSC],
          backgroundColor: 'rgba(11, 74, 110, 0.2)',
          borderColor: '#0b4a6e',
          pointBackgroundColor: '#0b4a6e',
          borderWidth: 2
        }]
      },
      options: { legend: { display: false }, scale: { ticks: { beginAtZero: true, max: 100 } } }
    };
    template.chartRadarUrl = 'https://quickchart.io/chart?w=400&h=400&c=' + encodeURIComponent(JSON.stringify(chartRadar));
    
    Logger.log('✓ Datos inyectados en template');
    
    var html = template.evaluate().getContent();
    Logger.log('✓ HTML evaluado correctamente (longitud: ' + html.length + ')');
    
    return html;
    
  } catch(error) {
    Logger.log('❌ ERROR al generar HTML: ' + error);
    Logger.log('Stack: ' + error.stack);
    throw error;
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function instalarTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('procesarDatosPendientes').timeBased().everyHours(1).create();
  Logger.log('✅ Trigger instalado correctamente - Se ejecutará cada 1 hora');
}

function procesarFilaManual() {
  var sheet = obtenerHoja();
  var fila;
  
  if (SpreadsheetApp.getActiveSpreadsheet()) {
    var numFila = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getRow();
    fila = sheet.getRange(numFila, 1, 1, 9).getValues()[0];
    procesarYEnviarInforme(sheet, numFila, fila);
    SpreadsheetApp.getUi().alert("✅ Informe DISC procesado correctamente");
  } else {
    var ultimaFila = sheet.getLastRow();
    fila = sheet.getRange(ultimaFila, 1, 1, 9).getValues()[0];
    procesarYEnviarInforme(sheet, ultimaFila, fila);
    Logger.log("✅ Procesada última fila en modo standalone");
  }
}

function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('📊 Test DISC')
      .addItem('Instalar Automático', 'instalarTrigger')
      .addItem('Procesar Fila Seleccionada', 'procesarFilaManual')
      .addItem('🔍 Diagnóstico del Sistema', 'diagnosticoCompleto')
      .addToUi();
  } catch(e) { 
    Logger.log('Menú no disponible en modo standalone'); 
  }
}

// ============================================================================
// FUNCIÓN DE DIAGNÓSTICO COMPLETO
// ============================================================================
function diagnosticoCompleto() {
  Logger.log('═══════════════════════════════════════');
  Logger.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO - DISC');
  Logger.log('═══════════════════════════════════════');
  
  try {
    Logger.log('\n1️⃣ Verificando conexión a Google Sheets...');
    var sheet = obtenerHoja();
    Logger.log('✓ Conexión exitosa a la hoja: ' + sheet.getName());
    Logger.log('   ID Planilla: ' + CONFIG.ID_PLANILLA);
    
    Logger.log('\n2️⃣ Verificando estructura de columnas...');
    var encabezados = sheet.getRange(1, 1, 1, 9).getValues()[0];
    Logger.log('   Columnas encontradas:');
    encabezados.forEach(function(col, idx) {
      Logger.log('   - Columna ' + String.fromCharCode(65 + idx) + ': ' + col);
    });
    
    Logger.log('\n3️⃣ Buscando filas con datos...');
    var ultimaFila = sheet.getLastRow();
    Logger.log('   Última fila con datos: ' + ultimaFila);
    
    if (ultimaFila > 1) {
      Logger.log('\n4️⃣ Analizando primera fila de datos (fila 2)...');
      var fila = sheet.getRange(2, 1, 1, 9).getValues()[0];
      Logger.log('   Fecha: ' + fila[0]);
      Logger.log('   Usuario Admin: ' + fila[1]);
      Logger.log('   Email Admin: ' + fila[2]);
      Logger.log('   Nombre: ' + fila[3]);
      Logger.log('   Apellido: ' + fila[4]);
      Logger.log('   Correo: ' + fila[5]);
      Logger.log('   Respuestas (primeros 80 chars): ' + String(fila[6]).substring(0, 80) + '...');
      Logger.log('   Informe: ' + (fila[7] ? 'Tiene contenido' : 'Vacío'));
      Logger.log('   Estado: ' + fila[8]);
      
      Logger.log('\n5️⃣ Probando parseo de respuestas...');
      var datosParsed = parsearRespuestasDISC(String(fila[6]));
      if (datosParsed) {
        Logger.log('   ✓ Respuestas parseadas correctamente');
        Logger.log('   Total de ítems: ' + Object.keys(datosParsed.respuestas).length);
        Logger.log('   Tiempo Parte I: ' + datosParsed.tiempoParte1);
        Logger.log('   Tiempo Parte II: ' + datosParsed.tiempoParte2);
        
        Logger.log('\n6️⃣ Probando cálculo de resultados...');
        var resultado = calcularResultadosDISC(datosParsed);
        if (resultado) {
          Logger.log('   ✓ Resultados calculados correctamente');
          Logger.log('   MÁS D/I: ' + resultado.masDI + ' (' + resultado.pctMasDI + '%)');
          Logger.log('   MÁS S/C: ' + resultado.masSC + ' (' + resultado.pctMasSC + '%)');
          Logger.log('   MENOS D/I: ' + resultado.menosDI + ' (' + resultado.pctMenosDI + '%)');
          Logger.log('   MENOS S/C: ' + resultado.menosSC + ' (' + resultado.pctMenosSC + '%)');
          Logger.log('   Neto D/I: ' + resultado.netoDI);
          Logger.log('   Neto S/C: ' + resultado.netoSC);
          Logger.log('   Consistencia: ' + resultado.tipoConsistencia);
          Logger.log('   Preguntas respondidas: ' + resultado.preguntasRespondidas);
        }
        
        if (resultado) {
          Logger.log('\n7️⃣ Probando generación de HTML...');
          try {
            var html = generarInformeHTML(fila[3], fila[4], fila[0], resultado);
            if (html && html.length > 0) {
              Logger.log('   ✓ HTML generado correctamente');
              Logger.log('   Tamaño del HTML: ' + html.length + ' caracteres');
            }
          } catch(e) {
            Logger.log('   ❌ Error al generar HTML: ' + e);
          }
        }
      } else {
        Logger.log('   ❌ Error al parsear respuestas');
      }
    } else {
      Logger.log('   ⚠️ No hay filas de datos para probar');
    }
    
    Logger.log('\n═══════════════════════════════════════');
    Logger.log('✅ DIAGNÓSTICO COMPLETADO');
    Logger.log('═══════════════════════════════════════');
    
    if (SpreadsheetApp.getActiveSpreadsheet()) {
      SpreadsheetApp.getUi().alert('✅ Diagnóstico completado\n\nRevisa los logs: Ver → Registros de ejecución');
    }
    
  } catch(error) {
    Logger.log('\n❌ ERROR DURANTE DIAGNÓSTICO: ' + error);
    Logger.log('Stack: ' + error.stack);
    if (SpreadsheetApp.getActiveSpreadsheet()) {
      SpreadsheetApp.getUi().alert('❌ Error: ' + error.message);
    }
  }
}