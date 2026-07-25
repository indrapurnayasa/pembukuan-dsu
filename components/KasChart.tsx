"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rupiah } from "@/lib/format";

type KasRow = {
  tanggal: string;
  transaksi: string;
  debet: number;
  kredit: number;
};

type Props = { data: KasRow[] };
type RangeKey = "all" | "30d" | "7d" | "custom";

export function KasChart({ data }: Props) {
  const [range, setRange] = useState<RangeKey>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    if (range === "all") return data;
    if (range === "custom") {
      if (!from && !to) return data;
      return data.filter((r) => (!from || r.tanggal >= from) && (!to || r.tanggal <= to));
    }
    const days = range === "7d" ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return data.filter((r) => r.tanggal >= cutoff.toISOString().slice(0, 10));
  }, [data, range, from, to]);

  const chartData = useMemo(() => {
    const map = new Map<string, { debet: number; kredit: number }>();
    for (const r of filtered) {
      const e = map.get(r.tanggal) ?? { debet: 0, kredit: 0 };
      e.debet += Number(r.debet ?? 0);
      e.kredit += Number(r.kredit ?? 0);
      map.set(r.tanggal, e);
    }
    return [...map.entries()]
      .map(([tanggal, v]) => ({ tanggal, ...v }))
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  }, [filtered]);

  const totalDebet = filtered.reduce((a, b) => a + Number(b.debet ?? 0), 0);
  const totalKredit = filtered.reduce((a, b) => a + Number(b.kredit ?? 0), 0);
  const netKas = totalDebet - totalKredit;

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="text-xs">Rentang</Label>
              <div className="flex gap-2 mt-1">
                {(["all", "30d", "7d", "custom"] as RangeKey[]).map((k) => (
                  <Button key={k} size="sm" variant={range === k ? "default" : "outline"} onClick={() => setRange(k)}>
                    {k === "all" ? "Semua" : k === "30d" ? "30 Hari" : k === "7d" ? "7 Hari" : "Custom"}
                  </Button>
                ))}
              </div>
            </div>
            {range === "custom" && (
              <div className="flex items-end gap-2">
                <div>
                  <Label htmlFor="from" className="text-xs">Dari</Label>
                  <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto" />
                </div>
                <div>
                  <Label htmlFor="to" className="text-xs">Sampai</Label>
                  <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-100">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Debet</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{rupiah(totalDebet)}</p>
          </CardContent>
        </Card>
        <Card className="border-rose-100">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Kredit</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{rupiah(totalKredit)}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-100">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Net KAS</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{rupiah(netKas)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Debet vs Kredit</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="tanggal" tickFormatter={fmtDate} fontSize={12} />
              <YAxis tickFormatter={(v) => Intl.NumberFormat("id-ID", { notation: "compact" }).format(Number(v))} fontSize={12} />
              <Tooltip
                labelFormatter={(l) => new Date(l).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                formatter={(v) => rupiah(Number(v))}
              />
              <Legend />
              <Bar dataKey="debet" fill="#10b981" name="Debet" radius={[4, 4, 0, 0]} />
              <Bar dataKey="kredit" fill="#f43f5e" name="Kredit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}