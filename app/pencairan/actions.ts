"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function calcPencairan(fd: FormData) {
  const depositTrawas = Number(fd.get("deposit_trawas") || 0);
  const hargaPencairan = Number(fd.get("harga_pencairan") || 0);
  const pencairanSingkut = Number(fd.get("pencairan_singkut") || 0);
  const keuntunganRamSingkut = Number(fd.get("keuntungan_ram_singkut") || 0);

  const kekuranganBayar =
    hargaPencairan - depositTrawas - pencairanSingkut - keuntunganRamSingkut;

  return {
    tanggal: fd.get("tanggal") as string,
    supir: fd.get("supir") as string,
    deposit_trawas: depositTrawas,
    harga_pencairan: hargaPencairan,
    pencairan_singkut: pencairanSingkut,
    keuntungan_ram_singkut: keuntunganRamSingkut,
    kekurangan_bayar: kekuranganBayar,
  };
}

export async function createPencairan(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("pencairan").insert(calcPencairan(formData));
  revalidatePath("/");
  redirect("/");
}

export async function updatePencairan(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("pencairan").update(calcPencairan(formData)).eq("id", id);
  revalidatePath("/");
  return { ok: true };
}

export async function deletePencairan(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("pencairan").delete().eq("id", id);
  revalidatePath("/");
  return { ok: true };
}
