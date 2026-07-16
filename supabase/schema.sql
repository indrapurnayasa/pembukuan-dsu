create table if not exists kas (
  id uuid default gen_random_uuid() primary key,
  tanggal date not null,
  transaksi text not null,
  debet numeric(15,2) default 0,
  kredit numeric(15,2) default 0,
  saldo numeric(15,2) default 0,
  keterangan text,
  created_at timestamptz default now()
);

create table if not exists penjualan (
  id uuid default gen_random_uuid() primary key,
  tanggal date not null,
  supir text not null,
  berat_berangkat numeric(10,2) default 0,
  berat_pabrik numeric(10,2) default 0,
  potongan_pabrik numeric(10,2) default 0,
  selisih_ram_pabrik numeric(10,2) default 0,
  total_pabrik numeric(12,2) default 0,
  harga_pabrik numeric(15,2) default 0,
  harga_pencairan numeric(15,2) default 0,
  upah_mobil numeric(15,2) default 0,
  total_mobil numeric(15,2) default 0,
  total_pencairan numeric(15,2) default 0,
  created_at timestamptz default now()
);

create table if not exists pencairan (
  id uuid default gen_random_uuid() primary key,
  tanggal date not null,
  supir text not null,
  deposit_trawas numeric(15,2) default 0,
  harga_pencairan numeric(15,2) default 0,
  pencairan_singkut numeric(15,2) default 0,
  keuntungan_ram_singkut numeric(15,2) default 0,
  kekurangan_bayar numeric(15,2) default 0,
  created_at timestamptz default now()
);

-- Enable realtime for live dashboard updates
alter publication supabase_realtime add table kas, penjualan, pencairan;
