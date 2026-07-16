import Link from "next/link";
import {
  Card,
  CardContent,
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
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  Plus,
  Truck,
  Wallet,
  AlertTriangle,
} from "lucide-react";

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

const today = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function Home() {
  const s = await getSummary();
  const netKas = s.totalDebet - s.totalKredit;

  const cards = [
    {
      label: "Total Debet",
      value: s.totalDebet,
      icon: ArrowDownLeft,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Total Kredit",
      value: s.totalKredit,
      icon: ArrowUpRight,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
    {
      label: "Saldo KAS",
      value: netKas,
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Total Pencairan",
      value: s.totalPencairan,
      icon: Truck,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      label: "Kekurangan Bayar",
      value: s.totalKekurangan,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {today}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Ringkasan pembukuan DSU - RAM Singkut</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/kas">
            <Button className="gap-2">
              <Plus className="size-4" /> KAS
            </Button>
          </Link>
          <Link href="/penjualan">
            <Button variant="secondary" className="gap-2">
              <Truck className="size-4" /> Penjualan
            </Button>
          </Link>
          <Link href="/pencairan">
            <Button variant="outline" className="gap-2">
              <Banknote className="size-4" /> Pencairan
            </Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {cards.map((c) => (
          <Card
            key={c.label}
            className={`border ${c.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${c.color}`}>
                    {rupiah(c.value)}
                  </p>
                </div>
                <div className={`size-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`size-5 ${c.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Data Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <Tabs defaultValue="kas" className="w-full">
            <TabsList className="mb-4 bg-muted/60">
              <TabsTrigger value="kas" className="gap-1.5">
                <Wallet className="size-4" />KAS
              </TabsTrigger>
              <TabsTrigger value="penjualan" className="gap-1.5">
                <Truck className="size-4" />Penjualan
              </TabsTrigger>
              <TabsTrigger value="pencairan" className="gap-1.5">
                <Banknote className="size-4" />Pencairan
              </TabsTrigger>
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
        </CardContent>
      </Card>
    </main>
  );
}
