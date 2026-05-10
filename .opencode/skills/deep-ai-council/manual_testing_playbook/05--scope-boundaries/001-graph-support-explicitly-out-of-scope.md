---
title: "DAC-011 -- Graph support explicitly out of scope"
description: "This scenario validates graph-support exclusion for DAC-011."
---

# DAC-011 -- Graph support explicitly out of scope

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-011`.

---

## 1. OVERVIEW

This scenario validates that graph support is only mentioned as an out-of-scope escape hatch.

### Why This Matters

The skill must not imply graph-backed council storage exists before the deferred phase ships.

---

## 2. SCENARIO CONTRACT

- Objective: Verify graph support is excluded.
- Real user request: Does the council write to graph storage yet?
- Prompt: `As a planning-only validator, verify graph support is excluded from the current council skill. Return the allowed interpretation.`
- Expected execution process: Grep SKILL.md for graph references and confirm they are out-of-scope language only.
- Expected signals: Graph references appear only in When NOT to Use, rules, success criteria, or integration caveats.
- Desired user-visible outcome: The user is told graph support is deferred.
- Pass/fail: PASS if graph is escape-hatch-only; FAIL if runtime graph tooling is described.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the exact graph grep.
2. Classify each hit as exclusion, caveat, or runtime integration.
3. Fail on any runtime integration claim.

### Prompt

`As a planning-only validator, verify graph support is excluded from the current council skill. Return the allowed interpretation.`

### Commands

1. `bash: rg -n "graph" .opencode/skills/deep-ai-council/SKILL.md`

### Expected

Graph hits are limited to escape-hatch or deferred-scope language.

### Evidence

Capture grep output and classification notes.

### Pass / Fail

- **Pass**: Graph support is explicitly out of scope.
- **Fail**: SKILL.md describes graph-backed runtime behavior.

### Failure Triage

Inspect Section 1, Section 4, and Section 7 for accidental runtime claims.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-011 | Graph exclusion | Verify graph support is deferred | `As a planning-only validator, verify graph support is excluded from the current council skill. Return the allowed interpretation.` | `bash: rg -n "graph" .opencode/skills/deep-ai-council/SKILL.md` | Only escape-hatch language | Grep output | PASS if no runtime graph integration | Inspect SKILL.md scope language |

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
- Feature file path: `05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md`
