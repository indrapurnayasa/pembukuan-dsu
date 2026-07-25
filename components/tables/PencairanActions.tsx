"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PencairanForm } from "@/components/forms/PencairanForm";
import { deletePencairan } from "@/app/pencairan/actions";
import { supabase } from "@/lib/supabase-browser";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type PenjualanOption = {
  id: string; tanggal: string; supir: string;
  berat_berangkat: number; upah_mobil: number;
  total_pabrik: number; harga_pabrik: number;
};

export function PencairanActions({ row }: { row: { id: string; tanggal: string; penjualan_id: string } }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PenjualanOption[]>([]);

  useEffect(() => {
    if (!open || options.length) return;
    supabase
      .from("penjualan")
      .select("id,tanggal,supir,berat_berangkat,upah_mobil,total_pabrik,harga_pabrik")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOptions((data as PenjualanOption[]) ?? []));
  }, [open, options.length]);

  async function handleDelete() {
    if (!confirm("Yakin hapus data ini?")) return;
    await deletePencairan(row.id);
    toast.success("Data dihapus");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className="size-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="size-4 mr-2" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Pencairan</DialogTitle>
          </DialogHeader>
          <PencairanForm initial={row} penjualanOptions={options} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}