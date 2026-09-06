---
title: "SKD-001 -- Diagnosis entry on a vague complaint"
description: "This scenario validates Diagnosis entry on a vague complaint for `SKD-001`. It focuses on confirm a vague visual complaint loads the symptom-to-fix table before any value changes."
stage: routing
id: "SKD-001"
version: 1.0.0.0
---

# SKD-001 -- Diagnosis entry on a vague complaint

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-001`.

---

## 1. OVERVIEW

This scenario validates Diagnosis entry on a vague complaint for `SKD-001`. It focuses on confirm a vague visual complaint loads the symptom-to-fix table before any value changes.

### Why This Matters

A vague complaint answered by restyling is a guess. The diagnosis table is the only path that turns "looks amateur" into a named mechanical cause, so it has to be what loads first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a vague visual complaint loads the symptom-to-fix table before any value changes.
- Real user request: `This dashboard looks amateur, can you make it better?`
- Prompt: `This dashboard ui looks amateur and cluttered, make it look better`
- Expected execution process: Score the prompt, load the diagnosis reference, name the cause from a table row, and only then propose values.
- Expected signals: The advisor ranks `sk-design` first; the answer names a row from the diagnosis table (no hierarchy, competing neighbours, or space added rather than removed) before proposing any change.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the advisor ranks `sk-design` first and the reply names a diagnosis-table cause before any value is proposed; FAIL if the reply proposes spacing, color or size changes without naming a cause, or the advisor does not return `sk-design`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "this dashboard ui looks amateur and cluttered, make it look better" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session and capture the reply`
3. `bash: rg -n "No hierarchy" .opencode/skills/sk-design/references/diagnosis-table.md`

### Expected Signals

The advisor ranks `sk-design` first; the answer names a row from the diagnosis table (no hierarchy, competing neighbours, or space added rather than removed) before proposing any change.

### Evidence

Advisor JSON with the ranked skill and confidence, the agent reply, and the grep hit proving the named cause exists as a table row.

### Pass / Fail Criteria

- **Pass**: the advisor ranks `sk-design` first and the reply names a diagnosis-table cause before any value is proposed.
- **Fail**: the reply proposes spacing, color or size changes without naming a cause, or the advisor does not return `sk-design`.

### Failure Triage

Re-read the DIAGNOSE keyword weights in `SKILL.md` Section 2; if the advisor missed, check the intent signals in `graph-metadata.json` for the phrasing used.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-001 | Diagnosis entry on a vague complaint | confirm a vague visual complaint loads the symptom-to-fix table before any value changes | `This dashboard ui looks amateur and cluttered, make it look better` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "this dashboard ui looks amateur and cluttered, make it look better" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session and capture the reply` -> 3. `bash: rg -n "No hierarchy" .opencode/skills/sk-design/references/diagnosis-table.md` | The advisor ranks `sk-design` first; the answer names a row from the diagnosis table (no hierarchy, competing neighbours, or space added rather than removed) before proposing any change. | Advisor JSON with the ranked skill and confidence, the agent reply, and the grep hit proving the named cause exists as a table row. | PASS if the advisor ranks `sk-design` first and the reply names a diagnosis-table cause before any value is proposed; FAIL if the reply proposes spacing, color or size changes without naming a cause, or the advisor does not return `sk-design` | Re-read the DIAGNOSE keyword weights in `SKILL.md` Section 2; if the advisor missed, check the intent signals in `graph-metadata.json` for the phrasing used. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [diagnose-entry.md](diagnose-entry.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/diagnosis-table.md](../../references/diagnosis-table.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: routing
- Playbook ID: SKD-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/diagnose-entry.md`
