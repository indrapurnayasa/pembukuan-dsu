import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KasTable } from "@/components/tables/KasTable";
import { PenjualanTable } from "@/components/tables/PenjualanTable";
import { PencairanTable } from "@/components/tables/PencairanTable";
import { createSupabaseServerClient } from "@/lib/supabase";
import { rupiah } from "@/lib/format";
import { Plus, Wallet, Truck, Banknote } from "lucide-react";

export const revalidate = 0;

async function getSummary() {
  const supabase = await createSupabaseServerClient();
  const [{ data: kas }, { data: penjualan }, { data: pencairan }] =
    await Promise.all([
      supabase.from("kas").select("debet,kredit"),
      supabase.from("penjualan").select("total_pencairan"),
      supabase.from("pencairan").select("kekurangan_bayar"),
    ]);

  return {
    totalDebet: (kas ?? []).reduce((a, b) => a + Number(b.debet ?? 0), 0),
    totalKredit: (kas ?? []).reduce((a, b) => a + Number(b.kredit ?? 0), 0),
    totalPencairan: (penjualan ?? []).reduce(
      (a, b) => a + Number(b.total_pencairan ?? 0),
      0,
    ),
    totalKekurangan: (pencairan ?? []).reduce(
      (a, b) => a + Number(b.kekurangan_bayar ?? 0),
      0,
    ),
  };
}

export default async function Home() {
  const summary = await getSummary();

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pembukuan DSU - RAM Singkut</h1>
          <p className="text-muted-foreground">Dashboard & laporan harian</p>
        </div>
        <div className="flex gap-2">
          <Link href="/kas">
            <Button><Plus className="size-4" /> KAS</Button>
          </Link>
          <Link href="/penjualan">
            <Button variant="secondary"><Truck className="size-4" /> Penjualan</Button>
          </Link>
          <Link href="/pencairan">
            <Button variant="outline"><Banknote className="size-4" /> Pencairan</Button>
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Debet</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{rupiah(summary.totalDebet)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kredit</CardDescription>
            <CardTitle className="text-2xl text-rose-600">{rupiah(summary.totalKredit)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pencairan</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{rupiah(summary.totalPencairan)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kekurangan Bayar</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{rupiah(summary.totalKekurangan)}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Tabs defaultValue="kas" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kas"><Wallet className="size-4 mr-1" />KAS</TabsTrigger>
          <TabsTrigger value="penjualan"><Truck className="size-4 mr-1" />Penjualan</TabsTrigger>
          <TabsTrigger value="pencairan"><Banknote className="size-4 mr-1" />Pencairan</TabsTrigger>
        </TabsList>
        <TabsContent value="kas">
          <KasTable />
        </TabsContent>
        <TabsContent value="penjualan">
          <PenjualanTable />
        </TabsContent>
        <TabsContent value="pencairan">
          <PencairanTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
