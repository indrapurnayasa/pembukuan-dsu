#!/usr/bin/env bash
set -e

PROJECT_DIR="/Users/ngurahindrapurnayasa/Documents/Project Ayi/pembukuan-dsu"
USE_TUNNEL=false
TUNNEL_TYPE="ngrok"
MODE="dev"

# Parse args
for arg in "$@"; do
  case "$arg" in
    --tunnel|-t)        USE_TUNNEL=true ;;
    --ngrok)            USE_TUNNEL=true; TUNNEL_TYPE="ngrok" ;;
    --cloudflared|-c)   USE_TUNNEL=true; TUNNEL_TYPE="cloudflared" ;;
    --build|-b)         MODE="build" ;;
  esac
done

echo "=== Start Server (${MODE}) ==="
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

TUNNEL_PID=""

# Start tunnel
if [ "$USE_TUNNEL" = true ]; then
  if [ "$TUNNEL_TYPE" = "ngrok" ]; then
    if ! command -v ngrok &> /dev/null; then
      echo "Error: ngrok not found."
      echo "Install with: brew install ngrok"
      echo "Then set token: ngrok config add-authtoken YOUR_TOKEN"
      exit 1
    fi

    if ! ngrok config check &> /dev/null; then
      echo "Error: ngrok authtoken not configured."
      echo "Get token from https://dashboard.ngrok.com/get-started/your-authtoken"
      echo "Then run: ngrok config add-authtoken YOUR_TOKEN"
      exit 1
    fi

    echo "Starting ngrok tunnel..."
    ngrok http 3000 --log=stdout &
    TUNNEL_PID=$!
    sleep 3
    echo ""
    echo "Public URL should appear above soon."
    echo ""

  elif [ "$TUNNEL_TYPE" = "cloudflared" ]; then
    if ! command -v cloudflared &> /dev/null; then
      echo "Error: cloudflared not found."
      echo "Install with: brew install cloudflared"
      exit 1
    fi

    echo "Starting cloudflared tunnel..."
    cloudflared tunnel --url http://localhost:3000 2>&1 &
    TUNNEL_PID=$!
    sleep 5
    echo ""
    echo "Look for the .trycloudflare.com URL above."
    echo ""
  fi
fi

# Start server
if [ "$MODE" = "build" ]; then
  echo "Building production..."
  npm run build
  echo ""
  echo "Starting production server..."
  npm start
else
  echo "Starting Next.js dev server..."
  npm run dev
fi

# Cleanup tunnel on exit
if [ -n "$TUNNEL_PID" ]; then
  trap "kill $TUNNEL_PID 2>/dev/null || true" EXIT
fi