---
title: Audit Direct Fallback Without Subagents Scenario
description: Manual scenario verifying audit direct fallback preserves evidence proof and read-only tool boundaries.
trigger_phrases:
  - "test audit direct fallback"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: DIRECT_FALLBACK
expected_resources:
  - SKILL.md
  - references/audit-contract.md
  - references/evidence-capture.md
---

# AUDIT-PROCCARD-003 | Audit Direct Fallback Without Subagents

**Exact prompt**

```text
Subagents are unavailable. audit: run the accessibility review directly in this session and show the selected card, context basis, evidence proof line, dimensions covered, and read-only boundary.
```

## 1. OVERVIEW

This scenario validates audit `Context, Proof, And Direct Fallback`: current-session execution must preserve selected-card proof, evidence labels, dimension coverage, and Read/Glob/Grep-only boundaries.

## 2. SCENARIO CONTRACT

- Objective: Confirm audit direct fallback keeps the same proof bar and does not apply fixes.
- Real user request: `Subagents are unavailable, but I still need an accessibility audit.`
- Prompt: `Subagents are unavailable. audit: run the accessibility review directly in this session and show the selected card, context basis, evidence proof line, dimensions covered, and read-only boundary.`
- Expected execution process: No Task dispatch; select `procedures/accessibility-audit.md`; record target artifact, available/missing evidence, audit bar, full vs focused score, evidence labels, dimensions covered, and not-assessed fields.
- Expected signals: Direct execution, no Write/Edit/Bash/Task, no file fixes, proof before accessibility/release claims.
- Desired user-visible outcome: Evidence-backed audit report with explicit limitations.
- Pass/fail: PASS if direct and read-only with full proof; FAIL if proof is skipped, fixes are applied, or mutating tools are used.

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AUDIT-PROCCARD-003 | Audit direct fallback | Confirm no-subagent path keeps proof bar | `Subagents are unavailable. audit: run the accessibility review directly in this session and show the selected card, context basis, evidence proof line, dimensions covered, and read-only boundary.` | grep direct fallback in `SKILL.md` -> agent: run prompt -> inspect tool calls and proof order | No Task dispatch; selected card named; evidence labels and not-assessed fields precede claims; only Read/Glob/Grep used | Transcript, response, tool-call record | PASS if direct/read-only with full proof; FAIL if Task/mutating tool/fix application appears | 1. Re-read direct fallback; 2. Inspect first readiness/accessibility claim; 3. Compare tool surface |

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Audit direct-fallback contract |
| `../../references/audit-contract.md` | Findings-first audit contract |
| `../../references/evidence-capture.md` | Evidence labels |

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: AUDIT-PROCCARD-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `procedure-card-contract/direct-fallback-without-subagents.md`
