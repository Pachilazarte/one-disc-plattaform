import { COLORES, PAGE_CONFIG, TIPOGRAFIA } from './pdfConfig.js';
import { agregarEncabezado, nuevaPagina } from './pdfConfig.js';
import {
    dibujarCuadro, dibujarTitulo, dibujarSubtitulo,
    dibujarTexto, dibujarLista, calcularValoresDISC,
    heightOfText, heightOfList, ensureSpace,
    canvasToCroppedPng, lineHeightMm
} from './pdfUtils.js';
import {
    dibujarTablaDetalle, dibujarTablaComparativa,
    dibujarTablaPuntuaciones, dibujarGraficoBarrasManual
} from './pdfTables.js';
import {
    iconBulb, iconVerticalAxis, iconHorizontalAxis,
    drawIconLabel, iconArrow, iconInfo, withGState
} from './pdfEmoticons.js';

// ---------------------------------------------------------------------------
// PORTADA
// ---------------------------------------------------------------------------
export function generarPortada(doc, data, resultado, nombreCompleto, fecha) {
    nuevaPagina(doc, nombreCompleto);

    for (let i = 0; i < 100; i++) {
        const alpha = 0.02 + (i / 100) * 0.08;
        doc.saveGraphicsState();
        doc.setFillColor(...COLORES.primario);
        doc.setGState(new doc.GState({ opacity: alpha }));
        doc.rect(0, i * 2.97, 210, 2.97, 'F');
        doc.restoreGraphicsState();
    }

    doc.setFillColor(...COLORES.secundario);
    doc.circle(105, 60, 35, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(48);
    doc.text('DISC', 105, 67, { align: 'center' });

    doc.setTextColor(...COLORES.texto);
    doc.setFontSize(32);
    doc.text('Informe de Perfil', 105, 120, { align: 'center' });
    doc.setFontSize(28);
    doc.text('Conductual Profesional', 105, 135, { align: 'center' });

    dibujarCuadro(doc, 30, 155, 150, 45, COLORES.primario, 0.05);
    doc.setFillColor(...COLORES.secundario);
    doc.circle(45, 167, 8, 'F');

    const initials = (data.Nombre || '').charAt(0) + (data.Apellido || '').charAt(0);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(initials.toUpperCase(), 45, 170, { align: 'center' });

    doc.setTextColor(...COLORES.texto);
    doc.setFontSize(18);
    doc.text(nombreCompleto, 60, 168);

    doc.setTextColor(...COLORES.textoClaro);
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.text(data.Correo || '', 60, 175);

    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.setTextColor(...COLORES.texto);
    doc.text(`Fecha de evaluación: ${fecha}`, 35, 188);
    doc.text(`Tiempo Parte I: ${resultado.tiempoParte1 || '—'}`, 35, 194);
    doc.text(`Tiempo Parte II: ${resultado.tiempoParte2 || '—'}`, 120, 194);

    doc.setTextColor(...COLORES.textoClaro);
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.text('Basado en el modelo de William Moulton Marston — Método Cleaver', 105, 250, { align: 'center' });
    doc.setFontSize(TIPOGRAFIA.micro);
    doc.text('© 2026 Escencial Consultora', 105, 260, { align: 'center' });
}

// ---------------------------------------------------------------------------
// ÍNDICE NAVEGABLE
// ---------------------------------------------------------------------------
export function generarIndice(doc, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  let y = 35;
  dibujarTitulo(doc, 'Índice', y);
  y += 15;

  const secciones = [
    { titulo: 'Introducción al Modelo DISC', pagina: 3 },
    { titulo: 'Historia y Fundamentos', pagina: 4 },
    { titulo: 'Ejes y Dimensiones del DISC', pagina: 5 },
    { titulo: 'Los 8 Estilos Conductuales de la Rueda DISC', pagina: 7 },
    { titulo: 'Dimensión D - Dominancia', pagina: 15 },
    { titulo: 'Dimensión I - Influencia', pagina: 17 },
    { titulo: 'Dimensión S - Estabilidad', pagina: 19 },
    { titulo: 'Dimensión C - Cumplimiento', pagina: 21 },
    { titulo: 'Aplicaciones del Modelo DISC', pagina: 23 },
    { titulo: 'Consideraciones Importantes', pagina: 25 },
    { titulo: 'Resumen de Resultados', pagina: 26 },
    { titulo: 'Gráfico de Barras', pagina: 27 },
    { titulo: 'Rueda Success Insights', pagina: 28 },
    { titulo: 'Análisis Interpretativo', pagina: 30 },
    { titulo: 'Índice de Consistencia', pagina: 31 },
    { titulo: 'Comparativa Parte I vs Parte II', pagina: 32 },
    { titulo: 'Implicaciones Prácticas', pagina: 33 },
    { titulo: 'Detalle Pregunta por Pregunta', pagina: 34 },
  ];

  const LINE_HEIGHT = 7.5;
  const X_TITULO = 20;
  const X_PAGINA = 190;

  secciones.forEach((sec) => {
    // Verificar espacio antes de dibujar
    y = ensureSpace(y, LINE_HEIGHT + 2, () => {
      nuevaPagina(doc, nombreCompleto);
      agregarEncabezado(doc);
      dibujarTitulo(doc, 'Índice (continuación)', 35);
      y = 35 + 15;
    });

    // Título de la sección
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.cuerpo);
    doc.setTextColor(...COLORES.texto);
    doc.text(String(sec.titulo), X_TITULO, y);

    // Línea punteada
    const tituloWidth = doc.getTextWidth(sec.titulo);
    const paginaStr = String(sec.pagina);
    const paginaWidth = doc.getTextWidth(paginaStr);
    const dotsStart = X_TITULO + tituloWidth + 3;
    const dotsEnd = X_PAGINA - paginaWidth - 3;

    doc.setDrawColor(...COLORES.textoClaro);
    doc.setLineWidth(0.3);
    doc.setLineDash([1, 2]);
    doc.line(dotsStart, y - 1, dotsEnd, y - 1);
    doc.setLineDash([]);

    // Número de página
    doc.text(paginaStr, X_PAGINA, y, { align: 'right' });

    // Link clickable sobre TODA la fila
    doc.link(X_TITULO - 2, y - 5, X_PAGINA - X_TITULO + 4, LINE_HEIGHT, {
      pageNumber: sec.pagina
    });

    y += LINE_HEIGHT;
  });
}

// ---------------------------------------------------------------------------
// INTRODUCCIÓN AL DISC
// ---------------------------------------------------------------------------
export function generarIntroduccion(doc, nombreCompleto) {
    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);

    const X_LEFT = 15;
    const X_TEXT = 20;
    const CONTENT_W = 180;
    const BOX_W = 180;
    const PAD_X = 6;
    const PAD_Y = 7;

    let y = 35;
    dibujarTitulo(doc, 'Introducción al Modelo DISC', y);
    y += 14;

    // Bloque ¿Qué es el DISC?
    const tituloQueEs = '¿Qué es el DISC?';
    const p1 = 'El DISC es una herramienta de evaluación del comportamiento que permite comprender los patrones conductuales de las personas en diferentes situaciones. No mide inteligencia, aptitudes, salud mental ni valores, sino tendencias naturales de comportamiento.';
    const p2 = 'Este modelo se basa en la premisa de que el comportamiento humano es observable, medible y predecible. Al comprender estos patrones, las personas pueden mejorar su autoconocimiento, comunicación y efectividad en el trabajo y en la vida personal.';

    const hTitulo = 7;
    const hP1 = heightOfText(doc, p1, BOX_W - (PAD_X * 2), TIPOGRAFIA.cuerpo, 'normal');
    const hP2 = heightOfText(doc, p2, BOX_W - (PAD_X * 2), TIPOGRAFIA.cuerpo, 'normal');
    const boxH = PAD_Y + hTitulo + 4 + hP1 + 4 + hP2 + PAD_Y;

    y = ensureSpace(y, boxH + 6, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarCuadro(doc, X_LEFT, y, BOX_W, boxH, COLORES.secundario, 0.05);

    let yIn = y + PAD_Y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo);
    doc.setTextColor(...COLORES.primario);
    doc.text(tituloQueEs, X_LEFT + PAD_X, yIn);
    yIn += 8;

    yIn = dibujarTexto(doc, p1, X_LEFT + PAD_X, yIn, BOX_W - (PAD_X * 2), TIPOGRAFIA.cuerpo);
    yIn += 4;
    yIn = dibujarTexto(doc, p2, X_LEFT + PAD_X, yIn, BOX_W - (PAD_X * 2), TIPOGRAFIA.cuerpo);
    y += boxH + 10;

    // ¿Para qué sirve?
    y = ensureSpace(y, 12, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarSubtitulo(doc, '¿Para qué sirve el DISC?', y, TIPOGRAFIA.subtitulo);
    y += 8;

    const listaSirve = [
        'Mejorar el autoconocimiento y comprensión de las propias fortalezas y áreas de desarrollo',
        'Optimizar la comunicación interpersonal adaptándose al estilo del interlocutor',
        'Formar equipos de trabajo equilibrados y complementarios',
        'Desarrollar estrategias de liderazgo más efectivas',
        'Resolver conflictos comprendiendo diferentes perspectivas',
        'Seleccionar y ubicar personas en roles que aprovechen sus fortalezas naturales',
        'Diseñar programas de capacitación personalizados',
        'Mejorar las relaciones en el ámbito personal y profesional',
    ];

    const hListaSirve = heightOfList(doc, listaSirve, CONTENT_W - 10, TIPOGRAFIA.lista, 1.5);
    y = ensureSpace(y, hListaSirve + 8, () => {
        nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc);
        dibujarSubtitulo(doc, '¿Para qué sirve el DISC?', 35, TIPOGRAFIA.subtitulo);
        y = 35 + 8;
    });
    y = dibujarLista(doc, listaSirve, X_TEXT, y, CONTENT_W, TIPOGRAFIA.lista, 1.5);
    y += 10;

    // ¿Qué NO es?
    y = ensureSpace(y, 12, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarSubtitulo(doc, '¿Qué NO es el DISC?', y, TIPOGRAFIA.subtitulo);
    y += 8;

    const listaNoEs = [
        'No es un test de inteligencia ni mide capacidades cognitivas',
        'No es una evaluación psicológica clínica ni diagnostica trastornos',
        'No mide valores, creencias o motivaciones intrínsecas',
        'No es inmutable: el comportamiento puede desarrollarse y adaptarse',
        'No clasifica a las personas en categorías rígidas o estereotipos',
        'No predice el éxito o fracaso en un rol específico por sí solo',
    ];

    const hListaNoEs = heightOfList(doc, listaNoEs, CONTENT_W - 10, TIPOGRAFIA.lista, 1.5);
    y = ensureSpace(y, hListaNoEs + 8, () => {
        nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc);
        dibujarSubtitulo(doc, '¿Qué NO es el DISC?', 35, TIPOGRAFIA.subtitulo);
        y = 35 + 8;
    });
    dibujarLista(doc, listaNoEs, X_TEXT, y, CONTENT_W, TIPOGRAFIA.lista, 1.5);
}

