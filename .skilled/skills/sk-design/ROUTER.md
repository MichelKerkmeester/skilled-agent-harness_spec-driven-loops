---
title: sk-design Surface Router — per-intent leaf sets
description: Stage-two router at the sk-design hub root. hub-router.json selects the workflow mode; this document maps a design intent to the exact mode-local leaf resources that mode should load, so a request loads what it needs rather than a directory.
trigger_phrases:
  - "sk-design surface router"
  - "design resource map"
  - "design intent routing"
importance_tier: important
contextType: implementation
version: 2.0.6.0
router_state: active
skill_pointer: SKILL.md
---

# sk-design Surface Router — per-intent leaf sets

## 1. OVERVIEW

`SKILL.md` picks the mode. This document picks what that mode loads.

`hub-router.json` selects the workflow mode from a request. This router then maps the design intent
inside that request to the exact mode-local resources worth loading, so a request pulls what it
needs rather than a directory. Every `RESOURCE_MAP` path resolves on disk and dual-reads to a
canonical typed pair through `leaf-manifest.json`.

An intent that matches nothing here is a gap to report, not a reason to load everything.

---

## 2. INTENT MODEL

Five intents across four modes. The split is real rather than decorative: deciding a value, judging
a surface against values, authoring a chart canvas, authoring a diagram canvas, and reading values
back off a surface that already exists all load different things.

| Intent | Mode | What the request is asking for |
|--------|------|-------------------------------|
| `VALUES` | `sk-design-fundamentals` | Decide a value for something that does not exist yet |
| `REVIEW` | `sk-design-fundamentals` | Judge a surface that does exist against those values |
| `CHART` | `sk-design-chart` | Author a data canvas: one file, one question a reader answers by looking |
| `FLOWCHART` | `sk-design-diagram` | Author a process canvas, in markup or in text characters |
| `EXTRACT` | `sk-design-md-generator` | Read values back off a surface that already exists |

`VALUES` and `REVIEW` share a mode because they share its references; they stay separate intents
because they load different ones.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is the human-facing
contract; this block is the byte-for-byte source the deterministic router-replay parses. Keep them in
sync: when a map row changes above, update the matching `RESOURCE_MAP` entry here. Every
`RESOURCE_MAP` path resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to
a canonical typed pair.

```python
# No always-loaded preamble: a design request loads only the selected mode's
# leaves, so the hub default route stays minimal and a no-match disambiguates
# rather than pulling four modes' references into context.
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "VALUES": {"weight": 4, "keywords": ["padding", "spacing", "margin", "gutter", "type scale", "typography", "font size", "colour", "color", "contrast", "contrast ratio", "radius", "corner radius", "elevation", "shadow", "hierarchy", "visual hierarchy", "what should this look like", "slide deck design", "slide layout", "presentation design", "deck spacing", "how should this slide be laid out", "print layout", "printed page design", "margins for a print layout", "type scale for a printed report", "document layout", "document layout hierarchy", "report layout", "long-form layout", "poster layout", "design fundamentals", "what padding should this have", "spacing scale", "colour decision", "color decision"]},
    "REVIEW": {"weight": 4, "keywords": ["design review", "does this look right", "critique this", "visual audit", "ux laws", "accessibility contrast", "review this screen", "why does this look wrong", "design review of this slide deck", "review this deck", "review this layout", "critique"]},
    "CHART": {"weight": 4, "keywords": ["create a chart", "make a chart", "chart this data", "chart the data", "plot the data", "plot this data", "standalone html chart", "chart catalog", "which chart type", "chart template", "chart color system", "chart colour system", "data visualization", "data visualisation", "data viz", "bar chart of", "line chart of", "scatter plot of", "treemap", "waterfall chart", "heat matrix", "heatmap", "heat map", "calendar heatmap", "box plot", "candlestick chart", "stacked area chart", "stacked bar chart", "grouped bar chart", "donut chart", "waffle chart", "histogram", "parallel coordinates", "measured site's look", "theme a chart"]},
    "FLOWCHART": {"weight": 4, "keywords": ["flowchart", "ascii", "text diagram", "text characters", "decision tree", "process diagram", "flow diagram", "diagram the", "as a diagram", "create diagram", "diagram", "architecture diagram", "sequence diagram", "er diagram", "entity relationship diagram", "data model diagram", "state machine diagram", "swimlane diagram", "swimlane", "venn diagram", "org chart", "quadrant diagram", "gantt chart", "radar chart", "high-level diagram", "medallion diagram", "data flow diagram", "draw.io", "drawio", "mermaid diagram", "redraw diagram", "self-contained html diagram", "editorial diagram", "create flowchart", "ascii flowchart", "workflow diagram", "decision branch", "parallel execution diagram", "approval loop diagram", "export diagram", "create:diagram", "/design:diagram", "theme diagram", "repaint diagram", "brand the diagram", "venn", "mermaid"]},
    "EXTRACT": {"weight": 4, "keywords": ["extract", "design.md", "style reference", "design tokens", "measure this surface", "from a url", "from a site", "css extraction", "validate design.md", "style guide from", "measure", "extract design tokens", "measure a surface", "extract css", "design tokens from a site", "style guide from a url"]},
}

RESOURCE_MAP = {
    "VALUES": [
        "sk-design-fundamentals/references/hierarchy.md",
        "sk-design-fundamentals/references/color-system.md",
        "sk-design-fundamentals/assets/token-starter-set.md",
    ],
    "REVIEW": [
        "sk-design-fundamentals/references/review-checklist.md",
        "sk-design-fundamentals/references/ux-laws.md",
        "sk-design-fundamentals/references/diagnosis-table.md",
    ],
    "CHART": [
        "sk-design-chart/references/catalog.md",
        "sk-design-chart/references/color-system.md",
        "sk-design-chart/references/template-contract.md"
    ],
    "FLOWCHART": [
        "sk-design-diagram/assets/ascii-patterns/simple-workflow.md",
        "sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md"
    ],
    "EXTRACT": [
        "sk-design-md-generator/references/extraction-workflow.md",
        "sk-design-md-generator/references/design-md-format.md",
        "sk-design-md-generator/references/quality-checklist.md",
    ],
}
```

