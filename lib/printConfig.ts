/**
 * printConfig.ts
 *
 * Single source of truth for paper dimensions and pagination constants.
 * All measurements are in millimetres (mm).
 *
 * Design rationale
 * ────────────────
 * • Page margin is 8 mm on every side (matches the @page margin in globals.css).
 * • Header height is a conservative estimate for the PrintMetadata block (~28 mm).
 * • Totals footer is ~24 mm (3 rows × ~8 mm each).
 * • Signature row is ~10 mm.
 * • Data-row height is enforced at ROW_HEIGHT_MM via CSS `height` on <tr>.
 * • thead occupies ~8 mm (two header rows).
 *
 * Pagination formula
 * ──────────────────
 *   usable = pageHeight − 2*margin
 *   page1  = floor( (usable − headerHeight − theadHeight − totalsHeight) / rowHeight )
 *   pageN  = floor( (usable − theadHeight − totalsHeight) / rowHeight )
 */

import type { Orientation, PaperSize } from "./types";

const PAGE_MARGIN_MM = 8;

/** Physical paper dimensions in mm: [width, height] in portrait orientation. */
const PAPER_DIMENSIONS: Record<PaperSize, [number, number]> = {
  A4: [210, 297],
  A3: [297, 420],
  Letter: [216, 279],
};

/** Fixed heights used in the pagination formula (mm). */
const THEAD_MM = 9;
const TOTALS_FOOTER_MM = 26; // enough for prev-page + this-page + grand-total rows
const HEADER_METADATA_MM = 30; // PrintMetadata block (title + grid)
export const ROW_HEIGHT_MM = 20; // enforced via CSS on tbody > tr

/**
 * Returns the printable page height in mm for the given paper size and orientation.
 * In landscape mode the shorter dimension becomes the height.
 */
export function printableHeight(paperSize: PaperSize, orientation: Orientation): number {
  const [shortSide, longSide] = PAPER_DIMENSIONS[paperSize];
  const rawHeight = orientation === "landscape" ? shortSide : longSide;
  return rawHeight - 2 * PAGE_MARGIN_MM;
}

/**
 * Returns the printable page width in mm for the given paper size and orientation.
 */
export function printableWidth(paperSize: PaperSize, orientation: Orientation): number {
  const [shortSide, longSide] = PAPER_DIMENSIONS[paperSize];
  return orientation === "landscape" ? longSide : shortSide;
}

/**
 * Calculates how many data rows fit on the first page (which includes the metadata header).
 */
export function rowsPerFirstPage(paperSize: PaperSize, orientation: Orientation): number {
  const usable = printableHeight(paperSize, orientation);
  return Math.max(
    1,
    Math.floor((usable - HEADER_METADATA_MM - THEAD_MM - TOTALS_FOOTER_MM) / ROW_HEIGHT_MM),
  );
}

/**
 * Calculates how many data rows fit on subsequent pages (no metadata header).
 */
export function rowsPerOtherPages(paperSize: PaperSize, orientation: Orientation): number {
  const usable = printableHeight(paperSize, orientation);
  return Math.max(
    1,
    Math.floor((usable - THEAD_MM - TOTALS_FOOTER_MM) / ROW_HEIGHT_MM),
  );
}

/**
 * Splits an array of rows into page-sized chunks based on paper/orientation.
 */
export function chunkRowsByPageSize<T>(
  rows: T[],
  paperSize: PaperSize,
  orientation: Orientation,
): T[][] {
  const firstCapacity = rowsPerFirstPage(paperSize, orientation);
  const otherCapacity = rowsPerOtherPages(paperSize, orientation);

  const chunks: T[][] = [];
  chunks.push(rows.slice(0, firstCapacity));

  for (let i = firstCapacity; i < rows.length; i += otherCapacity) {
    chunks.push(rows.slice(i, i + otherCapacity));
  }

  return chunks.length ? chunks : [[]];
}

/**
 * Returns how many rows precede a given page index — needed for row numbering and totals.
 */
export function rowOffsetForPage(
  pageIndex: number,
  paperSize: PaperSize,
  orientation: Orientation,
): number {
  if (pageIndex === 0) return 0;
  const firstCapacity = rowsPerFirstPage(paperSize, orientation);
  const otherCapacity = rowsPerOtherPages(paperSize, orientation);
  return firstCapacity + (pageIndex - 1) * otherCapacity;
}
