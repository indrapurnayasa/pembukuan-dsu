"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function calcPenjualan(fd: FormData) {
  const beratBerangkat = Number(fd.get("berat_berangkat") || 0);
  const beratPabrik = Number(fd.get("berat_pabrik") || 0);
  const potonganPabrik = Number(fd.get("potongan_pabrik") || 0);
  const hargaPabrik = Number(fd.get("harga_pabrik") || 0);
  const hargaPencairan = Number(fd.get("harga_pencairan") || 0);
  const upahMobil = Number(fd.get("upah_mobil") || 0);

  const selisihRamPabrik = beratBerangkat - beratPabrik - potonganPabrik;
  const totalPabrik = beratPabrik - potonganPabrik;
  const totalMobil = totalPabrik * hargaPabrik;
  const totalPencairan = totalPabrik * hargaPencairan - upahMobil;

  return {
    tanggal: fd.get("tanggal") as string,
    supir: fd.get("supir") as string,
    berat_berangkat: beratBerangkat,
    berat_pabrik: beratPabrik,
    potongan_pabrik: potonganPabrik,
    selisih_ram_pabrik: selisihRamPabrik,
    total_pabrik: totalPabrik,
    harga_pabrik: hargaPabrik,
    harga_pencairan: hargaPencairan,
    upah_mobil: upahMobil,
    total_mobil: totalMobil,
    total_pencairan: totalPencairan,
  };
}

export async function createPenjualan(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("penjualan").insert(calcPenjualan(formData));
  revalidatePath("/");
  redirect("/");
}

export async function updatePenjualan(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("penjualan").update(calcPenjualan(formData)).eq("id", id);
  revalidatePath("/");
  return { ok: true };
}

export async function deletePenjualan(id: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("penjualan").delete().eq("id", id);
  revalidatePath("/");
  return { ok: true };
}
