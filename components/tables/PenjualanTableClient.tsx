"use client";

import { date, rupiah } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PenjualanActions } from "./PenjualanActions";
import { Truck } from "lucide-react";
import { filterByDate } from "@/components/DateFilter";

type Props = {
  data: {
    id: string; tanggal: string; supir: string;
    berat_berangkat: number; berat_pabrik: number; potongan_pabrik: number;
    selisih_ram_pabrik: number; total_pabrik: number;
    harga_pabrik: number; upah_mobil: number;
  }[];
  range: "all" | "30d" | "7d" | "custom";
  from: string;
  to: string;
};

export function PenjualanTableClient({ data, ...filterProps }: Props) {
  const rows = filterByDate(data, filterProps);

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
              <TableHead className="text-right">Potong</TableHead>
              <TableHead className="text-right">Selisih</TableHead>
              <TableHead className="text-right">Total Pabrik</TableHead>
              <TableHead className="text-right">Harga Pabrik</TableHead>
              <TableHead className="text-right">Upah Mobil</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="group">
                <TableCell className="text-sm whitespace-nowrap">{date(row.tanggal)}</TableCell>
                <TableCell className="font-medium flex items-center gap-1.5">
                  <Truck className="size-3.5 text-muted-foreground" />{row.supir}
                </TableCell>
                <TableCell className="text-right text-sm">{Number(row.berat_berangkat).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm">{Number(row.berat_pabrik).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm">{Number(row.potongan_pabrik).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm">{Number(row.selisih_ram_pabrik).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm font-medium">{Number(row.total_pabrik).toLocaleString("id-ID")} kg</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.harga_pabrik)}</TableCell>
                <TableCell className="text-right text-sm">{rupiah(row.upah_mobil)}</TableCell>
                <TableCell><PenjualanActions row={row as any} /></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
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