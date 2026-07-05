---
title: "Implementation Plan: mk-deep-loop-guard-retention"
description: "Add sweep/archive/prune retention to mk-deep-loop-guard.js, mirroring mk-goal.js's architecture but adapted to this plugin's fully synchronous, queue-free I/O model."
trigger_phrases:
  - "mk-deep-loop-guard retention plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention"
    last_updated_at: "2026-07-04T20:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan and executed the implementation"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-mk-deep-loop-guard-retention-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: mk-deep-loop-guard-retention

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM plugin (`mk-deep-loop-guard.js`), fully synchronous fs API (`readFileSync`/`writeFileSync`/`renameSync`/`unlinkSync`/`readdirSync`/`statSync`) |
| **Framework** | None |
| **Storage** | `.opencode/skills/.loop-guard-state/*.json` + `guard-warnings.log` (runtime data, not source) |
| **Testing** | Plain-script assertions in `mk-deep-loop-guard.test.cjs` (no `node:test` `test()`/`describe()` registration, run as a single file under `node --test`) |

### Overview
Three new functions (sweep, archive-dir helper, archive-prune) plus one new `event` hook, mirroring `mk-goal.js`'s architecture. The one deliberate deviation: no per-session mutation queue, because this plugin's concurrency model does not need one (see Architecture below).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sweep-archive-prune, mirroring `mk-goal.js`, minus the mutation queue.

### Why no mutation queue is needed here

`mk-goal.js` needs `enqueueGoalMutation`/`mutationQueues` because its I/O is fully async (`node:fs/promises`): every `await` is a point where another event -- including a concurrent write to the same session's state -- can interleave, creating the TOCTOU window that phase 022 of the goal-plugin packet fixed (a sweep's stale read racing a queued write). `mk-deep-loop-guard.js` has no such window: every state-touching function uses the synchronous `*Sync` fs API, and neither `tool.execute.before` nor the new `event` hook contains an `await` before it touches a state file. Node executes synchronous code to completion before yielding the event loop, so once a sweep pass starts, no other hook invocation (including a concurrent `recordLoopDispatch` write) can run until it finishes. This makes the sweep atomic with respect to other dispatches by construction, without needing an explicit queue.

### Key Components
- **`positiveIntFromEnv(envName, fallback)` (new)**: shared env-var parser for the three new retention constants; no dependency on `mk-goal.js`'s equivalent (the two plugins share no util module).
- **`ensureLoopGuardArchiveDir(stateDir)` (new)**: `mkdirSync(archiveDir, { recursive: true, mode: 0o700 })`, mirroring `ensureGoalArchiveDir`.
- **`pruneLoopGuardArchive(stateDir)` (new)**: deletes archived files past `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS`; called only from inside the sweep below (already throttled), no separate timer.
- **`sweepStaleLoopGuardStates(stateDir, runtimeState)` (new)**: throttled by `MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` via `runtimeState.lastLoopGuardSweepAtMs`; for each top-level `.json` file, a single mtime check against `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` decides staleness (no second content-level check -- see Architecture above for why the two-stage check `mk-goal.js` needs for its async TOCTOU protection does not apply here); stale files are `renameSync`'d into `.archive/`; ends by calling `pruneLoopGuardArchive`.
- **`pruneStaleWarningLog(stateDir)` (new)**: called from `appendWarningLog` before every append; deletes `guard-warnings.log` if its own mtime exceeds the archive-retention window, mirroring `mk-goal.js`'s `pruneJsonlLog` whole-file rotation.
- **`runtimeState = { lastLoopGuardSweepAtMs: 0 }` (new)**: declared once per plugin instantiation inside `MkDeepLoopGuardPlugin`, closed over by the new `event` hook.
- **`event` hook (new)**: `async event(input) { const type = input?.event?.type || input?.type; if (type === 'session.created') sweepStaleLoopGuardStates(loopStateDir, runtimeState); }`, added alongside the existing `tool.execute.before` hook in the returned hooks object.