// ---------------------------------------------------------------------------
// HISTORIA Y FUNDAMENTOS
// ---------------------------------------------------------------------------
export function generarHistoria(doc, nombreCompleto) {
    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);

    const X_LEFT = 15;
    const BOX_W = 180;
    const PAD_X = 6;
    const PAD_Y = 7;
    const X_IN = X_LEFT + PAD_X;
    const W_IN = BOX_W - PAD_X * 2;

    let y = 35;
    dibujarTitulo(doc, 'Historia y Fundamentos del DISC', y);
    y += 14;

    // Bloque Marston
    const marstonTitle = 'William Moulton Marston (1893-1947)';
    const marstonP1 = 'El psicólogo estadounidense William Moulton Marston desarrolló la teoría DISC en 1928, publicada en su obra "Emotions of Normal People". Marston también es conocido por inventar el polígrafo (detector de mentiras) y por crear el personaje de Wonder Woman.';
    const marstonP2 = 'Marston propuso que las emociones de las personas normales (no patológicas) se derivan de cuatro respuestas primarias al entorno: Dominancia, Influencia, Estabilidad y Cumplimiento. Estas respuestas están determinadas por la percepción del ambiente (favorable vs. hostil) y la respuesta individual (activa vs. pasiva).';

    const hP1 = heightOfText(doc, marstonP1, W_IN, TIPOGRAFIA.cuerpo, 'normal');
    const hP2 = heightOfText(doc, marstonP2, W_IN, TIPOGRAFIA.cuerpo, 'normal');
    const marstonBoxH = PAD_Y + 8 + 4 + hP1 + 4 + hP2 + PAD_Y;

    y = ensureSpace(y, marstonBoxH + 8, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarCuadro(doc, X_LEFT, y, BOX_W, marstonBoxH, COLORES.primario, 0.05);

    let yIn = y + PAD_Y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo);
    doc.setTextColor(...COLORES.primario);
    doc.text(marstonTitle, X_IN, yIn);
    yIn += 8;

    yIn = dibujarTexto(doc, marstonP1, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
    yIn += 4;
    yIn = dibujarTexto(doc, marstonP2, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
    y += marstonBoxH + 10;

    // Método Cleaver
    y = ensureSpace(y, 25, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarSubtitulo(doc, 'El Método Cleaver', y, TIPOGRAFIA.subtitulo);
    y += 8;
    y = dibujarTexto(doc, 'En la década de 1950, Walter V. Clarke desarrolló el primer instrumento de evaluación DISC basado en la teoría de Marston. Posteriormente, John P. Cleaver creó el método "Self Description" utilizado en este informe, que presenta 28 grupos de cuatro características conductuales, permitiendo identificar tanto el estilo natural como el adaptado.', X_LEFT, y, BOX_W, TIPOGRAFIA.cuerpo);
    y += 10;

    // Validación
    y = ensureSpace(y, 25, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarSubtitulo(doc, 'Validación Científica', y, TIPOGRAFIA.subtitulo);
    y += 8;
    y = dibujarTexto(doc, 'El modelo DISC ha sido validado a través de décadas de investigación y millones de aplicaciones en todo el mundo. Estudios han demostrado su fiabilidad test-retest y su validez predictiva en contextos laborales. Es utilizado por más del 70% de las empresas Fortune 500 y ha sido aplicado en más de 70 países.', X_LEFT, y, BOX_W, TIPOGRAFIA.cuerpo);
    y += 12;

    // Principios
    const principiosTitle = 'Principios Fundamentales del DISC';
    const principiosItems = [
        'El comportamiento es observable y medible de manera objetiva',
        'Las personas tienen tendencias conductuales predecibles y consistentes',
        'No existen estilos "buenos" o "malos", cada uno tiene fortalezas únicas',
        'El contexto influye: las personas adaptan su comportamiento según la situación',
        'El autoconocimiento es el primer paso hacia el desarrollo personal',
        'Comprender a otros mejora la efectividad de la comunicación y colaboración',
    ];

    const hList = heightOfList(doc, principiosItems, W_IN - 5, TIPOGRAFIA.lista, 1.5);
    const principiosBoxH = PAD_Y + 8 + 5 + hList + PAD_Y;

    y = ensureSpace(y, principiosBoxH + 6, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
    dibujarCuadro(doc, X_LEFT, y, BOX_W, principiosBoxH, COLORES.acento, 0.10);

    let yP = y + PAD_Y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo);
    doc.setTextColor(...COLORES.acento);
    doc.text(principiosTitle, X_IN, yP);
    yP += 8;
    dibujarLista(doc, principiosItems, X_IN, yP, W_IN, TIPOGRAFIA.lista, 1.5);
}

// ---------------------------------------------------------------------------
// LOS DOS EJES FUNDAMENTALES
// ---------------------------------------------------------------------------
export function generarEjes(doc, nombreCompleto) {
  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;
  const LIST_X = X_IN + 5;
  const LIST_W = W_IN - 5;

  const GAP_AFTER_H1 = 9;
  const GAP_AFTER_DESC = 6;
  const GAP_AFTER_SUB = 8;
  const GAP_BETWEEN_BLOCKS = 6;

  function newPage() { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); }

  // PÁGINA 1: EJE VERTICAL
  newPage();
  let y = 35;
  dibujarTitulo(doc, 'Los Dos Ejes Fundamentales del Comportamiento', y);
  y += 14;

  const intro = 'El modelo DISC se estructura en dos ejes independientes que, al combinarse, generan los cuatro estilos fundamentales y sus ocho variantes. Cada persona tiene grados variables en ambos ejes, lo que determina su perfil conductual único.';
  y = dibujarTexto(doc, intro, X_LEFT, y, BOX_W, TIPOGRAFIA.cuerpo);
  y += 10;

  const ejeV_title = 'EJE VERTICAL: Ritmo de Respuesta';
  const ejeV_desc = 'Mide la velocidad con la que las personas procesan información y toman acción';
  const acel_title = 'RITMO ACELERADO (D - I)';
  const acel_items = [
    'Actúan con rapidez y sentido de urgencia',
    'Toman decisiones ágiles, a veces sin analizar todos los detalles',
    'Se aburren con tareas lentas o repetitivas',
    'Prefieren ambientes dinámicos con cambios frecuentes',
    'Se impacientan con procesos burocráticos extensos',
    'Valoran la eficiencia y los resultados inmediatos',
  ];
  const paus_title = 'RITMO PAUSADO (S - C)';
  const paus_items = [
    'Se toman el tiempo necesario para reflexionar antes de actuar',
    'Analizan la información detalladamente antes de decidir',
    'Prefieren ambientes estables y predecibles',
    'Valoran la consistencia y la calidad sobre la velocidad',
    'Necesitan tiempo para adaptarse a cambios significativos',
    'Mantienen la calma incluso bajo presión',
  ];

  const h_ejeV_desc = heightOfText(doc, ejeV_desc, W_IN, TIPOGRAFIA.secundario, 'normal');
  const h_acel_list = heightOfList(doc, acel_items, LIST_W - 5, TIPOGRAFIA.lista, 1.5);
  const h_paus_list = heightOfList(doc, paus_items, LIST_W - 5, TIPOGRAFIA.lista, 1.5);

  const ejeV_boxH = PAD_Y + GAP_AFTER_H1 + h_ejeV_desc + GAP_AFTER_DESC + GAP_AFTER_SUB + h_acel_list + GAP_BETWEEN_BLOCKS + GAP_AFTER_SUB + h_paus_list + PAD_Y;

  y = ensureSpace(y, ejeV_boxH + 6, () => newPage());
  dibujarCuadro(doc, X_LEFT, y, BOX_W, ejeV_boxH, COLORES.D, 0.10);

  let yIn = y + PAD_Y;
  drawIconLabel(doc, { icon: iconVerticalAxis, x: X_IN, y: yIn, color: COLORES.D, size: 7, text: ejeV_title, fontSize: TIPOGRAFIA.subtitulo, fontStyle: 'bold' });
  yIn += GAP_AFTER_H1;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(TIPOGRAFIA.secundario);
  doc.setTextColor(...COLORES.textoClaro);
  doc.text(doc.splitTextToSize(ejeV_desc, W_IN), X_IN, yIn);
  yIn += h_ejeV_desc + GAP_AFTER_DESC;

  drawIconLabel(doc, { icon: (d, x, y, c, s) => iconArrow(d, 'up', x, y, c, s), x: X_IN, y: yIn, color: COLORES.D, size: 5.5, text: acel_title, fontSize: TIPOGRAFIA.etiqueta, fontStyle: 'bold' });
  yIn += GAP_AFTER_SUB;
  yIn = dibujarLista(doc, acel_items, LIST_X, yIn, LIST_W, TIPOGRAFIA.lista, 1.5);
  yIn += GAP_BETWEEN_BLOCKS;

  drawIconLabel(doc, { icon: (d, x, y, c, s) => iconArrow(d, 'down', x, y, c, s), x: X_IN, y: yIn, color: COLORES.S, size: 5.5, text: paus_title, fontSize: TIPOGRAFIA.etiqueta, fontStyle: 'bold' });
  yIn += GAP_AFTER_SUB;
  dibujarLista(doc, paus_items, LIST_X, yIn, LIST_W, TIPOGRAFIA.lista, 1.5);

  // PÁGINA 2: EJE HORIZONTAL
  newPage();
  y = 35;

  const ejeH_title = 'EJE HORIZONTAL: Orientación Focal';
  const ejeH_desc = 'Define si la persona se enfoca principalmente en personas o en tareas y procesos';
  const pers_title = 'ORIENTACIÓN A LAS PERSONAS (I - S)';
  const pers_items = [
    'Priorizan las relaciones interpersonales y el bienestar del equipo',
    'Disfrutan del contacto social y la colaboración',
    'Se motivan por el reconocimiento y la aprobación de otros',
    'Buscan armonía y evitan conflictos cuando es posible',
    'Son empáticos y consideran los sentimientos de los demás',
    'Prefieren trabajar en equipo antes que solos',
    'Valoran la comunicación abierta y el ambiente positivo',
  ];
  const tarea_title = 'ORIENTACIÓN A LAS TAREAS (D - C)';
  const tarea_items = [
    'Priorizan resultados, objetivos y la ejecución eficiente',
    'Se enfocan en "qué hay que hacer" más que en "quién lo hace"',
    'Se motivan por logros concretos y metas alcanzadas',
    'Valoran la competencia técnica y la calidad del trabajo',
    'Toman decisiones basadas en datos y hechos objetivos',
    'Prefieren trabajar de manera independiente cuando es productivo',
    'Establecen límites claros entre lo personal y lo profesional',
  ];

  const h_ejeH_desc = heightOfText(doc, ejeH_desc, W_IN, TIPOGRAFIA.secundario, 'normal');
  const h_pers_list = heightOfList(doc, pers_items, LIST_W - 5, TIPOGRAFIA.lista, 1.5);
  const h_tarea_list = heightOfList(doc, tarea_items, LIST_W - 5, TIPOGRAFIA.lista, 1.5);
  const ejeH_boxH = PAD_Y + GAP_AFTER_H1 + h_ejeH_desc + GAP_AFTER_DESC + GAP_AFTER_SUB + h_pers_list + GAP_BETWEEN_BLOCKS + GAP_AFTER_SUB + h_tarea_list + PAD_Y;

  y = ensureSpace(y, ejeH_boxH + 10, () => newPage());
  dibujarCuadro(doc, X_LEFT, y, BOX_W, ejeH_boxH, COLORES.C, 0.10);

  yIn = y + PAD_Y;
  drawIconLabel(doc, { icon: iconHorizontalAxis, x: X_IN, y: yIn, color: COLORES.C, size: 7, text: ejeH_title, fontSize: TIPOGRAFIA.subtitulo, fontStyle: 'bold' });
  yIn += GAP_AFTER_H1;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(TIPOGRAFIA.secundario);
  doc.setTextColor(...COLORES.textoClaro);
  doc.text(doc.splitTextToSize(ejeH_desc, W_IN), X_IN, yIn);
  yIn += h_ejeH_desc + GAP_AFTER_DESC;

  drawIconLabel(doc, { icon: (d, x, y, c, s) => iconArrow(d, 'right', x, y, c, s), x: X_IN, y: yIn, color: COLORES.I, size: 5.5, text: pers_title, fontSize: TIPOGRAFIA.etiqueta, fontStyle: 'bold' });
  yIn += GAP_AFTER_SUB;
  yIn = dibujarLista(doc, pers_items, LIST_X, yIn, LIST_W, TIPOGRAFIA.lista, 1.5);
  yIn += GAP_BETWEEN_BLOCKS;

  drawIconLabel(doc, { icon: (d, x, y, c, s) => iconArrow(d, 'left', x, y, c, s), x: X_IN, y: yIn, color: COLORES.D, size: 5.5, text: tarea_title, fontSize: TIPOGRAFIA.etiqueta, fontStyle: 'bold' });
  yIn += GAP_AFTER_SUB;
  yIn = dibujarLista(doc, tarea_items, LIST_X, yIn, LIST_W, TIPOGRAFIA.lista, 1.5);

  y += ejeH_boxH + 12;

  // Nota importante
  const notaTitle = 'Nota Importante: Los Ejes son Independientes';
  const notaText = 'Una persona puede tener ritmo acelerado pero estar orientada a personas (I), o ritmo pausado pero orientada a tareas (C). Las cuatro combinaciones son igualmente válidas y cada una tiene sus propias fortalezas. No existe una combinación "mejor" que otra; todo depende del contexto y las necesidades específicas.';
  const h_nota_text = heightOfText(doc, notaText, W_IN, TIPOGRAFIA.cuerpo, 'normal');
  const notaBoxH = PAD_Y + 8 + 4 + h_nota_text + PAD_Y;

  y = ensureSpace(y, notaBoxH + 6, () => newPage());
  dibujarCuadro(doc, X_LEFT, y, BOX_W, notaBoxH, COLORES.primario, 0.05);

  yIn = y + PAD_Y;
  drawIconLabel(doc, { icon: iconBulb, x: X_IN, y: yIn, color: COLORES.primario, size: 7, text: notaTitle, fontSize: TIPOGRAFIA.subtitulo, fontStyle: 'bold' });
  yIn += 8;
  dibujarTexto(doc, notaText, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
}

// ---------------------------------------------------------------------------
// LOS 8 ESTILOS CONDUCTUALES
// ---------------------------------------------------------------------------
function drawBadge(doc, x, y, text, color) {
  doc.saveGraphicsState();
  doc.setDrawColor(...color);
  doc.setLineWidth(0.6);
  doc.circle(x + 3.2, y - 2.0, 2.6, 'S');
  doc.restoreGraphicsState();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(TIPOGRAFIA.micro);
  doc.setTextColor(...color);
  doc.text(String(text), x + 3.2, y - 1.1, { align: 'center' });
}

function drawBulletLines(doc, items, xBullet, xText, y, maxWidth, fontSize, bulletChar = '•', lineGap = 1.5) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORES.texto);
  let currentY = y;
  items.forEach((t) => {
    const lines = doc.splitTextToSize(t, maxWidth);
    doc.text(bulletChar, xBullet, currentY);
    doc.text(lines, xText, currentY);
    currentY += (lines.length * fontSize * 0.35) + lineGap;
  });
  return currentY;
}

export function generarEstilos(doc, nombreCompleto) {
  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;
  const X_BULLET = X_IN + 2;
  const X_LIST_TEXT = X_IN + 7;
  const W_LIST = W_IN - 7;

  function newPage() { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); }

  function estimateEstiloHeight(estilo) {
    const hTitle = 9;
    const hUbic = heightOfText(doc, estilo.ubicacion, W_IN - 8, TIPOGRAFIA.secundario, 'normal') + 4;
    const hDesc = heightOfText(doc, estilo.descripcion, W_IN, TIPOGRAFIA.cuerpo, 'normal') + 5;
    const hSectionHeader = 6;
    const hCar = heightOfList(doc, estilo.caracteristicas, W_LIST, TIPOGRAFIA.lista, 1.5);
    const hFort = heightOfList(doc, estilo.fortalezas, W_LIST, TIPOGRAFIA.lista, 1.5);
    const hRisk = heightOfList(doc, estilo.riesgos, W_LIST, TIPOGRAFIA.lista, 1.5);
    return PAD_Y + hTitle + hUbic + hDesc + (hSectionHeader + 2) + hCar + (hSectionHeader + 2) + hFort + (hSectionHeader + 2) + hRisk + 6 + PAD_Y;
  }

  function renderEstilo(estilo, y) {
    const boxH = estimateEstiloHeight(estilo);
    y = ensureSpace(y, boxH + 6, () => newPage());
    dibujarCuadro(doc, X_LEFT, y, BOX_W, boxH, estilo.color, 0.10);

    let yIn = y + PAD_Y;
    const match = estilo.nombre.match(/\(([^)]+)\)/);
    const sigla = match ? match[1] : '';
    drawBadge(doc, X_IN, yIn + 1, sigla, estilo.color);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo + 1);
    doc.setTextColor(...estilo.color);
    doc.text(estilo.nombre, X_IN + 10, yIn + 1);
    yIn += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text(doc.splitTextToSize(estilo.ubicacion, W_IN), X_IN, yIn);
    yIn += heightOfText(doc, estilo.ubicacion, W_IN, TIPOGRAFIA.secundario, 'normal') + 4;

    yIn = dibujarTexto(doc, estilo.descripcion, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
    yIn += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.etiqueta);
    doc.setTextColor(...estilo.color);
    doc.text('Características:', X_IN, yIn);
    yIn += 6;
    yIn = drawBulletLines(doc, estilo.caracteristicas, X_BULLET, X_LIST_TEXT, yIn, W_LIST, TIPOGRAFIA.lista, '•', 1.5);
    yIn += 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.etiqueta);
    doc.setTextColor(...COLORES.S);
    doc.text('Fortalezas:', X_IN, yIn);
    yIn += 6;
    yIn = drawBulletLines(doc, estilo.fortalezas, X_BULLET, X_LIST_TEXT, yIn, W_LIST, TIPOGRAFIA.lista, '•', 1.5);
    yIn += 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.etiqueta);
    doc.setTextColor(...COLORES.I);
    doc.text('Áreas de atención:', X_IN, yIn);
    yIn += 6;
    drawBulletLines(doc, estilo.riesgos, X_BULLET, X_LIST_TEXT, yIn, W_LIST, TIPOGRAFIA.lista, '•', 1.5);

    return y + boxH + 10;
  }

  newPage();
  let y = 35;
  dibujarTitulo(doc, 'Los 8 Estilos Conductuales de la Rueda DISC', y);
  y += 14;
  y = dibujarTexto(doc, 'La combinación de los dos ejes fundamentales genera ocho estilos conductuales distintos, cada uno ubicado en un segmento de la Rueda Success Insights. Cada estilo representa una forma única de interactuar con el entorno y tiene características, fortalezas y necesidades específicas.', X_LEFT, y, BOX_W, TIPOGRAFIA.cuerpo);
  y += 10;

  const TODOS_LOS_ESTILOS = [
    { nombre: 'CONDUCTOR (D)', color: COLORES.D, ubicacion: 'Ritmo Acelerado + Orientado a Tareas', descripcion: 'Los Conductores son directos, decididos y buscan resultados tangibles. Toman el control de las situaciones, enfrentan desafíos con determinación y actúan con urgencia para alcanzar objetivos.', caracteristicas: ['Liderazgo natural y capacidad de toma de decisiones', 'Enfoque en resultados y eficiencia', 'Franqueza y comunicación directa', 'Tolerancia al riesgo y la presión', 'Orientación competitiva'], fortalezas: ['Inician proyectos y movilizan recursos rápidamente', 'Toman decisiones difíciles sin dudar', 'Aceptan responsabilidades desafiantes', 'Mantienen el enfoque en objetivos estratégicos'], riesgos: ['Pueden parecer impacientes o insensibles', 'Tendencia a minimizar detalles importantes', 'Riesgo de sobrecargar a otros con su ritmo'] },
    { nombre: 'PERSUASOR (D/I)', color: COLORES.D, ubicacion: 'Ritmo Acelerado + Balance entre Personas y Tareas', descripcion: 'Los Persuasores combinan la orientación a resultados con habilidades interpersonales. Convencen apelando tanto a la lógica como a las emociones, siendo innovadores y emprendedores.', caracteristicas: ['Visión estratégica combinada con carisma', 'Capacidad de influir y motivar equipos', 'Creatividad en la solución de problemas', 'Energía contagiosa y optimismo', 'Orientación al cambio y la innovación'], fortalezas: ['Generan entusiasmo por nuevas ideas', 'Negocian efectivamente', 'Inspiran a otros a alcanzar metas ambiciosas', 'Adaptan su comunicación según la audiencia'], riesgos: ['Pueden sobrevender ideas sin fundamento sólido', 'Tendencia a comprometerse en exceso', 'Dificultad para mantener el foco en una sola iniciativa'] },
    { nombre: 'PROMOTOR (I)', color: COLORES.I, ubicacion: 'Ritmo Acelerado + Orientado a Personas', descripcion: 'Los Promotores expresan sus ideas con entusiasmo para influir en otros. Son optimistas, comunicativos y generan cohesión en los equipos mediante su energía positiva.', caracteristicas: ['Comunicación expresiva y persuasiva', 'Optimismo contagioso', 'Habilidad para conectar con diversos tipos de personas', 'Creatividad en la presentación de ideas', 'Facilidad para generar redes de contactos'], fortalezas: ['Motivan e inspiran a los equipos', 'Crean ambientes de trabajo positivos', 'Generan nuevas ideas y oportunidades', 'Facilitan la colaboración entre personas'], riesgos: ['Pueden ser percibidos como superficiales', 'Tendencia a evitar confrontaciones necesarias', 'Dificultad para mantener el enfoque en detalles'] },
    { nombre: 'RELACIONADOR (I/S)', color: COLORES.I, ubicacion: 'Balance en Ritmo + Orientado a Personas', descripcion: 'Los Relacionadores combinan sociabilidad con paciencia. Son empáticos, considerados y se enfocan en construir relaciones sólidas y duraderas.', caracteristicas: ['Empatía genuina y escucha activa', 'Paciencia y tolerancia con los demás', 'Habilidad para mediar en conflictos', 'Comunicación amable y considerada', 'Lealtad hacia personas y equipos'], fortalezas: ['Crean conexiones profundas y significativas', 'Mantienen la armonía en los equipos', 'Apoyan el desarrollo de otros', 'Generan confianza y seguridad psicológica'], riesgos: ['Dificultad para establecer límites', 'Tendencia a evitar decisiones difíciles', 'Pueden posponer confrontaciones necesarias'] },
    { nombre: 'SOSTENEDOR (S)', color: COLORES.S, ubicacion: 'Ritmo Pausado + Orientado a Personas', descripcion: 'Los Sostenedores defienden ideas sólidas y trabajan consistentemente para asegurar que los proyectos se completen. Son pacientes, leales y generan estabilidad.', caracteristicas: ['Consistencia y confiabilidad', 'Paciencia con procesos y personas', 'Lealtad hacia la organización y el equipo', 'Habilidad para escuchar sin juzgar', 'Enfoque en el largo plazo'], fortalezas: ['Mantienen la continuidad de los proyectos', 'Aseguran seguimiento de principio a fin', 'Generan ambientes de trabajo estables', 'Apoyan a otros de manera práctica y constante'], riesgos: ['Resistencia al cambio', 'Dificultad para adaptarse rápidamente', 'Tendencia a permanecer en zona de confort'] },
    { nombre: 'COORDINADOR (S/C)', color: COLORES.S, ubicacion: 'Ritmo Pausado + Balance entre Personas y Tareas', descripcion: 'Los Coordinadores se enfocan en hechos y métodos comprobados. Son disciplinados, organizados y mantienen altos estándares de calidad.', caracteristicas: ['Disciplina y metodología', 'Atención a procesos y estándares', 'Organización sistemática', 'Consistencia en la ejecución', 'Respeto por las normas establecidas'], fortalezas: ['Aseguran el cumplimiento de procedimientos', 'Mantienen sistemas de calidad vigentes', 'Documentan procesos efectivamente', 'Previenen errores mediante planificación'], riesgos: ['Pueden ser percibidos como inflexibles', 'Resistencia a métodos no probados', 'Tendencia al perfeccionismo excesivo'] },
    { nombre: 'ANALIZADOR (C)', color: COLORES.C, ubicacion: 'Ritmo Pausado + Orientado a Tareas', descripcion: 'Los Analizadores buscan exactitud y aseguran los más altos niveles de calidad. Son precisos, sistemáticos y recopilan información detallada antes de actuar.', caracteristicas: ['Precisión y exactitud en el trabajo', 'Pensamiento analítico profundo', 'Enfoque en la calidad', 'Metodología sistemática', 'Atención meticulosa a los detalles'], fortalezas: ['Identifican errores y riesgos potenciales', 'Aseguran cumplimiento de estándares', 'Analizan problemas complejos efectivamente', 'Toman decisiones fundamentadas en datos'], riesgos: ['Parálisis por análisis', 'Tendencia al perfeccionismo extremo', 'Pueden ser percibidos como críticos o distantes'] },
    { nombre: 'IMPLEMENTADOR (C/D)', color: COLORES.C, ubicacion: 'Balance en Ritmo + Orientado a Tareas', descripcion: 'Los Implementadores evalúan y aprovechan datos para llegar a soluciones. Aplican creativamente ideas basadas en hechos y administran bien tiempo y recursos.', caracteristicas: ['Combinación de análisis y acción', 'Gestión eficiente de recursos', 'Aplicación práctica de teorías', 'Resolución de problemas basada en evidencia', 'Administración efectiva del tiempo'], fortalezas: ['Transforman ideas en planes ejecutables', 'Optimizan procesos y sistemas', 'Toman decisiones equilibrando datos y urgencia', 'Implementan soluciones sostenibles'], riesgos: ['Pueden ser percibidos como fríos o calculadores', 'Tendencia a sub-valorar aspectos humanos', 'Impaciencia con quienes no son igualmente eficientes'] },
  ];

  TODOS_LOS_ESTILOS.forEach((estilo) => { y = renderEstilo(estilo, y); });
}

