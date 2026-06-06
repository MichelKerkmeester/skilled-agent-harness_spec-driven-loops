---
title: "CONV-003 -- Agreement Gate"
description: "This scenario validates the Agreement Gate for `CONV-003`. It focuses on agreementRate less than 0.50 triggering STOP_BLOCKED and the documented 1-seat pool warning."
---

# CONV-003 -- Agreement Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CONV-003`.

---

## 1. OVERVIEW

This scenario validates the Agreement Gate for `CONV-003`. It focuses on the agreement gate (`agreementRate < 0.50` → `STOP_BLOCKED`) enforced by `convergence.cjs --loop-type context`, the `config.agreementMin` (default 2) threshold for a finding to be agreement-eligible, and the documented warning that a 1-seat pool produces no agreement signal.

### Why This Matters

The agreement gate is the mechanism that prevents the loop from converging on single-executor (low-confidence) findings. A pool that only ever reports single-executor findings would have `agreementRate = 0` and would perpetually receive `STOP_BLOCKED` — a signal to the operator that the pool is too small for agreement to be meaningful, not a bug. Verifying this gate prevents false-confidence in single-model sweeps.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CONV-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify the agreement gate in convergence.cjs, the `agreementMin` default, and the documented 1-seat pool warning.
- Real user request: `Verify that deep-context blocks convergence when findings are not confirmed by multiple executor seats.`
- Prompt: `As a manual-testing orchestrator, validate the agreement gate contract for deep-context against convergence.cjs (via --loop-type context), convergence.md §4, and start-context-loop.md pool resolution notes. Verify convergence.cjs --loop-type context exits 0 with a parseable JSON output structure; convergence.md §4 shows agreementRate less than 0.50 as a STOP_BLOCKED condition; the command documents the 1-seat pool warning. Return a concise verdict.`
- Expected execution process: Run `node --check` on `convergence.cjs`; read convergence.md §4 for agreementRate STOP_BLOCKED condition; read `start-context-loop.md` for 1-seat pool warning; verify the `agreementRate < 0.50` threshold is documented.
- Expected signals: `node --check .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` exits 0; `convergence.md §4` lists `agreementRate < 0.50` as a STOP_BLOCKED condition; `start-context-loop.md` documents the 1-seat pool warning.
- Desired user-visible outcome: The loop does not converge when only a single executor has confirmed findings; the operator is warned when running a 1-seat pool that no agreement signal will be generated.
- Pass/fail: PASS if node --check exits 0 and convergence.md documents the agreementRate STOP_BLOCKED condition and command documents the 1-seat warning; FAIL if any element is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; run syntax check and grep reference docs.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CONV-003 | Agreement Gate | Verify agreementRate less than 0.50 triggers STOP_BLOCKED and 1-seat pool warning is documented | `Verify that deep-context blocks convergence when findings are not confirmed by multiple executor seats.` | 1. `node --check .opencode/skills/deep-loop-runtime/scripts/convergence.cjs` -> 2. `rg "agreementRate.*0.50\|agreementRate < 0\|agreement.*STOP_BLOCKED" .opencode/skills/deep-context/references/convergence.md` -> 3. `rg "1.seat\|one.seat\|single.*executor\|1-seat.*warn\|agreement.*warn" .opencode/commands/deep/start-context-loop.md .opencode/skills/deep-context/SKILL.md` -> 4. `rg "agreementMin.*2\|DEFAULT_AGREEMENT_MIN" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts .opencode/skills/deep-context/scripts/reduce-state.cjs` | Step 1: exits 0; Step 2: agreementRate STOP_BLOCKED condition found; Step 3: 1-seat pool warning found; Step 4: agreementMin default = 2 found in both files | Exit code from step 1; grep outputs from steps 2-4 | PASS if step 1 exits 0 and steps 2-4 all return matches; FAIL if agreementRate STOP_BLOCKED threshold or 1-seat warning is absent | 1. Confirm convergence.cjs path. 2. Check convergence.md §4 for the exact blocking condition text. 3. Search start-context-loop.md for "defeat" or "no agreement signal" wording. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/04--convergence-detection/agreement-gate.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | CLI entrypoint for `--loop-type context` evaluation |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | `CONTEXT_AGREEMENT_MIN = 2` constant and agreementRate computation |
| `.opencode/skills/deep-context/references/convergence.md` | §4: STOP_BLOCKED conditions including `agreementRate < 0.50` |
| `.opencode/commands/deep/start-context-loop.md` | Pool resolution notes with 1-seat pool warning |

---

## 5. SOURCE METADATA

- Group: Convergence Detection
- Playbook ID: CONV-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-detection/agreement-gate.md`
