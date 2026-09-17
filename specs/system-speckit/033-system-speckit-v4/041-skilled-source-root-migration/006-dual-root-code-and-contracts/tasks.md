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
- [ ] T004 {orchestrator} Write the rehearsal script: clone the worktree per layout outside it, delete the clone's `.git` pointer, arrange `today`, `skilled-only` and `whole-link` (and `entry-links` if phase 004 selects it), run the whole-tree checks and assert `test ! -e .opencode` in `skilled-only` (`scratch/layout-rehearsal.sh`)
- [ ] T005 {orchestrator} Write one brief per drafting task (T006 to T054) with its behavior pairs, test rows and verify command, and decide there whether `detectRepoRoot` becomes a test seam (`scratch/briefs/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### C1 Repository root discovery
- [ ] T006 {deepseek} [P] Export `SOURCE_ROOT_NAMES`, test the sentinel under each name, hoist above either name (`.../shared/workspace/repo-root.mjs`)
- [ ] T007 {deepseek} [P] Declare `SOURCE_ROOT_NAMES` (`.../shared/workspace/repo-root.d.mts`)
- [ ] T008 {deepseek} Add the layout axis and the hoist rows (`.../runtime/cli/tests/package-root-parity.vitest.ts`)
- [ ] T009 {gpt-5.6} Review T006 to T008 against their briefs
- [ ] T010 {orchestrator} Verify C1: parity test, `spec-gate-core.test.mjs`, comment hygiene, then commit the unit

### C6 Workspace identity
- [ ] T011 {deepseek} Let either name anchor, derive the root from either anchor and compare roots (`.../runtime/cli/utils/workspace-identity.ts`)
- [ ] T012 {deepseek} Add `skilled-only` nested, `whole-link`, placeholder and unrelated-repository rows (`.../runtime/cli/tests/workspace-identity.vitest.ts`)
- [ ] T013 {gpt-5.6} Review T011 and T012
- [ ] T014 {orchestrator} Verify C6: rebuild `runtime/cli`, run the test, comment hygiene, commit

### C5 Path sanitization
- [ ] T015 {deepseek} [P] Add `<cwd>/.skilled` to the default bases (`.../runtime/cli/utils/path-utils.ts`)
- [ ] T016 {deepseek} [P] Add `<cwd>/.skilled` to the data-file bases (`.../runtime/cli/loaders/data-loader.ts`)
- [ ] T017 {deepseek} [P] Add linked-root accept and reject rows for `sanitizePath` (`.../runtime/cli/tests/test-scripts-modules.js`)
- [ ] T018 {deepseek} [P] Add a data-file row under a linked `.skilled` (`.../runtime/cli/tests/test-extractors-loaders.js`)
- [ ] T019 {gpt-5.6} Review T015 to T018
- [ ] T020 {orchestrator} Verify C5: `npm run test:legacy` in `runtime/cli`, comment hygiene, commit

### C2 to C4 Spec roots, config and folder detection (proof only)
- [ ] T021 {deepseek} Add the optional layout parameter to `materializeRootFixture` (`.../runtime/cli/core/spec-root-fixtures.ts`)
- [ ] T022 {deepseek} Run R1, R3 and R7 per layout (`.../runtime/cli/tests/spec-root-validation-matrix.vitest.ts`)
- [ ] T023 {deepseek} [P] Add per-layout dedupe rows (`.../runtime/cli/tests/spec-root-config-precedence.vitest.ts`)
- [ ] T024 {deepseek} [P] Add per-layout approved-root rows (`.../runtime/cli/tests/test-folder-detector-functional.js`)
- [ ] T025 {gpt-5.6} Review T021 to T024
- [ ] T026 {orchestrator} Verify C2 to C4: the full `tests/spec-root-*.vitest.ts` set and the folder detector runner. A failing row stops for a design decision under D2. Commit

### C7 Advisor workspace root
- [ ] T027 {deepseek} [P] Test the sentinel under each name and hoist above either (`.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts`)
- [ ] T028 {deepseek} [P] Apply the same rule to the lockstep twin, plus the test seam if T005 approved it (`.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`)
- [ ] T029 {deepseek} [P] Add layout, look-alike, capped and explicit-sentinel rows (`.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`)
- [ ] T030 {deepseek} [P] Add the lockstep row (`.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts`)
- [ ] T031 {gpt-5.6} Review T027 to T030
- [ ] T032 {orchestrator} Verify C7: rebuild the advisor `dist/`, run both tests, comment hygiene, commit

### C8 MCP code-mode launcher
- [ ] T033 {deepseek} Resolve the server directory from `__dirname` (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- [ ] T034 {deepseek} Add the stub-server layout case (`.opencode/bin/mcp-code-mode-launcher.test.cjs`)
- [ ] T035 {gpt-5.6} Review T033 and T034
- [ ] T036 {orchestrator} Verify C8: `node --test`, `node --check`, comment hygiene, commit

### C10 Codex hook installer
- [ ] T037 {deepseek} Add the root-normalized ownership key to source identities, the owned check, the orphan test and owned occurrences (`.opencode/bin/install-codex-hooks.mjs`)
- [ ] T038 {deepseek} Create the reconcile test across layouts and spellings, writing only temp targets (`.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`)
- [ ] T039 {gpt-5.6} Review T037 and T038
- [ ] T040 {orchestrator} Verify C10: `node --test`, `node --check`, confirm `~/.codex/hooks.json` is untouched, comment hygiene, commit

### C11 Worktree session launcher
- [ ] T041 {deepseek} Resolve the source root per checkout, build shared paths and the database directory from it and warn on a mismatch (`.opencode/bin/worktree-session.sh`)
- [ ] T042 {deepseek} Add one fixture per layout, the live `skilled-only` run and the mismatch fixture (`.opencode/bin/tests/worktree-session.test.sh`)
- [ ] T043 {gpt-5.6} Review T041 and T042
- [ ] T044 {orchestrator} Verify C11: the shell test, `bash -n`, comment hygiene, commit

### C12 Local specs relinker (proof only)
- [ ] T045 {deepseek} Create the per-layout relink test (`.opencode/bin/tests/relink-local-specs.test.sh`)
- [ ] T046 {gpt-5.6} Review T045
- [ ] T047 {orchestrator} Verify C12: run the test, `bash -n`, commit

### C13 No-spec-import guard
- [ ] T048 {deepseek} Scan `__dirname`, add the `.skilled/specs` spelling and exit 2 on a zero-file scan (`.opencode/bin/check-no-spec-imports.cjs`)
- [ ] T049 {deepseek} Add spelling, spawn and zero-file rows (`.opencode/bin/compiled-routing-foundation.vitest.ts`)
- [ ] T050 {gpt-5.6} Review T048 and T049
- [ ] T051 {orchestrator} Verify C13: the bin vitest, the three CI calls from `.github/workflows/runtime-no-spec-import.yml:35-42` run by hand, comment hygiene, commit

### C14 Contract drift checker
- [ ] T052 {deepseek} Accept both prefixes, compare by a root-normalized key and fall back in `absolutePath` (`.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`)
- [ ] T053 {deepseek} Fall back to the other name in `absolutePath` and `outputPathFor` (`.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`)
- [ ] T054 {deepseek} Add the `.skilled` header row and the document-spelling regression row (`.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`)
- [ ] T055 {gpt-5.6} Review T052 to T054
- [ ] T056 {orchestrator} Verify C14: the deep-loop test, `node check-contract-drift.cjs` printing `[CONTRACT DRIFT] OK`, comment hygiene, commit

### C9 and C15 Registrations
- [ ] T057 {orchestrator} Add the launch probe for `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.pi/mcp.json` (`scratch/layout-rehearsal.sh`)

### C16 Root-discovery twins, hook installer and ignore rules
- [ ] T065 {deepseek} One brief per twin: accept either root segment where the file compares a path segment with `.opencode`, with a test row for `.skilled` and for a `.opencode -> .skilled` link (the five files in `spec.md` §3)
- [ ] T066 {deepseek} Treat a link into either root's `scripts/git-hooks/` as owned, and add a test that a reinstall replaces an `.opencode` link rather than skipping it (`.opencode/scripts/install-git-hooks.sh`)
- [ ] T067 {deepseek} Add the `.skilled/` twin for every `.gitignore` rule and negation naming `.opencode/`, keeping the originals (`.gitignore`)
- [ ] T068 {gpt-5.6} Review T065 to T067
- [ ] T069 {orchestrator} Verify C16: each twin's suite, the installer test, and in a rehearsal clone `git ls-files -o -i --exclude-standard --directory | wc -l` unchanged before and after a rehearsed move; comment hygiene; commit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T058 {orchestrator} Rebuild `dist/` with `npm run build` in `.opencode/skills/system-spec-kit` and `.opencode/skills/system-skill-advisor/runtime`, then read `"stale":false` from `dist-freshness.cjs check --package <id> --json` for each rebuilt package
- [ ] T059 {orchestrator} Rerun every command from T003 on the final tree and compare with the baseline counts (`scratch/baseline-counts.md`)
- [ ] T060 {orchestrator} Run the rehearsal for `today`, `skilled-only` and `whole-link`, plus `entry-links` when phase 004 selects it, against the rebuilt tree (`scratch/rehearsal-results.md`)
- [ ] T061 {orchestrator} Run `check-comment-hygiene.sh` on every changed code file and list row counts per test file
- [ ] T062 {orchestrator} Confirm the phase diff touches only the files in `spec.md` §3, one commit per component
- [ ] T063 {orchestrator} Mark every acceptance criterion with evidence, write `implementation-summary.md`, run `validate.sh --strict` and read `RESULT: PASSED` (`acceptance-criteria.md`)
- [ ] T064 {orchestrator} Delete the rehearsal clones, scratch temp files and any `.pytest_cache` left in a skill folder
- [ ] T070 {orchestrator} Publish: rebase onto `origin/skilled/v4.0.0.0`, push to `skilled/v4.0.0.0` and `main` (parent D2, rollback written first), fast-forward the main checkout, restart the `code_mode` launcher, then read `validate.sh --strict` from the main checkout and a hook run in a disposable clone (phase 004 step 8)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every P0 checklist item below verified with evidence
- [ ] Rehearsal results recorded for `today`, `skilled-only` and `whole-link`, plus `entry-links` when phase 004 selects it
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
- [ ] CHK-005 [P1] A brief exists for each drafting task before its dispatch (T005)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `check-comment-hygiene.sh` passes on the 13 changed source files and every changed test file
- [ ] CHK-011 [P0] `node --check` passes on each changed `.cjs` and `.mjs`, and `bash -n` on each changed `.sh`
- [ ] CHK-012 [P0] `npm run typecheck` passes in `.opencode/skills/system-spec-kit` and in `.opencode/skills/system-skill-advisor/runtime`
- [ ] CHK-013 [P1] New files use kebab-case names: `install-codex-hooks-source-root.test.cjs` and `relink-local-specs.test.sh`
- [ ] CHK-014 [P1] Each draft touched only the file its brief named, confirmed from the unit's diff
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every command in `plan.md` §5 passes in `today`, with counts equal to the baseline plus the added rows
- [ ] CHK-021 [P0] The drift checker prints `[CONTRACT DRIFT] OK` in the `skilled-only` and `whole-link` clones
- [ ] CHK-022 [P0] The guard's default scan exits 1 beside the seeded import in `today`, `skilled-only` and `whole-link`
- [ ] CHK-023 [P0] `test ! -e .opencode` holds in the `skilled-only` clone after the suites run
- [ ] CHK-024 [P0] Each of the six silent failures in `spec.md` SC-002 has a row that fails on `728c4f3efc` and passes after the change
- [ ] CHK-025 [P1] All six registrations start the launcher in `today` and `whole-link`, and the `skilled-only` result is recorded against phase 004's shape
- [ ] CHK-026 [P1] `dist/` is rebuilt after the last TypeScript unit, and `dist-freshness.cjs check --package <id> --json` reads `"stale":false` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime`
- [ ] CHK-027 [P1] When phase 004 selects per-entry links, the unit rows and the rehearsal also pass in `entry-links`, and otherwise `goal.md`'s log records that the layout was not required
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each changed component records its finding class (`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`) in `implementation-summary.md`
- [ ] CHK-FIX-002 [P0] The two same-class `git grep` inventories in `plan.md` rerun at the final commit, with every hit given a disposition
- [ ] CHK-FIX-003 [P0] Consumer inventories rerun for `SOURCE_ROOT_NAMES`, `findRepoRoot`, `findAdvisorWorkspaceRoot`, `buildWorkspaceIdentity` and `sanitizePath`
- [ ] CHK-FIX-004 [P0] Resolver rows cover a nested leak, a look-alike segment, a dangling link, an ancestor `.skilled`, both names present and no anchor
- [ ] CHK-FIX-005 [P1] Row counts per test file are listed for the layout x spelling x depth matrix
- [ ] CHK-FIX-006 [P1] Rows that read `process.cwd()` or `HOME` (C5, the C7 schema row, C11) run with a changed value and restore it
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase start SHA and each unit's commit SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `sanitizePath` with the added base still rejects `/etc/passwd`, null bytes and a `..` escape
- [ ] CHK-031 [P0] No test or rehearsal writes `~/.codex/hooks.json` or any other file under the home directory
- [ ] CHK-032 [P1] Every rehearsal clone has no `.git` pointer before the first command runs in it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree on components, requirement ids and task ids
- [ ] CHK-041 [P1] Code comments explain the two-name rule without spec paths, packet numbers or task ids
- [ ] CHK-042 [P2] READMEs that describe `hoistAboveOpencodeTree` or `REPO_ROOT_SENTINEL` are listed for phase 009, not edited here
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline counts, briefs and rehearsal output stay in `scratch/`
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion, with its evidence moved into `implementation-summary.md`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 15 | 0/15 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not verified yet
<!-- /ANCHOR:summary -->

---
