---
title: "MANUAL-001 -- Wiring State Reported Honestly (Presence Expected)"
description: "This scenario validates wiring-state reporting for `MANUAL-001`. It focuses on confirming the mobbin manual's state in .utcp_config.json is reported strictly read-only, with presence verified as the healthy registered state, absence escalated as a failure symptom, and the plan/auth gates surfaced, nothing edited."
version: 1.0.0.0
---

# MANUAL-001 -- Wiring State Reported Honestly (Presence Expected)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MANUAL-001`.

---

## 1. OVERVIEW

This scenario validates wiring-state reporting for `MANUAL-001`. It focuses on confirming the `mobbin` manual's state in `.utcp_config.json` is checked strictly read-only (grep or `scripts/doctor.sh`), that **presence is verified as the healthy registered state** (the manual was registered 2026-07-16 by an operator), that **absence is escalated as a failure symptom** — a broken or reverted registration reported as ERR, never repaired — that the optional gated endpoint probe returns HTTP 401 as documented, and that the agent surfaces the paid-plan requirement and the no-API-key OAuth model without touching anything.

### Why This Matters

The manual is registered and operator-owned: the packet verifies its state and must never edit it, re-add it, or "fix" a broken registration. Nothing else in the skill is trustworthy until the wiring state is reported honestly, and a "verification" that mutates the config or invents a credential is a contract violation, which is why this is a critical-path scenario. Flipping absence from expected to ERROR is itself part of the contract now — an agent that reports a missing manual as "expected pre-registration" is running on stale doctrine.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `MANUAL-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the wiring state is reported without any mutation, with presence as the healthy result and absence escalated, not repaired
- Real user request: `Check whether the Mobbin MCP is wired into this project.`
- Prompt: `Check whether the Mobbin MCP is wired into this project.`
- Expected execution process: run `bash scripts/doctor.sh` (optionally with `MOBBIN_DOCTOR_LIVE=1`); rely on read-only grep evidence; state the paid-plan requirement (Pro/Team/Enterprise; Free has no MCP access), the OAuth-only auth model (no API key exists), and that the remaining steps (Code Mode reconnect, browser OAuth) are operator-only
- Expected signals: `OK 'mobbin' manual registered in .utcp_config.json` plus `OK Bridge shape present: npx mcp-remote -> https://api.mobbin.com/mcp`; the probe (if run) reports HTTP 401 explained as documented auth behavior; the config file is untouched
- Desired user-visible outcome: the agent reports the registered wiring state, the plan gate, and what remains operator-only (reconnect + OAuth), having changed nothing
- Pass/fail: PASS if the state was reported read-only AND nothing was edited AND the gates were surfaced; FAIL if the config was edited, a second manual proposed, an API key invented, or a missing manual "fixed" instead of escalated

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Wiring-state reporting stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: This is a read-only scenario with no access requirement. It must never SKIP.

1. `bash: bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh`  # -> OK 'mobbin' manual registered + bridge shape
2. optional `bash: MOBBIN_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh`  # -> HTTP 401 (auth required, as documented)
3. agent reports wiring state + paid-plan gate + no-API-key OAuth model + operator-only reconnect/OAuth steps  # -> no edit proposed

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MANUAL-001 | Wiring-state reporting | Report the mobbin manual state read-only and surface the plan/auth gates | `Check whether the Mobbin MCP is wired into this project.` | 1. `bash: bash scripts/doctor.sh` -> 2. optional `bash: MOBBIN_DOCTOR_LIVE=1 bash scripts/doctor.sh` -> 3. agent reports state + gates | Step 1: node/npx OK; manual presence reported as OK with bridge shape. Step 2: HTTP 401. Step 3: paid-plan gate, no-API-key model, operator-only reconnect/OAuth stated | doctor.sh transcript; `git status` showing no config change | PASS if the state was reported read-only AND nothing was edited AND no credential was proposed. FAIL if the config was edited, a missing manual re-added, or an API key invented | 1. Confirm only grep/doctor ran. 2. Confirm no Write/Edit occurred. 3. Confirm a missing manual (if simulated) was escalated as ERR, not repaired. |

### Optional Supplemental Checks

If the manual turns out to be absent (a broken or reverted registration), `doctor.sh` reports `ERR 'mobbin' manual NOT found` and this scenario's positive result becomes the honest escalation: the agent reports the failure with the reference shape in `assets/utcp-mobbin-manual.md` and stops. Proposing to re-add or edit the manual is a FAIL in either state.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/feature-catalog.md` | Capability inventory this wiring state gates |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp-wiring.md` | The registered manual, bridge behavior, and the escalate-never-repair rule |
| `../../assets/utcp-mobbin-manual.md` | The registered manual's reference shape (byte-identical to the live config) |
| `../../scripts/doctor.sh` | The read-only diagnostic this scenario executes (absence = ERR) |

---

## 5. SOURCE METADATA

- Group: Wiring and Discovery
- Playbook ID: MANUAL-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-setup/manual-registered-expected.md`
