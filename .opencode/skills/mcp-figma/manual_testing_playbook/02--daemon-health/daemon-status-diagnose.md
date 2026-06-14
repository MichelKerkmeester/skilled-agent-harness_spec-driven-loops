---
title: "DAEMON-001 -- Daemon Status And Diagnose"
description: "This scenario validates daemon health for `DAEMON-001`. It focuses on reporting the local HTTP daemon on 127.0.0.1:3456 read-only while never exposing the daemon token."
---

# DAEMON-001 -- Daemon Status And Diagnose

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAEMON-001`.

---

## 1. OVERVIEW

This scenario validates daemon health for `DAEMON-001`. It focuses on confirming the daemon health verbs (`daemon status`, `daemon diagnose`) report the local HTTP daemon on `127.0.0.1:3456` and that the daemon token is never exposed in output.

### Why This Matters

The daemon is a local HTTP server on `127.0.0.1:3456`, authed with `X-Daemon-Token` from `~/.figma-ds-cli/.daemon-token`. Two risks live here: leaking the token into evidence, and "fixing" an Unauthorized result by deleting the token instead of diagnosing and restarting. The health verbs are read-only and must stay that way; recovery is diagnose then restart, never token deletion.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `DAEMON-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm daemon health is verifiable read-only and the token stays private and localhost-bound
- Real user request: `Check the Figma CLI daemon health.`
- Prompt: `Check the Figma CLI daemon health.`
- Expected execution process: run `daemon status`, and `daemon diagnose` if status is unhealthy; never auto-delete the token and never paste it into output
- Expected signals: `daemon status` reports a reachable daemon on `127.0.0.1:3456`; `diagnose` (if run) reports a clear cause; the token at `~/.figma-ds-cli/.daemon-token` is never printed; for an "Unauthorized" result the path is diagnose then restart, not token deletion
- Desired user-visible outcome: the agent reports daemon health and a recovery path without exposing the token
- Pass/fail: PASS if health was reported read-only AND the token was never printed AND no token was auto-deleted; FAIL if the token appeared in output OR the recovery deleted the token

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. The health check stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Never paste the daemon token (`~/.figma-ds-cli/.daemon-token`) into any evidence. Run only read/health verbs unless health repair is required and explicitly stated.

1. `figma-ds-cli daemon status`  # -> daemon reachable on `127.0.0.1:3456` or a clear unreachable result
2. `figma-ds-cli daemon diagnose` (only if unhealthy)  # -> names the cause
3. agent reports health + recovery  # -> diagnose/restart/reconnect, never token deletion

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAEMON-001 | Daemon status/diagnose | Verify daemon health is reported read-only and the token is never exposed | `Check the Figma CLI daemon health.` | 1. `figma-ds-cli daemon status` -> 2. `figma-ds-cli daemon diagnose` (only if unhealthy) -> 3. agent reports health + recovery | Step 1: daemon reachable on `127.0.0.1:3456` or a clear unreachable result. Step 2: diagnose names the cause. Step 3: recovery is diagnose/restart/reconnect, never token deletion | Token-redacted transcript of `daemon status` (and `diagnose` if run) | PASS if health was reported read-only AND the token was never printed AND no token was auto-deleted. FAIL if the token appeared in output OR the recovery deleted the token | 1. Confirm only read/health verbs ran (no `daemon stop/restart` unless health required it and it was stated). 2. Confirm the token never appeared in evidence. 3. Confirm the endpoint was `127.0.0.1:3456`. |

### Optional Supplemental Checks

If the daemon is idle past ~60 minutes or after a reboot it will not be present (it is not reboot-persistent); confirm the agent treats a missing daemon as an expected state with a reconnect/restart recovery rather than an error to paper over.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/01--connect-and-daemon/connect-and-daemon.md` | Feature-catalog source describing the daemon model and token handling |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../scripts/daemon.sh` | Daemon status/health helper |
| `../../references/troubleshooting.md` | Unauthorized recovery (diagnose then restart, not token deletion) |

---

## 5. SOURCE METADATA

- Group: Daemon Health
- Playbook ID: DAEMON-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--daemon-health/daemon-status-diagnose.md`