// ---------------------------------------------------------------------------
// DIMENSIONES COMPLETAS
// ---------------------------------------------------------------------------
export function generarDimensionesCompletas(doc, nombreCompleto) {
  function dibujarHeaderDimension(doc, y, dim) {
    const HEADER_H = 22;
    dibujarCuadro(doc, 15, y, 180, HEADER_H, dim.color, 0.15);
    const MID = y + HEADER_H / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.headerLetra);
    doc.setTextColor(...dim.color);
    doc.text(String(dim.letra), 22, MID + (TIPOGRAFIA.headerLetra * 0.35 * 0.35));

    doc.setFontSize(TIPOGRAFIA.headerNombre);
    doc.text(String(dim.nombre), 45, MID - 1);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.headerSubtitulo);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text(String(dim.subtitulo), 45, MID + 6);

    return y + HEADER_H + 8;
  }

  // ── Helper: altura real de una lista dentro de una celda de 70mm ──
  function alturaListaCelda(items) {
    let h = 0;
    items.forEach(item => {
      const lines = doc.splitTextToSize(item, 70);
      h += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });
    return h;
  }

  // ── Helper: dibuja un bloque de lista dentro de un cuadro ya dibujado ──
  function renderListaEnCuadro(items, bx, startY) {
    let yT = startY;
    items.forEach(item => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(TIPOGRAFIA.lista);
      doc.setTextColor(...COLORES.texto);
      doc.text('•', bx + 5, yT);
      const lines = doc.splitTextToSize(item, 70);
      doc.text(lines, bx + 9, yT);
      yT += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });
    return yT;
  }

  // ── Helper: altura real de una lista ancha (180mm) ──
  function alturaListaAncha(items) {
    let h = 0;
    items.forEach(item => {
      const lines = doc.splitTextToSize(item, 165);
      h += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });
    return h;
  }

  const PAD_TOP = 7;    // padding superior dentro del cuadro
  const PAD_BOT = 8;    // padding inferior
  const LABEL_H = 8;    // altura del label bold ("Características", etc.)

  const dimensiones = [
    {
      letra: 'D', nombre: 'Dominancia', color: COLORES.D,
      subtitulo: 'Cómo Responde a Problemas y Desafíos',
      pregunta: '¿QUÉ? — Enfocado en resultados y acción',
      descripcion: 'Las personas con alta Dominancia se caracterizan por ser directas, decididas y orientadas a resultados. Les gusta tener el control, enfrentan desafíos con determinación y toman decisiones con rapidez. Son competitivas y buscan alcanzar objetivos de manera eficiente. Lideran con firmeza y se destacan en contextos que requieren acción inmediata y gestión bajo presión.',
      caracteristicas: ['Orientación natural al liderazgo y la toma de control', 'Enfoque en resultados tangibles y medibles', 'Comunicación directa, franca y sin rodeos', 'Alta tolerancia al riesgo y la incertidumbre', 'Competitividad y deseo de ganar', 'Sentido de urgencia constante'],
      motivadores: ['Poder y autoridad para tomar decisiones', 'Oportunidades de avance y promoción', 'Desafíos que pongan a prueba sus capacidades', 'Autonomía e independencia', 'Reconocimiento por resultados logrados', 'Competencia y superación de obstáculos'],
      fortalezas: ['Liderazgo natural y capacidad de movilizar equipos', 'Toma de decisiones rápida y decisiva', 'Orientación clara a resultados y objetivos', 'Visión estratégica de largo plazo', 'Habilidad para gestionar crisis y presión', 'Iniciativa para comenzar proyectos ambiciosos'],
      mejora: ['Puede ser percibido como impaciente o autoritario', 'Tendencia a pasar por alto detalles importantes', 'Riesgo de descuidar necesidades emocionales del equipo', 'Dificultad para delegar apropiadamente', 'Impaciencia con procesos que consideran lentos'],
      bajoPression: ['Puede volverse agresivo o dominante', 'Impaciencia extrema con errores', 'Tendencia a imponer su voluntad sin considerar alternativas', 'Toma de decisiones impulsivas sin análisis suficiente'],
      entorno: ['Entornos dinámicos y competitivos', 'Desafíos constantes y oportunidades de crecimiento', 'Autonomía para tomar decisiones', 'Resultados visibles y medibles', 'Oportunidades de avance rápido', 'Reconocimiento por logros']
    },
    {
      letra: 'I', nombre: 'Influencia', color: COLORES.I,
      subtitulo: 'Cómo Influye en el Punto de Vista de los Demás',
      pregunta: '¿QUIÉN? — Enfocado en personas y relaciones',
      descripcion: 'Las personas con alta Influencia son extrovertidas, optimistas y persuasivas. Disfrutan socializar, influir en otros y crear un ambiente positivo. Son comunicativas y les motiva el reconocimiento social. Generan entusiasmo y cohesión en los equipos, son creativas y excelentes para promover proyectos e ideas.',
      caracteristicas: ['Comunicación expresiva y entusiasta', 'Optimismo natural y actitud positiva', 'Habilidad para conectar con diversos tipos de personas', 'Creatividad e innovación en ideas', 'Expresividad emocional', 'Facilidad para generar redes y contactos'],
      motivadores: ['Reconocimiento social y popularidad', 'Relaciones interpersonales significativas', 'Trabajo en equipo y colaboración', 'Libertad de expresión', 'Ambiente de trabajo positivo y divertido', 'Oportunidades para presentar ideas públicamente'],
      fortalezas: ['Comunicación excepcional y persuasión', 'Trabajo en equipo y construcción de relaciones', 'Creatividad y pensamiento innovador', 'Networking y desarrollo de contactos', 'Capacidad de motivar e inspirar a otros', 'Generación de entusiasmo por proyectos'],
      mejora: ['Puede ser percibido como desorganizado o superficial', 'Tendencia a priorizar popularidad sobre productividad', 'Dificultad para mantener el foco en detalles', 'Evitación de confrontaciones necesarias', 'Puede sobre-comprometerse socialmente'],
      bajoPression: ['Puede volverse desorganizado y disperso', 'Superficialidad en el análisis de problemas', 'Exceso emocional en respuestas', 'Búsqueda de aprobación a toda costa', 'Dificultad para priorizar tareas importantes'],
      entorno: ['Entornos colaborativos con interacción frecuente', 'Reconocimiento público de logros', 'Flexibilidad y variedad en las tareas', 'Ambiente optimista y positivo', 'Oportunidades de trabajar con personas', 'Libertad para expresar ideas creativas']
    },
    {
      letra: 'S', nombre: 'Estabilidad', color: COLORES.S,
      subtitulo: 'Cómo Responde al Ritmo del Entorno',
      pregunta: '¿CÓMO? — Enfocado en procesos y cooperación',
      descripcion: 'Las personas con alta Estabilidad son pacientes, leales y orientadas al equipo. Valoran la estabilidad y previsibilidad, son confiables y prefieren ambientes armoniosos. Se destacan por mantener la calma en situaciones difíciles, mediar en conflictos y generar un clima de trabajo seguro y predecible.',
      caracteristicas: ['Paciencia y perseverancia', 'Lealtad hacia personas y organizaciones', 'Preferencia por rutinas y estabilidad', 'Escucha activa y empática', 'Enfoque en el largo plazo', 'Consistencia y confiabilidad'],
      motivadores: ['Seguridad y estabilidad laboral', 'Relaciones armoniosas y duraderas', 'Reconocimiento sincero y personal', 'Tiempo para adaptarse a cambios', 'Ambiente de trabajo predecible', 'Sentido de pertenencia al equipo'],
      fortalezas: ['Lealtad excepcional a largo plazo', 'Paciencia con procesos y personas', 'Escucha activa sin juzgar', 'Consistencia en la ejecución', 'Capacidad de mediación en conflictos', 'Perseverancia hasta completar tareas'],
      mejora: ['Puede ser percibido como resistente al cambio', 'Dificultad para tomar decisiones rápidas', 'Tendencia a evitar confrontaciones necesarias', 'Adaptación lenta a nuevas situaciones', 'Dificultad para establecer límites firmes'],
      bajoPression: ['Puede volverse pasivo e indeciso', 'Excesiva complacencia con demandas', 'Resistencia total a cualquier cambio', 'Tendencia a guardar resentimientos', 'Paralización ante decisiones difíciles'],
      entorno: ['Entornos estables con cambios graduales', 'Relaciones de largo plazo', 'Roles y responsabilidades bien definidos', 'Tiempo suficiente para adaptarse', 'Liderazgo comprensivo y empático', 'Trabajo en equipo colaborativo']
    },
    {
      letra: 'C', nombre: 'Cumplimiento', color: COLORES.C,
      subtitulo: 'Cómo Responde a Reglas y Procedimientos',
      pregunta: '¿POR QUÉ? — Enfocado en calidad y precisión',
      descripcion: 'Las personas con alto Cumplimiento son analíticas, precisas y orientadas a la calidad. Valoran la exactitud, siguen procedimientos establecidos y buscan la perfección. Son detallistas y sistemáticas, con gran capacidad de análisis profundo, pensamiento crítico y habilidad para identificar problemas antes de que ocurran.',
      caracteristicas: ['Precisión y exactitud en el trabajo', 'Pensamiento analítico y sistemático', 'Atención meticulosa a los detalles', 'Respeto por normas y procedimientos', 'Enfoque en la calidad', 'Objetividad en la toma de decisiones'],
      motivadores: ['Calidad y precisión en el trabajo', 'Estándares altos y expectativas claras', 'Información detallada y completa', 'Tiempo para analizar antes de decidir', 'Procedimientos y procesos claros', 'Reconocimiento por exactitud y calidad'],
      fortalezas: ['Análisis profundo y pensamiento crítico', 'Precisión técnica y atención al detalle', 'Control de calidad riguroso', 'Planificación detallada y exhaustiva', 'Identificación temprana de riesgos', 'Cumplimiento de normas y estándares'],
      mejora: ['Puede ser percibido como excesivamente crítico', 'Parálisis por análisis', 'Perfeccionismo que retrasa entregas', 'Tendencia al aislamiento social', 'Resistencia a innovaciones no probadas'],
      bajoPression: ['Puede volverse excesivamente crítico con otros', 'Pesimismo y enfoque en lo negativo', 'Aislamiento del equipo', 'Obsesión con detalles perdiendo visión global', 'Inflexibilidad extrema'],
      entorno: ['Entornos estructurados con reglas claras', 'Tiempo suficiente para análisis', 'Acceso a datos e información completa', 'Valoración de la precisión y calidad', 'Expectativas claramente definidas', 'Mínima ambigüedad en las tareas']
    }
  ];

  dimensiones.forEach(dim => {
    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);

    let y = 35;

    // ── Header ──────────────────────────────────────────────────────
    y = dibujarHeaderDimension(doc, y, dim);

    // ── Pregunta + descripción ───────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo);
    doc.setTextColor(...dim.color);
    doc.text(String(dim.pregunta), 15, y);
    y += 9;

    y = dibujarTexto(doc, dim.descripcion, 15, y, 180, TIPOGRAFIA.cuerpo);
    y += 8;

    // ── Grilla superior: Características | Motivadores ───────────────
    // Calcular altura dinámica de cada columna
    const hCarList = alturaListaCelda(dim.caracteristicas);
    const hMotList = alturaListaCelda(dim.motivadores);
    const hGrilla1 = Math.max(hCarList, hMotList) + PAD_TOP + LABEL_H + PAD_BOT;

    // Asegurar que quepa en la página
    y = ensureSpace(y, hGrilla1 + 6, () => {
      nuevaPagina(doc, nombreCompleto);
      agregarEncabezado(doc);
    });

    const bloques1 = [
      { titulo: 'Características', color: dim.color,  items: dim.caracteristicas, x: 15 },
      { titulo: 'Motivadores',     color: COLORES.I,   items: dim.motivadores,     x: 110 },
    ];

    bloques1.forEach(b => {
      dibujarCuadro(doc, b.x, y, 85, hGrilla1, b.color, 0.08);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(TIPOGRAFIA.etiqueta);
      doc.setTextColor(...b.color);
      doc.text(String(b.titulo), b.x + 5, y + PAD_TOP);

      renderListaEnCuadro(b.items, b.x, y + PAD_TOP + LABEL_H);
    });

    y += hGrilla1 + 6;

    // ── Grilla inferior: Fortalezas | Áreas de Desarrollo ────────────
    const hFortList = alturaListaCelda(dim.fortalezas);
    const hMejList  = alturaListaCelda(dim.mejora);
    const hGrilla2  = Math.max(hFortList, hMejList) + PAD_TOP + LABEL_H + PAD_BOT;

    y = ensureSpace(y, hGrilla2 + 6, () => {
      nuevaPagina(doc, nombreCompleto);
      agregarEncabezado(doc);
    });

    const bloques2 = [
      { titulo: 'Fortalezas',          color: COLORES.S, items: dim.fortalezas, x: 15 },
      { titulo: 'Áreas de Desarrollo', color: COLORES.I, items: dim.mejora,     x: 110 },
    ];

    bloques2.forEach(b => {
      dibujarCuadro(doc, b.x, y, 85, hGrilla2, b.color, 0.08);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(TIPOGRAFIA.etiqueta);
      doc.setTextColor(...b.color);
      doc.text(String(b.titulo), b.x + 5, y + PAD_TOP);

      renderListaEnCuadro(b.items, b.x, y + PAD_TOP + LABEL_H);
    });

    y += hGrilla2 + 6;

    // ── Bajo Presión (ancho completo, altura dinámica) ────────────────
    const hBPList  = alturaListaAncha(dim.bajoPression);
    const hBPBox   = PAD_TOP + LABEL_H + hBPList + PAD_BOT;

    y = ensureSpace(y, hBPBox + 6, () => {
      nuevaPagina(doc, nombreCompleto);
      agregarEncabezado(doc);
    });

    dibujarCuadro(doc, 15, y, 180, hBPBox, COLORES.D, 0.08);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.etiqueta);
    doc.setTextColor(...COLORES.D);
    doc.text('Bajo Presión o Estrés', 20, y + PAD_TOP);

    let yT = y + PAD_TOP + LABEL_H;
    dim.bajoPression.forEach(bp => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(TIPOGRAFIA.lista);
      doc.setTextColor(...COLORES.texto);
      doc.text('!', 20, yT);
      const lines = doc.splitTextToSize(bp, 165);
      doc.text(lines, 25, yT);
      yT += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });

    y += hBPBox + 6;

    // ── Entorno Ideal (ancho completo, altura dinámica) ───────────────
    const hEntList = alturaListaAncha(dim.entorno);
    const hEntBox  = PAD_TOP + LABEL_H + hEntList + PAD_BOT;

    y = ensureSpace(y, hEntBox + 6, () => {
      nuevaPagina(doc, nombreCompleto);
      agregarEncabezado(doc);
    });

    dibujarCuadro(doc, 15, y, 180, hEntBox, dim.color, 0.08);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.etiqueta);
    doc.setTextColor(...dim.color);
    doc.text('Entorno Ideal de Trabajo', 20, y + PAD_TOP);

    yT = y + PAD_TOP + LABEL_H;
    dim.entorno.forEach(ent => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(TIPOGRAFIA.lista);
      doc.setTextColor(...COLORES.texto);
      doc.text('•', 20, yT);
      const lines = doc.splitTextToSize(ent, 165);
      doc.text(lines, 25, yT);
      yT += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });
  });
}
// ---------------------------------------------------------------------------
// APLICACIONES DEL DISC
// ---------------------------------------------------------------------------
export function generarAplicaciones(doc, nombreCompleto) {
  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;
  const TEXT_X = X_IN + 5;
  const LIST_W = W_IN - 5;

  function newPage() { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); }

  function dibujarListaSimple(items, y) {
    let yCur = y;
    items.forEach(item => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(TIPOGRAFIA.lista);
      doc.setTextColor(...COLORES.texto);
      doc.text('•', X_IN, yCur);
      const lines = doc.splitTextToSize(item, LIST_W);
      doc.text(lines, TEXT_X, yCur);
      yCur += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });
    return yCur;
  }

  function heightOfAppBlock(app) {
    let hList = 0;
    app.items.forEach(item => {
      const lines = doc.splitTextToSize(item, LIST_W);
      hList += lines.length * TIPOGRAFIA.lista * 0.35 + 1.5;
    });
    return PAD_Y + 8 + 2 + hList + PAD_Y;
  }

  newPage();
  let y = 35;
  dibujarTitulo(doc, 'Aplicaciones del Modelo DISC', y);
  y += 12;
  y = dibujarTexto(doc, 'El modelo DISC tiene múltiples aplicaciones prácticas en diversos contextos organizacionales y personales. Su versatilidad lo convierte en una herramienta invaluable para el desarrollo y la gestión del talento humano.', X_LEFT, y, BOX_W, TIPOGRAFIA.cuerpo);
  y += 10;

  const aplicaciones = [
    { titulo: 'Desarrollo Organizacional', color: COLORES.primario, items: ['Selección de personal: Identificar candidatos cuyo estilo se alinee con la cultura y el rol', 'Formación de equipos: Crear equipos balanceados y complementarios', 'Resolución de conflictos: Comprender diferentes perspectivas para mediar efectivamente', 'Planificación de sucesión: Identificar y desarrollar futuros líderes', 'Onboarding: Personalizar la integración según el estilo del nuevo colaborador', 'Evaluación de desempeño: Considerar estilos al dar feedback'] },
    { titulo: 'Liderazgo y Gestión', color: COLORES.D, items: ['Estilo de liderazgo: Adaptar el enfoque según el estilo del equipo', 'Delegación efectiva: Asignar tareas considerando fortalezas naturales', 'Motivación de equipos: Aplicar estrategias personalizadas de motivación', 'Comunicación estratégica: Ajustar mensajes al estilo del receptor', 'Gestión del cambio: Anticipar resistencias y adaptar la estrategia', 'Coaching: Personalizar el desarrollo según el perfil'] },
    { titulo: 'Desarrollo Personal', color: COLORES.I, items: ['Autoconocimiento: Comprender fortalezas y áreas de desarrollo', 'Gestión de estrés: Identificar qué situaciones generan tensión', 'Mejora de relaciones: Entender y adaptarse a otros estilos', 'Crecimiento profesional: Identificar roles y entornos ideales', 'Comunicación efectiva: Adaptar estilo según el interlocutor', 'Toma de decisiones: Balancear tendencias naturales'] },
    { titulo: 'Ventas y Servicio al Cliente', color: COLORES.S, items: ['Identificar el estilo del cliente para adaptar el enfoque', 'Personalizar presentaciones según preferencias del cliente', 'Manejar objeciones según el estilo', 'Construir relaciones duraderas', 'Cerrar ventas con estrategias adaptadas', 'Gestionar cuentas según necesidades específicas'] },
  ];

  aplicaciones.forEach(app => {
    const blockH = heightOfAppBlock(app);
    y = ensureSpace(y, blockH + 6, () => { newPage(); return 35; });
    dibujarCuadro(doc, X_LEFT, y, BOX_W, blockH, app.color, 0.10);
    let yIn = y + PAD_Y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.subtitulo);
    doc.setTextColor(...app.color);
    doc.text(app.titulo, X_IN, yIn);
    yIn += 8;
    yIn = dibujarListaSimple(app.items, yIn);
    y = y + blockH + 8;
  });
}

