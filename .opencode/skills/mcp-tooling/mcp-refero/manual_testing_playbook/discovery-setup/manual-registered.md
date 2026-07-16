---
title: "MANUAL-001 -- Manual Verified Read-Only"
description: "This scenario validates wiring verification for `MANUAL-001`. It focuses on confirming the refero manual is verified present in .utcp_config.json strictly read-only, with the plan and auth gates surfaced and nothing edited."
version: 1.0.0.0
---

# MANUAL-001 -- Manual Verified Read-Only

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MANUAL-001`.

---

## 1. OVERVIEW

This scenario validates wiring verification for `MANUAL-001`. It focuses on confirming the `refero` manual is verified present in `.utcp_config.json` strictly read-only (grep or `scripts/doctor.sh`), that the optional gated endpoint probe returns HTTP 401 as documented, and that the agent surfaces the Pro-plan requirement and the operator-only OAuth step without touching anything.

### Why This Matters

The manual is validated as-is: the packet consumes it and must never edit it, re-add it, or register a second Refero manual. Nothing else in the skill is trustworthy until the wiring is confirmed, and a "verification" that mutates the config is a contract violation, which is why this is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `MANUAL-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm wiring presence without any mutation
- Real user request: `Check whether the Refero MCP is wired into this project.`
- Prompt: `Check whether the Refero MCP is wired into this project.`
- Expected execution process: run `bash scripts/doctor.sh` (optionally with `REFERO_DOCTOR_LIVE=1`); rely on read-only grep evidence; state the plan requirement (Pro or higher; Free has no MCP access) and the operator-only auth step
- Expected signals: `OK 'refero' manual registered in .utcp_config.json`; the probe (if run) reports HTTP 401 explained as documented auth behavior; the config file is untouched
- Desired user-visible outcome: the agent reports the wiring status, the plan gate, and what remains operator-only, having changed nothing
- Pass/fail: PASS if the manual was verified read-only AND nothing was edited AND the gates were surfaced; FAIL if the config was edited, the manual re-added, or a second manual proposed

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Wiring verification stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: This is a read-only scenario with no access requirement. It must never SKIP.

1. `bash: bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh`  # -> OK 'refero' manual registered
2. optional `bash: REFERO_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh`  # -> HTTP 401 (auth required, as documented)
3. agent reports wiring status + Pro-plan gate + operator-only OAuth step  # -> no edit proposed

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MANUAL-001 | Wiring verification | Verify the refero manual read-only and surface the plan/auth gates | `Check whether the Refero MCP is wired into this project.` | 1. `bash: bash scripts/doctor.sh` -> 2. optional `bash: REFERO_DOCTOR_LIVE=1 bash scripts/doctor.sh` -> 3. agent reports status + gates | Step 1: manual registered, node/npx OK. Step 2: HTTP 401. Step 3: Pro-plan requirement and operator-only OAuth stated | doctor.sh transcript; `git status` showing no config change | PASS if the manual was verified read-only AND nothing was edited AND the gates were surfaced. FAIL if the config was edited, re-added, or a second manual proposed | 1. Confirm only grep/doctor ran. 2. Confirm no Write/Edit occurred. 3. Confirm the 401 was explained as documented auth, not an error to "fix". |

### Optional Supplemental Checks

If the manual is absent, that absence is the scenario result, not a blocker: the agent reports it and states that registration is an operator decision made outside this skill. Proposing to add the manual is a FAIL.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/feature_catalog.md` | Capability inventory this wiring unblocks |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/mcp-wiring.md` | The registered manual, bridge behavior, and the verify-never-edit rule |
| `../../assets/utcp-refero-manual.md` | The byte-preserved manual snapshot marked "verify, do not re-add" |
| `../../scripts/doctor.sh` | The read-only diagnostic this scenario executes |

---

## 5. SOURCE METADATA

- Group: Wiring and Discovery
- Playbook ID: MANUAL-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `discovery-setup/manual-registered.md`
