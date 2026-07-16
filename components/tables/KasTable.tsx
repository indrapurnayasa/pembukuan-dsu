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
import { KasActions } from "./KasActions";

export const revalidate = 0;

export async function KasTable() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("kas")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="rounded-xl border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Transaksi</TableHead>
            <TableHead className="text-right">Debet</TableHead>
            <TableHead className="text-right">Kredit</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{date(row.tanggal)}</TableCell>
              <TableCell>{row.transaksi}</TableCell>
              <TableCell className="text-right text-emerald-600">{rupiah(row.debet)}</TableCell>
              <TableCell className="text-right text-rose-600">{rupiah(row.kredit)}</TableCell>
              <TableCell className="text-right font-semibold">{rupiah(row.saldo)}</TableCell>
              <TableCell>
                <KasActions row={row as any} />
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
