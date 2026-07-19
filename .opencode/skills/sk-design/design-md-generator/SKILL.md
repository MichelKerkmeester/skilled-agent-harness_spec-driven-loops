---
name: design-md-generator
description: "Extracts a live website's real CSS into a v3 Style Reference DESIGN.md via an embedded extract-write-validate pipeline."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.2.0
---

<!-- Keywords: design system, design tokens, css extraction, design.md, website design extraction, design reference, tokens.json, playwright, design-to-markdown, design-system generator, css tokens, color extraction, typography extraction, hex extraction, shadow extraction, spacing extraction, design fidelity, anti-hallucination -->

# Design System Extractor (md-generator)

Captures a live website's **real, measured CSS** into a publication-quality `DESIGN.md` — a v3 **Style Reference**: a named, role-driven, ship-ready design-system handoff (named colour tokens, semantic type scale, named components, Surfaces, Elevation, Agent Prompt Guide, Similar Brands, and copy-paste Quick Start CSS + Tailwind) that AI agents build against without hallucinating colors, fonts, spacing, or shadows. Runs a three-phase pipeline (extract, write, validate) through an embedded Playwright crawler that samples five viewports and emits verbatim `tokens.json`. Deep operational detail lives in [`references/`](references/).

> **Family boundary.** This skill is the **extraction and format-fidelity engine** of the `sk-design-*` family. It captures what already exists. Sibling `interface` invents **new** distinctive direction (palette, type, anti-default critique). The transports — `design-mcp-open-design` (nested inside `sk-design`) and `mcp-figma` — move design data; this skill produces the authoritative reference those transports and `interface` consume.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Extract a live website's real CSS into a machine-readable `DESIGN.md` v3 Style Reference, with every hex, pixel, font-weight, radius, and shadow copied verbatim from the running page.
- Produce a hallucination-proof design document for an AI agent to code against — `DESIGN.md` replaces guesses with measured ground truth.
- Capture colors (including dark-mode palette if detected), typography stacks, shadows, border-radii, spacing scales, CSS custom properties, framework markers, icon-system hints, motion tokens, and a11y data across five responsive viewports.
- Validate a generated `DESIGN.md` against its source `tokens.json` to confirm hex accuracy and section completeness.
- Generate visual validation reports (HTML preview, diff report) from a `DESIGN.md` + `tokens.json` pair.
- Re-extract a site after a redesign to update the design-system reference.

**Keyword Triggers**: "extract design system", "generate DESIGN.md", "capture website css", "design tokens from url", "create design reference", "style reference", "tokens.json", "validate DESIGN.md", "anti-hallucination design doc", "design-to-markdown", "extract design tokens".

### Use Cases

**Full extraction — URL to DESIGN.md.** The canonical workflow: crawl a live URL, produce `tokens.json`, write `DESIGN.md` output conforming to the v3 Style Reference format, then validate hex accuracy, section completeness, and Quick-Start fidelity. This is the primary path.

**Validation-only.** The user already has a `DESIGN.md` + `tokens.json` pair (from a prior extraction or hand-edited) and wants to confirm fidelity. Run the validator without re-extracting.

**Visual report generation.** Given a `DESIGN.md` + `tokens.json` pair, render an HTML preview and a visual-diff report to confirm the written doc matches the extracted tokens.

**Example study.** The user wants to understand how a gold-standard site (stripe, vercel, linear, supabase — included in `references/examples/`) structures its DESIGN.md output, to inform a new extraction or to learn the format conventions.

### When NOT to Use

**Skip this skill when:**
- The task is **inventing a new design direction** (palette, type scale, the anti-default critique). That is `interface`. This skill captures; that skill creates.
- The task is **authoring a Style Reference from a brief alone** with no live site to measure. That is forward-authoring, and it is OUT OF SCOPE for this mode. This mode reports what is measurably there. A brief-only request is a different contract routed to a separate design-spec decision, never satisfied by loosening fidelity here. The line between measured values and a brief's stated intent is drawn in `references/authoring-boundary.md`.
- The target is a **Figma file**, not a live website. Use `mcp-figma` to extract from Figma Desktop.
- The target is an **Open Design project**. Use `design-mcp-open-design` (nested inside `sk-design`).
- The user only wants a **screenshot or visual preview** of a page. Use `mcp-chrome-devtools`.
- The website cannot be reached (requires a live, renderable URL with JavaScript execution).

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect the **pipeline phase** first. The three phases are sequential and each has a distinct surface: EXTRACT hits the live URL, WRITE produces the markdown, VALIDATE checks fidelity. A fourth path — REPORT — renders visual artifacts from an existing pair.

