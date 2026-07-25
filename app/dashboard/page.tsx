import { createSupabaseServerClient } from "@/lib/supabase-server";
import { KasChartDynamic } from "@/components/KasChartDynamic";
import { PageHeader } from "@/components/PageHeader";
import { BarChart3 } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("kas")
    .select("tanggal,transaksi,debet,kredit")
    .order("tanggal", { ascending: true });

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <PageHeader
        label="Analisis"
        title="Dashboard KAS"
        icon={BarChart3}
        description="Grafik transaksi KAS - RAM Singkut"
      />

      <KasChartDynamic data={data ?? []} />
    </main>
  );
}