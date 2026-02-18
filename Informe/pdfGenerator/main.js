/**
 * ============================================================================
 * main.js — Punto de entrada principal del generador de PDF DISC
 * ----------------------------------------------------------------------------
 * Responsabilidades:
 *  - Inicializar el documento y variables compartidas
 *  - Orquestar la llamada ordenada a todas las secciones del informe
 *  - Exponer la función global `generarPDFInforme` para el contexto browser
 *
 * Orden de generación:
 *  1. Portada             → pdfSections.generarPortada
 *  2. Índice              → pdfSections.generarIndice
 *  3. Introducción        → pdfSections.generarIntroduccion
 *  4. Historia            → pdfSections.generarHistoria
 *  5. Ejes fundamentales  → pdfSections.generarEjes
 *  6. 8 Estilos           → pdfSections.generarEstilos
 *  7. Dimensiones D/I/S/C → pdfSections.generarDimensionesCompletas
 *  8. Aplicaciones        → pdfSections.generarAplicaciones
 *  9. Consideraciones     → pdfSections.generarConsideraciones
 * 10. Resumen             → pdfSections.generarResumen
 * 11. Gráfico de barras   → pdfSections.generarGraficoBarras
 * 12. Rueda DISC          → pdfSections.generarRueda
 * 13. Análisis            → pdfSections.generarAnalisisCompleto
 * 14. Consistencia        → pdfSections.generarConsistencia
 * 15. Comparativa partes  → pdfSections.generarComparativaPartes
 * 16. Implicaciones       → pdfSections.generarImplicaciones
 * 17. Detalle preguntas   → pdfSections.generarDetalle
 * ============================================================================
 */

import { crearDocumento, paginacion } from './pdfConfig.js';
import {
  generarPortada,
  generarIndice,
  generarIntroduccion,
  generarHistoria,
  generarEjes,
  generarEstilos,
  generarDimensionesCompletas,
  generarAplicaciones,
  generarConsideraciones,
  generarResumen,
  generarGraficoBarras,
  generarRueda,
  generarAnalisisCompleto,
  generarConsistencia,
  generarComparativaPartes,
  generarImplicaciones,
  generarDetalle,
} from './pdfSections.js';

// ---------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL
// ---------------------------------------------------------------------------

/**
 * Genera y descarga el informe DISC completo en formato PDF.
 *
 * @param {object} data             - Datos del evaluado (Nombre, Apellido, Correo, Fecha, etc.)
 * @param {object} resultado        - Objeto con todos los puntajes, niveles y análisis calculados
 * @param {object} respuestasParsed - Mapa id→valor de las respuestas del formulario
 */
async function generarPDFInforme(data, resultado, respuestasParsed) {
  // ── 1. Inicialización ───────────────────────────────────────────────────
  const doc = crearDocumento();
  if (!doc) return;   // crearDocumento() ya mostró el alert en caso de error

  // Resetear contador de páginas para esta ejecución
  paginacion.actual = 0;

  // Datos derivados compartidos por varias secciones
  const nombreCompleto = `${data.Nombre || ''} ${data.Apellido || ''}`.trim();
  const fecha = data.Fecha
    ? new Date(data.Fecha).toLocaleDateString('es-AR', {
        year:  'numeric',
        month: 'long',
        day:   'numeric',
      })
    : '';

  try {
    console.log('📄 Generando PDF completo...');

    // ── 2. Secciones teóricas ─────────────────────────────────────────────
    generarPortada(doc, data, resultado, nombreCompleto, fecha);
    generarIndice(doc, nombreCompleto);
    generarIntroduccion(doc, nombreCompleto);
    generarHistoria(doc, nombreCompleto);
    generarEjes(doc, nombreCompleto);
    generarEstilos(doc, nombreCompleto);
    generarDimensionesCompletas(doc, nombreCompleto);
    generarAplicaciones(doc, nombreCompleto);
    generarConsideraciones(doc, nombreCompleto);

    // ── 3. Secciones de resultados ────────────────────────────────────────
    generarResumen(doc, resultado, nombreCompleto);
    await generarGraficoBarras(doc, resultado, respuestasParsed, nombreCompleto);
    await generarRueda(doc, respuestasParsed, nombreCompleto);
    generarAnalisisCompleto(doc, resultado, nombreCompleto);
    generarConsistencia(doc, resultado, nombreCompleto);
    generarComparativaPartes(doc, resultado, nombreCompleto);
    generarImplicaciones(doc, resultado, nombreCompleto);
    generarDetalle(doc, resultado, nombreCompleto);

    // ── 4. Guardar ────────────────────────────────────────────────────────
    const filename = `Informe_DISC_Completo_${nombreCompleto.replace(/ /g, '_')}.pdf`;
    doc.save(filename);

    console.log('✅ PDF generado exitosamente:', filename);

  } catch (error) {
    console.error('❌ Error durante la generación del PDF:', error);
    alert(`Error al generar el PDF: ${error.message}`);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Exponer globalmente para ser llamado desde HTML / otros scripts
// ---------------------------------------------------------------------------
window.generarPDFInforme = generarPDFInforme;

console.log('✅ main.js cargado correctamente');