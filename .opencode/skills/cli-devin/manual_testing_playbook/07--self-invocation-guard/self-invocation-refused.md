---
title: "DV-019 -- Self-invocation refused (DEVIN_* env or ancestry)"
description: "This scenario validates that the cli-devin self-invocation guard refuses to load when the calling AI is itself a local devin session — detected via DEVIN_* env vars OR devin in process ancestry."
---

# DV-019 -- Self-invocation refused (DEVIN_* env or ancestry)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-019`.

---

## 1. OVERVIEW

This scenario validates the self-invocation guard from SKILL.md §2 for `DV-019`. The guard refuses to load when the calling AI is itself a local `devin` session, detected via three layers: `DEVIN_*` env vars, `devin` in process ancestry, or a Devin session lockfile.

### Why This Matters

Self-invocation creates a circular dispatch loop, burns Devin units, and can cause silent confusion about which session output is which. The guard is the cli-devin analog of cli-opencode's ADR-001 layered detection. This scenario is on the critical-path list (§5 of the root playbook).

**v1.0.2.0 SKIP RATIONALE (reaffirmed)**: This is an **operator-runnable manual test of cli-devin's smart-router logic**, NOT a shell-automatable binary test. The self-invocation guard runs at the calling-AI orchestrator layer (cli-devin's SKILL.md §2 pseudocode is executed by the AI loading the skill, not by the `devin` binary which has no concept of the guard). Wave-2 confirmed there is no shell-only way to test this — only an actual calling-AI session that loads cli-devin under simulated `DEVIN_*` env can demonstrate the refusal. Operators can validate manually by setting `DEVIN_SESSION_ID=test` in an orchestrator's environment and observing whether cli-devin refuses to load. This SKIP is the correct disposition, not a deferred fix.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the self-invocation guard refuses to dispatch when `DEVIN_*` env is set OR when `devin` is in process ancestry.
- Real user request: `Test the self-invocation guard by simulating a local devin session — I want to confirm cli-devin refuses to dispatch from inside a Devin session.`
- Prompt: `Simulate a local devin session by setting DEVIN_SESSION_ID=test in the environment, then attempt to load cli-devin and dispatch. Verify the guard refuses with the documented error message.`
- Expected execution process: Operator simulates a local Devin session by exporting `DEVIN_SESSION_ID=test` -> attempts to load cli-devin -> the guard probes the env var -> refuses to dispatch with the documented refusal message -> no `devin` invocation occurs.
- Expected signals: With `DEVIN_*` env set, the calling AI's cli-devin skill refuses to dispatch. The refusal message names the detection signal (env var). No `devin` invocation is dispatched.
- Desired user-visible outcome: Evidence that the self-invocation guard fails closed and refuses with a clear operator-facing message.
- Pass/fail: PASS if the guard refuses AND the refusal message names the detection signal AND no dispatch occurred. FAIL if the guard allows dispatch OR if the refusal message is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. From the calling AI's session, export `DEVIN_SESSION_ID=test` to simulate a local Devin session.
2. Attempt to load cli-devin and dispatch a small task.
3. Observe whether the guard refuses or allows the dispatch.
4. Capture the refusal message (if any).
5. Confirm no `devin` invocation was dispatched.
6. Unset the env var.
7. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-019 | Self-invocation refused (DEVIN_* env or ancestry) | Verify guard refuses to dispatch when DEVIN_* env set | `Simulate a local devin session by setting DEVIN_SESSION_ID=test in the environment, then attempt to load cli-devin and dispatch. Verify the guard refuses with the documented error message.` | 1. `bash: export DEVIN_SESSION_ID=test` -> 2. From the calling AI's session, request: `"Dispatch a small TypeScript hello-world generation via cli-devin"` -> 3. Observe whether the calling AI runs the self-invocation guard. -> 4. Capture the refusal output if the guard tripped. -> 5. `bash: ps aux \| grep '[d]evin --prompt' \| grep -v grep` (should return empty) -> 6. `bash: unset DEVIN_SESSION_ID` | Step 3: guard trips; Step 4: refusal message names the env-var detection; Step 5: no devin process running | Calling AI's output transcript, refusal message text, terminal ps snapshot, env var verification | PASS if guard refused AND message names detection signal AND no dispatch; FAIL if guard allowed dispatch OR if refusal message missing | (1) Verify SKILL.md §2 self-invocation guard pseudocode is enforced by the calling AI; (2) check `env \| grep DEVIN_` confirms the env var is set; (3) audit the calling AI's reasoning trace for skipping the guard |

### Optional Supplemental Checks

- Test Layer 2 (process ancestry): run the dispatch attempt under a parent shell named `devin` and confirm the guard trips on ancestry detection.
- Test Layer 3 (lockfile probe): create a `~/.config/devin/sessions/test/lock` file and verify the guard detects it.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§2 Self-Invocation Guard) | Authoritative guard contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §2 Self-Invocation Guard pseudocode |
| `../../references/integration_patterns.md` (§5) | Cross-CLI guard discipline |

---

## 5. SOURCE METADATA

- Group: Self-Invocation Guard
- Playbook ID: DV-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--self-invocation-guard/self-invocation-refused.md`
