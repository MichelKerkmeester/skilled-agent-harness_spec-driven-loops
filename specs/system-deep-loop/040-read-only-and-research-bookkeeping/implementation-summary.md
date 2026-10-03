---
title: "Implementation Summary"
description: "The deep-loop graph scripts gained a read-only mode that provably leaves the filesystem untouched, and a deep-research run now opens through the gateway, releases its lock, persists its graph, ticks answered questions, lists cited files and stages no transient state. Two verifications wait on files owned elsewhere."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/040-read-only-and-research-bookkeeping"
    last_updated_at: "2026-10-03T08:55:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Built read-only mode and research bookkeeping fixes; 8 of 10 acceptance rows Met"
    next_safe_action: "Land the handed-off route and ignore edits, then re-verify AC-002 and AC-008"
    blockers:
      - "AC-002 needs --read-only in .skilled/commands/doctor/_routes.yaml (owned by another packet)"
      - "AC-008 needs transient run-state rules in .gitignore (outside this build's ownership)"
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
      session_id: "scaffold-040-read-only-and-research-bookkeeping"
      parent_session_id: null
    completion_pct: 85
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
| **Spec Folder** | 040-read-only-and-research-bookkeeping |
| **Completed** | Not yet: 8 of 10 acceptance rows Met, 2 wait on handed-off files |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: built and verified for everything this build owns; not closeable yet. A doctor run can now ask the deep-loop graph whatever it needs and prove it changed nothing, and a deep-research run now leaves a ledger, graph, question count, resource map and git index that match what the run did.

### Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping

`status.cjs`, `query.cjs` and `convergence.cjs` take `--read-only`. In that mode they open the database through a new non-creating open: an existing file opens read-only (from a patched in-memory copy when the WAL side files are absent, because a path open would recreate them), and a missing file is served from an empty in-memory schema. No directory, file, schema, version row, observability event or snapshot is written, and each payload reports `readOnly` and `databasePresent`. `DEEP_LOOP_COVERAGE_DB_DIR` now points the coverage graph at a scratch directory, the way `DEEP_LOOP_COUNCIL_DB_DIR` already did for the council graph. The doctor deep-loop workflow passes the flag on every call and its write boundary no longer claims the calls may create a database.

On the research side, both workflows open a run by staging a canonical `deep_research.run_initialized` event through the append gateway, so the ledger's first frame is the run-initialized event and the stem census lists it as spoken. Every lock release carries the acquisition nonce. The marker guard ignores its own `DEEP-RESEARCH` header and halts only on a review marker. Bookkeeping rows the gateway refuses on purpose moved to a `bookkeeping_log` directive and are listed under `state_write_protocol.pinned_bookkeeping`, so no step routes a row that can only fail. The graph upsert reads graph events from the iteration delta file. The reducer merges each delta's iteration record into the thin state-log row (state log wins on every key it has), so `answeredQuestions` ticks strategy boxes, and the prompt pack now requires `answeredQuestions`, finding `sources` and SOURCE node `path`, which the resource map reads. Staging excludes the lock, both sentinels and the projection watermarks while lock-coordinator state stays staged.

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
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Reproduce first: each of the eight findings was re-run against the tree before its fix (records in `scratch/repro-*.md`); all held, and the run-open finding held in a stronger form (the legacy row cannot pass the gateway at all, and a direct-written row makes the next gateway append fail with exit 2). Code was written by DeepSeek V4.1 Flash through cli-pi in one-change dispatches; a GPT-6 Luna dispatch hit its usage limit before writing anything and its work was re-split onto DeepSeek. Every executor diff was read and its checks re-run before the next dispatch. Two orchestrator edits followed review: the run-open command now exits non-zero when its node step fails (it could otherwise skip the gateway and pass), and the census test counts were updated for the newly spoken stem.
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Handed off: doctor route flag.** `.skilled/commands/doctor/_routes.yaml` lines 57-59 still call status, query and convergence without `--read-only` (convergence still says `--persist-snapshot false`). Another packet is editing that file, so this build did not touch it. AC-002 stays Unmet until the three invocations add `--read-only`.
2. **Handed off: ignore rules.** `.gitignore` has no deep-research run-state rules, so `git check-ignore` on a lock file still finds nothing. Staging is already safe through the pathspecs. AC-008 stays Unmet until the root ignore file gains rules for `.deep-research.lock`, `.deep-research-pause`, `.deep-research-run-now` and `.legacy-projection-watermarks/`.
3. **Stale compiled contracts.** `check-contract-drift` and three `render-command-contract` cases failed before this build (stale source digests across several commands and system-spec-kit references) and still fail. Recompiling with `compile-command-contracts.cjs --write` would also seal other packets' in-flight files into the digests, so it was left for the operator.
4. **Stress suite.** See the verification row; the 8 cli-adapter failures need a rerun inside the worktree on a quiet machine before SC-003 can be called met.
5. **Projection drops config fields.** The gateway's projection writes a thin state-log config row (topic is replaced by the session id); the reducer reads the config file instead, so nothing breaks, but the state log's first row is not a full config record.
6. **Same marker defect in deep-review.** `deep-review-auto.yaml` uses the same self-matching pattern; deep-review is outside this packet.
7. **Script interface doc.** `runtime/references/script-interface-contract.md` does not yet describe `--read-only` or `DEEP_LOOP_COVERAGE_DB_DIR`.
<!-- /ANCHOR:limitations -->

---

