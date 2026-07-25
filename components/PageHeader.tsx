import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  title: string;
  icon: LucideIcon;
  description: string;
  className?: string;
};

export function PageHeader({ label, title, icon: Icon, description, className }: Props) {
  return (
    <div className={cn("mb-6", className)}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <h1 className="text-2xl font-bold tracking-tight mt-0.5 flex items-center gap-2">
        <Icon className="size-6 text-primary" />
        {title}
      </h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}