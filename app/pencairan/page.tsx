import { PencairanForm } from "@/components/forms/PencairanForm";
import {
  Card,
  CardContent,
  CardDescription,
 CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackLink } from "@/components/BackLink";

export default function PencairanPage() {
  return (
    <main className="container mx-auto max-w-xl py-10 px-4">
      <BackLink />
      <Card>
        <CardHeader>
          <CardTitle>Form Pencairan</CardTitle>
          <CardDescription>Catat deposit, harga pencairan, dan kekurangan bayar</CardDescription>
        </CardHeader>
        <CardContent>
          <PencairanForm />
        </CardContent>
      </Card>
    </main>
  );
}
