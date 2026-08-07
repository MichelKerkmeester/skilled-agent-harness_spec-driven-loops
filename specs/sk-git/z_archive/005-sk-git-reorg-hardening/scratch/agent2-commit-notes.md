# Agent 2 — Commit/Staging + Rename-Heavy Merge Hardening (scratch / lessons-learned)

Scope owned by this agent (Agent 2):
- `.opencode/skills/sk-git/references/commit_workflows.md` (edited)
- `.opencode/skills/sk-git/references/shared_patterns.md` (edited)
- This notes file.

NOT touched (sibling Agent 1 owns): `SKILL.md`, `worktree_workflows.md`, new `large_reorg_playbook.md`.

---

## What I changed

### commit_workflows.md — Failure Mode 1: accidental staging of unrelated in-flight WIP
- Added **§3 Step 7: Scoped-Staging Discipline (Dirty Working Tree)** with:
  - Hard rules: never `git add -A` / `git add .` / broad `git add <folder>` on a dirty tree; stage explicit pathspecs only; remember unrelated WIP may ALREADY be staged in the index.
  - Step 7a: snapshot the tree (`git status --short` shows both columns; `git diff --cached --name-only` shows the index).
  - Step 7b: copy-paste **pre-commit deny-pattern assertion** — grep `git diff --cached --name-only` against a `DENY` regex of unrelated paths; abort if non-empty.
  - Step 7c: `git stash push -k` (keep-index) caveat — `git stash pop` can restore entries as STAGED, so re-check the index after a pop.
  - Step 7d: recovery via `git reset --mixed HEAD~1` (un-commit, keep changes), then re-stage precise pathspecs and re-assert.
- Added a **Common Mistakes** entry ("Sweeping unrelated WIP into your commit").
- Added a **Troubleshooting** entry ("Unrelated In-Flight WIP Got Staged or Committed") with both the still-staged and already-committed recovery paths.
- Added a **Success Criteria** bullet for the dirty-tree assertion.

### shared_patterns.md — Failure Mode 2: rename-heavy merge
- Added **§10 RENAME-HEAVY MERGE VERIFICATION** (renumbered old §10 Related Resources -> §11):
  - 10.1 disjointness proof: `comm -12` of each side's `git diff --name-only $BASE <side>` must be EMPTY.
  - 10.2 raise `merge.renameLimit` / `diff.renameLimit` (e.g. 20000) for large rename sets; watch for the "rename detection skipped" warning.
  - 10.3 verify the TREE not `ls`: `git ls-files <old>` must be 0; `git mv` leaves gitignored leftovers on disk -> "ghost"/"double" folders that are NOT in the commit; detect with a `find + git ls-files` loop and remove from the working tree separately.
  - 10.4 confirm renames recorded as `R` status (not D+A churn) via `git diff -M --name-status`.
  - 10.5 a rename-heavy merge checklist.
- Cross-linked from the existing **Pre-Merge Checklist** (§7) and the Related Resources list.

### Cross-links between the two files
- commit_workflows §3 Step 7 references shared_patterns §11 (now §10/§11) for the merge half of the incident.
- shared_patterns §10 references commit_workflows §3 Step 7 for the staging half.

---

## Request to sibling agent (SKILL.md owner)
Consider adding SKILL.md pointers to the new content so it is discoverable:
- "Dirty working tree / unrelated WIP" -> `references/commit_workflows.md` §3 Step 7 (Scoped-Staging Discipline).
- "Rename-heavy / large-reorg merge" -> `references/shared_patterns.md` §10 (Rename-Heavy Merge Verification).
Both pair naturally with the planned `large_reorg_playbook.md`.

---

## Incident reference
Source: `system-spec-kit/026-graph-and-context-optimization` wave-4 reorg (~9000 renames merged to main while unrelated WIP sat in the tree). Two concrete failures captured above: (1) 24 unrelated WIP files swept into a reorg commit (backed out with `git reset --mixed HEAD~1`); (2) rename-heavy merge where the tree was correct but `ls` showed double folders due to gitignored leftovers.
