import { PenjualanForm } from "@/components/forms/PenjualanForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function PenjualanPage() {
  return (
    <main className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Input Data</p>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5 flex items-center gap-2">
          <Truck className="size-6 text-primary" />
          Form Penjualan Buah
        </h1>
        <p className="text-muted-foreground mt-1">
          Catat pengiriman, berat, harga, dan pencairan
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pengiriman Baru</CardTitle>
          <CardDescription>
            Perhitungan otomatis saat Anda mengisi form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PenjualanForm />
        </CardContent>
      </Card>
    </main>
  );
}
