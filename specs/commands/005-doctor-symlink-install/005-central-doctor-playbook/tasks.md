---
title: "Tasks: Phase 5: central-doctor-playbook"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "central doctor playbook tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: central-doctor-playbook

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

**Paths**: `P` is `.skilled/manual-testing-playbook/doctor-commands/`. `S` is `.skilled/skills/`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

A setup task records a baseline, so its Verify line names the command that ran and the output it printed then. Every other task is re-runnable from the current tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the doctor scenarios each skill package holds (`S/*/manual-testing-playbook/doctor-commands/`). Verify: the scan printed 57 scenario files, split system-spec-kit 21, system-skill-advisor 14, sk-git 7, sk-code 6, mcp-code-mode 5 and system-deep-loop 4.
- [x] T002 Confirm the central package folder holds no scenario yet (`.skilled/manual-testing-playbook/`). Verify: `ls .skilled/manual-testing-playbook` printed only `doctor-commands` and `manual-testing-playbook.md`.
- [x] T003 [P] Record the link baseline inside the six playbook packages (`S/*/manual-testing-playbook/`). Verify: the link scan printed 314 links to rewrite.
- [x] T004 [P] Read the validator, the fail-closed allowlist and the discovery test before any file moves (`S/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`, `S/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`, `S/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs`). Verify: `ls` printed all three paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Package and guide

- [x] T005 Write the package root (`.skilled/manual-testing-playbook/manual-testing-playbook.md`). Verify: `ls .skilled/manual-testing-playbook/manual-testing-playbook.md` prints the path.
- [x] T006 Merge the six old category guides into the one environment guide (`P/README.md`). Verify: `rg -n '^## ' P/README.md` prints the guide headings.
- [x] T007 Archive the old category READMEs outside the package (`scratch/old-doctor-readmes/`). Verify: `ls specs/commands/005-doctor-symlink-install/005-central-doctor-playbook/scratch/old-doctor-readmes` lists the archived guides.

### Move the 57 scenarios

- [x] T008 Move the 21 system-spec-kit scenarios (`git mv S/system-spec-kit/manual-testing-playbook/doctor-commands/*.md P/`). Verify: `ls -d S/system-spec-kit/manual-testing-playbook/doctor-commands` prints no such directory.
- [x] T009 Move the 14 system-skill-advisor scenarios (`git mv S/system-skill-advisor/manual-testing-playbook/doctor-commands/*.md P/`). Verify: `ls -d S/system-skill-advisor/manual-testing-playbook/doctor-commands` prints no such directory.
- [x] T010 Move the 7 sk-git scenarios (`git mv S/sk-git/manual-testing-playbook/doctor-commands/*.md P/`). Verify: `ls -d S/sk-git/manual-testing-playbook/doctor-commands` prints no such directory.
- [x] T011 Move the 6 sk-code scenarios (`git mv S/sk-code/manual-testing-playbook/doctor-commands/*.md P/`). Verify: `ls -d S/sk-code/manual-testing-playbook/doctor-commands` prints no such directory.
- [x] T012 Move the 5 mcp-code-mode scenarios (`git mv S/mcp-code-mode/manual-testing-playbook/doctor-commands/*.md P/`). Verify: `ls -d S/mcp-code-mode/manual-testing-playbook/doctor-commands` prints no such directory.
- [x] T013 Move the 4 system-deep-loop scenarios (`git mv S/system-deep-loop/manual-testing-playbook/doctor-commands/*.md P/`). Verify: `ls -d S/system-deep-loop/manual-testing-playbook/doctor-commands` prints no such directory.
- [x] T014 Rewrite the links inside the moved scenarios (`P/*.md`). Verify: the sweep printed `rewritten 314 unresolved 0`.
- [x] T015 Rewrite the links in the seven files outside the package that pointed at a moved scenario. Verify: the sweep printed seven files rewritten.

### Ids and new scenarios

- [x] T016 Renumber the first colliding id from DOC-393 to DOC-400 (`P/doctor-helper-read-only-pick.md`). Verify: `rg -n 'Playbook ID: DOC-400' P/doctor-helper-read-only-pick.md` prints one line.
- [x] T017 Renumber the second colliding id from DOC-394 to DOC-401 (`P/doctor-helper-writing-handoff.md`). Verify: `rg -n 'Playbook ID: DOC-401' P/doctor-helper-writing-handoff.md` prints one line.
- [x] T018 Write DOC-402 for the sk-skill check command (`P/doctor-sk-skill-check.md`). Verify: `rg -c 'Playbook ID: DOC-402' P/doctor-sk-skill-check.md` prints 1.
- [x] T019 Write DOC-403 for the sk-skill convert command (`P/doctor-sk-skill-convert.md`). Verify: `rg -c 'Playbook ID: DOC-403' P/doctor-sk-skill-convert.md` prints 1.
- [x] T020 Write DOC-404 for the agents-md check command (`P/doctor-agents-md-check.md`). Verify: `rg -c 'Playbook ID: DOC-404' P/doctor-agents-md-check.md` prints 1.
- [x] T021 Write DOC-405 for the agents-md embed-restore command (`P/doctor-agents-md-embed-restore.md`). Verify: `rg -c 'Playbook ID: DOC-405' P/doctor-agents-md-embed-restore.md` prints 1.

