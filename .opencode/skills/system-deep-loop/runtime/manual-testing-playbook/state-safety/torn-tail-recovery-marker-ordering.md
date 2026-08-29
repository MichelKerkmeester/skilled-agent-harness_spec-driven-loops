---
title: "DLR-054 -- Torn-tail recovery marker ordering"
description: "Manual validation scenario for Torn-tail recovery marker ordering in the runtime/ skill."
version: 1.4.0.15
---

# DLR-054 -- Torn-tail recovery marker ordering

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-054`.

---

## 1. OVERVIEW

Writes the durable torn-tail recovery marker before renaming the torn frame into quarantine, and replays an interrupted move by digest match on restart.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Torn-tail recovery marker ordering behaves as documented and remains aligned with its implementation and tests.
- Layer partition: state safety runtime.
- Real user request: `Validate Torn-tail recovery marker ordering and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Recovery marker durable (fsynced) before the torn frame is renamed into quarantine, and a digest-verified replay completes an interrupted move on restart.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/state-safety/torn-tail-recovery-marker-ordering.md`.

### Prompt

- Prompt: `Validate Torn-tail recovery marker ordering and report whether the current source, script surface, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `lib/authorized-ledger/immutable-frame-store.ts` for the `quarantineTornTailUnlocked()` marker-before-rename ordering and the `readRecoveryEvidenceUnlocked()` replay branch.
2. Inspect `tests/unit/authorized-ledger.vitest.ts` for the matching crash-injection regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient:
   `./node_modules/.bin/vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts -t "completes an interrupted quarantine"`
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

Torn-tail recovery marker ordering matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Evidence

- Source excerpts from `lib/authorized-ledger/immutable-frame-store.ts` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/unit/authorized-ledger.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.
- The full `authorized-ledger.vitest.ts` file carries one unrelated pre-existing failure, `serializes concurrent processes into one contiguous unambiguous head` (a writer-lock reclaim race, a 30s timeout). It is not caused by this feature and is not fixed by it -- an operator running the whole file, rather than the scoped `-t` filter above, should expect that one failure and must not treat it as a regression in this feature.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/authorized-ledger/immutable-frame-store.ts` | torn-tail recovery marker ordering. |

### Validation

| File | Role |
|---|---|
| `tests/unit/authorized-ledger.vitest.ts` | Primary regression coverage for Torn-tail recovery marker ordering. |

---

## 5. SOURCE METADATA

- Group: State safety
- Playbook ID: DLR-054
- Feature catalog entry: `feature-catalog/state-safety/torn-tail-recovery-marker-ordering.md`
- Scenario file path: `manual-testing-playbook/state-safety/torn-tail-recovery-marker-ordering.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Source phase: `.opencode/specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/004-durable-write-boundaries`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
