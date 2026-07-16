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
import { KasForm } from "@/components/forms/KasForm";
import { deleteKas } from "@/app/kas/actions";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function KasActions({ row }: { row: any }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    if (!confirm("Yakin hapus data ini?")) return;
    await deleteKas(row.id);
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit KAS</DialogTitle>
          </DialogHeader>
          <KasForm initial={row} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
