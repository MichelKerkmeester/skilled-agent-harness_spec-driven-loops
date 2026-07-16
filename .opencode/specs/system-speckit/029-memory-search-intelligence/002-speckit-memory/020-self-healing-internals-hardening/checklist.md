---
title: "Verification Checklist: Self-Healing Internals Hardening"
description: "QA checklist for the three package-011 hardening fixes (F8/F11/F12). All items verified with evidence after implementation."
trigger_phrases:
  - "self-healing internals hardening"
  - "drift-suspect write latency guard"
  - "processing marker sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/020-self-healing-internals-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-014-self-healing-internals-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Self-Healing Internals Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Items below are checked with evidence as the build completed. See implementation-summary.md Verification for
the full test-run and validate.sh transcript.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md -- see `spec.md:203` (REQUIREMENTS section, REQ-001
  through REQ-003)
- [x] CHK-002 [P0] Technical approach defined in plan.md -- see `plan.md:110` (ARCHITECTURE section, Key
  Components)
- [x] CHK-003 [P1] F8's timeout mechanism and F12's merge policy decided and documented (`spec.md:320` Open
  Questions, `tasks.md` T002/T003) -- F8: pragma toggle (25ms); F12: merge-all
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks -- `npm run typecheck` (`tsc --noEmit`) clean, 0 errors;
  `npm run build` (`tsc --build && finalize-dist.mjs`) clean, 0 errors
- [x] CHK-011 [P0] No console errors or warnings beyond the intentional F11 warning log -- F8's catch path
  reuses the pre-existing `[memory-search] Could not queue drift suspect rows` warning (unchanged message,
  now also fires on a fast-fail); F12's sweep only warns/errors on an actual stale-file recovery or a
  malformed stale file, both intentional and documented
- [x] CHK-012 [P1] Error handling implemented (F8's existing try/catch contract preserved unchanged; F12's
  malformed-stale-file case is non-fatal, matching package 011's existing NFR-R01 precedent) -- verified by
  `tests/memory-search-drift-suspect-write-timeout.vitest.ts` (non-timeout failure still caught) and
  `tests/startup-checks.vitest.ts` (malformed stale file logged, not thrown)
- [x] CHK-013 [P1] Code follows project patterns (F12's sweep follows the existing
  `checkJournalMode`/`checkSqliteVersion`/`detectNodeVersionMismatch` boot-check shape; F8's timeout
  restore uses `finally`, not a duplicated catch-path restore) -- confirmed by direct read of
  `startup-checks.ts` and `memory-search.ts`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-003 in spec.md) -- see `checklist.md:181`
  (CHK-060 through CHK-069, Finding-Specific Verification Evidence)
- [x] CHK-021 [P0] Manual/integration testing complete for F8's lock-contention scenario and F12's
  killed-mid-boot recovery scenario, not just unit-level mocks -- F8 uses two real independent
  `better-sqlite3` connections to the same on-disk file (the codebase's own established two-connection
  contention convention, see `n3lite-consolidation.vitest.ts`); F12 spawns a real child process via `tsx`
  and genuinely SIGKILLs it mid-`runScopedScan`, after the real rename-claim, exactly matching the confirmed
  repro window
- [x] CHK-022 [P1] Edge cases tested (F8: healthy-write-under-the-short-bound still succeeds; F12:
  multiple stale files at once per the T003 decision, malformed stale file) -- see
  `tests/memory-search-drift-suspect-write-timeout.vitest.ts` and `tests/startup-checks.vitest.ts`
- [x] CHK-023 [P1] Error scenarios validated (F8: non-timeout failure still caught by the existing outer
  try/catch; F11: log line itself cannot throw on a malformed error object; F12: unreadable stale file
  logged, not a boot failure) -- see `tests/memory-search-drift-suspect-write-timeout.vitest.ts:156`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the three findings has a finding class: F8 is `instance-only` (one call
  site), F11 is `instance-only` (one catch block), F12 is `instance-only` (one boot-consumption path).
- [x] CHK-FIX-004 [P0] F8's lock-contention path and F12's concurrent-boot/killed-boot path include
  adversarial tests (simulated lock held past the short timeout; simulated external kill mid-consume) --
  `tests/memory-search-drift-suspect-write-timeout.vitest.ts` (real two-connection lock contention);
  `tests/startup-checks-processing-marker-sigkill.vitest.ts` (real child process, real SIGKILL)
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed for F12 (zero/one/multiple stale files) -- zero:
  "is a no-op ... no stale file is present"; one: the SIGKILL acceptance test; multiple: "merge-all policy:
  multiple stale processing files..."; malformed: "a malformed/unreadable stale file..."; live-marker
  coexistence: "merges recovered entries into an existing live canonical marker..." -- all in
  `tests/startup-checks.vitest.ts` / `tests/startup-checks-processing-marker-sigkill.vitest.ts`
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed for F8 (the shared connection's pragma
  state under concurrent access) since this is exactly the kind of process-wide-state change this project's
  fix-completeness checklist calls out -- test asserts the pragma on the shared connection immediately after
  the fast-fail AND after a subsequent unrelated query; see
  `tests/memory-search-drift-suspect-write-timeout.vitest.ts:123`
- [x] CHK-FIX-007 [P1] Evidence pinned to an explicit diff range or commit SHA, not a moving branch-relative
  claim -- this packet is uncommitted at verification time (per task constraints, no commit was made); test
  file paths and named test titles are cited above as the pinned evidence instead of a SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets -- `grep -rni "password\|secret\|api_key"` over the four changed
  source files returned only a pre-existing, unrelated constant name (`API_KEY_VALIDATION_TIMEOUT_MS`, a
  timeout duration, not a secret value); none of this packet's own additions match
