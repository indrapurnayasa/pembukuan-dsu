"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createKas(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const transaksi = formData.get("transaksi") as string;
  const debet =
    transaksi === "Deposit Ram Singkut" ? Number(formData.get("debet") || 0) : 0;
  const kredit =
    transaksi !== "Deposit Ram Singkut" ? Number(formData.get("kredit") || 0) : 0;

  const { data: last } = await supabase
    .from("kas")
    .select("saldo")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const saldoSebelumnya = Number(last?.saldo ?? 0);
  const saldo = saldoSebelumnya + debet - kredit;

  await supabase.from("kas").insert({
    tanggal: formData.get("tanggal") as string,
    transaksi,
    debet,
    kredit,
    saldo,
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

  // ponytail: recompute all saldo on update; acceptable for low volume
  const { data: all } = await supabase.from("kas").select("id,debet,kredit").order("created_at");
  let saldo = 0;
  const updates = (all ?? []).map((row) => {
    const isDeposit = row.id === id ? transaksi === "Deposit Ram Singkut" : false;
    // ponytail: we batch update all rows to keep saldo consistent
    const d = row.id === id ? debet : Number(row.debet ?? 0);
    const k = row.id === id ? kredit : Number(row.kredit ?? 0);
    saldo = saldo + d - k;
    return { id: row.id, saldo };
  });

  for (const u of updates) {
    await supabase.from("kas").update({ saldo: u.saldo }).eq("id", u.id);
  }

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
