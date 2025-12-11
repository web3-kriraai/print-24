# SSR Usage Guide

## ⚠️ Important: Two Different Servers

### 1. Development Server (localhost:3000)
- **Purpose**: Development with hot reload
- **Command**: `cd client && npm run dev`
- **What you see**: Dev scripts (`@vite/client`, `@react-refresh`) - **THIS IS NORMAL**
- **SSR**: ❌ No SSR - this is client-side only
- **Use for**: Development, testing, debugging

### 2. Production SSR Server (localhost:5000)
- **Purpose**: Production with SSR
- **Command**: `cd server && npm start` (after building client)
- **What you see**: Clean HTML, no dev scripts, fully rendered content
- **SSR**: ✅ Full SSR enabled
- **Use for**: Production, testing SSR, SEO verification

## How to Use SSR

### Step 1: Build the Client
```bash
cd print24-ssr/client
npm run build
```

### Step 2: Start the SSR Server
```bash
cd print24-ssr/server
npm start
```

### Step 3: Visit SSR Server
Open: **http://localhost:5000** (NOT localhost:3000)

### Step 4: View Page Source
- Right-click → "View Page Source"
- Should see: Full HTML content in `<div id="root">`
- Should NOT see: Dev scripts or `<!--app-html-->` placeholder

## Development Workflow

### Option A: Development Mode (No SSR)
```bash
# Terminal 1: Vite Dev Server
cd print24-ssr/client
npm run dev
# Visit: http://localhost:3000
# ✅ Hot reload, fast refresh
# ❌ No SSR (dev scripts visible - this is normal)
```

### Option B: SSR Mode (Production-like)
```bash
# Terminal 1: Build client
cd print24-ssr/client
npm run build

# Terminal 2: Start SSR server
cd print24-ssr/server
npm start
# Visit: http://localhost:5000
# ✅ Full SSR, SEO-friendly
# ✅ No dev scripts
```

## Troubleshooting

### "View Page Source shows dev scripts"
- ✅ **If on localhost:3000**: This is normal (Vite dev server)
- ❌ **If on localhost:5000**: SSR not working, check server logs

### "Hydration errors"
- Check: Are you using localhost:3000? (That's dev mode, not SSR)
- Fix: Use localhost:5000 for SSR
- Check: Server console for `[SSR]` logs

### "Empty root div"
- Check: Did you build the client? (`npm run build`)
- Check: Server logs for `[SSR] ✅ Rendered` message
- Fix: Rebuild client and restart server