---

## 4. HOW TO READ THIS

- A mode is chosen by `hub-router.json`, not here. This document only answers what that mode loads.
- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the union is deduped by
  canonical pair and capped at the selected-map union limit. `CHART` and `FLOWCHART` are the pair most
  likely to tie, because a request to visualise something rarely says which canvas it wants.
- `VALUES` and `REVIEW` resolve to the same mode. A tie between them is not ambiguity to escalate; it
  is one mode loading both leaf sets.
- This map lists leaves, which is why no `SKILL.md` appears in it. A mode entry is loaded because the
  registry named the mode, not from here.
- Load what a row resolves and nothing more; a resource already in context is not re-read.
- No keyword match is the hub's UNKNOWN fallback: report the gap and confirm the target mode before
  loading anything. An intent that matches nothing here is a gap to report, not a reason to load
  everything.

---

## 5. MACHINE ROUTER

The hub's routing prose, moved here from `SKILL.md` so the skill body keeps only the pointer. It sits
last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and
`RESOURCE_MAP` block in section 3 stays the only replay source.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
>
> node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "<task>"
>
> Follow the returned decision. A `route` names its targets, a `clarify` or `defer` asks for disambiguation, and a `reject` refuses. On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving authority. Compiled routing is now the default for this hub. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide, the explicit kill-switch.

### Surface Router, per-intent leaf sets

Stage 2 lives in section 3 of this file. It defines the five-intent leaf
model (VALUES, REVIEW, CHART, FLOWCHART, EXTRACT), the machine-readable `INTENT_SIGNALS` and
`RESOURCE_MAP` block the deterministic router-replay parses, and the how-to-read rules: a dominant
intent takes one leaf set, near-tied intents take a deduped union, and no keyword match is the hub's
UNKNOWN fallback rather than a silent default. Every `RESOURCE_MAP` path resolves on disk and
dual-reads to a canonical `(workflowMode, leafResourceId)` pair through `leaf-manifest.json`.

This router stays a separate document from `SKILL.md` on purpose; [the parent-skill reference](../sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md#why-the-leaf-router-stays-in-routermd) gives the reason once.

### The discriminator

- **`workflowMode`** — the public mode key: `sk-design-fundamentals`, `sk-design-md-generator`,
  `sk-design-chart`, `sk-design-diagram`.
- **`packetKind`** — `workflow` for all four. There is no surface axis on this hub.
- **`backendKind`** — `surface-router` for fundamentals and the generator, which resolve leaves from
  a reference set; `template-scaffold` for chart and diagram, which build an artifact from a form.

### Routing rule

```
SKILL_ROOT  = path containing this ROUTER.md and its SKILL.md
REGISTRY    = SKILL_ROOT / "mode-registry.json"
HUB_ROUTER  = SKILL_ROOT / "hub-router.json"

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this decides a value, reviews a surface, measures an existing surface, or builds a chart or diagram",
    "Confirm the surface: screen UI, slide deck, printed page, document layout, or a chart or diagram canvas",
    "For a measure request, provide the live URL or path; there is nothing to read without one",
    "For a canvas request, state the question the artifact must answer, not the form you want",
]

def _guard_in_skill(relative_path):
  resolved = (SKILL_ROOT / relative_path).resolve()
  resolved.relative_to(SKILL_ROOT)
  if resolved.suffix.lower() not in {".md", ".json", ".css"}:
    raise ValueError("only skill-local markdown/json/css router resources are routable")
  return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, seen):
  guarded = _guard_in_skill(relative_path)
  if guarded not in seen and (SKILL_ROOT / guarded).exists():
    load(guarded)
    seen.add(guarded)
    return True
  return False

seen = set()
if not REGISTRY.exists() or not HUB_ROUTER.exists():
  return defer("router metadata missing; inspect sk-design/mode-registry.json and sk-design/hub-router.json")

read mode-registry.json and hub-router.json
classify the request to one or more workflowMode values using hub-router.json
  (dominant design intent; a command like /design:chart resolves directly)

if two intents tie within routerPolicy.ambiguityDelta:
  apply routerPolicy.tieBreak, then take the deduped union of their leaf sets
  VALUES and REVIEW resolving together is not ambiguity: they are one mode loading both sets

if confidence is low or the intent is contradictory:
  return UNKNOWN_FALLBACK with disambiguation_checklist = UNKNOWN_FALLBACK_CHECKLIST

for each resolved workflowMode:
  entry = the matching mode-registry.json modes[] item
  if entry is missing or entry.packetKind != "workflow":
    return defer("unknown sk-design workflowMode; extend mode-registry.json and create the mode first")
  if not load_if_available(f"{entry.packet}/SKILL.md", seen):
    return defer("registered mode SKILL.md is missing; repair the mode before routing")

return single or ambiguous according to hub-router.json routerPolicy.outcomes
```

`routerPolicy.defaultMode` is `sk-design-fundamentals`: a design question with no clearer owner is a
values question. That differs from `sk-doc`, whose default is `null` because an unclear documentation
intent has no safe default. Outcomes are `single`, `ambiguous` or `none`.