### Skill indexes

- [x] T022 Drop the doctor rows from the advisor index and correct its count to 48 scenarios across 9 categories (`S/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n '48 deterministic scenario files across 9 categories' S/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` prints one line.
- [x] T023 Drop the doctor rows from the sk-code index and correct its counts to 17/8/25 (`S/sk-code/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n '17|8|25' S/sk-code/manual-testing-playbook/manual-testing-playbook.md` prints the count line.
- [x] T024 Drop the doctor rows from the mcp-code-mode index and correct its counts to 27/8 (`S/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n '27|8' S/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` prints the count line.
- [x] T025 Drop the doctor rows from the sk-git index, taking it from nine categories to eight (`S/sk-git/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n '9 categories' S/sk-git/manual-testing-playbook/manual-testing-playbook.md` prints no matches.
- [x] T026 Drop the doctor rows from the spec-kit index, taking eleven listed categories to ten (`S/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n '11 categories' S/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` prints no matches.
- [x] T027 Point each of the six indexes at the central package (`S/*/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -l 'manual-testing-playbook' S/*/manual-testing-playbook/manual-testing-playbook.md` prints six paths.

### Catalogs and validator

- [x] T028 Re-point the four feature-catalog link sets at the central scenarios (`S/sk-code/feature-catalog/quality-gate/codebase-agnostic-quality-gate.md`, `S/sk-code/feature-catalog/doctor-commands/ci-workflow-doctor-and-switches.md`, `S/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md`, `S/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`). Verify: `rg -l 'manual-testing-playbook/doctor-commands'` over those four files prints all four paths.
- [x] T029 Teach `validate-playbook-package.cjs` to discover the central package (`S/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`). Verify: `node S/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` printed `PASS`.
- [x] T030 Name the package in the fail-closed allowlist (`S/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`). Verify: `rg -n 'manual-testing-playbook' S/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` prints one line.
- [x] T031 Add the discovery test that fails when the central package drops out (`S/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs`). Verify: `node --test S/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` exits 0.

### Dependent fixtures

- [x] T032 Regenerate the leaf manifests and leaf aliases for mcp-code-mode, sk-git and system-skill-advisor (`S/mcp-code-mode/leaf-manifest.json`, `S/sk-git/leaf-manifest.json`, `S/system-skill-advisor/leaf-manifest.json`). Verify: each manifest generator's `--check` exits 0.
- [x] T033 Move the advisor playbook expectations to 48 scenarios across 9 categories (`S/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts`). Verify: `npx vitest run tests/manual-testing-playbook.vitest.ts` from the advisor runtime exits 0.
- [x] T034 Walk the central package in the provenance test and update the spec-kit fixtures (`S/system-spec-kit/runtime/cli/tests/playbook-provenance-paths.vitest.ts`, `S/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts`). Verify: `npx vitest run --config ../../vitest.config.ts --project cli tests/workflow-invariance.vitest.ts tests/playbook-provenance-paths.vitest.ts` printed 2 files, 5 tests passed.
- [x] T035 Regenerate the sk-doc code-folder fixtures and the trigger index (`S/sk-doc`, `S/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: `node S/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` printed `stale documents: 0`.

### Closeout corrections

- [x] T036 Add the nine missing `Provenance:` lines: the seven moved advisor routing and setup scenarios, the category README and the package root (`.skilled/manual-testing-playbook/manual-testing-playbook.md`, `P/README.md`). Verify: `rg --files-without-match 'Provenance:' P/*.md P/README.md .skilled/manual-testing-playbook/manual-testing-playbook.md` prints nothing and exits 1.
- [x] T037 Correct the setup scenario's target-row count from 19 to 25 (`P/doctor-setup-run.md`). Verify: `rg -n '25 rows' P/doctor-setup-run.md` prints line 29.
- [x] T038 Correct the advisor index line that still said 62 scenario files (`S/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n 'all 62 scenario files' S/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` prints no matches.
- [x] T039 Revert the link rewrite inside the released changelog (`S/sk-code/changelog/v3.9.23.0.md`). Verify: `git diff --stat S/sk-code/changelog/v3.9.23.0.md` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run the package validator (`S/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook`). Verify: it printed `PASS`, `scenarios=61`, `violations=0 warnings=12`, exit 0.
- [x] T041 Run the no-argument fleet run. Verify: exit 0 with 52 PASS and 4 SKIP, and the only verdict difference from main is the new `PASS package=.skilled/manual-testing-playbook` line.
- [x] T042 Count duplicate `DOC-` ids across the package (`P/*.md`). Verify: the count printed 0.
- [x] T043 Prove no skill keeps a doctor-commands folder (`S/*/manual-testing-playbook/doctor-commands`). Verify: `ls -d S/*/manual-testing-playbook/doctor-commands` printed no matches.
- [x] T044 Count command coverage across the central scenarios (`P/`). Verify: the list named all 16 doctor commands, `install 1` and `symlink 2` among them.
- [x] T045 Run the spec-kit provenance and invariance suites (`S/system-spec-kit/runtime/cli`). Verify: 2 files, 5 tests passed.
- [x] T046 Run the advisor playbook and scorer suites (`S/system-skill-advisor/runtime`). Verify: 2 files, 23 tests passed.
- [x] T047 Run the Python advisor harness (`S/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`). Verify: `pass=89, fail=0`.
- [x] T048 Prove the trigger index is current (`generate-trigger-index.mjs --check`). Verify: `stale documents: 0`, exit 0.
- [x] T049 Prove every mirror, prompt and bridge is current (`sync-runtime-mirrors.cjs --check`, the three prompt syncs, `derive-command-bridges.cjs --check`). Verify: `211 mirrors across 9 trees are in sync`, `43 prompts are in sync` from each prompt generator, and `"status": "fresh"` from the deriver.
- [x] T050 Run the route and phrase probes (`route-validate.sh`, `doctor-phrase-reach.cjs`). Verify: `OK: 28 routes validated, 10 warnings` and `STATUS=OK phrases=184 bridges=32`.
- [x] T051 Fill this packet's docs and strict-validate it (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/005-central-doctor-playbook --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — the runs recorded in `../scratch/verification-evidence.md`, section Phase 005
- [x] `validate-playbook-package.cjs --package .skilled/manual-testing-playbook` prints `PASS` with `violations=0`, and the fleet run prints the package line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `../scratch/verification-evidence.md`, section Phase 005
- **Archived guides**: See `scratch/old-doctor-readmes/`
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

- [x] CHK-001 [P0] The move target and the six source packages are named before any file moves. See T001 and T002.
- [x] CHK-002 [P0] The validator, the allowlist and the discovery test are read first, so the package never exists without a gate that sees it. See T004.
- [x] CHK-003 [P1] The link baseline is recorded, so an unresolved link can be told from one that never existed. See T003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited JSON file parses. Verify: `node -e "require('./.skilled/skills/sk-git/leaf-manifest.json'); require('./.skilled/skills/sk-git/leaf-aliases.json')"` exits 0.
- [x] CHK-011 [P0] No two central scenarios share a `DOC-` id. See T042.
- [x] CHK-012 [P1] Every central scenario and both index files carry a `Provenance:` line. See T036.
- [x] CHK-013 [P1] Every link inside the moved scenarios resolves. See T014.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria closed. Verify: every row in `acceptance-criteria.md` reads `Met`.
- [x] CHK-021 [P0] The central package validates. See T040.
- [x] CHK-022 [P0] The fleet run sees the package. See T041.
- [x] CHK-023 [P1] Each of the 16 doctor commands is covered. See T044.
- [x] CHK-024 [P1] The dependent suites pass. See T045, T046 and T047.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No moved or new scenario carries a credential. Verify: `rg -n 'sk-[A-Za-z0-9]{16,}|ghp_' .skilled/manual-testing-playbook | wc -l` prints 0.
- [x] CHK-031 [P0] The move adds no executable step, so no scenario widens what a check writes. A scenario is a manual procedure, and the validator counts operator steps, not writes.
- [x] CHK-032 [P1] The 12 unresolved-example warnings are recorded rather than hidden. See T040.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet states one scenario count, 61, and each doc agrees. Verify: `rg -n '61' spec.md tasks.md acceptance-criteria.md implementation-summary.md` prints a line from each file.
- [x] CHK-041 [P1] The six skill indexes point at the central package. See T027.
- [x] CHK-042 [P2] The catalogs stayed in their skills and only their links moved. See T028.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The old guides live in this packet's `scratch/` and nowhere else. Verify: `ls specs/commands/005-doctor-symlink-install/005-central-doctor-playbook/scratch/old-doctor-readmes` lists the archived guides.
- [x] CHK-051 [P1] No skill playbook keeps a leftover doctor-commands folder. See T043.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-31
<!-- /ANCHOR:summary -->

---
