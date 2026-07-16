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
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const revalidate = 0;

export async function KasTable() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("kas")
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
              <TableHead>Transaksi</TableHead>
              <TableHead className="text-right">Debet</TableHead>
              <TableHead className="text-right">Kredit</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="text-sm whitespace-nowrap">{date(row.tanggal)}</TableCell>
                <TableCell className="font-medium">{row.transaksi}</TableCell>
                <TableCell className="text-right">
                  {Number(row.debet) > 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-sm">
                      <ArrowDownLeft className="size-3.5" />
                      {rupiah(row.debet)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {Number(row.kredit) > 0 ? (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-sm">
                      <ArrowUpRight className="size-3.5" />
                      {rupiah(row.kredit)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {rupiah(row.saldo)}
                </TableCell>
                <TableCell>
                  <KasActions row={row as any} />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  Belum ada data. Klik "KAS" di atas untuk menambah.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
