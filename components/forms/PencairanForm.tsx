"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPencairan, updatePencairan } from "@/app/pencairan/actions";
import { rupiah } from "@/lib/format";

interface PencairanFormProps {
  initial?: {
    id: string;
    tanggal: string;
    supir: string;
    deposit_trawas: number;
    harga_pencairan: number;
    pencairan_singkut: number;
    keuntungan_ram_singkut: number;
  };
  onDone?: () => void;
}

export function PencairanForm({ initial, onDone }: PencairanFormProps) {
  const [vals, setVals] = useState({
    deposit_trawas: initial?.deposit_trawas ?? 0,
    harga_pencairan: initial?.harga_pencairan ?? 0,
    pencairan_singkut: initial?.pencairan_singkut ?? 0,
    keuntungan_ram_singkut: initial?.keuntungan_ram_singkut ?? 0,
  });

  const kekurangan = useMemo(
    () => vals.harga_pencairan - vals.deposit_trawas - vals.pencairan_singkut - vals.keuntungan_ram_singkut,
    [vals],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVals((v) => ({ ...v, [e.target.name]: Number(e.target.value) }));
  }

  async function handleSubmit(formData: FormData) {
    if (initial) {
      await updatePencairan(initial.id, formData);
      onDone?.();
    } else {
      await createPencairan(formData);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal">Tanggal</Label>
          <Input id="tanggal" name="tanggal" type="date" required defaultValue={initial?.tanggal ?? ""} />
        </div>
        <div>
          <Label htmlFor="supir">Supir</Label>
          <Input id="supir" name="supir" placeholder="Nama supir" required defaultValue={initial?.supir ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="deposit_trawas">Deposit Trawas (Rp)</Label>
          <Input
            id="deposit_trawas"
            name="deposit_trawas"
            type="number"
            min="0"
            required
            defaultValue={initial?.deposit_trawas ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="harga_pencairan">Harga Pencairan (Rp)</Label>
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pencairan_singkut">Pencairan Singkut (Rp)</Label>
          <Input
            id="pencairan_singkut"
            name="pencairan_singkut"
            type="number"
            min="0"
            required
            defaultValue={initial?.pencairan_singkut ?? ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="keuntungan_ram_singkut">Keuntungan RAM Singkut (Rp)</Label>
          <Input
            id="keuntungan_ram_singkut"
            name="keuntungan_ram_singkut"
            type="number"
            min="0"
            required
            defaultValue={initial?.keuntungan_ram_singkut ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 flex justify-between items-center">
        <span className="text-sm font-medium">Kekurangan Bayar:</span>
        <span className={`text-lg font-bold ${kekurangan >= 0 ? "text-amber-600" : "text-emerald-600"}`}>
          {rupiah(kekurangan)}
        </span>
      </div>

      <Button type="submit" className="w-full">
        {initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
