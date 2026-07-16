import { KasForm } from "@/components/forms/KasForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackLink } from "@/components/BackLink";

export default function KasPage() {
  return (
    <main className="container mx-auto max-w-xl py-10 px-4">
      <BackLink />
      <Card>
        <CardHeader>
          <CardTitle>Form KAS</CardTitle>
          <CardDescription>Catat transaksi debet/kredit harian</CardDescription>
        </CardHeader>
        <CardContent>
          <KasForm />
        </CardContent>
      </Card>
    </main>
  );
}
