---
title: "Tasks: Phase 22: worktree-provision-completeness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "worktree provision completeness tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: worktree-provision-completeness

<!-- SPECKIT_LEVEL: 1 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the fix rows and findings this phase closes with their sources (`../014-post-merge-deep-research/research/research.md`, `../017-post-merge-research-provisioning/research/research.md`) Done: rows 2 (P1, five tracked trees missing from the list), 3 (P1, no completeness guard), 18 (P2, lockfile drift untested), 27 (P3, a `bun.lockb` package falls to npm) and 29 (P3, a listed path with no `package.json` is skipped silently), with findings F1, F2, F3, F4 and F7, each carry their file, line and verdict. (rows 2, 3, 18, 27, 29)
- [x] T002 Capture the baseline test run before any edit (`scratch/mutation/baseline.txt`) Done: `worktree-naming tests: PASS=97 FAIL=0`, exit 0, on origin/main b0133e893a. (rows 2, 3, 18, 27, 29)
- [x] T003 Confirm the three missing trees fail in a fresh worktree before the edit (`.pi/extensions/pi-cache-optimizer`, `.pi/extensions/pi-fast-mode-w-subagent-support`, `.skilled/skills/sk-design/sk-design-md-generator/backend`) Done: the cache optimizer's suite failed, the fast-mode suite had no vitest, and the backend had 1 failed test, so each failure read as broken code rather than missing dependencies. (row 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the two Pi extensions and the DESIGN.md generator backend to the manifest (`.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`) Done: `.pi/extensions/pi-cache-optimizer`, `.pi/extensions/pi-fast-mode-w-subagent-support` and `.skilled/skills/sk-design/sk-design-md-generator/backend  dist/cli.js` are listed; the backend names `dist/cli.js`, the package's untracked `main`, because the existing build-output guard requires it. (row 2)
- [x] T005 Record the two exclusions and remove the root `.` entry (`.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`) Done: `# excluded:` lines carry reasons for `.skilled/skills/mcp-code-mode/mcp-server` (needs Node 24 for isolated-vm; its `INSTALL-GUIDE.md` owns the install) and `.skilled/skills/mcp-tooling/mcp-obsidian/mcp-servers/obsidian-mcp` (declares no dependencies; runs through npx); the root `.` is gone because the root has had no `package.json` since commit e84663a8c5, so it installed nothing and would only raise the new warning; the list holds 14 entries. (row 2)
- [x] T006 Update the security note's count and lockfile sentence (`SECURITY.md` line 95) Done: it says "fourteen" listed trees and names `bun.lockb` beside `bun.lock`. (row 2)
- [x] T007 Add the completeness guard and its two tests (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`) Done: `provision_list_gaps` compares `git ls-files` `package.json` files under `.skilled`, `.opencode` and `.pi` with the listed and excluded paths, printing `stale: <path>` and `unlisted: <path>`; the real list reports no gaps, and a copy missing the cache optimizer plus a bogus `no/such/pkg` reports both. (row 3)
- [x] T008 Log installer output and report lockfile drift (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `provision_worktree`) Done: the install writes to a temporary log instead of being discarded, `--silent` is dropped because npm's silent level hides the error lines, a failure prints up to four error lines, and drift prints `lockfile drift: package.json and its lockfile disagree; run npm install in <pkg> and commit the lockfile`; it reports rather than repairs, because a repair would rewrite a committed lockfile without review. (row 18)
- [x] T009 Select bun for a binary lockfile (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `provision_worktree`) Done: a `bun.lock` or `bun.lockb` with no `package-lock.json` selects bun and the package's own `node_modules`, and the fixture installs with bun once and never reaches npm. (row 27)
- [x] T010 Warn when a listed path lost its manifest (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `provision_worktree`) Done: the run prints `WARNING: <pkg> is listed but has no package.json; skipped` on stderr and still exits 0; the fixture is a tree whose listed directory lacks a `package.json`. (row 29)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the new tests against the old script and the old list (`scratch/mutation/old-code-run.txt`) Done: the 8 tests that check new behaviour fail on the old code (`PASS=101 FAIL=8`, exit 1, and the completeness test lists `stale: .` and exactly the five unlisted trees, `scratch/mutation/old-code-run.txt`); the tests that check kept behaviour (drift and a missing manifest still fail or pass provisioning as before) pass on both; and the set -e test guards a regression in this change's own first version, so its mutation is the new script minus `|| true` (`scratch/mutation/no-pipefail-guard-run.txt`, PASS=108 FAIL=1). (rows 2, 3, 18, 27, 29)
- [x] T012 Run the new tests against the new script and the new list (`scratch/mutation/new-code-run.txt`) Done: `PASS=109 FAIL=0`, exit 0. (rows 2, 3, 18, 27, 29)
- [x] T013 Run real npm against a drifted lockfile (`scratch/mutation/real-npm-drift.txt`) Done: npm 11.19.1 fails `npm ci` with the in-sync error, provisioning prints the drift message and the missing-manifest warning, and the run exits 1. (rows 18, 29)
- [x] T014 Provision a fresh clone with only the CI toolchain (`git clone --no-hardlinks`, `provision_worktree "$PWD"`) Done: with only Node 22.23.1 and bun 1.3.9 on `PATH`, the run reports 11 installed, 5 built, 3 already present, 0 failed, exit 0, in 43 s, then the three suites pass 118, 81 and 176 (`scratch/mutation/fresh-clone.txt`, from `scratch/mutation/fresh-clone.sh`). (row 2)
- [x] T015 Run the three added trees' suites after provisioning (`.pi/extensions/pi-cache-optimizer`, `.pi/extensions/pi-fast-mode-w-subagent-support`, `.skilled/skills/sk-design/sk-design-md-generator/backend`) Done: the cache optimizer passes 118 tests, the fast-mode extension 81 and the backend 176. (row 2)
- [x] T016 Hold the error-line pipeline open under CI's `set -euo pipefail` (`.skilled/skills/sk-git/scripts/worktree-naming.sh`, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`) Done: review round 1 found that a failed install whose captured log holds no "error" line ended the shell before the summary, because the error-line pipeline returned non-zero under `set -e`; the pipeline now ends with `|| true`, and the new test "a silent install failure under set -e reaches the summary" fails without it: `PASS=108 FAIL=1`, exit 1, the failing test being that one (`scratch/mutation/no-pipefail-guard-run.txt`). (row 18)
- [x] T017 [P] Fill this folder's records and the parent phase rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`) Done: every placeholder replaced, the phase 22 row names the complete list, guard, drift and missing-manifest work, and the 021-to-022 handoff row carries 021 being on main plus the 109-test suite and the 14-tree fresh clone. Evidence: this folder's four documents and `../spec.md`. (rows 2, 3, 18, 27, 29)
- [x] T018 Run strict validation of this folder (`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/022-worktree-provision-completeness --strict`) Done: RESULT: PASSED. (rows 2, 3, 18, 27, 29)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