// ---------------------------------------------------------------------------
// CONSIDERACIONES IMPORTANTES
// ---------------------------------------------------------------------------
export function generarConsideraciones(doc, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  function iconWarn(doc, x, y, color) {
    doc.saveGraphicsState();
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    doc.circle(x + 2.4, y - 1.8, 2.1, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.secundario);
    doc.setTextColor(...color);
    doc.text('!', x + 2.4, y - 0.8, { align: 'center' });
    doc.restoreGraphicsState();
  }

  const consideraciones = [
    { titulo: 'No es un test de inteligencia ni aptitud', texto: 'El DISC evalúa tendencias conductuales, no capacidad intelectual, habilidades técnicas ni competencias profesionales. Es complementario a otras evaluaciones como tests de aptitud, conocimientos técnicos o inteligencia emocional.' },
    { titulo: 'No hay perfiles "buenos" o "malos"', texto: 'Cada estilo conductual tiene fortalezas únicas y áreas de desarrollo. El perfil "ideal" depende del contexto, rol y objetivos específicos. La diversidad de estilos enriquece a los equipos.' },
    { titulo: 'Refleja autopercepción en un momento específico', texto: 'Los resultados pueden variar según estado emocional, contexto laboral y momento de vida. Se recomienda re-evaluación periódica (cada 12-18 meses) o ante cambios significativos de rol o contexto.' },
    { titulo: 'El comportamiento es modificable y desarrollable', texto: 'Las personas pueden adaptar y desarrollar nuevos patrones conductuales con autoconocimiento, práctica consciente y entrenamiento adecuado. El DISC no es una "sentencia" sino un punto de partida para el desarrollo.' },
    { titulo: 'Contexto y situación importan', texto: 'El comportamiento puede variar según el contexto (laboral vs. personal, familia vs. amigos). El perfil "Natural" refleja tendencias innatas, mientras el "Adaptado" muestra ajustes al entorno laboral.' },
    { titulo: 'Se recomienda interpretación profesional', texto: 'Para máximo aprovechamiento, complementar este informe con una sesión de devolución con un consultor certificado en DISC. Un profesional puede profundizar en matices y aplicaciones específicas.' },
    { titulo: 'Considerar otros factores', texto: 'El DISC es una pieza del rompecabezas. Complementar con evaluaciones de valores, motivadores, inteligencia emocional, competencias técnicas y experiencia. Las decisiones importantes deben considerar múltiples fuentes de información.' },
    { titulo: 'Respeto por la confidencialidad', texto: 'Los resultados son confidenciales y pertenecen al evaluado. No deben compartirse sin consentimiento explícito. En contextos organizacionales, establecer claramente quién tendrá acceso y con qué propósito.' },
  ];

  const X_ICON = 20;
  const X_TEXT = 27;
  const W_TEXT = 163;
  const PAD_Y = 10;
  const GAP_ENTRE_ITEMS = 6;    // espacio entre ítem y ítem
  const GAP_TITULO_TEXTO = 2;   // espacio entre título y párrafo

  // ── 1. Calcular altura TOTAL real del contenido ──────────────────────
  let alturaContenido = 0;
  consideraciones.forEach((cons) => {
    const hTitulo = heightOfText(doc, cons.titulo, W_TEXT, TIPOGRAFIA.etiqueta, 'bold');
    const hTexto  = heightOfText(doc, cons.texto,  W_TEXT, TIPOGRAFIA.cuerpo,   'normal');
    alturaContenido += hTitulo + GAP_TITULO_TEXTO + hTexto + GAP_ENTRE_ITEMS;
  });

  const boxH = PAD_Y + alturaContenido + PAD_Y;

  // ── 2. Título de sección ─────────────────────────────────────────────
  let y = 35;
  dibujarTitulo(doc, 'Consideraciones Importantes', y);
  y += 12;

  // ── 3. Si el cuadro completo no cabe en la página, nueva página ──────
  //    (poco probable pero seguro)
  y = ensureSpace(y, Math.min(boxH, 60), () => {
    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);
    dibujarTitulo(doc, 'Consideraciones Importantes (cont.)', 35);
    y = 35 + 12;
  });

  // ── 4. Dibujar cuadro con altura real ────────────────────────────────
  dibujarCuadro(doc, 15, y, 180, boxH, COLORES.I, 0.08);
  y += PAD_Y;

  // ── 5. Render de cada ítem ───────────────────────────────────────────
  consideraciones.forEach((cons) => {
    // Verificar si el ítem completo cabe en la página actual
    const hTitulo = heightOfText(doc, cons.titulo, W_TEXT, TIPOGRAFIA.etiqueta, 'bold');
    const hTexto  = heightOfText(doc, cons.texto,  W_TEXT, TIPOGRAFIA.cuerpo,   'normal');
    const hItem   = hTitulo + GAP_TITULO_TEXTO + hTexto + GAP_ENTRE_ITEMS;

    y = ensureSpace(y, hItem, () => {
      nuevaPagina(doc, nombreCompleto);
      agregarEncabezado(doc);
      // Redibuja el cuadro en la nueva página con el espacio restante
      dibujarCuadro(doc, 15, 35, 180, 220, COLORES.I, 0.08);
      y = 35 + PAD_Y;
    });

    // Icono de alerta
    iconWarn(doc, X_ICON, y, COLORES.I);

    // Título del ítem
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(TIPOGRAFIA.etiqueta);
    doc.setTextColor(...COLORES.I);
    const tituloLines = doc.splitTextToSize(cons.titulo, W_TEXT);
    doc.text(tituloLines, X_TEXT, y);
    y += hTitulo + GAP_TITULO_TEXTO;

    // Texto descriptivo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.cuerpo);
    doc.setTextColor(...COLORES.texto);
    const textoLines = doc.splitTextToSize(cons.texto, W_TEXT);
    doc.text(textoLines, X_TEXT, y);
    y += hTexto + GAP_ENTRE_ITEMS;
  });
}

