---
name: sk-design-md-generator
description: "Extracts a live website's real CSS into a 17-section DESIGN.md via a vendored extract-write-validate pipeline."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.0.0
---

<!-- Keywords: design system, design tokens, css extraction, design.md, website design extraction, design reference, tokens.json, playwright, design-to-markdown, design-system generator, css tokens, color extraction, typography extraction, hex extraction, shadow extraction, spacing extraction, design fidelity, anti-hallucination -->

# Design MD Generator (sk-design-md-generator)

Captures a live website's **real, measured CSS** into a publication-quality `DESIGN.md` — a 17-section design-system reference that AI agents build against without hallucinating colors, fonts, spacing, or shadows. Runs a three-phase pipeline (extract, write, validate) through a vendored Playwright crawler that samples five viewports and emits verbatim `tokens.json`. Deep operational detail lives in [`tool/design-md-workflow.md`](tool/design-md-workflow.md) and [`tool/resources/`](tool/resources/).

> **Family boundary.** This skill is the **extraction and format-fidelity engine** of the `sk-design-*` family. It captures what already exists. Sibling `sk-design-interface` invents **new** distinctive direction (palette, type, anti-default critique). The transports — `mcp-open-design` and `mcp-figma` — move design data; this skill produces the authoritative reference those transports and `sk-design-interface` consume.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Extract a live website's real CSS into a machine-readable `DESIGN.md` design-system reference, with every hex, pixel, font-weight, radius, and shadow copied verbatim from the running page.
- Produce a hallucination-proof design document for an AI agent to code against — `DESIGN.md` replaces guesses with measured ground truth.
- Capture colors (including dark-mode palette if detected), typography stacks, shadows, border-radii, spacing scales, CSS custom properties, framework markers, icon-system hints, motion tokens, and a11y data across five responsive viewports.
- Validate a generated `DESIGN.md` against its source `tokens.json` to confirm hex accuracy and section completeness.
- Generate visual validation reports (HTML preview, diff report) from a `DESIGN.md` + `tokens.json` pair.
- Re-extract a site after a redesign to update the design-system reference.

**Keyword Triggers**: "extract design system", "generate DESIGN.md", "capture website css", "design tokens from url", "create design reference", "anti-hallucination design doc", "design-to-markdown", "extract design tokens".

### Use Cases

**Full extraction — URL to DESIGN.md.** The canonical workflow: crawl a live URL, produce `tokens.json`, write `DESIGN.md` output conforming to the v2 format, then validate hex accuracy and section completeness. This is the primary path.

**Validation-only.** The user already has a `DESIGN.md` + `tokens.json` pair (from a prior extraction or hand-edited) and wants to confirm fidelity. Run the validator without re-extracting.

**Visual report generation.** Given a `DESIGN.md` + `tokens.json` pair, render an HTML preview and a visual-diff report to confirm the written doc matches the extracted tokens.

**Example study.** The user wants to understand how a gold-standard site (stripe, vercel, linear, supabase — included in `tool/examples/`) structures its DESIGN.md output, to inform a new extraction or to learn the format conventions.

### When NOT to Use

**Skip this skill when:**
- The task is **inventing a new design direction** (palette, type scale, the anti-default critique). That is `sk-design-interface`. This skill captures; that skill creates.
- The target is a **Figma file**, not a live website. Use `mcp-figma` to extract from Figma Desktop.
- The target is an **Open Design project**. Use `mcp-open-design`.
- The user only wants a **screenshot or visual preview** of a page. Use `mcp-chrome-devtools`.
- The website cannot be reached (requires a live, renderable URL with JavaScript execution).

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect the **pipeline phase** first. The three phases are sequential and each has a distinct surface: EXTRACT hits the live URL, WRITE produces the markdown, VALIDATE checks fidelity. A fourth path — REPORT — renders visual artifacts from an existing pair.

