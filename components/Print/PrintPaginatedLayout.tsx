"use client";

import { formatArea, getAllDivisionTotal, getDivisionTotal, getOriginalTotal } from "@/lib/calculator";
import { useScheduleStore } from "@/lib/store";
import { chunkRowsByPageSize, rowOffsetForPage, ROW_HEIGHT_MM, printableWidth, printableHeight } from "@/lib/printConfig";
import type { BoundaryField, ParcelField, ScheduleRow } from "@/lib/types";

const parcelFields: Array<{ field: ParcelField; label: string }> = [
  { field: "jamabandi", label: "जमाबंदी नं." },
  { field: "khata", label: "खाता नं." },
  { field: "khesra", label: "खेसरा नं." },
  { field: "area", label: "रकवा" },
];

const divisionParcelFields = parcelFields.filter(({ field }) => field !== "jamabandi");

const boundaryRows: Array<Array<{ field: BoundaryField; label: string }>> = [
  [
    { field: "north", label: "उ." },
    { field: "east", label: "पू." },
  ],
  [
    { field: "south", label: "द." },
    { field: "west", label: "प." },
  ],
];

function divisionTotals(rows: ScheduleRow[], personCount: number) {
  return Array.from({ length: personCount }).map((_, index) => getDivisionTotal(rows, index));
}

function PrintTotalsRow({
  label,
  rows,
  personCount,
  emphasis = false,
}: {
  label: string;
  rows: ScheduleRow[];
  personCount: number;
  emphasis?: boolean;
}) {
  const originalTotal = getOriginalTotal(rows);
  const allDivisionTotal = getAllDivisionTotal(rows, personCount);

  return (
    <tr className={emphasis ? "print-total-emphasis" : ""}>
      <th>{label}</th>
      <td>
        <span>कुल मूल रकवा</span>
        <strong>{formatArea(originalTotal)}</strong>
      </td>
      {divisionTotals(rows, personCount).map((total, index) => (
        <td key={index}>
          <span>मद. नं. ({index + 1})</span>
          <strong>{formatArea(total)}</strong>
        </td>
      ))}
      <td>
        <span>मिलान</span>
        <strong>{formatArea(allDivisionTotal - originalTotal)}</strong>
      </td>
    </tr>
  );
}

function PrintTotalsFooter({
  currentRows,
  previousRows,
  allRows,
  personCount,
  isFinalPage,
}: {
  currentRows: ScheduleRow[];
  previousRows: ScheduleRow[];
  allRows: ScheduleRow[];
  personCount: number;
  isFinalPage: boolean;
}) {
  return (
    <table className="print-page-totals">
      <tbody>
        {previousRows.length > 0 ? (
          <PrintTotalsRow label="पूर्व पृष्ठ योग" rows={previousRows} personCount={personCount} />
        ) : null}
        <PrintTotalsRow label="इस पृष्ठ योग" rows={currentRows} personCount={personCount} />
        {isFinalPage ? (
          <PrintTotalsRow label="कुल योग" rows={allRows} personCount={personCount} emphasis />
        ) : null}
      </tbody>
    </table>
  );
}

function PrintMetadata() {
  const metadata = useScheduleStore((state) => state.metadata);

  return (
    <header className="print-page-header">
      <h1>आपसी बंटवारा</h1>
      <div className="print-metadata-grid">
        <div>
          <span>मौजा</span>
          <strong>{metadata.mauza}</strong>
        </div>
        <div>
          <span>थाना नं.</span>
          <strong>{metadata.thanaNo}</strong>
        </div>
        <div>
          <span>जिला</span>
          <strong>{metadata.district}</strong>
        </div>
        <div>
          <span>अंचल</span>
          <strong>{metadata.anchal}</strong>
        </div>
        <div>
          <span>राजस्व थाना</span>
          <strong>{metadata.rajasvThana}</strong>
        </div>
        <div>
          <span>पुलिस थाना</span>
          <strong>{metadata.policeThana}</strong>
        </div>
        <div>
          <span>हल्का</span>
          <strong>{metadata.halka}</strong>
        </div>
        <div className="wide">
          <span>रैयत का नाम व पता</span>
          <strong>{metadata.raiyat}</strong>
        </div>
      </div>
    </header>
  );
}

