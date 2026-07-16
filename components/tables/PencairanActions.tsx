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
import { PencairanForm } from "@/components/forms/PencairanForm";
import { deletePencairan } from "@/app/pencairan/actions";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function PencairanActions({ row }: { row: any }) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    if (!confirm("Yakin hapus data ini?")) return;
    await deletePencairan(row.id);
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
            <DialogTitle>Edit Pencairan</DialogTitle>
          </DialogHeader>
          <PencairanForm initial={row} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
