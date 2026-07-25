"use client";

import { date, rupiah } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencairanActions } from "./PencairanActions";
import { filterByDate } from "@/components/DateFilter";

type Props = {
  data: {
    id: string; tanggal: string; penjualan_id: string;
    deposit_trawas: number; harga_pencairan: number; total_pencairan: number;
  }[];
  range: "all" | "30d" | "7d" | "custom";
  from: string;
  to: string;
};

export function PencairanTableClient({ data, ...filterProps }: Props) {
  const rows = filterByDate(data, filterProps);

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-28">Tanggal</TableHead>
              <TableHead className="text-right">Harga Mobil</TableHead>
              <TableHead className="text-right">Harga Pencairan</TableHead>
              <TableHead className="text-right">Total Pencairan</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="text-sm whitespace-nowrap">{date(row.tanggal)}</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.deposit_trawas)}</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.harga_pencairan)}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 font-semibold text-sm text-amber-600">
                    {rupiah(row.total_pencairan)}
                  </span>
                </TableCell>
                <TableCell><PencairanActions row={row as any} /></TableCell>
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