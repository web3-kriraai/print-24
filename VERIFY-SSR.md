# SSR Verification Checklist

## ✅ Project Structure
- [x] `client/` folder exists with all React files
- [x] `server/` folder exists with all Express files
- [x] `client/routes.tsx` - Shared routes configuration
- [x] `client/server.tsx` - SSR render function
- [x] `client/client.tsx` - Client hydration
- [x] `server/src/server.js` - Express server with SSR

## ✅ Path Configuration
- [x] Server path to client dist: `../../client/dist` (from `server/src/server.js`)
- [x] All static assets use root paths (`/logo.svg` not `/public/logo.svg`)

## ✅ SSR Implementation
- [x] Server uses `createMemoryRouter` with shared routes
- [x] Client uses `createBrowserRouter` with same routes
- [x] Both use `RouterProvider` for consistent structure
- [x] Layout component doesn't cause hydration mismatches

## Testing Steps

### 1. Build Client
```bash
cd print24-ssr/client
npm install
npm run build
```

**Expected Output:**
- `dist/index.html` created
- `dist/client.js` created
- `dist/ssr.js` created
- `dist/assets/` folder with bundled files

### 2. Start Server
```bash
cd print24-ssr/server
npm install
# Create .env file with MONGO_URI and other configs
npm start
```

**Expected Console Output:**
```
[SSR] Client dist path: D:\print24-update\print24-ssr\client\dist
[SSR] ✅ Client dist folder found
[SSR] ✅ dist/index.html is clean (production build)
[SSR] ✅ SSR module loaded
[SSR] ✅ Render function available
✅ MongoDB connected successfully
🚀 Backend Server running on port 5000
📦 SSR Enabled - Access: http://localhost:5000
```

### 3. Test SSR

**Open Browser:**
- Navigate to `http://localhost:5000`
- Right-click → "View Page Source"

**Expected:**
- ✅ Full HTML content in `<div id="root">`
- ✅ No dev scripts (`@react-refresh`, `@vite/client`)
- ✅ `client.js` script tag present
- ✅ Complete server-rendered React components

**Check Console:**
- ✅ No hydration errors
- ✅ No React warnings
- ✅ Page loads and is interactive

### 4. Test Routes

Test these routes to verify SSR works:
- `/` - Home page
- `/digital-print` - Digital print page
- `/about` - About page
- `/login` - Login page

**For each route:**
1. View page source - should show rendered HTML
2. Check browser console - no errors
3. Verify page is interactive (clicking works)

## Common Issues & Fixes

### Issue: "SSR file not found"
**Fix:** Run `npm run build` in client folder

### Issue: "Client dist folder does not exist"
**Fix:** Check path in `server/src/server.js` is `../../client/dist`

### Issue: Hydration errors
**Fix:** 
- Verify `routes.tsx` is identical on server and client
- Check Layout component doesn't conditionally render
- Remove any `Date.now()` or `Math.random()` in initial render

### Issue: Static assets 404
**Fix:** 
- Check `public/` files are in `dist/` after build
- Verify paths use `/` not `/public/`
- Check server static middleware is configured

## Success Criteria

✅ Server renders complete HTML
✅ Client hydrates without errors
✅ All routes work with SSR
✅ Static assets load correctly
✅ No console errors
✅ Page source shows rendered content
✅ Interactive features work after hydration

