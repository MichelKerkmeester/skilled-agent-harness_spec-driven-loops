---
title: "sk-create-chart"
description: "Builds a standalone HTML chart or report by taking a render block from a template that already renders, rather than writing chart code freehand."
trigger_phrases:
  - "create chart"
  - "chart packet"
  - "what does sk-create-chart do"
  - "make a bar chart"
  - "chart or diagram"
  - "chart color system"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# sk-create-chart

> Turn a question about data into a single HTML file that opens in a browser and answers it.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | A chart or a multi-chart report that plots values a reader compares |
| **Invoke with** | "make a bar chart", "build a report page" or a direct read of `SKILL.md` |
| **Works on** | A dataset and the comparison someone wants to make from it |
| **Produces** | One self-contained HTML file, built from a template and one color system |
| **Current state** | The corpus directories exist and hold no charts yet |

---

## 2. OVERVIEW

### Why This Packet Exists

Charts written freehand are the ones that break. The axis labels overlap at the third data point, the legend wraps under a narrow viewport, the palette runs out of distinguishable colors at series six. None of that shows up in a check. It shows up when someone opens the file, and by then the chart has already been sent to somebody.

A template that already renders has had those problems solved once. Taking its render block and swapping the data keeps the solution and changes only the part that should change. That is the whole method, and it is why this packet is organized around a corpus rather than around instructions for drawing.

### What It Does

You describe the comparison a reader needs to make. The chart lookup in `references/` turns that comparison into one named chart type and points at the gallery page holding it. You take that card's render block, apply one color system and assemble a single file. A validator then proves the corpus still renders.

The packet holds no per-request logic. It holds a corpus and the rules for picking from it.

### Why It Matters

- **A chart that renders where it was built renders where it is read:** the output is one file with no install step and no build.
- **The palette decision is made once:** color systems are named and applied whole, so no artifact invents its own.
- **Regressions are catchable:** a validator over the corpus turns "the gallery still works" into something you can run.

---

## 3. CHART OR DIAGRAM

This packet and `sk-create-diagram` both answer "make me a bar chart", so the boundary is worth stating before the first request rather than after a misroute.

| The artifact carries | Packet |
|---|---|
| Values a reader compares, ranks or tracks over time | `sk-create-chart` |
| A structure a reader follows: a flow, an architecture, a sequence, a state machine | `sk-create-diagram` |

The test is what the reader does with it. Someone reading a chart is comparing quantities. Someone reading a diagram is tracing a path.

---

## 4. LAYOUT

| Path | What it holds |
|---|---|
| [`SKILL.md`](./SKILL.md) | The runtime contract: when to use the packet, the workflow, the rules |
| [`references/`](./references/) | The chart lookup and the reference index that routes to it |
| [`assets/templates/`](./assets/templates/) | Gallery pages and standalone charts, the source of every render block |
| [`assets/color/`](./assets/color/) | Named color systems and their token files |
| [`assets/reports/`](./assets/reports/) | Multi-chart report pages and the index listing them |
| [`assets/examples/`](./assets/examples/) | Whole pages built from the corpus, for when a template alone is unclear |
| [`scripts/`](./scripts/) | The corpus validator |
| [`manual-testing-playbook/`](./manual-testing-playbook/) | Operator scenarios for the packet |
| [`changelog/`](./changelog/) | One file per release, named `v[version].md` |

---

## 5. LICENSING

Every chart, palette and script in this packet is authored here. Nothing is copied in from an outside chart library.

That is a constraint rather than a preference. This repository is MIT and public, so anything it ships is handed onward to every downstream reader under an MIT grant. Content carried in from a source that did not give that grant would put a recipient in breach of a license they never saw. So the corpus is written rather than gathered, and an outside library is read for ideas and never for bytes.

---

## 6. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Package shape | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/sk-doc/sk-create-chart --check --strict` | `Result: PASS` |
| Hub shape | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` | Zero invariant failures |
| Voice | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py README.md` | Zero hard blockers |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The runtime contract and the template-first workflow |
| [`references/README.md`](./references/README.md) | The reference index |
| [`scripts/README.md`](./scripts/README.md) | What the corpus validator checks |
| [`../SKILL.md`](../SKILL.md) | The `sk-doc` hub that routes here |
| [`../sk-create-diagram/README.md`](../sk-create-diagram/README.md) | The structural-visual packet across the boundary |
