---
title: sk-design
description: "Design parent hub: each design request reaches the one mode that owns its artifact, which then builds it from its own corpus."
trigger_phrases:
  - "design.md"
  - "style reference"
  - "extract design tokens"
  - "chart catalog"
  - "flowchart"
version: 1.0.1.0
---

# sk-design

> Say what design artifact you need. The mode that owns it builds the file.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Measuring a live surface, plotting values you supply, drawing a process or exporting a finished diagram |
| **Invoke with** | A plain-language request or a `/design:` command |
| **Works on** | A live URL for extraction or material you supply for a canvas |
| **Produces** | A `DESIGN.md` with captured tokens or one self-contained artifact file per canvas request |

### What It Does

`sk-design` is a parent hub. It holds the routing decision and no procedure of its own. You state the design artifact you need. The hub decides which mode owns that artifact and hands over. That mode carries its own contract and keeps its references and scripts inside its own folder.

Start with the compiled front door in [Quick Start](#2-quick-start). It names the mode for a request before any file is opened.

### The Three Modes

Each mode owns one artifact. No mode lives at the hub root. This hub has no root `references/` or `assets/` folder.

| Mode | Command | What it delivers |
|---|---|---|
| `sk-design-md-generator` | `/design:extract <live-url> --output <dir>` | A measured Style Reference `DESIGN.md` plus the captured `tokens.json` |
| `sk-design-chart` | `/design:chart <target-chart.html> <what the reader compares>` | A standalone HTML chart copied from one of 29 corpus forms |
| `sk-design-diagram` | `/design:diagram <target>` | An HTML/SVG diagram from a 27-type library or an ASCII flowchart in markdown |

### What Stays Out of This Hub

A decision about what a value should be and a review of a screen belong to `sk-code`. Documentation prose belongs to `sk-doc`. Edits to a design mode belong inside that mode, never at the hub root.

---

## 2. QUICK START

**Step 1: Resolve the mode.** Describe the artifact and let the compiled router name its owner.

```bash
node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "which chart fits this split"
```

It prints one JSON line. For that prompt the line reports the `route` action with `selectionKind` set to `single`. Its `targets` array names `sk-design-chart`.

**Step 2: Run the command that mode owns.**

- `/design:chart` takes a target `.html` path and the comparison a reader needs. It stops for the literal values rather than inferring them from a screenshot or the conversation.
- `/design:diagram` takes a target path and defaults to `html-svg`. Add `--output-format ascii-markdown` for a flowchart that lives inside a markdown file.
- `/design:extract` takes a live URL and `--output <dir>`. It stops until both are bound, because there is nothing to measure without a source.

The compiled front door is the default. Set `SPECKIT_COMPILED_ROUTING=0` to force the legacy routing path.

---

## 3. HOW IT WORKS

Routing runs in two stages. Stage one scores the request against `hub-router.json` and reads `mode-registry.json` to select a mode. Stage two reads [`ROUTER.md`](./ROUTER.md) and loads the leaf files that mode declares, so a chart request opens the catalog and the template contract rather than the whole hub.

```text
┌─────────────────────────────────────────┐
│             Design request              │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    hub-router.json scores the signal    │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    mode-registry.json names the mode    │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ ROUTER.md maps the intent to leaf files │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│   The owning mode builds the artifact   │
└─────────────────────────────────────────┘
```

A mode entry is loaded because the registry names it. The leaf map never loads a `SKILL.md` of its own.

### Ties and the Empty Signal

`routerPolicy.ambiguityDelta` is `1`, so two intents that score within one point route to both leaf sets and the union is deduped. The tie-break order puts `sk-design-md-generator` ahead of the two canvas modes. Chart then ranks above diagram. `routerPolicy.defaultMode` is `null`, so a design request with no clear owner defers and asks which artifact you want instead of guessing.

### Where the Routing Vocabulary Lives

The nested modes carry `routingClass: metadata`, so the advisor resolves them by hub membership and holds no entry of its own for any mode. Their vocabulary reaches the advisor through the `intent_signals` list in [`graph-metadata.json`](./graph-metadata.json). A keyword in `description.json` is documentation and is not scored.

---

## 4. VERIFICATION

Hub structure and the coupled metadata:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design
```

Each invariant prints a `PASS` line and the run ends with `OK: parent-skill-check` reporting 0 warnings. The exit status is 0.

The routing playbook, run against the live hub:

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs --skill-dir .skilled/skills/sk-design --strict
```

It ends with `verdict=PASS valid=4 blocked=0 unenrolled=0 total=4` and exits 0.

The chart corpus:

```bash
node .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs
```

The run ends with `Summary: errors: 0` and `RESULT: PASSED`. A green run means the structural contract holds, not that anything was rendered. Add `--render` to open every template in a browser.

The diagram corpus:

```bash
node .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs
```

The run ends with `Summary: errors: 0` and `RESULT: PASSED` over 38 forms.

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Hub contract: mode table, routing summary and rules |
| [`ROUTER.md`](./ROUTER.md) | Stage-two intent map and leaf resources |
| [`mode-registry.json`](./mode-registry.json) | Mode identity, packet kind, backend and tool surface |
| [`hub-router.json`](./hub-router.json) | Stage-one signals, vocabulary classes and tie-break order |
| [`graph-metadata.json`](./graph-metadata.json) | The `intent_signals` vocabulary the advisor scores |
| [`sk-design-md-generator/SKILL.md`](./sk-design-md-generator/SKILL.md) | Extraction contract and the DESIGN.md pipeline |
| [`sk-design-chart/SKILL.md`](./sk-design-chart/SKILL.md) | Chart contract and the corpus rules |
| [`sk-design-diagram/SKILL.md`](./sk-design-diagram/SKILL.md) | Diagram contract, types and output formats |
| [`sk-design-chart/references/catalog.md`](./sk-design-chart/references/catalog.md) | The question-to-form index the chart mode reads first |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Live routing scenarios and holdouts |
