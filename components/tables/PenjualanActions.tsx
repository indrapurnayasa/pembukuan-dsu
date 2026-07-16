"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenjualanForm } from "@/components/forms/PenjualanForm";
import { deletePenjualan } from "@/app/penjualan/actions";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function PenjualanActions({ row }: { row: any }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    if (!confirm("Yakin hapus data ini?")) return;
    await deletePenjualan(row.id);
    toast.success("Data dihapus");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
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
          <PenjualanForm initial={row} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
