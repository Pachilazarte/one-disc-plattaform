/**
 * ============================================================================
 * pdfUtils.js — Funciones auxiliares y helpers
 * ----------------------------------------------------------------------------
 * Responsabilidades:
 *  - Helpers de layout (espacio disponible, altura estimada de bloques)
 *  - Primitivas de dibujo reutilizables (cuadros, títulos, subtítulos,
 *    texto con wrap, listas con bullet)
 *  - Cálculo de valores DISC a partir de las respuestas del test
 * ============================================================================
 */

import { COLORES, PAGE_CONFIG } from './pdfConfig.js';

// ---------------------------------------------------------------------------
// HELPERS DE LAYOUT
// ---------------------------------------------------------------------------

/**
 * Aproxima la altura en mm que ocupa una línea de texto al fontSize dado.
 * Usado para estimar bloques antes de dibujarlos.
 */
export function lineHeightMm(fontSize) {
  return fontSize * 0.35;
}

/**
 * Calcula la altura total en mm que ocupa un bloque de texto con wrap.
 * @param {object} doc       - Instancia jsPDF
 * @param {string} text      - Texto a medir
 * @param {number} maxWidth  - Ancho máximo en mm
 * @param {number} fontSize
 * @param {string} fontStyle - 'normal' | 'bold'
 */
export function heightOfText(doc, text, maxWidth, fontSize, fontStyle = 'normal') {
  doc.setFont('helvetica', fontStyle);
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  return lines.length * lineHeightMm(fontSize);
}

/**
 * Calcula la altura total en mm que ocupa una lista de items.
 * @param {object} doc
 * @param {string[]} items
 * @param {number} maxWidth
 * @param {number} fontSize
 * @param {number} lineGap   - Espacio extra entre items (mm)
 */
export function heightOfList(doc, items, maxWidth, fontSize, lineGap = 1) {
  doc.setFontSize(fontSize);
  let h = 0;
  items.forEach(item => {
    const lines = doc.splitTextToSize(item, maxWidth);
    h += lines.length * lineHeightMm(fontSize) + lineGap;
  });
  return h;
}

/**
 * Verifica si hay espacio suficiente en la página actual.
 * Si no hay espacio llama a la callback `onNewPage` y retorna MARGIN_TOP.
 * @param {number} currentY
 * @param {number} neededH
 * @param {Function} onNewPage  - Callback que debe agregar nueva página y encabezado
 */
export function ensureSpace(currentY, neededH, onNewPage) {
  const CONTENT_BOTTOM = /* se calcula dinámicamente */ 297 - PAGE_CONFIG.FOOTER_H;
  if (currentY + neededH > CONTENT_BOTTOM) {
    onNewPage();
    return PAGE_CONFIG.MARGIN_TOP;
  }
  return currentY;
}

// ---------------------------------------------------------------------------
// PRIMITIVAS DE DIBUJO
// ---------------------------------------------------------------------------

/**
 * Dibuja un rectángulo redondeado con fondo semitransparente.
 * Usado como fondo decorativo de secciones.
 */
export function dibujarCuadro(doc, x, y, ancho, alto, color, opacity = 0.1) {
  doc.saveGraphicsState();
  doc.setFillColor(...color);
  doc.setGState(new doc.GState({ opacity }));
  doc.roundedRect(x, y, ancho, alto, 3, 3, 'F');
  doc.restoreGraphicsState();
}

/**
 * Dibuja un título de sección con subrayado de acento.
 */
export function dibujarTitulo(doc, texto, y, size = 18) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  doc.setTextColor(...COLORES.texto);
  doc.text(texto, 15, y);

  doc.setDrawColor(...COLORES.secundario);
  doc.setLineWidth(2);
  doc.line(15, y + 2, 15 + doc.getTextWidth(texto), y + 2);
}

/**
 * Dibuja un subtítulo de subsección (sin subrayado).
 */
export function dibujarSubtitulo(doc, texto, y, size = 12) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  doc.setTextColor(...COLORES.primario);
  doc.text(texto, 15, y);
}

/**
 * Dibuja texto con wrap automático.
 * @returns {number} Nueva posición Y después del texto
 */
