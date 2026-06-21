# sk-design-md-generator

> Extract a live website's real, measured CSS into a 17-section `DESIGN.md` your AI agents build against without hallucinating colors, fonts, spacing, or shadows.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Extracting verified design tokens from any live URL into a machine-readable `DESIGN.md` that replaces guesswork with ground truth |
| **Invoke with** | "extract design system", "generate DESIGN.md", "capture website css", "design tokens from url", or auto-routing on extraction keywords |
| **Works on** | Any publicly accessible URL that renders JavaScript. Needs Node >= 18, Playwright, and Chromium (~500 MB one-time install) |
| **Produces** | A `tokens.json` with every measured CSS value and a 17-section `DESIGN.md` conforming to the v2 format, plus optional HTML reports and fidelity proofs |

---

## 2. OVERVIEW

### Why This Skill Exists

AI agents invent colors, guess font sizes, and approximate shadows. When you tell an agent "build me a page that looks like Stripe," it fills in the gaps with plausible-sounding values that do not match the real site. A `DESIGN.md` extracted from the live CSS eliminates that problem: every hex code, font weight, border radius, box shadow, and spacing value is copied verbatim from the running page. The agent codes against measured ground truth instead of hallucinating.

### What It Does

The skill ships an embedded Playwright crawler that runs a three-phase pipeline. **Extract** crawls the target URL across five responsive viewports, collects every computed CSS value, clusters them with OKLCH delta-E, and classifies each token by temporal stability (L1 permanent through L4 content). **Write** produces a `DESIGN.md` conforming to the v2 17-section format, copying every numeric value verbatim from `tokens.json`. **Validate** checks hex accuracy and section completeness. A fourth optional phase renders HTML previews and visual-diff reports.

The cardinal rule: every value in `DESIGN.md` traces back to a token in `tokens.json`. No estimation, no rounding, no invention.

---

## 3. QUICK START

**Step 1: Install dependencies.** From the skill root, run:

```bash
cd .opencode/skills/sk-design-md-generator/tool
npm install
npx playwright install chromium   # ~500 MB, one-time
```

**Step 2: Extract tokens from a live site.**

```bash
npx ts-node scripts/extract.ts https://stripe.com --fast
# --fast crawls 5 pages at 8 concurrency. tokens.json is written to output/stripe.com/.
```

**Step 3: Write `DESIGN.md` per the v2 format.** Read `tool/resources/design-md-format.md` and `tool/resources/writing-style-guide.md`, then compose the 17-section document. Every hex, pixel, font-weight, shadow, and radius must come from `tokens.json`.

**Step 4: Validate before claiming completion.**

```bash
npx ts-node scripts/validate.ts DESIGN.md output/stripe.com/tokens.json
# Expected: zero hex mismatches, zero missing sections.
```

---

## 4. HOW IT WORKS

### The Three-Phase Pipeline

```
EXTRACT (Phase 1)
  Playwright crawls the URL across 5 viewports (mobile through wide desktop).
  Collects computed CSS: colors, typography, shadows, radii, spacing, CSS variables.
  Detects dark-mode palette, framework markers, icon system, motion tokens, a11y data.
  Each token tagged with a 4-layer stability class (L1 permanent → L4 content).
  Output: tokens.json at output/<domain>/.

WRITE (Phase 2)
  Read tokens.json + design-md-format.md for the v2 section specification.
  Compose 17-section DESIGN.md, every numeric value copied verbatim.
  L1 + L2 tokens go in main sections. L3 tokens get a "Subject to change" note.
  L4 tokens excluded entirely.

VALIDATE (Phase 3)
  validate.ts checks every hex in DESIGN.md matches tokens.json.
  Confirms all 17 required sections are present and non-empty.
  Verifies L1/L2/L3/L4 classification rules were followed.
  Output: pass/fail with per-error line references.
```

### Token Stability Classes

Each extracted token gets a stability classification that governs its presence in `DESIGN.md`:

| Class | Name | Description | In DESIGN.md? |
|---|---|---|---|
| L1 | Permanent | Brand identity — logo colors, brand typeface, core radii | Main sections |
| L2 | System | Design-system tokens — semantic colors, spacing scale | Main sections |
| L3 | Campaign | Temporary — hero gradients, seasonal accents | With "Subject to change" annotation |
| L4 | Content | Image-derived, one-off, article-specific | Excluded |

The classifier in `tool/scripts/cluster.ts` is deterministic. Boundary tokens get the higher (more restrictive) class.

### Extract Flags

```
npx ts-node scripts/extract.ts <url> [options]

  --fast                 5 pages, 8 concurrency, no interaction (recommended)
  --max-pages <n>        Max pages to crawl (default: 8)
  --concurrency <n>      Playwright concurrency (default: 5)
  --with-interaction     Capture hover/focus/active states (slower)
  --no-interaction       Skip interaction capture
  --no-dark-mode         Skip dark mode detection
  --wait-for <strategy>  Wait strategy: networkidle | css | selector:<css>
  --extra-urls           Additional URLs to crawl
  --merge-with <path>    Merge into existing tokens.json
  --output <dir>         Output directory (default: output/<domain>/)
  --verbose              Detailed logging
```

