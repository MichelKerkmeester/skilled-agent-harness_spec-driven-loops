---
title: "DV-012 -- devin skills list / devin skills show"
description: "This scenario validates that devin skills list enumerates skill routines on the profile and devin skills show <name> displays details for a named skill."
---

# DV-012 -- devin skills list / devin skills show

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-012`.

---

## 1. OVERVIEW

This scenario validates `devin skills list` and `devin skills show <name>` for `DV-012`. Devin skills are profile-scoped reusable routines the agent loop can invoke. The list + show pair gives the calling AI a discovery surface for skill names and details.

### Why This Matters

Skills are the closest cli-devin analog to cli-opencode agents (`--agent <slug>`) or cli-codex profiles (`-p <name>`). The calling AI uses the list and show subcommands to discover which skill to reference in a dispatch prompt.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `devin skills list` enumerates installed skills and `devin skills show <name>` displays details for a named skill.
- Real user request: `Show me what reusable skill routines are installed on my Devin profile and what one of them does.`
- Prompt: `Run devin skills list, pick the first skill name, then run devin skills show <name> and capture the structured details.`
- Expected execution process: Operator runs `devin skills list` -> picks a skill name from output -> runs `devin skills show <name>` -> captures structured details (description, triggers, model).
- Expected signals: Both invocations exit 0. `list` output is parseable. `show` output contains name, description, and any associated triggers.
- Desired user-visible outcome: An operator-visible inventory of skills plus structured details for one named skill so the calling AI can reference it in a dispatch prompt.
- Pass/fail: PASS if both invocations exit 0 AND `show` output is parseable. FAIL if either exits non-zero OR if `show` output is missing core fields (name/description).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run `devin skills list`; capture stdout.
2. If non-empty, parse the first skill name.
3. Run `devin skills show <name>`; capture stdout.
4. Confirm the show output contains name + description.
5. If list is empty, document the empty-state and SKIP the show step with a note.
6. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-012 | `devin skills list` / `devin skills show` | Verify list + show form a coherent discovery surface for profile skills | `Run devin skills list, pick the first skill name, then run devin skills show <name> and capture the structured details.` | 1. `bash: devin skills list > /tmp/dv-012-list.txt 2>&1; echo "List exit: $?"` -> 2. `bash: cat /tmp/dv-012-list.txt` -> 3. `bash: SKILL_NAME=$(head -1 /tmp/dv-012-list.txt | awk '{print $1}'); echo "Picked: $SKILL_NAME"` -> 4. `bash: if [ -n "$SKILL_NAME" ]; then devin skills show "$SKILL_NAME" > /tmp/dv-012-show.txt 2>&1; echo "Show exit: $?"; cat /tmp/dv-012-show.txt; else echo "No skills on profile — SKIP show step with rationale"; fi` | Step 1: exit 0; Step 4 (non-empty profile): exit 0 AND show output contains "name" + "description" | Both captured stdouts, exit codes, terminal transcript | PASS if both exit 0 AND show output is parseable; FAIL if either exits non-zero OR show output missing core fields; SKIP show step with rationale if profile has no skills | (1) Confirm `devin skills` is in `devin --help`; (2) try `devin skills --help`; (3) check Devin web UI for skill management |

### Optional Supplemental Checks

- Dispatch a small task referencing the listed skill by name in the prompt body and verify Devin invokes it.
- Compare this discovery surface to cli-codex `-p <profile>` and cli-opencode `--agent <slug>`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§3 Subcommand Map) | Documents `devin skills {list, show}` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Devin Agent Delegation (skills row) |
| `../../references/agent_delegation.md` (§1 Overview) | Skills as a profile-scoped routing surface |

---

## 5. SOURCE METADATA

- Group: Devin Surfaces
- Playbook ID: DV-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--devin-surfaces/devin-skills-show.md`