// ---------------------------------------------------------------------------
// RESUMEN DE RESULTADOS
// ---------------------------------------------------------------------------
export function generarResumen(doc, resultado, nombreCompleto) {
    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);

    let y = 35;
    dibujarTitulo(doc, 'Resumen de Resultados', y);
    y += 12;

    dibujarCuadro(doc, 15, y, 180, 28, COLORES.primario, 0.05);
    y += 9;
    y = dibujarTexto(doc, 'Este resumen presenta una visión general de tu perfil conductual basado en el Test DISC. Los resultados reflejan tus tendencias naturales hacia las cuatro dimensiones fundamentales del comportamiento profesional, obtenidas a través del análisis de tus respuestas a 28 grupos de características conductuales.', 20, y, 170, TIPOGRAFIA.cuerpo);

    y += 12;
    dibujarSubtitulo(doc, 'Resultados Cuantitativos', y);
    y += 10;

    const pares = [
        [
            { label: 'MÁS D/I', sublabel: 'Activo/Extrovertido', val: resultado.masDI, pct: resultado.pctMasDI, color: COLORES.D, nivel: resultado.nivelMasDI },
            { label: 'MÁS S/C', sublabel: 'Reservado/Metódico', val: resultado.masSC, pct: resultado.pctMasSC, color: COLORES.S, nivel: resultado.nivelMasSC },
        ],
        [
            { label: 'MENOS D/I', sublabel: 'Activo/Extrovertido', val: resultado.menosDI, pct: resultado.pctMenosDI, color: COLORES.I, nivel: resultado.nivelMenosDI },
            { label: 'MENOS S/C', sublabel: 'Reservado/Metódico', val: resultado.menosSC, pct: resultado.pctMenosSC, color: COLORES.C, nivel: resultado.nivelMenosSC },
        ],
    ];

    pares.forEach(fila => {
        fila.forEach((score, i) => {
            const x = i === 0 ? 15 : 110;
            dibujarCuadro(doc, x, y, 85, 42, score.color, 0.1);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...score.color);
            doc.text(score.label, x + 5, y + 8);
            doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.textoClaro);
            doc.text(score.sublabel, x + 5, y + 13);
            doc.setFontSize(36); doc.setTextColor(...score.color);
            doc.text(score.val.toString(), x + 5, y + 30);
            doc.setFontSize(15);
            doc.text(`${score.pct}%`, x + 28, y + 30);

            doc.saveGraphicsState();
            doc.setFillColor(...score.color);
            doc.setGState(new doc.GState({ opacity: 0.3 }));
            doc.roundedRect(x + 46, y + 24, 34, 5, 1, 1, 'F');
            doc.restoreGraphicsState();
            doc.setFillColor(...score.color);
            doc.roundedRect(x + 46, y + 24, (score.pct / 100) * 34, 5, 1, 1, 'F');

            doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.texto);
            doc.text(`Nivel: ${score.nivel}`, x + 46, y + 36);
        });
        y += 52;
    });

    dibujarCuadro(doc, 15, y, 180, 22, COLORES.textoClaro, 0.05);
    y += 8;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...COLORES.texto);
    doc.text('Lectura de Resultados:', 20, y); y += 6;
    dibujarTexto(doc, 'En el test se presentaron 28 grupos de 4 características. Para cada grupo seleccionaste la característica que MÁS te describe y la que MENOS te describe. Los valores "MÁS" indican identificación con ese tipo de comportamiento, mientras que "MENOS" indica rechazo. Cada par (MÁS/MENOS) suma 28, el total de preguntas.', 20, y, 170, TIPOGRAFIA.secundario, COLORES.textoClaro);
}

// ---------------------------------------------------------------------------
// GRÁFICO DE BARRAS DISC
// ---------------------------------------------------------------------------
export async function generarGraficoBarras(doc, resultado, respuestasParsed, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;

  let y = 35;
  dibujarTitulo(doc, 'Gráfico de Barras DISC', y);
  y += 12;

  const introText = 'El gráfico de barras DISC muestra la intensidad de cada una de las cuatro dimensiones en tu perfil. Los valores se expresan en una escala de 0 a 100, donde valores superiores a 60 indican una dimensión predominante, y valores inferiores a 40 indican una dimensión menos pronunciada.';
  const introH = PAD_Y + heightOfText(doc, introText, W_IN, TIPOGRAFIA.cuerpo, 'normal') + PAD_Y;
  dibujarCuadro(doc, X_LEFT, y, BOX_W, introH, COLORES.primario, 0.05);
  let yIn = y + PAD_Y;
  dibujarTexto(doc, introText, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
  y = y + introH + 10;

  const chartW = 150;
  const chartH = 100;
  const chartX = X_LEFT + (BOX_W - chartW) / 2;
  const chartY = y;

  try {
    const canvasElement = document.querySelector('#discBarChartContainer canvas');
    if (canvasElement) {
      const imgData = canvasToCroppedPng(canvasElement, 16);
      doc.addImage(imgData, 'PNG', chartX, chartY, chartW, chartH);
    } else throw new Error('Canvas no encontrado');
  } catch (error) {
    const discValues = calcularValoresDISC(respuestasParsed);
    dibujarGraficoBarrasManual(doc, chartX, chartY, discValues, chartW);
  }

  y += chartH + 12;

  const interpTitle = 'Cómo Interpretar el Gráfico de Barras';
  const interps = [
    'Altura de barras: Indica la intensidad de cada dimensión. Valores altos (>60) muestran características predominantes en tu perfil.',
    'Barra más alta: Representa tu dimensión conductual dominante, la que más influye en tu comportamiento habitual.',
    'Combinación de barras: El patrón completo define tu estilo único. Por ejemplo, D+I alto = Persuasor, S+C alto = Coordinador.',
    'Valores balanceados: Si todas las barras están entre 40-60, indica versatilidad y adaptabilidad conductual.',
    'Contraste de altura: Gran diferencia entre la barra más alta y más baja indica un perfil muy definido y especializado.',
  ];

  const listH = heightOfList(doc, interps, W_IN - 5, TIPOGRAFIA.lista, 2);
  const interpH = PAD_Y + 8 + listH + PAD_Y;

  y = ensureSpace(y, interpH + 6, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
  dibujarCuadro(doc, X_LEFT, y, BOX_W, interpH, COLORES.secundario, 0.05);

  yIn = y + PAD_Y;
  iconInfo(doc, X_IN, yIn + 1, COLORES.primario);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(TIPOGRAFIA.subtitulo);
  doc.setTextColor(...COLORES.primario);
  doc.text(interpTitle, X_IN + 8, yIn + 1);
  yIn += 9;

  interps.forEach((interp) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.lista);
    doc.setTextColor(...COLORES.texto);
    doc.text('•', X_IN, yIn);
    const lines = doc.splitTextToSize(interp, W_IN - 5);
    doc.text(lines, X_IN + 5, yIn);
    yIn += lines.length * TIPOGRAFIA.lista * 0.35 + 2;
  });
}

