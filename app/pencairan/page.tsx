import { PencairanForm } from "@/components/forms/PencairanForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Banknote } from "lucide-react";

export default function PencairanPage() {
  return (
    <main className="container mx-auto max-w-xl py-8 px-4">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">Input Data</p>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5 flex items-center gap-2">
          <Banknote className="size-6 text-primary" />
          Form Pencairan
        </h1>
        <p className="text-muted-foreground mt-1">
          Catat deposit, harga pencairan, dan kekurangan bayar
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pencairan Baru</CardTitle>
          <CardDescription>
            Kekurangan bayar dihitung otomatis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PencairanForm />
        </CardContent>
      </Card>
    </main>
  );
}
