---
title: "Implementation Plan: Self-Healing Internals Hardening"
description: "Three independent, additive fixes over already-shipped package-011 machinery: a short fast-fail timeout around the drift-suspect write, a warning log on the suspect-queue reader's swallowed errors, and a startup sweep that recovers a stale .processing-* marker."
trigger_phrases:
  - "self-healing internals hardening plan"
  - "drift-suspect write latency guard plan"
  - "processing marker sweep plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/014-self-healing-internals-hardening"
    last_updated_at: "2026-07-09T17:32:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Dropped F13 from approach, hardened F8/F12 mechanism detail"
    next_safe_action: "Plan approval, then implement; no hard ordering dependency on other 028 phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/startup-checks.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-014-self-healing-internals-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F8: pragma-toggle mechanism confirmed safe and implemented"
      - "F12: merge-all merge policy confirmed and implemented"
---
# Implementation Plan: Self-Healing Internals Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | TypeScript on Node (MCP server, `mcp_server/**`, compiled to `mcp_server/dist/**`); `better-sqlite3` (fully synchronous driver) |
| **Framework** | None — direct edits to three already-shipped modules, no new abstraction layer |
| **Storage** | Existing `config` SQLite table (suspect queue, unchanged); existing dotfile marker convention in the memory DB directory (F12's sweep target) |
| **Testing** | vitest, extending package 011's existing suites (`memory-drift-healing.vitest.ts`, `startup-checks.vitest.ts`) |

### Overview
All three fixes are small, independent, additive edits over machinery that already exists and already works
correctly for its primary purpose — none of the three is a redesign. Each can ship and be verified on its
own with no cross-fix dependency:

- **F8** narrows a timeout window around one existing INSERT call. No new call sites, no new table, no new
  flag.
- **F11** adds one `console.warn` inside an existing catch block. Zero behavioral change to the function's
  return value.
- **F12** adds one new boot-time sweep function following the exact shape of `consumeMemoryDriftDirtyMarker`
  itself and the existing `checkJournalMode`/`checkSqliteVersion` boot-check pattern.

**Ready to implement directly** (mechanism confirmed against the live tree, no further investigation
needed): F11 (single log line).

**Needs a light implementation-time decision, not a redesign** (see spec.md Open Questions): F8's exact
fast-fail mechanism (per-write `busy_timeout` toggle vs. deferred fire-and-forget write — the toggle is the
leading candidate, see Key Components below) and F12's multi-stale-file merge policy.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct file:line reads of the
  live package-011 code, cross-checked against the source review digest and corrected where the digest's
  own citation had drifted from the current tree — see spec.md's F12 discussion)
- [x] Success criteria measurable
- [x] Dependencies identified (none block start; F8 has a forward dependency on a future flag-graduation
  decision, not on anything upstream of this phase)

### Definition of Done
- [x] F8 fix implemented: suspect-write worst-case latency bounded well below the 10s connection timeout,
  measured (REQ-001) -- pragma-toggle to 25ms at `memory-search.ts:418`; two-connection lock-contention test
  measured the fixed path at well under 100ms while the unfixed baseline blocked for the held lock's full
  window (`tests/memory-search-drift-suspect-write-timeout.vitest.ts`)
- [x] F12 fix implemented: stale `.processing-*` marker recovered at next boot (REQ-002) --
  `sweepStaleMemoryDriftProcessingMarkers` in `startup-checks.ts`, wired into `context-server.ts` boot
  sequence before `consumeMemoryDriftDirtyMarker`; verified against the exact SIGKILL repro
  (`tests/startup-checks-processing-marker-sigkill.vitest.ts`)
- [x] F11 fix implemented: read failure now logged (REQ-003) -- `memory-drift-healing.ts:98`
- [x] Zero behavioral regression to any of package 011's existing default-off/default-on flag states (NFR-R01)
  -- package 011's four named regression suites (memory-drift-healing, memory-roadmap-flags,
  orphan-sweep-corpus-repair, startup-checks) all pass unchanged; see implementation-summary.md Verification
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent, additive point-fixes — no new abstraction, no new storage, no new process. Each fix
touches a different function and can be implemented, tested, and reviewed as its own small diff.

