-- Phase 1: Schema rewrite — drop & recreate (DB masih kosong, aman)
-- Changes:
--   kas:       hapus saldo
--   penjualan: fix selisih_ram_pabrik (tanpa potongan), hapus harga_pencairan/total_mobil/total_pencairan
--   pencairan: hapus supir/pencairan_singkut/keuntungan_ram_singkut/kekurangan_bayar, tambah penjualan_id (cascade) + total_pencairan, snapshot deposit_trawas & harga_pencairan

drop table if exists pencairan;
drop table if exists penjualan;
drop table if exists kas;

create table kas (
  id uuid default gen_random_uuid() primary key,
  tanggal date not null,
  transaksi text not null,
  debet numeric(15,2) default 0,
  kredit numeric(15,2) default 0,
  keterangan text,
  created_at timestamptz default now()
);

create table penjualan (
  id uuid default gen_random_uuid() primary key,
  tanggal date not null,
  supir text not null,
  berat_berangkat numeric(10,2) default 0,
  berat_pabrik numeric(10,2) default 0,
  potongan_pabrik numeric(10,2) default 0,
  selisih_ram_pabrik numeric(10,2) default 0,  -- = berat_berangkat - berat_pabrik
  total_pabrik numeric(12,2) default 0,         -- = berat_pabrik - potongan_pabrik
  harga_pabrik numeric(15,2) default 0,
  upah_mobil numeric(15,2) default 0,
  created_at timestamptz default now()
);

create table pencairan (
  id uuid default gen_random_uuid() primary key,
  tanggal date not null,
  penjualan_id uuid references penjualan(id) on delete cascade,
  deposit_trawas numeric(15,2) default 0,     -- snapshot = berat_berangkat × upah_mobil
  harga_pencairan numeric(15,2) default 0,   -- snapshot = total_pabrik × harga_pabrik
  total_pencairan numeric(15,2) default 0,    -- = harga_pencairan - deposit_trawas
  created_at timestamptz default now()
);

-- Enable realtime for live dashboard updates
alter publication supabase_realtime add table kas, penjualan, pencairan;