### Data Flow
No change to the plugin's two existing detection checks. The only new behavior: a per-session state file that has gone untouched for 2+ days is moved (not deleted) into `.archive/`, and an archived file that has sat for 90+ days is deleted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-deep-loop-guard.js` hooks object | Only `tool.execute.before` | Add `event` hook | New test confirms `session.created` triggers the sweep, `session.idle` does not |
| `.loop-guard-state/*.json` | Accumulates forever | Swept into `.archive/` past 2 days | Mutation-proved regression test |
| `.loop-guard-state/.archive/*.json` | Did not exist | Pruned past 90 days | Fresh-instance sweep test deletes a backdated archived fixture |
| `guard-warnings.log` | Grows forever | Whole-file rotation past 90 days dormant | Mirrors `pruneJsonlLog`'s existing, already-tested pattern in `mk-goal.js` (not independently re-tested here; same simple mtime-gate logic) |
| `ENV_REFERENCE.md` | 0 of this plugin's 5 env vars documented | New section, all 5 | Grep confirms presence |

Required inventories:
- `rg -n "mk-deep-loop-guard.js" .opencode/plugins/tests/` confirmed only `mk-deep-loop-guard.test.cjs` imports this plugin -- no other test file's behavior depends on its export shape.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [x] Run the full plugin suite fresh (110/110 baseline, unchanged from before this session's other work)
- [x] Read the full current `mk-deep-loop-guard.js` and its test file to confirm the exact hook registration shape and existing state-write helpers before designing the mirror

### Phase 2: Core Implementation
- [x] Add retention constants, `positiveIntFromEnv`, `ensureLoopGuardArchiveDir`, `pruneLoopGuardArchive`, `sweepStaleLoopGuardStates`, `pruneStaleWarningLog`
- [x] Wire `pruneStaleWarningLog` into `appendWarningLog`
- [x] Declare `runtimeState` in the plugin factory; add the `event` hook
- [x] Add sweep/archive/prune/throttle/event-type regression tests to `mk-deep-loop-guard.test.cjs`
- [x] Run the new tests GREEN; mutation-prove by disabling the sweep call and confirming the exact test fails, then restore

### Phase 3: Verification
- [x] Full plugin suite green (110/110, unchanged aggregate since this test file has no internal `test()` registrations)
- [x] `node --check` on both modified files; comment hygiene; alignment drift
- [x] Sync `ENV_REFERENCE.md`, the feature catalog entry, and the manual testing playbook entry (including the two pre-existing undocumented env vars for a coherent section)
- [x] Write `implementation-summary.md`; set this phase's spec.md Status to Complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (mutation-proved) | Sweep archives stale, leaves fresh (REQ-001) | Backdated fixture via `fs.utimesSync`; disable-then-restore the sweep call to prove the test is load-bearing |
| Regression | Sweep throttle prevents re-sweep on the same instance (REQ-002) | Same plugin instance, second immediate `event()` call |
| Regression | Archive prune deletes past-retention files (REQ-003) | Fresh plugin instance (unswept `runtimeState`) guarantees the sweep runs unthrottled |
| Regression | Only `session.created` triggers the sweep (REQ-004) | Fresh instance fired with `session.idle` instead |
| Static | All 5 env vars documented (REQ-005) | Grep |
| Regression | Full existing plugin suite (mode-mismatch, loop-repeat, identity resolution, fail-open paths) | `node --test .opencode/plugins/tests/*.test.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any regression in the existing mode-mismatch/loop-repeat suite, or a false-positive archive of an in-use session's state
- **Procedure**: Revert the plugin and test file via targeted `git checkout`; no persisted runtime data format changed (state files keep their existing shape), so no migration is needed either direction
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

Single small packet: implement, mutation-prove, verify, sync docs. No dependency on any other in-flight packet (the natural sibling packet was deliberately avoided while it was mid-restructure by a concurrent session).
<!-- /ANCHOR:sequencing -->
