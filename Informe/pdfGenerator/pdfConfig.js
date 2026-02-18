/**
 * ============================================================================
 * pdfConfig.js — Configuración del documento PDF
 * ----------------------------------------------------------------------------
 * Responsabilidades:
 *  - Inicialización de jsPDF
 *  - Paleta de colores del tema
 *  - Constantes de márgenes y dimensiones de página
 *  - Encabezado y pie de página
 *  - Control de paginación
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Paleta de colores centralizada
// Modificar aquí para cambiar el tema visual de todo el informe
// ---------------------------------------------------------------------------
export const COLORES = {
  primario:    [11,  74,  110],
  secundario:  [107, 225, 227],
  acento:      [225, 123, 215],
  texto:       [26,  24,  29],
  textoClaro:  [164, 168, 192],
  fondo:       [249, 250, 251],
  D:           [220, 38,  38],
  I:           [217, 119, 6],
  S:           [5,   150, 105],
  C:           [37,  99,  235]
};

// ---------------------------------------------------------------------------
// Dimensiones de la página A4 (en mm)
// ---------------------------------------------------------------------------
export const PAGE_CONFIG = {
  MARGIN_L:       15,
  MARGIN_R:       15,
  MARGIN_TOP:     35,   // Y desde donde arranca el contenido tras el encabezado
  FOOTER_H:       18,   // Espacio reservado para el pie de página
};

// ---------------------------------------------------------------------------
// Inicialización del documento jsPDF
// Retorna { doc } listo para usar
// ---------------------------------------------------------------------------
export function crearDocumento() {
  const jsPDF = window.jspdf?.jsPDF || window.jsPDF;

  if (!jsPDF) {
    console.error('jsPDF no está disponible');
    alert('Error: La librería jsPDF no se cargó correctamente. Por favor, recargá la página e intentá nuevamente.');
    return null;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit:        'mm',
    format:      'a4',
    compress:    true
  });

  return doc;
}

// ---------------------------------------------------------------------------
// Estado de paginación — se mantiene como objeto mutable para compartir
// entre módulos sin perder la referencia
// ---------------------------------------------------------------------------
export const paginacion = { actual: 0 };

// ---------------------------------------------------------------------------
// Agrega el pie de página a la hoja actual
// Debe llamarse inmediatamente después de doc.addPage()
// ---------------------------------------------------------------------------
export function agregarPieDePagina(doc, nombreCompleto) {
  const pageHeight = doc.internal.pageSize.height;

  doc.setDrawColor(...COLORES.secundario);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 15, 195, pageHeight - 15);

  doc.setTextColor(...COLORES.textoClaro);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `© 2026 Escencial Consultora — Informe confidencial para ${nombreCompleto}`,
    105, pageHeight - 10, { align: 'center' }
  );

  doc.text(`Página ${paginacion.actual}`, 195, pageHeight - 10, { align: 'right' });
}

// ---------------------------------------------------------------------------
// Agrega una nueva página y actualiza el contador
// ---------------------------------------------------------------------------
export function nuevaPagina(doc, nombreCompleto) {
  if (paginacion.actual > 0) doc.addPage();
  paginacion.actual++;
  agregarPieDePagina(doc, nombreCompleto);
}

// ---------------------------------------------------------------------------
// Dibuja el encabezado superior izquierdo con la marca "DISC"
// Llamar después de nuevaPagina() en secciones de contenido
// ---------------------------------------------------------------------------
export function agregarEncabezado(doc) {
  doc.setFillColor(...COLORES.primario);
  doc.rect(15, 10, 50, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DISC', 17, 17);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Informe Profesional', 17, 21);
}

// ============================================================================
// TIPOGRAFÍA — Sistema centralizado de tamaños
// ============================================================================
export const TIPOGRAFIA = {
  // Títulos de sección (ej: "Introducción al Modelo DISC")
  titulo: 16,

  // Subtítulos dentro de sección (ej: "¿Para qué sirve el DISC?")
  subtitulo: 13,

  // Texto de cuerpo principal (párrafos descriptivos)
  cuerpo: 11,

  // Items de listas con bullet
  lista: 10,

  // Etiquetas de sección dentro de cuadros (ej: "Características:", "Fortalezas:")
  etiqueta: 10,

  // Texto secundario / aclaratorio (ej: subtítulos de tarjetas, leyendas)
  secundario: 9,

  // Texto muy pequeño (ej: pie de página, notas al pie)
  micro: 8,

  // Headers de dimensión (letra grande D/I/S/C)
  headerLetra: 32,
  headerNombre: 20,
  headerSubtitulo: 11,
};