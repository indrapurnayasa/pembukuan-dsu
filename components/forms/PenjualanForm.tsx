"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPenjualan, updatePenjualan } from "@/app/penjualan/actions";
import { rupiah } from "@/lib/format";
import { toast } from "sonner";
import {
  Calculator,
  Calendar,
  DollarSign,
  Scale,
  Truck,
  User,
  Weight,
} from "lucide-react";

interface PenjualanFormProps {
  initial?: {
    id: string;
    tanggal: string;
    supir: string;
    berat_berangkat: number;
    berat_pabrik: number;
    potongan_pabrik: number;
    harga_pabrik: number;
    harga_pencairan: number;
    upah_mobil: number;
  };
  onDone?: () => void;
}

const weightFields = [
  { name: "berat_berangkat", label: "Berat Mobil Berangkat", unit: "kg", icon: Weight },
  { name: "berat_pabrik", label: "Berat Mobil Pabrik", unit: "kg", icon: Scale },
  { name: "potongan_pabrik", label: "Potongan Pabrik", unit: "kg", icon: Scale },
];

const priceFields = [
  { name: "harga_pabrik", label: "Harga Pabrik", unit: "Rp/kg", icon: DollarSign },
  { name: "harga_pencairan", label: "Harga Pencairan", unit: "Rp/kg", icon: DollarSign },
  { name: "upah_mobil", label: "Upah Mobil", unit: "Rp", icon: DollarSign },
];

export function PenjualanForm({ initial, onDone }: PenjualanFormProps) {
  const [vals, setVals] = useState({
    berat_berangkat: initial?.berat_berangkat ?? 0,
    berat_pabrik: initial?.berat_pabrik ?? 0,
    potongan_pabrik: initial?.potongan_pabrik ?? 0,
    harga_pabrik: initial?.harga_pabrik ?? 0,
    harga_pencairan: initial?.harga_pencairan ?? 0,
    upah_mobil: initial?.upah_mobil ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const calc = useMemo(() => {
    const selisih = vals.berat_berangkat - vals.berat_pabrik - vals.potongan_pabrik;
    const total = vals.berat_pabrik - vals.potongan_pabrik;
    return {
      selisih,
      totalPabrik: total,
      totalMobil: total * vals.harga_pabrik,
      totalPencairan: total * vals.harga_pencairan - vals.upah_mobil,
    };
  }, [vals]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVals((v) => ({ ...v, [e.target.name]: Number(e.target.value) }));
  }

  async function handleSubmit(formData: FormData) {
    const nextErrors: Record<string, string> = {};

    if (!formData.get("tanggal")) nextErrors.tanggal = "Tanggal wajib diisi";
    if (!formData.get("supir")) nextErrors.supir = "Nama supir wajib diisi";

    for (const key of [
      "berat_berangkat",
      "berat_pabrik",
      "potongan_pabrik",
      "harga_pabrik",
      "harga_pencairan",
      "upah_mobil",
    ]) {
      const v = Number(formData.get(key));
      if (!v || v < 0) {
        const label =
          [...weightFields, ...priceFields].find((f) => f.name === key)?.label ?? key;
        nextErrors[key] = `${label} harus angka ≥ 0`;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Form belum lengkap. Periksa field yang ditandai.");
      return;
    }

    setErrors({});
    setPending(true);

    try {
      if (initial) {
        await updatePenjualan(initial.id, formData);
        toast.success("Data penjualan diperbarui");
        onDone?.();
      } else {
        await createPenjualan(formData);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6" noValidate>
      {<section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="size-4" /> Informasi Pengiriman
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={initial?.tanggal ?? ""}
              aria-invalid={!!errors.tanggal}
            />
            {errors.tanggal && (
              <p className="text-xs text-destructive mt-1">{errors.tanggal}</p>
            )}
          </div>
          <div>
            <Label htmlFor="supir">Supir Mobil</Label>
            <Input
              id="supir"
              name="supir"
              placeholder="Nama supir"
              defaultValue={initial?.supir ?? ""}
              aria-invalid={!!errors.supir}
            />
            {errors.supir && (
              <p className="text-xs text-destructive mt-1">{errors.supir}</p>
            )}
          </div>
        </div>
      </section>}

      {<section className="space-y-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Truck className="size-4" /> Berat Kendaraan
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {weightFields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>
                {f.label} ({f.unit})
              </Label>
              <div className="relative">
                <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id={f.name}
                  name={f.name}
                  type="number"
                  min="0"
                  defaultValue={initial?.[f.name as keyof typeof initial] ?? ""}
                  onChange={handleChange}
                  className="pl-9"
                  aria-invalid={!!errors[f.name]}
                />
              </div>
              {errors[f.name] && (
                <p className="text-xs text-destructive mt-1">{errors[f.name]}</p>
              )}
            </div>
          ))}
        </div>
      </section>}

      {<section className="space-y-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <DollarSign className="size-4" /> Harga & Upah
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {priceFields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>
                {f.label} ({f.unit})
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
                <Input
                  id={f.name}
                  name={f.name}
                  type="number"
                  min="0"
                  defaultValue={initial?.[f.name as keyof typeof initial] ?? ""}
                  onChange={handleChange}
                  className="pl-9"
                  aria-invalid={!!errors[f.name]}
                />
              </div>
              {errors[f.name] && (
                <p className="text-xs text-destructive mt-1">{errors[f.name]}</p>
              )}
            </div>
          ))}
        </div>
      </section>}

      <section className="rounded-xl border bg-gradient-to-br from-emerald-50 to-blue-50 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
          <Calculator className="size-4" /> Hasil Perhitungan Otomatis
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <span className="text-muted-foreground">Selisih Ram - Pabrik:</span>
          <span className="text-right font-semibold">{calc.selisih.toLocaleString("id-ID")} kg</span>
          <span className="text-muted-foreground">Total Pabrik:</span>
          <span className="text-right font-semibold">{calc.totalPabrik.toLocaleString("id-ID")} kg</span>
          <span className="text-muted-foreground">Total Mobil:</span>
          <span className="text-right font-semibold">{rupiah(calc.totalMobil)}</span>
          <span className="text-muted-foreground">Total Pencairan:</span>
          <span className="text-right font-bold text-emerald-700 text-base">
            {rupiah(calc.totalPencairan)}
          </span>
        </div>
      </section>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
