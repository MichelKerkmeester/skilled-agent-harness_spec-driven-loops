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

**Executors**: `[ORC]` is the orchestrator. `[DSF]` is DeepSeek V4.1 Flash on the parent's lanes, read-only, re-checked by the orchestrator in T044. `WT`, `MAIN`, `C1_SHA` and `C2_SHA` are defined in `plan.md`. Tasks that change the index run one at a time. The read-only units ran in parallel after C2, with `GIT_OPTIONAL_LOCKS=0`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Pre-move checks. Nothing here changes a tracked file.

- [x] T001 [ORC] Read phase 004's frozen layout decision, record option A, B or C, the keep-list and the rollback boundary in the log, then halt if 004 froze none (`../004-migration-design/`)
- [x] T002 [ORC] Confirm phases 003 to 006 print `RESULT: PASSED` from `MAIN`'s `validate.sh --strict` and that 006's suites pass against both roots (`../spec.md:145`)
- [x] T003 [ORC] Confirm `git diff --cached --quiet` exits 0, `git status --porcelain --untracked-files=no` prints nothing and `git status --porcelain --untracked-files=all -- .opencode .skilled` prints nothing
- [x] T004 [ORC] Confirm `SPECKIT_AUTOSYNC` is unset or `0` in the executing shell, and carry `SPECKIT_AUTOSYNC=0` on every commit of this phase (`.opencode/scripts/git-hooks/post-commit:32-56`)
- [x] T005 [ORC] Check `git rev-list --count HEAD..skilled/v4.0.0.0` prints 0, or integrate `skilled/v4.0.0.0` first and repeat T003
- [x] T006 [ORC] Confirm `lsof -nP | grep -F "$WT/.opencode/"` prints nothing, so no daemon holds a file inside the tree
- [x] T007 [ORC] Write `PRE_MOVE_SHA`, the R1 to R3 rollback commands and the output of `readlink ~/.config/git/hooks/*` into the log before any state change (`goal.md`)
- [x] T008 [ORC] Snapshot `skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite` and `skills/.state/advisor/skill-graph-generation.json` to a dated directory outside the repository
- [x] T009 [ORC] Read `cli-pi/SKILL.md` and the child preamble before composing the first unit brief (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:189-217`)
- [x] T010 [DSF] Unit `pre-move-baseline`: tracked count per top-level entry, link classes, dangling links across `.opencode`, the six runtime directories and `specs`, ignored entries and empty-blob count (`scratch/pre-move-baseline.tsv`)
- [x] T011 [ORC] Re-run `git ls-files .opencode | wc -l` and the dangling count, and compare T010 with the authoring baseline: 17,767 files, 16 entries, 208 links, 8 dangling (4 inside the tree, 4 under `specs/`), 12 ignored entries, 10 empty-blob files (measured at `048d16d725`: 17,773 files and 18 ignored entries, the rest as at authoring)
- [x] T012 [ORC] Confirm `git ls-files .skilled` prints only the placeholder path and `find .skilled -mindepth 1` prints only that path and its directory
- [x] T013 [ORC] Run `git check-ignore -v --no-index` on the old path of every ignored entry from T010, and schedule T015 when any match comes from a root rule anchored at `.opencode/` (`.gitignore:108` at authoring)
- [x] T014 [ORC] Record `grep -c skilled "$MAIN/.opencode/scripts/git-hooks/pre-commit"` in the log, 0 at authoring
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Move and compatibility shape. Commands and expected output are in `plan.md` §4 Phase 2.

- [x] T015 [ORC] Conditional C0: add `.skilled/` twins of the 56 anchored rules, `git add -- .gitignore`, confirm only `M .gitignore` is staged, commit (`.gitignore`). Not needed: T013 found every ignored entry covered at its `.skilled/` path
- [x] T016 [ORC] C1: `git rm` the placeholder, confirm one `D` line, commit and record `C1_SHA` (`.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`)
- [x] T017 [ORC] Confirm `.skilled` is absent or empty on disk, then `mkdir -p .skilled`
- [x] T018 [ORC] `move_entry skills`, expect 17,185 matching lines and an empty diff (`.skilled/skills`)
- [x] T019 [ORC] `move_entry hooks`, expect 179 (`.skilled/hooks`)
- [x] T020 [ORC] `move_entry commands`, expect 162 (`.skilled/commands`)
- [x] T021 [ORC] `move_entry bin`, expect 98 (`.skilled/bin`)
- [x] T022 [ORC] `move_entry changelog`, expect 49 (`.skilled/changelog`)
- [x] T023 [ORC] `move_entry plugins`, expect 41 (`.skilled/plugins`)
- [x] T024 [ORC] `move_entry scripts`, expect 30 (`.skilled/scripts`)
- [x] T025 [ORC] `move_entry agents`, expect 13 (`.skilled/agents`)
- [x] T026 [ORC] `move_entry install-guides` then `move_entry logs`, expect 9 and 1 (`.skilled/install-guides`, `.skilled/logs`)
- [x] T027 [ORC] `move_entry` for `package.json`, `package-lock.json`, `bun.lock` and `vitest.config.bin.ts`, expect 1 each
- [x] T028 [ORC] `move_entry` for the links `manual-testing-playbook` and `specs`, expect 1 each
- [x] T029 [ORC] Whole-index gate: only `R100` with the moved count, `grep -c '^specs/'` on the staged names prints 0, `git ls-files -- .opencode | wc -l` prints 0 or the option C kept count
- [x] T030 [ORC] Census `git ls-files --others --ignored --exclude-standard --directory -- .opencode .skilled` and record, for each of the 18 ignored entries, whether it travelled or stayed
- [x] T031 [ORC] Move dependency trees and local state left at old paths with plain `mv`, prove each dependency tree with `npm ls --depth=0` and fall back to `npm ci`
- [x] T032 [ORC] Rebuild by canonical path with `npm run build` in `.skilled/skills/system-spec-kit` and `.skilled/skills/system-skill-advisor/runtime`, then confirm `git status --porcelain --untracked-files=all -- .skilled .opencode` prints nothing
- [x] T033 [ORC] Build the option's compatibility shape on disk without staging it, and confirm `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0 under A and B or the keep-list resolves under C (`.opencode`)
- [x] T034 [ORC] Run phase 005's independent move check on the working tree and record output and exit status
- [x] T035 [ORC] Stage the link by explicit path, confirm 17,773 `R100` lines plus one `A` line with mode `120000` and no ignore match, then commit C2 with `SPECKIT_AUTOSYNC=0`, the planned subject and a body, stderr to `scratch/commit-c2-hooks.txt`, and record exit status, `C2_SHA` and the `Commit-Id:` trailer state, halting on any block
- [x] T036 [ORC] Folded into T035 by the operator's single-commit choice on 2026-09-17: the link is staged and committed with the renames, and no C3 exists
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verification and handoff.

- [x] T037 [DSF] Unit `path-map-diff`: compare `C1_SHA:.opencode` with `C2_SHA:.skilled` by mode, blob id and prefix-rewritten path, expecting no difference or only the kept entries (`scratch/path-map-diff.txt`)
- [x] T038 [DSF] Unit `r-status-census`: count `git show -M --name-status --format= "$C2_SHA"` by status and by top-level entry (`scratch/r-status-census.tsv`)
- [x] T039 [DSF] Unit `old-prefix-scan`: `git ls-files -- .opencode` and `git ls-tree -r --name-only HEAD -- .opencode`, expecting only the compatibility entries (`scratch/old-prefix-scan.txt`)
- [x] T040 [DSF] Unit `follow-samples`: commit counts with and without `--follow` for one unique-content path per moved entry (`scratch/follow-samples.tsv`)
- [x] T041 [DSF] Unit `link-census`: dangling mode-120000 entries under `.skilled`, `.opencode`, the six runtime directories and `specs`, expecting 8 under options A and B (`scratch/link-census.tsv`)
- [x] T042 [DSF] Unit `push-ceiling-count`: `git diff --name-only --diff-filter=D <remote tip or merge base> HEAD | wc -l`, expecting 1 from this phase's own commits (`scratch/push-ceiling-count.txt`)
- [x] T043 [DSF] Unit `naming-guard-preview`: `python3 .skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since "$C1_SHA"`, keeping `.skilled/` lines, expecting no offender because phase 005 lets a rename that keeps its basename pass, against 4 names at authoring (`scratch/naming-guard-preview.txt`)
- [x] T044 [ORC] Recompute each unit's headline number, reject any unit that differs and log the discard reason
- [x] T045 [ORC] After `git fetch origin`, confirm `git branch -r --contains "$C2_SHA"` prints nothing, `git -C "$MAIN" merge-base --is-ancestor "$C2_SHA" HEAD` exits 1 and the hook links match T007
- [x] T046 [ORC] Under option A or B, record whether `git add --dry-run -- .opencode/skills/sk-git/SKILL.md` is refused, for phase 009
- [x] T047 [ORC] Copy evidence into the log and `acceptance-criteria.md`, write the handoff notes for phases 008, 010 and 011, then remove the census outputs from `scratch/`
- [x] T048 [ORC] Run `MAIN`'s `repair-derived.cjs --folder <this folder> --apply`, then `MAIN`'s `validate.sh <this folder> --strict`, requiring `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 48 tasks marked `[x]`, or T015 marked as not needed with T013's evidence
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is `Met`
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

- [x] CHK-001 [P0] Phase 004's option, keep-list and rollback boundary recorded (T001) [EVIDENCE: `goal.md` log row "Pre-move checks", option A (L1), no entry kept in place]
- [x] CHK-002 [P0] `PRE_MOVE_SHA` and the rollback commands in the log before C1 (T007) [EVIDENCE: `goal.md` log row "Rollback record", `PRE_MOVE_SHA=048d16d725bb698fe540b95f5ef9884e17c2591f`, and `git cat-file -e` exits 0]
- [x] CHK-003 [P0] Empty index, autosync off and no open file under `.opencode/` (T003, T004, T006) [EVIDENCE: the baseline and both commit stages checked `git diff --cached --quiet` and `lsof`, and both commits ran with `SPECKIT_AUTOSYNC=0`]
- [x] CHK-004 [P1] Database and state snapshot exists outside the repository (T008) [EVIDENCE: `goal.md` log row "Snapshot"]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `git show -M --name-status --format= "$C2_SHA"` prints only `R100` lines apart from the link's `A` line, and their count equals the moved count [EVIDENCE: `ec33385ae5` counts `1 A` and `17773 R100`]
- [x] CHK-011 [P0] `git show --name-only --format= <sha> | grep -c '^specs/'` prints 0 for every phase commit [EVIDENCE: 0 for `a06f17bf52` and 0 for `ec33385ae5`]
- [x] CHK-012 [P1] C1 and C2 each stage only their expected paths, with no C0 and no C3 [EVIDENCE: C1 staged one `D` line, C2 staged 17,773 `R100` lines and one `A` line]
- [x] CHK-013 [P1] Every commit subject passes `commit-msg`, and C2 carries a body [EVIDENCE: both commits exited 0, and C2's body names the entry count, the file count and the link]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met` [EVIDENCE: 12 of 12]
- [x] CHK-021 [P0] The path map prints no difference, or only the option C kept entries (T037) [EVIDENCE: `scratch/path-map-diff.txt` counted 17,773 on each side and 0 differences, and AC-003's command re-run printed nothing]
- [x] CHK-022 [P1] Every `--follow` sample reaches history older than C2 (T040) [EVIDENCE: 16 of 16, two re-runs match]
- [x] CHK-023 [P1] The link census matches the expected dangling set for the option (T041) [EVIDENCE: 8 dangling, the same 8 paths as before the move after the prefix rewrite]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 16 top-level entries is accounted for: moved, or kept in place by phase 004 [EVIDENCE: all 16 moved, each path map identical before the next `git mv`]
- [x] CHK-FIX-002 [P0] Each of the 18 ignored entries is accounted for: travelled, relocated or rebuilt (T030 to T032) [EVIDENCE: 17 travelled, `node_modules` relocated, the four `dist` trees rebuilt in place, and the ignored list matches the census path for path]
- [x] CHK-FIX-003 [P0] The root sentinel and the 174 external links resolve through the compatibility shape, or the dangling set is the exact list routed to phase 008 [EVIDENCE: `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0, and the only dangling tracked links are the 8 that dangled before]
- [x] CHK-FIX-004 [P1] Evidence is pinned to `C1_SHA` and `C2_SHA`, not to a branch-relative range [EVIDENCE: every unit took both SHAs as arguments]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No `SPECKIT_ALLOW_MASS_DELETION`, `SPECKIT_MASS_DELETION_THRESHOLD` or `SPECKIT_SKIP_*` variable was set in this phase [EVIDENCE: the commit stages exported only `SPECKIT_AUTOSYNC=0` and `SPECKIT_COMMIT_SPEC`]
- [x] CHK-031 [P0] Snapshots and census outputs never entered the index [EVIDENCE: neither commit names a `specs/` path, and the snapshot sits outside the repository]
- [x] CHK-032 [P1] Origin, `MAIN` and the global hook links show no trace of the move (T045) [EVIDENCE: AC-006]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree on counts and on the commit list [EVIDENCE: all four name 17,773 files, 18 ignored entries and the two commits]
- [x] CHK-041 [P1] Handoff notes for phases 008, 010 and 011 are in the log (T047) [EVIDENCE: `goal.md` "Handoff notes"]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Census outputs lived only in `scratch/`, under kebab-case names [EVIDENCE: eight kebab-case files, never staged]
- [x] CHK-051 [P1] `scratch/` cleaned before completion [EVIDENCE: only `.gitkeep` remains]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-17, at `ec33385ae5`
<!-- /ANCHOR:summary -->

---