Route here when `DESIGN.md`, `tokens.json`, style reference, CSS capture, validation, report generation, or source-of-truth provenance are measured artifacts from a live site or an existing extraction pair. **Route here too, even with no live URL present, whenever the request explicitly names the `DESIGN.md`/"style reference" artifact this mode owns** (e.g. "generate a DESIGN.md style reference for X from this brief") — resolving elsewhere on a brief-only technicality would skip this mode's own authoring-boundary refusal (`references/authoring-boundary.md`), the exact check that request needs. Only route brief-only requests to `foundations` when the ask is generic token-system authoring that never names `DESIGN.md`/style-reference/`tokens.json` as the target artifact (e.g. "design a color and type token system for X"). Do not route new visual direction from an extracted reference here; the extraction can ground `interface`, but this mode only captures and validates measured values.

```bash
# Phase detection (pseudo)
echo "$REQUEST" | grep -qiE 'validate|check.*accuracy|verify.*design|hex.*check|section.*completeness' && PHASE="VALIDATE"
echo "$REQUEST" | grep -qiE 'report|preview|visual.*report|html.*report|diff.*report' && PHASE="REPORT"
echo "$REQUEST" | grep -qiE 'example|gold.*standard|stripe|vercel|linear|supabase|reference.*format' && PHASE="STUDY"
# default for extract/write/url/crawl:
: "${PHASE:=EXTRACT_WRITE}"

# Tool readiness check
[ -d "backend/node_modules" ] && TOOL_READY=true || TOOL_READY=false
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect pipeline phase -> EXTRACT_WRITE | VALIDATE | REPORT | STUDY
    +- STEP 1: Verify tool readiness (backend/node_modules + playwright chromium installed)
    +- Phase 1: EXTRACT — crawl URL across 5 viewports, emit tokens.json
    +- Phase 2: WRITE — run build-write-prompt.ts (pre-renders Tokens—Colors/Spacing&Shapes/Surfaces/Quick Start + a facts block), paste those tables unchanged, then write prose only for the v3 Style Reference
    +- Phase 3: VALIDATE — check hex accuracy + v3 section completeness + Quick-Start fidelity via validate.ts
    +- Phase 4 (optional): REPORT — render visual HTML preview + diff report
```

### Resource Domains

The router discovers knowledge from this skill's `references/` and `assets/` directories: ten reference docs covering the v3 format spec and writing-style guide, the colour and component taxonomies, anti-patterns, the authoring boundary, the quality checklist, the operational extraction-workflow and troubleshooting guides, and the guided-run wrapper contract, plus three assets (the WRITE-phase prompt template, the cardinal-rules card, and the source-of-truth router card). The gold-standard pairs under `references/examples/` are reachable only under STUDY intent — study artifacts the writer reads to learn format conventions, never copied into an extraction.

```text
references/design-md-format.md       # v3 Style Reference section specification (DEFAULT_RESOURCE)
references/writing-style-guide.md    # voice, tone, section composition rules
references/color-role-taxonomy.md    # color role naming + classification
references/component-taxonomy.md     # component naming + hierarchy patterns
references/anti-patterns.md          # common DESIGN.md mistakes to avoid
references/authoring-boundary.md     # measured / brief-provided / inferred / absent line
references/quality-checklist.md      # pre-validate self-check
references/extraction-workflow.md    # three-phase workflow, invocations, handoff
references/troubleshooting.md        # failure modes and fixes
references/examples/{stripe,vercel,linear,supabase}/  # gold-standard DESIGN.md + writing-notes pairs (STUDY intent)
references/examples/editorial-exemplar.md  # non-SaaS study guide for editorial, culture, hospitality or ecommerce extraction
references/guided-run.md          # wrapper contract for preflight, extract, write prompt, validate, report
assets/design-md-prompt-template.md  # copy-paste WRITE-phase prompt
assets/cardinal-rules-card.md        # one-page pre-write / pre-validate fidelity gate
assets/source-of-truth-router-card.md  # fill-in provenance card
```

### Resource Loading Levels

