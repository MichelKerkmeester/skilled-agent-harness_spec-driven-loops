---
name: sk-design
description: "Design parent hub. Routes one design identity to the mode that owns the artifact: a measured Style Reference, a chart or a diagram."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 3.0.2.0
metadata:
  family: sk-design
---

<!-- Keywords: design, style reference, design.md, extract design tokens, chart, diagram, flowchart -->

# Design (parent hub)

`sk-design` is a parent hub. It carries no procedure of its own: it decides which mode owns the
decision in front of you and hands over. The work lives in the modes.

---

## 1. WHEN TO USE

Use this hub when the answer is a design artifact: a measured Style Reference of an existing
surface, a data chart, or a process diagram.

| Mode | Command | Owns | Reach it by asking about |
|------|---------|------|--------------------------|
| `sk-design-md-generator` | `/design:extract` | Measuring an existing surface into a Style Reference, and validating one | extract, design.md, design tokens, from a url |
| `sk-design-chart` | `/design:chart` | Chart forms: which one answers the question, and building it as a self-contained file | chart, plot, heatmap, bar chart, chart catalog |
| `sk-design-diagram` | `/design:diagram` | Flowcharts and text diagrams | diagram, flowchart, ascii diagram, mermaid, drawio |

Three modes. The generator reads values back off something that already exists. Chart and diagram
each build one self-contained canvas.

### When NOT to Use

- **Deciding a value or reviewing a screen.** Spacing, type, colour, contrast, hierarchy, motion
  and visual review belong to `sk-code`, whose frontend surface carries the value scales and the
  review pass.
- **Authoring documentation prose.** `sk-doc` owns that, including READMEs, changelogs and playbooks.
- **Implementing a component.** `sk-code` owns the code that renders it.

---

## 2. SMART ROUTING

Routing runs in two stages.
Stage one picks a mode from this hub.
`hub-router.json` is its one authored vocabulary.
`vocabularyClasses` holds the terms, and `routerSignals` maps each mode to the classes it scores.
The three modes are `sk-design-md-generator`, `sk-design-chart` and `sk-design-diagram`.
Stage two maps the chosen mode to its leaves in the root [`ROUTER.md`](./ROUTER.md).
The two layers stay separate: the hub never emits leaf paths, and the surface router never re-decides the mode.
The advisor routes every design query to the single identity `sk-design`.
Run the compiled-routing directive in [`ROUTER.md`](./ROUTER.md) before selecting hub resources.
Resolve the mode with `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "<task>"`.
Act on the decision: `route` loads its targets, `clarify` and `defer` ask, `reject` refuses.
With no signal at all, `routerPolicy.defaultMode` is `null`, so the request defers and asks which artifact is wanted.

---

## 3. HOW IT WORKS

### Terms

- **`workflowMode`**: the public mode key, one of `sk-design-md-generator`, `sk-design-chart` or `sk-design-diagram`.
- **`packetKind`**: `workflow` for all three modes, because this hub has no surface axis.
- **`backendKind`**: `surface-router` for the generator, which resolves leaves from a reference set, while `template-scaffold` for chart and diagram builds an artifact from a form.
- **`routingClass`**: `metadata` on every nested mode, so the advisor resolves this hub by membership and holds no entry of its own per mode.
- **`mode-registry.json`**: what modes exist and what each may touch.
- **`hub-router.json`**: stage one's signals, vocabulary classes, tie-break and default mode.
- **`vocabularyClasses`**: the terms stage one matches, with `routerSignals` naming the classes each mode scores.
- **`tieBreak`**: the `routerPolicy` order that ranks the three modes when scores are close.
- **`routerPolicy.defaultMode`**: `null`, so a request with no signal at all defers instead of landing on a mode.
- **leaf**: a resource a chosen mode loads, counted as a canonical `(workflowMode, leafResourceId)` pair through `leaf-manifest.json`.
- **`ROUTER.md`**: stage two's `INTENT_SIGNALS` and `RESOURCE_MAP` over the three leaf intents, CHART, FLOWCHART and EXTRACT.
- **`intent_signals`**: the `graph-metadata.json` field that carries this hub's vocabulary to the advisor, since a `description.json` keyword is documentation and not scored.

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
├── sk-design-md-generator/  the extraction mode, its engine and style corpus
├── sk-design-chart/         the chart corpus, its checker, gallery and screenshots
└── sk-design-diagram/       the diagram forms, their validator and screenshots
```

Per-mode behaviour is **not flattened**: each mode keeps its own contract, references, assets and
scripts. This hub has no root `references/` or `assets/` directory, and mode resources stay inside
their owning mode.

### Why a registry row proves nothing

Nested modes carry `routingClass: metadata`, so they are resolved by hub membership and hold no
advisor entry of their own: their vocabulary reaches the advisor only through this hub's
`graph-metadata.json` `intent_signals`. A row in the registry, a keyword in `description.json` and a
green gate all leave a request unable to arrive. Only replaying the request proves it does, and
`ci-router-vocabulary-reach.cjs` probes every phrase this hub's router advertises for exactly that.

---

## 4. RULES

### ALWAYS

- Read the registry before assuming a mode exists.
- Load what the mode's own router resolves, not the whole tree.
- Vocabulary that must move the advisor goes in `graph-metadata.json` `intent_signals`. Keywords in
  `description.json` are documentation, not what gets scored.
- Take the mode from the compiled front door,
  `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "<task>"`, as the section 5
  callout in [`ROUTER.md`](./ROUTER.md) says. On a `{"servingAuthority":"legacy"}` sentinel or
  any error, use the routing in section 5 of `ROUTER.md` instead.

### NEVER

- Never re-read a mode already in context.
- Never author content in this hub. Edits belong in a mode.

### ESCALATE IF

- A request cannot be mapped to one registered mode.
- Registry modes, router signal keys or leaf manifest entries disagree.

---

## 5. REFERENCES

| Resource | Purpose |
|----------|---------|
| `mode-registry.json` | What modes exist, and what each may touch |
| `hub-router.json` | Signals, vocabulary classes, tie-break |
| `ROUTER.md` | Stage two: which resources a chosen mode loads |
| `sk-design-md-generator/` | The extraction mode, its engine and its style corpus |
| `sk-design-chart/` | The chart corpus and its checker |
| `sk-design-diagram/` | The diagram forms and their validator |
| `command-metadata.json` | The commands this hub owns, and which mode owns each |
