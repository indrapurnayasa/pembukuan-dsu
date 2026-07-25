"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Download, Truck, Wallet } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KasTableClient } from "@/components/tables/KasTableClient";
import { PenjualanTableClient } from "@/components/tables/PenjualanTableClient";
import { PencairanTableClient } from "@/components/tables/PencairanTableClient";
import { filterByDate } from "@/components/DateFilter";

type RangeKey = "all" | "30d" | "7d" | "custom";

type Props = {
  kas: any[];
  penjualan: any[];
  pencairan: any[];
};

const kasColumns = [
  { key: "tanggal", label: "Tanggal" },
  { key: "transaksi", label: "Transaksi" },
  { key: "debet", label: "Debet" },
  { key: "kredit", label: "Kredit" },
  { key: "keterangan", label: "Keterangan" },
];

const penjualanColumns = [
  { key: "tanggal", label: "Tanggal" },
  { key: "supir", label: "Supir" },
  { key: "berat_berangkat", label: "Berat Berangkat" },
  { key: "berat_pabrik", label: "Berat Pabrik" },
  { key: "potongan_pabrik", label: "Potongan Pabrik" },
  { key: "selisih_ram_pabrik", label: "Selisih RAM-Pabrik" },
  { key: "total_pabrik", label: "Total Pabrik" },
  { key: "harga_pabrik", label: "Harga Pabrik" },
  { key: "upah_mobil", label: "Upah Mobil" },
];

const pencairanColumns = [
  { key: "tanggal", label: "Tanggal" },
  { key: "deposit_trawas", label: "Harga Mobil" },
  { key: "harga_pencairan", label: "Harga Pencairan" },
  { key: "total_pencairan", label: "Total Pencairan" },
];

export function TransactionTabs({ kas, penjualan, pencairan }: Props) {
  const [tab, setTab] = useState("kas");
  const [range, setRange] = useState<RangeKey>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filterActive = range !== "all" || !!from || !!to;
  const filterProps = { range, from, to };

  const rangeOptions: { key: RangeKey; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "30d", label: "30 Hari" },
    { key: "7d", label: "7 Hari" },
    { key: "custom", label: "Custom" },
  ];

  const filteredData = useMemo(() => {
    const f = { range, from, to };
    if (tab === "kas") return filterByDate(kas, f);
    if (tab === "penjualan") return filterByDate(penjualan, f);
    return filterByDate(pencairan, f);
  }, [tab, kas, penjualan, pencairan, range, from, to]);

  function handleDownload() {
    const columns =
      tab === "kas" ? kasColumns
      : tab === "penjualan" ? penjualanColumns
      : pencairanColumns;

    const rows = filteredData.map((row: any) => {
      const obj: Record<string, any> = {};
      for (const col of columns) {
        obj[col.label] = row[col.key];
      }
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tab);
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${tab}-${date}.xlsx`);
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Data Transaksi</CardTitle>
        <CardAction>
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={handleDownload}
          >
            <Download className="size-4" />
            Download Excel
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="kas" className="gap-1.5">
            <Wallet className="size-4" />
            KAS
            {filterActive && tab === "kas" && (
              <span className="ml-1 size-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="penjualan" className="gap-1.5">
            <Truck className="size-4" />
            Penjualan
            {filterActive && tab === "penjualan" && (
              <span className="ml-1 size-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="pencairan" className="gap-1.5">
            <Banknote className="size-4" />
            Pencairan
            {filterActive && tab === "pencairan" && (
              <span className="ml-1 size-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* filter bar — kanan atas, sejajar tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
            {rangeOptions.map((o) => (
              <Button
                key={o.key}
                size="sm"
                variant={range === o.key ? "default" : "outline"}
                onClick={() => setRange(o.key)}
              >
                {o.label}
              </Button>
            ))}
          </div>
          {range === "custom" && (
            <div className="flex items-center gap-2">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto" />
              <span className="text-xs text-muted-foreground">-</span>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto" />
            </div>
          )}
          {filterActive && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setRange("all"); setFrom(""); setTo(""); }}
            >
              Reset
            </Button>
          )}
        </div>
        </div>

        <TabsContent value="kas">
          <KasTableClient data={kas} {...filterProps} />
        </TabsContent>
        <TabsContent value="penjualan">
          <PenjualanTableClient data={penjualan} {...filterProps} />
        </TabsContent>
        <TabsContent value="pencairan">
          <PencairanTableClient data={pencairan} {...filterProps} />
        </TabsContent>
      </Tabs>
      </CardContent>
    </Card>
  );
}