| Level       | When to Load                         | Resources                                                                 |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------- |
| ALWAYS      | Every invocation                     | `references/design-md-format.md`, `references/writing-style-guide.md`, `assets/cardinal-rules-card.md` (pre-write fabrication gate) |
| CONDITIONAL | EXTRACT_WRITE intent                 | `references/color-role-taxonomy.md`, `references/component-taxonomy.md`, `references/anti-patterns.md` |
| CONDITIONAL | Guided run or smoke extraction wrapper | `references/guided-run.md`, `references/extraction-workflow.md`, `references/troubleshooting.md` |
| CONDITIONAL | A value's origin is unclear (brief vs measured), or a brief-only request with no live site | `references/authoring-boundary.md` (the measured / brief-provided / inferred / absent line, where forward-authoring is out of scope) and `assets/source-of-truth-router-card.md` (the fill-in provenance card) |
| CONDITIONAL | VALIDATE / completion claim          | `references/quality-checklist.md`, `references/anti-patterns.md`  |
| CONDITIONAL | STUDY intent                         | `references/examples/` (one site at a time, loaded as reference pairs)           |
| CONDITIONAL | Internal procedure support           | `procedures/design-system-extraction.md` when the request involves extraction, token capture, `DESIGN.md`, source design systems, screenshots, or measured brand references |
| ON_DEMAND   | Deep format edge-cases or component patterns | `references/anti-patterns.md`, `references/component-taxonomy.md` |

The private procedure-card selection table in Section 3 is part of this routing contract: after the public `md-generator` mode is selected, choose `procedures/design-system-extraction.md` when its trigger matches and cite its relative path in the plan or proof line.

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../sk-doc/create-skill/assets/skill/skill-smart-router.md). Guard paths, discover at runtime, score intents, fall back to the full extract-write-validate pipeline when unsure.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/design-md-format.md"

INTENT_SIGNALS = {
    "EXTRACT_WRITE": {"weight": 4, "keywords": ["extract", "crawl", "url", "design.md", "generate",
                                                 "capture", "tokens.json", "design system", "live"]},
    "VALIDATE":      {"weight": 4, "keywords": ["validate", "check", "verify", "accuracy", "hex",
                                                 "section completeness", "fidelity"]},
    "REPORT":        {"weight": 4, "keywords": ["report", "preview", "visual", "html", "diff", "render"]},
    "RUN_WRAPPER":   {"weight": 4, "keywords": ["guided run", "wrapper", "smoke", "preflight", "readiness", "run wrapper"]},
    "STUDY":         {"weight": 4, "keywords": ["example", "stripe", "vercel", "linear", "supabase",
                                                 "gold standard", "reference", "editorial", "ecommerce", "non-saas", "non saas"]},
}