function PrintBoundary({ row, divisionIndex }: { row: ScheduleRow; divisionIndex: number }) {
  return (
    <table className="print-boundary-table">
      <tbody>
        {boundaryRows.map((boundaryRow, rowIndex) => (
          <tr key={rowIndex}>
            {boundaryRow.map(({ field, label }) => (
              <td key={field}>
                <div className="print-boundary-cell">
                  <span>{label}</span>
                  <strong>{row.divisions[divisionIndex].boundary[field]}</strong>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PrintRowsTable({
  pageRows,
  rowOffset,
}: {
  pageRows: ScheduleRow[];
  rowOffset: number;
}) {
  const personCount = useScheduleStore((state) => state.personCount);
  const divisionNames = useScheduleStore((state) => state.divisionNames);

  return (
    <div className="print-schedule-table-wrap">
      <table className="print-schedule-table">
        <colgroup>
          <col className="col-serial" />
          <col className="col-jamabandi" />
          <col className="col-khata" />
          <col className="col-khesra" />
          <col className="col-area" />
          {Array.from({ length: personCount }).flatMap((_, index) => [
            <col className="col-khata" key={`${index}-khata`} />,
            <col className="col-khesra" key={`${index}-khesra`} />,
            <col className="col-area" key={`${index}-area`} />,
            <col className="col-boundary" key={`${index}-boundary`} />,
          ])}
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2}>क्र.</th>
            <th colSpan={4}>खतियानी रैयत</th>
            {Array.from({ length: personCount }).map((_, index) => (
              <th colSpan={4} key={index}>
                मद. नं. ({index + 1}) नाम {divisionNames[index]}
              </th>
            ))}
          </tr>
          <tr>
            {parcelFields.map(({ label }) => (
              <th key={`original-${label}`}>{label}</th>
            ))}
            {Array.from({ length: personCount }).flatMap((_, divisionIndex) => [
              ...divisionParcelFields.map(({ label }) => (
                <th key={`${divisionIndex}-${label}`}>{label}</th>
              )),
              <th key={`${divisionIndex}-boundary`}>चौहद्दी</th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row, rowIndex) => (
            <tr key={row.id} style={{ height: `${ROW_HEIGHT_MM}mm` }}>
              <td>{rowOffset + rowIndex + 1}</td>
              {parcelFields.map(({ field }) => (
                <td key={field}>{row.original[field]}</td>
              ))}
              {Array.from({ length: personCount }).flatMap((_, divisionIndex) => [
                ...divisionParcelFields.map(({ field }) => (
                  <td key={`${divisionIndex}-${field}`}>{row.divisions[divisionIndex][field]}</td>
                )),
                <td key={`${divisionIndex}-boundary`}>
                  <PrintBoundary row={row} divisionIndex={divisionIndex} />
                </td>,
              ])}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrintSignatures() {
  const metadata = useScheduleStore((state) => state.metadata);

  return (
    <div className="print-signature-row">
      <div>
        <span>तिथि</span>
        <strong>{metadata.date}</strong>
      </div>
      <div>
        <span>अमीन का नाम</span>
        <strong>{metadata.amin}</strong>
      </div>
    </div>
  );
}

export function PrintPaginatedLayout() {
  const rows = useScheduleStore((state) => state.rows);
  const personCount = useScheduleStore((state) => state.personCount);
  const { paperSize, orientation } = useScheduleStore((state) => state.printSettings);

  const pages = chunkRowsByPageSize(rows, paperSize, orientation);

  const pWidth = printableWidth(paperSize, orientation);
  const pHeight = printableHeight(paperSize, orientation);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @page { size: ${paperSize} ${orientation}; margin: 8mm; }
          @media print {
            html, body {
              width: ${pWidth + 16}mm;
              min-height: ${pHeight + 16}mm;
            }
          }
        `
      }} />
      <section className="app-print-only print-layout" style={{ width: `${pWidth + 16}mm` }}>
        {pages.map((pageRows, pageIndex) => {
          const offset = rowOffsetForPage(pageIndex, paperSize, orientation);
          const previousRows = rows.slice(0, offset);
          const isFinalPage = pageIndex === pages.length - 1;

          return (
            <article
              className="print-page"
              key={pageIndex}
              style={{ minHeight: `${pHeight}mm`, height: `${pHeight}mm` }}
            >
              {pageIndex === 0 ? <PrintMetadata /> : null}
            <PrintRowsTable pageRows={pageRows} rowOffset={offset} />
            <div className="print-page-bottom">
              <PrintTotalsFooter
                currentRows={pageRows}
                previousRows={previousRows}
                allRows={rows}
                personCount={personCount}
                isFinalPage={isFinalPage}
              />
              {isFinalPage ? <PrintSignatures /> : null}
            </div>
          </article>
        );
      })}
      </section>
    </>
  );
}