export function dibujarTexto(doc, texto, x, y, maxWidth = 180, size = 10, color = COLORES.texto) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(texto, maxWidth);
  doc.text(lines, x, y);
  return y + (lines.length * size * 0.35);
}

/**
 * Dibuja una lista con bullet point (•).
 * @returns {number} Nueva posición Y al final de la lista
 */
export function dibujarLista(doc, items, x, y, maxWidth = 170, fontSize = 9, lineGap = 1) {
  let currentY = y;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORES.texto);

  items.forEach(item => {
    doc.text('•', x, currentY);

    const lines = doc.splitTextToSize(item, maxWidth - 5);
    doc.text(lines, x + 5, currentY);

    currentY += lines.length * lineHeightMm(fontSize) + lineGap;
  });

  return currentY;
}


// ---------------------------------------------------------------------------
// CÁLCULO DE VALORES DISC
// ---------------------------------------------------------------------------

/**
 * Calcula los porcentajes D / I / S / C a partir del objeto de respuestas.
 * Cada valor se expresa en escala 0-100.
 *
 * @param {object} respuestas - Mapa de id de respuesta → valor (5 = activo, otro = reservado)
 * @returns {{ D: number, I: number, S: number, C: number }}
 */
export function calcularValoresDISC(respuestas) {
  let D = 0, I = 0, S = 0, C = 0;

  for (let q = 1; q <= 28; q++) {
    // Determinar el id del campo "MÁS" para cada pregunta
    let idMas;
    if (q <= 14) {
      idMas = (q - 1) * 2 + 1;
    } else {
      idMas = 28 + (q - 15) * 2 + 1;
    }

    const valMas = respuestas[idMas];

    if (valMas !== undefined) {
      const isActivo = valMas === 5;
      const qMod = (q - 1) % 4;

      if (isActivo) {
        if (qMod === 0 || qMod === 1) D++;
        else I++;
      } else {
        if (qMod === 0 || qMod === 1) S++;
        else C++;
      }
    }
  }

  const total = D + I + S + C;
  return {
    D: total > 0 ? Math.round((D / total) * 100) : 0,
    I: total > 0 ? Math.round((I / total) * 100) : 0,
    S: total > 0 ? Math.round((S / total) * 100) : 0,
    C: total > 0 ? Math.round((C / total) * 100) : 0,
  };
}

export function canvasToCroppedPng(canvas, padding = 16) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const img = ctx.getImageData(0, 0, w, h).data;

  const isBg = (r, g, b, a) => a === 0 || (r > 245 && g > 245 && b > 245);

  let minX = w, minY = h, maxX = 0, maxY = 0;
  let found = false;

  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      const i = (yy * w + xx) * 4;
      const r = img[i], g = img[i + 1], b = img[i + 2], a = img[i + 3];

      if (!isBg(r, g, b, a)) {
        found = true;
        if (xx < minX) minX = xx;
        if (yy < minY) minY = yy;
        if (xx > maxX) maxX = xx;
        if (yy > maxY) maxY = yy;
      }
    }
  }

  if (!found) return canvas.toDataURL('image/png');

  // Expande con padding
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(w - 1, maxX + padding);
  maxY = Math.min(h - 1, maxY + padding);

  // ✅ Re-corte centrado horizontalmente:
  // Tomamos el centro del contenido y armamos un recorte simétrico
  const contentCenterX = (minX + maxX) / 2;
  const halfW = Math.max(contentCenterX - minX, maxX - contentCenterX);

  // suma un margen extra a derecha/izquierda para evitar cortes (C / labels)
  const extraSide = Math.ceil(padding * 0.8);

  let symMinX = Math.floor(contentCenterX - halfW) - extraSide;
  let symMaxX = Math.ceil(contentCenterX + halfW) + extraSide;

  symMinX = Math.max(0, symMinX);
  symMaxX = Math.min(w - 1, symMaxX);

  const cropW = symMaxX - symMinX + 1;
  const cropH = maxY - minY + 1;

  const tmp = document.createElement('canvas');
  tmp.width = cropW;
  tmp.height = cropH;

  const tctx = tmp.getContext('2d');
  tctx.drawImage(canvas, symMinX, minY, cropW, cropH, 0, 0, cropW, cropH);

  return tmp.toDataURL('image/png');
}

