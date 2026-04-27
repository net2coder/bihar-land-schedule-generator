"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { LandTable } from "@/components/Table/LandTable";
import { HeaderForm } from "@/components/HeaderForm";
import { Toolbar } from "@/components/Controls/Toolbar";
import { PrintFooter } from "@/components/Print/PrintFooter";
import { TotalsBar } from "@/components/TotalsBar";
import { PrintPaginatedLayout } from "@/components/Print/PrintPaginatedLayout";
import { DataRecoveryBanner } from "@/components/DataRecoveryBanner";

export default function Home() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const beforePrint = () => {
      flushSync(() => setIsPrinting(true));
    };
    const afterPrint = () => {
      setIsPrinting(false);
    };
    const printQuery = window.matchMedia("print");
    const handlePrintQuery = (event: MediaQueryListEvent) => {
      if (event.matches) {
        flushSync(() => setIsPrinting(true));
      } else {
        setIsPrinting(false);
      }
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    printQuery.addEventListener("change", handlePrintQuery);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      printQuery.removeEventListener("change", handlePrintQuery);
    };
  }, []);

  return (
    <>
      <DataRecoveryBanner />
      <main className="min-h-screen text-slate-950 print:bg-white pb-12">
        <div className="mx-auto max-w-[1600px] px-4 py-6 print:max-w-none print:px-0 print:py-0">
          {!isPrinting ? (
            <>
              <Toolbar />
              <section className="document-shell mx-auto">
                <HeaderForm />
                <TotalsBar />
              <LandTable />
              <PrintFooter />
            </section>
          </>
        ) : null}
        {isPrinting ? <PrintPaginatedLayout /> : null}
      </div>
      </main>
    </>
  );
}
