"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createKas, updateKas } from "@/app/kas/actions";
import { toast } from "sonner";

const transaksiOptions = [
  "Deposit Ram Singkut",
  "Pembelian Brondolan",
  "Biaya Harian",
];

interface KasFormProps {
  initial?: {
    id: string;
    tanggal: string;
    transaksi: string;
    debet: number;
    kredit: number;
    keterangan: string | null;
  };
  onDone?: () => void;
}

export function KasForm({ initial, onDone }: KasFormProps) {
  const [transaksi, setTransaksi] = useState(initial?.transaksi ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDebit = transaksi === "Deposit Ram Singkut";

  async function handleSubmit(formData: FormData) {
    const nextErrors: Record<string, string> = {};
    const tanggal = formData.get("tanggal") as string;
    const amount = isDebit
      ? (formData.get("debet") as string)
      : (formData.get("kredit") as string);

    if (!tanggal) nextErrors.tanggal = "Tanggal wajib diisi";
    if (!transaksi) nextErrors.transaksi = "Pilih jenis transaksi";
    if (!amount || Number(amount) <= 0)
      nextErrors.amount = "Jumlah harus lebih dari 0";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Form belum lengkap. Periksa field yang ditandai.");
      return;
    }

    setErrors({});

    if (initial) {
      await updateKas(initial.id, formData);
      toast.success("Data KAS diperbarui");
      onDone?.();
    } else {
      await createKas(formData);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4" noValidate>
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
        <Label htmlFor="transaksi">Transaksi</Label>
        <select
          id="transaksi"
          name="transaksi"
          value={transaksi}
          onChange={(e) => setTransaksi(e.target.value)}
          className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 ${
            errors.transaksi
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring"
          }`}
          aria-invalid={!!errors.transaksi}
        >
          <option value="" disabled>Pilih transaksi...</option>
          {transaksiOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.transaksi && (
          <p className="text-xs text-destructive mt-1">{errors.transaksi}</p>
        )}
      </div>

      {transaksi && (
        <div>
          <Label htmlFor="amount">{isDebit ? "Debet" : "Kredit"}</Label>
          <Input
            id="amount"
            name={isDebit ? "debet" : "kredit"}
            type="number"
            min="0"
            defaultValue={
              isDebit ? initial?.debet ?? "" : initial?.kredit ?? ""
            }
            placeholder={isDebit ? "Jumlah masuk" : "Jumlah keluar"}
            aria-invalid={!!errors.amount}
          />
          {errors.amount && (
            <p className="text-xs text-destructive mt-1">{errors.amount}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="keterangan">Keterangan</Label>
        <Input
          id="keterangan"
          name="keterangan"
          defaultValue={initial?.keterangan ?? ""}
          placeholder="Opsional"
        />
      </div>

      <Button type="submit" className="w-full">
        {initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
