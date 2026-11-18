---
title: sk-design-md-generator
description: Extracts a live website's real, measured CSS into a v3 Style Reference DESIGN.md so AI agents build against ground truth instead of hallucinated values.
trigger_phrases:
  - "extract design system"
  - "generate design.md"
  - "capture website css"
  - "design tokens from url"
  - "validate design.md"
version: 1.1.9.0
---

# sk-design-md-generator

> A measured v3 Style Reference `DESIGN.md` taken from a live website, so agents build against the page's real colors, type, spacing and shadows.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | A design reference measured from a page that already runs |
| **Invoke with** | `/design:extract <live-url> --output <dir>`, or extraction words through the `sk-design` hub |
| **Works on** | A public URL that renders JavaScript, crawled at five viewport widths |
| **Produces** | `tokens.json` and a v3 Style Reference `DESIGN.md` with copy-paste CSS and Tailwind |

### What It Does

This packet turns a running website into a design reference an agent can build from. It crawls the page with an embedded Playwright crawler, records the computed CSS it finds, and writes the measured values to `tokens.json`. A second pass turns those tokens into a v3 Style Reference `DESIGN.md`: named colors, a type scale, the measured components and a Quick Start block of CSS and Tailwind you can paste.

The canonical entry point is `/design:extract <live-url> --output <dir>`. A request that names `DESIGN.md` or `tokens.json` also routes here through the `sk-design` hub.

The packet captures a surface that exists. It does not invent a direction for a surface that does not.

### The Cardinal Rule

Every value in `DESIGN.md` traces to a token in `tokens.json`. The value-bearing sections are rendered from the tokens and pasted unchanged, so the pipeline never asks a writer to type a number. Two guards hold the rest. Hex codes are six-digit lowercase. A claim the tokens contradict is never asserted. When the tokens record no shadows, the reference records that absence instead of describing depth it never measured.

### The Design-System Knowledge Layer

The reference is only as useful as its section set. That set is what a downstream implementer reads. Each capability below is a step this packet owns end to end.

| Capability | What the skill knows how to operate |
|---|---|
| **Token extraction** | Crawls a public URL at five widths and writes each computed CSS value to `tokens.json` with a stability class |
| **Value sections** | Renders the color section, the spacing and shape section, the surface section and the Quick Start block from `tokens.json` through `backend/scripts/formatters-v3.ts` |
| **Prose authorship** | Locks the numbers in a FACTS block so the writer adds the intro, the typography roles and the component prose without typing a value |
| **Fidelity checks** | Reads the finished file against `tokens.json` for hex accuracy, section presence, Quick Start values and prose provenance |

---

## 2. QUICK START

**Step 1: Install the crawler.** Run the setup from `backend/`, where the package manifest lives.

```bash
cd .skilled/skills/sk-design/sk-design-md-generator/backend
npm install
npx playwright install chromium
```

`npm install` resolves the runtime dependencies listed in `backend/package.json`. The Playwright command downloads Chromium, about 500 MB on the first run, and later runs reuse the cached binary. `backend/package.json` pins `engines.node` to `^22.23.4 || ^24.22.1 || >=26.12.1`.

**Step 2: Extract the tokens.** Run the pipeline from the repo root. `backend/scripts/output-policy.ts` accepts an `--output` only under `specs/` (or `.opencode/specs/`) or a `skd-` sandbox in the system temp directory, so a relative spec path resolves correctly from there.

```bash
npx ts-node .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts https://stripe.com --fast --output specs/<track>/<packet>/output
```

The run prints `Extraction complete in <n>s`, then `Output: <absolute path>` and `Files: tokens.json, extraction-report.json, <n> screenshots`. `--fast` visits five pages at concurrency eight and still captures interaction states.

**Step 3: Build the write prompt.**

```bash
npx ts-node .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts specs/<track>/<packet>/output/tokens.json
```

The prompt prints to stdout. It opens with a `WRITE phase` heading, then the pre-rendered value sections, then the FACTS block. Read [the format specification](./references/design-md-format.md) and [the writing guide](./references/writing-style-guide.md) before you write, paste the value sections unchanged and put the prose around them.

