"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type RangeKey = "all" | "30d" | "7d" | "custom";

export type DateFilterState = {
  range: RangeKey;
  from: string;
  to: string;
};

export function filterByDate<T extends { tanggal: string }>(
  data: T[],
  f: DateFilterState,
): T[] {
  if (f.range === "all") return data;
  if (f.range === "custom") {
    if (!f.from && !f.to) return data;
    return data.filter((r) =>
      (!f.from || r.tanggal >= f.from) && (!f.to || r.tanggal <= f.to),
    );
  }
  const days = f.range === "7d" ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return data.filter((r) => r.tanggal >= cutoffStr);
}

export function DateFilter() {
  const [range, setRange] = useState<RangeKey>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const state: DateFilterState = { range, from, to };
  const active = range !== "all" || !!from || !!to;

  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      <div>
        <Label className="text-xs">Rentang Waktu</Label>
        <div className="flex gap-2 mt-1">
          {(["all", "30d", "7d", "custom"] as RangeKey[]).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={range === k ? "default" : "outline"}
              onClick={() => setRange(k)}
            >
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
      {active && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => { setRange("all"); setFrom(""); setTo(""); }}
        >
          Reset
        </Button>
      )}
    </div>
  );
}

export function useDateFilter() {
  const [range, setRange] = useState<RangeKey>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const state: DateFilterState = { range, from, to };
  return { state, setRange, setFrom, setTo };
}