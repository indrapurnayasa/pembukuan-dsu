#!/usr/bin/env bash
set -e

PROJECT_DIR="/Users/ngurahindrapurnayasa/Documents/Project Ayi/pembukuan-dsu"

echo "=== Start Local Dev Server ==="
echo ""

cd "$PROJECT_DIR"

# Check .env.local exists
if [ ! -f .env.local ]; then
  echo "Error: .env.local not found."
  echo "Run setup first: ./scripts/setup.sh"
  exit 1
fi

# Check env values are filled
if grep -q 'https://xxxx.supabase.co' .env.local || grep -q 'xxxx' .env.local; then
  echo "Error: .env.local still contains placeholder values."
  echo "Please fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  exit 1
fi

# Check node_modules exists
if [ ! -d node_modules ]; then
  echo "node_modules missing, running npm install..."
  npm install
fi

# Start dev server
echo "Starting Next.js dev server..."
npm run dev
