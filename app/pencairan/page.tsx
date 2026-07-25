import { PencairanForm } from "@/components/forms/PencairanForm";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function PencairanPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("penjualan")
    .select("id,tanggal,supir,berat_berangkat,upah_mobil,total_pabrik,harga_pabrik")
    .order("created_at", { ascending: false });

  return (
    <main className="container mx-auto max-w-2xl py-8 px-4">
      <PageHeader label="Input Data" title="Form Pencairan" icon={Banknote} description="Pilih penjualan, harga mobil & pencairan otomatis" />
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pencairan Baru</CardTitle>
          <CardDescription>Pilih tanggal lalu pilih record penjualan</CardDescription>
        </CardHeader>
        <CardContent>
          <PencairanForm penjualanOptions={data ?? []} />
        </CardContent>
      </Card>
    </main>
  );
}