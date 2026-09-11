---
title: "GIT-044 -- Find commits by packet and identifier"
description: "This scenario validates Find commits by packet and identifier for `GIT-044`. It focuses on verify the three queries resolve a commit after a stamped commit exists."
version: 1.0.0.0
---

# GIT-044 -- Find commits by packet and identifier

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `GIT-044`.

---

## 1. OVERVIEW

This scenario validates Find commits by packet and identifier for `GIT-044`. It focuses on verify the three queries resolve a commit after a stamped commit exists.

### Why This Matters

A commit is only crawlable when a reader who knows the packet or the ordinal can reach it. The trailer paragraph carries both keys, so plain `git log` queries should resolve the commit without an index.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-044` and confirm the expected signals without contradictory evidence.

- Objective: verify the three queries resolve a commit after a stamped commit exists.
- Real user request: `Find the commits for packet sk-git/028 and the commit with a given Commit-Id.`
- Prompt: `Create a stamped commit in a scratch repository, then show that the values query, the packet query and the identifier query all return it.`
- Expected execution process: Create an empty commit with `SPECKIT_COMMIT_SPEC` set, read its trailers with the values query, then run the packet query and the identifier query and compare the returned hashes.
- Expected signals: The values query prints the commit's `Commit-Id`, the packet query returns the commit hash and the identifier query returns the same hash.
- Desired user-visible outcome: A concise PASS or FAIL verdict naming the hash each query returned. SKIP only when the sandbox has no writable repository in which to create the stamped commit.
- Pass/fail: PASS if the packet query, the identifier query and the values query all return the same commit. FAIL if any query returns nothing or a different commit.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-044 | Find commits by packet and identifier | verify the three queries resolve a commit after a stamped commit exists. | `Create a stamped commit in a scratch repository, then show that the values query, the packet query and the identifier query all return it.` | 1. `bash: SPECKIT_COMMIT_SPEC=sk-git/028-crawlable-commit-history git commit --allow-empty -m "docs(sk-git): record a searchable commit"` -> 2. `bash: git log --format='%h %(trailers:key=Commit-Id,valueonly)' -1` -> 3. `bash: git log -E --grep='^Spec: sk-git/028' --format=%h` -> 4. `bash: git log --fixed-strings --grep="Commit-Id: <captured-id>" --format=%h` | The values query prints the commit's `Commit-Id`, the packet query returns the commit hash and the identifier query returns the same hash. | The commit hash, the captured ordinal and the three command transcripts from a scratch repository. | PASS if the packet query, the identifier query and the values query all return the same commit. FAIL if any query returns nothing or a different commit. | Check `SKILL.md §6` commit-message gates, then inspect `.opencode/scripts/git-hooks/prepare-commit-msg` and `.opencode/scripts/git-hooks/commit-msg` for the trailer paragraph and the id checks. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/workflow-playbooks/conventional-commit-workflows.md` | Feature-catalog entry describing commit identity and search |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Top-level sk-git workflow rules and safety gates |
| `../../references/quick-reference.md` | Find commits subsection with the three queries |
| `../../scripts/commit-id-naming.sh` | Ordinal allocator and high-water scanner |
| `../../../../scripts/git-hooks/prepare-commit-msg` | Stamper that writes the trailer paragraph |
| `../../../../scripts/git-hooks/commit-msg` | Hook that validates the trailer keys and refuses a duplicate id |

---

## 5. SOURCE METADATA

- Group: Commit Formation
- Playbook ID: GIT-044
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commit-formation/find-commits-by-packet-and-id.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
