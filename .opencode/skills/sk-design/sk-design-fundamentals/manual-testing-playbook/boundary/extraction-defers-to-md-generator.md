---
title: "SKD-030 -- Extraction routes to the measuring skill"
description: "This scenario validates Extraction routes to the measuring skill for `SKD-030`. It focuses on confirm a request to measure a live site routes away from this skill."
stage: negative
id: "SKD-030"
version: 1.0.0.0
---

# SKD-030 -- Extraction routes to the measuring skill

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-030`.

---

## 1. OVERVIEW

This scenario validates Extraction routes to the measuring skill for `SKD-030`. It focuses on confirm a request to measure a live site routes away from this skill.

### Why This Matters

This skill decides values for a surface that does not exist yet. Measuring one that does is the sibling's job, and a skill that answers both blurs the boundary that keeps their guidance consistent.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-030` and confirm the expected signals without contradictory evidence.

- Objective: confirm a request to measure a live site routes away from this skill.
- Real user request: `Extract the design system from stripe.com.`
- Prompt: `Extract the design system from stripe.com`
- Expected execution process: Recognise the request as extraction and route to the measuring skill instead of answering.
- Expected signals: The advisor ranks `sk-design-md-generator` first, and the reply routes there rather than proposing values.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if `sk-design-md-generator` is ranked first and the reply routes there without proposing invented values; FAIL if `sk-design` is ranked first, or the reply proposes colors and sizes for a site it never measured.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "extract the design system from stripe.com" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "belongs to the sibling skill" .opencode/skills/sk-design/sk-design-md-generator/SKILL.md`

### Expected Signals

The advisor ranks `sk-design-md-generator` first, and the reply routes there rather than proposing values.

### Evidence

Advisor JSON showing the sibling ranked first, the routing reply, and the grep proving the boundary is stated on the sibling side too.

### Pass / Fail Criteria

- **Pass**: `sk-design-md-generator` is ranked first and the reply routes there without proposing invented values.
- **Fail**: `sk-design` is ranked first, or the reply proposes colors and sizes for a site it never measured.

### Failure Triage

Read the boundary note in both skills; a wrong route here means one of the two boundary statements drifted.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-030 | Extraction routes to the measuring skill | confirm a request to measure a live site routes away from this skill | `Extract the design system from stripe.com` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "extract the design system from stripe.com" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "belongs to the sibling skill" .opencode/skills/sk-design/sk-design-md-generator/SKILL.md` | The advisor ranks `sk-design-md-generator` first, and the reply routes there rather than proposing values. | Advisor JSON showing the sibling ranked first, the routing reply, and the grep proving the boundary is stated on the sibling side too. | PASS if `sk-design-md-generator` is ranked first and the reply routes there without proposing invented values; FAIL if `sk-design` is ranked first, or the reply proposes colors and sizes for a site it never measured | Read the boundary note in both skills; a wrong route here means one of the two boundary statements drifted. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [extraction-defers-to-md-generator.md](extraction-defers-to-md-generator.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/interaction-craft.md](../../references/interaction-craft.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: boundary
- Playbook ID: SKD-030
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `boundary/extraction-defers-to-md-generator.md`
