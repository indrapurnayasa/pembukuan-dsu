"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createKas, updateKas } from "@/app/kas/actions";

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
  const isDebit = transaksi === "Deposit Ram Singkut";

  async function handleSubmit(formData: FormData) {
    if (initial) {
      await updateKas(initial.id, formData);
      onDone?.();
    } else {
      await createKas(formData);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
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
        <Label htmlFor="transaksi">Transaksi</Label>
        <Select
          name="transaksi"
          value={transaksi}
          onValueChange={(v) => setTransaksi(v ?? "")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih transaksi" />
          </SelectTrigger>
          <SelectContent>
            {transaksiOptions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isDebit && (
        <div>
          <Label htmlFor="debet">Debet</Label>
          <Input
            id="debet"
            name="debet"
            type="number"
            min="0"
            defaultValue={initial?.debet ?? ""}
            placeholder="Jumlah masuk"
            required
          />
        </div>
      )}

      {!isDebit && transaksi && (
        <div>
          <Label htmlFor="kredit">Kredit</Label>
          <Input
            id="kredit"
            name="kredit"
            type="number"
            min="0"
            defaultValue={initial?.kredit ?? ""}
            placeholder="Jumlah keluar"
            required
          />
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
