import { KasForm } from "@/components/forms/KasForm";
import { PageHeader } from "@/components/PageHeader";
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
    <main className="container mx-auto max-w-2xl py-8 px-4">
      <PageHeader
        label="Input Data"
        title="Form Kas"
        icon={Wallet}
        description="Catat transaksi debet/kredit harian"
      />

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