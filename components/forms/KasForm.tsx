"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createKas, updateKas } from "@/app/kas/actions";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, Calendar, FileText } from "lucide-react";

const transaksiOptions = [
  { value: "Deposit Ram Singkut", label: "Deposit Ram Singkut", debit: true },
  { value: "Pembelian Brondolan", label: "Pembelian Brondolan", debit: false },
  { value: "Biaya Harian", label: "Biaya Harian", debit: false },
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
  const [amount, setAmount] = useState(() => {
    const v = initial ? (initial.debet || initial.kredit) : 0;
    return v ? String(v) : "";
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const selected = transaksiOptions.find((t) => t.value === transaksi);
  const isDebit = selected?.debit ?? false;

  const formatRupiah = (s: string) => {
    const digits = s.replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("id-ID").format(Number(digits));
  };

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAmount(digits);
  }

  async function handleSubmit(formData: FormData) {
    const nextErrors: Record<string, string> = {};
    const tanggal = formData.get("tanggal") as string;

    if (!tanggal) nextErrors.tanggal = "Tanggal wajib diisi";
    if (!transaksi) nextErrors.transaksi = "Pilih jenis transaksi";
    if (!amount || Number(amount) <= 0)
      nextErrors.amount = "Jumlah harus lebih dari 0";
    else if (Number(amount) > 999999999999)
      nextErrors.amount = "Maksimal Rp 999.999.999.999";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Form belum lengkap. Periksa field yang ditandai.");
      return;
    }

    setErrors({});
    setPending(true);

    formData.set(isDebit ? "debet" : "kredit", amount);
    formData.set(isDebit ? "kredit" : "debet", "0");

    try {
      if (initial) {
        await updateKas(initial.id, formData);
        toast.success("Data KAS diperbarui");
        onDone?.();
      } else {
        await createKas(formData);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="size-4" /> Informasi Transaksi
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
            <Label htmlFor="transaksi">Jenis Transaksi</Label>
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
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.transaksi && (
              <p className="text-xs text-destructive mt-1">{errors.transaksi}</p>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {isDebit ? (
              <ArrowDownLeft className="size-4 text-emerald-600" />
            ) : (
              <ArrowUpRight className="size-4 text-rose-600" />
            )}
            {isDebit ? "Pemasukan" : "Pengeluaran"}
          </div>

          <div>
            <Label htmlFor="amount">{isDebit ? "Jumlah Debet" : "Jumlah Kredit"}</Label>
            <Input
              id="amount"
              name={isDebit ? "debet" : "kredit"}
              type="text"
              inputMode="numeric"
              value={formatRupiah(amount)}
              onChange={handleAmountChange}
              placeholder={isDebit ? "Jumlah masuk" : "Jumlah keluar"}
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-xs text-destructive mt-1">{errors.amount}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="size-4" /> Keterangan Tambahan
        </div>
        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Input
            id="keterangan"
            name="keterangan"
            defaultValue={initial?.keterangan ?? ""}
            placeholder="Opsional"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan"}
      </Button>
    </form>
  );
}
