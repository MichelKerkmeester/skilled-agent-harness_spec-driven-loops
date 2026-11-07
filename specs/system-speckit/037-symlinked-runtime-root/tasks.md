---
title: "Tasks: Symlinked runtime: entry guard, project root and empty saves"
description: "The ordered work for making the entry guard hold under the symlink flag, resolving the project root from the caller's repository, and stopping an empty save from exiting 0."
trigger_phrases:
  - "symlinked runtime root tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Symlinked runtime: entry guard, project root and empty saves

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

**Paths**: `runtime/` below is `.skilled/skills/system-spec-kit/runtime/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add guard cases that spawn a child with `--preserve-symlinks-main` through a symlinked path, one executed and one imported (`runtime/tests/esm-entry-symlink.vitest.ts`) — evidence: `lets a script launched through a symlink with --preserve-symlinks-main know it was run` at `runtime/tests/esm-entry-symlink.vitest.ts:184`, and `leaves an imported module dormant under --preserve-symlinks-main` at `:201`
- [x] T002 [P] Add a save case that builds a temp git repository, links `.skilled` into it, and runs `generate-context.js` from there (`runtime/cli/tests/symlinked-project-root.vitest.ts`) — evidence: the cases went into one new file under this name rather than `generate-context-linked-root.vitest.ts`; `saves to the linked repository's own packet` at `runtime/cli/tests/symlinked-project-root.vitest.ts:108`
- [x] T003 [P] Add a save case whose input holds an empty `exchanges` array (`runtime/cli/tests/symlinked-project-root.vitest.ts`) — evidence: `does not exit 0 on a save with nothing in it` at `runtime/cli/tests/symlinked-project-root.vitest.ts:129`
- [x] T004 Run all new cases against the current code, record that each fails, and take the suite baseline — evidence: guard `Tests 3 failed, 8 passed (11)`, root file `Tests 6 failed, 1 passed (7)` against main's build. The one pass is the regression control `stays the runtime repository for a run inside the runtime repository itself`. Main's cli baseline: `2245 passed, 20 skipped`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Canonicalize `import.meta.url` through `fileURLToPath` and `realpathSync`, falling back to the unresolved value, then compare (`runtime/cli/lib/esm-entry.ts`) — evidence: `canonicalPath()` resolves each side separately; `recognizes the entrypoint when the module URL keeps the linked path` at `runtime/tests/esm-entry-symlink.vitest.ts:98`
- [x] T006 [P] Same change in the other two copies (`runtime/lib/esm-entry.ts`, `runtime/cli/lib/esm-entry.mjs`) — evidence: the three copies are exercised together by `answers identically for symlinked and direct launch paths and module URLs, and an import` at `runtime/tests/esm-entry-symlink.vitest.ts:249`
- [x] T007 Inventory every reader of `CONFIG.PROJECT_ROOT` and mark each project-owned or runtime-owned — evidence: 13 files, every read project-owned (spec-folder roots and resolution, git context, session file paths). Recorded in `implementation-summary.md` under Inventories
- [x] T008 Derive `PROJECT_ROOT` from `git rev-parse --show-toplevel` in the working directory, falling back to the working directory, and leave runtime-owned paths script-relative (`runtime/cli/core/config.ts`) — evidence: `resolveProjectRoot()` returns the git top-level, then the working directory, then the runtime repository with a stderr line; `TEMPLATE_DIR` unchanged. Cases at `runtime/cli/tests/symlinked-project-root.vitest.ts:79` and `:91`
- [x] T009 Accept `--project-root` and pass it into `main` (`runtime/cli/continuity/generate-context.ts`) — evidence: the option is split out before the parser runs and bound to `CONFIG.PROJECT_ROOT`; help text at `runtime/cli/continuity/generate-context.ts:89`; cases at `runtime/cli/tests/symlinked-project-root.vitest.ts:119`, `:149` and `:160`
- [x] T010 Count empty-exchanges saves in recent hook logs, choose refuse or warn with non-zero exit, and implement it (`runtime/cli/core/workflow.ts`) — evidence: 134 completed, 1,643 failed (1,445 or more collision-class), 2 skipped. Neither option was taken: a save with nothing in it already exits 1 with `INSUFFICIENT_CONTEXT_ABORT`, so `workflow.ts` is unchanged and the case at `runtime/cli/tests/symlinked-project-root.vitest.ts:129` pins it. Decision in `implementation-summary.md`
- [x] T011 Rebuild the runtime and CLI workspaces so the committed `dist` output matches — evidence: `npm run build` exited 0 in both workspaces. `dist/` is gitignored in this repository, so the rebuild is local and nothing is committed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the T004 cases and confirm each passes — evidence: `Tests 11 passed (11)` in `runtime`, `Tests 10 passed (10)` in `runtime/cli`
- [x] T013 Rerun the two probes from `AI Systems` with the flag and confirm output and exit match the run without it — evidence: this round ran them from a temp repository whose `.skilled` links to the build under test. `generate-description.js` exited 1 with 92 bytes and `generate-context.js --not-an-option` exited 1 with 1049 bytes, matching the no-flag runs; main's build with the flag exited 0 with 0 bytes for both
- [x] T014 Run both suites, both builds and both typechecks from the final state and account for the delta — evidence: cli `Tests 2255 passed, 20 skipped (2275)` against main's `2245 passed, 20 skipped`, a delta of exactly the 10 new cases; runtime `Tests 4220 passed, 21 skipped (4241)` with no baseline captured, so no delta stated; `typecheck` and `build` exit 0 in both; `typecheck:tests` 99 errors, the same 99 as main
- [x] T015 Record the T010 choice and the T007 inventory in `implementation-summary.md` — evidence: the Empty saves and Inventories sections of that file

