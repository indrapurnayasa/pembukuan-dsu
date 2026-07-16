"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPencairan, updatePencairan } from "@/app/pencairan/actions";
import { rupiah } from "@/lib/format";
import { toast } from "sonner";

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

const fields = [
  { name: "deposit_trawas", label: "Deposit Trawas" },
  { name: "harga_pencairan", label: "Harga Pencairan" },
  { name: "pencairan_singkut", label: "Pencairan Singkut" },
  { name: "keuntungan_ram_singkut", label: "Keuntungan RAM Singkut" },
];

export function PencairanForm({ initial, onDone }: PencairanFormProps) {
  const [vals, setVals] = useState({
    deposit_trawas: initial?.deposit_trawas ?? 0,
    harga_pencairan: initial?.harga_pencairan ?? 0,
    pencairan_singkut: initial?.pencairan_singkut ?? 0,
    keuntungan_ram_singkut: initial?.keuntungan_ram_singkut ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const kekurangan = useMemo(
    () =>
      vals.harga_pencairan -
      vals.deposit_trawas -
      vals.pencairan_singkut -
      vals.keuntungan_ram_singkut,
    [vals],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVals((v) => ({ ...v, [e.target.name]: Number(e.target.value) }));
  }

  async function handleSubmit(formData: FormData) {
    const nextErrors: Record<string, string> = {};

    if (!formData.get("tanggal")) nextErrors.tanggal = "Tanggal wajib diisi";
    if (!formData.get("supir")) nextErrors.supir = "Nama supir wajib diisi";

    for (const key of fields.map((f) => f.name)) {
      const v = Number(formData.get(key));
      if (!v || v < 0) {
        const label = fields.find((f) => f.name === key)?.label ?? key;
        nextErrors[key] = `${label} harus angka ≥ 0`;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Form belum lengkap. Periksa field yang ditandai.");
      return;
    }

    setErrors({});

    if (initial) {
      await updatePencairan(initial.id, formData);
      toast.success("Data pencairan diperbarui");
      onDone?.();
    } else {
      await createPencairan(formData);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4" noValidate>
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
          <Label htmlFor="supir">Supir</Label>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="deposit_trawas">Deposit Trawas (Rp)</Label>
          <Input
            id="deposit_trawas"
            name="deposit_trawas"
            type="number"
            min="0"
            defaultValue={initial?.deposit_trawas ?? ""}
            onChange={handleChange}
            aria-invalid={!!errors.deposit_trawas}
          />
          {errors.deposit_trawas && (
            <p className="text-xs text-destructive mt-1">{errors.deposit_trawas}</p>
          )}
        </div>
        <div>
          <Label htmlFor="harga_pencairan">Harga Pencairan (Rp)</Label>
          <Input
            id="harga_pencairan"
            name="harga_pencairan"
            type="number"
            min="0"
            defaultValue={initial?.harga_pencairan ?? ""}
            onChange={handleChange}
            aria-invalid={!!errors.harga_pencairan}
          />
          {errors.harga_pencairan && (
            <p className="text-xs text-destructive mt-1">{errors.harga_pencairan}</p>
          )}
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
            defaultValue={initial?.pencairan_singkut ?? ""}
            onChange={handleChange}
            aria-invalid={!!errors.pencairan_singkut}
          />
          {errors.pencairan_singkut && (
            <p className="text-xs text-destructive mt-1">{errors.pencairan_singkut}</p>
          )}
        </div>
        <div>
          <Label htmlFor="keuntungan_ram_singkut">Keuntungan RAM Singkut (Rp)</Label>
          <Input
            id="keuntungan_ram_singkut"
            name="keuntungan_ram_singkut"
            type="number"
            min="0"
            defaultValue={initial?.keuntungan_ram_singkut ?? ""}
            onChange={handleChange}
            aria-invalid={!!errors.keuntungan_ram_singkut}
          />
          {errors.keuntungan_ram_singkut && (
            <p className="text-xs text-destructive mt-1">{errors.keuntungan_ram_singkut}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 flex justify-between items-center">
        <span className="text-sm font-medium">Kekurangan Bayar:</span>
        <span
          className={`text-lg font-bold ${
            kekurangan >= 0 ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {rupiah(kekurangan)}
        </span>
      </div>

      <Button type="submit" className="w-full">
        {initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
