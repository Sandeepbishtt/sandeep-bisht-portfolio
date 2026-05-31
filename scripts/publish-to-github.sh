#!/usr/bin/env bash
set -euo pipefail

REPO="sandeep-bisht-portfolio"
GITHUB_USER="Sandeepbishtt"

echo "Publishing portfolio to https://${GITHUB_USER}.github.io/${REPO}/"
echo ""

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install: brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Log in to GitHub first:"
  echo "  gh auth login"
  exit 1
fi

REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO}.git"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "${REMOTE_URL}"
else
  git remote add origin "${REMOTE_URL}"
fi

if gh repo view "${GITHUB_USER}/${REPO}" >/dev/null 2>&1; then
  echo "Repository ${GITHUB_USER}/${REPO} already exists."
else
  echo "Creating public repository ${REPO}..."
  gh repo create "${REPO}" --public --description "Sandeep Bisht — animated portfolio website"
fi

git branch -M main
git push -u origin main

echo ""
echo "Enable GitHub Pages if not already:"
echo "  1. Open https://github.com/${GITHUB_USER}/${REPO}/settings/pages"
echo "  2. Source → GitHub Actions"
echo ""
echo "After the deploy workflow finishes, visit:"
echo "  https://${GITHUB_USER}.github.io/${REPO}/"
