"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPenjualan, updatePenjualan } from "@/app/penjualan/actions";
import { rupiah } from "@/lib/format";

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

export function PenjualanForm({ initial, onDone }: PenjualanFormProps) {
  const [vals, setVals] = useState({
    berat_berangkat: initial?.berat_berangkat ?? 0,
    berat_pabrik: initial?.berat_pabrik ?? 0,
    potongan_pabrik: initial?.potongan_pabrik ?? 0,
    harga_pabrik: initial?.harga_pabrik ?? 0,
    harga_pencairan: initial?.harga_pencairan ?? 0,
    upah_mobil: initial?.upah_mobil ?? 0,
  });

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
    if (initial) {
      await updatePenjualan(initial.id, formData);
      onDone?.();
    } else {
      await createPenjualan(formData);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal">Tanggal</Label>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={initial?.tanggal ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="supir">Supir Mobil</Label>
          <Input
            id="supir"
            name="supir"
            placeholder="Nama supir"
            required
            defaultValue={initial?.supir ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="berat_berangkat">Berat Mobil Berangkat (kg)</Label>
          <Input
            id="berat_berangkat"
            name="berat_berangkat"
            type="number"
            min="0"
            required
            defaultValue={initial?.berat_berangkat ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="berat_pabrik">Berat Mobil Pabrik (kg)</Label>
          <Input
            id="berat_pabrik"
            name="berat_pabrik"
            type="number"
            min="0"
            required
            defaultValue={initial?.berat_pabrik ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="potongan_pabrik">Potongan Pabrik (kg)</Label>
          <Input
            id="potongan_pabrik"
            name="potongan_pabrik"
            type="number"
            min="0"
            required
            defaultValue={initial?.potongan_pabrik ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="harga_pabrik">Harga Pabrik (Rp/kg)</Label>
          <Input
            id="harga_pabrik"
            name="harga_pabrik"
            type="number"
            min="0"
            required
            defaultValue={initial?.harga_pabrik ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="harga_pencairan">Harga Pencairan (Rp/kg)</Label>
          <Input
            id="harga_pencairan"
            name="harga_pencairan"
            type="number"
            min="0"
            required
            defaultValue={initial?.harga_pencairan ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="upah_mobil">Upah Mobil (Rp)</Label>
          <Input
            id="upah_mobil"
            name="upah_mobil"
            type="number"
            min="0"
            required
            defaultValue={initial?.upah_mobil ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
        <p className="text-sm font-medium">Perkiraan perhitungan:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Selisih Ram - Pabrik:</span>
          <span className="text-right font-semibold">{calc.selisih.toLocaleString("id-ID")} kg</span>
          <span className="text-muted-foreground">Total Pabrik:</span>
          <span className="text-right font-semibold">{calc.totalPabrik.toLocaleString("id-ID")} kg</span>
          <span className="text-muted-foreground">Total Mobil:</span>
          <span className="text-right font-semibold">{rupiah(calc.totalMobil)}</span>
          <span className="text-muted-foreground">Total Pencairan:</span>
          <span className="text-right font-semibold text-emerald-600">{rupiah(calc.totalPencairan)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