// ---------------------------------------------------------------------------
// RUEDA SUCCESS INSIGHTS
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// RUEDA SUCCESS INSIGHTS
// ---------------------------------------------------------------------------
export async function generarRueda(doc, respuestasParsed, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;

  function iconCircle(doc, x, y, color, r = 2.2) {
    doc.saveGraphicsState();
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8);
    doc.circle(x + r, y - r, r, 'S');
    doc.restoreGraphicsState();
  }

  function iconStar(doc, x, y, color, size = 5.5) {
    const cx = x + size / 2, cy = y - size / 2;
    const rOuter = size / 2, rInner = rOuter * 0.45;
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const ang = (-Math.PI / 2) + (i * Math.PI / 5);
      const r = i % 2 === 0 ? rOuter : rInner;
      pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
    }
    doc.saveGraphicsState();
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8);
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      doc.line(x1, y1, x2, y2);
    }
    doc.restoreGraphicsState();
  }

  async function svgToPngDataUrl(svgElement, sizePx = 1200, background = '#FFFFFF') {
    const svgClone = svgElement.cloneNode(true);
    const allRects = svgClone.querySelectorAll('rect');
    allRects.forEach((rect, i) => {
      const fill = rect.getAttribute('fill') || '';
      if (i === 0 || fill === '#0f1424' || fill === '#0f172a' || fill === '#1a1a2e') {
        rect.setAttribute('fill', background);
        rect.removeAttribute('rx');
      }
    });
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = await new Promise((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = sizePx; canvas.height = sizePx;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, sizePx, sizePx);
      const scale = Math.min(sizePx / img.width, sizePx / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      const dx = (sizePx - dw) / 2, dy = (sizePx - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      return canvas.toDataURL('image/png');
    } finally { URL.revokeObjectURL(url); }
  }

  let y = 35;
  dibujarTitulo(doc, 'Rueda Success Insights®', y);
  y += 12;

  const introText = 'La Rueda Success Insights es un mapa polar de 60 posiciones conductuales organizadas en 5 niveles de intensidad. Cada sector representa uno de los 8 estilos conductuales DISC. Tu perfil se muestra en dos marcadores: Natural (círculo) que representa tu estilo innato, y Adaptado (estrella) que muestra tu estilo en el entorno laboral.';
  const introH = PAD_Y + heightOfText(doc, introText, W_IN, TIPOGRAFIA.cuerpo, 'normal') + PAD_Y;
  dibujarCuadro(doc, X_LEFT, y, BOX_W, introH, COLORES.primario, 0.05);
  let yIn = y + PAD_Y;
  dibujarTexto(doc, introText, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
  y += introH + 10;

  const wheelW = 150, wheelH = 150;
  const wheelX = X_LEFT + (BOX_W - wheelW) / 2;
  const wheelY = y;

  // ══════════════════════════════════════════════════════════════════════
  // CALCULAR CELDAS ANTES DE RENDERIZAR
  // ══════════════════════════════════════════════════════════════════════
  let coords = null;
  if (typeof window.discToWheel === 'function') {
    try {
      coords = window.discToWheel(respuestasParsed);
      console.log('✅ discToWheel:', coords);
    } catch (e) {
      console.warn('⚠️ discToWheel error:', e);
    }
  }
  const celdaNatural = coords?.natural?.cell ?? null;
  const celdaAdaptada = coords?.adaptado?.cell ?? null;

  try {
    // 1) Primero: buscar en el DOM visible (como antes)
    let svgElement = document.querySelector('#ruedaSVG');

    // 2) Si no está, usar contenedor oculto
    if (!svgElement) {
      const host = document.getElementById('ruedaExport');
      if (!host) throw new Error('SVG no encontrado y falta contenedor #ruedaExport');

      host.innerHTML = '';

      // ════════════════════════════════════════════════════════════════
      // USAR renderRuedaSI5 CON CELDAS CALCULADAS
      // ════════════════════════════════════════════════════════════════
      if (typeof window.renderRuedaSI5 === 'function') {
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('id', 'ruedaSVG');
        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgEl.setAttribute('width', '800');
        svgEl.setAttribute('height', '800');
        host.appendChild(svgEl);

        window.renderRuedaSI5(svgEl, {
          width: 800,
          height: 800,
          celdaNatural: celdaNatural,
          celdaAdaptada: celdaAdaptada,
        });

        console.log('✅ Rueda renderizada con marcadores:', { celdaNatural, celdaAdaptada });
      } else {
        // Fallback: crea un SVG mínimo para no romper
        host.innerHTML = `
          <svg id="ruedaSVG" xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
            <rect width="600" height="600" fill="#ffffff"/>
            <circle cx="300" cy="300" r="260" fill="none" stroke="#94a3b8" stroke-width="6"/>
            <text x="300" y="305" font-size="20" text-anchor="middle" fill="#64748b" font-family="Segoe UI, Arial">
              Rueda (renderer no definido)
            </text>
          </svg>
        `;
      }

      // Esperar render 2 frames
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      // Re-tomar referencia al SVG (del host oculto)
      svgElement = host.querySelector('#ruedaSVG') || host.querySelector('svg');
      if (!svgElement) throw new Error('SVG no encontrado (offscreen)');
    }

    // 3) Convertir SVG a PNG y agregar al PDF
    const imgData = await svgToPngDataUrl(svgElement, 1400, '#FFFFFF');
    doc.addImage(imgData, 'PNG', wheelX, wheelY, wheelW, wheelH);

  } catch (error) {
    console.warn('No se pudo capturar la rueda:', error);
    dibujarCuadro(doc, wheelX, wheelY, wheelW, wheelH, COLORES.textoClaro, 0.08);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(TIPOGRAFIA.cuerpo);
    doc.setTextColor(...COLORES.textoClaro);
    doc.text('Rueda DISC no disponible', wheelX + wheelW / 2, wheelY + wheelH / 2, { align: 'center' });
  }


  y += wheelH + 12;

  const cardW = (BOX_W - 10) / 2;
  const cardH = 30;
  const card1X = X_LEFT;
  const card2X = X_LEFT + cardW + 10;

  // Card Natural
  dibujarCuadro(doc, card1X, y, cardW, cardH, COLORES.C, 0.08);
  yIn = y + 9;
  iconCircle(doc, card1X + 6, yIn + 1, COLORES.C, 2.2);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...COLORES.C);
  doc.text('Perfil Natural', card1X + 14, yIn);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.textoClaro);
  doc.text('Tu estilo innato (Parte I)', card1X + 14, yIn + 6);
  doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.texto);
  doc.text(`Celda: ${celdaNatural ?? '—'}`, card1X + 14, yIn + 13);

  // Card Adaptado
  dibujarCuadro(doc, card2X, y, cardW, cardH, COLORES.acento, 0.08);
  yIn = y + 9;
  iconStar(doc, card2X + 5.2, yIn + 1.5, COLORES.acento, 6);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...COLORES.acento);
  doc.text('Perfil Adaptado', card2X + 14, yIn);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.textoClaro);
  doc.text('Tu estilo laboral (Parte II)', card2X + 14, yIn + 6);
  doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.texto);
  doc.text(`Celda: ${celdaAdaptada ?? '—'}`, card2X + 14, yIn + 13);

  y += cardH + 12;

  const interpTitle = 'Cómo Interpretar la Rueda';
  const interps = [
    'Sector de color: Define tu estilo conductual según la posición angular (CONDUCTOR, PROMOTOR, SOSTENEDOR, ANALIZADOR, etc.).',
    'Nivel (1-5): Indica intensidad del estilo. Nivel 1 (centro) = estilo muy consistente y fuerte. Nivel 5 (externo) = estilo más flexible y adaptable.',
    'Distancia Natural-Adaptado: Si círculo y estrella están cerca, tu comportamiento es estable. Si están lejos, adaptas significativamente tu conducta al entorno laboral.',
    'Separación de marcadores: Mayor distancia indica mayor esfuerzo de adaptación. Separación excesiva puede generar tensión o agotamiento a largo plazo.',
  ];

  const listH2 = heightOfList(doc, interps, W_IN - 5, TIPOGRAFIA.lista, 2);
  const interpH = PAD_Y + 9 + listH2 + PAD_Y;

  y = ensureSpace(y, interpH + 6, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
  dibujarCuadro(doc, X_LEFT, y, BOX_W, interpH, COLORES.secundario, 0.05);
  yIn = y + PAD_Y;

  iconInfo(doc, X_IN, yIn + 1, COLORES.primario);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.subtitulo); doc.setTextColor(...COLORES.primario);
  doc.text(interpTitle, X_IN + 8, yIn + 1);
  yIn += 9;

  interps.forEach((t) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.lista); doc.setTextColor(...COLORES.texto);
    doc.text('•', X_IN, yIn);
    const lines = doc.splitTextToSize(t, W_IN - 5);
    doc.text(lines, X_IN + 5, yIn);
    yIn += lines.length * TIPOGRAFIA.lista * 0.35 + 2;
  });
}

