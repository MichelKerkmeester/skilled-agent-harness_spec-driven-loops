---
title: "Tasks: Self-Healing Internals Hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "self-healing internals hardening"
  - "drift-suspect write latency guard"
  - "processing marker sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/020-self-healing-internals-hardening"
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
# Tasks: Self-Healing Internals Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

The three findings are independent; tasks are grouped by finding within Phase 2 and can be implemented in
any order, or in parallel across sessions. The suggested default order (smallest/lowest-risk first) is
F11, F8, F12.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Re-confirm the three cited call sites against the live tree (`rg -n "appendMemoryDriftSuspects|readMemoryDriftSuspects|consumeMemoryDriftDirtyMarker"`) in case a concurrent session has touched these files since planning -- confirmed unchanged: `memory-search.ts:418`, `memory-drift-healing.ts:76/104`, `startup-checks.ts:243`
- [x] T002 Decide F8's mechanism: per-write `busy_timeout` pragma toggle vs. deferred fire-and-forget write (spec.md Open Questions), document the decision before writing code -- **decided: pragma toggle** (the leading candidate), implemented at `memory-search.ts:418` with a `DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS = 25` bound restored in `finally`
- [x] T003 Decide F12's multi-stale-file merge policy: merge-all vs. restore-most-recent-only (spec.md Open Questions), document the decision before writing code -- **decided: merge-all** (every stale claim file's entries are recovered, none silently dropped); implemented in `sweepStaleMemoryDriftProcessingMarkers` (`startup-checks.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### F11 -- Suspect-Queue Read Warning (.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts)

- [x] T004 Add a `console.warn` naming the failure to `readMemoryDriftSuspects`'s catch block, before returning `[]` (.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts:98)
- [x] T005 [P] Unit test: forced read failure (malformed JSON row, thrown DB error) logs exactly one warning and still returns `[]` (REQ-003) -- `tests/memory-drift-healing.vitest.ts` "F11: logs exactly one warning..." PASS
- [x] T006 [P] Unit test: a successful read produces no new log output -- `tests/memory-drift-healing.vitest.ts` "F11: a successful read produces no new log output" PASS

### F8 -- Bounded Suspect-Write Timeout (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts, lib/storage/memory-drift-healing.ts)

- [x] T007 Implement the chosen mechanism (T002) around the `appendMemoryDriftSuspects` call (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:418)
- [x] T008 If using the pragma-toggle mechanism: ensure the connection's original `busy_timeout` is restored in a `finally`, unconditionally (success or failure)
- [x] T009 [P] Unit/integration test: reuse the confirmed two-process lock-contention test (held write lock, ~10,293ms baseline block) and assert the suspect-write path now fails or defers in under 100ms, not the full 10s (REQ-001) -- new `tests/memory-search-drift-suspect-write-timeout.vitest.ts`: BASELINE test proves an unfixed write blocks for the held-lock's full window (no fast-fail), REQ-001 test proves the fixed path fails in <100ms with the search response unaffected. Both PASS.
- [x] T010 [P] Unit test: connection's `busy_timeout` confirmed restored to 10000 after the call, verified via a subsequent unrelated query on the same connection -- same file, "busy_timeout is restored..." PASS
- [x] T011 [P] Unit test: normal (non-contended) write still succeeds and the suspect queue reflects the new ids, unchanged from today -- `tests/memory-search-drift-suspect-write-timeout.vitest.ts:143`, PASS
- [x] T012 [P] Unit test: the existing outer try/catch (memory-search.ts:417-421) still handles a non-timeout failure from this call exactly as before -- same file, "non-timeout failure..." PASS

### F12 -- Stale Processing-Marker Sweep (.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts, context-server.ts)

- [x] T013 Implement the new sweep function in startup-checks.ts, following the existing `checkJournalMode`/`checkSqliteVersion`/`detectNodeVersionMismatch` boot-check pattern, applying the T003 merge policy -- `sweepStaleMemoryDriftProcessingMarkers`
- [x] T014 Wire the new sweep into context-server.ts's boot sequence immediately before the existing `consumeMemoryDriftDirtyMarker` call (.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2229)
- [x] T015 [P] Boot-sweep acceptance test using the confirmed exact repro: externally SIGKILL the process after the `.processing-*` rename-claim but before `consumeMemoryDriftDirtyMarker` completes, then reboot; the stale file's entries reach the normal scoped-scan path via the existing `consumeMemoryDriftDirtyMarker` and the stale file is no longer present after boot (REQ-002) -- new `tests/startup-checks-processing-marker-sigkill.vitest.ts`, real child process spawned via `tsx`, genuinely SIGKILLed mid-`runScopedScan` after the rename-claim; PASS, deterministic across 3 repeated runs (~100-150ms each)
- [x] T016 [P] Unit test: boot with no stale file present is unaffected -- no new log noise, no behavior change -- `tests/startup-checks.vitest.ts` "is a no-op ... no stale file is present" PASS
- [x] T017 [P] Unit test covering the T003 merge policy: multiple stale files present at once are handled per the documented decision (merged, or most-recent-restored-with-rest-logged) -- `tests/startup-checks.vitest.ts` "merge-all policy: multiple stale processing files..." PASS
- [x] T018 [P] Unit test: a malformed/unreadable stale file is treated as unrecoverable and logged, not a boot failure -- `tests/startup-checks.vitest.ts` "a malformed/unreadable stale file..." PASS
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run package 011's existing regression suites unchanged (`memory-drift-healing.vitest.ts`, `memory-roadmap-flags.vitest.ts`, `orphan-sweep-corpus-repair.vitest.ts`, `startup-checks.vitest.ts`) and confirm zero behavioral drift (NFR-R01) -- 54/54 pass including the 3 new/extended test files; see implementation-summary.md Verification for the broader 36-file blast-radius run and pre-existing-failure evidence
- [x] T020 Run `bash validate.sh --strict`, capture the output -- see implementation-summary.md Verification
- [x] T021 [P] Confirm SC-001 through SC-003 from spec.md each have concrete evidence, not just an unverified checkbox -- see `spec.md:224` (Success Criteria, each marked **MET** with a cited test file)
- [x] T022 Update spec/plan/tasks/checklist/implementation-summary with final evidence -- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all updated this session
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

> Includes the cross-cutting hot-path write-hygiene and path-resolution items surfaced by the audit (this child owns the self-healing internals and search-hot-path writes).

- [x] T023 [P1] The recovery sweep deletes each stale processing file before the merged canonical marker is durably written, and the failure log claims files were "left unconsumed" after they are already gone (`mcp_server/lib/storage/memory-drift-processing-sweep.ts:103` vs `:126,:131`). It also treats every `.processing-*` file as stale with no PID/lease check and merges without the producer's lock or temp+rename (`:65,:111-126`). Publish the merged marker atomically under the shared writer lock first, delete sources only after the rename commits, and skip claims owned by live PIDs. Evidence: forced write-failure test asserting sources survive; concurrent-boot claim test. DONE 2026-07-10 — sweep skips live-PID processing claims, merges under the same producer lock protocol (constants byte-matched bash<->TS by verifier), commits via same-dir temp + atomic rename, deletes sources only after the rename lands, failure log now truthful (memory-drift-processing-sweep.ts); forced-write-failure + live-PID tests fail pre-fix; SIGKILL suite still green (memory-drift-processing-sweep.vitest.ts, startup-checks-processing-marker-sigkill.vitest.ts, startup-checks.vitest.ts 24/24). Sonnet-max verified ACCEPT.
- [x] T024 [P1] Default-on feedback logging performs one synchronous insert per result on the search response path, plus `trackQueryAndDetect`/`logResultCited`, each exposed to the shared 10s busy_timeout (`mcp_server/handlers/memory-search.ts:2029`). Queue/batch feedback events off the response path in one transaction with bounded retries and backpressure. DONE 2026-07-10 — feedback writes (logFeedbackEvents/trackQueryAndDetect/logResultCited) moved to a setImmediate-deferred queue executing ONE immediate transaction after response construction; cap 256, 2 retries, drop counters, shutdown fencing; genuine post-resolution deferral proven (zero calls at resolve, fire after drain). Crash-vector in terminal-failure logging found by first verification (unguarded formatter escaping setImmediate -> fatalShutdown) — fixed in redo with guarded catches + formatter-failure regression tests; zero Unhandled Errors across the db-helpers-mock suites. Sonnet-max verified ACCEPT after redo.
- [x] T025 [P2] The drift-suspect write is bounded-synchronous and lossy on timeout — the catch only logs and the batch is dropped (`handlers/memory-search.ts:421`). Defer a copied ID batch until after response construction with bounded retry, or explicitly document "bounded synchronous, lossy best effort" and rename the test/acceptance claims ("response not delayed" is currently overstated — `tests/memory-search-drift-suspect-write-timeout.vitest.ts:107` measures the write inside the elapsed window). DONE 2026-07-10 — existence filter is read-only; suspect IDs double-copied and queued post-response with bounded retries and counted loss; lock-contention test completes <250ms with retryTotal 2 / zero rows written; timeout test renamed/re-asserted to deferred semantics (memory-search.ts:393-443,1801). Sonnet-max verified ACCEPT.
- [x] T026 [P2] The `busy_timeout` restore in `finally` runs outside a nested catch; a restore failure escapes the stated non-fatal boundary (`handlers/memory-search.ts:433`). Guard restoration; on failure log and recycle the connection. DONE 2026-07-10 — busy_timeout restore guarded in its own try/catch discriminating restore-time failure; connection marked unhealthy via WeakSet; restoreFailureTotal counted separately; nothing escapes search (memory-search.ts:509-523 + guarded formatter). Sonnet-max verified ACCEPT.
- [x] T027 [P2] The malformed-marker test asserts the second, no-op invocation — the first call's `unrecoverable: 1` result is discarded (`mcp_server/tests/startup-checks.vitest.ts:364`). Invoke once, assert the first result and the preserve/delete policy; add a forced read-error case. DONE 2026-07-10 — malformed-marker test asserts the FIRST call (unrecoverable:1 + deletion); new EISDIR case asserts retention on genuine read errors — two distinct code branches correctly distinguished; startup-checks suite 27/27 with the sibling lane block coexisting. Sonnet-max verified ACCEPT.
- [x] T028 [P2] `ENV_REFERENCE.md:430` documents `SPECKIT_CONSUMPTION_LOG` default `true` while the implementation enables only on explicit `true`/`1` — runtime default OFF (`consumption-logger.ts:97-100`). Fix the doc or deliberately graduate with hot-path-safe logging. DONE 2026-07-10 — ENV_REFERENCE row corrected doc-side (conservative option): SPECKIT_CONSUMPTION_LOG default false, opt-in via explicit true/1 (consumption-logger.ts:97-100 requires the explicit value before the shared flag check); the stale Graduated-ON wording removed. Graduating the logger to default-on remains a deliberate future flip if wanted.
- [x] T029 [P2] `decision-audit.ts:36` resolves its default output path against `process.cwd()`, which has already created two spurious nested `.opencode/skills/system-spec-kit/...` trees (skill root and `scripts/`), fragmenting audit history. Anchor the default to the workspace/package root or DB directory; make the append async/buffered; add default-path tests from repo root, skill root, and scripts root; remove the two stray trees. Root-cause the sibling symptom: the untracked `vectors/` directory at the skill root comes from the active DB directory resolving there during some run (`mcp_server/lib/search/vector-index-store.ts:425`) — add a guard/assertion on the resolved base dir. DONE 2026-07-10 — decision-audit default path anchors to the module root (import.meta.url walk with dist normalization), verifier proved identical canonical resolution from three cwds outside the test framework; two stray nested trees deleted; vectors/ misplacement guard warns on skill-root baseDir without changing valid-caller semantics (vectors/ left for operator review). Code verified correct by Sonnet-max; lane initially REJECTED for environmental damage from its harness (stray global pre-commit symlink) — remediated by orchestrator, global state restored.
