# Salon Product Catalog

A professional, **offline-first** wholesale hair-care product catalog, built as an
installable Progressive Web App (PWA). Designed to run on an Android tablet at a
salon counter — after the first install, it works with Wi-Fi and mobile data
both turned off.

- React + Vite + JavaScript
- IndexedDB (via Dexie) for all data and product photos — nothing is stored on a server
- Service Worker (via `vite-plugin-pwa`) caches every app asset for offline use
- No backend, no cloud database, no external APIs, no CDN fonts or images

## Development

```bash
npm install
npm run dev
```

Opens a local dev server. Note: the PWA/offline behavior is not active in dev
mode — always verify offline support against a production build (see below).

## Build

```bash
npm run build
```

Outputs a production build to `dist/`, including the service worker and web
app manifest. To sanity-check the production build locally:

```bash
npm run preview
```

## GitHub Pages (automatic deployment)

1. Create a GitHub repository named exactly **`salon-product-catalog`**
   (this must match `base: '/salon-product-catalog/'` in `vite.config.js` —
   if you use a different repo name, update that value to match).
2. Push this project to the `main` branch of that repository.
3. In the repository **Settings → Pages**, set "Source" to **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab). The
   included `.github/workflows/deploy.yml` will install dependencies, run
   `npm run build`, and publish the `dist/` folder automatically.
5. Your catalog will be live at:

   ```
   https://USERNAME.github.io/salon-product-catalog/
   ```

You never need to run `npm run dev`, `npm run preview`, or any local server
once this is deployed — GitHub Pages hosts the built files, and the Service
Worker takes over from there.

## Installing on an Android tablet

1. Open the GitHub Pages URL above in **Chrome** on the tablet.
2. Wait for the page to finish loading completely (first load requires
   internet, so the service worker and starter data can be cached).
3. Tap the Chrome menu (⋮) and choose **Install app** / **Add to Home
   screen**, or use the install banner if Chrome shows one.
4. Open **Salon Catalog** from the home screen — it opens without browser
   address bars, like a normal app.
5. Turn off Wi-Fi and mobile data.
6. Reopen Salon Catalog and confirm search, filters, product details, and
   Admin all continue to work normally.

## Using the app

- The **customer catalog** (search, filters, product grid) is the default
  screen — this is what you show customers.
- Tap the small **settings (gear) icon** in the header to open **Admin**,
  where you manage Brands, Categories, and Products, and use
  **Backup & Restore**.
- On first launch only, the catalog seeds itself with a few sample brands,
  categories and products so the app isn't empty. It never re-seeds after
  that, even if you delete everything.

## Backing up your data

Because everything lives only in this browser's local storage on this one
device, **Admin → Backup & Restore → Export backup** regularly and keep the
downloaded `SalonCatalogBackup-*.json` file somewhere safe (email it to
yourself, save it to cloud storage from a computer, etc.). If the tablet is
ever reset, lost, or replaced, use **Restore from backup** to bring the
catalog back exactly as it was, including product photos.

## Updating the app later

When you push new changes to `main`, GitHub Actions rebuilds and redeploys
automatically. The next time the tablet has internet and opens the app, the
new service worker installs in the background and takes over on the
following load — your saved brands, categories, products and photos are
never touched by an update, because they live in IndexedDB, completely
separate from the cached app files.
