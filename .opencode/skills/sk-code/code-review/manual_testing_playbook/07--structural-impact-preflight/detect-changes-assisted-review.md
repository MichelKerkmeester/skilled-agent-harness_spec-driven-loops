---
title: "CR-019 -- detect_changes-assisted review"
description: "This scenario validates detect_changes-assisted review for `CR-019`. It focuses on confirming local-diff review attempts structural-impact preflight and still completes with a caveat when graph readiness is stale."
version: 1.5.0.1
---

# CR-019 -- detect_changes-assisted review

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-019`.

---

## 1. OVERVIEW

This scenario validates detect_changes-assisted review for `CR-019`. It focuses on confirming local-diff review attempts structural-impact preflight and still completes with a caveat when graph readiness is stale.

### Why This Matters

Local-diff reviews benefit from structural-impact context when the code graph is fresh, but review safety cannot depend on graph freshness. The reviewer must attempt `detect_changes`, report stale or unavailable readiness honestly, and continue the plain git-diff review so findings still reach the user.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm local-diff review attempts structural-impact preflight and still completes with a caveat when graph readiness is stale.
- Real user request: `Review this small local diff and tell me if anything blocks merging.`
- Prompt: `Review this small local diff and use detect_changes for structural-impact preflight; if the graph is stale, include the caveat and continue the git-diff review.`
- Expected execution process: Produce a small reversible local diff, run the review workflow, capture the structural-impact preflight result, force or observe a stale/blocked graph readiness path, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: unified diff captured; Step 2: `detect_changes` invoked with the unified diff; Step 3: stale or unavailable readiness becomes a "structural-impact analysis unavailable" caveat; Step 4: review still returns findings-first output from the plain git diff.
- Desired user-visible outcome: a findings-first review report that names structural-impact readiness when available or the exact caveat when unavailable, without blocking the review.
- Pass/fail: PASS if the structural-impact step runs and the review completes with the caveat when graph readiness is stale; FAIL if stale graph readiness aborts the review or is hidden from the report.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Start from a clean disposable worktree or restore point.
2. Create one small reversible local diff in a low-risk file, then capture `git diff -- <path>` as the unified diff input.
3. Run the review workflow with the exact prompt and capture whether `detect_changes` receives the unified diff.
4. Confirm the stale/blocked readiness path records "structural-impact analysis unavailable" while the plain git-diff review continues.
5. Restore the local diff before recording the final verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-019 | detect_changes-assisted review | Confirm local-diff review attempts structural-impact preflight and still completes with a caveat when graph readiness is stale. | `Review this small local diff and use detect_changes for structural-impact preflight; if the graph is stale, include the caveat and continue the git-diff review.` | bash: create a reversible one-file local diff -> bash: git diff -- path/to/file -> agent: @review local diff with structural-impact preflight -> verify: detect_changes received unified diff -> restore: revert local fixture diff | Step 1: unified diff visible; Step 2: `detect_changes` invocation captured; Step 3: stale graph path reports "structural-impact analysis unavailable"; Step 4: findings-first review still completes | Terminal transcript, unified diff, detect_changes readiness output or blocked payload, final review report, restore evidence | PASS if the structural-impact step runs and stale readiness produces a caveat while git-diff review completes; FAIL if stale readiness blocks review, hides the caveat, or replaces file:line evidence | 1. Check `.opencode/agents/review.md` tool table and analyze workflow; 2. Check `.opencode/skills/sk-code/code-review/SKILL.md` Phase 1 evidence flow; 3. Confirm the diff passed to detect_changes is unified diff text; 4. Confirm the graph readiness status is captured rather than inferred |

### Optional Supplemental Checks

If the primary run passes, repeat with a fresh graph and confirm affected symbols/files are cited as context only, not as a substitute for direct file:line review evidence.

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
| `../../SKILL.md` | Routing, output contract, scope and escalation rules |
| `../../references/review_core.md` | Severity, evidence, precedence, and finding schema |
| `../../../../agents/review.md` | Native review workflow and structural-impact caveat behavior |
| `../../../../agents/deep-review.md` | Iterative review workflow and structural-impact caveat behavior |

---

## 5. SOURCE METADATA

- Group: Structural Impact Preflight
- Playbook ID: CR-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--structural-impact-preflight/detect-changes-assisted-review.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
