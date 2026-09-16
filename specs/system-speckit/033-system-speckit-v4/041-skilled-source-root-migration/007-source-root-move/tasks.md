---
title: "Tasks: Phase 7: Source-Root Move"
description: "Ordered tasks for moving the tracked .opencode tree under .skilled in rename-only commits, each naming its executor, plus the verification checklist that gates closure."
trigger_phrases:
  - "source root move tasks"
  - "per entry git mv tasks"
  - "rename commit verification checklist"
  - "deepseek census units"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: Source-Root Move

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Executors**: `[ORC]` is the orchestrator. `[DSF]` is DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway, read-only, re-checked by the orchestrator in T044. `WT`, `MAIN`, `C1_SHA`, `C2_SHA` and `C3_SHA` are defined in `plan.md`. No task in this phase runs in parallel: every task reads or changes the one index.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Pre-move checks. Nothing here changes a tracked file.

- [ ] T001 [ORC] Read phase 004's frozen layout decision, record option A, B or C, the keep-list and the rollback boundary in the log, then halt if 004 froze none (`../004-migration-design/`)
- [ ] T002 [ORC] Confirm phases 003 to 006 print `RESULT: PASSED` from `MAIN`'s `validate.sh --strict` and that 006's suites pass against both roots (`../spec.md:145`)
- [ ] T003 [ORC] Confirm `git diff --cached --quiet` exits 0, `git status --porcelain --untracked-files=no` prints nothing and `git status --porcelain --untracked-files=all -- .opencode .skilled` prints nothing
- [ ] T004 [ORC] Confirm `SPECKIT_AUTOSYNC` is unset or `0` in the executing shell, and carry `SPECKIT_AUTOSYNC=0` on every commit of this phase (`.opencode/scripts/git-hooks/post-commit:32-56`)
- [ ] T005 [ORC] Check `git rev-list --count HEAD..skilled/v4.0.0.0` prints 0, or integrate `skilled/v4.0.0.0` first and repeat T003
- [ ] T006 [ORC] Confirm `lsof -nP | grep -F "$WT/.opencode/"` prints nothing, so no daemon holds a file inside the tree
- [ ] T007 [ORC] Write `PRE_MOVE_SHA`, the R1 to R3 rollback commands and the output of `readlink ~/.config/git/hooks/*` into the log before any state change (`goal.md`)
- [ ] T008 [ORC] Snapshot `skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite` and `skills/.state/advisor/skill-graph-generation.json` to a dated directory outside the repository
- [ ] T009 [ORC] Read `cli-pi/SKILL.md` and the child preamble before composing the first unit brief (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:189-217`)
- [ ] T010 [DSF] Unit `pre-move-baseline`: tracked count per top-level entry, link classes, dangling links across `.opencode`, the six runtime directories and `specs`, ignored entries and empty-blob count (`scratch/pre-move-baseline.tsv`)
- [ ] T011 [ORC] Re-run `git ls-files .opencode | wc -l` and the dangling count, and compare T010 with the authoring baseline: 17,767 files, 16 entries, 208 links, 8 dangling (4 inside the tree, 4 under `specs/`), 12 ignored entries, 10 empty-blob files
- [ ] T012 [ORC] Confirm `git ls-files .skilled` prints only the placeholder path and `find .skilled -mindepth 1` prints only that path and its directory
- [ ] T013 [ORC] Run `git check-ignore -v --no-index` on the old path of every ignored entry from T010, and schedule T015 when any match comes from a root rule anchored at `.opencode/` (`.gitignore:108` at authoring)
- [ ] T014 [ORC] Record `grep -c skilled "$MAIN/.opencode/scripts/git-hooks/pre-commit"` in the log, 0 at authoring
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Move and compatibility shape. Commands and expected output are in `plan.md` §4 Phase 2.

- [ ] T015 [ORC] Conditional C0: add `.skilled/` twins of the 56 anchored rules, `git add -- .gitignore`, confirm only `M .gitignore` is staged, commit (`.gitignore`)
- [ ] T016 [ORC] C1: `git rm` the placeholder, confirm one `D` line, commit and record `C1_SHA` (`.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`)
- [ ] T017 [ORC] Confirm `.skilled` is absent or empty on disk, then `mkdir -p .skilled`
- [ ] T018 [ORC] `move_entry skills`, expect 17,182 matching lines and an empty diff (`.skilled/skills`)
- [ ] T019 [ORC] `move_entry hooks`, expect 179 (`.skilled/hooks`)
- [ ] T020 [ORC] `move_entry commands`, expect 162 (`.skilled/commands`)
- [ ] T021 [ORC] `move_entry bin`, expect 95 (`.skilled/bin`)
- [ ] T022 [ORC] `move_entry changelog`, expect 49 (`.skilled/changelog`)
- [ ] T023 [ORC] `move_entry plugins`, expect 41 (`.skilled/plugins`)
- [ ] T024 [ORC] `move_entry scripts`, expect 30 (`.skilled/scripts`)
- [ ] T025 [ORC] `move_entry agents`, expect 13 (`.skilled/agents`)
- [ ] T026 [ORC] `move_entry install-guides` then `move_entry logs`, expect 9 and 1 (`.skilled/install-guides`, `.skilled/logs`)
- [ ] T027 [ORC] `move_entry` for `package.json`, `package-lock.json`, `bun.lock` and `vitest.config.bin.ts`, expect 1 each
- [ ] T028 [ORC] `move_entry` for the links `manual-testing-playbook` and `specs`, expect 1 each
- [ ] T029 [ORC] Whole-index gate: only `R100` with the moved count, `grep -c '^specs/'` on the staged names prints 0, `git ls-files -- .opencode | wc -l` prints 0 or the option C kept count
- [ ] T030 [ORC] Census `git ls-files --others --ignored --exclude-standard --directory -- .opencode .skilled` and record, for each of the 12 ignored entries, whether it travelled or stayed
- [ ] T031 [ORC] Move dependency trees and local state left at old paths with plain `mv`, prove each dependency tree with `npm ls --depth=0` and fall back to `npm ci`
- [ ] T032 [ORC] Rebuild by canonical path with `npm run build` in `.skilled/skills/system-spec-kit` and `.skilled/skills/system-skill-advisor/runtime`, then confirm `git status --porcelain --untracked-files=all -- .skilled .opencode` prints nothing
- [ ] T033 [ORC] Build the option's compatibility shape on disk without staging it, and confirm `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0 under A and B or the keep-list resolves under C (`.opencode`)
- [ ] T034 [ORC] Run phase 005's independent move check on the working tree and record output and exit status
- [ ] T035 [ORC] Commit C2 with `SPECKIT_AUTOSYNC=0`, the planned subject and a body, stderr to `scratch/commit-c2-hooks.txt`, then record exit status, `C2_SHA` and the `Commit-Id:` trailer state, halting on any block
- [ ] T036 [ORC] Stage the compatibility entries by explicit path, confirm only the expected `A` lines with mode `120000` and no ignore match, commit C3 with stderr to `scratch/commit-c3-hooks.txt` and record `C3_SHA`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verification and handoff.

- [ ] T037 [DSF] Unit `path-map-diff`: compare `C1_SHA:.opencode` with `C2_SHA:.skilled` by mode, blob id and prefix-rewritten path, expecting no difference or only the kept entries (`scratch/path-map-diff.txt`)
- [ ] T038 [DSF] Unit `r-status-census`: count `git show -M --name-status --format= "$C2_SHA"` by status and by top-level entry (`scratch/r-status-census.tsv`)
- [ ] T039 [DSF] Unit `old-prefix-scan`: `git ls-files -- .opencode` and `git ls-tree -r --name-only HEAD -- .opencode`, expecting only the compatibility entries (`scratch/old-prefix-scan.txt`)
- [ ] T040 [DSF] Unit `follow-samples`: commit counts with and without `--follow` for one unique-content path per moved entry (`scratch/follow-samples.tsv`)
- [ ] T041 [DSF] Unit `link-census`: dangling mode-120000 entries under `.skilled`, `.opencode`, the six runtime directories and `specs`, expecting 8 under options A and B (`scratch/link-census.tsv`)
- [ ] T042 [DSF] Unit `push-ceiling-count`: `git diff --name-only --diff-filter=D <remote tip or merge base> HEAD | wc -l`, expecting 1 from this phase's own commits (`scratch/push-ceiling-count.txt`)
- [ ] T043 [DSF] Unit `naming-guard-preview`: `python3 .skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since "$C1_SHA"`, keeping `.skilled/` lines, expecting 4 names (`scratch/naming-guard-preview.txt`)
- [ ] T044 [ORC] Recompute each unit's headline number, reject any unit that differs and log the discard reason
- [ ] T045 [ORC] After `git fetch origin`, confirm `git branch -r --contains "$C2_SHA"` prints nothing, `git -C "$MAIN" merge-base --is-ancestor "$C2_SHA" HEAD` exits 1 and the hook links match T007
- [ ] T046 [ORC] Under option A or B, record whether `git add --dry-run -- .opencode/skills/sk-git/SKILL.md` is refused, for phase 009
- [ ] T047 [ORC] Copy evidence into the log and `acceptance-criteria.md`, write the handoff notes for phases 008, 010 and 011, then remove the census outputs from `scratch/`
- [ ] T048 [ORC] Run `MAIN`'s `repair-derived.cjs --folder <this folder> --apply`, then `MAIN`'s `validate.sh <this folder> --strict`, requiring `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 48 tasks marked `[x]`, or T015 marked as not needed with T013's evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Directive and log**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 004's option, keep-list and rollback boundary recorded (T001)
- [ ] CHK-002 [P0] `PRE_MOVE_SHA` and the rollback commands in the log before C1 (T007)
- [ ] CHK-003 [P0] Empty index, autosync off and no open file under `.opencode/` (T003, T004, T006)
- [ ] CHK-004 [P1] Database and state snapshot exists outside the repository (T008)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `git show -M --name-status --format= "$C2_SHA"` prints only `R100` lines, and their count equals the moved count
- [ ] CHK-011 [P0] `git show --name-only --format= <sha> | grep -c '^specs/'` prints 0 for every phase commit
- [ ] CHK-012 [P1] C0, C1 and C3 each stage only their expected paths
- [ ] CHK-013 [P1] Every commit subject passes `commit-msg`, and C2 and C3 carry bodies
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`
- [ ] CHK-021 [P0] The path map prints no difference, or only the option C kept entries (T037)
- [ ] CHK-022 [P1] Every `--follow` sample reaches history older than C2 (T040)
- [ ] CHK-023 [P1] The link census matches the expected dangling set for the option (T041)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 16 top-level entries is accounted for: moved, or kept in place by phase 004
- [ ] CHK-FIX-002 [P0] Each of the 12 ignored entries is accounted for: travelled, relocated or rebuilt (T030 to T032)
- [ ] CHK-FIX-003 [P0] The root sentinel and the 174 external links resolve through the compatibility shape, or the dangling set is the exact list routed to phase 008
- [ ] CHK-FIX-004 [P1] Evidence is pinned to `C1_SHA`, `C2_SHA` and `C3_SHA`, not to a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No `SPECKIT_ALLOW_MASS_DELETION`, `SPECKIT_MASS_DELETION_THRESHOLD` or `SPECKIT_SKIP_*` variable was set in this phase
- [ ] CHK-031 [P0] Snapshots and census outputs never entered the index
- [ ] CHK-032 [P1] Origin, `MAIN` and the global hook links show no trace of the move (T045)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree on counts and on the commit list
- [ ] CHK-041 [P1] Handoff notes for phases 008, 010 and 011 are in the log (T047)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Census outputs lived only in `scratch/`, under kebab-case names
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet verified. Planned 2026-09-16.
<!-- /ANCHOR:summary -->

---
