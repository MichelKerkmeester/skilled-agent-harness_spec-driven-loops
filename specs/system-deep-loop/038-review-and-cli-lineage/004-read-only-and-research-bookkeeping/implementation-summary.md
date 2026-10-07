---
title: "Implementation Summary"
description: "The deep-loop graph scripts gained a read-only mode that provably leaves the filesystem untouched, the doctor route uses it, and a deep-research run now opens through the gateway, releases its lock, persists its graph, ticks answered questions, lists cited files and stages or tracks no transient state."
trigger_phrases:
  - "read only and research bookkeeping implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/004-read-only-and-research-bookkeeping"
    last_updated_at: "2026-10-03T08:55:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Closed the handoff sweep; 10 of 10 rows Met"
    next_safe_action: "Parent session reviews and commits the handoff sweep"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/status.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/query.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
      - ".skilled/commands/deep/assets/deep-research-confirm.yaml"
      - ".skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-read-only-and-research-bookkeeping"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-read-only-and-research-bookkeeping |
| **Completed** | 2026-10-03 (handoff sweep closed AC-002 and AC-008) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: built, verified and closed; all ten acceptance rows Met. A doctor run can now ask the deep-loop graph whatever it needs and prove it changed nothing, and a deep-research run now leaves a ledger, graph, question count, resource map and git index that match what the run did.

### Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping

`status.cjs`, `query.cjs` and `convergence.cjs` take `--read-only`. In that mode they open the database through a new non-creating open: an existing file opens read-only (from a patched in-memory copy when the WAL side files are absent, because a path open would recreate them), and a missing file is served from an empty in-memory schema. No directory, file, schema, version row, observability event or snapshot is written, and each payload reports `readOnly` and `databasePresent`. `DEEP_LOOP_COVERAGE_DB_DIR` now points the coverage graph at a scratch directory, the way `DEEP_LOOP_COUNCIL_DB_DIR` already did for the council graph. The doctor deep-loop workflow and its route in `_routes.yaml` pass the flag on every call, and the write boundary no longer claims the calls may create a database. `script-interface-contract.md` documents the flag and both directory variables.

