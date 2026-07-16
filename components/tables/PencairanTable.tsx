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

export const revalidate = 0;

export async function PencairanTable() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pencairan")
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
            <TableHead className="text-right">Deposit Trawas</TableHead>
            <TableHead className="text-right">Harga Pencairan</TableHead>
            <TableHead className="text-right">Pencairan Singkut</TableHead>
            <TableHead className="text-right">Kekurangan Bayar</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{date(row.tanggal)}</TableCell>
              <TableCell>{row.supir}</TableCell>
              <TableCell className="text-right">{rupiah(row.deposit_trawas)}</TableCell>
              <TableCell className="text-right">{rupiah(row.harga_pencairan)}</TableCell>
              <TableCell className="text-right">{rupiah(row.pencairan_singkut)}</TableCell>
              <TableCell className={`text-right font-semibold ${Number(row.kekurangan_bayar) >= 0 ? "text-amber-600" : "text-emerald-600"}`}>
                {rupiah(row.kekurangan_bayar)}
              </TableCell>
              <TableCell>
                <PencairanActions row={row as any} />
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Belum ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
