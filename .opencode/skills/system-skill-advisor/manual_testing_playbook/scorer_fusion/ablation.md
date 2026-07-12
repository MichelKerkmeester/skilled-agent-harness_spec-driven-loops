---
title: "SC-005 Lane-by-Lane Ablation Protocol"
description: "Manual validation that lib/scorer/ablation.ts supports lane-by-lane disable so operators can measure each lane's contribution without mutating the live weights."
trigger_phrases:
  - "sc-005"
  - "ablation protocol"
  - "lane ablation"
  - "scorer ablation"
version: 0.8.0.16
---

# SC-005 Lane-by-Lane Ablation Protocol

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/scorer/ablation.ts` supports ablation protocols where each lane can be disabled in isolation to measure contribution and that ablation runs do not mutate the live weights or persist across calls.

---

## 2. SCENARIO CONTRACT

- Repo root. MCP server built.
- `advisor_validate` exposes ablation slices or direct ablation entry is available via internal harness.
- Capture the canonical full-corpus baseline (80.5%).

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Capture baseline:

```text
advisor_validate({"skillSlug":null})
```

2. Inspect the ablation slice in the response (or run ablation harness).
3. For each lane ablated to 0 weight in turn, record the resulting accuracy on the corpus.
4. After ablation, call `advisor_status` and confirm live `laneWeights` are unchanged.

### Expected Signals

- Baseline accuracy matches the documented baseline (within noise).
- Disabling any non-zero lane degrades accuracy by a measurable amount.
- Disabling `semantic_shadow` (a live lane at weight 0.05) measurably affects scoring.
- Post-ablation `laneWeights` equal pre-ablation values (ablation does not mutate live configuration).

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Ablation mutates live weights | `advisor_status` differs post-run | Block release. Ablation must be side-effect-free. |
| Ablation numbers match baseline exactly | Disabling a lane has no effect | Inspect `ablation.ts` weight override wiring. |
| Ablation crashes | Runtime exception | Treat as HALT and audit ablation path. |

### Evidence

Required command attempted as MCP `advisor_validate({"skillSlug":null})` with tool-required fields `confirmHeavyRun:true`, `workspaceRoot:"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"`, and `outcomeEvents:[]`.

First attempt output:

```text
MCP error -32001: backend recycled; retry
```

Retry output:

```text
MCP error -32001: backend recycled; retry
```

The required baseline and ablation slice were not returned, so steps 2-4 could not be executed. Missing/broken precondition: `advisor_validate` is not currently returning validation output; the MCP backend recycled on both real attempts.

### Pass/Fail

BLOCKED — `advisor_validate({"skillSlug":null})` did not return the baseline or ablation slice; both real MCP attempts returned `MCP error -32001: backend recycled; retry`.

---

## 4. SOURCE FILES

- Scenario [SC-001](../scorer_fusion/five_lane_fusion.md), fusion baseline.
- Feature [`scorer-fusion/ablation.md`](../../feature_catalog/scorer_fusion/ablation.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ablation.ts`.

---

## 5. SOURCE METADATA

- Group: Scorer Fusion
- Playbook ID: SC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: scorer-fusion/ablation.md