```bash
# Phase detection (pseudo)
echo "$REQUEST" | grep -qiE 'validate|check.*accuracy|verify.*design|hex.*check|section.*completeness' && PHASE="VALIDATE"
echo "$REQUEST" | grep -qiE 'report|preview|visual.*report|html.*report|diff.*report' && PHASE="REPORT"
echo "$REQUEST" | grep -qiE 'example|gold.*standard|stripe|vercel|linear|supabase|reference.*format' && PHASE="STUDY"
# default for extract/write/url/crawl:
: "${PHASE:=EXTRACT_WRITE}"

# Tool readiness check
[ -d "tool/node_modules" ] && TOOL_READY=true || TOOL_READY=false
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect pipeline phase -> EXTRACT_WRITE | VALIDATE | REPORT | STUDY
    +- STEP 1: Verify tool readiness (tool/node_modules + playwright chromium installed)
    +- Phase 1: EXTRACT — crawl URL across 5 viewports, emit tokens.json
    +- Phase 2: WRITE — produce DESIGN.md conforming to v2 format, every value verbatim
    +- Phase 3: VALIDATE — check hex accuracy + section completeness via validate.ts
    +- Phase 4 (optional): REPORT — render visual HTML preview + diff report
```

### Resource Domains

The router discovers knowledge from two root domains: the vendored `tool/resources/` (six deep-reference docs on format, style, taxonomies, anti-patterns, and quality) and this skill's own `references/` (advisor-routable operational docs authored separately). Examples under `tool/examples/` are study artifacts, not resources.

```text
tool/resources/design-md-format.md       # v2 DESIGN.md section specification
tool/resources/writing-style-guide.md    # voice, tone, section composition rules
tool/resources/color-role-taxonomy.md    # color role naming + classification
tool/resources/component-taxonomy.md     # component naming + hierarchy patterns
tool/resources/anti-patterns.md          # common DESIGN.md mistakes to avoid
tool/resources/quality-checklist.md      # pre-validate self-check
tool/design-md-workflow.md               # full upstream 3-phase workflow spec (canonical)
tool/examples/{stripe,vercel,linear,supabase}/  # gold-standard DESIGN.md + tokens.json pairs
references/                              # skill-owned advisor-routable reference docs
```

### Resource Loading Levels

| Level       | When to Load                         | Resources                                                                 |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------- |
| ALWAYS      | Every invocation                     | `tool/resources/design-md-format.md`, `tool/resources/writing-style-guide.md` |
| CONDITIONAL | EXTRACT_WRITE intent                 | `tool/resources/color-role-taxonomy.md`, `tool/resources/component-taxonomy.md`, `tool/resources/anti-patterns.md` |
| CONDITIONAL | VALIDATE / completion claim          | `tool/resources/quality-checklist.md`, `tool/resources/anti-patterns.md`  |
| CONDITIONAL | STUDY intent                         | `tool/examples/` (one site at a time, loaded as reference pairs)           |
| ON_DEMAND   | Deep format questions or workflow debugging | `tool/design-md-workflow.md` (the full upstream spec)                     |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../sk-doc/assets/skill/skill_smart_router.md). Guard paths, discover at runtime, score intents, fall back to the full extract-write-validate pipeline when unsure.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "tool" / "resources", SKILL_ROOT / "references")
DEFAULT_RESOURCE = "tool/resources/design-md-format.md"

INTENT_MODEL = {
    "EXTRACT_WRITE": {"keywords": [("extract", 4), ("crawl", 4), ("url", 4), ("design.md", 4), ("generate", 3),
                                    ("capture", 4), ("tokens.json", 4), ("design system", 4), ("live", 3)]},
    "VALIDATE":      {"keywords": [("validate", 4), ("check", 3), ("verify", 4), ("accuracy", 3), ("hex", 3),
                                    ("section completeness", 4), ("fidelity", 4)]},
    "REPORT":        {"keywords": [("report", 4), ("preview", 4), ("visual", 3), ("html", 3), ("diff", 4),
                                    ("render", 3)]},
    "STUDY":         {"keywords": [("example", 3), ("stripe", 4), ("vercel", 4), ("linear", 4), ("supabase", 4),
                                    ("gold standard", 4), ("reference", 3)]},
}

