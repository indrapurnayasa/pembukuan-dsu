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
  Scale,
  User,
} from "lucide-react";

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
  { name: "deposit_trawas", label: "Deposit Trawas", icon: Scale },
  { name: "harga_pencairan", label: "Harga Pencairan", icon: Banknote },
  { name: "pencairan_singkut", label: "Pencairan Singkut", icon: Banknote },
  { name: "keuntungan_ram_singkut", label: "Keuntungan RAM Singkut", icon: Banknote },
];

export function PencairanForm({ initial, onDone }: PencairanFormProps) {
  const [vals, setVals] = useState({
    deposit_trawas: initial?.deposit_trawas ?? 0,
    harga_pencairan: initial?.harga_pencairan ?? 0,
    pencairan_singkut: initial?.pencairan_singkut ?? 0,
    keuntungan_ram_singkut: initial?.keuntungan_ram_singkut ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

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
      {<section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="size-4" /> Informasi Pencairan
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
            <Label htmlFor="supir">Supir</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="supir"
                name="supir"
                placeholder="Nama supir"
                defaultValue={initial?.supir ?? ""}
                className="pl-9"
                aria-invalid={!!errors.supir}
              />
            </div>
            {errors.supir && (
              <p className="text-xs text-destructive mt-1">{errors.supir}</p>
            )}
          </div>
        </div>
      </section>}

      {<section className="space-y-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Banknote className="size-4" /> Rincian Pencairan
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>{f.label}</Label>
              <div className="relative">
                <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Rp
                </span>
                <Input
                  id={f.name}
                  name={f.name}
                  type="number"
                  min="0"
                  defaultValue={initial?.[f.name as keyof typeof initial] ?? ""}
                  onChange={handleChange}
                  className="pl-14"
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

      <section className="rounded-xl border bg-gradient-to-br from-amber-50 to-emerald-50 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <Calculator className="size-4" /> Perhitungan Kekurangan Bayar
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Kekurangan Bayar:</span>
          <span
            className={`text-2xl font-bold ${
              kekurangan >= 0 ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {rupiah(kekurangan)}
          </span>
        </div>
      </section>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