### Reopened 2026-11-07: graph-metadata writes through a linked specs root

- [x] T016 Reproduce from a scratch project with a real `.opencode/` and `specs` linked into another workspace's track — evidence: `backfill-graph-metadata.ts specs/900-demo` exited 1 with `Refusing to write graph metadata outside a configured specs root: <hub>/repositories/demo/specs/900-demo/graph-metadata.json`
- [x] T017 Take the baseline of the guard's test file — evidence: `npx vitest run tests/graph-metadata-schema.vitest.ts` → `Tests 54 passed (54)`
- [x] T018 Compare real locations in `isWithinConfiguredSpecsRoot` and add `realLocationOf` (`runtime/lib/graph/graph-metadata-parser.ts`) — evidence: the linked-root cases pass
- [x] T019 Write `refreshGraphMetadataForSpecFolder`'s output through the folder as the caller named it (`runtime/lib/graph/graph-metadata-parser.ts`) — evidence: `writes the packet reached through the project specs link` passes, and fails with `Tests 1 failed \| 57 passed (58)` when the call is put back
- [x] T020 Add the process workspace's roots to the real-location comparison, because the save resolves the folder in `sanitizePath` before it refreshes (`runtime/lib/graph/graph-metadata-parser.ts`) — evidence: `writes the resolved packet path when the save runs inside the project` passes, and fails with `Tests 1 failed \| 58 passed (59)` without the process roots
- [x] T021 Add the linked-root, project-layout and stray-destination cases (`runtime/tests/graph-metadata-schema.vitest.ts`) — evidence: `Tests 59 passed (59)`
- [x] T022 Rebuild and rerun the reproduction and a continuity save through the link — evidence: `npm run build` exit 0; backfill exit 0 with `"failed": []`; `generate-context.js` save through `specs/900-linked-specs-root-graph-write` exit 0 with `Created graph-metadata.json` at the canonical track path
- [x] T023 Run typecheck, lint on the changed files and the full runtime suite from the final state — evidence: `npm run typecheck` exit 0; `eslint` on both changed files exit 0; comment hygiene exit 0. Full suite `Tests 9 failed \| 4269 passed \| 22 skipped (4300)`: none touches graph metadata. Rerun alone, seven pass; the other two (`hook-adapter-path-parity` cursor drift marker, `deep-research-ledger-schema` timeout) fail the same way with this change reverted. No baseline of the full suite was taken before the change
- [x] T024 Act on the alignment run over the fix commit — evidence: the guard's comment now names the process roots; a CLI save case through a `specs` folder linked into another workspace (`runtime/cli/tests/symlinked-project-root.vitest.ts`) fails against the old guard with `Tests 1 failed` and passes after, `Tests 11 passed (11)`; a `system-spec-kit` changelog entry `v2.12.35.0` with the `SKILL.md` version raised to match; a feature-catalog entry and a playbook scenario for the linked-root write. The open Skilled release notes were left alone because `v4.0.2.0` is already tagged
- [x] T025 Count a backfill folder as changed only after its write goes through (`runtime/cli/graph/backfill-graph-metadata.ts`) — evidence: a scratch backfill with its write refused reported `"changed":1` beside the failure; the new case `reports a folder whose write is refused as failed and not as changed` in `runtime/cli/tests/graph-metadata-backfill.vitest.ts` fails against the old code with `expected 1 to be +0` and passes after, `Tests 16 passed \| 1 skipped (17)`; `system-spec-kit` changelog `v2.12.35.1`
- [x] T026 Point playbook scenario 456's regression step at the cli project (`manual-testing-playbook/tooling-and-scripts/canonical-first-spec-root-resolution.md`) — evidence: the old command printed `No test files found` because `runtime/vitest.config.ts` excludes `runtime/cli/**`; the new one reads `Tests 36 passed (36)`, exit 0
- [x] T027 Clear the two runtime-suite failures that predate the reopening — evidence: `hook-adapter-path-parity` now exempts a Cursor binding the hook registry marks `fallback: "none"` and asserts it stays unwrapped, `Tests 136 passed (136)`; the `deep-research-ledger-schema` case that appends every event stem gets a 120 s timeout because its per-append `fsync` costs about 17 of its 25 s alone, `Tests 51 passed (51)`. A third, `claude-code-native-dispatch-docs`, read only the first line of a self-invocation bullet the `cli-claude-code` docs had split into sub-bullets, and now reads the sub-bullets too, `Tests 1 passed (1)`. From the final state: both builds and typechecks exit 0; runtime suite `Tests 4278 passed \| 22 skipped (4300)` against `9 failed` before; cli suite `Tests 2341 passed \| 20 skipped` whose one failure was that docs case, which now passes
- [x] T028 Fold the reopened work into the `v4.0.2.0` release notes at the operator's direction — evidence: a glance bullet, an H4 under Skilled in Your Project, the spec folder and a Why This Release sentence; shape check `PASS`, `validate_document` 0 issues, voice scan blockers unchanged from HEAD (9, all the product name)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001 to T028
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance row Met — 11 of 11 in `acceptance-criteria.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Earlier fix**: `system-speckit/031-system-speckit-v4/039-entry-point-symlink-resolution`
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

- [x] CHK-001 [P0] Requirements documented in spec.md — `spec.md` §3 lists the files to change and §4 lists REQ-001 to REQ-004
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §3 to §5 give the pattern, the components, the affected surfaces and the test strategy
- [x] CHK-003 [P1] Dependencies identified and available — `plan.md` §6 lists `git` and the build output; both were present for every run
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `quality-gate.cjs --files` on the seven changed files returned `"gate": "NO_BLOCKER_FOUND"`, exit 0
- [x] CHK-011 [P0] No console errors or warnings — both full suites exited 0 with 0 failures; the only stderr line is the deliberate fallback note from `resolveProjectRoot()`
- [x] CHK-012 [P1] The guard never raises and the root lookup names its fallback on stderr — `reports false rather than raising when the launch path does not exist` at `runtime/tests/esm-entry-symlink.vitest.ts:138`; the fallback case asserts `is not inside a repository that uses spec-kit` on stderr at `runtime/cli/tests/symlinked-project-root.vitest.ts:91`
- [x] CHK-013 [P1] Code follows project patterns — the three guard copies are kept equal and checked by the case at `runtime/tests/esm-entry-symlink.vitest.ts:249`; the quality gate found no blocker
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — `acceptance-criteria.md`: 8 of 8 rows Met
- [x] CHK-021 [P0] Each new case failed against the pre-change code — guard `Tests 3 failed, 8 passed (11)`; root file `Tests 6 failed, 1 passed (7)` against main's build. The controls that pass before and after are the two `stays dormant` cases and `stays the runtime repository for a run inside the runtime repository itself`
- [x] CHK-022 [P1] Edge cases tested: subfolder working directory, worktree, outside any repository — subfolder at `runtime/cli/tests/symlinked-project-root.vitest.ts:79`, outside any repository at `:91`. No worktree-specific case was written: a worktree reaches the same `git rev-parse --show-toplevel` call the subfolder case covers
- [x] CHK-023 [P1] Error scenarios validated: missing `--project-root` directory, unresolvable module URL — missing root at `runtime/cli/tests/symlinked-project-root.vitest.ts:160`, outside-root at `:149`, unresolvable launch path at `runtime/tests/esm-entry-symlink.vitest.ts:138`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — guard: `class-of-bug`, closed in all three copies. Root: `cross-consumer`, with all 13 readers inventoried as project-owned before the value moved. Empty save: no finding to class — the measurement showed the existing gate already refuses, so the premise did not hold
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg -n "realpathSync|pathToFileURL" runtime --glob '*.ts' --glob '*.mjs'` finds one entry guard in three copies; every other hit resolves a single path for a containment check
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — `rg -n "PROJECT_ROOT" runtime --glob '*.ts' --glob '!**/dist/**' --glob '!**/tests/**'` finds 13 files, all project-owned; `TEMPLATE_DIR` and the config path unchanged; both test files updated
- [x] CHK-FIX-004 [P0] Path resolution has adversarial cases for symlinked, aliased, missing and outside-root paths. — symlinked launch at `runtime/tests/esm-entry-symlink.vitest.ts:184`, missing launch path at `:138`, missing root at `runtime/cli/tests/symlinked-project-root.vitest.ts:160`, outside-root at `:149`. The temp root is realpath'd before use at `runtime/cli/tests/symlinked-project-root.vitest.ts:43`, so a root returned in the aliased `/var` spelling fails the case
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — axes are listed in `plan.md` §FIX ADDENDUM; the row count is the 10 cases in `symlinked-project-root.vitest.ts` plus four new guard tests and two new rows in the copies-agree case
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — `cwd` runs from a subfolder at `runtime/cli/tests/symlinked-project-root.vitest.ts:79`, from outside any repository at `:91` and from the runtime repository at `:86`; the guard cases set `process.argv[1]` and restore it in `finally`
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Open: the fix is uncommitted in this worktree, so there is no fix SHA. The evidence names the base commit `20615846be` and the worktree it was recorded in. Pin the fix SHA after the commit lands
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the seven changed files add no credentials or tokens
- [x] CHK-031 [P0] A `--project-root` outside the working directory's repository is refused — `refuses a --project-root that sits outside the working repository` at `runtime/cli/tests/symlinked-project-root.vitest.ts:149` asserts exit 1 and the refusal on stderr
- [x] CHK-032 [P1] No write lands outside the resolved project root — `saves to the linked repository's own packet` at `runtime/cli/tests/symlinked-project-root.vitest.ts:108` asserts nothing lands under the runtime repository's `specs/demo`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` and `implementation-summary.md` both read Complete, `acceptance-criteria.md` reads 8 of 8 Met, and this file marks T001 to T015 done
- [x] CHK-041 [P1] The guard's comment states what the code does, with no packet or phase numbers — the added comments describe the symlink behaviour; `check-comment-hygiene.sh` exited 0 on the seven changed files
- [x] CHK-042 [P2] `generate-context.js --help` names `--project-root` — `runtime/cli/continuity/generate-context.ts:89` documents `--project-root <dir>` in the help text
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the cases create temp directories under the OS temp root and remove them in `afterEach`; the packet's only local artifact is `scratch/verification-evidence.md`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds `.gitkeep` and the verification evidence this packet cites; no other stray file was left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

CHK-FIX-007 stays open: the fix is uncommitted, so it has no SHA to pin. Every other item rests on a recorded run or on a file in this packet.

**Verification Date**: 2026-10-31
<!-- /ANCHOR:summary -->
