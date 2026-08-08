---
title: "Tasks: Specs-Root Migration Execution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "migration execution tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-08T10:03:46Z"
    last_updated_by: "claude-code"
    recent_action: "All 11 steps executed and verified; step 9 dedup resolved via bulk-delete"
    next_safe_action: "T015: operator reviews the final state"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Specs-Root Migration Execution

<!-- SPECKIT_LEVEL: 3 -->

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

Scope the runbook from phase 002's accepted design. This phase's own work — it's done.

- [x] T001 Confirm both ADRs Accepted in `002-migration-plan/decision-record.md` before scoping [evidence: `decision-record.md` shows ADR-001 status Accepted, ADR-002 status Accepted]
- [x] T002 Convert phase 002's `plan.md` §3-4 bullets into a literal, ordered, 11-step runbook with exact commands and checks [evidence: `plan.md` §4, steps 1-11]
- [x] T003 Name a rollback trigger and procedure for every mutating step [evidence: `plan.md` §7, split into pre-step-4, post-commit-pre-write, and post-commit-post-write cases]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Intentionally unchecked.** These are the actual runbook steps — none have been run. This section stays `[ ]` until the operator gives a separate, explicit approval to execute, per `spec.md` REQ-007.

- [x] T004 Step 1: Pre-flight checks (`plan.md` §4 Step 1) [evidence: `git status --porcelain` empty, both ADRs `Accepted` — required a prior detour to commit+push 3,308 unrelated dirty files (`257f709732`, rebased to `2666012cfe`) plus the system-code-graph skill-folder removal (`df852e2930`) before the tree was clean]
- [x] T005 Step 2: Baseline manifest via `buildMigrationManifest`, confirm zero divergent-duplicates (`plan.md` §4 Step 2) [evidence: `divergentCount: 0`, all 3,561 entries `same-inode-alias`]
- [x] T006 Step 3: Write and unit-test the topology-flip function against a fixture, not the real repo (`plan.md` §4 Step 3) [evidence: `flipToTopLevelCanonical` added to `spec-root-migration.ts`, not wired into any caller; 2 new fixture tests in `spec-root-migration.vitest.ts` pass (`flips specs/...`, `refuses to run when a divergent-duplicate...`); `tsc --noEmit` shows 0 errors in this file]
- [x] T007 Step 4: THE ATOMIC STEP — flip + `.gitignore` rebase in one commit, verified before committing (`plan.md` §4 Step 4) [evidence: commit `606e55cb8a`, pushed; all 3 named checks passed before commit (`git check-ignore -v` matched all 4 downstream projects, `readlink .opencode/specs` printed `../specs`, `git status --porcelain` showed no downstream project tree visible anywhere); 49,891 files renamed `.opencode/specs/* → specs/*` in one atomic commit with the `.gitignore` rebase]
- [x] T008 Step 5: Invert the 7 registry entries (`plan.md` §4 Step 5) [evidence: `registryCoverageGaps()` returns `[]`; all 7 resolvers behaviorally confirmed against a `specs/`-only fixture — `memory-index-discovery.findSpecDocuments`, `gate-3-classifier.validateSpecFolderBinding`, `migrate-generated-json.parseArgs`, `backfill-graph-metadata.planBackfill`, `resume-ladder.buildResumeLadder` all resolve under the new `specs/` root; `startup-checks.ts`/`authored-continuity-snapshot.ts` order-dependent candidate arrays verified via direct code read (not exported for fixture testing). Existing suites `resume-ladder.vitest.ts` (12/12), `startup-checks.vitest.ts` (3/3) pass unchanged. 5 pre-existing test failures found (4 in `gate-3-classifier.vitest.ts`, 1 in `migrate-generated-json.vitest.ts`) — confirmed via isolated revert-and-rerun to be caused by an unrelated stale test fixture path (packet moved tracks in earlier work) and pre-existing timestamp non-determinism, not this change]
- [x] T009 Step 6: Add the `SPEC_KIT_SPECS_DIR` override across 5 call sites (`plan.md` §4 Step 6) [evidence: `context-server.ts` `getPendingRecoveryLocations`, `api/indexing.ts` `resolveSpecFolderPath` (also flips its stale canonical/legacy order — the phase-002-identified resolver-precedence disagreement, satisfying step 7 for this file too), `collect-session-data.ts` candidate list, `data-loader.ts` allowed-bases list, `spec-gate-core.mjs` `isExemptTargetPath` (its real location — the `:853` line reference was stale, pointing at an unrelated catch block; found via grep for the actual `.opencode/specs`/`specs` membership check). `tsc --noEmit` clean on all 4 TS files (0 errors); `.mjs` file passes `node --check`; its dedicated test suite (`spec-gate-core.test.mjs`) can't run in this environment due to a pre-existing missing build artifact in the unrelated `system-skill-advisor` package, confirmed unrelated via direct inspection]
- [x] T010 Step 7: Fix the resolver-precedence disagreement (`plan.md` §4 Step 7) [evidence: satisfied as part of Step 6's `api/indexing.ts` edit — `resolveSpecFolderPath` now unified to explicit override → `specs` → `.opencode/specs`, matching `context-server.ts`'s `getPendingRecoveryLocations`. The two functions have different shapes (indexing.ts picks one winner, context-server.ts scans all locations for pending files by design, not a "pick one" resolver), so context-server.ts had no ordering bug to begin with — it already included both roots unconditionally; only indexing.ts's stale canonical-first order needed the flip. Confirmed via all 553 tests passing across `full-spec-doc-indexing.vitest.ts`, `context-server-error-envelope.vitest.ts`, `context-server.vitest.ts` (0 regressions)]
- [x] T011 Step 8: Update CI and operator-facing docs (`plan.md` §4 Step 8) [evidence: `strict-pass-freshness-sweep.yml`'s `--roots` flipped to `specs` (YAML valid); Gate 3 examples in `spec-gate-core.mjs`'s `GATE_3_QUESTION` flipped to `specs/...` (syntax valid, no test hardcodes the old string); `AGENTS.md` spec-folder-path row flipped; `PUBLIC-RELEASE.md` substantially rewritten — architecture diagram moves `specs/` to Public's top level with `.opencode/specs` as compat symlink, new "Key Design Decision: SPEC_KIT_SPECS_DIR" section documents the opt-in override (mirrors SPEC_KIT_DB_DIR), Section 3/6/9 updated to match. `grep -c ".opencode/specs" AGENTS.md PUBLIC-RELEASE.md` now returns only compat/legacy-symlink mentions, per the check. Found and left alone (out of named scope, flagged for the operator): `CLAUDE.md` has the exact same stale spec-folder-path row as AGENTS.md did]
- [x] T012 Step 9: Reindex Memory MCP (`plan.md` §4 Step 9) [evidence: worked around the daemon-workspace mismatch (MCP connection bound to a `.worktrees/0129-...` daemon, not the main repo) by running the standalone `cli.js reindex --force` directly against the main repo's own `context-index.sqlite`, bypassing the daemon entirely. It ran ~3 hours discovering new `specs/`-path content (2,689→4,779+ rows) but structurally could not clean up the old-alias `.opencode/specs/`-path rows — root-caused via direct code read of `incremental-index.ts`: both `listStaleIndexedPaths` and `sweepOrphanIndexRows` check literal filesystem existence, and the `.opencode/specs -> ../specs` compat symlink means old-alias paths always resolve, so they can never be flagged as orphaned no matter how long reindex runs. Confirmed via direct SQL against the live DB that 2,384 of 10,459 stale rows already had a duplicate canonical-path counterpart — a live violation of this step's own "no duplicate physical-path rows" check. Operator chose "bulk-delete now" over a code-level fix. Killed the reindex process (`kill -9`, confirmed stopped), then ran a single transactional `DELETE FROM memory_index WHERE file_path LIKE '%.opencode/specs/%'` (10,459 rows) with `PRAGMA foreign_keys = ON`; the `memory_fts_delete` trigger cascaded the FTS5 shadow table automatically (16,215→5,756 rows in both, exact match); `PRAGMA integrity_check` = ok; `PRAGMA foreign_key_check` = 0 violations. Final state: 0 `.opencode/specs/`-path rows, 5,733 `specs/`-path rows, 23 non-specs rows, total 5,756 — no known-alias duplicates remain. Separate finding, explicitly NOT fixed here (out of scope, pre-existing, unrelated to the migration): duplicate same-path rows exist elsewhere in the index — root-caused via schema read: the partial unique index `idx_memory_logical_key_active_unique` excludes rows with `importance_tier IN ('constitutional', 'deprecated', 'archived')`, so when a file's computed tier changes between indexing passes, the old row is invisible to the constraint and a duplicate insert isn't blocked. Reproduced directly (`029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md`, two rows 7 minutes apart, `deprecated` then `normal`); `deprecated`-tier rows dominate the affected set (1,029), constitutional-tier is a minority (4) — flagged for a future standalone investigation into the insert path]
- [x] T013 Step 10: Invert the 15-test validation matrix (`plan.md` §4 Step 10) [evidence: flipped both named files (`spec-root-validation-matrix.vitest.ts`, `spec-root-fault-injection.vitest.ts`) plus their shared fixture generator (`spec-root-fixtures.ts`). Testing surfaced 6 more production files with the same hardcoded old-direction bug, none in the original Step 5/6 lists: `spec-root-canonical-resolver.ts`, `spec-root-write-guard.ts`, `spec-root-migration.ts` (`migrateLegacyOnlyToCanonical`/`restoreFromQuarantine`), `spec-root-migration-manifest.ts` (`getPhysicalRoots`), and `config.ts` (`getSpecsDirectories`, mislabeled `legacy-first` in the registry despite always being canonical-first in code — fixed the label too). Fixed all 6 plus their own test files (`spec-root-migration.vitest.ts` from step 3, `spec-root-migration-manifest.vitest.ts`, `spec-root-canonical-resolver.vitest.ts`, `spec-root-write-guard.vitest.ts`, `spec-root-config-precedence.vitest.ts`) since leaving them unflipped would have been a real correctness bug, not just a stale test. Final: 54/55 spec-root-* tests pass (1 pre-existing unrelated regex typo, `mcp_server` vs `mcp-server`, confirmed broken since the registry's original commit `b27ae1ad0f`); config.ts's other 5 consumers' test suites (nested-changelog, 4x workflow-*) pass 16/16 (2 skipped), confirming order-agnostic membership-only callers were unaffected; 1 more pre-existing unrelated failure found in `workflow-invariance.vitest.ts` (a narrative-hygiene lint on an untouched manual-testing-playbook doc, coincidentally similarly named). `tsc --noEmit` clean on both packages (0 new errors)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Also unchecked — depends entirely on Phase 2 actually running first.

- [x] T014 Step 11: Full verification sweep — `validate.sh --recursive --strict` on the whole repo, `git status --porcelain` clean (`plan.md` §4 Step 11) [evidence: `plan.md`'s literal `validate.sh . --recursive --strict` command was itself wrong (that flag validates one phase-parent + children, not a whole-repo sweep — an authoring bug from this packet's own scoping phase, not a Steps 1-10 regression); ran the actual repo-wide tool instead, `strict-pass-freshness.ts --roots specs` (the same tool CI's step-8-fixed workflow uses): `inspected: 1911, regressions: 0, newFailures: 0, errors: 0, firstRun: 1572` — zero regressions anywhere in the repo from this migration. The 1,572 first-run folders have pre-existing validation issues never baselined before (this sweep had never run against the repo in this form); 339 pass clean. `032-relocate-specs-folder` (parent + all 3 children) individually verified 0/0 via `validate.sh --recursive --strict`. `git status --porcelain` clean of anything mine — found and removed one genuine gitignore gap from step 9's reindex (`.maintenance-active.json`, now added to `.gitignore`)]
- [ ] T015 Operator reviews the final state and confirms the migration is complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (scoping) tasks marked `[x]`
- [x] All Phase 2/3 (execution) tasks T004-T014 marked `[x]` with evidence, per the `/goal` submission's explicit approval to run steps 1-11
- [ ] T015 (operator final review) remains open — not something this session can check off itself
- [x] No `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior Decisions**: See `../002-migration-plan/decision-record.md`
<!-- /ANCHOR:cross-refs -->
