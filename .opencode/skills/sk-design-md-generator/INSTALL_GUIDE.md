# INSTALL_GUIDE — sk-design-md-generator

Setup for the embedded extraction tool: Node.js, Playwright, Chromium, and a first extraction.

---

## 1. PREREQUISITES

| Requirement | Version | Check |
|---|---|---|
| Node.js | >= 18 | `node --version` |
| npm | Any recent version | `npm --version` |
| Disk space | ~500 MB for Chromium | `df -h .` |

macOS, Linux, and Windows (WSL) are supported. The Playwright installer handles platform-specific Chromium binaries automatically.

---

## 2. INSTALL

**Step 1: Install Node dependencies.**

```bash
cd .opencode/skills/sk-design-md-generator/tool
npm install
```

This installs the tool's runtime dependencies: `playwright`, `playwright-extra`, `puppeteer-extra-plugin-stealth`, `css-tree`, `culori`, and `ts-node`.

**Step 2: Install Chromium.**

```bash
npx playwright install chromium
```

This downloads the Chromium binary Playwright uses to crawl live sites. It is ~500 MB and is a one-time operation. Subsequent runs reuse the cached binary.

**Step 3: Verify the installation.**

```bash
npx vitest run
```

Expected: all tests pass with exit code 0. If any test fails, check the troubleshooting section below before proceeding.

---

## 3. FIRST EXTRACTION

Run a fast extraction against a public site to confirm everything works end-to-end:

```bash
npx ts-node scripts/extract.ts https://stripe.com --fast --output .opencode/specs/<track>/<packet>/output
```

Expected output:

- The crawler visits 5 pages at 8 concurrency.
- `tokens.json` is written to `<--output>/`.
- The file contains non-empty token arrays for colors, typography, shadows, radii, and spacing.

Validate a `DESIGN.md` against the extracted tokens:

```bash
npx ts-node scripts/validate.ts DESIGN.md <--output>/tokens.json
```

Expected: zero hex mismatches, zero missing sections.

---

## 4. TROUBLESHOOTING

### Chromium not installed

**Symptom:** `playwright: chromium is not installed` or similar error during extraction.

**Fix:**

```bash
npx playwright install chromium
```

If the install fails, check your network connection and proxy settings. Playwright downloads from `playwright.azureedge.net`. On corporate networks, you may need to whitelist that domain.

### Site blocks the crawler

**Symptom:** Extraction returns empty `tokens.json` or the crawler times out.

**Fix:** Try adjusting the wait strategy:

```bash
npx ts-node scripts/extract.ts https://example.com --fast --wait-for networkidle --output .opencode/specs/<track>/<packet>/output
```

If the site requires authentication, it is out of scope. The tool only works on publicly accessible URLs that render JavaScript.

### ts-node errors

**Symptom:** `ts-node: command not found` or TypeScript compilation errors.

**Fix:** Ensure you ran `npm install` from the `tool/` directory. The `ts-node` binary is in `tool/node_modules/.bin/`. Use `npx ts-node` (not a global install) to resolve it.

### Playwright version conflicts

**Symptom:** Browser launch fails with a version mismatch error.

**Fix:** Reinstall both the npm packages and the browser binary:

```bash
rm -rf node_modules
npm install
npx playwright install chromium
```

### Tests fail after install

**Symptom:** `npx vitest run` reports failures.

**Fix:** Confirm Chromium is installed (`npx playwright install chromium`). Some tests exercise the crawler and require the binary. If failures persist, check `tool/CHANGELOG.md` for known issues against your Node.js version.

---

## 5. UNINSTALL

To remove the tool's dependencies and cached Chromium binary:

```bash
cd .opencode/skills/sk-design-md-generator/tool
rm -rf node_modules
npx playwright uninstall chromium
```

The embedded source under `tool/scripts/` and `tool/resources/` is part of the repo and is not affected by uninstalling dependencies.