# Every reference and asset on disk is reachable from a RESOURCE_MAP entry (or the
# always-loaded DEFAULT_RESOURCE); no orphans. The examples/ pairs are reachable
# only under STUDY intent — they are study artifacts the writer reads, never copied.
RESOURCE_MAP = {
    "EXTRACT_WRITE": ["references/design-md-format.md", "references/writing-style-guide.md",
                       "references/color-role-taxonomy.md", "references/component-taxonomy.md",
                       "references/anti-patterns.md", "references/authoring-boundary.md",
                       "references/extraction-workflow.md", "references/troubleshooting.md",
                       "assets/design-md-prompt-template.md", "assets/cardinal-rules-card.md",
                       "assets/source-of-truth-router-card.md"],
    "VALIDATE":      ["references/quality-checklist.md", "references/anti-patterns.md",
                       "references/design-md-format.md", "assets/cardinal-rules-card.md"],
    "REPORT":        ["references/design-md-format.md"],
    "RUN_WRAPPER":   ["references/extraction-workflow.md", "references/troubleshooting.md", "references/guided-run.md", "assets/cardinal-rules-card.md"],
    "STUDY":         ["references/design-md-format.md", "references/writing-style-guide.md",
                        "references/examples/stripe/DESIGN.md", "references/examples/stripe/writing-notes.md",
                        "references/examples/vercel/DESIGN.md", "references/examples/vercel/writing-notes.md",
                        "references/examples/linear/DESIGN.md", "references/examples/linear/writing-notes.md",
                        "references/examples/supabase/DESIGN.md", "references/examples/supabase/writing-notes.md",
                        "references/examples/editorial-exemplar.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the pipeline phase: full extraction (URL → DESIGN.md), validation-only, report generation, or example study",
    "For any extraction, confirm the target URL is live and renders JavaScript",
    "Confirm the output paths for tokens.json and DESIGN.md before writing",
    "Verify tool readiness: cd backend && npm install && npx playwright install chromium",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def classify_intents(request: str):
    text = (request or "").lower()
    scores = {i: 0 for i in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    primary, top = ranked[0]
    if top == 0:
        return ("EXTRACT_WRITE", None, scores)
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_design_md_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [primary] + ([secondary] if secondary else [])
    loaded, seen = [], set()

    def load_if_available(rel: str):
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 1:
        return {"intents": intents, "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## 3. HOW IT WORKS

### The Three-Phase Pipeline

Every extraction runs as a sequential pipeline. No phase can be skipped in a full run, though VALIDATE and REPORT can be invoked standalone on an existing `DESIGN.md` + `tokens.json` pair.

### Procedure Card Selection

After the hub selects the public `md-generator` mode, select the private `procedures/design-system-extraction.md` card when the request involves measured extraction, token capture, CSS capture, `DESIGN.md` generation, source design systems, screenshots, brand references, gaps, inconsistencies, or grounding future work in an existing surface. Cite that card by relative path in the plan or proof line. The card supports this mode; it is not a public route.

If the card does not match, state `Procedure applied: none - baseline md-generator pipeline` and continue with phase detection (`EXTRACT_WRITE`, `VALIDATE`, `REPORT`, `STUDY`) plus the existing resource router.

### Backend Boundary Preservation

Procedure support does not replace or generalize the extraction backend. `design-md-generator` remains the only mutating `sk-design` mode, with `backendKind: playwright-extract`, Write/Edit/Bash permission, and the embedded TypeScript pipeline under `backend/scripts/`. The protected entrypoints are `extract.ts`, `build-write-prompt.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`, and `proof.ts`; package-level verification remains `npm run typecheck`, `npm run build`, and `npm test` from `backend/` when operator policy allows those commands.

The procedure card can shape planning and proof, but it must not flatten this mode into read-only guidance or grant Write, Edit, or Bash to `interface`, `foundations`, `motion`, or `audit`.

### Context, Proof, And Direct Fallback

Record the context basis before extraction or validation: public mode `md-generator`, selected procedure card or no-procedure fallback, pipeline phase, source type, target URL or artifact, output paths, tool-readiness state, loaded references, and value-origin risks. Before any completion claim, include proof naming the selected procedure card, backend entrypoint used, `tokens.json`/`DESIGN.md` provenance, validation result, and unresolved gaps.

If subagents are unavailable or disallowed, execute directly in the current session using this mode's normal backend boundary. Direct fallback does not weaken the pipeline: full extraction still requires extract, write, and validate; validation-only and report-only paths still use their dedicated backend entrypoints.

**Process Flow:** `EXTRACT (Phase 1)` → `WRITE (Phase 2)` → `VALIDATE (Phase 3)` → `REPORT (Phase 4, optional)`

- **EXTRACT** — Playwright crawls 5 viewports, collecting computed CSS (colors, typography, shadows, radii, spacing, CSS variables), measured image-edge outlines, nested/concentric radii, root font smoothing, and hit-target affordances when present, plus dark-mode/framework/icon/motion/a11y signals. Every token is tagged with a stability class (L1–L4, see below). Output: `tokens.json`.
- **WRITE** — `build-write-prompt.ts` runs first: it pre-renders the value tables (Tokens — Colors, Spacing & Shapes, Surfaces, Quick Start) plus a FACTS block deterministically from tokens via `formatters-v3.ts` (doc-as-view, no AI on the value tables). Paste those sections unchanged; write prose only (intro, Typography role prose, Components, Do's/Don'ts, Elevation, Imagery, Layout, Agent Prompt Guide, Similar Brands) — voice per `references/writing-style-guide.md`. Elevation renders FLAT when there are 0 shadow tokens. Output: `DESIGN.md`.
- **VALIDATE** — `validate.ts` checks hex accuracy, v3 section completeness, Quick-Start fidelity, and prose provenance (see "What `validate.ts` traces" below). Output: pass/fail with a dual score and per-finding messages.
- **REPORT** (optional) — `report-gen.ts` and `preview-gen.ts` render visual artifacts (HTML report, preview) for human review.

Full phase-by-phase actions and handoff: `references/extraction-workflow.md`.

### Cardinal Fidelity Rule

**Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in `DESIGN.md` MUST be copied verbatim from `tokens.json`.** No estimation, no rounding, no invention, no "close enough" substitution. This is the single non-negotiable contract of the skill — it is what makes `DESIGN.md` a hallucination-proof reference.

- **Hex codes** must use **6-digit lowercase** format (e.g., `#1a1a2e`, never `#1A1A2E` or `#1a1a2`).
- **Stability gates**: only L1 (permanent/brand-level) and L2 (system/component-level) tokens belong in the main DESIGN.md sections. L3 (campaign-level, e.g., a seasonal accent color) may appear with an explicit "Subject to change" annotation. L4 (content-level, e.g., a hero image's dominant color) is excluded.
- **Dark mode**: include a dark-mode section ONLY when the extractor detected a dark-mode palette. Do not fabricate a dark palette from the light one.
- **What `validate.ts` traces**: validation hard-checks hex codes (against `tokens.colorTokens`) and the Quick Start values (every Quick Start hex traces to a token; `--page-max-width` matches `tokens.spacingSystem.maxContentWidth`). Non-hex values (pixel sizes, font weights, shadows, radii) are NOT re-traced by the validator — their fidelity is guaranteed upstream because the WRITE phase pre-renders the value tables from `formatters-v3.ts` and supplies the typography/component numbers verbatim in the FACTS block, so the AI never types them. Treat the cardinal rule as the binding contract for those values even though validation does not re-check each one.

### Authoring Boundary

The cardinal rule stays enforceable by inspection because every value has a legible origin. A value is **measured** (read off the page and present in `tokens.json`), **brief-provided** (supplied by the user, not the page), **inferred** (a grounded characterization of a measured value) or **absent** (never captured). Only measured values enter the token tables, and they enter unlabeled, so an unlabeled value is a promise it was measured. Brief-provided values stay in prose as a stated intent and never sit in a value table. Inferred claims carry `[INFERRED]` and cite the measured token they rest on. Absent values are stamped or omitted rather than backfilled. This boundary adds no capability and relaxes the fidelity contract by not one digit. When a value's origin is unclear, or a request asks to author from a brief with no live site, load `references/authoring-boundary.md` for the full line and `assets/source-of-truth-router-card.md` to sort each value before writing. Authoring from a brief alone is forward-authoring and stays out of scope (Section 1, When NOT to Use).

### Invocation

> **Working directory.** One-time setup runs from `backend/`. Every pipeline script runs from the **repo root** with the full script path — `extract.ts` refuses any `--output` that resolves inside the skill, so a relative `.opencode/specs/...` path only resolves correctly from there. Full phase-by-phase actions: `references/extraction-workflow.md`. Complete flag reference: `backend/README.md`.

```bash
# One-time setup
cd .opencode/skills/sk-design/design-md-generator/backend && npm install && npx playwright install chromium

# Phase 1 — extract (writes tokens.json to --output)
npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts <url> --fast --output .opencode/specs/<track>/<packet>/output

# Phase 2 — pre-render value tables + FACTS block, then write DESIGN.md prose
npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts .opencode/specs/<track>/<packet>/output/tokens.json

# Phase 3 — validate (DESIGN.md first, tokens.json second)
npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts <DESIGN.md> .opencode/specs/<track>/<packet>/output/tokens.json
```

Optional Phase 4 (from the repo root, tokens.json first): `proof.ts <url> <tokens.json>`, `report-gen.ts <tokens.json> <dir> <DESIGN.md>`, `preview-gen.ts <tokens.json> <dir>`. Interaction capture is **default-on**; opt out with `--no-interaction` or `--fast-no-interaction`.

### Token Stability Classes (L1–L4)

Each token is classified L1 (Permanent/`infrastructure`) through L4 (Content/`content`) by the deterministic classifier in `backend/scripts/cluster.ts`. L1+L2 populate the main `DESIGN.md` sections, L3 gets a "Subject to change" annotation, L4 is excluded entirely. Boundary tokens take the higher (more restrictive) class. Full class table, the emitted `stability.layer` string mapping, and the coverage-election pre-gate: `references/extraction-workflow.md` (Section 3).

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS read `references/design-md-format.md` and `references/writing-style-guide.md` before writing DESIGN.md.** These define the v3 Style Reference section specification and the voice/tone rules. No DESIGN.md is conformant without them.
2. **ALWAYS copy every numeric CSS value verbatim from `tokens.json`.** Hex colors, pixel sizes, font weights, box shadows, border radii, spacing values — every number must match `tokens.json` exactly. This is the cardinal fidelity rule.
3. **ALWAYS use 6-digit lowercase hex** for every color in DESIGN.md (e.g., `#1a1a2e`, never `#1A1A2E`, `#333`, `rgb()`, or `hsl()`).
4. **ALWAYS apply stability gates:** L1 and L2 colours in the main token table; L3 colours in the "Current Campaign Colors (Subject to change)" sub-table; L4 tokens excluded entirely.
5. **ALWAYS run `validate.ts` before claiming completion** of any extraction or DESIGN.md edit. Validation checks hex accuracy against `tokens.json`, v3 Style Reference section completeness, Quick-Start fidelity (every Quick Start hex traces to a token, `--page-max-width` matches `tokens.json`), and prose provenance — `isPass()` requires `claimsScore >= 80`.
6. **ALWAYS include a dark-mode section ONLY when `tokens.json` contains a detected dark-mode palette.** Never infer, derive, or fabricate a dark palette from the light tokens.
7. **ALWAYS include an accessibility section** drawn from the `tokens.json` a11y data (contrast ratios, focus ring styles, minimum touch-target sizes). If the extractor captured no a11y data, note the absence rather than inventing values.
8. **ALWAYS confirm tool readiness** before any extract/validate/report invocation: `cd backend && npm install && npx playwright install chromium`. The embedded tool requires Node.js and a Playwright Chromium binary.
9. **ALWAYS cite `procedures/design-system-extraction.md` or the no-procedure fallback** before substantial extraction planning, generation, validation, or report output.
10. **ALWAYS, on a brief-only request with no live URL, STOP before producing any Style Reference content.** The entire response is text only: either (a) a request for the live URL to crawl, or (b) an explicit statement, citing `references/authoring-boundary.md` by path, that brief-only authoring is out of scope for this mode and naming where it routes instead (a separate design-spec decision, or `foundations`). Cite both `references/authoring-boundary.md` and `assets/source-of-truth-router-card.md` by their file paths in the response text — reading them via a tool call is not a substitute for naming them in what the user sees. **NEVER produce a partial or full DESIGN.md artifact as a byproduct of this decision** — no Tokens table, no Surfaces, no Quick Start — even with a disclaimer sentence attached or brief values Origin-labeled. A labeled or disclaimed artifact is still forward-authoring; the boundary forbids the artifact itself, not just unlabeled values inside it. There is no third option and no "boundary exception" framing that produces output anyway.

### ⛔ NEVER

1. **NEVER estimate, round, or invent a hex, pixel, font-weight, shadow, or radius value in DESIGN.md.** Every value must trace back to a token in `tokens.json`. Even trivial-looking values like `1px` borders or `0.25rem` spacing must be confirmed.
2. **NEVER include L4 (content) tokens in DESIGN.md.** These are image-derived or one-off values that do not represent the design system.
3. **NEVER replace the v3 Style Reference format with a freeform structure.** The named sections (Tokens — Colors/Typography/Spacing & Shapes, Components, Do's and Don'ts, Surfaces, Elevation, Layout, Agent Prompt Guide, Similar Brands, Quick Start) are part of the contract that downstream consumers — `interface`, `sk-code`, and AI coding agents — depend on. Never assert a false system (gradient-as-depth, focus-consistent) the tokens contradict.
4. **NEVER skip validation before claiming a DESIGN.md is complete.** An unvalidated DESIGN.md is a draft. Validation errors must be resolved before completion.
5. **NEVER write DESIGN.md without reading `tokens.json` first.** The markdown exists only as a faithful rendering of the token data; writing without the source data guarantees hallucination.
6. **NEVER produce any Tokens table (Colors, Typography, Spacing & Shapes, Border Radius, or any other) when the request is brief-only with no live URL to crawl** — not even with an Origin/brief-provided label or a disclaimer sentence attached. The correct response for that condition contains zero token tables: either a URL request or an explicit out-of-scope statement per ALWAYS rule #10. Outside that specific no-live-URL condition, a brief-provided value must never appear inside an actual Tokens table row, even when a separate Provenance/source-of-truth table also exists elsewhere in the response. A separate labeling table does not cure an unlabeled value sitting in the real Tokens table — brief-provided values stay in prose only, per `references/authoring-boundary.md`'s measured/brief-provided/inferred/absent line (Section 3, "Only measured values enter the token tables, and they enter unlabeled").

### ⚠️ ESCALATE IF

1. **ESCALATE IF the extract fails** (Playwright cannot reach the URL, JavaScript rendering times out, or the page emits no measurable CSS). Report the specific error, the URL, and whether the site requires authentication or blocks automated crawlers. Do not retry in a loop.
2. **ESCALATE IF dark-mode detection is ambiguous** — the extractor found a `prefers-color-scheme` media query but could not capture the dark palette values. Ask whether to proceed with light-only output or to investigate a manual dark-mode toggle on the site.
3. **ESCALATE IF a token straddles the L2/L3 boundary** and the classifier cannot disambiguate. Surface the token and its context and ask which class to assign.
4. **ESCALATE IF validation reports hex mismatches** that appear to be extractor bugs rather than write-phase errors (e.g., `tokens.json` itself contains `#1A1A2E` — invalid case — where the live CSS was `#1a1a2e`). Ask whether to correct `tokens.json` before re-validating.
5. **ESCALATE IF the user wants to edit DESIGN.md by hand after extraction** and remove or alter token-derived values. The DESIGN.md is a fidelity artifact; manual edits that deviate from `tokens.json` break validation. Offer to re-run extraction with different parameters instead.

---

## 5. REFERENCES

### Core References (Format & Style)

- [design-md-format.md](references/design-md-format.md) — The authoritative v3 Style Reference section specification: named colour tokens, semantic type scale, named components, Surfaces/Elevation, Agent Prompt Guide, Similar Brands, and copy-paste Quick Start, with heading conventions and token-to-section mapping.
- [writing-style-guide.md](references/writing-style-guide.md) — Voice, tone, tense, and section-composition rules for DESIGN.md prose.
- [color-role-taxonomy.md](references/color-role-taxonomy.md) — Color role naming conventions and the classification hierarchy (brand, semantic, surface, border, text, interactive).
- [component-taxonomy.md](references/component-taxonomy.md) — Component naming, hierarchy patterns, and the component-to-section mapping rules.
- [anti-patterns.md](references/anti-patterns.md) — Common DESIGN.md authoring mistakes: invented values, missing sections, wrong hex case, L4 leaks, and dark-mode fabrication.
- [quality-checklist.md](references/quality-checklist.md) — Pre-validate self-check list: hex format, section presence, stability-class compliance, dark-mode gate, a11y section presence.
- [guided-run.md](references/guided-run.md) - Guided wrapper contract for readiness checks and phase orchestration without auto-authoring DESIGN.md.

### Gold-Standard Examples

- [references/examples/stripe/](references/examples/stripe/) — DESIGN.md + tokens.json + writing-notes.md for Stripe.
- [references/examples/vercel/](references/examples/vercel/) — DESIGN.md + tokens.json + writing-notes.md for Vercel.
- [references/examples/linear/](references/examples/linear/) — DESIGN.md + tokens.json + writing-notes.md for Linear.
- [references/examples/supabase/](references/examples/supabase/) — DESIGN.md + tokens.json + writing-notes.md for Supabase.
- [references/examples/editorial-exemplar.md](references/examples/editorial-exemplar.md) - Non-SaaS study guide for editorial, culture, hospitality or ecommerce extraction shape. Illustrative only, never a preset.

### Skill-Owned References

- [references/extraction-workflow.md](references/extraction-workflow.md) — The three-phase workflow as it runs in this framework: invocations, output paths, stability classes, and handoff.
- [references/troubleshooting.md](references/troubleshooting.md) — Failure modes and fixes (Chromium, crawl blocks, dark-mode gaps, validation mismatches).
- [references/authoring-boundary.md](references/authoring-boundary.md) — The line between measured, brief-provided, inferred and absent values, plus the source-of-truth labels that protect the cardinal fidelity rule. States that forward-authoring from a brief with no live site is out of scope and routes to a separate design-spec decision.
- [references/guided-run.md](references/guided-run.md) - Guided wrapper behavior and stop conditions for smoke runs and operator handoff.
- [procedures/design-system-extraction.md](procedures/design-system-extraction.md) - Private measured-extraction procedure support for source evidence, gaps, inconsistencies, and next steps inside this existing mode.

### Shared

- [../shared/register.md](../shared/register.md) — The Brand-vs-Product operating register. This mode records the extracted surface's register so a captured Style Reference carries the posture forward. It does not author a register from a brief.

### Assets

- [assets/design-md-prompt-template.md](assets/design-md-prompt-template.md) — Copy-paste WRITE-phase prompt that encodes the cardinal rules and the v3 Style Reference contract.
- [assets/cardinal-rules-card.md](assets/cardinal-rules-card.md) — One-page fidelity checklist for a pre-validate self-check.
- [assets/source-of-truth-router-card.md](assets/source-of-truth-router-card.md) — Fill-in card that sorts each value into measured, brief-provided, inferred or absent before writing, so no value is fabricated or backfilled.

### Reference Loading Notes

- `references/design-md-format.md` is the baseline (always loaded). Load `writing-style-guide.md` alongside it for any write-phase work.
- Load the taxonomy docs (`color-role-taxonomy.md`, `component-taxonomy.md`) and `anti-patterns.md` only when the intent is EXTRACT_WRITE.
- Load `quality-checklist.md` before any validation or completion claim.
- Load `references/authoring-boundary.md` and `assets/source-of-truth-router-card.md` when a value's origin is unclear (brief versus measured) or when a request asks to author from a brief with no live site. The boundary doc keeps the cardinal rule enforceable and routes forward-authoring out of scope.
- Load one example site at a time from `references/examples/` when in STUDY intent; compare the DESIGN.md against the tokens.json to understand format conventions.
- Load `references/guided-run.md` for wrapper, smoke lane, preflight, readiness, or guided run requests.
- Keep Section 2 (SMART ROUTING) as the single routing authority for all resource loads.

---

## 6. SUCCESS CRITERIA

**Extraction complete when:**
- [x] `tokens.json` was written by `extract.ts` with no fatal errors, and the file is valid JSON with non-empty token arrays.
- [x] `DESIGN.md` was written conforming to the v3 Style Reference format in `references/design-md-format.md`.
- [x] Every hex, pixel, font-weight, shadow, and radius in DESIGN.md matches `tokens.json` verbatim.
- [x] All hex codes use 6-digit lowercase format.
- [x] L1 + L2 colours populate the main token table; L3 colours appear in the "Current Campaign Colors (Subject to change)" sub-table; L4 tokens are absent.
- [x] Elevation renders FLAT when there are 0 shadow tokens (states how depth is achieved instead); no false systems asserted.
- [x] The Quick Start CSS + Tailwind blocks are present and every value traces to a token.
- [x] `validate.ts` passes with zero hex mismatches, zero missing required sections, Quick-Start fidelity intact, and `claimsScore >= 80`.
- [x] The selected private procedure card is cited by relative path, or the no-procedure fallback is explicitly stated.
- [x] The mutating backend entrypoint and validation evidence are named; procedure support does not replace the extract-write-validate boundary.

**Validation-only complete when:**
- [x] `validate.ts` was run against the DESIGN.md + tokens.json pair.
- [x] All reported errors are resolved or escalated per Section 4 (ESCALATE IF).

**Report complete when:**
- [x] `report-gen.ts` and `preview-gen.ts` produced artifacts at the specified output paths with no errors.

---

## 7. INTEGRATION POINTS

- `interface` owns new direction (palette, type, anti-default critique); this skill supplies the measured ground truth it builds on.
- `sk-code` implements against `DESIGN.md` as the hallucination-proof source of truth for colors, fonts, spacing, shadows, and radii.
- `mcp-figma` and `design-mcp-open-design` (nested inside `sk-design`) are the Figma-file and Open Design alternatives to a live-URL extraction.
- `system-spec-kit` applies when the extraction is part of a larger spec-tracked feature and packet documentation is required.
- Requires Playwright (Apache 2.0, via `npx playwright install chromium`) and Node.js 20+ (`backend/package.json` does not pin an `engines` range — treat 20+ as the supported floor); `ts-node` executes the embedded TypeScript modules directly.

---

## 8. REFERENCES AND RELATED RESOURCES

Manual validation scenarios live in `manual-testing-playbook/manual-testing-playbook.md`. Release notes live in `changelog/`; the latest is `changelog/v1.0.0.0.md`. Tool setup: `INSTALL-GUIDE.md`. The embedded `backend/scripts/` pipeline (20 TypeScript modules) is documented operationally in `references/extraction-workflow.md`.
