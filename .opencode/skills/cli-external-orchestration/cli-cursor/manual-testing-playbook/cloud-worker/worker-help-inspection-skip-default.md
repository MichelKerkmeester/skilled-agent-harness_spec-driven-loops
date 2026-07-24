---
title: "CU-017 -- worker --help inspection (SKIP by default)"
description: "This scenario validates the cursor-agent worker subcommand's documented flag surface for `CU-017` via --help inspection only, per this phase's resolved document-and-SKIP-by-default policy for the cloud worker."
version: 1.0.0.0
---

# CU-017 -- worker --help inspection (SKIP by default)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-017`.

> **DOCUMENT-AND-SKIP BY DEFAULT**: `cursor-agent worker` connects to Cursor's cloud infrastructure and may have real account effects. Per this packet's resolved Open Question, the default execution path for this scenario is `--help` inspection ONLY - live registration is an explicitly-marked, opt-in variant, not exercised by default.

---

## 1. OVERVIEW

This scenario validates the `cursor-agent worker` subcommand's documented flag surface for `CU-017` via `--help` inspection only. It focuses on confirming the Kubernetes-style health probes, Prometheus metrics endpoint, and pool/label flags are genuinely present in the CLI's own help output.

### Why This Matters

`cursor-agent worker` is infra-grade remote execution - a private cloud worker connecting to Cursor's infrastructure to run agents in the operator's own environment - a fundamentally different shape from a single bounded `-p` prompt/response round trip, and a different shape again from `cli-devin`'s session-level `/handoff`. `references/cursor-tools.md` §3 explicitly scopes this out of the packet's runtime wiring; this scenario respects that same boundary by inspecting, not registering.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cursor-agent worker --help` documents the health-probe, metrics, and pool/label flags, without starting a real worker.
- Real user request: `What does Cursor's cloud worker subcommand actually expose? Don't start one, just tell me what it can do.`
- Prompt: `Confirm cursor-agent worker --help documents the Kubernetes-style health probes, /metrics, and pool/label flags, without starting a real worker.`
- Expected execution process: Operator runs `cursor-agent worker --help` and captures the output -> greps for the documented probe/metrics/pool/label/auth-token-file flags -> confirms no worker process was actually started as a side effect of viewing help text.
- Expected signals: `cursor-agent worker --help` exits 0. Help text names health-probe-related flags/endpoints (`healthz`/`readyz`-style), a `/metrics`-related mention, `--pool`/`--pool-name`, a labels flag, and `--auth-token-file`. No background `cursor-agent worker` process is left running after this scenario.
- Desired user-visible outcome: Confirmation the cloud-worker subcommand surface matches the documented contract, with the live registration path explicitly SKIPPED by default.
- Pass/fail: PASS if `--help` exits 0 and documents the named flags/probes, with the scenario's own verdict explicitly recorded as the intended default SKIP for the live-registration variant (SKIP here is the expected, correct outcome for the live path, not a failure). FAIL only if `--help` itself errors, or if the documented flags are absent from the real help output.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `cursor-agent worker --help` and capture the output.
2. Grep for health-probe, metrics, pool, label, and auth-token-file mentions.
3. Confirm no worker process was started (`ps` check for a lingering `cursor-agent worker` process).
4. Record the live-registration variant as explicitly SKIPPED for this run, naming the blocker ("connects to Cursor's cloud, real account effects - opt-in only, not exercised by default").
5. Return a PASS/FAIL verdict for the `--help` inspection, plus the documented SKIP for the live variant.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-017 | worker --help inspection (SKIP by default) | Verify worker --help documents the health-probe/metrics/pool surface without starting a real worker | `Confirm cursor-agent worker --help documents the Kubernetes-style health probes, /metrics, and pool/label flags, without starting a real worker.` | 1. `bash: cursor-agent worker --help > /tmp/cli-cursor-cu017-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu017-help.txt` -> 2. `bash: cat /tmp/cli-cursor-cu017-help.txt` -> 3. `bash: grep -iE "healthz\|readyz\|metrics\|pool\|label\|auth-token-file" /tmp/cli-cursor-cu017-help.txt` -> 4. `bash: ps aux \| grep "cursor-agent worker" \| grep -v grep` (expect no match - confirms no worker was started) | Step 1: exit 0; Step 2: help text captured; Step 3: at least the health-probe, metrics, pool, and auth-token-file terms are matched; Step 4: no lingering worker process found | `worker --help` output, grep matches for each documented flag category, process-list confirmation of no started worker | PASS if `--help` exits 0 AND documents the health-probe/metrics/pool/auth-token-file surface AND no worker process is running afterward; the live-registration variant is recorded as SKIP by design, not a failure; FAIL only if `--help` itself errors, or a documented flag category is genuinely absent from real help output | (1) Re-run `cursor-agent --version` to confirm the installed build; (2) re-check exact flag spelling against `references/cursor-tools.md` §3 if a grep misses; (3) if a worker process IS found running, terminate it and treat this as an unexpected side effect requiring investigation, not part of this scenario's intended default |

### Optional Supplemental Checks

- If an operator explicitly authorizes a live registration in a future run, that variant should be scoped as its own isolated, approved, opt-in extension of this scenario (mirroring `CU-010`'s destructive-variant pattern) - not the default execution path documented here.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary. Root §5 marks the live-registration variant as SKIP-by-default |
| `../../references/cursor-tools.md` (§3 Cloud Worker) | Documents the infra-grade shape and why it's out of scope for this packet's runtime wiring |
| `../../references/cli-reference.md` (§10 Subcommands) | Lists `cursor-agent worker` among the top-level subcommands |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cursor-tools.md` | §3 "What It Is" / "Why It's Out of Scope for This Packet's Runtime Wiring" |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin/implementation-summary.md` | Historical live citation of the worker subcommand's documented flags |

---

## 5. SOURCE METADATA

- Group: Cloud Worker
- Playbook ID: CU-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cloud-worker/worker-help-inspection-skip-default.md`
