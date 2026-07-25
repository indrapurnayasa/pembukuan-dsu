"use client";

import dynamic from "next/dynamic";

const KasChart = dynamic(() => import("@/components/KasChart").then((m) => m.KasChart), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Memuat grafik...</div>,
});

export function KasChartDynamic({ data }: { data: any[] }) {
  return <KasChart data={data} />;
}