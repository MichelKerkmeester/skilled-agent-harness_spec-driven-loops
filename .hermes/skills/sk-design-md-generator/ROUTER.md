---
title: "Design System Extractor (md-generator) Router"
description: "Sibling router for sk-design-md-generator: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "sk-design-md-generator router"
  - "sk-design-md-generator routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# Design System Extractor (md-generator) Router

The machine router for [`SKILL.md`](../../../.skilled/skills/sk-design/sk-design-md-generator/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name `DESIGN.md`, `tokens.json`, a style reference, CSS capture, validation or a report measured from a live site or an existing extraction pair, and a brief-only request naming `DESIGN.md` still lands here for its authoring-boundary refusal. It routes to the v3 Style Reference format specification and writing-style guide, the colour and component taxonomies, the authoring-boundary and quality-checklist checks, the operational extraction-workflow and troubleshooting guides, and the three WRITE-phase assets, with the gold-standard example pairs reachable only under STUDY intent. `references/design-md-format.md` is the default resource and loads before any intent is scored.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`EXTRACT_WRITE`** fires on `extract`, `crawl`, `url`, `design.md`, `generate`, `capture`, `tokens.json`, `design system` and `live` at weight 4, and is the fallback when no keyword scores. It loads `references/design-md-format.md`, `references/writing-style-guide.md`, `references/color-role-taxonomy.md`, `references/component-taxonomy.md`, `references/anti-patterns.md`, `references/authoring-boundary.md`, `references/extraction-workflow.md`, `references/troubleshooting.md`, `assets/design-md-prompt-template.md`, `assets/cardinal-rules-card.md` and `assets/source-of-truth-router-card.md`.
- **`VALIDATE`** fires on `validate`, `check`, `verify`, `accuracy`, `hex`, `section completeness` and `fidelity` at weight 4. It loads `references/quality-checklist.md`, `references/anti-patterns.md`, `references/design-md-format.md` and `assets/cardinal-rules-card.md`.
- **`REPORT`** fires on `report`, `preview`, `visual`, `html`, `diff` and `render` at weight 4. It loads `references/design-md-format.md`.
- **`RUN_WRAPPER`** fires on `guided run`, `wrapper`, `smoke`, `preflight`, `readiness` and `run wrapper` at weight 4. It loads `references/extraction-workflow.md`, `references/troubleshooting.md`, `references/guided-run.md` and `assets/cardinal-rules-card.md`.
- **`STUDY`** fires on `example`, `stripe`, `vercel`, `linear`, `supabase`, `gold standard`, `reference`, `editorial`, `ecommerce`, `non-saas` and `non saas` at weight 4. It loads `references/design-md-format.md`, `references/writing-style-guide.md`, the `DESIGN.md` and `writing-notes.md` pair for each gold-standard site under `references/examples/`, and `references/examples/editorial-exemplar.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's route map, its resource inventory and the python router.

### Primary Detection Signal

Detect the **pipeline phase** first. The three phases are sequential and each has a distinct surface: EXTRACT hits the live URL, WRITE produces the markdown, VALIDATE checks fidelity. A fourth path — REPORT — renders visual artifacts from an existing pair.

Route here when `DESIGN.md`, `tokens.json`, style reference, CSS capture, validation, report generation, or source-of-truth provenance are measured artifacts from a live site or an existing extraction pair.
**Route here too, even with no live URL present, when a request explicitly names the `DESIGN.md`/"style reference" artifact this mode owns** (e.g. "generate a DESIGN.md style reference for X from this brief"). Resolving elsewhere on a brief-only technicality would skip this mode's own authoring-boundary refusal (`references/authoring-boundary.md`), the exact check that request needs.
Generic brief-only token-system authoring that never names `DESIGN.md`/style-reference/`tokens.json` as the target artifact (e.g. "design a color and type token system for X") is out of scope for this skill. It invents rather than measures.
Do not produce new visual direction from an extracted reference here. This skill only captures and validates measured values.

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

The router discovers knowledge from this skill's `references/` and `assets/` directories.
Ten reference docs cover the v3 format spec and writing-style guide, the colour and component taxonomies, anti-patterns, the authoring boundary, the quality checklist, the operational extraction-workflow and troubleshooting guides, and the guided-run wrapper contract.
Three assets are the WRITE-phase prompt template, the cardinal-rules card, and the source-of-truth router card.
The gold-standard pairs under `references/examples/` are reachable only under STUDY intent. The writer reads these study artifacts to learn format conventions and never copies them into an extraction.

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
| ALWAYS      | Every invocation                     | `references/design-md-format.md` |
| CONDITIONAL | EXTRACT_WRITE intent                 | `references/color-role-taxonomy.md`, `references/component-taxonomy.md`, `references/anti-patterns.md` |
| CONDITIONAL | Guided run or smoke extraction wrapper | `references/guided-run.md`, `references/extraction-workflow.md`, `references/troubleshooting.md` |
| CONDITIONAL | A value's origin is unclear (brief vs measured), or a brief-only request with no live site | `references/authoring-boundary.md` (the measured / brief-provided / inferred / absent line, where forward-authoring is out of scope) and `assets/source-of-truth-router-card.md` (the fill-in provenance card) |
| CONDITIONAL | VALIDATE / completion claim          | `references/quality-checklist.md`, `references/anti-patterns.md`  |
| CONDITIONAL | STUDY intent                         | `references/examples/` (one site at a time, loaded as reference pairs)           |
| CONDITIONAL | Internal procedure support           | `procedures/design-system-extraction.md` when the request involves extraction, token capture, `DESIGN.md`, source design systems, screenshots, or measured brand references |
| ON_DEMAND   | Deep format edge-cases or component patterns | `references/anti-patterns.md`, `references/component-taxonomy.md` |

The private procedure-card selection list in `SKILL.md` Section 3 is part of this routing contract: after the public `md-generator` mode is selected, choose `procedures/design-system-extraction.md` when its trigger matches and cite its relative path in the plan or proof line.

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../../.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md). Guard paths, discover at runtime, score intents, fall back to the full extract-write-validate pipeline when unsure.

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
