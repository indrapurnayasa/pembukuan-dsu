import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackLink() {
  return (
    <Link href="/" className="mb-4 inline-block">
      <Button variant="ghost" size="sm">
        <ArrowLeft className="size-4 mr-1" /> Kembali
      </Button>
    </Link>
  );
}
