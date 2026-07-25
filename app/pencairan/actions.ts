"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function buildPencairanPayload(fd: FormData) {
  const supabase = await createSupabaseServerClient();
  const penjualanId = fd.get("penjualan_id") as string;
  const tanggal = fd.get("tanggal") as string;

  const { data: p } = await supabase
    .from("penjualan")
    .select("berat_berangkat, upah_mobil, total_pabrik, harga_pabrik")
    .eq("id", penjualanId)
    .single();

  if (!p) throw new Error("Penjualan tidak ditemukan");

  const deposit_trawas = Number(p.berat_berangkat) * Number(p.upah_mobil);
  const harga_pencairan = Number(p.total_pabrik) * Number(p.harga_pabrik);
  const total_pencairan = harga_pencairan - deposit_trawas;

  return {
    tanggal,
    penjualan_id: penjualanId,
    deposit_trawas,
    harga_pencairan,
    total_pencairan,
  };
}

export async function createPencairan(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const payload = await buildPencairanPayload(formData);
  await supabase.from("pencairan").insert(payload);
  revalidatePath("/");
  redirect("/");
}

export async function updatePencairan(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const payload = await buildPencairanPayload(formData);
  await supabase.from("pencairan").update(payload).eq("id", id);
  revalidatePath("/");
  return { ok: true };
}

export async function deletePencairan(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("pencairan").delete().eq("id", id);
  revalidatePath("/");
  return { ok: true };
}