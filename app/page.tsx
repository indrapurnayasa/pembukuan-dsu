import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionTabs } from "@/components/TransactionTabs";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { rupiah } from "@/lib/format";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  Download,
  Plus,
  Truck,
  AlertTriangle,
} from "lucide-react";

export const revalidate = 0;

async function getSummary() {
  const supabase = await createSupabaseServerClient();
  const [
    { data: kas },
    { data: penjualan },
    { data: pencairan },
  ] = await Promise.all([
    supabase.from("kas").select("*").order("created_at", { ascending: false }),
    supabase.from("penjualan").select("*").order("created_at", { ascending: false }),
    supabase.from("pencairan").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    kas: kas ?? [],
    penjualan: penjualan ?? [],
    pencairan: pencairan ?? [],
    totalDebet: (kas ?? []).reduce((a, b) => a + Number(b.debet ?? 0), 0),
    totalKredit: (kas ?? []).reduce((a, b) => a + Number(b.kredit ?? 0), 0),
    totalPencairan: (pencairan ?? []).reduce(
      (a, b) => a + Number(b.total_pencairan ?? 0),
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
  const totalKeuntungan = s.totalPencairan - s.totalDebet;

  const cards = [
    { label: "Total Debet", value: s.totalDebet, icon: ArrowDownLeft, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Total Kredit", value: s.totalKredit, icon: ArrowUpRight, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { label: "Total Pencairan", value: s.totalPencairan, icon: Truck, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "Total Keuntungan", value: totalKeuntungan, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
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

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <Card
            key={c.label}
            className={`border ${c.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${c.color}`}>
                  {rupiah(c.value)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <TransactionTabs
        kas={s.kas}
        penjualan={s.penjualan}
        pencairan={s.pencairan}
      />
    </main>
  );
}
