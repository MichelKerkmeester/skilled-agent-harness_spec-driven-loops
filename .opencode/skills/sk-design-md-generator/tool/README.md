# Design MD Generator

[![Version](https://img.shields.io/badge/version-0.0.4-blue.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-50%20passed-brightgreen.svg)]()
[![Stitch Compatible](https://img.shields.io/badge/Google%20Stitch-compatible-orange.svg)]()
[![Format](https://img.shields.io/badge/format-v2%20(17%20sections)-purple.svg)]()

Extract design systems from any website. Drop a `DESIGN.md` into your project, tell your AI agent "build me a page that looks like this," and get UI that actually matches.

**Works with:** Claude Code · Cursor · GitHub Copilot · OpenAI Codex · Gemini CLI · Windsurf · Google Stitch

## Why This Exists

AI agents hallucinate design values. They invent colors, guess font sizes, and approximate shadows. This tool extracts the real values from the live site — every hex code, every font weight, every shadow — and classifies them by temporal stability so you know which values are permanent design decisions and which are temporary campaign content.

Every value is verified: pixel-level fidelity proofs compare the extracted palette against the original site (image regions excluded, CSS-only).

| Site | Color Coverage | Palette | Quality |
|------|---------------|---------|---------|
| Stripe | 99.9% | 76 colors | 100/100 |
| Vercel | 100.0% | 47 colors | 95/100 |
| Notion | 100.0% | 27 colors | 97/100 |
| Linear | 100.0% | 40 colors | 94/100 |
| Supabase | 100.0% | 17 colors | 86/100 |
| Shopify | 100.0% | 29 colors | 87/100 |

## DESIGN.md v2 Format

The v2 format produces a 17-section document that exceeds what any existing design system tool generates:

| Section | Content |
|---------|---------|
| 0. Brand Context | Company identity, audience, personality with design evidence |
| 1. Visual Theme | Named principles, comparative framing, key characteristics |
| 2. Color Palette | Brand vs Structural split, frequency, 6-dimension usage, CSS variables |
| 2.5. Dark Mode | Full parallel system with variable mapping (when detected) |
| 3. Typography | Hierarchy table with OpenType features, named strategies, substitution notes |
| 4. Components | Every variant with Use: lines, state rationale, transitions |
| 5. Layout | Spacing frequencies, grid, whitespace philosophy with contrast statements |
| 6. Depth & Elevation | Named principle, shadow table with frequency, decorative depth |
| 6.5. Motion | Philosophy, duration/easing with frequency, choreography, reduced-motion |
| 7. Content & Voice | Tone, casing rules, button patterns, emoji policy, voice examples, vibe |
| 8. Do's and Don'ts | Counter-intuitive test, specific thresholds, copy-paste shortcuts |
| 9. Accessibility | WCAG target, contrast table, focus spec, touch targets, ARIA patterns |
| 10. Responsive | Breakpoints with CSS rule counts, collapsing strategy |
| 11. State Matrix | Component × State (loading/empty/error/disabled/success) |
| 12. Iconography | System detection, sizing scale, substitution recommendation |
| 13. Agent Prompt Guide | Zero-lookup prompts, self-containment checklist, iteration guide |

### 4-Layer Stability Classification

Every token is classified by temporal stability:

| Layer | Stability | Example | In DESIGN.md? |
|-------|-----------|---------|---------------|
| L1 Infrastructure | Permanent | Nav colors, link blue, font system | Main sections |
| L2 System | Redesign cycle | Button styles, card shadows, spacing | Main sections |
| L3 Campaign | Per-launch | Hero accents, promo banners | "Campaign" note |
| L4 Content | Constant change | Product image colors, swatches | Excluded |

Test: "Will this value still be correct 6 months from now?"

## Quick Start

### Use with Any AI Agent

Clone this repo into your project. Your AI agent reads the matching instructions file:

```
CLAUDE.md      → Claude Code
.cursorrules   → Cursor
AGENTS.md      → OpenAI Codex CLI
GEMINI.md      → Gemini CLI
.windsurfrules → Windsurf
.github/copilot-instructions.md → GitHub Copilot
```

### Install as Claude Code Skill

```bash
/install-skill https://github.com/jasonhnd/design-md-generator
```

### Extract Design Tokens

```bash
npm install && npx playwright install chromium

# Fast extraction (default: no interaction capture, 5 pages, 8 concurrent)
npx ts-node scripts/extract.ts https://stripe.com --fast

# Full extraction with interaction states
npx ts-node scripts/extract.ts https://stripe.com --with-interaction --max-pages 10
```

## How It Works

### 3-Phase Parallel Pipeline (target: under 4 minutes)

**Phase 1 — Fast Extract** (~60-120s)

Playwright crawls the site with `--fast` defaults (5 pages, 8 concurrent, no interaction capture). Collects every computed style, CSS variable, font, shadow. OKLCH delta-E clustering reduces raw data into tokens. Each token gets a 4-layer stability classification.

**Phase 2 — Parallel Write + Proof** (~70s)

10 subagents write sections in parallel (opus model). Simultaneously, a proof task captures the live site for fidelity verification. Total Phase 2 time = slowest agent, not sum of all.

**Phase 3 — Assemble & Deliver** (~20s)

Concatenate sections, cross-audit naming consistency, machine pre-validate hex values, run validation script, generate report, open in browser.

## CLI Options

```
npx ts-node scripts/extract.ts <url> [options]

  --fast                 Fast mode: 5 pages, no interaction, 8 concurrent (recommended)
  --with-interaction     Enable hover/focus/active state capture (slower, more data)
  --output <dir>         Output directory (default: output/<domain>/)
  --concurrency <n>      Playwright concurrency (default: 5, --fast sets 8)
  --max-pages <n>        Max pages to crawl (default: 8, --fast sets 5)
  --wait-for <strategy>  Wait strategy: networkidle | css | selector:<css>
  --merge-with <path>    Merge into existing tokens.json (incremental)
  --no-dark-mode         Skip dark mode detection
  --verbose              Detailed logging
```

### Post-Extraction

```bash
npx ts-node scripts/preview-gen.ts <tokens.json> [output-dir]     # Visual preview
npx ts-node scripts/report-gen.ts <tokens.json> [dir] [DESIGN.md]  # Full report
npx ts-node scripts/proof.ts <url> <tokens.json> [output-dir]      # Fidelity proof
npx ts-node scripts/validate.ts <DESIGN.md> <tokens.json>          # Validation
npm test                                                            # 50 tests
```

## Output

```
output/<domain>/
  tokens.json              Design tokens with stability classification
  report.html              Quality report + fidelity proof + live component preview
  preview.html             Visual token preview
  DESIGN.md                Generated design system document (v2, 17 sections)
  extraction-report.json   Metadata and diagnostics
  screenshots/             5-viewport screenshots + dark mode
```

## What Gets Extracted

| Category | Details |
|----------|---------|
| Colors | OKLCH delta-E clustered, 6-dimension usage, stability classified |
| Typography | Full hierarchy, OpenType features, named strategies |
| Components | Variants with Use: lines, state rationale, transitions |
| Interactions | Hover, focus, active, disabled (opt-in via `--with-interaction`) |
| Shadows | Parenthesis-aware classification, frequency, named principles |
| Dark Mode | Multi-page detection, CSS variable light/dark diff |
| Layout | Spacing frequencies, grid, section rhythms |
| Motion | Duration/easing with frequency, choreography, reduced-motion |
| Accessibility | ARIA roles, contrast ratios, focus indicators, touch targets, alt text |
| Icons | System detection, size distribution, stroke width, label rate |
| States | Loading skeleton/shimmer, empty state, error state detection |
| Stability | 4-layer classification (infrastructure/system/campaign/content) |

## Architecture

```
scripts/           19 TypeScript modules — extraction + classification pipeline
resources/         6 reference docs — format spec, style guide, quality checklist
examples/          Gold standard outputs (Stripe, Vercel, Linear, Supabase)
SKILL.md           Full v2 specification with 10-agent parallel pipeline (~50KB)
AGENTS.md          Codex CLI entry point
CLAUDE.md          Claude Code entry point
GEMINI.md          Gemini CLI entry point
.cursorrules       Cursor entry point
.windsurfrules     Windsurf entry point
.github/copilot-instructions.md   Copilot entry point
```

## vs. Curated Template Libraries

| | Curated Templates | This Tool |
|---|---|---|
| Coverage | ~70 fixed brands | Any URL |
| Accuracy | Human-written, no ground truth | Pixel-verified (ΔE<12) |
| Stability classification | No | 4-layer (infrastructure/system/campaign/content) |
| Non-English sites | No | Yes (Japanese, Chinese, Korean...) |
| Your own product | Not possible | Any URL you own |
| Freshness | Snapshot (may be stale) | Live extraction |
| Content vs System | Mixed together | Separated by stability layer |
| Interaction states | No | Hover, focus, active, disabled |
| Dark mode | Manual | Auto-detected + CSS variable diff |
| Sections | 9 | 17 (v2 format) |

## Disclaimer

Generated DESIGN.md files are extracted from publicly accessible CSS values and are not official design system documentation. Colors, fonts, and spacing may not be 100% accurate. Commercial fonts require separate licensing.

## License

MIT
