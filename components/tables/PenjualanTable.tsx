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

export const revalidate = 0;

export async function PenjualanTable() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("penjualan")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="rounded-xl border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
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
            <TableRow key={row.id}>
              <TableCell>{date(row.tanggal)}</TableCell>
              <TableCell>{row.supir}</TableCell>
              <TableCell className="text-right">{Number(row.berat_berangkat).toLocaleString("id-ID")} kg</TableCell>
              <TableCell className="text-right">{Number(row.berat_pabrik).toLocaleString("id-ID")} kg</TableCell>
              <TableCell className="text-right">{Number(row.total_pabrik).toLocaleString("id-ID")} kg</TableCell>
              <TableCell className="text-right">{rupiah(row.total_mobil)}</TableCell>
              <TableCell className="text-right font-semibold text-emerald-600">{rupiah(row.total_pencairan)}</TableCell>
              <TableCell>
                <PenjualanActions row={row as any} />
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                Belum ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
