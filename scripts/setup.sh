#!/usr/bin/env bash
set -e

PROJECT_DIR="/Users/ngurahindrapurnayasa/Documents/Project Ayi/pembukuan-dsu"

echo "=== Setup Pembukuan DSU ==="
echo ""

cd "$PROJECT_DIR"

# Install dependencies
echo "[1/3] Install npm dependencies..."
npm install

# Create .env.local if missing
if [ ! -f .env.local ]; then
  echo "[2/3] Copy .env.example -> .env.local"
  cp .env.example .env.local
else
  echo "[2/3] .env.local already exists, skipped"
fi

# Final instructions
echo "[3/3] Done."
echo ""
echo "Next steps:"
echo "  1. Open .env.local and fill your Supabase credentials:"
echo "     NEXT_PUBLIC_SUPABASE_URL"
echo "     NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "  2. Run supabase/schema.sql in Supabase SQL Editor."
echo ""
echo "  3. Start dev server with:"
echo "     ./scripts/start.sh"