- [x] CHK-031 [P0] F12's sweep only reads/renames files already inside the existing memory DB directory; no
  new external input surface introduced -- confirmed by reading `sweepStaleMemoryDriftProcessingMarkers`:
  all paths derive from `resolveMemoryDriftMarkerPath(options.databasePath)`
- [x] CHK-032 [P1] Input validation implemented (F12: malformed stale marker content is parsed defensively,
  matching the canonical marker's existing `parseMemoryDriftMarker` handling) -- the sweep reuses
  `parseMemoryDriftMarker` directly, no new parsing logic
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for implementation state -- `spec.md`, `plan.md`, `tasks.md`
  all updated together in this session, all `[x]`/Implemented
- [x] CHK-041 [P1] Code comments adequate -- durable WHY only, no spec/packet/finding IDs embedded in code
  comments (per this repo's comment-hygiene rule) -- `grep -n "F8\|F11\|F12\|REQ-00\|014-self-healing\|CHK-0"`
  over the four changed source files returned no matches
- [x] CHK-042 [P2] No README update expected -- all three fixes are internal implementation details of an
  already-shipped, already-documented feature (package 011); assumption held, no README touched
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ or system temp only -- all test fixtures use `fs.mkdtempSync(os.tmpdir())`, cleaned in `afterEach`
- [x] CHK-051 [P1] scratch/ cleaned before completion -- N/A: no `scratch/` directory was created or used
  by this packet's implementation work
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:finding-verification -->
## Finding-Specific Verification Evidence

**F8 -- bounded suspect-write timeout**
- [x] CHK-060 [P0] Reuse of the confirmed two-process lock-contention test (held write lock, ~10,293ms
  baseline block, matching the connection's 10,000ms `busy_timeout` almost exactly): the suspect-write
  path now fails or defers in under 100ms, and the search response returned to the caller is not delayed
  by the contended write (REQ-001) -- no committed test literally reusable (none existed in the repo), so
  the exact two-connection lock-contention mechanism was rebuilt following this codebase's own established
  convention (`n3lite-consolidation.vitest.ts`'s "mirrors a separate CLI front-door process" pattern); see
  `tests/memory-search-drift-suspect-write-timeout.vitest.ts`. BASELINE test empirically confirms the
  pre-fix mechanism (a write blocked by a held lock waits out the full connection `busy_timeout`, ~328ms
  measured against a 300ms bound, scaled down from the real 10,293ms/10,000ms pair for test speed); REQ-001
  test confirms the fixed path completes in under 100ms (measured ~15-30ms) with the filtered result set
  unaffected. Both PASS.
- [x] CHK-061 [P0] The connection's `busy_timeout` is confirmed restored to 10000 after the call, success
  or failure, verified against a subsequent unrelated query on the same connection -- PASS
- [x] CHK-062 [P1] A normal (non-contended) write still succeeds and the suspect queue reflects the new
  ids, unchanged from today's behavior -- `tests/memory-search-drift-suspect-write-timeout.vitest.ts:143`
- [x] CHK-063 [P1] `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`'s existing default-off status is confirmed
  unchanged by this fix (NFR-R01) -- confirmed by reading `capability-flags.ts`; this packet did not touch
  the flag or its default

**F11 -- suspect-queue read warning**
- [x] CHK-064 [P1] A forced read failure logs exactly one warning naming the failure and still returns `[]`
  (REQ-003) -- `tests/memory-drift-healing.vitest.ts` PASS
- [x] CHK-065 [P1] A successful read produces no new log output -- `tests/memory-drift-healing.vitest.ts:81`

**F12 -- stale processing-marker sweep**
- [x] CHK-066 [P0] Boot-sweep acceptance test is the exact confirmed repro: external SIGKILL of the process
  after the `.processing-*` rename-claim but before `consumeMemoryDriftDirtyMarker` completes; a subsequent
  boot recovers the stale file's entries via the normal scoped-scan path and the stale file is no longer
  present afterward (REQ-002) -- `tests/startup-checks-processing-marker-sigkill.vitest.ts`: a real child
  process is spawned (via `tsx`, running the actual `consumeMemoryDriftDirtyMarker` source), genuinely
  SIGKILLed after the real rename-claim while stuck inside `runScopedScan`; boot 2 (`sweepStaleMemoryDrift
  ProcessingMarkers` then `consumeMemoryDriftDirtyMarker`) recovers both marker entries, and no `.processing-*`
  file remains. PASS, deterministic across 3 repeated runs.
- [x] CHK-067 [P1] A boot with no stale file present is unaffected -- no new log noise, no behavior change
  -- `tests/startup-checks.vitest.ts:313`
- [x] CHK-068 [P1] The T003 multi-stale-file merge policy is implemented and tested as documented --
  merge-all; `tests/startup-checks.vitest.ts:326`
- [x] CHK-069 [P1] A malformed/unreadable stale file is treated as unrecoverable and logged, not a boot (re-validated in the 2026-07-10 `validate.sh --strict` sweep)
  failure (matches package 011's NFR-R01 precedent) -- PASS
<!-- /ANCHOR:finding-verification -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 20 | 20/20 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-09. Counts recomputed programmatically via `grep` against the itemized
checklist (see implementation-summary.md Verification for the underlying test-run and validate.sh evidence).
<!-- /ANCHOR:summary -->
