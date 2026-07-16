export const rupiah = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(n ?? 0));

export const date = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("id-ID") : "-";
