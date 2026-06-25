---
title: "Design System Extractor Backend"
description: "Embedded TypeScript extract, write and validate CLI pipeline that powers the sk-design-md-generator skill."
trigger_phrases:
  - "design extractor backend"
  - "tokens.json pipeline"
  - "extract.ts flags"
  - "design-system-extractor cli"
  - "ts-node design extraction"
---

# Design System Extractor Backend

> The embedded TypeScript pipeline that crawls a live URL into tokens.json, pre-renders the deterministic sections of a v3 Style Reference DESIGN.md, and validates fidelity.

---

## 1. OVERVIEW

This backend is the extract, write and validate engine behind the `sk-design-md-generator` skill. It drives a Playwright crawler that samples five viewports of a live URL, captures real measured CSS into `tokens.json`, pre-renders the deterministic value sections of a v3 Style Reference `DESIGN.md`, and checks the written document against its tokens for fidelity.

The pipeline is driven by the parent skill in [`../SKILL.md`](../SKILL.md), not run on its own. The v3 Style Reference format it targets is specified in [`../references/design_md_format.md`](../references/design_md_format.md). Modules run directly through `ts-node`, so no build step is required for normal use.

### Key Statistics

| Metric | Value |
|---|---|
| Pipeline modules | 20 TypeScript files in `scripts/` |
| Test files | 7 vitest suites in `tests/` |
| Pipeline phases | 3 core phases (extract, write, validate) plus an optional report phase |
| Execution | Runs via `ts-node`, no required build step |
| Bin name | `design-system-extractor` |

---

## 2. QUICK START

One-time setup runs from this `backend/` directory (npm needs the manifest here):

```bash
cd .opencode/skills/sk-design-md-generator/backend
npm install
npx playwright install chromium
```

Run the pipeline from the **repo root** with the full script path. `extract.ts` refuses any
`--output` that resolves inside the skill, so a relative spec-folder path only resolves
correctly from the repo root:

```bash
# Phase 1: extract a live URL into tokens.json
npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output

# Phase 2: build the WRITE prompt with pre-rendered value sections and a FACTS block
npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/build-write-prompt.ts .opencode/specs/<track>/<packet>/output/tokens.json

# Phase 3: validate a DESIGN.md against its tokens.json
npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/validate.ts .opencode/specs/<track>/<packet>/output/DESIGN.md .opencode/specs/<track>/<packet>/output/tokens.json
```

Expected result: `extract.ts` writes `tokens.json` into the `--output` directory, `build-write-prompt.ts` prints the pre-rendered v3 sections and FACTS block, and `validate.ts` prints a pass or fail report with per-finding messages.

---

## 3. FEATURES

| Phase | What It Does |
|---|---|
| Extract | Crawls the target URL across five viewports with Playwright, collects computed CSS (colors, typography, shadows, radii, spacing, CSS variables), detects dark-mode palette, framework markers, icon system, motion tokens and a11y data, then writes verbatim values to `tokens.json`. |
| Write | Runs `build-write-prompt.ts`, which pre-renders the Tokens Colors, Spacing and Shapes, Surfaces and Quick Start sections deterministically through `formatters-v3.ts`, plus a FACTS block of locked values for the prose phase to paste unchanged. |
| Validate | Runs `validate.ts` to confirm every hex in `DESIGN.md` traces to `tokens.json`, the required v3 sections are present, Quick-Start fidelity holds, and prose provenance meets the claims threshold. |
| Report | Optional. `report-gen.ts` and `preview-gen.ts` render HTML report and visual preview artifacts from a `DESIGN.md` and `tokens.json` pair, and `proof.ts` produces a fidelity proof. |

---

## 4. REQUIREMENTS

| Requirement | Minimum | Notes |
|---|---|---|
| Node.js | 20 or newer | Runtime for the embedded modules and `ts-node`. |
| Playwright Chromium | Installed binary | Required for the extract phase. Install with `npx playwright install chromium`. |
| `ts-node` | 10.9 or newer | Executes the TypeScript modules directly. Declared in `devDependencies`. |

---

## 5. STRUCTURE

