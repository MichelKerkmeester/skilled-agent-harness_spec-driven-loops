---
title: "DAC-011 -- Graph support stays derived and scoped"
description: "This scenario validates derived graph-support boundaries for DAC-011."
---

# DAC-011 -- Graph support stays derived and scoped

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-011`.

---

## 1. OVERVIEW

This scenario validates that graph support is described as a derived projection, not as a replacement for packet-local council artifacts.

### Why This Matters

The skill must not imply council seats write graph storage directly or that graph rows replace append-only `ai-council-state.jsonl`.

---

## 2. SCENARIO CONTRACT

- Objective: Verify graph support is derived and scoped.
- Real user request: Does the council write to graph storage yet?
- Prompt: `As a planning-only validator, verify graph support remains a derived projection and not council-agent-owned state. Return the allowed interpretation.`
- Expected execution process: Grep SKILL.md and `references/integration/graph_support.md` for graph references and confirm source-of-truth boundaries.
- Expected signals: Graph references state that `ai-council/**` artifacts remain authoritative and graph updates use caller-owned `deep-loop-runtime` CLI tooling.
- Desired user-visible outcome: The user is told graph support is available only as a derived runtime CLI projection.
- Pass/fail: PASS if graph is derived/scoped; FAIL if council seats directly mutate graph storage or graph rows replace artifacts.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the exact graph grep.
2. Classify each hit as derived projection, source-of-truth boundary, or unsafe direct mutation.
3. Fail on any claim that graph rows replace artifacts or council seats mutate graph storage directly.

### Prompt

`As a planning-only validator, verify graph support remains a derived projection and not council-agent-owned state. Return the allowed interpretation.`

### Commands

1. `bash: rg -n "graph" .opencode/skills/deep-ai-council/SKILL.md`

### Expected

Graph hits describe derived projection boundaries, caller-owned runtime CLI tools, and artifact source-of-truth rules.

### Evidence

Capture grep output and classification notes.

### Pass / Fail

- **Pass**: Graph support is derived, scoped, and artifact-authoritative.
- **Fail**: SKILL.md describes council-seat-owned graph mutation or graph rows as authoritative state.

> **Functional graph coverage:** This scenario is a textual boundary check only. Functional behavior of the `deep-loop-runtime --loop-type council` CLI (idempotent upsert, self-loop rejection, empty no-op, hostile metadata redaction, five query modes, three convergence buckets, recovery payload, replay, and MCP-surface removal) is exercised by DAC-019..DAC-026 in `08--council-graph-integration/`.

### Failure Triage

Inspect Section 1, Section 4, Section 7, and `references/integration/graph_support.md` for unsafe source-of-truth claims.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-011 | Graph boundary | Verify graph support is derived and scoped | `As a planning-only validator, verify graph support remains a derived projection and not council-agent-owned state. Return the allowed interpretation.` | `bash: rg -n "graph" .opencode/skills/deep-ai-council/SKILL.md .opencode/skills/deep-ai-council/references/integration/graph_support.md` | Derived projection and artifact source-of-truth language | Grep output | PASS if no council-seat-owned graph mutation | Inspect SKILL.md and graph_support.md scope language |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-ai-council/SKILL.md` | Skill scope rules |

---

## 5. SOURCE METADATA

- Group: SCOPE BOUNDARIES
- Playbook ID: DAC-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--scope-boundaries/graph-support-derived-and-scoped.md`
