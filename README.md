
# Sandeep Bisht — Portfolio

Animated portfolio website built with React, TypeScript, Vite, Motion, and Tailwind CSS.

**Repository:** [github.com/Sandeepbishtt/sandeep-bisht-portfolio](https://github.com/Sandeepbishtt/sandeep-bisht-portfolio)

**Live site:** [https://sandeepbishtt.github.io/sandeep-bisht-portfolio/](https://sandeepbishtt.github.io/sandeep-bisht-portfolio/) *(after GitHub Pages deploy)*

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/sandeep-bisht-portfolio/](http://localhost:5173/sandeep-bisht-portfolio/).

For root-path local dev:

```bash
VITE_BASE_PATH=/ npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This repo includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — every push to `main` builds and deploys automatically.

### One-time setup

1. **Log in to GitHub CLI** (one time):
   ```bash
   gh auth login
   ```

2. **Publish** from the project root:
   ```bash
   ./scripts/publish-to-github.sh
   ```

   Or manually:
   ```bash
   git remote add origin https://github.com/Sandeepbishtt/sandeep-bisht-portfolio.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable Pages (required — fixes deploy 404):**
   - Open [Settings → Pages](https://github.com/Sandeepbishtt/sandeep-bisht-portfolio/settings/pages)
   - Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”)
   - Save if prompted

4. **Re-run deploy:** Actions → **Deploy to GitHub Pages** → **Re-run all jobs** on the latest run (or push any commit to `main`).

5. After the workflow completes, the site is live at **https://sandeepbishtt.github.io/sandeep-bisht-portfolio/**.

### Troubleshooting

**`deploy-pages` fails with `HttpError: Not Found` / “Ensure GitHub Pages has been enabled”**

The build succeeded but Pages is not turned on yet. Complete step 3 above, then re-run the workflow. Do not re-run an old failed run from before Pages was enabled — trigger a fresh run after saving Settings.

**Private repository**

GitHub Pages works from private repos on free accounts; the published site is still public at the `github.io` URL.

### Re-deploy

Push any change to `main` — GitHub Actions rebuilds and redeploys in ~1–2 minutes.
