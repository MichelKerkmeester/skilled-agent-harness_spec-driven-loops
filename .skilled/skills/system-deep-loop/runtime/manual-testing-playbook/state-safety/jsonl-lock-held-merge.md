---
title: "DLR-035 -- JSONL lock-held merge"
description: "Manual validation scenario for JSONL lock-held merge in the runtime/ skill."
version: 1.4.0.15
---

# DLR-035 -- JSONL lock-held merge

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-035`.

---

## 1. OVERVIEW

Adds a lock-held JSONL merge path for fan-out salvage so recovered events are deduplicated before atomic rewrite.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm JSONL lock-held merge behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate JSONL lock-held merge and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Merge dedupe, reread-under-lock behavior, atomic rewrite, and fanout-salvage integration tests.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/state-safety/jsonl-lock-held-merge.md`.

### Prompt

- Prompt: `Validate JSONL lock-held merge and report whether the current source, script surface, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `lib/deep-loop/jsonl-repair.ts` for the implementation contract.
2. Inspect `scripts/fanout-salvage.cjs` for the implementation contract.
3. Inspect `tests/unit/jsonl-repair.vitest.ts` for the matching regression coverage.
4. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
5. Capture the source lines and EXIT 0 test command output that prove the expected signals.
6. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

JSONL lock-held merge matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Evidence

- Source excerpts from `lib/deep-loop/jsonl-repair.ts`, `scripts/fanout-salvage.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/unit/jsonl-repair.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/jsonl-repair.ts` | JSONL lock-held merge for fan-out salvage. |
| `scripts/fanout-salvage.cjs` | JSONL lock-held merge for fan-out salvage. |

### Validation

| File | Role |
|---|---|
| `tests/unit/jsonl-repair.vitest.ts` | Primary regression coverage for JSONL lock-held merge. |

---

## 5. SOURCE METADATA

- Group: State safety
- Playbook ID: DLR-035
- Feature catalog entry: `feature-catalog/state-safety/jsonl-lock-held-merge.md`
- Scenario file path: `manual-testing-playbook/state-safety/jsonl-lock-held-merge.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//006-jsonl-lock-held-merge`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
