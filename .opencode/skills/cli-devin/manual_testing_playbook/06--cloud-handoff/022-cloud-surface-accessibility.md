---
title: "DV-027 -- Cloud surface accessibility (shell-runnable surface check)"
description: "This scenario validates that `devin cloud --help` returns the cloud subcommand surface (drs — Declarative Repo Setup), confirming the operator's account has basic cloud access. Replaces the shell-runnable half of DV-018 (which is now reserved for the operator-driven async round trip)."
---

# DV-027 -- Cloud surface accessibility (shell-runnable surface check)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-027`.

---

## 1. OVERVIEW

This scenario validates `devin cloud` surface accessibility for `DV-027`. The shell-runnable half of cloud handoff: confirm that `devin cloud --help` returns the documented subcommand list (`drs` — Declarative Repo Setup — environment blueprints, sandbox sessions, builds) without an entitlement error. The full async round-trip (laptop close → PR return) remains operator-driven and is covered by DV-018.

### Why This Matters

Before an operator attempts the multi-hour `DV-018` cloud handoff round-trip, they need to know whether the cloud surface is reachable on their account. `DV-027` answers that in seconds: surface help is reachable on Codeium / Windsurf basic Pro per the v1.0.2.0 wave-2 run. Operators on a more constrained tier can fail this scenario early and SKIP DV-018 with documented entitlement-blocker evidence rather than spend hours discovering the same gap.

### v1.0.2.0 Origin Note

DV-027 is a v1.0.2.0 split-off from DV-018. The v1.0.0.0 / v1.0.1.0 DV-018 scenario conflated "surface accessible" (seconds, shell-runnable) with "full async round trip" (multi-hour, operator-driven). Splitting them lets the cheap shell test stand on its own; DV-018 keeps the expensive operator-driven half.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin cloud --help` returns the cloud subcommand surface, signalling the operator's account has basic cloud-surface reachability.
- Real user request: `Before I attempt a cloud handoff, confirm my account can even see the cloud surface.`
- Prompt: `Run devin cloud --help. Verify it returns subcommand help (drs at minimum) and exits 0. Capture the subcommand list as evidence.`
- Expected execution process: Operator runs `devin cloud --help` -> captures stdout -> confirms `drs` subcommand is listed -> records exit code.
- Expected signals: Exit 0. Stdout contains "Usage: devin cloud <COMMAND>" and at least one subcommand entry naming `drs`.
- Desired user-visible outcome: A quick yes/no on whether the operator's tier includes cloud surface reachability. If yes, DV-018 round-trip is worth attempting. If no, DV-018 SKIP with documented entitlement blocker.
- Pass/fail: PASS if exit 0 AND output names `drs`. FAIL if exit non-zero or output is a missing-entitlement error.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `devin cloud --help` and capture stdout + exit code.
2. Confirm `drs` subcommand is listed.
3. Optionally: run `devin cloud drs --help` for the next-level subcommand surface.
4. Return a PASS/FAIL verdict naming the subcommands visible and the operator's account tier.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-027 | Cloud surface accessibility (shell-runnable) | Verify `devin cloud --help` returns the cloud subcommand surface | `Run devin cloud --help. Verify it returns subcommand help (drs at minimum) and exits 0. Capture the subcommand list as evidence.` | 1. `devin cloud --help > /tmp/dv-027-cloud-help.log 2>&1; echo "Exit: $?"` -> 2. `bash: grep -E 'drs\|Manage Declarative' /tmp/dv-027-cloud-help.log` -> 3. (optional) `devin cloud drs --help > /tmp/dv-027-drs-help.log 2>&1` | Step 1: exit 0; Step 2: `drs` subcommand listed | Captured help output, exit code, terminal transcript | PASS if exit 0 AND `drs` listed; FAIL if exit non-zero OR if output is a missing-entitlement error | (1) Check operator's Devin account tier via `app.devin.ai`; (2) verify auth status: `devin auth status`; (3) if `drs` not listed, the surface may have rotated — check `devin cloud --help` directly |

### Optional Supplemental Checks

- Run `devin cloud drs --help` for next-level subcommand visibility (environment blueprints, sandbox sessions, builds).
- Compare against the operator's Devin web UI (`app.devin.ai`) to confirm the surface matches the account capability.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map — `devin cloud` rows) | Documents `devin cloud` and `devin cloud drs` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Subcommand surface (cloud handoff narrative) |
| `../../references/cloud_handoff.md` | Full cloud handoff narrative + 5-check gate |
| `002-cloud-handoff-roundtrip.md` | DV-018 paired scenario (operator-driven manual round-trip) |

---

## 5. SOURCE METADATA

- Group: Cloud Handoff
- Playbook ID: DV-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cloud-handoff/022-cloud-surface-accessibility.md`