On the research side, both workflows open a run by staging a canonical `deep_research.run_initialized` event through the append gateway, so the ledger's first frame is the run-initialized event and the stem census lists it as spoken. Every lock release carries the acquisition nonce. The marker guard ignores its own `DEEP-RESEARCH` header and halts only on a review marker. Bookkeeping rows the gateway refuses on purpose moved to a `bookkeeping_log` directive and are listed under `state_write_protocol.pinned_bookkeeping`, so no step routes a row that can only fail. The graph upsert reads graph events from the iteration delta file. The reducer merges each delta's iteration record into the thin state-log row (state log wins on every key it has), so `answeredQuestions` ticks strategy boxes, and the prompt pack now requires `answeredQuestions`, finding `sources` and SOURCE node `path`, which the resource map reads. Staging excludes the lock, both sentinels and the projection watermarks while lock-coordinator state stays staged, and the root `.gitignore` now ignores the same four names so an operator cannot add them by hand. The deep-review workflows had the same self-matching marker guard; it now ignores its own `DEEP-REVIEW` header and halts only on `DEEP-RESEARCH` or `CODE-REVIEW`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts` | Modified | `openReadOnlyDb`, `isReadOnlyDb`, `isReadOnlyDbPresent`; `DEEP_LOOP_COVERAGE_DB_DIR` override |
| `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts` | Modified | Same read-only open for the council graph |
| `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs` | Modified | `--read-only` flag |
| `.skilled/skills/system-deep-loop/runtime/scripts/query.cjs` | Modified | `--read-only` flag |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modified | `--read-only` flag, snapshot persistence forced off |
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` | Modified | Calls pass `--read-only`; write boundary restated |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modified | Gateway run open, nonce release, marker pattern, pinned bookkeeping, delta-sourced upsert, staging exclusions |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modified | Same fixes, dry-run halts kept |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modified | Run-initialized census row spoken |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | Requires `answeredQuestions`, `sources`, SOURCE `path` |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modified | Delta iteration merge for question resolution; one delta pass |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts` | Modified | Census counts 14 spoken / 55 reserved |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modified | Three delta-merge and resource-map cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/graph-read-only.vitest.ts` | Created | Read-only proof, byte-identical listing |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-run-open.vitest.ts` | Created | Shipped init step from both workflows |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts` | Created | Delta graph events reach the coverage graph |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-marker-scan.vitest.ts` | Created | Header passes, review marker halts |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts` | Created | Every release carries the nonce; real release removes the lock |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-bookkeeping-emission.vitest.ts` | Created | Every routed row accepted, every pinned row refused |
| `.skilled/commands/doctor/_routes.yaml` | Modified (handoff sweep) | Deep-loop invocations pass `--read-only`; `--persist-snapshot false` dropped |
| `.gitignore` | Modified (handoff sweep) | Ignores deep-research lock, sentinels and projection watermarks, with the reason |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modified (handoff sweep) | Marker guard matches only foreign markers |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-marker-scan.vitest.ts` | Created (handoff sweep) | Review header passes, foreign markers halt |
| `.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md` | Modified (handoff sweep) | Documents `--read-only` and both database directory variables |
| `.gitignore` | Modified (closing pass) | Also ignores `.deep-review.lock` and `.deep-review-pause` |
| 74 run-state files under `specs/` | Untracked (closing pass) | 34 locks and 40 watermark cursors leave the index; the files stay on disk |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modified (closing pass) | New worktrees get the deep-loop skill-root `@spec-kit/shared` link |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduce first: each of the eight findings was re-run against the tree before its fix (records in `scratch/repro-*.md`); all held, and the run-open finding held in a stronger form (the legacy row cannot pass the gateway at all, and a direct-written row makes the next gateway append fail with exit 2). Code was written by DeepSeek V4.1 Flash through cli-pi in one-change dispatches; a GPT-6 Luna dispatch hit its usage limit before writing anything and its work was re-split onto DeepSeek. Every executor diff was read and its checks re-run before the next dispatch. Two orchestrator edits followed review: the run-open command now exits non-zero when its node step fails (it could otherwise skip the gateway and pass), and the census test counts were updated for the newly spoken stem.