### Key Components

**F8 — bounded suspect-write timeout.** The leading mechanism: immediately before the
`appendMemoryDriftSuspects(requireDb(), stats.suspectIds)` call at `memory-search.ts:418`, temporarily lower
the shared connection's `busy_timeout` pragma to a short value (well under the 100ms bound, e.g. tens of
milliseconds), issue the write inside the existing try/catch, then restore the connection's original `busy_timeout` (10000)
in a `finally` immediately after — success or failure. This is safe specifically because `better-sqlite3` is
fully synchronous and Node is single-threaded: no other statement can interleave on the same connection
between the pragma lowering and the pragma restore, so the narrowed window cannot leak into an unrelated
concurrent query. The restore must be unconditional (`finally`, not just the catch path) so a successful
fast write does not leave the connection permanently running with a shortened timeout. If, during
implementation, this pragma-toggle approach is found to have an unacceptable interaction with
`better-sqlite3`'s pragma caching or with another concurrent in-process caller of the same connection, the
documented fallback is deferring the write to run after the query response has been serialized (a
same-tick `setImmediate`), which avoids touching the connection's timeout at all at the cost of not being
able to report write failure synchronously to anything (already true today, since the call is fire-and-forget
from the caller's perspective).

**F11 — one log line.** `readMemoryDriftSuspects`'s existing `catch { return []; }` at
`memory-drift-healing.ts:98` becomes `catch (error: unknown) { console.warn(...); return []; }`, using the
same safe error-to-string handling already established elsewhere in this module's sibling file
(`memory-search.ts`'s `toErrorMessage` pattern at its own catch site, `:420`). No other line in the function
changes; the fallback value and its callers are untouched.

**F12 — startup sweep for stale processing markers.** A new function, `sweepStaleMemoryDriftProcessingMarkers`
(or equivalent name chosen at implementation time), added to `startup-checks.ts` alongside
`consumeMemoryDriftDirtyMarker`, following the same synchronous, side-effect-scoped, never-block-boot shape
as the existing `checkJournalMode`/`checkSqliteVersion`/`detectNodeVersionMismatch` checks. It globs the
memory DB directory (the same directory `resolveMemoryDriftMarkerPath` already resolves) for files matching
`${MEMORY_DRIFT_MARKER_FILENAME}.processing-*`, and for each one found with no live process still holding
it (a stale marker from a prior, now-dead boot — the PID embedded in the filename gives a cheap sanity
check, though liveness is not strictly required since the canonical marker path is checked first and this
only runs when it is absent): merges the stale file's entries back toward the canonical marker path
(respecting the multi-stale-file open question — merge-all vs. most-recent-only, resolved before code is
written) so the *next* line of boot, the existing `consumeMemoryDriftDirtyMarker` call, picks them back up
through its already-correct consume-and-scope-scan path. This deliberately reuses
`consumeMemoryDriftDirtyMarker` for the actual consumption rather than duplicating its scoped-scan logic —
the sweep's only new responsibility is "get the stale file back into the shape the existing consumer already
knows how to handle." Wired into `context-server.ts`'s boot sequence immediately before the existing
`consumeMemoryDriftDirtyMarker` call at `:2229`, so recovery happens on the same boot that would otherwise
just silently miss the stale file.

### Data Flow
F8: query hits existence filter -> row excluded -> suspect id collected -> before-call pragma lowered ->
INSERT attempted -> pragma restored in `finally` -> catch handles any failure exactly as today -> query
response returned, now bounded to the short timeout instead of the full 10s in the contended case.
F11: suspect-queue read requested -> parse/read fails -> `console.warn` logs the failure -> `[]` returned,
unchanged. F12: boot starts -> new sweep checks for stale `.processing-*` files -> if found, merges/restores
toward the canonical marker path -> existing `consumeMemoryDriftDirtyMarker` runs immediately after and picks
up the recovered entries through its already-correct path -> stale file no longer present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-search.ts:418` suspect-write call site | Calls `appendMemoryDriftSuspects` with no timeout bound narrower than the connection's 10s default | Wrap with a short-timeout pragma toggle (or the documented deferred-write fallback) | Reused two-process lock-contention test shows the call fails or defers in under 100ms, not the ~10,293ms baseline block; unrelated query on the same connection afterward still observes the restored 10000ms setting |
| `memory-drift-healing.ts:98` `readMemoryDriftSuspects` catch | Silently returns `[]` on any read/parse failure | Add a `console.warn` naming the failure before returning `[]` | Forced read failure produces exactly one warning log line; return value unchanged |
| `startup-checks.ts` boot-check set | Has `consumeMemoryDriftDirtyMarker` (claims and consumes the canonical marker) with no recovery path for its own stale `.processing-*` claim files | Add a new sweep function following the existing boot-check shape | Confirmed repro (external SIGKILL after the `.processing-*` rename-claim, before completion) is recovered at the next boot; boot with no stale file is a silent no-op |
| `context-server.ts:2229` boot sequence | Calls `consumeMemoryDriftDirtyMarker` with no prior recovery step | Add one call to the new sweep function immediately before it | Boot completes normally with and without a stale file present; ordering places recovery before normal consumption |

Required inventories:
- Existing suspect-write and connection-timeout precedent: `rg -n "busy_timeout|appendMemoryDriftSuspects" .opencode/skills/system-spec-kit/mcp_server` — confirms the single call site this plan bounds and the single place the connection-level timeout is set.
- Existing boot-check precedent: `rg -n "checkJournalMode|checkSqliteVersion|detectNodeVersionMismatch|consumeMemoryDriftDirtyMarker" .opencode/skills/system-spec-kit/mcp_server/startup-checks.ts .opencode/skills/system-spec-kit/mcp_server/context-server.ts` — confirms the exact pattern the new sweep follows and its insertion point.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm all three cited call sites against the live tree in case a concurrent session has touched
  these files since this plan was written (`rg -n "appendMemoryDriftSuspects|readMemoryDriftSuspects|
  consumeMemoryDriftDirtyMarker"`)
- [x] Decide F8's mechanism (pragma-toggle vs. deferred write) and F12's multi-stale-file merge policy
  (spec.md Open Questions), documenting the decision before writing code -- F8: pragma toggle; F12: merge-all

### Phase 2: F11 — Suspect-Queue Read Warning (smallest, zero behavior change)
- [x] Add the `console.warn` to `readMemoryDriftSuspects`'s catch block (`memory-drift-healing.ts:98`)
- [x] Unit test: forced read failure logs once and still returns `[]`

### Phase 3: F8 — Bounded Suspect-Write Timeout
- [x] Implement the chosen mechanism (pragma toggle around the call, or deferred write) at the
  `memory-search.ts:418` call site
- [x] Unit/integration test: reuse the confirmed two-process lock-contention test (held write lock, ~10,293ms
  baseline block) and assert the call now fails or defers in under 100ms, not the full 10s
- [x] Unit test: the connection's `busy_timeout` is confirmed restored to 10000 after the call, success or
  failure, verified against a subsequent unrelated query on the same connection
- [x] Unit test: normal (non-contended) write still succeeds and the suspect queue reflects it, unchanged

### Phase 4: F12 — Stale Processing-Marker Sweep
- [x] Implement the new sweep function in `startup-checks.ts`, following the existing boot-check pattern
- [x] Wire it into `context-server.ts`'s boot sequence immediately before the existing
  `consumeMemoryDriftDirtyMarker` call (`:2229`)
- [x] Boot-sweep acceptance test using the confirmed exact repro: externally SIGKILL the process after the
  `.processing-*` rename-claim but before `consumeMemoryDriftDirtyMarker` completes; the recovered entries
  reach the normal scoped-scan path at the next boot
- [x] Unit test: boot with no stale file present is unaffected (no new log noise, no behavior change)
- [x] Unit test (merge-all policy chosen): two stale files at once both recover, entries merged into the
  restored canonical marker

### Phase 5: Verification
- [x] `bash validate.sh --strict` run, evidence captured
- [x] Confirm zero regression to package 011's existing default-off/default-on flag states (NFR-R01,
  code-review pass against package 011's own existing test suites)
- [x] Documentation updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | F11 log-and-fallback, F8 pragma restore correctness, F12 sweep merge/no-op paths | vitest, extending `memory-drift-healing.vitest.ts` and `startup-checks.vitest.ts` |
| Integration | F8 simulated lock-contention timing bound; F12 boot-time recovery of a synthetic stale processing file feeding into the real scoped-scan path | vitest against a fixture DB connection / fixture memory DB directory |
| Regression | Package 011's existing suites (`memory-drift-healing.vitest.ts`, `memory-roadmap-flags.vitest.ts`, `orphan-sweep-corpus-repair.vitest.ts`, `startup-checks.vitest.ts`) re-run unchanged to confirm no behavioral drift | vitest |
| Regression | `validate.sh --strict` sweep after implementation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Package 011 (`028-memory-search-intelligence/011-automatic-drift-self-healing`) | Internal | Shipped | This entire phase is a hardening pass over 011's already-shipped code; without it there is nothing here to fix |
| `better-sqlite3`'s synchronous pragma semantics (`busy_timeout`) | External library behavior | Assumed stable, standard SQLite pragma | If per-connection pragma toggling proves unsafe in practice during implementation, the documented deferred-write fallback (see plan.md Key Components, F8) is the alternative mechanism |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the three fixes is found in review or testing to change behavior beyond its narrow
  intended scope (e.g. F8's timeout restore leaks to an unrelated query).
- **Procedure**: Each fix is an independent, small diff — revert the specific fix's commit/hunk without
  affecting the other two. None of the three introduces a new feature flag, so there is no flag-flip
  rollback path; rollback is a direct code revert. No data migration exists for any of the three fixes (F12
  touches only ephemeral marker files, not the memory database itself), so no data-reversal step is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (F11) ──► Phase 5 (Verify)
                └──► Phase 3 (F8)  ──►
                └──► Phase 4 (F12) ──►
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | F11, F8, F12 |
| F11 | Setup | Verify |
| F8 | Setup | Verify |
| F12 | Setup | Verify |
| Verify | F11, F8, F12 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| F11 (read-error log) | Low | 0.5 hour |
| F8 (bounded suspect-write timeout) | Med | 2-4 hours |
| F12 (stale processing-marker sweep) | Med | 2-4 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-11.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] F8's mechanism decision (pragma-toggle vs. deferred write) recorded before merge
- [ ] F12's multi-stale-file merge policy recorded before merge

### Rollback Procedure
1. Each fix is independently revertable — revert the specific commit/hunk for the fix in question.
2. No feature flag exists for any of the three fixes, so rollback is a direct code revert, not a flag flip.
3. `git revert` the relevant commit(s) if a targeted hunk-level revert is not clean.
4. Re-run `validate.sh --strict` and the package-011 regression suite to confirm the revert restored expected
   behavior.

### Data Reversal
- **Has data migrations?** No — none of the three fixes changes the database schema or the marker file
  format. F12 only reads/renames existing dotfiles in the memory DB directory.
- **Reversal procedure**: Not applicable; no persisted state is introduced that a revert would need to
  clean up beyond a stray `.processing-*` file, which is already self-describing and safe to delete
  manually if ever needed.
<!-- /ANCHOR:enhanced-rollback -->
