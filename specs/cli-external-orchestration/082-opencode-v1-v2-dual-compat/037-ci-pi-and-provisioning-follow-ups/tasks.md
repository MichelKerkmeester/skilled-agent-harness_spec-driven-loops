---
title: "Tasks: Phase 37: ci-pi-and-provisioning-follow-ups"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ci pi and provisioning follow ups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 37: ci-pi-and-provisioning-follow-ups

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

- [x] T001 Read the cite-drift failure (`.github/workflows/sk-doc-script-tests.yml`) Done: run 39424650739 attempt 1 failed `test-cite-drift-scan.mjs` with `# fail 1` and no subtest named; attempt 2 passed at the same commit.
- [x] T002 Record baselines (this folder) Done: worktree-naming 157, battery unit 50, pi-cache-optimizer 118, pi-fast-mode 81; both extensions' `typecheck` exits 0 locally; pi-cache-optimizer's `check:pack` exits 0 and pi-fast-mode defines none.
- [x] T003 List workflows missing from the README tables (`.github/workflows/README.md`) Done: three missing from the contents table and seven from the push versus pull-request table, out of 32.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Discover Pi extensions and add type and pack steps (`.github/workflows/pi-extension-tests.yml`) Done: a `discover` job feeds the matrix; each leg runs the required `npm test`, then `npm run --if-present typecheck` and `npm run --if-present check:pack`.
- [x] T005 [P] List every workflow in the README (`.github/workflows/README.md`) Done: rows for `dependabot-auto-merge.yml`, `message-contract.yml` and `opencode-dual-version.yml`, the Pi row rewritten, and seven workflows added to the push versus pull-request table.
- [x] T006 [P] Fingerprint before the build (`.skilled/skills/sk-git/scripts/worktree-naming.sh`) Done: `provision_worktree` keeps the fingerprint taken before the build; `_wn_record_build` writes it after a successful build.
- [x] T007 [P] Test a build that edits its own source (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`) Done: five expectations; 157 to 162.
- [x] T008 [P] Run the battery through a symlinked nested root (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`) Done: one test; 50 to 51.
- [x] T009 Pin the TAP reporter (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`) Done: `node --test-reporter=tap` for the listed node tests.
- [x] T010 Record the cite-drift evidence (`scratch/cite-drift-evidence.txt`) Done: 170 local runs and 58 CI executions, each suspected cause with the reason it is not supported.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the suites Done: worktree-naming PASS=162 FAIL=0, battery 51 of 51, pi-cache-optimizer 118 of 118, pi-fast-mode 81 of 81, sk-doc runner four node tests PASS.
- [x] T012 Mutate each change Done: the old stamp order fails 2 expectations; dropping `realpathSync` in ancestor detection fails 2 battery tests; a failing node:test fixture prints 0 `not ok` lines on Node 26 without the pin and 1 with it.
- [x] T013 Dry-run discovery Done: the repository lists two extensions; a fixture with a third extension and a `lib` folder lists three; an empty folder exits 1 with `::error::`.
- [x] T014 Provision the real worktree twice Done: with stamps moved aside five outputs rebuild, the next provision builds nothing, and the new stamps equal the old ones.
- [x] T015 Run actionlint and the gate-inputs check Done: both exit 0; gate inputs `RESULT: PASSED`.
- [x] T016 Check the README tables Done: all 32 workflows appear in the contents table and exactly once in the push versus pull-request table; `validate_document.py` 0 issues.
- [ ] T017 Validate the packet strict and confirm the CI handoff (`.github/workflows/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
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
