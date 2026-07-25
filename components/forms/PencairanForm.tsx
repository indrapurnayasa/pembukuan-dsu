"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPencairan, updatePencairan } from "@/app/pencairan/actions";
import { rupiah } from "@/lib/format";
import { toast } from "sonner";
import {
  Banknote,
  Calendar,
  Calculator,
  Truck,
} from "lucide-react";

type PenjualanOption = {
  id: string;
  tanggal: string;
  supir: string;
  berat_berangkat: number;
  upah_mobil: number;
  total_pabrik: number;
  harga_pabrik: number;
};

interface PencairanFormProps {
  initial?: {
    id: string;
    tanggal: string;
    penjualan_id: string;
  };
  penjualanOptions?: PenjualanOption[];
  onDone?: () => void;
}

export function PencairanForm({ initial, penjualanOptions = [], onDone }: PencairanFormProps) {
  const [tanggal, setTanggal] = useState(initial?.tanggal ?? "");
  const [penjualanId, setPenjualanId] = useState(initial?.penjualan_id ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const filtered = useMemo(
    () => penjualanOptions.filter((p) => p.tanggal === tanggal),
    [penjualanOptions, tanggal],
  );

  const selected = penjualanOptions.find((p) => p.id === penjualanId);

  const calc = useMemo(() => {
    if (!selected) return null;
    const hargaMobil = Number(selected.berat_berangkat) * Number(selected.upah_mobil);
    const hargaPencairan = Number(selected.total_pabrik) * Number(selected.harga_pabrik);
    const totalPencairan = hargaPencairan - hargaMobil;
    return { hargaMobil, hargaPencairan, totalPencairan };
  }, [selected]);

  async function handleSubmit(formData: FormData) {
    const nextErrors: Record<string, string> = {};

    if (!tanggal) nextErrors.tanggal = "Tanggal wajib diisi";
    if (!penjualanId) nextErrors.penjualan_id = "Pilih record penjualan";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Form belum lengkap. Periksa field yang ditandai.");
      return;
    }

    formData.set("penjualan_id", penjualanId);
    formData.set("tanggal", tanggal);

    setErrors({});
    setPending(true);

    try {
      if (initial) {
        await updatePencairan(initial.id, formData);
        toast.success("Data pencairan diperbarui");
        onDone?.();
      } else {
        await createPencairan(formData);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6" noValidate>
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="size-4" /> Informasi Pencairan
        </div>

        <div>
          <Label htmlFor="tanggal">Tanggal</Label>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => {
              setTanggal(e.target.value);
              setPenjualanId("");
            }}
            aria-invalid={!!errors.tanggal}
          />
          {errors.tanggal && (
            <p className="text-xs text-destructive mt-1">{errors.tanggal}</p>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Truck className="size-4" /> Pilih Penjualan
        </div>

        <div>
          <Label htmlFor="penjualan_id">Record Penjualan ({tanggal || "pilih tanggal dulu"})</Label>
          <select
            id="penjualan_id"
            name="penjualan_id"
            value={penjualanId}
            onChange={(e) => setPenjualanId(e.target.value)}
            disabled={!tanggal || filtered.length === 0}
            className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 ${
              errors.penjualan_id
                ? "border-destructive focus-visible:ring-destructive"
                : "border-input focus-visible:ring-ring"
            } disabled:opacity-50`}
            aria-invalid={!!errors.penjualan_id}
          >
            <option value="" disabled>
              {!tanggal
                ? "Pilih tanggal dulu..."
                : filtered.length === 0
                  ? "Tidak ada penjualan di tanggal ini"
                  : "Pilih penjualan..."}
            </option>
            {filtered.map((p) => (
              <option key={p.id} value={p.id}>
                {p.supir} — {Number(p.berat_berangkat).toLocaleString("id-ID")}kg / {rupiah(p.upah_mobil)}
              </option>
            ))}
          </select>
          {errors.penjualan_id && (
            <p className="text-xs text-destructive mt-1">{errors.penjualan_id}</p>
          )}
        </div>
      </section>

      {calc && (
        <section className="rounded-xl border bg-gradient-to-br from-amber-50 to-emerald-50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
            <Calculator className="size-4" /> Perhitungan Otomatis
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <span className="text-muted-foreground">Harga Mobil:</span>
            <span className="text-right font-semibold">
              <Banknote className="inline size-3.5 mr-1 text-muted-foreground" />
              {rupiah(calc.hargaMobil)}
            </span>
            <span className="text-muted-foreground">Harga Pencairan:</span>
            <span className="text-right font-semibold">{rupiah(calc.hargaPencairan)}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm font-medium text-muted-foreground">Total Pencairan:</span>
            <span className="text-2xl font-bold text-amber-700">
              {rupiah(calc.totalPencairan)}
            </span>
          </div>
        </section>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}