A handoff sweep, run after every packet was committed and no other writer remained, closed what this build had handed off. The route flag and the ignore rules were small literal edits made directly by the orchestrator. The review marker fix and its test were written by DeepSeek V4.1 Flash through cli-pi on opencode-go, and the contract doc by GPT-6 Luna through cli-codex; each diff was read and its checks rerun.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run open stages the canonical stem rather than the legacy row | The census only counts a stem as spoken when a producer names it, and the legacy row is refused for missing top-level identity anyway |
| WAL databases are read from a patched in-memory copy when side files are absent | A read-only path open recreates `-wal` and `-shm`, and better-sqlite3 ignores `immutable=1`; with side files present a writer may hold unflushed pages, so the path open stays |
| Refused bookkeeping rows become `bookkeeping_log`, not new stems | The schema pins them because they have no lossless research-event target; inventing stems would be a schema change this packet excludes |
| Staging excludes transient state by pathspec | The workflow owns its staging command, so the fix does not depend on `.gitignore`; coordinator state stays staged because other packets track it deliberately (`scratch/staging-decision.md`) |
| Delta merge lets the state log win on every key it has | Status, iteration number and ratio come from the gateway-authorized record; the delta only fills fields the projection drops |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plan-named tests plus reducer, loop-lock, legacy seam and census tests | PASS: 10 files, 59/59 |
| `npm run typecheck` (runtime root) | PASS: exit 0 (baseline exit 0) |
| Full runtime suite vs baseline | Baseline 5 failed / 2853 passed / 8 skipped (159 files). Final 13 failed / 2867 passed / 8 skipped (165 files). The 5 baseline failures are unchanged. 8 new failures, all in `tests/stress/cli-adapter/` (1-second timeouts, temp-dir cleanup, load average about 19); the two failing files tried pass 36/36 when the same working-tree code is copied outside the git worktree, and equally from a HEAD export. Treated as environment, not confirmed: needs a quiet rerun inside the worktree |
| Read-only probe, absent directory | PASS: `status ok`, `databasePresent:false`, exit 0; `test ! -e` exit 0 |
| Read-only probe, repository database | PASS: status, query and convergence `--persist-snapshot --read-only` left the `database/` sha256 list and listing identical |
| Fixture research run through shipped steps | PASS: receipt 1 run-initialized; Q1 ticked, Q2 open, registry 1/1; resource map 1 reference; graph 3 nodes / 1 edge; release `released:true`, no lock left |
| Staging dry run | PASS: only deltas and coordinator state listed; lock, pause sentinel and watermarks excluded |
| `check-ledger-stem-producers.cjs` | PASS: exit 0, spoken 14, reserved 55 |
| `route-validate.sh`; `command-catalog-mirror-check.cjs` | PASS: exit 0 each |
| Prompt sync (codex, pi, hermes) and runtime mirrors, with `--check` | PASS: nothing written; 34 prompts each and 174 mirrors in sync |
| Handoff sweep: `route-validate.sh` after the route edit | PASS: exit 0, 9 routes, 2 informational warnings; `--self-test` exit 0 |
| Handoff sweep: `git check-ignore -v` | PASS: the four transient names ignored (exit 0); coordinator state and grant journal not ignored (exit 1) |
| Handoff sweep: marker tests | PASS: `deep-review-marker-scan.vitest.ts` and `deep-research-marker-scan.vitest.ts`, 2 files, 4 tests |
| Handoff sweep: stress suite | Parent quiet run: 8 files passed, 151 passed, 8 skipped. Three reruns here at load 17 to 22: 6, 11 and 6 failures, a different set each run, all `exit null` timeouts; load-related |
| Handoff sweep: full suite without stress | 2 failed / 2729 passed (158 files). Baseline contract failures gone after the contract recompile; the 2 `fanout-run.vitest.ts` failures reproduce with the HEAD review workflows and come from the committed cli-pi opencode-go route change |
| Handoff sweep: `npm run typecheck` | PASS: exit 0 |
| Closing pass: `git ls-files` for lock, sentinel and watermark names | 0 entries after untracking 74 |
| Closing pass: `worktree-naming.sh provision` with the link removed | PASS: `1 installed, 0 failed`, exit 0, link recreated; `worktree-naming.test.sh` PASS=83 FAIL=0 |
| Closing pass: `fanout-run.vitest.ts` on the tree merged with main | PASS: 155 of 155 at load average 22 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Resolved in the handoff sweep: doctor route flag.** `_routes.yaml` now passes `--read-only` on all three deep-loop calls (AC-002 Met).
2. **Resolved in the handoff sweep: ignore rules.** The root `.gitignore` ignores the four transient names (AC-008 Met). Resolved in the closing pass: the 34 tracked locks and 40 tracked watermark cursors are untracked, and the review lock and pause sentinel are ignored too (T050).
3. **Resolved in the handoff sweep: stale compiled contracts.** The three deep-loop contracts were recompiled once every packet was committed; `check-contract-drift.cjs` reports `OK commands=3`.
4. **Stress suite is load-sensitive.** A quiet run passes (151 passed); under load average about 20 the cli-adapter stress tests time out in varying places. Not a regression from this packet.
5. **By design: the state log's config row is thin.** The `run_initialized` event carries the config only as `charterDigest` and `configDigest`, so the projection has no topic to write and puts the session id there. The full config lives in the config file, which the reducer reads. Carrying the topic would be a ledger schema change with no reader that needs it.
6. **Resolved in the handoff sweep: deep-review marker defect.** Both review workflows now use `nested_marker_pattern` (T048).
7. **Resolved in the handoff sweep: script interface doc.** The contract documents `--read-only` and both directory variables (T049).
8. **Resolved after merging main: the two fanout-run failures.** `fanout-run.vitest.ts` passes 155 of 155 on the merged tree.
<!-- /ANCHOR:limitations -->

---

