---
title: "DV-015 -- Native repository skill invocation"
description: "Verify that Devin invokes a real repository skill discovered natively from .opencode/skills."
version: 1.0.0.1
---

# DV-015 -- Native repository skill invocation

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-015`.

## 1. OVERVIEW

Invoke the real `/sk-doc` repository skill from a bounded read-only Devin print session. The skill is discovered natively from `.opencode/skills/sk-doc`; no command-file mirror is involved.

### Why This Matters

Discovery output alone does not prove a repository skill can be used. A direct, read-only invocation verifies that Devin resolves a real native skill without relying on nonexistent command registrations.

## 2. SCENARIO CONTRACT

- Objective: Prove that Devin can invoke the real `/sk-doc` repository skill and return skill-specific guidance without modifying files.
- Real user request: `Use the repository's sk-doc skill to report the required section order for a manual testing scenario.`
- Prompt: `/sk-doc Inspect the manual-testing-playbook authoring contract and report the required per-feature section order. Do not create or modify files.`
- Expected execution process: Capture the pre-run worktree status, invoke `/sk-doc` once through print mode under canonical `auto` permission, capture the response, and compare post-run status with the baseline.
- Expected signals: The response identifies the ordered sections `OVERVIEW`, `SCENARIO CONTRACT`, `TEST EXECUTION`, `SOURCE FILES` or `REFERENCES`, and `SOURCE METADATA`; Devin does not report an unknown skill and the worktree status is unchanged.
- Desired user-visible outcome: Skill-specific, read-only guidance from a real repository skill.
- Pass/fail: PASS on skill-specific section-order output and unchanged status; FAIL on unknown-skill handling, generic fallback, incorrect contract output, or mutation; SKIP when Devin authentication or CLI availability prevents invocation.

## 3. TEST EXECUTION

### Prompt

- Prompt: `/sk-doc Inspect the manual-testing-playbook authoring contract and report the required per-feature section order. Do not create or modify files.`

### Commands

1. `git status --porcelain=v1 > /tmp/cli-devin-dv015-before.txt`
2. `devin -p --model swe --permission-mode auto -- "/sk-doc Inspect the manual-testing-playbook authoring contract and report the required per-feature section order. Do not create or modify files." </dev/null > /tmp/cli-devin-dv015.txt 2>&1`
3. `git status --porcelain=v1 > /tmp/cli-devin-dv015-after.txt`
4. `diff -u /tmp/cli-devin-dv015-before.txt /tmp/cli-devin-dv015-after.txt`

### Expected

The response reflects the real `sk-doc` manual-testing-playbook contract, names the five required sections in order, and contains no unknown-skill error. The status diff is empty.

### Evidence

Capture the Devin exit status, `/tmp/cli-devin-dv015.txt`, both status snapshots, and the empty `diff -u` result.

### Pass / Fail

- **PASS**: `/sk-doc` returns the correct ordered section contract and the worktree status is unchanged.
- **FAIL**: Devin reports an unknown skill, silently falls back to generic output, returns the wrong contract, or mutates the worktree.
- **SKIP**: Blocker: Devin authentication or CLI availability is missing, so native repository-skill invocation is unavailable.

### Failure Triage

Confirm `/sk-doc` appears in `devin skills list`, verify `.opencode/skills/sk-doc/SKILL.md` exists, then inspect the captured transcript. Diagnose native discovery or invocation directly; do not create command mirrors.

| Feature ID | Feature Name | Scenario Name/Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-015 | Native repository skill invocation | Invoke real `/sk-doc` read-only | `/sk-doc Inspect the manual-testing-playbook authoring contract and report the required per-feature section order. Do not create or modify files.` | Snapshot status; run `devin -p --model swe --permission-mode auto --` with the exact prompt; snapshot and diff status. | Skill-specific five-section order; no unknown-skill error; no mutation. | Transcript, exit status, status snapshots, and empty diff. | PASS on correct skill output and clean status delta; FAIL on fallback, wrong output, or mutation; SKIP only for a specific unavailable auth or CLI runtime. | Confirm native discovery and the real `sk-doc` packet before diagnosing invocation. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Native skill-invocation policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Devin native skill discovery and command-file non-concept |
| `../../../../sk-doc/SKILL.md` | Real repository skill invoked by the scenario |
| `../../../../sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Per-feature section-order contract |

## 5. SOURCE METADATA

- Group: Commands and Skills
- Playbook ID: DV-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commands-and-skills/mirrored-command-invocation.md`