RESOURCE_MAP = {
    "EXTRACT_WRITE": ["tool/resources/design-md-format.md", "tool/resources/writing-style-guide.md",
                       "tool/resources/color-role-taxonomy.md", "tool/resources/component-taxonomy.md",
                       "tool/resources/anti-patterns.md"],
    "VALIDATE":      ["tool/resources/quality-checklist.md", "tool/resources/anti-patterns.md",
                       "tool/resources/design-md-format.md"],
    "REPORT":        ["tool/resources/design-md-format.md"],
    "STUDY":         ["tool/resources/design-md-format.md", "tool/resources/writing-style-guide.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the pipeline phase: full extraction (URL → DESIGN.md), validation-only, report generation, or example study",
    "For any extraction, confirm the target URL is live and renders JavaScript",
    "Confirm the output paths for tokens.json and DESIGN.md before writing",
    "Verify tool readiness: cd tool && npm install && npx playwright install chromium",
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
    scores = {i: 0 for i in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw, w in cfg["keywords"]:
            if kw in text:
                scores[intent] += w
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

**Process Flow:**
```
EXTRACT (Phase 1)
    ├─ Playwright crawls the target URL across 5 viewports (mobile through wide desktop)
    ├─ Collects computed CSS: colors, typography, shadows, radii, spacing, CSS variables
    ├─ Detects dark-mode palette, framework markers, icon system, motion tokens, a11y data
    ├─ Each token tagged with a 4-layer stability class (L1 permanent → L4 content)
    └─ Output: tokens.json (verbatim measured values)
         ↓
WRITE (Phase 2)
    ├─ Read tokens.json and tool/resources/design-md-format.md for the v2 section specification
    ├─ Compose 17-section DESIGN.md, copying EVERY numeric value verbatim from tokens.json
    ├─ L1 (permanent) + L2 (system) tokens go in main sections
    ├─ L3 (campaign) tokens marked "subject to change"
    ├─ L4 (content) tokens excluded entirely
    └─ Output: DESIGN.md at the user-specified path
         ↓
VALIDATE (Phase 3)
    ├─ Run validate.ts: check every hex code in DESIGN.md matches tokens.json
    ├─ Check all 17 required sections are present and non-empty
    ├─ Confirm L1/L2/L3/L4 classification rules were followed
    └─ Output: validation pass/fail with per-error line references
         ↓
REPORT (Phase 4, optional)
    ├─ report-gen.ts: render an HTML report of token-to-section mapping
    ├─ preview-gen.ts: render a visual preview of the design system
    └─ Output: visual artifacts for human review
```

### Cardinal Fidelity Rule

**Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in `DESIGN.md` MUST be copied verbatim from `tokens.json`.** No estimation, no rounding, no invention, no "close enough" substitution. This is the single non-negotiable contract of the skill — it is what makes `DESIGN.md` a hallucination-proof reference.

- **Hex codes** must use **6-digit lowercase** format (e.g., `#1a1a2e`, never `#1A1A2E` or `#1a1a2`).
- **Stability gates**: only L1 (permanent/brand-level) and L2 (system/component-level) tokens belong in the main DESIGN.md sections. L3 (campaign-level, e.g., a seasonal accent color) may appear with an explicit "Subject to change" annotation. L4 (content-level, e.g., a hero image's dominant color) is excluded.
- **Dark mode**: include a dark-mode section ONLY when the extractor detected a dark-mode palette. Do not fabricate a dark palette from the light one.

### Invocation

```bash
# One-time setup (from the skill root)
cd tool && npm install && npx playwright install chromium

# Phase 1 — extract. --fast crawls 5 pages at 8 concurrency (default is 8 pages).
# tokens.json is written to output/<domain>/.
npx ts-node scripts/extract.ts <url> --fast

# Phase 2 — write DESIGN.md per tool/resources/design-md-format.md, every value from tokens.json.

# Phase 3 — validate (DESIGN.md first, tokens.json second):
npx ts-node scripts/validate.ts <DESIGN.md> output/<domain>/tokens.json

# Optional — fidelity proof + visual report/preview (these take tokens.json FIRST):
npx ts-node scripts/proof.ts <url> output/<domain>/tokens.json
npx ts-node scripts/report-gen.ts output/<domain>/tokens.json <dir> <DESIGN.md>
npx ts-node scripts/preview-gen.ts output/<domain>/tokens.json <dir>
```

Real extract flags (see `tool/README.md`): `--fast` (5 pages, 8 concurrency), `--max-pages <n>` (default 8), `--concurrency <n>` (default 5), `--with-interaction` / `--no-interaction`, `--no-dark-mode` (skip dark detection), `--wait-for <strategy>`, `--extra-urls`, `--merge-with`, `--output <dir>`, `--verbose`.

### Token Stability Classes (L1–L4)

Each extracted token receives a stability classification that governs whether it appears in `DESIGN.md`:

| Class | Name       | Description                                              | DESIGN.md treatment                      |
| ----- | ---------- | -------------------------------------------------------- | ---------------------------------------- |
| L1    | Permanent  | Brand identity — logo colors, brand typeface, core radii | Included in main sections                |
| L2    | System     | Design-system tokens — semantic colors, spacing scale    | Included in main sections                |
| L3    | Campaign   | Temporary — hero gradients, seasonal accents             | Included with "Subject to change" annotation |
| L4    | Content    | Image-derived, one-off, article-specific                 | Excluded entirely                        |

The classifier lives in `tool/scripts/cluster.ts` and is deterministic. Tokens that sit at a boundary are assigned the higher (more restrictive) class.

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS read `tool/resources/design-md-format.md` and `tool/resources/writing-style-guide.md` before writing DESIGN.md.** These define the v2 section specification and the voice/tone rules. No DESIGN.md is conformant without them.
2. **ALWAYS copy every numeric CSS value verbatim from `tokens.json`.** Hex colors, pixel sizes, font weights, box shadows, border radii, spacing values — every number must match `tokens.json` exactly. This is the cardinal fidelity rule.
3. **ALWAYS use 6-digit lowercase hex** for every color in DESIGN.md (e.g., `#1a1a2e`, never `#1A1A2E`, `#333`, `rgb()`, or `hsl()`).
4. **ALWAYS apply stability gates:** L1 and L2 tokens in main 17 sections; L3 tokens in the L3 subsection with a "Subject to change" annotation; L4 tokens excluded entirely.
5. **ALWAYS run `validate.ts` before claiming completion** of any extraction or DESIGN.md edit. Validation checks hex accuracy against `tokens.json` and section completeness against the v2 format specification.
6. **ALWAYS include a dark-mode section ONLY when `tokens.json` contains a detected dark-mode palette.** Never infer, derive, or fabricate a dark palette from the light tokens.
7. **ALWAYS include an accessibility section** drawn from the `tokens.json` a11y data (contrast ratios, focus ring styles, minimum touch-target sizes). If the extractor captured no a11y data, note the absence rather than inventing values.
8. **ALWAYS confirm tool readiness** before any extract/validate/report invocation: `cd tool && npm install && npx playwright install chromium`. The vendored tool requires Node.js and a Playwright Chromium binary.

### ❌ NEVER

1. **NEVER estimate, round, or invent a hex, pixel, font-weight, shadow, or radius value in DESIGN.md.** Every value must trace back to a token in `tokens.json`. Even trivial-looking values like `1px` borders or `0.25rem` spacing must be confirmed.
2. **NEVER include L4 (content) tokens in DESIGN.md.** These are image-derived or one-off values that do not represent the design system.
3. **NEVER replace the v2 17-section format with a freeform structure.** The section count and naming convention are part of the contract that downstream consumers — `sk-design-interface`, `sk-code`, and AI coding agents — depend on.
4. **NEVER skip validation before claiming a DESIGN.md is complete.** An unvalidated DESIGN.md is a draft. Validation errors must be resolved before completion.
5. **NEVER write DESIGN.md without reading `tokens.json` first.** The markdown exists only as a faithful rendering of the token data; writing without the source data guarantees hallucination.

### ⚠️ ESCALATE IF

1. **ESCALATE IF the extract fails** (Playwright cannot reach the URL, JavaScript rendering times out, or the page emits no measurable CSS). Report the specific error, the URL, and whether the site requires authentication or blocks automated crawlers. Do not retry in a loop.
2. **ESCALATE IF dark-mode detection is ambiguous** — the extractor found a `prefers-color-scheme` media query but could not capture the dark palette values. Ask whether to proceed with light-only output or to investigate a manual dark-mode toggle on the site.
3. **ESCALATE IF a token straddles the L2/L3 boundary** and the classifier cannot disambiguate. Surface the token and its context and ask which class to assign.
4. **ESCALATE IF validation reports hex mismatches** that appear to be extractor bugs rather than write-phase errors (e.g., `tokens.json` itself contains `#1A1A2E` — invalid case — where the live CSS was `#1a1a2e`). Ask whether to correct `tokens.json` before re-validating.
5. **ESCALATE IF the user wants to edit DESIGN.md by hand after extraction** and remove or alter token-derived values. The DESIGN.md is a fidelity artifact; manual edits that deviate from `tokens.json` break validation. Offer to re-run extraction with different parameters instead.

---

## 5. REFERENCES

### Core References (Vendored Tool)

- [design-md-format.md](tool/resources/design-md-format.md) — The authoritative v2 DESIGN.md section specification: 17 required sections, heading conventions, token-to-section mapping.
- [writing-style-guide.md](tool/resources/writing-style-guide.md) — Voice, tone, tense, and section-composition rules for DESIGN.md prose.
- [color-role-taxonomy.md](tool/resources/color-role-taxonomy.md) — Color role naming conventions and the classification hierarchy (brand, semantic, surface, border, text, interactive).
- [component-taxonomy.md](tool/resources/component-taxonomy.md) — Component naming, hierarchy patterns, and the component-to-section mapping rules.
- [anti-patterns.md](tool/resources/anti-patterns.md) — Common DESIGN.md authoring mistakes: invented values, missing sections, wrong hex case, L4 leaks, and dark-mode fabrication.
- [quality-checklist.md](tool/resources/quality-checklist.md) — Pre-validate self-check list: hex format, section presence, stability-class compliance, dark-mode gate, a11y section presence.

### Workflow Specification

- [design-md-workflow.md](tool/design-md-workflow.md) — The full upstream three-phase workflow specification (extract, write, validate, report). Canonical reference for pipeline mechanics, CLI flags, and edge-case handling.

### Gold-Standard Examples

- [tool/examples/stripe/](tool/examples/stripe/) — DESIGN.md + tokens.json + writing-notes.md for Stripe.
- [tool/examples/vercel/](tool/examples/vercel/) — DESIGN.md + tokens.json + writing-notes.md for Vercel.
- [tool/examples/linear/](tool/examples/linear/) — DESIGN.md + tokens.json + writing-notes.md for Linear.
- [tool/examples/supabase/](tool/examples/supabase/) — DESIGN.md + tokens.json + writing-notes.md for Supabase.

### Skill-Owned References

- [references/](references/) — Advisor-routable operational reference docs authored for this skill. Load per the Smart Router (Section 2) intent model.

### Reference Loading Notes

- `tool/resources/design-md-format.md` is the baseline (always loaded). Load `writing-style-guide.md` alongside it for any write-phase work.
- Load the taxonomy docs (`color-role-taxonomy.md`, `component-taxonomy.md`) and `anti-patterns.md` only when the intent is EXTRACT_WRITE.
- Load `quality-checklist.md` before any validation or completion claim.
- Load `tool/design-md-workflow.md` only for deep pipeline debugging or when the standard invocation pattern is insufficient.
- Load one example site at a time from `tool/examples/` when in STUDY intent; compare the DESIGN.md against the tokens.json to understand format conventions.
- Keep Section 2 (SMART ROUTING) as the single routing authority for all resource loads.

---

## 6. SUCCESS CRITERIA

**Extraction complete when:**
- [x] `tokens.json` was written by `extract.ts` with no fatal errors, and the file is valid JSON with non-empty token arrays.
- [x] `DESIGN.md` was written conforming to the v2 17-section format in `tool/resources/design-md-format.md`.
- [x] Every hex, pixel, font-weight, shadow, and radius in DESIGN.md matches `tokens.json` verbatim.
- [x] All hex codes use 6-digit lowercase format.
- [x] L1 + L2 tokens populate the main sections; L3 tokens appear with "Subject to change"; L4 tokens are absent.
- [x] Dark-mode section exists only if `tokens.json` contains a detected dark palette.
- [x] An accessibility section is present, drawn from `tokens.json` a11y data.
- [x] `validate.ts` passes with zero hex mismatches and zero missing sections.

**Validation-only complete when:**
- [x] `validate.ts` was run against the DESIGN.md + tokens.json pair.
- [x] All reported errors are resolved or escalated per Section 4 (ESCALATE IF).

**Report complete when:**
- [x] `report-gen.ts` and `preview-gen.ts` produced artifacts at the specified output paths with no errors.

---

## 7. INTEGRATION POINTS

### Tool Usage Guidelines

- **Bash** owns all vendored-tool invocations: `npx ts-node scripts/extract.ts`, `npx ts-node scripts/validate.ts`, `npx ts-node scripts/report-gen.ts`, `npx ts-node scripts/preview-gen.ts`, `npm install`, `npx playwright install chromium`. All commands run from `tool/` as the working directory.
- **Read** loads `tokens.json`, the existing DESIGN.md for re-extraction context, and all resource/reference docs.
- **Write** produces the DESIGN.md output. Only Write when the token data is fully loaded and the v2 format specification has been read.
- **Edit** is used for targeted fixes to DESIGN.md after validation reveals specific errors.
- **Glob/Grep** inspect the tool directory, locate examples, and search tokens.json for specific token keys.

### Cross-Workflow Contracts

- **`sk-design-interface`** is the design-judgment skill. When a DESIGN.md extraction feeds into inventing new UI direction, load that skill. This skill provides the ground truth; `sk-design-interface` applies the taste.
- **`sk-code`** consumes DESIGN.md as an implementation reference. The DESIGN.md produced by this skill is the contract that `sk-code` builds against — the hallucination-proof source of truth for colors, fonts, spacing, shadows, and radii.
- **`mcp-figma`** and **`mcp-open-design`** are alternative extraction sources. When the user needs a DESIGN.md from a Figma file or Open Design project instead of a live URL, route to those transports. When the user needs a DESIGN.md from a live URL, this is the skill.
- **`system-spec-kit`** applies when the extraction is part of a larger spec-tracked feature and packet documentation is required.

### External Tools

- **Playwright** (Microsoft, Apache 2.0): installed via `npx playwright install chromium`. Required for the extraction phase. The vendored tool uses Playwright to crawl live URLs and read computed CSS.
- **Node.js**: required by the vendored tool. The `tool/package.json` declares the version range.
- **`ts-node`**: used to execute the vendored TypeScript modules directly. Included in `tool/package.json` devDependencies.

### Knowledge Base Dependencies

**Required** (every invocation): `tool/resources/design-md-format.md` (v2 section specification). **Conditional**: `writing-style-guide.md`, taxonomy docs, `anti-patterns.md`, `quality-checklist.md` (per intent model in Section 2).

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers resource and reference docs dynamically. Start from `tool/resources/design-md-format.md` for the v2 section specification, load `tool/resources/writing-style-guide.md` for voice/tone rules, and load taxonomy/anti-pattern/quality docs per the intent model. References stay the primary loaded resources.

Examples: `tool/examples/{stripe,vercel,linear,supabase}/` provide gold-standard DESIGN.md + tokens.json pairs, loaded in STUDY intent. Study the DESIGN.md alongside the matching tokens.json to understand the format conventions.

Scripts: the vendored `tool/scripts/` directory contains 19 TypeScript modules. The primary entry points are `extract.ts` (Phase 1), `validate.ts` (Phase 3), `report-gen.ts`, and `preview-gen.ts` (Phase 4). The remaining modules are internal pipeline stages called by the orchestrator.

Related skills: `sk-design-interface` (the design-judgment sibling — invents new direction, consumes DESIGN.md as ground truth), `sk-code` (consumes DESIGN.md as the implementation contract), `mcp-figma` (extracts from Figma Desktop, not live URLs), `mcp-open-design` (extracts from Open Design projects), `mcp-chrome-devtools` (for browser inspection and visual preview, not structured extraction), and `system-spec-kit` when the extraction is part of a tracked packet.

Install guide: tool setup is `cd tool && npm install && npx playwright install chromium`. A dedicated INSTALL_GUIDE.md for Node.js + Playwright + Chromium setup is authored separately.

Upstream: the vendored tool at `tool/` is MIT-licensed. See `tool/LICENSE` for terms. This skill documents driving the vendored tool and does not vendor or redistribute upstream dependencies beyond what `tool/package.json` declares.
