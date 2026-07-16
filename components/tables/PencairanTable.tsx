import { createSupabaseServerClient } from "@/lib/supabase";
import { date, rupiah } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencairanActions } from "./PencairanActions";
import { User } from "lucide-react";

export const revalidate = 0;

export async function PencairanTable() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pencairan")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-28">Tanggal</TableHead>
              <TableHead>Supir</TableHead>
              <TableHead className="text-right">Deposit Trawas</TableHead>
              <TableHead className="text-right">Harga Pencairan</TableHead>
              <TableHead className="text-right">Pencairan Singkut</TableHead>
              <TableHead className="text-right">Kekurangan Bayar</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="text-sm whitespace-nowrap">{date(row.tanggal)}</TableCell>
                <TableCell className="font-medium flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground" />
                  {row.supir}
                </TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.deposit_trawas)}</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.harga_pencairan)}</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.pencairan_singkut)}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold text-sm ${
                      Number(row.kekurangan_bayar) >= 0
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {rupiah(row.kekurangan_bayar)}
                  </span>
                </TableCell>
                <TableCell>
                  <PencairanActions row={row as any} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10"
                >
                  Belum ada data. Klik "Pencairan" di atas untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
