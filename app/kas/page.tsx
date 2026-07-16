import { KasForm } from "@/components/forms/KasForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function KasPage() {
  return (
    <main className="container mx-auto max-w-xl py-8 px-4">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Input Data</p>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5 flex items-center gap-2">
          <Wallet className="size-6 text-primary" />
          Form KAS
        </h1>
        <p className="text-muted-foreground mt-1">
          Catat transaksi debet/kredit harian
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Transaksi Baru</CardTitle>
          <CardDescription>
            Pilih jenis transaksi dan isi nominal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KasForm />
        </CardContent>
      </Card>
    </main>
  );
}
