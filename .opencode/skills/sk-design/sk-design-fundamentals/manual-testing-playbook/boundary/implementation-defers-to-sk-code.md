---
title: "SKD-031 -- Implementation routes to the code skill"
description: "This scenario validates Implementation routes to the code skill for `SKD-031`. It focuses on confirm a pure implementation request is not answered as a design question."
stage: negative
id: "SKD-031"
version: 1.0.0.0
---

# SKD-031 -- Implementation routes to the code skill

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-031`.

---

## 1. OVERVIEW

This scenario validates Implementation routes to the code skill for `SKD-031`. It focuses on confirm a pure implementation request is not answered as a design question.

### Why This Matters

A skill that answers everything adjacent to its domain competes with the skill that owns it. Application logic with no visual surface belongs to the implementer.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-031` and confirm the expected signals without contradictory evidence.

- Objective: confirm a pure implementation request is not answered as a design question.
- Real user request: `Write the API client for this form.`
- Prompt: `Write the API client for this form`
- Expected execution process: Recognise the request as application logic and route to the implementing skill.
- Expected signals: The reply routes to `sk-code` and does not return CSS or design values.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the reply routes to `sk-code` and returns no design values; FAIL if the reply styles the form instead of routing, or proposes values for a request with no visual surface.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "write the API client for this form" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "Route to .sk-code" .opencode/skills/sk-design/SKILL.md`

### Expected Signals

The reply routes to `sk-code` and does not return CSS or design values.

### Evidence

Advisor JSON, the routing reply, and the grep proving the boundary is written into the skill.

### Pass / Fail Criteria

- **Pass**: the reply routes to `sk-code` and returns no design values.
- **Fail**: the reply styles the form instead of routing, or proposes values for a request with no visual surface.

### Failure Triage

Read the When NOT to Use list in `SKILL.md` Section 1; a design answer here means that boundary was skipped.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-031 | Implementation routes to the code skill | confirm a pure implementation request is not answered as a design question | `Write the API client for this form` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "write the API client for this form" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "Route to .sk-code" .opencode/skills/sk-design/SKILL.md` | The reply routes to `sk-code` and does not return CSS or design values. | Advisor JSON, the routing reply, and the grep proving the boundary is written into the skill. | PASS if the reply routes to `sk-code` and returns no design values; FAIL if the reply styles the form instead of routing, or proposes values for a request with no visual surface | Read the When NOT to Use list in `SKILL.md` Section 1; a design answer here means that boundary was skipped. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [implementation-defers-to-sk-code.md](implementation-defers-to-sk-code.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/ux-laws.md](../../references/ux-laws.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: boundary
- Playbook ID: SKD-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `boundary/implementation-defers-to-sk-code.md`
