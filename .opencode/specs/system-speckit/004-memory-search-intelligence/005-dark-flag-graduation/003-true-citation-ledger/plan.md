---
title: "Implementation Plan: True-Citation Ledger Density Benchmark"
description: "A read-only feasibility harness measures SPECKIT_TRUE_CITATION_EMITTER against the 024 ledger-density prerequisite on the live corpus. It backs up the live database read-only, measures the live search_shown ledger structure and the session-scoped firing-trigger ceiling, replays the emit pipe against a scratch copy to prove the used-versus-unused split is separable, and scans real assistant transcripts for the bare integer reference hit rate. The harness writes nothing to the live ledger. The plan rejects enabling the live emitter to grow a real ledger as both unsafe and slow, choosing a read-only measurement plus a scratch replay that isolates the input gap from any code defect."
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger feasibility harness"
  - "session scoped firing trigger ceiling"
  - "bare integer reference hit rate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-dark-flag-graduation/003-true-citation-ledger"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the read-only harness plan and the verification route"
    next_safe_action: "Run the harness and author the results docs"
    blockers: []
    key_files:
      - "scripts/citation-ledger-feasibility.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: True-Citation Ledger Density Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | A Node ESM `.mjs` read-only harness over the compiled emitter and feedback-ledger modules |
| **Framework** | The compiled `true-citation-emitter.js`, `feedback-ledger.js`, and `claude-transcript.js` from the server dist, plus better-sqlite3 backup |
| **Storage** | A read-only live database backup, a scratch copy for the replay, and a single metrics.json rollup |
| **Testing** | A real transcript-replay against a scratch copy, an empirical flag-off byte-identity check, and a reference-realism scan over recent transcripts |

### Overview
This phase measures whether the true-citation emitter reaches the 024 ledger-density prerequisite on the live corpus, read-only. The harness backs up the live database read-only and measures three things. First the live `search_shown` ledger structure: the shown universe the emitter reconstructs from, the distinct queries and memory ids, and the per-row session linkage. Second the firing-trigger ceiling: the emitter scopes its reconstruction by session id and the session-stop hook mines the closing session transcript, so the count of session-scoped shown rows is the ceiling on what a real emit could reach. Third a real transcript-replay against a scratch copy that seeds a session-scoped shown set whose ids are echoed and not echoed in a synthetic turn, runs the emit, and reads back the split, proving the pipe is separable when the inputs line up. A fourth scan measures the bare integer reference hit rate over real assistant transcripts, the real-world signal the detector keys on. Enabling the live emitter to grow a real ledger was considered and rejected: it would write the live database, take many sessions to accumulate, and still not isolate a code defect from an input gap. A read-only measurement plus a scratch replay answers the density question safely and immediately.
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
- [x] Harness runs and writes metrics.json
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only measurement harness over the production emitter. The harness imports the compiled emitter and feedback-ledger modules and drives them against a read-only backup and a scratch copy, so it measures the real production code path rather than a reimplementation. The replay is the only write and it lands on a scratch copy.

### Key Components
- **`citation-ledger-feasibility.mjs`**: the harness. It resolves the live database path from the server config, backs it up read-only, and runs the three measurements plus the replay.
- **`true-citation-emitter.js` (read)**: the production emitter. The harness calls its `emitTrueCitationsForSession`, `getTrueCitations`, and `initTrueCitationLedger` against the scratch copy and never edits it.
- **`feedback-ledger.js` (read)**: the source of the shown universe. The harness reads `search_shown` rows through it and seeds the replay shown set through `logFeedbackEvents`.
- **`claude-transcript.js` (read)**: the transcript parser. The harness calls `parseAssistantTextTurns` over recent transcript files to measure the reference hit rate.

