import { PenjualanForm } from "@/components/forms/PenjualanForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackLink } from "@/components/BackLink";

export default function PenjualanPage() {
  return (
    <main className="container mx-auto max-w-2xl py-10 px-4">
      <BackLink />
      <Card>
        <CardHeader>
          <CardTitle>Form Penjualan Buah</CardTitle>
          <CardDescription>Catat pengiriman, berat, harga, dan pencairan</CardDescription>
        </CardHeader>
        <CardContent>
          <PenjualanForm />
        </CardContent>
      </Card>
    </main>
  );
}
