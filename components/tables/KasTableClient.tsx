"use client";

import { date, rupiah } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KasActions } from "./KasActions";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { filterByDate } from "@/components/DateFilter";

type Props = {
  data: { id: string; tanggal: string; transaksi: string; debet: number; kredit: number; keterangan: string | null }[];
  range: "all" | "30d" | "7d" | "custom";
  from: string;
  to: string;
};

export function KasTableClient({ data, ...filterProps }: Props) {
  const rows = filterByDate(data, filterProps);
  const cell = (v: number, cls: string, Icon: typeof ArrowDownLeft) =>
    Number(v) > 0 ? (
      <span className={`inline-flex items-center gap-1 font-medium text-sm ${cls}`}>
        <Icon className="size-3.5" />{rupiah(v)}
      </span>
    ) : <span className="text-muted-foreground">-</span>;

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
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="text-sm whitespace-nowrap">{date(row.tanggal)}</TableCell>
                <TableCell className="font-medium">{row.transaksi}</TableCell>
                <TableCell className="text-right">{cell(row.debet, "text-emerald-600", ArrowDownLeft)}</TableCell>
                <TableCell className="text-right">{cell(row.kredit, "text-rose-600", ArrowUpRight)}</TableCell>
                <TableCell><KasActions row={row as any} /></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  Tidak ada data untuk rentang ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}