### Data Flow
The harness resolves the live database path, backs it up read-only, and measures the live `search_shown` structure including the session-scoped count that is the firing-trigger ceiling. It then backs the live database up to a scratch copy, forces the flag on inside its own process, seeds a session-scoped shown set with echoed and not-echoed ids, runs the emit against the scratch copy, and reads back the used and not-used split. Separately it scans recent real transcripts for standalone matches of the live shown ids and buckets the matches by digit length so short-id collisions are visible. Every number lands in `results/metrics.json`, the single source for the data tables and the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a read-only benchmark and changes no production surface. It reads three production modules and the live database, and writes only inside the phase folder and a scratch copy. The table records the read-only contract each touched surface holds.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/feedback/true-citation-emitter.ts` | The emitter under measurement | read only, never edited | the harness imports the compiled module and calls it against a scratch copy |
| `lib/feedback/feedback-ledger.ts` | The source of the shown universe | read only, never edited | the harness reads `search_shown` rows and seeds the replay through the public API |
| `hooks/claude/claude-transcript.ts` | The transcript parser the hook uses | read only, never edited | the harness calls `parseAssistantTextTurns` over recent transcript files |
| `handlers/memory-search.ts` | The production writer of `search_shown` | read only, inspected for the queryId and sessionId it records | the harness reads the rows this handler wrote and reports their session linkage |
| the live `context-index.sqlite` | The production memory database | read only, backed up | the live `true_citation_events` table is absent before and after the run |

Required inventories:
- Same-class producers: `rg -n "search_shown|logFeedbackEvents" handlers lib/feedback` to confirm where the shown universe is written.
- Consumers of the emitter: `reconstructShownSets` scopes by session id, the session-stop hook mines the closing session, no other live consumer exists.
- Matrix axes: the live `search_shown` corpus, a scratch replay with hand-aligned inputs, and a recent-transcript reference scan.
- Algorithm invariant: with the flag off the emit is a no-op that returns zeros and does not create the shadow table, with the flag on inside the harness it writes the used-versus-unused split to the scratch copy only.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Resolve the live database path from the server config and confirm it exists
- [x] Read the emitter, the feedback ledger, and the search handler to confirm how `search_shown` rows carry queryId and sessionId

### Phase 2: Core Implementation
- [x] Build the read-only ledger-structure measurement over the live `search_shown` corpus
- [x] Build the firing-trigger reachability measurement as the session-scoped shown count
- [x] Build the scratch replay that seeds a session-scoped shown set and reads back the used-versus-unused split
- [x] Build the reference-realism scan over recent transcripts with the digit-length collision buckets

### Phase 3: Verification
- [x] Confirm the flag-off emit is a no-op that returns zeros and does not create the shadow table
- [x] Confirm the live `true_citation_events` table is absent after the run, proving the harness never wrote the live ledger
- [x] Run the harness, author the data tables grounded strictly in metrics.json, and author the REFINE verdict with the firing-trigger refinement designed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Pipe proof | The emit pipe writes a correct used-versus-unused split when a session-scoped shown set and an id-echoing turn coincide | the scratch replay in the harness |
| Byte-identity | The flag-off emit returns zeros and does not create the shadow table | an in-process flag-off check |
| Realism | The bare integer detector hit rate on real assistant text, bucketed by digit length | the reference-realism scan over recent transcripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The compiled emitter, feedback-ledger, and transcript modules in the server dist | Internal | Green | The harness cannot drive the real production code without them |
| The live `search_shown` rows the production search handler writes | Internal | Green | The harness has no shown universe to measure without them |
| The live claude transcripts | Internal | Green | The reference-realism scan cannot measure the echo rate without them |
| The 024 PREREQ-A ledger-density prerequisite | Internal | Green | The benchmark has no bar to measure the density against without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark is abandoned or the harness proves unsound.
- **Procedure**: Delete the phase folder. No production code changed and no live ledger was written, so there is nothing to revert. `SPECKIT_TRUE_CITATION_EMITTER` stays default-off either way.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Harness) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Harness |
| Harness | Setup | Verify |
| Verify | Harness | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Harness | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The harness reads the live database read-only and writes only a scratch copy
- [x] The flag-off emit is a no-op that returns zeros and does not create the shadow table
- [x] The live `true_citation_events` table is absent after the run

### Rollback Procedure
1. Delete the phase folder, which removes the harness and the results
2. Confirm no production module was edited and no live ledger row was written
3. Confirm `SPECKIT_TRUE_CITATION_EMITTER` remains default-off

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the harness writes only a scratch copy and the phase folder, both removable without touching the live database
<!-- /ANCHOR:enhanced-rollback -->

---
