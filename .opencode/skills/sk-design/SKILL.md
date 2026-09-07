---
name: sk-design
description: Design parent hub. Routes one design identity to the mode that owns the decision being asked for, starting with sk-design-fundamentals.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 2.0.0.0
metadata:
  author: OpenCode
  family: sk-design
---

<!-- Keywords: design, spacing, padding, typography, colour, contrast, hierarchy, design review, ux laws, design fundamentals -->

# Design (parent hub)

`sk-design` is a parent hub. It carries no procedure of its own: it decides which mode owns the
decision in front of you and hands over. The work lives in the modes.

---

## 1. WHEN TO USE

Use this hub when the question is what a surface should look like, why it looks wrong, or what
visual artifact answers it: spacing, type, colour, contrast, hierarchy, a review of an existing
surface against design criteria, a data chart, or a process diagram. The surface can be screen UI, a
slide deck, a printed page or a document layout.

### When NOT to Use

- **Measuring a surface that already exists into a written specification.** That is this hub's
  EXTRACT mode, reached by naming the source; it is not the values path.
- **Authoring documentation prose.** `sk-doc` owns that, including READMEs, changelogs and playbooks.
- **Implementing the values once decided.** `sk-code` owns the code that renders them; this hub
  decides what they should be and never writes the component.
- **A canvas question that names its own form.** A chart or diagram request goes to its mode
  directly rather than through the values mode.

---

## 2. SMART ROUTING

Routing is **registry-driven at runtime and mode-authored at source**, in two stages. Stage 1
(hub → mode): the advisor scores this hub as one identity, then `mode-registry.json` and
`hub-router.json` pick the mode without re-deriving mappings during a request. Stage 2
(mode → leaves): the root `ROUTER.md` maps the design intent to the exact mode-local resources that
mode loads. The two layers stay separate: the hub never emits leaf paths, and the surface router
never re-decides the mode.

> **Compiled routing: not yet.** The other five hubs resolve through a compiled router contract
> first (`node .opencode/bin/compiled-route.cjs --hub <id> --prompt "<task>"`). This hub is not in
> that closure: the same call returns `{"servingAuthority":"legacy","hubId":"sk-design"}`, so the
> routing below is the only path. Joining needs a rollout package mirroring the five that exist plus
> registration in the engine's hub table and the guard's hub list. Until then, do not quote a
> compiled decision for this hub, because there is not one.

| Mode | Owns | Reach it by asking about |
|------|------|--------------------------|
| `sk-design-fundamentals` | The values a surface is built from, and reviewing a surface against them | spacing, padding, type scale, colour, contrast, hierarchy, design review |
| `sk-design-md-generator` | Measuring an existing surface into a Style Reference, and validating one | extract, design.md, design tokens, style reference, from a url |
| `sk-design-chart` | Chart forms: which one answers the question, and building it as a self-contained file | chart, plot, heatmap, bar chart, chart catalog |
| `sk-design-diagram` | Flowcharts and text diagrams | diagram, flowchart, ascii diagram, mermaid, drawio |

Four modes. Fundamentals and the generator are complements rather than alternatives: one decides values, the other reads values back
off something that already exists. A request that names an existing surface belongs to the
generator; a request that asks what a value should be belongs to fundamentals.

### Surface Router, per-intent leaf sets

Stage 2 lives in `ROUTER.md` at the hub root, beside this file. It defines the five-intent leaf
model (VALUES, REVIEW, CHART, FLOWCHART, EXTRACT), the machine-readable `INTENT_SIGNALS` and
`RESOURCE_MAP` block the deterministic router-replay parses, and the how-to-read rules: a dominant
intent takes one leaf set, near-tied intents take a deduped union, and no keyword match is the hub's
UNKNOWN fallback rather than a silent default. Every `RESOURCE_MAP` path resolves on disk and
dual-reads to a canonical `(workflowMode, leafResourceId)` pair through `leaf-manifest.json`.

`ROUTER.md` stays a separate document on purpose. The machine block must not move into this file,
where a replay would read it as the hub's own router and lose the mode projection, nor into
`hub-router.json`, which is a different schema.

### The discriminator

- **`workflowMode`** — the public mode key: `sk-design-fundamentals`, `sk-design-md-generator`,
  `sk-design-chart`, `sk-design-diagram`.
- **`packetKind`** — `workflow` for all four. There is no surface axis on this hub.
- **`backendKind`** — `surface-router` for fundamentals and the generator, which resolve leaves from
  a reference set; `template-scaffold` for chart and diagram, which build an artifact from a form.

### Routing rule

```
SKILL_ROOT  = path containing this SKILL.md
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

### Why a registry row proves nothing

Nested modes carry `routingClass: metadata`, so they are resolved by hub membership and hold no
advisor entry of their own: their vocabulary reaches the advisor only through this hub's
`graph-metadata.json` `intent_signals`. A row in the registry, a keyword in `description.json` and a
green gate all leave a request unable to arrive. Only replaying the request proves it does, and
`ci-router-vocabulary-reach.cjs` probes every phrase this hub's router advertises for exactly that.

---

## 3. HOW IT WORKS

### Layout

```
sk-design/
├── SKILL.md                 routing only; this hub authors nothing
├── ROUTER.md                stage two: which resources a chosen mode loads
├── mode-registry.json       what modes exist, and what each may touch
├── hub-router.json          signals, vocabulary classes, tie-break
├── graph-metadata.json      the only vocabulary the advisor scores
├── command-metadata.json    the commands this hub owns, and which mode owns each
├── shared/scripts/          tooling both canvas modes use
├── sk-design-fundamentals/  the values mode, and everything it owns
├── sk-design-md-generator/  the extraction mode, its engine and style corpus
├── sk-design-chart/         the chart corpus, its checker, gallery and screenshots
└── sk-design-diagram/       the diagram forms, their validator and screenshots
```

Per-mode behaviour is **not flattened**: each mode keeps its own contract, references, assets and
scripts. This hub has no root `references/` or `assets/` directory, and mode resources stay inside
their owning mode.

---

## 4. RESOURCES

| Resource | Purpose |
|----------|---------|
| `mode-registry.json` | What modes exist, and what each may touch |
| `hub-router.json` | Signals, vocabulary classes, tie-break |
| `ROUTER.md` | Stage two: which resources a chosen mode loads |
| `sk-design-fundamentals/` | The values mode, and everything it owns |
| `sk-design-md-generator/` | The extraction mode, its engine and its style corpus |
| `sk-design-chart/` | The chart corpus, its checker and its gallery |
| `sk-design-diagram/` | The diagram forms and their validator |
| `command-metadata.json` | The commands this hub owns, and which mode owns each |

---

## 5. RULES

1. Read the registry before assuming a mode exists.
2. Load what the mode's own router resolves, not the whole tree.
3. A mode already in context is not re-read.
4. This hub authors nothing itself. If you are editing here rather than in a mode, something is wrong.
5. Vocabulary that must move the advisor goes in `graph-metadata.json` `intent_signals`. Keywords in
   `description.json` are documentation; they are not what gets scored.
6. Never quote a compiled routing decision for this hub. It is not in the compiled closure, and the
   call returns a legacy sentinel rather than a route.
