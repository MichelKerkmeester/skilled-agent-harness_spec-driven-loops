---
title: "Tasks: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the pre-change baseline: `git status --porcelain` and `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage 2>&1 | tail -30`, so SC-003 has a starting number (no file) Evidence: baseline full runtime suite 5 failed / 2853 passed / 8 skipped (159 files, 2 failing: check-contract-drift, render-command-contract stale compiled digests); `npm run typecheck` exit 0.
- [x] T002 [P] Reproduce the read-only finding: search the three scripts and two libraries for a read-only flag, then read `initDb` and the observability writer to confirm the write calls; record the command and output in `scratch/repro-read-only.md` Evidence: `scratch/repro-read-only.md` (no read-only flag anywhere; initDb creates dir, file, schema, version row). Holds.
- [x] T003 [P] Reproduce the run-open finding: send the config row the init step writes through `append-mode-event.cjs` in a temp directory and compare the ledger's first event with the step's direct state-log write; record in `scratch/repro-run-open.md` Evidence: `scratch/repro-run-open.md` (legacy row refused `stable-identity-missing`; direct-written row makes the next gateway append fail exit 2). Holds.
- [x] T004 [P] Reproduce the marker finding: apply the guard's algorithm to the shipped prompt's first line and record the match in `scratch/repro-marker.md` Evidence: `scratch/repro-marker.md` (`DEEP-RESEARCH` matches the guard pattern). Holds.
- [x] T005 [P] Reproduce the lock finding: acquire a lock, release it without a nonce, and record `released` plus whether the file remains in `scratch/repro-lock.md` Evidence: `scratch/repro-lock.md` (nonce-less release `released:false`, file remains). Holds.
- [x] T006 [P] Reproduce the refusal finding: send `config_warning` and `min_iterations_guard_pass` through the gateway and record the exit code and reason in `scratch/repro-refusal.md` Evidence: `scratch/repro-refusal.md` (both rows exit 1, `legacy-event-has-no-lossless-mode-event`). Holds.
- [x] T007 [P] Reproduce the upsert finding: read the coverage database's node and edge counts with a read-only query and compare them with the `graphEvents` a delta carries; record in `scratch/repro-upsert.md` Evidence: `scratch/repro-upsert.md` (10 delta files carry graphEvents, state log 0, coverage db 0 nodes / 0 edges for the run). Holds.
- [x] T008 [P] Reproduce the confirmed findings: the strategy's unticked boxes and registry counts, the resource map's zero references, and the `git add {state_paths.packet_dir}` pathspec listing; record in `scratch/repro-confirmed.md` Evidence: `scratch/repro-confirmed.md`. All hold.
- [x] T009 For every reproduction that does not show the reported defect, record the observation and remove the corresponding fix task before implementation starts (no file) Evidence: every reproduction showed its defect, so no fix task was removed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add a non-creating read-only open to the coverage graph module: require the file to exist, open with the read-only flag, and never create the directory, apply schema or write the version row (`.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts`) Evidence: `openReadOnlyDb` in coverage-graph-db.ts (read-only file open, patched in-memory copy when WAL side files are absent, in-memory schema when the file is absent); `DEEP_LOOP_COVERAGE_DB_DIR` override.
- [x] T011 Add the same non-creating read-only open to the council graph module (`.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts`) Evidence: `openReadOnlyDb` in council-graph-db.ts (immutable URI when side files are absent, in-memory schema when absent).
- [x] T012 Accept a read-only flag in the status script, use the non-creating open, skip the observability append, and return an empty result when the database is absent (`.skilled/skills/system-deep-loop/runtime/scripts/status.cjs`) Evidence: status.cjs `--read-only`; no observability append; `readOnly`/`databasePresent` in data.
- [x] T013 Accept the same flag in the query script and return an empty result when the database is absent (`.skilled/skills/system-deep-loop/runtime/scripts/query.cjs`) Evidence: query.cjs `--read-only`.
- [x] T014 Accept the same flag in the convergence script, skip the observability append and snapshot persistence, and return an empty result when the database is absent (`.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`) Evidence: convergence.cjs `--read-only` forces snapshot persistence off for coverage and council and skips the append.
- [ ] T015 [B] Pass the read-only flag from the doctor deep-loop route and workflow calls, and restate the write boundary so it no longer says the calls may create a database or append observability events (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-deep-loop.yaml`) Evidence: doctor-deep-loop.yaml passes `--read-only` on every call and restates the boundary. `_routes.yaml` is owned by another packet in flight: handed off (see implementation-summary.md).
- [x] T016 Open the research run by staging the config row through the append gateway instead of writing the state log, in the auto workflow (`.skilled/commands/deep/assets/deep-research-auto.yaml`) Evidence: auto `step_create_state_log` stages a canonical `deep_research.run_initialized` envelope through `append-mode-event.cjs`; fails closed.
- [x] T017 Mirror the run-open change in the confirm workflow, keeping its dry-run halt event (`.skilled/commands/deep/assets/deep-research-confirm.yaml`) Evidence: same in confirm, dry-run halt event kept.
- [x] T018 Flip the run-initialized census row to spoken with the workflow as producer if the run-open fix speaks that stem, then run the stem census (`.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`) Evidence: census row spoken by both workflows; `check-ledger-stem-producers.cjs` ok, spoken 14 / reserved 55; census test counts updated.
- [x] T019 Capture the acquisition nonce at lock acquire and pass it on every release path in both workflows (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-research-confirm.yaml`) Evidence: all 8 release commands carry `--nonce {captured_acquire_nonce}`; acquire captures `lock.acquireNonce`.
- [x] T020 Fix the marker guard so the canonical prompt-pack header does not match and a genuine nested-dispatch marker does, in both workflows (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-research-confirm.yaml`) Evidence: `nested_marker_pattern: "^(DEEP-REVIEW|CODE-REVIEW)$"` plus `canonical_header` in both workflows.
- [x] T021 Resolve each pinned bookkeeping row: decide per row whether it gets a lossless canonical home or is not emitted through the gateway, then align the emissions and the refusal handling in both workflows (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-research-confirm.yaml`) Evidence: refused rows (auto 8, confirm 14 directives; events config_warning, graph_convergence, lock_released, migration, min_iterations_guard_pass, stuckRecovery, plus confirm manualStop, pivot_confirm_accepted, pivot_override_accepted) moved to `bookkeeping_log` and listed under `state_write_protocol.pinned_bookkeeping`; `min_iterations_guard_already_passed` no longer reads a row that never lands.
- [x] T022 Source the graph upsert from the iteration delta file where `graphEvents` already lives, falling back to the state log only if the delta is absent, in both workflows (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-research-confirm.yaml`) Evidence: `step_graph_upsert` reads `deltas/iter-NNN.jsonl`, falls back to the state log only when the delta is absent, spawns upsert.cjs with an argument array.
- [x] T023 Require `answeredQuestions` and the path-bearing evidence fields in the canonical iteration record the agent writes (`.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`) Evidence: prompt pack requires `answeredQuestions`, finding `sources` and SOURCE node `path`.
- [x] T024 Merge each iteration's delta record into the record set question resolution reads, with the state log authoritative for status, iteration number and ratio and the delta supplying only absent evidence fields (`.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`) Evidence: reduce-state.cjs merges each delta iteration line into the state-log record, state log wins on every key it has; one delta pass shared with resource-map emission.
- [ ] T025 [B] Add the ignore rules for transient deep-research run state - lock, pause and run-now sentinels, projection watermarks - verify the lock-coordinator files stay tracked as they are in other packets, and record the tracked-versus-staged decision in `scratch/staging-decision.md` (`.gitignore`) Evidence: staging uses exclude pathspecs for the lock, both sentinels and the watermark dir; decision in `scratch/staging-decision.md`. The `.gitignore` rules are outside this build's file ownership: handed off.
- [x] T026 Create the read-only proof test: all three scripts against present, absent and older-schema databases, asserting no directory, file, observability or snapshot write, with the coverage database directory overridable for the test (`.skilled/skills/system-deep-loop/runtime/tests/unit/graph-read-only.vitest.ts`) Evidence: `graph-read-only.vitest.ts` 4/4 (absent, present byte-identical with sha256 listing, older schema untouched, writable control).
- [x] T027 Create the run-open test: extract the shipped init step from both workflow files, run it against a temp directory, and assert the ledger's first event and the state log's first row (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-run-open.vitest.ts`) Evidence: `deep-research-run-open.vitest.ts` 3/3 (both workflows plus the direct-write control exits 2).
- [x] T028 Create the graph upsert test: a delta with graph events reaches the coverage database and a node count above zero (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts`) Evidence: `deep-research-graph-upsert.vitest.ts` 4/4.
- [x] T029 Create the marker guard test: the canonical prompt header passes and a nested marker halts (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-marker-scan.vitest.ts`) Evidence: `deep-research-marker-scan.vitest.ts` passes.
- [x] T030 Create the lock contract test: every release command in both workflows carries the nonce (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts`) Evidence: `deep-research-lock-release.vitest.ts` passes (text contract plus a real acquire and rendered release).
- [x] T031 Extend the reducer tests with an iteration delta that answers key questions and a delta that carries path fields, and assert the strategy boxes, the answered count and the resource-map references (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts`) Evidence: three cases appended to `deep-research-reduce-state.vitest.ts`, file 21/21.
- [x] T032 Create the bookkeeping-emission contract test: every event name the workflows route through the gateway is either accepted by the gateway or absent from the workflow (`.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-bookkeeping-emission.vitest.ts`) Evidence: `deep-research-bookkeeping-emission.vitest.ts` 3/3, drives every directive through the real gateway; failed against the unchanged YAMLs first.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run the new and extended unit tests and read the pass and fail counts (`.skilled/skills/system-deep-loop/runtime/tests/unit/`) Evidence: the six new files plus the extended reducer test, loop-lock-cli, append-mode-event-legacy-seam and the census test: 10 files, 59/59 passed.
- [ ] T041 [B] Run the full runtime suite and compare it with the T001 baseline; a new failure blocks completion (no file) Evidence: final full suite 13 failed / 2867 passed / 8 skipped (165 files) against baseline 5 / 2853 / 8 (159 files). The 5 baseline failures persist unchanged (stale compiled contracts). 8 new failures are all in `tests/stress/cli-adapter/` (1-second timeouts and temp-dir cleanup under load average 19); none of those files references a changed module, and the same two failing files pass 36/36 when the working-tree `system-deep-loop` is copied outside the git worktree and when HEAD is exported the same way, so they track the shared worktree environment rather than this change. Left blocked until a quiet rerun inside the worktree confirms.
- [x] T042 Run `npm run typecheck` from the runtime root and read the exit status (`.skilled/skills/system-deep-loop/runtime/package.json`) Evidence: `npm run typecheck` exit 0 after all changes.
- [x] T043 Run the doctor route validator and the command-catalog mirror check after the route edit (`.skilled/commands/doctor/_routes.yaml`) Evidence: `route-validate.sh` exit 0 (9 routes, 2 informational warnings); `command-catalog-mirror-check.cjs` STATUS=OK exit 0.
- [x] T044 Run the stem census and the runtime-mirror sync check; write the mirrors if the check reports drift (`.skilled/skills/system-deep-loop/runtime/`) Evidence: `check-ledger-stem-producers.cjs` exit 0 (spoken 14, reserved 55, no violations); codex, pi and hermes prompt sync and `sync-runtime-mirrors.cjs` wrote nothing and each `--check` passed (34 prompts each; 174 mirrors).
- [x] T045 Run the read-only end-to-end probe against a scratch database directory and prove the directory is still absent afterwards (no file) Evidence: `DEEP_LOOP_COVERAGE_DB_DIR=<tmp>/absent node scripts/status.cjs ... --read-only` exit 0, `databasePresent:false`, directory still absent; read-only status, query and convergence (`--persist-snapshot`) against the repository database left the `database/` sha256 list and listing identical.
- [x] T046 Run a short fixture research run and verify: ledger event one is run-initialized, the coverage graph is non-empty, the question count mirrors the records, the resource map lists files, and no lock file survives (no file) Evidence: fixture run through the shipped auto-workflow steps (lock acquire, run open, gateway iteration, reducer with resource map, graph upsert, read-only status, lock release): receipt 1 `deep-research.ledger.run-initialized`, Q1 ticked and Q2 open with registry 1/1, resource map 1 reference naming the cited file, graph 3 nodes / 1 edge, release `released:true` and no lock file left.
- [x] T047 Reconcile the acceptance criteria rows with the observed evidence, update the packet docs, and record the final state (`.skilled/skills/system-spec-kit` continuity route) Evidence: acceptance rows reconciled (8 Met, AC-002 and AC-008 Unmet pending handed-off files); implementation-summary.md filled.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (run open and upsert fail closed; absent databases read as empty)
- [x] CHK-013 [P1] Code follows project patterns (gateway staging copies the run-now step; db open mirrors initDb)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (fixture research run and the read-only probes, see T045 and T046)
- [x] CHK-022 [P1] Edge cases tested (absent, present, older-schema and WAL databases; delta without graph events; direct-write control)
- [x] CHK-023 [P1] Error scenarios validated (direct-write run-open control exits 2; nonce-less release control; refused bookkeeping rows proven refused)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`rg getDb|initDb` over coverage-graph and council: every query helper reads through `getDb()`, which returns the read-only handle once opened.)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (Observability helpers and directory constants are consumed by status, convergence, upsert and council convergence; upsert is a writer and stays unchanged, council convergence only touches the directory for the snapshot lock that read-only disables.)
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (Flag on/off x coverage/council x absent/present/older-schema x snapshot on/off, covered by graph-read-only.vitest.ts.)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-03
<!-- /ANCHOR:summary -->

---


