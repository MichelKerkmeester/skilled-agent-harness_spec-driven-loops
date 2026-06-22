# sk-design-md-generator

> Extract a live website's real, measured CSS into a v3 **Style Reference** `DESIGN.md` your AI agents build against without hallucinating colors, fonts, spacing, or shadows.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Extracting verified design tokens from any live URL into a machine-readable `DESIGN.md` that replaces guesswork with ground truth |
| **Invoke with** | "extract design system", "generate DESIGN.md", "capture website css", "design tokens from url", or auto-routing on extraction keywords |
| **Works on** | Any publicly accessible URL that renders JavaScript. Needs Node >= 18, Playwright, and Chromium (~500 MB one-time install) |
| **Produces** | A `tokens.json` with every measured CSS value and a v3 **Style Reference** `DESIGN.md` — a named, role-driven design-system handoff with copy-paste CSS + Tailwind — plus optional HTML reports and fidelity proofs |

---

## 2. OVERVIEW

### Why This Skill Exists

AI agents invent colors, guess font sizes, and approximate shadows. When you tell an agent "build me a page that looks like Stripe," it fills in the gaps with plausible-sounding values that do not match the real site. A `DESIGN.md` extracted from the live CSS eliminates that problem: every hex code, font weight, border radius, box shadow, and spacing value is copied verbatim from the running page. The agent codes against measured ground truth instead of hallucinating.

### What It Does

The skill ships an embedded Playwright crawler that runs a three-phase pipeline. **Extract** crawls the target URL across five responsive viewports, collects every computed CSS value, clusters them with OKLCH delta-E, and classifies each token by temporal stability (L1 permanent through L4 content). **Write** produces a v3 **Style Reference** `DESIGN.md`: the value-bearing sections (colors, typography, spacing, the Quick Start CSS + Tailwind) are pre-rendered deterministically by `backend/scripts/formatters-v3.ts` and assembled by `backend/scripts/build-write-prompt.ts`, so the AI writes prose only and never emits a value. **Validate** checks hex accuracy, the v3 section set, and a Quick-Start fidelity check. A fourth optional phase renders HTML previews and visual-diff reports.

The cardinal rule: every value in `DESIGN.md` traces back to a token in `tokens.json`. No estimation, no rounding, no invention. Because the formatter emits the numbers and the AI only writes prose, the old "100rem where tokens say 100%" fabrication cannot happen. The Style Reference is a named, confident, restrained design-system handoff — not the old mechanical extraction report — but the hard guard is unchanged: never assert a system the data contradicts (no gradient-as-depth, no "focus is consistent" when it is not).

---

## 3. QUICK START

**Step 1: Install dependencies.** From the skill root, run:

```bash
cd .opencode/skills/sk-design-md-generator/backend
npm install
npx playwright install chromium   # ~500 MB, one-time
```

**Step 2: Extract tokens from a live site.**

```bash
npx ts-node scripts/extract.ts https://stripe.com --fast --output .opencode/specs/<track>/<packet>/output
# --fast crawls 5 pages at 8 concurrency. tokens.json is written to <--output>/.
```

**Step 3: Write the v3 Style Reference `DESIGN.md`.** Read `references/design_md_format_v3.md` and `references/writing_style_guide.md`. The value-bearing sections are pre-rendered by `backend/scripts/build-write-prompt.ts` (which runs `formatters-v3.ts` first); you write prose only and never type a value by hand. Every hex, pixel, font-weight, shadow, and radius still traces to `tokens.json`.

**Step 4: Validate before claiming completion.**

