# Expected View Page Source (SSR)

Based on the current SSR implementation, here's what the **View Page Source** should look like when you visit `http://localhost:5000`:

## ✅ Correct View Page Source (SSR Working)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Prints24 - Premium Digital Printing</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              serif: ['Playfair Display', 'serif'],
            },
            colors: {
              cream: {
                50: '#fcfaf8',
                100: '#f8f5f2',
                200: '#f0e9e1',
                300: '#e6d8c9',
                400: '#d6bc9f',
                500: '#c49d79',
                600: '#b68761',
                700: '#976b4d',
                800: '#7d5843',
                900: '#654838',
              }
            }
          }
        }
      }
    </script>
    <style>
      body {
        background-color: #fcfaf8; /* cream-50 */
        color: #654838; /* cream-900 */
      }
    </style>
  </head>
  <body>
    <div id="root">
      <!-- FULLY RENDERED REACT COMPONENTS HERE -->
      <!-- This will contain the complete HTML from your React app -->
      <!-- For example, if on Home page, you'll see: -->
      <div class="min-h-screen flex flex-col font-sans text-cream-900 bg-cream-50">
        <!-- Navbar HTML -->
        <nav>...</nav>
        <!-- Main content HTML -->
        <main class="flex-grow pt-16">
          <!-- Home page content HTML -->
          <div>...</div>
        </main>
        <!-- Footer HTML -->
        <footer>...</footer>
      </div>
    </div>
    <script type="module" src="/client.js"></script>
  </body>
</html>
```

## Key Points

### ✅ What Should Be Present:

1. **Complete HTML Structure**
   - Full `<head>` with meta tags, Tailwind CDN, fonts
   - Complete `<body>` with rendered content

2. **Rendered React Content**
   - `<div id="root">` contains **actual HTML** from React components
   - Not just `<div id="root"></div>` (empty)
   - Not `<!--app-html-->` placeholder
   - Full component tree rendered as HTML

3. **Client Hydration Script**
   - `<script type="module" src="/client.js"></script>` at the end
   - This enables client-side interactivity

4. **No Dev Scripts**
   - ❌ No `@react-refresh`
   - ❌ No `@vite/client`
   - ❌ No `index.tsx` or `client.tsx` dev scripts
   - ❌ No `modulepreload` links
   - ❌ No Vite asset scripts in `<head>`

### ❌ What Should NOT Be Present:

1. **Empty Root Div**
   ```html
   <!-- WRONG - SSR not working -->
   <div id="root"></div>
   ```

2. **Placeholder Comment**
   ```html
   <!-- WRONG - SSR not working -->
   <div id="root"><!--app-html--></div>
   ```

3. **Dev Server Scripts**
   ```html
   <!-- WRONG - Development build -->
   <script type="module" src="/@vite/client"></script>
   <script type="module">import { injectIntoGlobalHook } from "/@react-refresh"</script>
   ```

## Example: Home Page View Source

When visiting `http://localhost:5000/`, the view source should show:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- ... head content ... -->
  </head>
  <body>
    <div id="root">
      <div class="min-h-screen flex flex-col font-sans text-cream-900 bg-cream-50">
        <!-- Navbar rendered HTML -->
        <nav class="...">
          <div class="...">
            <a href="/">
              <img src="/logo.svg" alt="Prints24 Logo" class="...">
            </a>
            <!-- Navigation links HTML -->
          </div>
        </nav>
        
        <!-- Main content rendered HTML -->
        <main class="flex-grow pt-16">
          <!-- Hero section HTML -->
          <section class="...">
            <h1>Welcome to Prints24</h1>
            <!-- More content -->
          </section>
          
          <!-- Categories section HTML -->
          <section class="...">
            <!-- Category cards HTML -->
          </section>
          
          <!-- Reviews section HTML -->
          <section class="...">
            <!-- Reviews HTML -->
          </section>
        </main>
        
        <!-- Footer rendered HTML -->
        <footer class="...">
          <!-- Footer content HTML -->
        </footer>
      </div>
    </div>
    <script type="module" src="/client.js"></script>
  </body>
</html>
```

## How to Verify SSR is Working

1. **Start the server:**
   ```bash
   cd print24-ssr/server
   npm start
   ```

2. **Visit the page:**
   - Open `http://localhost:5000` in browser

3. **View Page Source:**
   - Right-click → "View Page Source" (or Ctrl+U)
   - **DO NOT** use "Inspect Element" (that shows client-side DOM)

4. **Check for:**
   - ✅ `<div id="root">` contains actual HTML content
   - ✅ No `<!--app-html-->` placeholder
   - ✅ No dev scripts (`@vite/client`, `@react-refresh`)
   - ✅ `client.js` script tag present
   - ✅ Complete page structure visible

## SSR Process Flow

1. **Request** → `http://localhost:5000/`
2. **Server** → Reads `client/dist/index.html` template
3. **SSR Render** → Calls `ssrRender('/')` from `client/dist/ssr.js`
4. **React Render** → `renderToString()` renders Home component
5. **Inject HTML** → Replaces `<!--app-html-->` with rendered HTML
6. **Clean Scripts** → Removes dev scripts, ensures `client.js` present
7. **Response** → Sends complete HTML to browser
8. **Hydration** → Browser loads `client.js`, React hydrates the HTML

## Troubleshooting

### If you see empty `<div id="root"></div>`:
- ❌ SSR not working
- Check: Server console for `[SSR]` logs
- Fix: Ensure `client/dist/ssr.js` exists and is loaded

### If you see `<!--app-html-->`:
- ❌ SSR render function not replacing placeholder
- Check: Server console for `[SSR] ✅ Rendered` message
- Fix: Verify `ssrRender` function is working

### If you see dev scripts:
- ❌ Production build not used
- Check: `client/dist/index.html` should not have dev scripts
- Fix: Rebuild with `npm run build` in client folder

