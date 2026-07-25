"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKas(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const transaksi = formData.get("transaksi") as string;
  const debet =
    transaksi === "Deposit Ram Singkut" ? Number(formData.get("debet") || 0) : 0;
  const kredit =
    transaksi !== "Deposit Ram Singkut" ? Number(formData.get("kredit") || 0) : 0;

  await supabase.from("kas").insert({
    tanggal: formData.get("tanggal") as string,
    transaksi,
    debet,
    kredit,
    keterangan: (formData.get("keterangan") as string) || null,
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateKas(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const transaksi = formData.get("transaksi") as string;
  const debet =
    transaksi === "Deposit Ram Singkut" ? Number(formData.get("debet") || 0) : 0;
  const kredit =
    transaksi !== "Deposit Ram Singkut" ? Number(formData.get("kredit") || 0) : 0;

  await supabase
    .from("kas")
    .update({
      tanggal: formData.get("tanggal") as string,
      transaksi,
      debet,
      kredit,
      keterangan: (formData.get("keterangan") as string) || null,
    })
    .eq("id", id);

  revalidatePath("/");
  return { ok: true };
}

export async function deleteKas(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("kas").delete().eq("id", id);
  revalidatePath("/");
  return { ok: true };
}