**Step 4: Validate before you rely on it.** The markdown file comes first and the token file second.

```bash
npx ts-node .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/validate.ts specs/<track>/<packet>/output/DESIGN.md specs/<track>/<packet>/output/tokens.json
```

The report opens with `=== DESIGN.md Validation ===`. It lists the checks that passed and prints `Score: <n>/100` with separate values and claims scores. A clean run ends with `Result: PASS` and exit code 0. A hard failure prints under `Hard failures`, ends with a `Result: FAIL (<hard categories> failures are hard)` line and exits 1.

---

## 3. HOW IT WORKS

The packet runs one sequence from a live URL to a checked file. A crawl reads the live page at five viewport widths and keeps the computed styles it can see, covering colors, type, shadows, radii, spacing and CSS custom properties. The cluster step groups values that are near-identical and stamps each token with a stability class. A deterministic renderer builds the value tables from the tokens, and the writer adds prose around them. The validator reads the finished file against `tokens.json` before anyone calls it done.

```text
┌──────────────────────────────────────────────────────────┐
│ Live URL                                                 │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ extract.ts crawls five viewports                         │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ cluster.ts groups values and stamps L1 to L4             │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ tokens.json                                              │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ formatters-v3.ts renders the value sections              │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ build-write-prompt.ts prints the prompt and FACTS block  │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ DESIGN.md                                                │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ validate.ts checks hex, sections and Quick Start         │
└──────────────────────────────────────────────────────────┘
```

The report phase is optional. `proof.ts` compares rendered output against the live page. `report-gen.ts` writes `report.html`, and `preview-gen.ts` writes `preview.html`. Each one reads an existing token file and refuses to overwrite a previous artifact unless you pass `--force`.

### Token Stability Classes

`backend/scripts/cluster.ts` stamps each token with one of four classes. The class decides whether the token may appear in the reference, and a token on a boundary takes the higher, more restrictive class.

| Class | Name | Meaning | In DESIGN.md? |
|---|---|---|---|
| L1 | Permanent | Brand identity (logo colors, brand typeface, core radii) | Main sections |
| L2 | System | Design-system tokens (semantic colors, spacing scale) | Main sections |
| L3 | Campaign | Temporary (seasonal accents, hero gradients) | With a "Subject to change" note |
| L4 | Content | Image-derived or one-off | Excluded |

A color seen on fewer than 30% of crawled pages is capped at L3 even when its raw frequency would otherwise lift it, so a site-wide color has to appear across the crawl rather than on one page.

### Extract Flags

`npx ts-node .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts --help` prints the full list. These are the flags a request usually has to choose between.

| Flag | What it does |
|---|---|
| `--output <dir>` | Required. Sets the directory that receives `tokens.json` and the screenshots |
| `--fast` | Five pages at concurrency eight, with interaction capture still on |
| `--max-pages <n>` | Page cap, eight by default |
| `--concurrency <n>` | Playwright concurrency, five by default |
| `--no-interaction` | Skips hover, focus and active capture |
| `--fast-no-interaction` | The fast crawl without interaction capture |
| `--wait-for <strategy>` | Waits on `networkidle`, `css` or `selector:<css>` |
| `--merge-with <path>` | Merges the run into an existing `tokens.json` |

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when the reference has to come from a page that is running, either a first capture of a site or a refresh after a redesign. A validation-only request against an existing `DESIGN.md` also starts here and needs no new crawl.

Skip it when the work is a new direction rather than a measurement. `sk-code-frontend` decides a visual value the measurement does not cover, and a brief with no live site is out of scope here. A Figma file goes to `mcp-figma`. A screenshot request goes to `mcp-chrome-devtools`, and a page behind a login lands outside this packet.

