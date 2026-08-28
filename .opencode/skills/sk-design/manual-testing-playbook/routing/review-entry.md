---
title: "SKD-002 -- Review checklist entry on a code audit"
description: "This scenario validates Review checklist entry on a code audit for `SKD-002`. It focuses on confirm an accessibility review request produces severity-tiered findings rather than impressions."
stage: routing
id: "SKD-002"
version: 1.0.0.0
---

# SKD-002 -- Review checklist entry on a code audit

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-002`.

---

## 1. OVERVIEW

This scenario validates Review checklist entry on a code audit for `SKD-002`. It focuses on confirm an accessibility review request produces severity-tiered findings rather than impressions.

### Why This Matters

A design review that returns opinions cannot be acted on. The review checklist is what forces a file, a line, a fix and a WCAG criterion onto every finding.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-002` and confirm the expected signals without contradictory evidence.

- Objective: confirm an accessibility review request produces severity-tiered findings rather than impressions.
- Real user request: `Can you review this component for accessibility problems?`
- Prompt: `Review this component for accessibility issues`
- Expected execution process: Load the review checklist, read the target files, then group findings critical, serious, moderate.
- Expected signals: The reply is grouped by severity, every finding carries a file and line, and accessibility findings precede visual ones.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if findings are grouped critical, serious, moderate, each with a file, a line, a fix, and a WCAG criterion where one applies; FAIL if the reply returns ungrouped impressions, omits line numbers, or reports zero findings without stating the tier counts.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "review this component for accessibility issues" --threshold 0.5`
2. `agent: point the session at one component file and issue the same prompt`
3. `bash: rg -n "ACCESSIBILITY, CRITICAL" .opencode/skills/sk-design/references/review-checklist.md`

### Expected Signals

The reply is grouped by severity, every finding carries a file and line, and accessibility findings precede visual ones.

### Evidence

Advisor JSON, the grouped finding list, and the checklist grep proving the severity tiers are the documented ones.

### Pass / Fail Criteria

- **Pass**: findings are grouped critical, serious, moderate, each with a file, a line, a fix, and a WCAG criterion where one applies.
- **Fail**: the reply returns ungrouped impressions, omits line numbers, or reports zero findings without stating the tier counts.

### Failure Triage

Confirm `sk-design` appears in the advisor output at all; `sk-code` outranking it on a code-review prompt is expected, but absence is a routing defect.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-002 | Review checklist entry on a code audit | confirm an accessibility review request produces severity-tiered findings rather than impressions | `Review this component for accessibility issues` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "review this component for accessibility issues" --threshold 0.5` -> 2. `agent: point the session at one component file and issue the same prompt` -> 3. `bash: rg -n "ACCESSIBILITY, CRITICAL" .opencode/skills/sk-design/references/review-checklist.md` | The reply is grouped by severity, every finding carries a file and line, and accessibility findings precede visual ones. | Advisor JSON, the grouped finding list, and the checklist grep proving the severity tiers are the documented ones. | PASS if findings are grouped critical, serious, moderate, each with a file, a line, a fix, and a WCAG criterion where one applies; FAIL if the reply returns ungrouped impressions, omits line numbers, or reports zero findings without stating the tier counts | Confirm `sk-design` appears in the advisor output at all; `sk-code` outranking it on a code-review prompt is expected, but absence is a routing defect. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [review-entry.md](review-entry.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/review-checklist.md](../../references/review-checklist.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: routing
- Playbook ID: SKD-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/review-entry.md`
