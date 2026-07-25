"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PenjualanForm } from "@/components/forms/PenjualanForm";
import { deletePenjualan } from "@/app/penjualan/actions";
import { supabase } from "@/lib/supabase-browser";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function PenjualanActions({ row }: { row: any }) {
  const [open, setOpen] = useState(false);
  const [supirOptions, setSupirOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!open || supirOptions.length) return;
    supabase
      .from("penjualan")
      .select("supir")
      .order("supir")
      .then(({ data }) => {
        const unique = [...new Set((data ?? []).map((r) => r.supir).filter(Boolean))];
        setSupirOptions(unique);
      });
  }, [open, supirOptions.length]);

  async function handleDelete() {
    if (!confirm("Yakin hapus data ini?")) return;
    await deletePenjualan(row.id);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Penjualan Buah</DialogTitle>
          </DialogHeader>
          <PenjualanForm initial={row} supirOptions={supirOptions} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}