// ---------------------------------------------------------------------------
// ANÁLISIS INTERPRETATIVO
// ---------------------------------------------------------------------------
export function generarAnalisisCompleto(doc, resultado, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;
  const COL_GAP = 10;
  const COL_W = (BOX_W - COL_GAP) / 2;
  const COL_PAD_X = 6;
  const COL_PAD_Y = 7;
  const COL1_X = X_LEFT;
  const COL2_X = X_LEFT + COL_W + COL_GAP;

  let y = 35;
  dibujarTitulo(doc, 'Análisis Interpretativo Completo', y);
  y += 12;

  const introText = 'Esta sección traduce tus puntuaciones DISC en conclusiones concretas sobre tu estilo conductual. No solo muestra los números, sino que explica qué significan para ti en términos de comportamiento, preferencias y tendencias naturales en diferentes contextos.';
  const introH = PAD_Y + heightOfText(doc, introText, W_IN, TIPOGRAFIA.cuerpo, 'normal') + PAD_Y;
  y = ensureSpace(y, introH + 8, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); });
  dibujarCuadro(doc, X_LEFT, y, BOX_W, introH, COLORES.acento, 0.10);
  let yIn = y + PAD_Y;
  dibujarTexto(doc, introText, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
  y += introH + 10;

  dibujarSubtitulo(doc, 'Tu Perfil Conductual Dominante', y);
  y += 9;

  let perfil, color, descripcionPerfil, caracteristicasClave, fortalezasPerfil, areasAtencion;

  if (resultado.pctMasDI >= 60) {
    perfil = 'Orientación Activa/Extrovertida (D-I)'; color = COLORES.D;
    descripcionPerfil = `Tu perfil muestra una clara orientación hacia la acción y las relaciones. Con un ${resultado.pctMasDI}% de selecciones en características activas/extrovertidas, tiendes a actuar con rapidez, buscar interacción social, preferir entornos dinámicos y motivarte por resultados visibles y reconocimiento externo.`;
    caracteristicasClave = ['Actúas con rapidez y sentido de urgencia', 'Tomas decisiones ágiles, priorizando la acción', 'Buscas interacción social frecuente', 'Disfrutas de entornos dinámicos con variedad', 'Te motivan resultados visibles y reconocimiento', 'Prefieres el cambio sobre la rutina'];
    fortalezasPerfil = ['Inicias proyectos con energía y determinación', 'Generas entusiasmo en equipos', 'Te adaptas rápidamente a nuevas situaciones', 'Comunicas ideas con claridad y pasión'];
    areasAtencion = ['Puedes impacientarte con procesos lentos', 'Riesgo de decidir sin analizar todos los detalles', 'Tendencia a sobrecargar tu agenda', 'Recordar la importancia de la planificación'];
  } else if (resultado.pctMasSC >= 60) {
    perfil = 'Orientación Reservada/Metódica (S-C)'; color = COLORES.S;
    descripcionPerfil = `Tu perfil muestra una clara orientación hacia la estabilidad y la precisión. Con un ${resultado.pctMasSC}% de selecciones en características reservadas/metódicas, tiendes a actuar con reflexión, preferir ambientes estables, valorar la calidad sobre la velocidad y mantener relaciones cercanas de largo plazo.`;
    caracteristicasClave = ['Actúas con reflexión y análisis previo', 'Tomas decisiones tras considerar la información', 'Prefieres ambientes estables y predecibles', 'Valoras la calidad y precisión en tu trabajo', 'Trabajas de forma metódica y sistemática', 'Mantienes relaciones cercanas y duraderas'];
    fortalezasPerfil = ['Aseguras calidad y precisión en entregas', 'Mantienes consistencia en el desempeño', 'Generas confianza por tu confiabilidad', 'Analizas problemas con profundidad'];
    areasAtencion = ['Puedes resistirte a cambios necesarios', 'Riesgo de "parálisis por análisis"', 'Tendencia a evitar confrontaciones', 'Salir de la zona de confort ocasionalmente'];
  } else {
    perfil = 'Perfil Balanceado/Adaptable'; color = COLORES.primario;
    descripcionPerfil = `Tu perfil muestra un equilibrio entre características activas y reservadas (MÁS D/I: ${resultado.pctMasDI}%, MÁS S/C: ${resultado.pctMasSC}%). Esto indica alta versatilidad conductual, capacidad de adaptación a diferentes contextos y ausencia de preferencias extremas.`;
    caracteristicasClave = ['Alta versatilidad conductual', 'Capacidad de cambiar de ritmo según el contexto', 'No tienes preferencias extremas', 'Flexibilidad para trabajar solo o en equipo', 'Equilibrio entre acción y reflexión', 'Adaptabilidad a diferentes tipos de personas'];
    fortalezasPerfil = ['Te adaptas a diversos entornos de trabajo', 'Puedes desempeñarte en roles variados', 'Comprendes diferentes estilos de trabajo', 'Medias efectivamente entre extremos'];
    areasAtencion = ['Definir tu zona de máximo rendimiento', 'Evitar dispersión intentando ser bueno en todo', 'Encontrar contextos que potencien tus fortalezas', 'Evitar el rol de "comodín" permanente'];
  }

  const perfilTitleH = 8;
  const perfilDescH = heightOfText(doc, descripcionPerfil, W_IN, TIPOGRAFIA.cuerpo, 'normal');
  const carLabelH = 5;
  const carListH = heightOfList(doc, caracteristicasClave, W_IN - 6, TIPOGRAFIA.lista, 1.5);
  const perfilBoxH = PAD_Y + perfilTitleH + 2 + perfilDescH + 5 + carLabelH + carListH + PAD_Y;

  y = ensureSpace(y, perfilBoxH + 10, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); y = 35; });
  dibujarCuadro(doc, X_LEFT, y, BOX_W, perfilBoxH, color, 0.10);
  yIn = y + PAD_Y;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.subtitulo + 1); doc.setTextColor(...color);
  doc.text(perfil, X_IN, yIn); yIn += 8;

  yIn = dibujarTexto(doc, descripcionPerfil, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo); yIn += 5;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...color);
  doc.text('Características clave:', X_IN, yIn); yIn += 5;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.lista); doc.setTextColor(...COLORES.texto);
  caracteristicasClave.forEach((car) => {
    doc.text('•', X_IN, yIn);
    const lines = doc.splitTextToSize(car, W_IN - 6);
    doc.text(lines, X_IN + 4, yIn);
    yIn += lines.length * lineHeightMm(TIPOGRAFIA.lista) + 1.5;
  });

  y += perfilBoxH + 10;

  // Columnas fortalezas / áreas
  const fortListH = heightOfList(doc, fortalezasPerfil, COL_W - (COL_PAD_X * 2) - 4, TIPOGRAFIA.lista, 1.5);
  const areaListH = heightOfList(doc, areasAtencion, COL_W - (COL_PAD_X * 2) - 4, TIPOGRAFIA.lista, 1.5);
  const colsH = Math.max(COL_PAD_Y + 7 + fortListH + COL_PAD_Y, COL_PAD_Y + 7 + areaListH + COL_PAD_Y);

  y = ensureSpace(y, colsH + 10, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); y = 35; });

  dibujarCuadro(doc, COL1_X, y, COL_W, colsH, COLORES.S, 0.08);
  dibujarCuadro(doc, COL2_X, y, COL_W, colsH, COLORES.I, 0.08);

  let colY = y + COL_PAD_Y;
  drawIconLabel(doc, { icon: iconInfo, x: COL1_X + COL_PAD_X, y: colY + 1, color: COLORES.S, size: 6, text: 'Fortalezas', fontSize: TIPOGRAFIA.etiqueta, fontStyle: 'bold', textColor: COLORES.S });
  colY += 10;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.lista); doc.setTextColor(...COLORES.texto);
  fortalezasPerfil.forEach((t) => {
    doc.text('•', COL1_X + COL_PAD_X, colY);
    const lines = doc.splitTextToSize(t, COL_W - (COL_PAD_X * 2) - 4);
    doc.text(lines, COL1_X + COL_PAD_X + 4, colY);
    colY += lines.length * lineHeightMm(TIPOGRAFIA.lista) + 1.5;
  });

  colY = y + COL_PAD_Y;
  drawIconLabel(doc, { icon: iconInfo, x: COL2_X + COL_PAD_X, y: colY + 1, color: COLORES.I, size: 6, text: 'Áreas de Atención', fontSize: TIPOGRAFIA.etiqueta, fontStyle: 'bold', textColor: COLORES.I });
  colY += 10;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.lista); doc.setTextColor(...COLORES.texto);
  areasAtencion.forEach((t) => {
    doc.text('•', COL2_X + COL_PAD_X, colY);
    const lines = doc.splitTextToSize(t, COL_W - (COL_PAD_X * 2) - 4);
    doc.text(lines, COL2_X + COL_PAD_X + 4, colY);
    colY += lines.length * lineHeightMm(TIPOGRAFIA.lista) + 1.5;
  });

  y += colsH + 12;
  y = ensureSpace(y, 30, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); y = 35; });
  dibujarSubtitulo(doc, 'Tabla de Puntuaciones Detallada', y);
  y += 9;
  dibujarTablaPuntuaciones(doc, y, resultado);
}

// ---------------------------------------------------------------------------
// CONSISTENCIA DEL PERFIL
// ---------------------------------------------------------------------------
export function generarConsistencia(doc, resultado, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;

  let y = 35;
  dibujarSubtitulo(doc, 'Consistencia del Perfil', y);
  y += 11;

  const consistencia = resultado.tipoConsistencia;
  let tituloConsistencia, textoConsistencia, colorConsistencia, implicaciones;

  if (consistencia === 'consistente_DI') {
    tituloConsistencia = 'Perfil Altamente Consistente: Orientación Activa (D-I)';
    textoConsistencia = 'Existe alta consistencia en tu perfil conductual. Las características que identificas como MÁS representativas (activas/extrovertidas D-I) son complementarias con las que rechazas como MENOS representativas (reservadas/metódicas S-C). Esto indica un autoconocimiento claro y un patrón conductual bien definido hacia la acción, el liderazgo y la comunicación.';
    colorConsistencia = COLORES.D;
    implicaciones = ['Tu comportamiento es predecible y coherente en diferentes situaciones', 'Las personas pueden anticipar tus reacciones y estilo de trabajo', 'Tienes claridad sobre tus fortalezas y preferencias naturales', 'Es importante asegurar que tu entorno laboral aproveche estas fortalezas', 'Considera desarrollar flexibilidad para contextos que requieren estilo S-C'];
  } else if (consistencia === 'consistente_SC') {
    tituloConsistencia = 'Perfil Altamente Consistente: Orientación Reservada (S-C)';
    textoConsistencia = 'Existe alta consistencia en tu perfil. Las características que identificas como MÁS representativas (reservadas/metódicas S-C) son complementarias con las que rechazas como MENOS (activas/extrovertidas D-I). Esto indica autoconocimiento claro hacia la estabilidad, la cooperación, el análisis y la precisión.';
    colorConsistencia = COLORES.S;
    implicaciones = ['Tu comportamiento es estable y confiable en el tiempo', 'Las personas valoran tu consistencia y capacidad analítica', 'Tienes claridad sobre tu preferencia por calidad y estabilidad', 'Busca entornos que valoren la precisión y el trabajo metódico', 'Considera desarrollar tolerancia para situaciones de cambio rápido'];
  } else if (consistencia === 'mixto') {
    tituloConsistencia = 'Perfil Mixto: Alta Adaptabilidad Conductual';
    textoConsistencia = 'Tu perfil muestra un patrón mixto sin orientación predominante marcada. Seleccionas tanto características activas (D-I) como reservadas (S-C) como representativas. Esto puede indicar versatilidad genuina, adaptabilidad conductual o un momento de transición personal/profesional.';
    colorConsistencia = COLORES.primario;
    implicaciones = ['Posees flexibilidad para adaptarte a diversos contextos y roles', 'Puedes trabajar efectivamente tanto con ritmo acelerado como pausado', 'Tu versatilidad es un activo valioso en entornos cambiantes', 'Importante identificar en qué contextos rindes al máximo', 'Evita dispersarte: define tu zona de excelencia preferida'];
  } else {
    tituloConsistencia = 'Perfil a Analizar: Patrón de Inconsistencia';
    textoConsistencia = 'Tu perfil muestra un patrón que requiere análisis adicional. Puede ocurrir cuando hay disonancia entre lo que deseas ser y lo que crees ser, cuando factores situacionales distorsionan la autopercepción, o durante períodos de cambio significativo.';
    colorConsistencia = COLORES.I;
    implicaciones = ['Se recomienda una entrevista complementaria con un consultor DISC', 'Reflexiona sobre posibles factores que influyen en tus respuestas', 'Considera si estás en un período de transición personal/profesional', 'Evalúa si hay presión externa para comportarte de cierta manera', 'Útil re-evaluar en 3-6 meses para identificar patrones más estables'];
  }

  const bodyH = heightOfText(doc, textoConsistencia, W_IN, TIPOGRAFIA.cuerpo, 'normal');
  const netoLine1 = `Neto D/I (Activo): ${resultado.netoDI > 0 ? '+' : ''}${resultado.netoDI} — ${Math.abs(resultado.netoDI) > 10 ? 'Orientación marcada' : 'Orientación moderada'}`;
  const netoLine2 = `Neto S/C (Reservado): ${resultado.netoSC > 0 ? '+' : ''}${resultado.netoSC} — ${Math.abs(resultado.netoSC) > 10 ? 'Orientación marcada' : 'Orientación moderada'}`;
  const netoBlockH = heightOfText(doc, netoLine1, W_IN - 2, TIPOGRAFIA.cuerpo, 'normal') + heightOfText(doc, netoLine2, W_IN - 2, TIPOGRAFIA.cuerpo, 'normal');
  const implListH = heightOfList(doc, implicaciones, W_IN - 5, TIPOGRAFIA.lista, 1.5);
  const boxH = PAD_Y + 8 + 2 + bodyH + 5 + 5 + netoBlockH + 6 + 5 + implListH + PAD_Y;

  y = ensureSpace(y, boxH + 8, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); y = 35; });
  dibujarCuadro(doc, X_LEFT, y, BOX_W, boxH, colorConsistencia, 0.10);

  let yIn = y + PAD_Y;
  drawIconLabel(doc, { icon: iconInfo, x: X_IN, y: yIn + 1, color: colorConsistencia, size: 6, text: tituloConsistencia, fontSize: TIPOGRAFIA.subtitulo, fontStyle: 'bold', textColor: colorConsistencia });
  yIn += 9;

  yIn = dibujarTexto(doc, textoConsistencia, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo); yIn += 5;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...colorConsistencia);
  doc.text('Valores Neto:', X_IN, yIn); yIn += 5;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.cuerpo); doc.setTextColor(...COLORES.texto);
  doc.text('•', X_IN, yIn);
  const n1 = doc.splitTextToSize(netoLine1, W_IN - 5);
  doc.text(n1, X_IN + 4, yIn); yIn += n1.length * lineHeightMm(TIPOGRAFIA.cuerpo) + 1.5;

  doc.text('•', X_IN, yIn);
  const n2 = doc.splitTextToSize(netoLine2, W_IN - 5);
  doc.text(n2, X_IN + 4, yIn); yIn += n2.length * lineHeightMm(TIPOGRAFIA.cuerpo) + 5;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...colorConsistencia);
  doc.text('Implicaciones Prácticas:', X_IN, yIn); yIn += 5;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.lista); doc.setTextColor(...COLORES.texto);
  implicaciones.forEach((impl) => {
    doc.text('•', X_IN, yIn);
    const lines = doc.splitTextToSize(impl, W_IN - 5);
    doc.text(lines, X_IN + 4, yIn);
    yIn += lines.length * lineHeightMm(TIPOGRAFIA.lista) + 1.5;
  });
}

