---
title: "JEV-021 -- Auth status reports the key state without printing it"
description: "Confirm `auth status` reports whether a key is stored, and `auth test` proves acceptance, for `JEV-021`."
version: 1.0.0.1
---

# JEV-021 -- Auth status reports the key state without printing it

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-021`.

---

## 1. OVERVIEW

The two credential commands are read for what they report and what they withhold. `auth status` answers whether a key is stored; `auth test` answers whether it is accepted. Neither may print the value.

### Why This Matters

A status command that printed the key would make every operator check a rotation event. The distinction between stored and accepted is also load-bearing: a key can be present and rejected, which is an operator rotation step rather than a retry.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the credential commands report key state without a value, and that the unauthenticated half is observed while the authenticated half needs a stored key.
- Real user request: `Tell me whether a Jev credential is stored here, without printing it.`
- Prompt: `jev auth status`
- Expected execution process: run the command sequence in §3 from the repository root, capture stdout, stderr and the exit status for each command separately, then judge the results against the pass/fail criteria below.
- Expected signals: with a resolving key, `status` prints `ok`, `stored` and a store path at exit 0, and `test` prints `ok`, `valid` and a model id at exit 0; without one, exit `3` with the credential error on stderr and stdout empty; no command prints a key value.
- Evidence: The three commands, complete stdout and stderr for each, the exit codes, and the statement that no key value appeared.
- Desired user-visible outcome: the stored-versus-accepted distinction with the exit codes that carry it.
- Pass/fail: PASS when both commands report state without a value and the exit codes match the configured state; FAIL when a key value appears in either stream, or when a success is reported while considered key checks exit 3; SKIP when no credential is stored — the missing provider credential is the blocker, and the unauthenticated half is still observed and recorded.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr and the exit status separately for each command.
5. Judge the results against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
jev auth status
jev auth status --provider vercel
jev auth test
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-021 | Auth status | Confirm the credential commands report key state without a value, and that the unauthenticated half is observed while the authenticated half needs a stored key | `jev auth status` | 1. `jev auth status` -> 2. `jev auth status --provider vercel` -> 3. `jev auth test` | With a resolving key, `status` prints `ok`, `stored` and a store path at exit 0, and `test` prints `ok`, `valid` and a model id at exit 0; without one, exit `3` with the credential error and stdout empty; no command prints a key value | The three commands, complete stdout and stderr for each, the exit codes, and the statement that no key value appeared | PASS when both commands report state without a value and the exit codes match the configured state; FAIL when a key value appears in either stream, or when a success is reported while considered key checks exit 3; SKIP when no credential is stored — the missing provider credential is the blocker | Exit 3 with `status` reporting stored is the stale-key state: the stored value is empty or the credential file is malformed, and the operator step is to store it again rather than to retry. A printed value is a rotation event |

### Recorded Result

Verdict PASS. Unauthenticated half, observed during the phase-001 pin with every provider key variable cleared: exit 3 with the credential error and empty stdout for `status`, `test` and the `--provider` variant alike. Authenticated half, observed after the operator stored an `official` key in the credential store: `jev auth status` → exit 0, `{"ok": true, "stored": true, "store": "$HOME/.config/jev-cli/credentials.json"}`; `jev auth status --provider vercel` → exit 3, `{"ok": false, "error": "stored vercel API key is empty"}` — once a store exists, an absent provider is reported as empty rather than as not stored, which the source fixes at `src/jev_cli/__init__.py:99`; `jev auth test` → exit 0, `{"ok": true, "valid": true, "model": "jev-1.13.0"}`. No stream carried a key value. Recorded in the authenticated verification report under `benchmark/reports/`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `providers/auth-status-reports-key-state.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [providers-and-models.md](../../references/providers-and-models.md) | The store location, the key resolution order and the per-provider variable names |
| [cli-reference.md](../../references/cli-reference.md) | The `auth` subcommand surface |

---

## 5. SOURCE METADATA

- Group: Providers
- Playbook ID: JEV-021
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `providers/auth-status-reports-key-state.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
