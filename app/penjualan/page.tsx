import { PenjualanForm } from "@/components/forms/PenjualanForm";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function PenjualanPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("penjualan")
    .select("supir")
    .order("supir");

  const supirOptions = [...new Set((data ?? []).map((r) => r.supir).filter(Boolean))];

  return (
    <main className="container mx-auto max-w-2xl py-8 px-4">
      <PageHeader label="Input Data" title="Form Penjualan Buah" icon={Truck} description="Catat pengiriman, berat, harga, dan upah" />
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pengiriman Baru</CardTitle>
          <CardDescription>Perhitungan otomatis saat Anda mengisi form</CardDescription>
        </CardHeader>
        <CardContent>
          <PenjualanForm supirOptions={supirOptions} />
        </CardContent>
      </Card>
    </main>
  );
}