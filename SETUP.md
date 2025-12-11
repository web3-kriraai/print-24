# Setup Guide for Prints24 SSR Project

## Quick Start

### 1. Install Dependencies

**Terminal 1 - Server:**
```bash
cd print24-ssr/server
npm install
```

**Terminal 2 - Client:**
```bash
cd print24-ssr/client
npm install
```

### 2. Configure Environment

Create `server/.env` file:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret_key
```

### 3. Build Client

```bash
cd print24-ssr/client
npm run build
```

This creates the `client/dist` folder with:
- `index.html` - HTML template
- `client.js` - Client hydration script
- `ssr.js` - Server-side rendering script
- `assets/` - Static assets

### 4. Start Server

```bash
cd print24-ssr/server
npm start
```

The server will:
- ✅ Serve API routes at `/api/*`
- ✅ Serve static assets from `client/dist`
- ✅ Render React components server-side
- ✅ Handle client-side hydration

Access the app at: **http://localhost:5000**

## Development Mode

For development with hot reload:

**Terminal 1 - Client Dev Server:**
```bash
cd print24-ssr/client
npm run dev
```
Runs on `http://localhost:3000` with Vite HMR

**Terminal 2 - Server:**
```bash
cd print24-ssr/server
npm start
```
Runs on `http://localhost:5000` with SSR

## Project Structure

```
print24-ssr/
├── client/                 # React Frontend
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── public/            # Static assets (served at root)
│   ├── routes.tsx         # Shared routes config (SSR + Client)
│   ├── server.tsx         # SSR entry point
│   ├── client.tsx         # Client hydration entry
│   ├── App.tsx            # Main app component
│   ├── vite.config.ts     # Vite configuration
│   └── dist/              # Build output (generated)
│
└── server/                # Express Backend
    ├── src/
    │   ├── server.js      # Main server with SSR
    │   ├── routes/        # API routes
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Database models
    │   ├── middlewares/   # Express middlewares
    │   └── config/        # Configuration files
    └── uploads/           # Uploaded files
```

## SSR Architecture

### Server-Side Rendering Flow

1. **Request arrives** → Express server
2. **Check route** → If `/api/*`, handle as API route
3. **SSR Route** → Load `client/dist/ssr.js`
4. **Render React** → `renderToString()` with `RouterProvider`
5. **Inject HTML** → Replace `<!--app-html-->` in `index.html`
6. **Send Response** → Fully rendered HTML

### Client-Side Hydration Flow

1. **Browser receives** → Server-rendered HTML
2. **Load `client.js`** → Client hydration script
3. **Create Router** → `createBrowserRouter(routes)`
4. **Hydrate** → `hydrateRoot()` matches server HTML
5. **Interactive** → React takes over, SPA navigation works

### Key Files

- **`client/routes.tsx`** - Shared routes (used by both server and client)
- **`client/server.tsx`** - SSR render function
- **`client/client.tsx`** - Client hydration entry
- **`server/src/server.js`** - Express server with SSR middleware

## Troubleshooting

### SSR Not Working

1. **Check build**: Ensure `client/dist` folder exists
2. **Check paths**: Verify `server/src/server.js` has correct path to `client/dist`
3. **Check logs**: Look for `[SSR]` messages in server console
4. **Rebuild**: Run `npm run build` in client folder

### Hydration Errors

- Ensure `routes.tsx` is identical on server and client
- Check for `Date.now()`, `Math.random()`, or `typeof window` in components
- Verify Layout component doesn't conditionally render differently

### Static Assets Not Loading

- Check `public/` folder files are copied to `dist/` during build
- Verify paths use `/logo.svg` not `/public/logo.svg`
- Check server static file serving middleware

## Production Deployment

1. Build client: `cd client && npm run build`
2. Set environment variables in `server/.env`
3. Start server: `cd server && npm start`
4. Use process manager (PM2) for production:
   ```bash
   pm2 start server/src/server.js --name prints24-ssr
   ```

## Notes

- ✅ Complete SSR implementation
- ✅ No hydration mismatches
- ✅ SEO-friendly HTML output
- ✅ Fast initial page load
- ✅ React Router v7 with RouterProvider
- ✅ Shared routes configuration