// ---------------------------------------------------------------------------
// COMPARATIVA PARTE I vs PARTE II
// ---------------------------------------------------------------------------
export function generarComparativaPartes(doc, resultado, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;

  let y = 35;
  dibujarTitulo(doc, 'Estabilidad del Perfil: Parte I vs Parte II', y);
  y += 12;

  const intro = 'La Parte I del test refleja tus fortalezas naturales (cómo prefieres comportarte). La Parte II refleja tu comportamiento bajo presión o en el entorno laboral. Comparar ambas revela si tu perfil es estable o si modificas tu conducta significativamente en situaciones exigentes.';
  y = dibujarTexto(doc, intro, X_LEFT, y, BOX_W, TIPOGRAFIA.cuerpo);
  y += 10;

  y = dibujarTablaComparativa(doc, y, resultado);
  y += 12;

  const diffDI = Math.abs(resultado.masDI_P1 - resultado.masDI_P2);
  const diffSC = Math.abs(resultado.masSC_P1 - resultado.masSC_P2);
  const diffTotal = diffDI + diffSC;

  let titulo, color, interpretacion;
  if (diffTotal <= 4) {
    titulo = 'Perfil Muy Estable'; color = COLORES.S;
    interpretacion = `Tu comportamiento es consistente entre situaciones normales y bajo presión. Las diferencias son mínimas (${diffTotal} puntos de diferencia total). Esto indica que tu comportamiento natural coincide con tu comportamiento adaptado; no modificas significativamente tu conducta bajo estrés y las personas te perciben como predecible y congruente.`;
  } else if (diffTotal <= 8) {
    titulo = 'Perfil Adaptable con Núcleo Estable'; color = COLORES.primario;
    interpretacion = `Muestras cierta adaptación conductual pero mantienes tu esencia. Hay diferencias moderadas (${diffTotal} puntos). Adaptas tu comportamiento según el contexto sin forzarte demasiado. Este nivel de adaptación suele ser saludable y refleja flexibilidad.`;
  } else {
    titulo = 'Perfil con Adaptación Significativa'; color = COLORES.D;
    interpretacion = `Modificas considerablemente tu comportamiento bajo presión. Hay diferencias notables (${diffTotal} puntos). Existe una brecha entre tu estilo natural y tu estilo laboral; a largo plazo, esta adaptación puede generar tensión o agotamiento. Recomendación: evalúa si tu rol actual está alineado con tus fortalezas naturales.`;
  }

  const detalle = `Diferencia total: ${diffTotal} puntos (D/I: ${diffDI}, S/C: ${diffSC})`;
  const detalleH = heightOfText(doc, detalle, W_IN, TIPOGRAFIA.secundario, 'normal');
  const interpH = heightOfText(doc, interpretacion, W_IN, TIPOGRAFIA.cuerpo, 'normal');
  const boxH = PAD_Y + 8 + 3 + detalleH + 4 + interpH + PAD_Y;

  y = ensureSpace(y, boxH + 6, () => { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); y = 35; });
  dibujarCuadro(doc, X_LEFT, y, BOX_W, boxH, color, 0.10);
  let yIn = y + PAD_Y;

  drawIconLabel(doc, { icon: iconInfo, x: X_IN, y: yIn + 1, color, size: 6, text: titulo, fontSize: TIPOGRAFIA.subtitulo, fontStyle: 'bold', textColor: color });
  yIn += 9;

  doc.setFont('helvetica', 'normal'); doc.setFontSize(TIPOGRAFIA.secundario); doc.setTextColor(...COLORES.textoClaro);
  doc.text(doc.splitTextToSize(detalle, W_IN), X_IN, yIn);
  yIn += detalleH + 4;

  dibujarTexto(doc, interpretacion, X_IN, yIn, W_IN, TIPOGRAFIA.cuerpo);
}

// ---------------------------------------------------------------------------
// IMPLICACIONES PRÁCTICAS
// ---------------------------------------------------------------------------
export function generarImplicaciones(doc, resultado, nombreCompleto) {
  nuevaPagina(doc, nombreCompleto);
  agregarEncabezado(doc);

  const X_LEFT = 15;
  const BOX_W = 180;
  const PAD_X = 6;
  const PAD_Y = 7;
  const X_IN = X_LEFT + PAD_X;
  const W_IN = BOX_W - PAD_X * 2;
  const LIST_X = X_IN + 5;
  const LIST_W = W_IN - 5;

  function newPage() { nuevaPagina(doc, nombreCompleto); agregarEncabezado(doc); }

  let y = 35;
  dibujarTitulo(doc, 'Implicaciones Prácticas de tu Perfil', y);
  y += 12;

  let fortalezas, atencion, comunicacion, entorno;

  if (resultado.pctMasDI >= 60) {
    fortalezas = ['Capacidad de generar resultados rápidos y tomar decisiones ágiles sin dudar', 'Habilidad natural para liderar equipos y motivar a otros hacia objetivos', 'Alta adaptabilidad a cambios y entornos dinámicos e impredecibles', 'Comunicación efectiva y capacidad de persuasión en presentaciones', 'Energía contagiosa y proactividad en la ejecución de proyectos nuevos'];
    atencion = ['Puedes impacientarte con procesos lentos o que requieren análisis detallado', 'Riesgo de tomar decisiones sin considerar toda la información disponible', 'Tendencia a sobrecargar la agenda con demasiadas actividades simultáneas', 'Importante recordar la importancia de la planificación y el seguimiento', 'Puedes descuidar el seguimiento detallado de tareas ya iniciadas'];
    comunicacion = ['Sé directo y ve al punto: esta persona valora la eficiencia y claridad', 'Enfócate en resultados concretos y beneficios tangibles del proyecto', 'Permite que tome el liderazgo de conversaciones y proponga ideas nuevas', 'Ofrece variedad y estímulo constante; evita la monotonía en las tareas', 'Reconoce sus logros de forma visible y pública cuando sea apropiado'];
    entorno = ['Entornos dinámicos con desafíos constantes y oportunidades de crecimiento', 'Oportunidades claras de liderazgo y responsabilidad en toma de decisiones', 'Autonomía y libertad para actuar sin microgestión excesiva', 'Contacto frecuente con diversas personas, equipos y stakeholders', 'Reconocimiento visible y público por resultados y logros alcanzados'];
  } else if (resultado.pctMasSC >= 60) {
    fortalezas = ['Atención excepcional al detalle y precisión en la ejecución del trabajo', 'Capacidad de análisis profundo y pensamiento crítico ante problemas complejos', 'Consistencia y alta confiabilidad en el cumplimiento de compromisos', 'Paciencia genuina para procesos largos y tareas que requieren meticulosidad', 'Construcción de relaciones estables, sólidas y de largo plazo con colegas'];
    atencion = ['Puedes resistirte excesivamente a cambios organizacionales necesarios', 'Riesgo de "parálisis por análisis": dificultad para decidir con información limitada', 'Tendencia a evitar confrontaciones incluso cuando son necesarias para avanzar', 'Necesidad de salir periódicamente de la zona de confort para crecer', 'Puedes perder oportunidades importantes por exceso de cautela o análisis'];
    comunicacion = ['Proporciona información completa, detallada y fundamentada con evidencia', 'Dale tiempo suficiente para procesar información y responder; no lo presiones', 'Respeta su necesidad de preparación previa antes de reuniones importantes', 'Valora explícitamente la calidad de su trabajo, no solo la velocidad de entrega', 'Comunica cambios con anticipación suficiente y explicaciones claras del por qué'];
    entorno = ['Ambientes estables con procesos bien definidos y documentados', 'Tiempo suficiente para analizar información antes de tomar decisiones', 'Estándares de calidad claramente definidos y comunicados', 'Relaciones de trabajo armoniosas, predecibles y duraderas', 'Reconocimiento sincero por precisión, exactitud y trabajo bien hecho'];
  } else {
    fortalezas = ['Alta versatilidad para adaptarte efectivamente a situaciones muy diferentes', 'Equilibrio natural entre acción rápida y reflexión analítica según necesidad', 'Capacidad de trabajar tanto en equipo como de forma completamente independiente', 'Flexibilidad para cambiar de ritmo de trabajo según lo requiera el contexto', 'Comprensión profunda y apreciación de diferentes estilos de trabajo'];
    atencion = ['Necesidad de definir claramente cuál es tu zona de máximo rendimiento', 'Riesgo de dispersarte intentando ser bueno en absolutamente todo', 'Posible falta de identidad profesional clara si no defines preferencias', 'Importante encontrar el contexto específico que potencia tus fortalezas', 'Evitar aceptar permanentemente el rol de "comodín" sin especialización'];
    comunicacion = ['Adapta tu estilo de comunicación según el contexto; esta persona es flexible', 'Ofrece tanto desafíos estimulantes como momentos de estabilidad predecible', 'Valora explícitamente su capacidad única de adaptación a diferentes situaciones', 'Dale oportunidades variadas de desarrollo en múltiples áreas', 'Ayúdale a identificar progresivamente su zona personal de excelencia'];
    entorno = ['Entornos con variedad genuina de tareas y responsabilidades diversas', 'Oportunidades para explorar y experimentar con diferentes roles', 'Balance saludable entre estructura organizacional y flexibilidad operativa', 'Proyectos que combinen elementos de acción rápida con análisis profundo', 'Equipos diversos con diferentes estilos de trabajo complementarios'];
  }

  const secciones = [
    { titulo: 'Tus Fortalezas Naturales', items: fortalezas, color: COLORES.S, icon: iconFlex },
    { titulo: 'Áreas que Requieren Atención', items: atencion, color: COLORES.I, icon: iconWarnTriangle },
    { titulo: 'Cómo Comunicarse Contigo', items: comunicacion, color: COLORES.C, icon: iconChat },
    { titulo: 'Tu Entorno de Trabajo Ideal', items: entorno, color: COLORES.primario, icon: iconBriefcase },
  ];

  secciones.forEach((sec) => {
    const listH = heightOfList(doc, sec.items, LIST_W - 5, TIPOGRAFIA.lista, 1.5);
    const boxH = PAD_Y + 8 + 3 + listH + PAD_Y;

    y = ensureSpace(y, boxH + 6, () => { newPage(); y = 35; });
    dibujarCuadro(doc, X_LEFT, y, BOX_W, boxH, sec.color, 0.08);

    let yIn = y + PAD_Y;
    drawIconLabel(doc, { icon: sec.icon, x: X_IN, y: yIn + 1, color: sec.color, size: 6.5, text: sec.titulo, fontSize: TIPOGRAFIA.subtitulo, fontStyle: 'bold', textColor: sec.color });
    yIn += 9;
    yIn = dibujarLista(doc, sec.items, LIST_X, yIn, LIST_W, TIPOGRAFIA.lista, 1.5);

    y += boxH + 8;
  });
}

// ---------------------------------------------------------------------------
// ICONOS VECTORIALES
// ---------------------------------------------------------------------------
export function iconFlex(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8 * s);
    doc.line(x + 1.0*s, y - 1.0*s, x + 2.2*s, y - 2.2*s);
    doc.line(x + 2.2*s, y - 2.2*s, x + 3.6*s, y - 1.4*s);
    doc.line(x + 3.6*s, y - 1.4*s, x + 4.6*s, y - 2.2*s);
    doc.line(x + 4.6*s, y - 2.2*s, x + 5.2*s, y - 1.2*s);
    doc.line(x + 3.6*s, y - 1.4*s, x + 3.6*s, y + 0.8*s);
    doc.line(x + 3.6*s, y + 0.8*s, x + 2.4*s, y + 0.8*s);
    doc.circle(x + 2.4*s, y - 0.3*s, 1.1*s, 'S');
  });
}

export function iconWarnTriangle(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8 * s);
    doc.lines([[2.5*s, -4.2*s],[2.5*s, 4.2*s],[-5.0*s, 0]], x + 0.8*s, y + 0.2*s, [1, 1], 'S', false);
    doc.line(x + 3.3*s, y - 2.1*s, x + 3.3*s, y - 0.6*s);
    doc.circle(x + 3.3*s, y + 0.4*s, 0.18*s, 'S');
  });
}

export function iconChat(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8 * s);
    doc.roundedRect(x + 0.6*s, y - 3.6*s, 5.0*s, 3.4*s, 0.7*s, 0.7*s, 'S');
    doc.line(x + 2.0*s, y - 0.2*s, x + 1.6*s, y + 0.8*s);
    doc.line(x + 1.6*s, y + 0.8*s, x + 2.8*s, y + 0.1*s);
    doc.circle(x + 2.2*s, y - 2.0*s, 0.15*s, 'S');
    doc.circle(x + 3.1*s, y - 2.0*s, 0.15*s, 'S');
    doc.circle(x + 4.0*s, y - 2.0*s, 0.15*s, 'S');
  });
}

export function iconBriefcase(doc, x, y, color, size = 6) {
  withGState(doc, () => {
    const s = size / 6;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8 * s);
    doc.roundedRect(x + 0.8*s, y - 3.2*s, 4.8*s, 3.4*s, 0.6*s, 0.6*s, 'S');
    doc.roundedRect(x + 2.2*s, y - 4.1*s, 2.0*s, 1.2*s, 0.5*s, 0.5*s, 'S');
    doc.line(x + 0.8*s, y - 1.5*s, x + 5.6*s, y - 1.5*s);
  });
}

// ---------------------------------------------------------------------------
// DETALLE PREGUNTA POR PREGUNTA
// ---------------------------------------------------------------------------
export function generarDetalle(doc, resultado, nombreCompleto) {
    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);
    let y = 35;
    dibujarSubtitulo(doc, 'Parte I — Preguntas 1-14 (Fortalezas Naturales)', y);
    y += 9;
    y = dibujarTablaDetalle(doc, y, resultado.detallePreguntas.filter(p => p.parte === 'I'));

    nuevaPagina(doc, nombreCompleto);
    agregarEncabezado(doc);
    y = 35;
    dibujarSubtitulo(doc, 'Parte II — Preguntas 15-28 (Comportamiento Bajo Presión)', y);
    y += 9;
    y = dibujarTablaDetalle(doc, y, resultado.detallePreguntas.filter(p => p.parte === 'II'));

    y += 10;
    dibujarCuadro(doc, 15, y, 180, 18, COLORES.textoClaro, 0.05);
    y += 7;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(TIPOGRAFIA.etiqueta); doc.setTextColor(...COLORES.texto);
    doc.text('Leyenda:', 20, y); y += 6;
    dibujarTexto(doc, 'Cada fila muestra los 4 adjetivos del grupo. D/I = características activas/extrovertidas, S/C = características reservadas/metódicas. La columna "MÁS" indica el grupo de la característica seleccionada como más descriptiva, "MENOS" indica el grupo de la rechazada.', 20, y, 170, TIPOGRAFIA.secundario, COLORES.textoClaro);
}