```bash
npx ts-node scripts/validate.ts DESIGN.md <--output>/tokens.json
# Expected: zero hex mismatches, all required v3 sections present,
# and the Quick-Start fidelity check passing (every Quick Start hex
# traces to tokens; --page-max-width matches tokens).
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
  Output: tokens.json at <--output>/.

WRITE (Phase 2)
  build-write-prompt.ts runs formatters-v3.ts to PRE-RENDER the value-bearing
  sections deterministically (a hue+lightness color-namer + token emitters):
  Tokens — Colors / Typography / Spacing & Shapes and the Quick Start CSS + Tailwind.
  The AI then writes prose ONLY (intro, roles, Components, Do's/Don'ts, Layout,
  Agent Prompt Guide, Similar Brands) and never emits a value by hand.
  Result: a v3 Style Reference DESIGN.md.
  L1 + L2 tokens go in main sections. L3 tokens get a "Subject to change" note.
  L4 tokens excluded entirely.

VALIDATE (Phase 3)
  validate.ts (v3-schema-aware) checks every hex in DESIGN.md matches tokens.json.
  Confirms the required v3 sections are present and non-empty.
  Runs a Quick-Start fidelity check: every Quick Start hex traces to tokens,
  and --page-max-width matches tokens.
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

The classifier in `backend/scripts/cluster.ts` is deterministic. Boundary tokens get the higher (more restrictive) class.

### Extract Flags

```
npx ts-node scripts/extract.ts <url> [options] --output .opencode/specs/<track>/<packet>/output

  --fast                 5 pages, 8 concurrency, no interaction (recommended)
  --max-pages <n>        Max pages to crawl (default: 8)
  --concurrency <n>      Playwright concurrency (default: 5)
  --with-interaction     Capture hover/focus/active states (slower)
  --no-interaction       Skip interaction capture
  --no-dark-mode         Skip dark mode detection
  --wait-for <strategy>  Wait strategy: networkidle | css | selector:<css>
  --extra-urls           Additional URLs to crawl
  --merge-with <path>    Merge into existing tokens.json
  --output <dir>         Output directory (default: <--output>/)
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
| `chromium is not installed` or Playwright error | Chromium binary not downloaded | Run `npx playwright install chromium` from `backend/` (~500 MB, one-time) |
| Extraction times out or returns empty tokens | Site blocks automated crawlers or requires authentication | Try `--wait-for networkidle` or `--wait-for css`. If the site requires login, it is out of scope |
| Dark-mode section is missing | The site has no `prefers-color-scheme` media query or dark-mode CSS variables | This is expected. Include a dark-mode section only when `tokens.json` contains a detected dark palette |
| Validation reports hex mismatches | `DESIGN.md` contains values not in `tokens.json` | Re-read `tokens.json` and fix the mismatched values. Every hex must match verbatim |
| `ts-node: command not found` | Dev dependencies not installed | Run `npm install` from `backend/` |

---

## 7. FAQ

**Q: How is this different from curated design-system template libraries?**

A: Curated libraries cover ~70 fixed brands. This tool works on any URL you point it at, including your own product. The values are pixel-verified against the live CSS, not hand-written approximations. And every token gets a stability classification so you know which values are permanent and which are campaign-level.

**Q: Can I extract from a site that requires login?**

A: No. The crawler needs a publicly accessible URL that renders JavaScript. Authenticated pages are out of scope.

**Q: Do I need to write `DESIGN.md` by hand?**

A: You guide it, but you don't type the values. Phase 2 (write) is the AI agent's job, working from `tokens.json` and the v3 Style Reference specification in `references/design_md_format_v3.md`. `build-write-prompt.ts` pre-renders the value-bearing sections (colors, typography, spacing, Quick Start) via `formatters-v3.ts`; the agent writes the surrounding prose only, so no value is ever hand-copied. The skill validates the result.

**Q: What if I only want to validate an existing `DESIGN.md`?**

A: Run `validate.ts` standalone. It checks hex accuracy against `tokens.json`, the v3 Style Reference section set, and the Quick-Start fidelity check (every Quick Start hex traces to tokens; `--page-max-width` matches tokens). No re-extraction needed.

**Q: How does this relate to `sk-design-interface`?**

A: This skill captures what exists on a live site. `sk-design-interface` invents new direction. When an extraction feeds into designing new UI, load `sk-design-interface` for the judgment and this skill for the ground truth.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Tool dependencies installed | `ls backend/node_modules/playwright` returns a directory |
| Chromium available | `npx playwright install --dry-run chromium` from `backend/` shows installed |
| Test suite passes | `npx vitest run` from `backend/` exits 0 |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design-md-generator/README.md --type readme` reports zero issues |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Node.js, Playwright, Chromium setup and first-extraction walkthrough |
| [`references/design_md_format_v3.md`](./references/design_md_format_v3.md) | The authoritative v3 Style Reference section specification (Header + intro, Tokens — Colors / Typography / Spacing & Shapes, Components, Do's and Don'ts, Surfaces, Elevation, Imagery, Layout, Agent Prompt Guide, Similar Brands, Quick Start) |
| [`references/writing_style_guide.md`](./references/writing_style_guide.md) | Voice, tone, and section-composition rules for DESIGN.md prose |
| [Skills Library](../README.md) | The skill catalog and routing front door |
