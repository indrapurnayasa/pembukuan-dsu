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

// ponytail: sanitize URL in case user pasted /rest/v1/ endpoint
const url = rawUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");

if (!url || !key || url.includes("xxxx")) {
  console.error("Error: Supabase credentials not configured in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

async function seed() {
  console.log("Seeding dummy data...");

  const { error: kasError } = await supabase.from("kas").insert([
    {
      tanggal: yesterday,
      transaksi: "Deposit Ram Singkut",
      debet: 50000000,
      kredit: 0,
      saldo: 50000000,
      keterangan: "Dummy deposit",
    },
    {
      tanggal: yesterday,
      transaksi: "Pembelian Brondolan",
      debet: 0,
      kredit: 35000000,
      saldo: 15000000,
      keterangan: "Dummy pembelian",
    },
    {
      tanggal: today,
      transaksi: "Biaya Harian",
      debet: 0,
      kredit: 2500000,
      saldo: 12500000,
      keterangan: "Dummy biaya",
    },
  ]);

  if (kasError) console.error("KAS seed error:", kasError);

  const { error: penjualanError } = await supabase.from("penjualan").insert([
    {
      tanggal: yesterday,
      supir: "Fadli",
      berat_berangkat: 10450,
      berat_pabrik: 10390,
      potongan_pabrik: 727,
      selisih_ram_pabrik: -667,
      total_pabrik: 9663,
      harga_pabrik: 3500,
      harga_pencairan: 3600,
      upah_mobil: 500000,
      total_mobil: 33820500,
      total_pencairan: 34286800,
    },
    {
      tanggal: today,
      supir: "Arif",
      berat_berangkat: 10800,
      berat_pabrik: 10690,
      potongan_pabrik: 855,
      selisih_ram_pabrik: -745,
      total_pabrik: 9835,
      harga_pabrik: 3600,
      harga_pencairan: 3700,
      upah_mobil: 550000,
      total_mobil: 35406000,
      total_pencairan: 35839500,
    },
  ]);

  if (penjualanError) console.error("Penjualan seed error:", penjualanError);

  const { error: pencairanError } = await supabase.from("pencairan").insert([
    {
      tanggal: today,
      supir: "Fadli",
      deposit_trawas: 20000000,
      harga_pencairan: 34286800,
      pencairan_singkut: 10000000,
      keuntungan_ram_singkut: 2000000,
      kekurangan_bayar: 2286800,
    },
    {
      tanggal: today,
      supir: "Arif",
      deposit_trawas: 25000000,
      harga_pencairan: 35839500,
      pencairan_singkut: 8000000,
      keuntungan_ram_singkut: 1500000,
      kekurangan_bayar: 1339500,
    },
  ]);

  if (pencairanError) console.error("Pencairan seed error:", pencairanError);

  console.log("Done.");
}

seed();
