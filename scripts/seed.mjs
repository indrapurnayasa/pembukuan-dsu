import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local not found. Run setup first.");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => line.split("=")),
);

const rawUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const url = rawUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");

if (!url || !key || url.includes("xxxx")) {
  console.error("Error: Supabase credentials not configured in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

function calcPenjualan(r) {
  const selisih = r.berat_berangkat - r.berat_pabrik;
  const totalPabrik = r.berat_pabrik - r.potongan_pabrik;
  return { ...r, selisih_ram_pabrik: selisih, total_pabrik: totalPabrik };
}

async function seed() {
  console.log("Seeding dummy data (schema v3)...");

  await supabase.from("pencairan").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("penjualan").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("kas").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { error: kasError } = await supabase.from("kas").insert([
    {
      tanggal: yesterday,
      transaksi: "Deposit Ram Singkut",
      debet: 50000000,
      kredit: 0,
      keterangan: "Dummy deposit",
    },
    {
      tanggal: yesterday,
      transaksi: "Pembelian Brondolan",
      debet: 0,
      kredit: 35000000,
      keterangan: "Dummy pembelian",
    },
    {
      tanggal: today,
      transaksi: "Biaya Harian",
      debet: 0,
      kredit: 2500000,
      keterangan: "Dummy biaya",
    },
  ]);

  if (kasError) console.error("KAS seed error:", kasError);

  const penjualanRows = [
    {
      tanggal: yesterday,
      supir: "Fadli",
      berat_berangkat: 10450,
      berat_pabrik: 10390,
      potongan_pabrik: 727,
      harga_pabrik: 3500,
      upah_mobil: 500,
    },
    {
      tanggal: today,
      supir: "Arif",
      berat_berangkat: 10800,
      berat_pabrik: 10690,
      potongan_pabrik: 855,
      harga_pabrik: 3600,
      upah_mobil: 550,
    },
  ].map(calcPenjualan);

  const { data: penjualanData, error: penjualanError } = await supabase
    .from("penjualan")
    .insert(penjualanRows)
    .select("id, berat_berangkat, upah_mobil, total_pabrik, harga_pabrik");

  if (penjualanError) {
    console.error("Penjualan seed error:", penjualanError);
    return;
  }

  const pencairanRows = penjualanData.map((p) => {
    const deposit_trawas = p.berat_berangkat * p.upah_mobil;
    const harga_pencairan = p.total_pabrik * p.harga_pabrik;
    const total_pencairan = harga_pencairan - deposit_trawas;
    return {
      tanggal: today,
      penjualan_id: p.id,
      deposit_trawas,
      harga_pencairan,
      total_pencairan,
    };
  });

  const { error: pencairanError } = await supabase
    .from("pencairan")
    .insert(pencairanRows);

  if (pencairanError) console.error("Pencairan seed error:", pencairanError);

  console.log("Done.");
}

seed();