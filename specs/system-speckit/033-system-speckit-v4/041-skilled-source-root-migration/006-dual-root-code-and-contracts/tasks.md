---
title: "Tasks: Phase 6: dual-root-code-and-contracts"
description: "Ordered tasks with a named executor each. The orchestrator sets up and verifies, and DeepSeek V4.1 Flash max on cli-pi drafts one file per brief for GPT-5.6 on cli-codex to review. A verification checklist follows."
trigger_phrases:
  - "dual root task breakdown"
  - "skilled contract tasks"
  - "layout rehearsal checklist"
  - "deepseek draft gpt review tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: dual-root-code-and-contracts

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
| `{orchestrator}` | Claude Opus orchestrator: design choices, test runs, commits, evidence |
| `{deepseek}` | DeepSeek V4.1 Flash, thinking `max`, on cli-pi through the LLM Gateway, drafting the one file named in its brief |
| `{gpt-5.6}` | GPT-5.6 on cli-codex, read-only review of a component's drafts against their briefs |

**Task Format**: `T### {executor} [P?] Description (file path)`

Component ids (C1 to C15), layouts (`today`, `skilled-only`, `whole-link` and the conditional `entry-links`) and every verification command are defined in `plan.md` §1, §3 and §5. `...` in a path stands for `.opencode/skills/system-spec-kit`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 {orchestrator} Read phase 005's `validate.sh --strict` output for `RESULT: PASSED` and copy phase 004's recorded shape for `.opencode/` into the log. Then run the cli-pi and cli-codex readiness checks their `SKILL.md` files name (`goal.md`)
- [x] T002 {orchestrator} Record the REQ-014 decisions (decided 2026-09-16: all eight join this phase, see `goal.md` log): this phase or phase 009 for each of the five root-discovery twins, and this phase or another for the `install-git-hooks.sh` change, the `.gitignore` twins and the publish step that phase 004's plan assigns here. Amend `spec.md` before T005 for anything that joins (`goal.md`)
- [x] T003 {orchestrator} Record pass, fail and skip counts for every command in `plan.md` §5 at the phase's start commit (`scratch/baseline-counts.md`)
- [x] T004 {orchestrator} Write the rehearsal script: clone the worktree per layout outside it, delete the clone's `.git` pointer, arrange `today`, `skilled-only` and `whole-link` (and `entry-links` if phase 004 selects it), run the whole-tree checks and assert `test ! -e .opencode` in `skilled-only` (`scratch/layout-rehearsal.sh`)
- [x] T005 {orchestrator} Write one brief per drafting task (T006 to T054) with its behavior pairs, test rows and verify command, and decide there whether `detectRepoRoot` becomes a test seam (`scratch/briefs/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C1 Repository root discovery
- [x] T006 {deepseek} [P] Export `SOURCE_ROOT_NAMES`, test the sentinel under each name, hoist above either name (`.../shared/workspace/repo-root.mjs`)
- [x] T007 {deepseek} [P] Declare `SOURCE_ROOT_NAMES` (`.../shared/workspace/repo-root.d.mts`)
- [x] T008 {deepseek} Add the layout axis and the hoist rows (`.../runtime/cli/tests/package-root-parity.vitest.ts`)
- [x] T009 {gpt-5.6} Review T006 to T008 against their briefs
- [x] T010 {orchestrator} Verify C1: parity test, `spec-gate-core.test.mjs`, comment hygiene, then commit the unit

### C6 Workspace identity
- [x] T011 {deepseek} Let either name anchor, derive the root from either anchor and compare roots (`.../runtime/cli/utils/workspace-identity.ts`)
- [x] T012 {deepseek} Add `skilled-only` nested, `whole-link`, placeholder and unrelated-repository rows (`.../runtime/cli/tests/workspace-identity.vitest.ts`)
- [x] T013 {gpt-5.6} Review T011 and T012
- [x] T014 {orchestrator} Verify C6: rebuild `runtime/cli`, run the test, comment hygiene, commit

### C5 Path sanitization
- [x] T015 {deepseek} [P] Add `<cwd>/.skilled` to the default bases (`.../runtime/cli/utils/path-utils.ts`)
- [x] T016 {deepseek} [P] Add `<cwd>/.skilled` to the data-file bases (`.../runtime/cli/loaders/data-loader.ts`)
- [x] T017 {deepseek} [P] Add linked-root accept and reject rows for `sanitizePath` (`.../runtime/cli/tests/test-scripts-modules.js`)
- [x] T018 {deepseek} [P] Add a data-file row under a linked `.skilled` (`.../runtime/cli/tests/test-extractors-loaders.js`)
- [x] T019 {gpt-5.6} Review T015 to T018
- [x] T020 {orchestrator} Verify C5: `npm run test:legacy` in `runtime/cli`, comment hygiene, commit

### C2 to C4 Spec roots, config and folder detection (proof only)
- [x] T021 {deepseek} Add the optional layout parameter to `materializeRootFixture` (`.../runtime/cli/core/spec-root-fixtures.ts`)
- [x] T022 {deepseek} Run R1, R3 and R7 per layout (`.../runtime/cli/tests/spec-root-validation-matrix.vitest.ts`)
- [x] T023 {deepseek} [P] Add per-layout dedupe rows (`.../runtime/cli/tests/spec-root-config-precedence.vitest.ts`)
- [x] T024 {deepseek} [P] Add per-layout approved-root rows (`.../runtime/cli/tests/test-folder-detector-functional.js`)
- [x] T025 {gpt-5.6} Review T021 to T024
- [x] T026 {orchestrator} Verify C2 to C4: the full `tests/spec-root-*.vitest.ts` set and the folder detector runner. A failing row stops for a design decision under D2. Commit

### C7 Advisor workspace root
- [x] T027 {deepseek} [P] Test the sentinel under each name and hoist above either (`.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`)
- [x] T028 {deepseek} [P] Apply the same rule to the lockstep twin, plus the test seam if T005 approved it (`.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`)
- [x] T029 {deepseek} [P] Add layout, look-alike, capped and explicit-sentinel rows (`.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`)
- [x] T030 {deepseek} [P] Add the lockstep row (`.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts`)
- [x] T031 {gpt-5.6} Review T027 to T030
- [x] T032 {orchestrator} Verify C7: rebuild the advisor `dist/`, run both tests, comment hygiene, commit

### C8 MCP code-mode launcher
- [x] T033 {deepseek} Resolve the server directory from `__dirname` (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- [x] T034 {deepseek} Add the stub-server layout case (`.opencode/bin/mcp-code-mode-launcher.test.cjs`)
- [x] T035 {gpt-5.6} Review T033 and T034
- [x] T036 {orchestrator} Verify C8: `node --test`, `node --check`, comment hygiene, commit

### C10 Codex hook installer
- [x] T037 {deepseek} Add the root-normalized ownership key to source identities, the owned check, the orphan test and owned occurrences (`.opencode/bin/install-codex-hooks.mjs`)
- [x] T038 {deepseek} Create the reconcile test across layouts and spellings, writing only temp targets (`.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`)
- [x] T039 {gpt-5.6} Review T037 and T038
- [x] T040 {orchestrator} Verify C10: `node --test`, `node --check`, confirm `~/.codex/hooks.json` is untouched, comment hygiene, commit

### C11 Worktree session launcher
- [x] T041 {deepseek} Resolve the source root per checkout, build shared paths and the database directory from it and warn on a mismatch (`.opencode/bin/worktree-session.sh`)
- [x] T042 {deepseek} Add one fixture per layout, the live `skilled-only` run and the mismatch fixture (`.opencode/bin/tests/worktree-session.test.sh`)
- [x] T043 {gpt-5.6} Review T041 and T042
- [x] T044 {orchestrator} Verify C11: the shell test, `bash -n`, comment hygiene, commit

### C12 Local specs relinker (proof only)
- [x] T045 {deepseek} Create the per-layout relink test (`.opencode/bin/tests/relink-local-specs.test.sh`)
- [x] T046 {gpt-5.6} Review T045
- [x] T047 {orchestrator} Verify C12: run the test, `bash -n`, commit

### C13 No-spec-import guard
- [x] T048 {deepseek} Scan `__dirname`, add the `.skilled/specs` spelling and exit 2 on a zero-file scan (`.opencode/bin/check-no-spec-imports.cjs`)
- [x] T049 {deepseek} Add spelling, spawn and zero-file rows (`.opencode/bin/compiled-routing-foundation.vitest.ts`)
- [x] T050 {gpt-5.6} Review T048 and T049
- [x] T051 {orchestrator} Verify C13: the bin vitest, the three CI calls from `.github/workflows/runtime-no-spec-import.yml:35-42` run by hand, comment hygiene, commit

### C14 Contract drift checker
- [x] T052 {deepseek} Accept both prefixes, compare by a root-normalized key and fall back in `absolutePath` (`.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`)
- [x] T053 {deepseek} Fall back to the other name in `absolutePath` and `outputPathFor` (`.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`)
- [x] T054 {deepseek} Add the `.skilled` header row and the document-spelling regression row (`.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`)
- [x] T055 {gpt-5.6} Review T052 to T054
- [x] T056 {orchestrator} Verify C14: the deep-loop test, `node check-contract-drift.cjs` printing `[CONTRACT DRIFT] OK`, comment hygiene, commit

### C9 and C15 Registrations
- [x] T057 {orchestrator} Add the launch probe for `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.pi/mcp.json` (`scratch/layout-rehearsal.sh`)

### C16 Root-discovery twins, hook installer and ignore rules
- [x] T065 {deepseek} One brief per twin: accept either root segment where the file compares a path segment with `.opencode`, with a test row for `.skilled` and for a `.opencode -> .skilled` link (the five files in `spec.md` §3)
- [x] T066 {deepseek} Treat a link into either root's `scripts/git-hooks/` as owned, and add a test that a reinstall replaces an `.opencode` link rather than skipping it (`.opencode/scripts/install-git-hooks.sh`)
- [x] T067 {deepseek} Add the `.skilled/` twin for every `.gitignore` rule and negation naming `.opencode/`, keeping the originals (`.gitignore`)
- [x] T068 {gpt-5.6} Review T065 to T067
- [x] T069 {orchestrator} Verify C16: each twin's suite, the installer test, and in a rehearsal clone `git ls-files -o -i --exclude-standard --directory | wc -l` unchanged before and after a rehearsed move; comment hygiene; commit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T058 {orchestrator} Rebuild `dist/` with `npm run build` in `.opencode/skills/system-spec-kit` and `.opencode/skills/system-skill-advisor/runtime`, then read `"stale":false` from `dist-freshness.cjs check --package <id> --json` for each rebuilt package
- [x] T059 {orchestrator} Rerun every command from T003 on the final tree and compare with the baseline counts (`scratch/baseline-counts.md`)
- [x] T060 {orchestrator} Run the rehearsal for `today`, `skilled-only` and `whole-link`, plus `entry-links` when phase 004 selects it, against the rebuilt tree (`scratch/rehearsal-results.md`)
- [x] T061 {orchestrator} Run `check-comment-hygiene.sh` on every changed code file and list row counts per test file
- [x] T062 {orchestrator} Confirm the phase diff touches only the files in `spec.md` §3, one commit per component
- [x] T063 {orchestrator} Mark every acceptance criterion with evidence, write `implementation-summary.md`, run `validate.sh --strict` and read `RESULT: PASSED` (`acceptance-criteria.md`)
- [x] T064 {orchestrator} Delete the rehearsal clones, scratch temp files and any `.pytest_cache` left in a skill folder
- [x] T070 {orchestrator} Publish: rebase onto `origin/skilled/v4.0.0.0`, push to `skilled/v4.0.0.0` and `main` (parent D2, rollback written first), fast-forward the main checkout, restart the `code_mode` launcher, then read `validate.sh --strict` from the main checkout and a hook run in a disposable clone (phase 004 step 8) [EVIDENCE: `dadf2d19dd` pushed to both branches as fast-forwards from `cfeba3e1fb`, no rebase needed. The main checkout sits on it, a fresh `code_mode` launcher answered `initialize`, and a commit at `7085ec3290` ran the global hooks with no error line. The running launchers belong to other sessions, so the check spawned a fresh one instead of restarting them. The main-checkout validation of the closing documents follows their push]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every P0 checklist item below verified with evidence
- [x] Rehearsal results recorded for `today`, `skilled-only` and `whole-link`, plus `entry-links` when phase 004 selects it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
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

- [x] CHK-001 [P0] Phase 005's `RESULT: PASSED` is read by content and recorded (T001) [EVIDENCE: `goal.md` log row "Phase 005 gate", read at `cfeba3e1fb`]
- [x] CHK-002 [P0] Phase 004's shape for `.opencode/` is recorded in `goal.md`'s log (T001) [EVIDENCE: `goal.md` log row "Phase 004 shape", ADR-001 Accepted as L1]
- [x] CHK-003 [P0] The REQ-014 decisions cover the five root-discovery twins and the three assignments from phase 004's plan (T002) [EVIDENCE: `goal.md` deviations rows dated 2026-09-16, `spec.md` §3 lists all eight]
- [x] CHK-004 [P1] Baseline counts exist for every command in `plan.md` §5 at the start commit (T003) [EVIDENCE: `scratch/baseline-counts.md`]
- [x] CHK-005 [P1] A brief exists for each drafting task before its dispatch (T005) [EVIDENCE: `scratch/briefs/` holds a brief, payload and return for each of the 85 units, each committed with its unit]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `check-comment-hygiene.sh` passes on the 13 changed source files and every changed test file [EVIDENCE: `check-comment-hygiene.sh` over the 50 code files in `git diff cfeba3e1fb dadf2d19dd`: 0 violations. It skips the workflow, `.gitignore` and the two `.d.mts` files by type, and their added comments hold no id or spec path]
- [x] CHK-011 [P0] `node --check` passes on each changed `.cjs` and `.mjs`, and `bash -n` on each changed `.sh` [EVIDENCE: `node --check` or `bash -n` passes on all 20 changed `.cjs`, `.mjs`, `.js` and `.sh` files at `dadf2d19dd`, and `py_compile` on both changed Python files]
- [x] CHK-012 [P0] `npm run typecheck` passes in `.opencode/skills/system-spec-kit` and in `.opencode/skills/system-skill-advisor/runtime` [EVIDENCE: both typechecks exit 0 in the final pass at `dadf2d19dd`]
- [x] CHK-013 [P1] New files use kebab-case names: `install-codex-hooks-source-root.test.cjs` and `relink-local-specs.test.sh` [EVIDENCE: the four new files are `install-codex-hooks-source-root.test.cjs`, `relink-local-specs.test.sh`, `skill-advisor-cli-repo-paths.vitest.ts` and `capture-ledger-workspace-root.vitest.ts`]
- [x] CHK-014 [P1] Each draft touched only the file its brief named, confirmed from the unit's diff [EVIDENCE: every unit's scope check passed, per unit before the lanes widened and per batch after. The one scope stop came from the orchestrator's own write during a dispatch, and one LLM Gateway dispatch that wrote nothing was caught as a mismatch and re-run, both recorded in `goal.md`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every command in `plan.md` §5 passes in `today`, with counts equal to the baseline plus the added rows [EVIDENCE: final pass at `dadf2d19dd`: b01 64 tests (21 at baseline), b02 74 (56), b03 266/0/5 and 268/0/6 (262/0/5 and 267/0/6), b04 28 passed (14), b05 39 (26), b06 23 pass and 3 skipped (1 and 3), b07 37 (25), b08 23 over two files (8 over one), b09 PASS=41 (25), b10 PASS=21 (absent), b11 87/0/3 (87/0/3), b12 and b13 exit 0, b14 `[CONTRACT DRIFT] OK commands=3`, b15 exits 0, 1 and 0]
- [x] CHK-021 [P0] The drift checker prints `[CONTRACT DRIFT] OK` in the `skilled-only` and `whole-link` clones [EVIDENCE: `scratch/rehearsal-results.md` records `[CONTRACT DRIFT] OK commands=3` for `skilled-only` and `whole-link`]
- [x] CHK-022 [P0] The guard's default scan exits 1 beside the seeded import in `today`, `skilled-only` and `whole-link` [EVIDENCE: `scratch/rehearsal-results.md` records exit 1 naming the seeded import through each entry name in all three layouts]
- [x] CHK-023 [P0] `test ! -e .opencode` holds in the `skilled-only` clone after the suites run [EVIDENCE: `scratch/rehearsal-results.md` row `test ! -e .opencode` passes in the `skilled-only` clone after its checks]
- [x] CHK-024 [P0] Each of the six silent failures in `spec.md` SC-002 has a row that fails on `728c4f3efc` and passes after the change [EVIDENCE: a copy of the worktree holding the start commit's 23 changed source files and today's tests (identical to `728c4f3efc` for those files) fails 12 parity rows, 4 workspace identity rows, 7 guard rows including the zero-file row, 8 Codex hook installer rows, 7 worktree rows and 3 drift and compiler rows. The same rows pass in the worktree]
- [x] CHK-025 [P1] All six registrations start the launcher in `today` and `whole-link`, and the `skilled-only` result is recorded against phase 004's shape [EVIDENCE: `scratch/rehearsal-results.md` holds 18 registration rows: all six answer in `today` and `whole-link`, and `skilled-only` is recorded as `Cannot find module` against L1]
- [x] CHK-026 [P1] `dist/` is rebuilt after the last TypeScript unit, and `dist-freshness.cjs check --package <id> --json` reads `"stale":false` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime` [EVIDENCE: `npm run build` exits 0 in both packages, and `dist-freshness.cjs` reads `"stale":false` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime`]
- [x] CHK-027 [P1] When phase 004 selects per-entry links, the unit rows and the rehearsal also pass in `entry-links`, and otherwise `goal.md`'s log records that the layout was not required [EVIDENCE: `goal.md` log row "Phase 004 shape": L1, so `entry-links` is not required]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each changed component records its finding class (`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`) in `implementation-summary.md` [EVIDENCE: `implementation-summary.md` Verification, finding class table]
- [x] CHK-FIX-002 [P0] The two same-class `git grep` inventories in `plan.md` rerun at the final commit, with every hit given a disposition [EVIDENCE: at `dadf2d19dd` the equality inventory returns 10 lines in 8 non-test files, down from 20 in 13, and the sentinel inventory 11 lines in 9 files. Every hit is a legacy spec alias check kept under D2, the new alias exemption itself, a dual-spelled sentinel or a phase 009 constant, as listed in `implementation-summary.md`]
- [x] CHK-FIX-003 [P0] Consumer inventories rerun for `SOURCE_ROOT_NAMES`, `findRepoRoot`, `findAdvisorWorkspaceRoot`, `buildWorkspaceIdentity` and `sanitizePath` [EVIDENCE: at `dadf2d19dd` `SOURCE_ROOT_NAMES` appears in 16 files, `findRepoRoot` in 47, `findAdvisorWorkspaceRoot` in 42, the workspace identity exports in 4 and `sanitizePath(` in 4. Consumers inherit the dual-spelled default sentinel and the either-name hoist, and no caller passes a `.skilled/specs` sentinel]
- [x] CHK-FIX-004 [P0] Resolver rows cover a nested leak, a look-alike segment, a dangling link, an ancestor `.skilled`, both names present and no anchor [EVIDENCE: `package-root-parity.vitest.ts` rows for a nested leak, look-alike segments, a dangling `.opencode` link, an ancestor named `.skilled`, the `.opencode` tree beside the `.skilled` placeholder and a start with no sentinel and no source-root segment]
- [x] CHK-FIX-005 [P1] Row counts per test file are listed for the layout x spelling x depth matrix [EVIDENCE: `implementation-summary.md` Verification, rows per test file]
- [x] CHK-FIX-006 [P1] Rows that read `process.cwd()` or `HOME` (C5, the C7 schema row, C11) run with a changed value and restore it [EVIDENCE: LOAD-003 changes the working directory and TMPDIR and restores both in `finally`. The schema lockstep row passes a start directory, so it changes nothing. The worktree test runs with HOME set to a throwaway directory inside its own process, and the Codex installer test sets HOME only in each child's environment]
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase start SHA and each unit's commit SHA [EVIDENCE: `scratch/baseline-counts.md` is pinned to `cfeba3e1fb`, each component's commit is listed in `implementation-summary.md`, and the final pass names `dadf2d19dd`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `sanitizePath` with the added base still rejects `/etc/passwd`, null bytes and a `..` escape [EVIDENCE: T-003a (null bytes), T-003k (`/etc/passwd`) and T-003l (a `..` escape from a linked `.skilled`) pass in `test-scripts-modules.js`]
- [x] CHK-031 [P0] No test or rehearsal writes `~/.codex/hooks.json` or any other file under the home directory [EVIDENCE: `stat -f %m ~/.codex/hooks.json` reads 1788592466 before and after every run. The installer test points HOME at its fixture, and the worktree test at a throwaway directory]
- [x] CHK-032 [P1] Every rehearsal clone has no `.git` pointer before the first command runs in it [EVIDENCE: each layout's first `scratch/rehearsal-results.md` row records the clone's `.git` pointer as absent]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree on components, requirement ids and task ids [EVIDENCE: the review additions appear in `spec.md` §3, `plan.md` and `goal.md`, and component, requirement and task ids match across the four documents]
- [x] CHK-041 [P1] Code comments explain the two-name rule without spec paths, packet numbers or task ids [EVIDENCE: CHK-010's hygiene run, and each component's review checked comment accuracy]
- [x] CHK-042 [P2] READMEs that describe `hoistAboveOpencodeTree` or `REPO_ROOT_SENTINEL` are listed for phase 009, not edited here [EVIDENCE: `runtime/hooks/lib/workspace/README.md` names `hoistAboveOpencodeTree` and `REPO_ROOT_SENTINEL`, and is listed for phase 009 in `implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline counts, briefs and rehearsal output stay in `scratch/` [EVIDENCE: `scratch/` holds `baseline-counts.md`, `layout-rehearsal.sh`, `rehearsal-results.md` and the unit and review records in `briefs/`]
- [x] CHK-051 [P1] `scratch/` is cleaned before completion, with its evidence moved into `implementation-summary.md` [EVIDENCE: clones, suite logs and probes lived outside the repository and were deleted. `scratch/` keeps only the records `acceptance-criteria.md` cites, and their evidence is summarized in `implementation-summary.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-17, at `dadf2d19dd`
<!-- /ANCHOR:summary -->

---
