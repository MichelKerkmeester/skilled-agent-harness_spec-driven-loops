---
title: "sk-design: Manual Testing Playbook"
description: "Operator-facing index for sk-design smart-router validation: the canvas modes' resource loading, holdout generalization probes, and cross-canvas ambiguity."
version: 1.0.0.0
---

# sk-design: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live sk-design hub — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the smart router picks (per `SKILL.md` and `ROUTER.md`, resolved through `mode-registry.json` / `hub-router.json`), which resources it loads, and how it behaves under ambiguous input. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the operator directory for the sk-design manual testing playbook. Per-scenario execution detail lives in the category folders below; each scenario file ships a YAML contract (id, expected_intent, expected_resources) plus setup, expected behavior and success criteria.

Source of truth for routing behavior: `.opencode/skills/sk-design/SKILL.md` and `ROUTER.md`, resolved at runtime through `mode-registry.json` / `hub-router.json`.

---

## 1. OVERVIEW

This corpus exists because the two canvas modes moved here. `sk-design-chart` and `sk-design-diagram` were modes of the documentation hub until the design hub took ownership of both canvases, and their routing scenarios came with them. The typed-gold gate is per-hub by design, so a scenario naming a mode has to live under the hub that owns it.

---

## 2. CATEGORIES

| # | Category | Folder | Scenario IDs | One-line summary |
|---|----------|--------|--------------|------------------|
| 1 | Resource Loading | `resource-loading/` | SD-005 | Router loads only the expected resource set for an assets-only FLOWCHART request. |
| 2 | Unknown Fallback | `unknown-fallback/` | SD-007 | Router preserves both candidate intents when a visualise request could be either canvas. |
| 3 | Holdout | `holdout/` | SD-H05, SD-H10 | Generalization probes excluded from any fitted routing aggregate: a natural-phrasing FLOWCHART rewrite and an independent keyword-blind FLOWCHART prompt. |

---

## 3. SCENARIOS

- **SD-005** — `resource-loading/assets-only.md` — FLOWCHART loads only `assets/ascii-patterns/*`.
- **SD-007** — `unknown-fallback/ambiguous-multi-intent.md` — CHART and FLOWCHART tie within `AMBIGUITY_DELTA=1`.
- **SD-H05** — `holdout/flowchart-natural.md` — FLOWCHART via natural phrasing.
- **SD-H10** — `holdout/ind-flowchart.md` — FLOWCHART, keyword-blind.

### Why the ids read `SD-`

They are the ids these scenarios were authored under in the documentation hub's corpus, and benchmark reports dated 2026-07-21 key their results to them. Keeping the ids means those reports still resolve to a file. The prefix names where a scenario came from, not where it lives.

**SD-007 is the one whose meaning changed.** It paired document quality with flowchart while both were modes of one hub. Those two modes now sit in different hubs and no per-hub gate can validate a cross-hub pair, so it was repointed to the chart-versus-flowchart ambiguity the design hub actually owns. A reader of the 2026-07-21 reports should expect the earlier pairing there.

---

## 4. RUNNING THE GATE

```
node .opencode/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs \
  --skill-dir .opencode/skills/sk-design --strict
```

`--strict` is not optional. Without it the gate prints `verdict=FAIL` and exits 0, which reads as a pass to anything checking exit status.