A brief-only request that names `DESIGN.md` still lands here. The packet refuses it and points at the boundary instead of producing a partial reference. [The authoring boundary guide](./references/authoring-boundary.md) holds the line between a measured value and a stated intent.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | The hub that routes here, and it authors nothing itself |
| `sk-code` | Implements against `DESIGN.md` as the measured contract, and bundles `sk-code-frontend` |
| `sk-code-frontend` | Decides a visual value where no measurement exists |
| `mcp-figma` | Reads a Figma file rather than a live URL |
| `mcp-chrome-devtools` | Inspects and screenshots a page, without a token file |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `browserType.launch: Executable doesn't exist` | Chromium was never installed for Playwright | Run `npx playwright install chromium` from `backend/` |
| `Error: --output is required`, or a refused path | The output resolved inside the skill, or outside every allowed root | Run from the repo root and pass `--output specs/<track>/<packet>/output` |
| `ERROR: No pages successfully crawled` | The site blocks automated browsers or never finishes rendering | Try `--wait-for css` or `--max-pages 1` on a reachable page. A login wall is out of scope |
| No dark-mode section in `DESIGN.md` | `tokens.json` holds no dark palette, often because the site toggles a class instead of a media query | Leave the section out. Never derive a dark palette from the light tokens |
| `validate.ts` reports a hex mismatch | A value in a pre-rendered table was edited after the prompt was built | Re-run `build-write-prompt.ts` and paste the fresh table |
| `ts-node: command not found` | The backend dev dependencies are absent | Run `npm install` from `backend/` |

---

## 6. FAQ

### Why capture a site instead of using a template library?

A template library ships a palette someone else chose. This packet reads the palette the page renders, at five widths, and keeps a `tokens.json` that every later value can be checked against.

### Can I extract from a site behind a login?

No. The crawler needs a public URL that renders JavaScript. An authenticated page stays out of scope.

### Do I write `DESIGN.md` by hand?

You write the prose. The value sections arrive pre-rendered from `tokens.json`, and the FACTS block holds the type scale and the component numbers. The writer adds the intro, the typography roles, the component prose and the remaining sections without typing a value.

### Why does the output have to live in a spec folder?

`backend/scripts/output-policy.ts` is the one place that decides where artifacts may land. It refuses the skills tree so a run cannot pollute the packet, and it refuses a path outside the spec roots so a stray `--output` cannot write into an unrelated directory.

### What if I only want to validate an existing `DESIGN.md`?

Run `validate.ts` with the pair and skip the crawl. It reads the two files and checks hex accuracy, section presence, Quick Start values and prose provenance. No extraction is needed.

---

## 7. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Tool boots | `npx ts-node .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts --help` | The usage block prints and the command exits 0 |
| Backend typecheck | `cd .skilled/skills/sk-design/sk-design-md-generator/backend && npm run typecheck` | No diagnostics and exit code 0 |
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-design/sk-design-md-generator/README.md --type readme` | `VALID` and `Total issues: 0` |
| Operator read | [The manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) | Each scenario records its outcome and a reason |

The backend manifest also defines `npm run build` beside these checks, and its test suite runs under `npm test`. A green structural run is not proof of a faithful reference. Open the `DESIGN.md` and read the section a downstream implementer will copy.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The runtime contract: when to use the packet, the pipeline, the rules and the reference index |
| [`ROUTER.md`](./ROUTER.md) | The machine router: intent model, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Node and Playwright setup plus a first extraction |
| [`references/design-md-format.md`](./references/design-md-format.md) | The v3 Style Reference section specification, in section order |
| [`references/writing-style-guide.md`](./references/writing-style-guide.md) | The rules for voice and section composition in the prose |
| [`references/authoring-boundary.md`](./references/authoring-boundary.md) | The line between measured, brief-provided, inferred and absent values |
| [`references/quality-checklist.md`](./references/quality-checklist.md) | The pre-validate self-check for format, sections and stability classes |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | The longer symptom-and-fix guide behind the table above |
| [`backend/README.md`](./backend/README.md) | The backend modules and the full flag reference |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The operator scenarios that a green validator cannot replace |
| [`../SKILL.md`](../SKILL.md) | The `sk-design` hub that routes here |
| [Skills Library](../../README.txt) | The skill catalog and routing front door |
