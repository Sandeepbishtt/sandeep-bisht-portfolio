
# Sandeep Bisht — Portfolio

Animated portfolio website built with React, TypeScript, Vite, Motion, and Tailwind CSS.

**Live site:** [https://sandeepbishtt.github.io](https://sandeepbishtt.github.io) *(after GitHub Pages deploy)*

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This repo includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — every push to `main` builds and deploys automatically.

### One-time setup

1. **Create the repo** on GitHub named exactly `Sandeepbishtt.github.io` (public).

2. **Push this project:**
   ```bash
   git remote add origin git@github.com:Sandeepbishtt/Sandeepbishtt.github.io.git
   git branch -M main
   git push -u origin main
   ```
   Or with HTTPS + GitHub CLI:
   ```bash
   gh auth login
   gh repo create Sandeepbishtt.github.io --public --source=. --remote=origin --push
   ```

3. **Enable Pages:** Repo **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.

4. After the workflow completes, the site is live at **https://sandeepbishtt.github.io**.

### Re-deploy

Push any change to `main` — GitHub Actions rebuilds and redeploys in ~1–2 minutes.
