---
title: "CR-022 -- Ceiling-comment downgrade"
description: "This scenario validates ceiling-comment downgrade for `CR-022`. It focuses on treating a concrete ceiling: comment as evidence that a too-simple KISS or YAGNI finding was intentional, while never downgrading a protected-class finding."
version: 1.5.0.2
---

# CR-022 -- Ceiling-comment downgrade

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-022`.

---

## 1. OVERVIEW

This scenario validates ceiling-comment downgrade for `CR-022`. It focuses on treating a concrete `ceiling:` comment as evidence that a too-simple KISS or YAGNI finding was intentional, while never downgrading a protected-class finding.

### Why This Matters

A deliberate shortcut and an oversight look identical to a reviewer, so both used to get flagged and the author had to re-explain the choice every time. The §7 rule added in v1.4.0.0 treats a concrete `ceiling:` comment, one that names the shortcut, its known ceiling, and the upgrade path or trigger, as evidence that a "too simple" or "missing feature" KISS or YAGNI finding was a choice, and downgrades or suppresses that P2. The exemption is deliberately narrow. CR-022 proves the reviewer honors a real ceiling note for a simplicity finding and still judges security, authentication, persistence, sandboxing, public-contract, and correctness findings on their own contract no matter what the comment says.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a concrete ceiling: comment downgrades a matching too-simple KISS or YAGNI P2 while a co-located security or correctness finding stays full severity.
- Real user request: `Review target carries a deliberate shortcut marked with a ceiling: comment alongside a security-relevant line.`
- Prompt: `Review this diff where a deliberate shortcut carries a ceiling: comment; downgrade the matching too-simple KISS or YAGNI finding, but keep any security, auth, persistence, or correctness finding at full severity.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: the ceiling: comment is located and names shortcut, ceiling, and upgrade trigger; Step 2: the matching P2 simplicity finding is downgraded or suppressed; Step 3: a co-located security or correctness finding keeps full severity.
- Desired user-visible outcome: a review that stops nagging about an explained shortcut while still blocking on the security or correctness issue beside it.
- Pass/fail: PASS if the ceiling comment downgrades only the simplicity finding and never a protected-class finding per assets/code_quality_checklist.md section 7; FAIL if it suppresses a security, auth, persistence, sandbox, public-contract, or correctness finding, or ignores a valid ceiling note.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain review-scope language.
2. Confirm the review target, the ceiling: comment, and any co-located protected-class line.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited review reference files.
5. Return a concise final verdict that names the misclassified finding when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-022 | Ceiling-comment downgrade | Confirm a concrete ceiling: comment downgrades a matching too-simple KISS or YAGNI P2 while a co-located security or correctness finding stays full severity. | `Review this diff where a deliberate shortcut carries a ceiling: comment; downgrade the matching too-simple KISS or YAGNI finding, but keep any security, auth, persistence, or correctness finding at full severity.` | bash: git diff --staged -U5 -> bash: rg -n "ceiling:" path/to/file -> agent: @review for KISS or YAGNI downgrade and protected-class hold | Step 1: ceiling: comment located with shortcut, ceiling, upgrade trigger; Step 2: matching P2 simplicity finding downgraded or suppressed; Step 3: co-located security or correctness finding stays full severity | Diff hunk, the ceiling: line, both findings with final severity | PASS if the ceiling comment downgrades only the simplicity finding and never a protected-class finding per assets/code_quality_checklist.md section 7; FAIL if it suppresses a protected-class finding or ignores a valid ceiling note | 1. Confirm the ceiling: comment is concrete, not a bare label; 2. Check the protected-class exclusion list; 3. Re-grade each finding independently |

### Optional Supplemental Checks

If the primary run passes, repeat against a `ceiling:` comment that is vague (no ceiling or upgrade trigger) and confirm the reviewer does NOT downgrade on it. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../assets/code_quality_checklist.md` | Section 7 ceiling: intentional-simplification downgrade rule and the protected-class exclusion list |
| `../../SKILL.md` | Findings-first severity contract the downgrade applies within |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--efficiency-and-restraint/ceiling-comment-downgrade.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