```text
backend/
+-- scripts/             # 20 pipeline modules (extract, build-write-prompt, validate, report and stages)
+-- tests/               # 7 vitest suites
+-- package.json         # dependencies, scripts and the design-system-extractor bin
+-- tsconfig.json        # type-check config covering scripts/ and tests/
+-- tsconfig.build.json  # emit config, scripts/ to dist/, tests excluded
+-- vitest.config.ts     # test runner config
`-- dist/                # built output, git-ignored, produced by npm run build
```

| Path | Purpose |
|---|---|
| `scripts/extract.ts` | Phase 1 entry point. Crawls the URL and emits `tokens.json`. |
| `scripts/build-write-prompt.ts` | Phase 2 entry point. Pre-renders the deterministic v3 sections and FACTS block. |
| `scripts/formatters-v3.ts` | Deterministic v3 emitters for Colors, Spacing and Shapes, Surfaces and Quick Start. |
| `scripts/validate.ts` | Phase 3 entry point. Checks hex accuracy, section completeness and Quick-Start fidelity. |
| `scripts/report-gen.ts`, `scripts/preview-gen.ts`, `scripts/proof.ts` | Optional report-phase artifacts. |
| `scripts/cluster.ts` | Deterministic L1 to L4 token stability classifier. |
| `package.json` | Scripts, dependencies and the `design-system-extractor` bin. |
| `dist/` | Built CLI output. Git-ignored, produced by `npm run build`. |

---

## 6. USAGE EXAMPLES

A full run from a live URL to a validated `DESIGN.md`, run from the **repo root** (a relative
`--output` must resolve outside the skill for the output guard to accept it):

```bash
# Extract into a spec output folder
npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts https://example.com \
  --output .opencode/specs/<track>/<packet>/output

# Build the WRITE prompt, then author DESIGN.md prose around the pre-rendered sections
npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/build-write-prompt.ts \
  .opencode/specs/<track>/<packet>/output/tokens.json

# Validate the written DESIGN.md against its tokens.json
npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/validate.ts \
  .opencode/specs/<track>/<packet>/output/DESIGN.md \
  .opencode/specs/<track>/<packet>/output/tokens.json
```

Result: `tokens.json` holds the verbatim measured values, `build-write-prompt.ts` supplies the locked value sections, and `validate.ts` confirms the final document matches its tokens.

Maintenance scripts:

```bash
npm run typecheck   # tsc --noEmit over scripts/ and tests/
npm run build       # tsc -p tsconfig.build.json into dist/
npm test            # vitest run
```

### extract.ts Flags

| Flag | Effect |
|---|---|
| `--output <dir>` | Output directory for `tokens.json`. Required. |
| `--fast` | Fast mode: 5 pages at 8 concurrency, still captures interaction states. |
| `--max-pages <n>` | Page cap. Default 8. |
| `--concurrency <n>` | Parallel page workers. Default 5. |
| `--with-interaction` | Capture hover, focus and active states. This is the default. |
| `--no-interaction` | Opt out of interaction capture. |
| `--fast-no-interaction` | Fast crawl and skip interaction, the old `--fast` behavior. |
| `--no-dark-mode` | Skip dark-mode detection. |
| `--wait-for <strategy>` | Page-ready strategy before sampling: `networkidle`, `css` or `selector:<css>`. |
| `--extra-urls <file>` | File with additional URLs, one per line. |
| `--merge-with <path>` | Merge into an existing `tokens.json` for incremental extraction. |
| `--insecure` | Ignore HTTPS certificate errors for self-signed or staging hosts. |
| `--verbose` | Detailed logging. |

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| `Executable doesn't exist` or a Chromium launch error during extract | The Playwright Chromium binary is not installed | Run `npx playwright install chromium` from `backend/`. |
| `ts-node: command not found` or a module resolution error | Dependencies are not installed | Run `npm install` from `backend/`, which provides `ts-node` and the runtime modules. |
| `--output` error before the crawl starts | `extract.ts` requires an explicit output directory | Pass `--output <dir>`, pointing at a spec output folder rather than the skill. |

---

## 8. RELATED RESOURCES

### Related Documents

| Document | Purpose |
|---|---|
| [`../SKILL.md`](../SKILL.md) | Parent skill that drives this backend and owns the pipeline contract. |
| [`../README.md`](../README.md) | Skill-level overview and family boundary. |
| [`../references/`](../references/) | v3 Style Reference format spec, writing style guide and operational guides. |
| [`../references/design_md_format.md`](../references/design_md_format.md) | Authoritative v3 Style Reference section specification. |
| [`scripts/README.md`](scripts/README.md) | Code-folder guide to the pipeline modules in `scripts/`. |
| [`tests/README.md`](tests/README.md) | Code-folder guide to the vitest unit suite in `tests/`. |