### Post-Extraction Scripts

```bash
npx ts-node scripts/validate.ts <DESIGN.md> <tokens.json>      # Phase 3: validate
npx ts-node scripts/proof.ts <url> <tokens.json>                # Fidelity proof
npx ts-node scripts/report-gen.ts <tokens.json> <dir> <DESIGN.md>  # HTML report
npx ts-node scripts/preview-gen.ts <tokens.json> <dir>          # Visual preview
```

---

## 5. INTEGRATION AND NAVIGATION

### When To Use This Skill

Reach for this skill when you need to extract a live website's real CSS into a `DESIGN.md`. Use it when building a hallucination-proof design reference for AI agents, when re-extracting after a redesign, or when validating an existing `DESIGN.md` against its source tokens.

Skip it when you are **inventing** a new design direction (palette, type scale, anti-default critique). That is `sk-design-interface`. This skill captures what exists; that skill creates what does not.

Skip it when the source is a Figma file (`mcp-figma`) or an Open Design project (`mcp-open-design`). Skip it for a screenshot or visual preview (`mcp-chrome-devtools`). Skip it when the URL is not publicly accessible or cannot render JavaScript.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design-interface` | The design-judgment sibling. It invents new direction; this skill provides the measured ground truth it consumes. |
| `sk-code` | Consumes `DESIGN.md` as the implementation contract. The hallucination-proof source of truth for colors, fonts, spacing, shadows, and radii. |
| `mcp-figma` | Extracts from Figma Desktop, not live URLs. Use when the source is a Figma file. |
| `mcp-open-design` | Extracts from Open Design projects. Use when the source is an Open Design project. |
| `mcp-chrome-devtools` | Browser inspection and visual preview. Not a structured extraction tool. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `chromium is not installed` or Playwright error | Chromium binary not downloaded | Run `npx playwright install chromium` from `tool/` (~500 MB, one-time) |
| Extraction times out or returns empty tokens | Site blocks automated crawlers or requires authentication | Try `--wait-for networkidle` or `--wait-for css`. If the site requires login, it is out of scope |
| Dark-mode section is missing | The site has no `prefers-color-scheme` media query or dark-mode CSS variables | This is expected. Include a dark-mode section only when `tokens.json` contains a detected dark palette |
| Validation reports hex mismatches | `DESIGN.md` contains values not in `tokens.json` | Re-read `tokens.json` and fix the mismatched values. Every hex must match verbatim |
| `ts-node: command not found` | Dev dependencies not installed | Run `npm install` from `tool/` |

---

## 7. FAQ

**Q: How is this different from curated design-system template libraries?**

A: Curated libraries cover ~70 fixed brands. This tool works on any URL you point it at, including your own product. The values are pixel-verified against the live CSS, not hand-written approximations. And every token gets a stability classification so you know which values are permanent and which are campaign-level.

**Q: Can I extract from a site that requires login?**

A: No. The crawler needs a publicly accessible URL that renders JavaScript. Authenticated pages are out of scope.

**Q: Do I need to write `DESIGN.md` by hand?**

A: Yes. Phase 2 (write) is the AI agent's job. The skill provides `tokens.json` and the v2 format specification in `tool/resources/design-md-format.md`. The agent composes the 17-section document, copying every value verbatim from `tokens.json`. The skill validates the result.

**Q: What if I only want to validate an existing `DESIGN.md`?**

A: Run `validate.ts` standalone. It checks hex accuracy against `tokens.json` and section completeness against the v2 format. No re-extraction needed.

**Q: How does this relate to `sk-design-interface`?**

A: This skill captures what exists on a live site. `sk-design-interface` invents new direction. When an extraction feeds into designing new UI, load `sk-design-interface` for the judgment and this skill for the ground truth.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Tool dependencies installed | `ls tool/node_modules/playwright` returns a directory |
| Chromium available | `npx playwright install --dry-run chromium` from `tool/` shows installed |
| Test suite passes | `npx vitest run` from `tool/` exits 0 |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design-md-generator/README.md --type readme` reports zero issues |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Node.js, Playwright, Chromium setup and first-extraction walkthrough |
| [`tool/README.md`](./tool/README.md) | Upstream tool README with CLI options, architecture, and output structure |
| [`tool/resources/design-md-format.md`](./tool/resources/design-md-format.md) | The authoritative v2 DESIGN.md section specification (17 sections) |
| [`tool/resources/writing-style-guide.md`](./tool/resources/writing-style-guide.md) | Voice, tone, and section-composition rules for DESIGN.md prose |
| [Skills Library](../README.md) | The skill catalog and routing front door |
