---
title: "CX-008 -- explicit approval policies"
description: "This scenario validates the current Codex approval policies for `CX-008`, with headless never and TTY-only untrusted/on-request checks."
version: 1.4.0.8
---

# CX-008 -- explicit approval policies

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-008`.

---

## 1. OVERVIEW

This scenario validates the current approval-policy variants for `CX-008`. It scores headless `-a never` and keeps `untrusted` and `on-request` as interactive TTY-only checks. The removed `--full-auto` spelling is not a valid `codex exec` invocation.

### Why This Matters

The top-level `-a`/`--ask-for-approval` flag controls how aggressively Codex pauses for human input. For headless work, use `-a never` before `exec` or `-c approval_policy=never`; `untrusted` and `on-request` require a TTY when the task can trigger approval.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify the headless `-a never` policy runs without approval prompts and document the TTY-only behavior of `untrusted` and `on-request`.
- Real user request: `Show me how the four approval modes actually behave when I dispatch the same trivial task four times.`
- RCAF Prompt: `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator validating current approval-policy variants, run the same small generation task headlessly with top-level -a never before exec, then test -a untrusted and -a on-request only in a TTY. All invocations use --model gpt-5.6-luna -c service_tier="fast". Verify the headless path needs no human input; record approval prompts for the two TTY paths, or record SKIP when stdin is not a terminal. Return a verdict mapping the three current variants to their observed behavior.`
- Expected execution process: Operator pre-creates three target temp files -> dispatches the write-bearing headless `-a never` path through an authorized child -> records whether the two TTY-only variants prompt for approval -> records SKIP for those subchecks when stdin is not a terminal -> compiles a 3-row mapping table.
- Expected signals: The headless `-a never` invocation exits 0 and produces no approval prompt. The `untrusted` and `on-request` variants are launched with top-level `-a` in a TTY and their prompts are recorded; without a TTY, each is SKIP. Dispatch evidence shows `-a` before `exec` for the headless path.
- Desired user-visible outcome: A verified mapping of approval-policy flags to observed runtime behavior so operators can pick the right mode for unattended vs interactive scenarios.
- Pass/fail: PASS if the headless `never` path exits 0 without an approval prompt and the two interactive variants are each observed in a TTY or explicitly recorded as SKIP when no TTY exists, with a 3-row mapping. FAIL if the headless path prompts unexpectedly, the top-level flag is placed after `exec`, or the mapping is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create three target temp files.
2. Dispatch the headless `-a never` variant through an authorized child.
3. In a TTY, launch `-a untrusted` and `-a on-request` with workspace-write; otherwise record both subchecks as SKIP.
4. Compile a 3-row mapping table: variant -> observed prompt behavior -> exit code or SKIP.
5. Return a verdict naming the three current variants and their behavior.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-008 | explicit approval policies | Verify the headless never policy and TTY-only approval policies behave as documented | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator validating current approval-policy variants, run the same small generation task headlessly with top-level -a never before exec, then test -a untrusted and -a on-request only in a TTY. All invocations use --model gpt-5.6-luna -c service_tier="fast". Verify the headless path needs no human input; record approval prompts for the two TTY paths, or record SKIP when stdin is not a terminal. Return a verdict mapping the three current variants to their observed behavior.` | 1. `bash: rm -rf /tmp/cli-codex-cx008 && mkdir -p /tmp/cli-codex-cx008` -> 2. `AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex -a never exec --model gpt-5.6-luna -c model_reasoning_effort="low" -c service_tier="fast" --sandbox workspace-write "Spec folder: /tmp/cli-codex-cx008 (pre-approved, skip Gate 3). Write 'variant-never' to /tmp/cli-codex-cx008/v1.txt." > /tmp/cli-codex-cx008-v1.log 2>&1` -> 3. `TTY-only: AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex -a untrusted -c model_reasoning_effort="low" -c service_tier="fast" -c sandbox_mode="workspace-write"` and paste `Write 'variant-untrusted' to /tmp/cli-codex-cx008/v2.txt.` -> 4. `TTY-only: AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 codex -a on-request -c model_reasoning_effort="low" -c service_tier="fast" -c sandbox_mode="workspace-write"` and paste `Write 'variant-onrequest' to /tmp/cli-codex-cx008/v3.txt.` -> 5. `bash: printf 'headless: '; cat /tmp/cli-codex-cx008/v1.txt 2>/dev/null; printf '\nTTY variants: record observed output or SKIP when stdin is not a terminal\n' > /tmp/cli-codex-cx008-summary.txt` | Step 1: temp dir empty; Step 2: headless `-a never` exits 0 and writes v1; Steps 3-4: TTY prompts are observed or recorded as SKIP without a TTY; Step 5: summary contains the headless result and TTY/SKIP records | Headless log, the summary file, TTY transcripts or SKIP records, dispatched command lines, exit codes | PASS if the headless never variant writes its file without a prompt, the two TTY variants are observed or SKIP without a TTY, AND the mapping matches documented behavior; FAIL if the headless path prompts unexpectedly or the mapping is missing | (1) Re-run with `2>&1 \| tee` for stderr inline; (2) confirm operator handled any approval prompts in the two TTY subchecks; (3) check exit codes via `echo $?` after each invocation |

### Optional Supplemental Checks

- Inject a deliberately approval-triggering action (e.g., touching a sensitive-looking path) in variant 3 (`on-request`) and confirm Codex requests approval before proceeding.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §4 ALWAYS rule 3) | Documents top-level `-a` approval policies and the headless `never` form |
| `../../references/cli-reference.md` (§4 Approval Mode Values) | Documents the three `--ask-for-approval` values |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | §4 Approval Mode Values + Sandbox Mode Values |
| `../../references/codex-tools.md` | §5 Approval Modes table |

---

## 5. SOURCE METADATA

- Group: Sandbox Modes
- Playbook ID: CX-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `sandbox-modes/approval-policies.md`
