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
import { PenjualanActions } from "./PenjualanActions";
import { Truck } from "lucide-react";

export const revalidate = 0;

export async function PenjualanTable() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("penjualan")
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
              <TableHead className="text-right">Berangkat</TableHead>
              <TableHead className="text-right">Pabrik</TableHead>
              <TableHead className="text-right">Total Pabrik</TableHead>
              <TableHead className="text-right">Total Mobil</TableHead>
              <TableHead className="text-right">Total Pencairan</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="text-sm whitespace-nowrap">{date(row.tanggal)}</TableCell>
                <TableCell className="font-medium flex items-center gap-1.5">
                  <Truck className="size-3.5 text-muted-foreground" />
                  {row.supir}
                </TableCell>
                <TableCell className="text-right text-sm">{Number(row.berat_berangkat).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm">{Number(row.berat_pabrik).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm font-medium">{Number(row.total_pabrik).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.total_mobil)}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                    {rupiah(row.total_pencairan)}
                  </span>
                </TableCell>
                <TableCell>
                  <PenjualanActions row={row as any} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-10"
                >
                  Belum ada data. Klik "Penjualan" di atas untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
