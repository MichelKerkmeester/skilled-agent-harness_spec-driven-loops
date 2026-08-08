---
title: "DV-012 -- Agent roster enumeration"
description: "Verify filesystem parity for the 13 mirrored repository-agent profiles and dispatch one named profile read-only."
version: 1.0.0.1
---

# DV-012 -- Agent roster enumeration

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-012`.

## 1. OVERVIEW

Treat the filesystem as the authoritative roster: enumerate the 13 mirrored `.devin/agents/*/AGENT.md` symlinks deterministically, validate their targets, then test one explicitly named profile with a bounded read-only dispatch.

### Why This Matters

An LLM-generated list is nondeterministic and cannot prove mirror parity. Filesystem enumeration catches missing profiles, duplicate names, and broken symlink targets; one named dispatch checks that a discovered profile is usable without making the model reconstruct the roster.

## 2. SCENARIO CONTRACT

- Objective: Prove 13/13 mirrored-agent filesystem parity and read-only dispatchability of the explicitly named `review` profile.
- Real user request: `Verify every mirrored Devin agent profile on disk, then run one read-only review-profile check.`
- Prompt: `Use the review subagent to inspect the current diff for correctness and repository-convention issues. Read only, cite file paths, and do not modify files.`
- Expected execution process: Deterministically list `.devin/agents/*/AGENT.md`, derive names from paths, confirm all 13 entries are symlinks with resolvable targets, then run one print-mode dispatch naming `review` under canonical `auto` mode.
- Expected signals: The filesystem roster contains exactly ai-council, code, context, debug, deep-alignment, deep-improvement, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, and review. The bounded dispatch uses the `review` profile and returns read-only findings or an explicit no-findings result.
- Desired user-visible outcome: Deterministic 13/13 filesystem parity plus evidence that one named mirrored profile is dispatchable.
- Pass/fail: PASS when the symlink roster matches exactly, every target resolves, and the named `review` dispatch completes read-only; FAIL on roster drift, a broken target, an unavailable named profile, or mutation; SKIP when Devin authentication or CLI availability prevents the dispatch after filesystem parity is recorded.

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the review subagent to inspect the current diff for correctness and repository-convention issues. Read only, cite file paths, and do not modify files.`

### Commands

1. `find .devin/agents -mindepth 2 -maxdepth 2 -name AGENT.md -type l -print | sed 's#^\.devin/agents/##; s#/AGENT.md$##' | sort`
2. `find .devin/agents -mindepth 2 -maxdepth 2 -name AGENT.md -type l -exec test -e {} \; -print | sort`
3. `devin -p --model swe --permission-mode auto -- "Use the review subagent to inspect the current diff for correctness and repository-convention issues. Read only, cite file paths, and do not modify files." </dev/null > /tmp/cli-devin-dv012-review.txt 2>&1`
4. Compare the deterministic filesystem output with the expected 13-name roster and inspect the single-profile dispatch transcript.

### Expected

The first command prints the exact 13-name roster in sorted order. The second prints 13 resolvable symlinks. The dispatch transcript shows a bounded read-only use of the explicitly named `review` profile; it is not an enumeration oracle.

### Evidence

Capture the sorted roster, the resolvable-symlink output, the Devin exit status, and `/tmp/cli-devin-dv012-review.txt`.

### Pass / Fail

- **PASS**: All 13 expected symlinks exist and resolve, and the named `review` dispatch completes without mutation.
- **FAIL**: A name is missing or extra, a target is broken, the named profile is unavailable, or the dispatch mutates files.
- **SKIP**: Blocker: Devin authentication or CLI availability is missing, so the named runtime dispatch is unavailable; retain the filesystem-parity evidence.

### Failure Triage

For roster drift, compare the missing or extra path with the canonical agent sources. For a dispatch failure, inspect the captured transcript and confirm the `review` symlink resolves before attributing the failure to the profile.

| Feature ID | Feature Name | Scenario Name/Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-012 | Agent roster enumeration | Prove filesystem parity and dispatch one named profile | `Use the review subagent to inspect the current diff for correctness and repository-convention issues. Read only, cite file paths, and do not modify files.` | List and validate `.devin/agents/*/AGENT.md`; dispatch `review` once with `--permission-mode auto`. | Exact 13-name symlink roster; resolvable targets; read-only `review` response. | Sorted paths, target check, exit status, and transcript. | PASS on exact parity and usable named dispatch; FAIL on drift, broken target, missing profile, or mutation; SKIP only for a specific unavailable auth or CLI runtime. | Check the filesystem mirror first, then inspect the single-profile transcript. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Roster coverage note |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | Roster and profile rules |
| `../../SKILL.md` | Verified 13-agent roster and canonical permission modes |
| `../../../../../../.devin/agents/` | Authoritative mirror directory under test |

## 5. SOURCE METADATA

- Group: Subagents
- Playbook ID: DV-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `subagents/roster-enumeration.md`
