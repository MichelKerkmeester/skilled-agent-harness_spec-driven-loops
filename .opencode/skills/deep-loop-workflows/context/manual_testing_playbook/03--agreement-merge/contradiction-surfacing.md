---
title: "MERGE-003 -- Contradiction Surfacing"
description: "This scenario validates Contradiction Surfacing for `MERGE-003`. It focuses on detecting and recording incompatible seat assertions for the same unit_id and surfacing them in the registry and dashboard — never auto-resolved."
---

# MERGE-003 -- Contradiction Surfacing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MERGE-003`.

---

## 1. OVERVIEW

This scenario validates Contradiction Surfacing for `MERGE-003`. It focuses on `detectContradictions()` in `reduce-state.cjs` detecting when two or more producers assert incompatible `signature` or `reuse` verbs for the same `unit_id`, recording the contradiction in the `contradictions` array of the registry, and rendering it in the dashboard's "CONTRADICTIONS" section — without silently resolving it.

### Why This Matters

Silent contradiction resolution would hide the case where two models fundamentally disagree on what a function's contract is (e.g., one says "extend" and another says "wrap"). The operator needs to see both sides to make an informed planning decision. Auto-resolving by majority vote would make the context report appear more certain than it actually is.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MERGE-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `detectContradictions` in `reduce-state.cjs` surfaces incompatible signature or reuse assertions and that the dashboard renders them in a dedicated section.
- Real user request: `Verify that when two executor seats disagree on a function's contract, the contradiction is visible in the registry and dashboard rather than silently resolved.`
- Prompt: `As a manual-testing orchestrator, validate the contradiction surfacing contract for deep-context against reduce-state.cjs, loop_protocol.md §6, and the dashboard rendered by the reducer. Verify detectContradictions() in reduce-state.cjs surfaces incompatible signatureByProducer or reuseByProducer values for the same unit_id, the contradictions array is present in findings-registry.json, and the dashboard section renders all active contradiction pairs. Return a concise verdict.`
- Expected execution process: Read reduce-state.cjs for `detectContradictions`, `signatureByProducer`, `reuseByProducer`; read `renderDashboard` for contradiction section; read loop_protocol.md §6 for the "never silently resolved" invariant.
- Expected signals: `detectContradictions` function is exported from reduce-state.cjs; `signatureByProducer` and `reuseByProducer` are the contradiction fields; `contradictions` array in registry; "CONTRADICTIONS" section heading in `renderDashboard`; loop_protocol.md §6 states contradictions are never silently resolved.
- Desired user-visible outcome: When two seats report incompatible contracts for the same `file:symbol`, the host surfaces both sides in the dashboard for operator review rather than choosing one silently.
- Pass/fail: PASS if `detectContradictions` is exported, the contradiction fields exist, and the dashboard section is rendered; FAIL if any element is absent or contradictions are auto-resolved.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep reduce-state.cjs and loop_protocol.md.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MERGE-003 | Contradiction Surfacing | Verify contradiction detection and dashboard rendering without auto-resolution | `Verify that when two executor seats disagree on a function's contract, the contradiction is visible in the registry and dashboard rather than silently resolved.` | 1. `rg "detectContradictions" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 2. `rg "signatureByProducer\|reuseByProducer\|contradictions" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 3. `rg "CONTRADICTIONS\|contradictions" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` -> 4. `rg "never.*resolv\|not.*resolv\|silently" .opencode/skills/deep-loop-workflows/context/references/protocol/loop_protocol.md` | Step 1: detectContradictions found; Step 2: per-producer fields and contradictions array found; Step 3: dashboard section heading found; Step 4: "never silently resolved" invariant found | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if detectContradictions is missing or contradictions array is absent | 1. Confirm detectContradictions is in module.exports. 2. Check renderDashboard for the exact contradiction section heading. 3. Search loop_protocol.md for "CONTRADICTS" edge documentation. |

### Optional Supplemental Checks

Verify that the `contradictions` key is part of `module.exports` in reduce-state.cjs:

```bash
rg "module\.exports" .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/03--agreement-merge/contradiction-surfacing.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs` | `detectContradictions`, `signatureByProducer`, `reuseByProducer`, `renderDashboard` contradiction section |
| `.opencode/skills/deep-loop-workflows/context/references/protocol/loop_protocol.md` | §6: contradiction surfacing rule and CONTRADICTS edge documentation |

---

## 5. SOURCE METADATA

- Group: Agreement Merge
- Playbook ID: MERGE-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--agreement-merge/contradiction-surfacing.md`
