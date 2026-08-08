---
title: "CX-028 -- codex cloud dispatch"
description: "This scenario validates the codex cloud subcommand for `CX-028`. It focuses on confirming the cloud subcommand surface (auth + dispatch contract) is documented and reachable in the live binary."
version: 1.4.0.6
---

# CX-028 -- codex cloud dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-028`.

---

## 1. OVERVIEW

This scenario validates the `codex cloud` dispatch surface for `CX-028`. It focuses on confirming the `codex cloud` subcommand exists in the live binary, the help output documents the auth and dispatch contract and the SKILL.md surfaces `codex cloud` as a documented capability under §3 Unique Codex Capabilities.

### Why This Matters

The `codex cloud` subcommand is the documented remote-task-execution surface per cli-codex SKILL.md §3 Unique Codex Capabilities. Operators that need to offload long-running tasks rely on the cloud subcommand for unattended execution. If `codex cloud` is missing from the live binary or undocumented in the help output, the cloud-execution contract for cross-AI Codex dispatches is broken and operators have no entry point into the cloud surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-028` and confirm the expected signals without contradictory evidence.

- Objective: Verify `codex cloud` is a documented subcommand, `codex login status` is checked separately for shared authentication, the live cloud help exposes its current verbs, and SKILL.md references it.
- Real user request: `Confirm Codex cloud is wired up so I can offload a long task from my laptop later this week.`
- Prompt: `Confirm codex cloud is listed in help, check shared authentication with codex login status, inspect codex cloud --help for the current exec/status/list/apply/diff verbs, and confirm SKILL.md references codex cloud.`
- Expected execution process: Cross-AI orchestrator checks `codex --help` for `cloud` -> runs `codex login status` and preserves its raw output independently -> runs `codex cloud --help` and preserves raw output -> checks for the current cloud verbs -> greps SKILL.md for "codex cloud".
- Expected signals: `codex cloud --help` (or `codex --help` showing `cloud` subcommand) exits 0. `codex login status` is captured separately and classified from its own output. Cloud help exposes the current `exec`, `status`, `list`, `apply`, and `diff` verbs; it is not required to expose a cloud-local auth flag. SKILL.md mentions `codex cloud` at least once in §3.
- Desired user-visible outcome: Confirmation that the cloud subcommand is reachable end to end with a documented auth and dispatch contract operators can use for follow-up runs.
- Pass/fail: PASS if cloud is listed, cloud help exits 0, the current cloud verbs are present, shared `codex login status` output is retained, and SKILL.md references `codex cloud`. FAIL if the subcommand is missing, the cloud help is unclassifiable, or SKILL.md does not reference it.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Verify the live `codex` binary supports `codex cloud` via `codex --help` enumeration.
2. Run `codex login status` and capture its raw output separately.
3. Run `codex cloud --help` and capture its raw output.
4. Confirm the current cloud verbs appear in the help text; do not require cloud-local auth flags.
5. Grep cli-codex SKILL.md for `codex cloud` to confirm skill documentation.
6. Return a verdict naming the cloud verbs, shared login-status result, and SKILL.md anchor.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-028 | codex cloud dispatch | Verify codex cloud subcommand exists with current verbs, shared login status is separate, AND SKILL.md references it | `Confirm codex cloud is listed in help, check shared authentication with codex login status, inspect codex cloud --help for the current exec/status/list/apply/diff verbs, and confirm SKILL.md references codex cloud.` | 1. `bash: codex --help 2>&1 \| grep -ciE 'cloud' > /tmp/cli-codex-cx028-cloud-listed.txt && cat /tmp/cli-codex-cx028-cloud-listed.txt` -> 2. `bash: codex login status > /tmp/cli-codex-cx028-login-status.txt 2>&1; printf 'login status exit: %s\n' "$?"` -> 3. `bash: codex cloud --help > /tmp/cli-codex-cx028-help.txt 2>&1; printf 'cloud help exit: %s\n' "$?"` -> 4. `bash: grep -ciE '(^|[[:space:]])(exec|status|list|apply|diff)([[:space:]]|$)' /tmp/cli-codex-cx028-help.txt` -> 5. `bash: grep -ciE 'codex cloud' .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Step 1: cloud appears in `codex --help` (count >= 1); Step 2: raw shared login-status output and exit are captured; Step 3: cloud help output and exit 0 are captured; Step 4: the current cloud verb set is present; Step 5: SKILL.md mentions `codex cloud` (count >= 1) | `/tmp/cli-codex-cx028-cloud-listed.txt`, `/tmp/cli-codex-cx028-login-status.txt`, `/tmp/cli-codex-cx028-help.txt`, terminal grep counts | PASS if cloud is listed, `codex cloud --help` exits 0, the current cloud verbs are documented, shared login status is captured, and SKILL.md references codex cloud; FAIL if any check misses | (1) If cloud is missing from `codex --help`, run `codex --version` and classify the binary surface; (2) if cloud help exits non-zero, preserve stderr and confirm the subcommand spelling; (3) classify authentication from `codex login status`, not from cloud help; (4) if SKILL.md does not reference codex cloud, the documentation drifted |

### Optional Supplemental Checks

If auth tokens are configured, dispatch a small benign cloud task and verify the response surfaces a remote session id distinct from local sessions. Live cloud execution is operator-environment-dependent and is out of scope for the playbook baseline. The baseline test validates documentation and CLI surface contract.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` | Subcommand reference |
| `../../references/codex-tools.md` | Unique Codex capability table |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` (line 263) | Documents `codex cloud` in §3 Unique Codex Capabilities |
| `../../references/cli-reference.md` | Subcommand contract |

---

## 5. SOURCE METADATA

- Group: Codex Cloud
- Playbook ID: CX-028
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `codex-cloud/codex-cloud-dispatch.md`
