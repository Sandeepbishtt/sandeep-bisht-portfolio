
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

3. **Enable Pages:**
   - Open [Settings → Pages](https://github.com/Sandeepbishtt/sandeep-bisht-portfolio/settings/pages)
   - **Build and deployment → Source:** **Deploy from a branch**
   - **Branch:** `gh-pages` → folder **`/ (root)`** → Save

   > If you prefer the newer GitHub Actions source instead, switch the workflow back to `deploy-pages` and set Source to **GitHub Actions**. The current workflow publishes the built `dist/` folder to the `gh-pages` branch automatically.

4. After the workflow completes, the site is live at **https://sandeepbishtt.github.io/sandeep-bisht-portfolio/**.

### Troubleshooting

**`deploy-pages` / `HttpError: Not Found`**

GitHub Actions Pages was not enabled. This repo uses the **`gh-pages` branch** method instead — set Pages source to **Deploy from a branch → gh-pages → / (root)**.

**Site still 404 after green workflow**

Wait 2–3 minutes, then hard-refresh. Confirm Pages settings show branch `gh-pages` and the latest workflow run succeeded.

### Re-deploy

Push any change to `main` — GitHub Actions rebuilds and redeploys in ~1–2 minutes.
