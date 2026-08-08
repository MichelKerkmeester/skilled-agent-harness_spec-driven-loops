---
title: "CX-014 -- @debug profile (workspace-write fix)"
description: "This scenario validates the codex exec -p debug profile for `CX-014`. It focuses on confirming the debug profile applies a minimal fix and provides a root-cause explanation."
version: 1.4.0.9
---

# CX-014 -- @debug profile (workspace-write fix)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-014`.

---

## 1. OVERVIEW

This scenario validates the `codex exec -p debug` profile for `CX-014`. It focuses on confirming the `debug` profile routes to a workspace-write profile and applies a minimal fix to a deliberately broken throwaway file with a clear root-cause explanation.

### Why This Matters

`agent-delegation.md` §3 defines the `debug` profile as the fresh-perspective debugger to delegate to after 3+ failed attempts. The 4-phase Observe -> Analyze -> Hypothesize -> Fix methodology depends on the profile actually applying writes, not just emitting analysis. This scenario validates the profile's write capability end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex exec -p debug` routes to a workspace-write profile and applies a minimal fix to a deliberately broken throwaway file.
- Real user request: `I'm stuck on this off-by-one bug — hand it to the Codex debug profile.`
- RCAF Prompt: `Spec folder: /tmp/cli-codex-playbook-cx014 (pre-approved, skip Gate 3). As a cross-AI orchestrator handing off a stuck bug after 3+ failed attempts, FIRST create /tmp/cli-codex-playbook-cx014/broken.ts with a deliberate off-by-one bug, THEN dispatch through an authorized child with `AI_SESSION_CHILD=1` and `MK_SPEC_GATE_ENFORCE=0` using codex exec -p debug "Fix the off-by-one bug in @/tmp/cli-codex-playbook-cx014/broken.ts. Apply the minimal fix and explain root cause." with -c service_tier="fast" using the layered `debug.config.toml` profile in `CODEX_HOME`. Verify the dispatch routes via -p debug, the fix is applied to the file, the explanation cites the off-by-one nature, and Codex exits 0. Return a verdict naming the profile, the file path, and the root-cause sentence.`
- Expected execution process: Operator creates a disposable `CODEX_HOME/debug.config.toml` with `model = "gpt-5.6-luna"`, `model_reasoning_effort = "high"`, and `sandbox_mode = "workspace-write"` -> pre-creates a broken `.ts` file -> snapshots the file's pre-fix content -> dispatches `-p debug` through the authorized child with workspace-write -> verifies the file on disk no longer has the bug -> records the root-cause explanation.
- Expected signals: Pre-step writes a broken `.ts` file with an off-by-one error. `codex exec -p debug` exits 0. Stdout contains a root-cause explanation referencing "off-by-one". The file on disk no longer contains the off-by-one bug. Dispatch line includes `-p debug`.
- Desired user-visible outcome: A working corrected file plus a root-cause sentence the operator can paste into the bug ticket.
- Pass/fail: PASS if exit 0, the file on disk shows the bug fixed, the explanation mentions "off-by-one", AND `-p debug` is in the dispatched command. FAIL if any check misses.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create `/tmp/cli-codex-cx014-home/debug.config.toml` as a disposable layered profile fixture; do not edit the operator's `CODEX_HOME`.
2. Pre-create `/tmp/cli-codex-playbook-cx014/broken.ts` with a deliberate off-by-one bug (e.g., `for (let i = 0; i <= arr.length; i++)`).
3. Snapshot pre-fix file content.
4. Dispatch `-p debug` through the authorized child with `--sandbox workspace-write`.
5. Verify the file no longer has the off-by-one bug.
6. Confirm the explanation in stdout references "off-by-one".

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-014 | @debug profile (workspace-write fix) | Verify -p debug applies a minimal fix and provides a root-cause explanation | `Spec folder: /tmp/cli-codex-playbook-cx014 (pre-approved, skip Gate 3). As a cross-AI orchestrator handing off a stuck bug after 3+ failed attempts, FIRST create /tmp/cli-codex-playbook-cx014/broken.ts with a deliberate off-by-one bug, THEN dispatch through an authorized child with AI_SESSION_CHILD=1 and MK_SPEC_GATE_ENFORCE=0 using codex exec -p debug "Fix the off-by-one bug in @/tmp/cli-codex-playbook-cx014/broken.ts. Apply the minimal fix and explain root cause." with -c service_tier="fast" using the layered `debug.config.toml` profile in `CODEX_HOME`. Verify the dispatch routes via -p debug, the fix is applied to the file, the explanation cites the off-by-one nature, and Codex exits 0. Return a verdict naming the profile, the file path, and the root-cause sentence.` | 1. `bash: rm -rf /tmp/cli-codex-cx014-home /tmp/cli-codex-playbook-cx014 && mkdir -p /tmp/cli-codex-cx014-home /tmp/cli-codex-playbook-cx014 && cp "$HOME/.codex/auth.json" /tmp/cli-codex-cx014-home/ && printf 'model = "gpt-5.6-luna"\nmodel_reasoning_effort = "high"\nsandbox_mode = "workspace-write"\n' > /tmp/cli-codex-cx014-home/debug.config.toml && printf 'export function sumArray(arr: number[]): number {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n' > /tmp/cli-codex-playbook-cx014/broken.ts` -> 2. `bash: cp /tmp/cli-codex-playbook-cx014/broken.ts /tmp/cli-codex-cx014-pre.ts` -> 3. `AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 CODEX_HOME=/tmp/cli-codex-cx014-home codex exec -p debug -c service_tier="fast" --sandbox workspace-write "Spec folder: /tmp/cli-codex-playbook-cx014 (pre-approved, skip Gate 3). Fix the off-by-one bug in @/tmp/cli-codex-playbook-cx014/broken.ts. Apply the minimal fix and explain root cause." < /dev/null > /tmp/cli-codex-cx014.txt 2>&1` -> 4. `bash: diff /tmp/cli-codex-cx014-pre.ts /tmp/cli-codex-playbook-cx014/broken.ts` -> 5. `bash: grep -i "off.by.one" /tmp/cli-codex-cx014.txt` | Step 1: broken.ts created with `i <= arr.length`; Step 2: pre-fix snapshot saved; Step 3: exit 0; Step 4: diff shows the loop guard changed (e.g., `i <= arr.length` -> `i < arr.length`); Step 5: stdout references "off-by-one" | Pre-fix snapshot, post-fix file content, captured stdout, dispatched command line, diff output, exit code | PASS if exit 0, file diff shows the bug fixed, stdout references "off-by-one", AND `-p debug` is in the dispatched command; FAIL if any check misses | (1) Confirm `/tmp/cli-codex-cx014-home/debug.config.toml` is named exactly for `-p debug` and the child environment is present; (2) re-run with `2>&1 \| tee`; (3) inspect the post-fix file manually for any unrelated changes |

### Optional Supplemental Checks

- Compile the post-fix file with `bash: npx tsc --noEmit /tmp/cli-codex-playbook-cx014/broken.ts` to confirm syntactic validity.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/agent-delegation.md` (§3 @debug) | Documents the debug profile contract |
| `../../references/cli-reference.md` (§9 Configuration Files) | Profile config syntax |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | §3 @debug - Fresh Perspective Debugger |
| `$CODEX_HOME/debug.config.toml` | Layered settings that back `-p debug` |

---

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CX-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agent-routing/debug-profile.md`
