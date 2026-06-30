---
title: "Implementation Summary: True-Citation Ledger Density Benchmark"
description: "Benchmarked the default-off SPECKIT_TRUE_CITATION_EMITTER against the 024 ledger-density prerequisite, then implemented the two refinements behind the flag and re-benchmarked. The firing trigger now threads the validated session id into the search_shown write, and the reference key now anchors on the memory title the assistant echoes rather than the bare integer id. The refined detector lifts real-transcript reference coverage from 7.24 percent to 15.79 percent and suppresses 9 prose-count false positives, and the refined emit pipe is proven separable end-to-end on a scratch copy. The verdict stays REFINE: the signal separation is materially better and the design is now sound, but the live ledger density a reranker could consume is still gated on the session backlog, the existing search_shown rows are all null-session and predate the firing-trigger fix. Flag-off byte-identity holds. Changed handlers/memory-search.ts and lib/feedback/true-citation-emitter.ts only, no live ledger written."
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger REFINE verdict"
  - "session id firing trigger refinement"
  - "reference key content anchor refinement"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/003-true-citation-ledger"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented both refinements behind the flag, re-benchmarked, verdict stays REFINE"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
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
    answered_questions:
      - "The refined anchor-aware detector lifts real-transcript reference coverage from 7.24 percent to 15.79 percent and suppresses 9 prose-count false positives."
      - "The refined emit pipe is proven separable end-to-end: the anchor segment writes 1 used and 1 not-used with the bare-id prose-count collision correctly suppressed."
      - "The live ledger density a reranker could consume is still zero today: the existing 1711 search_shown rows are all null-session and predate the firing-trigger fix."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Verdict** | REFINE (refinements implemented behind the flag) |
| **Files changed** | `handlers/memory-search.ts`, `lib/feedback/true-citation-emitter.ts`, this phase folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only feasibility benchmark for the default-off `SPECKIT_TRUE_CITATION_EMITTER`, measured against the 024 demote-only reranker's PREREQ-A ledger-density prerequisite, plus the two refinements the first pass diagnosed, implemented behind the flag and re-benchmarked. The harness `scripts/citation-ledger-feasibility.mjs` backs the live database up read-only and traces every number into `results/metrics.json`. The production changes are confined to `handlers/memory-search.ts` and `lib/feedback/true-citation-emitter.ts`, no live ledger row was written, and `SPECKIT_TRUE_CITATION_EMITTER` remains default-off and byte-identical when off.

The first pass found two named gaps. The live `search_shown` corpus held 1711 rows all carrying a null session id, so a session-scoped emit reached nothing, and the bare integer detector matched mostly prose counts (`8 packets`, `16/18 complete`), 7.24 percent coverage that overstated the real citation signal. Both gaps are now fixed.

**Refinement 1, the firing trigger.** The `search_shown` write in `handlers/memory-search.ts` now threads the validated `effectiveSessionId`, the same value the dedup and consumption-log paths use, so a closing session can be reconstructed. The write is shadow-only and the change is byte-identical when the emitter flag is off.

**Refinement 2, the reference key.** The detector in `lib/feedback/true-citation-emitter.ts` now keys on the memory title anchor when present and demotes the bare integer id to a fallback used only for memories with no usable anchor. An anchored memory is referenced only when its title's distinctive words are all echoed, so a prose-count collision can no longer fabricate a positive. The anchors are looked up read-only from the `memory_index` titles during shown-set reconstruction.

**The refined detector materially lifts the signal separation.** On the same 13417 real assistant turns the anchor-aware detector matches 48 distinct shown ids where the bare-id detector matched 22, lifting real reference coverage from 7.24 percent to 15.79 percent, and it suppresses 9 prose-count false positives (`16`, `26`, `20924`, `21800`, `6100`, `4811`, `4807`, `3467`, `3342`). The assistant echoes a memory's title, not its database id, so the title is the truer reference key.

**The refined emit pipe is proven separable end-to-end.** A scratch replay ran two segments: an id-only fallback (3 used, 2 not-used) and an anchor segment where a memory whose title is echoed is used and a memory mentioned only as a bare-id prose count is not-used (1 used, 1 not-used, the collision suppressed). Both segments proven, so the refined pipe writes a trustworthy split.

**Verdict: REFINE.** GRADUATE is ruled out because the live ledger density a reranker could consume is still zero today: the existing 1711 `search_shown` rows are all null-session and predate the firing-trigger fix, so the backlog stays unreachable until session-carrying, anchor-resolvable traffic accumulates. CUT is ruled out because the refinements turned a noisy, never-firing emitter into a sound one that earns a real used-versus-unused separation when it fires. The residual block is a data backlog, not a code gap.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The firing-trigger change names a `shownSessionId` from the already-validated `sessionId` and passes it into the `search_shown` feedback rows, replacing the prior inline `sessionId ?? null`. The reference-key change adds an optional `contentAnchors` map to the `ShownSet`, a `distinctiveAnchorWords` reducer that drops generic doc-type stopwords, an `anchorReferenced` check that requires all of an anchor's distinctive words to appear as standalone tokens, and an anchor-first branch in `detectReferencedMemoryIds` that replaces the bare-id key for anchored memories. `reconstructShownSets` enriches each shown set with the per-id titles via a read-only `lookupContentAnchors` query against `memory_index`. The harness backs the live database up read-only, measures the session-scoped firing-trigger ceiling, runs a two-segment scratch replay proving both the id-only fallback and the anchor path, and runs the production detector twice over the same real transcript turns so the bare-id and anchor-aware coverages are directly comparable. Every number lands in `results/metrics.json`. tsc is clean, the build is clean, and the existing 8 emitter tests plus the broader feedback and handler suites pass unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **The anchor replaces the bare id rather than supplementing it.** For an anchored memory the bare-id fallback is dropped entirely, because the bare id is the prose-count noise source. Keeping it as a parallel signal would have re-admitted the false positives the refinement exists to remove, so an anchored memory keys only on its title.
- **A distinctive-words threshold guards anchor precision.** A title is reduced to its distinctive words after generic doc-type stopwords are removed, and all of them must appear before the anchor fires, so a generic title like a bare doc type never matches on a single common word.
- **The firing-trigger fix threads the existing validated session, it does not invent one.** Plumbing the already-resolved `effectiveSessionId` keeps the row consistent with dedup and the consumption log, so a closing session reconstructs the same set the rest of the handler scoped. A synthetic per-search id was rejected because it would not match the session-stop hook's transcript session.
- **REFINE, not GRADUATE, because the density is a data backlog.** The refinements are sound and the signal is now trustworthy, but the live ledger is empty and the existing shown rows predate the session fix, so the density a reranker needs cannot be measured until real session-carrying traffic accumulates.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- tsc is clean, the build is clean, and the 8 existing emitter tests plus the broader feedback suites (64 tests) and the memory-search handler tests pass unchanged.
- The flag-off emit returns `{ emitted: 0, used: 0, notUsed: 0 }` and does not create the shadow table, verified in-process against the freshly built dist. The firing-trigger row is shadow-only, so both refinements are byte-identical when off.
- The refined scratch replay proves both segments: id-only fallback 3 used 2 not-used, anchor path 1 used 1 not-used with the bare-id prose-count collision suppressed, all separation proven.
- The anchor-aware detector lifts real-transcript reference coverage from 0.0724 to 0.1579 over 13417 turns and suppresses 9 prose-count false positives, every number present in `results/metrics.json`.
- The harness reads the live database read-only, proven by the absent live `true_citation_events` table and the unchanged `feedback_events` row count after the run. The emit write landed on a scratch copy that was removed.
- `node scripts/citation-ledger-feasibility.mjs` rebuilds `results/metrics.json` from the live corpus.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The live ledger density a reranker could consume is still zero today. The firing-trigger fix helps only searches that run after it, and the existing 1711 `search_shown` rows are all null-session, so the backlog stays unreachable. A real density measurement against the 024 PREREQ-A bar waits on session-carrying, anchor-resolvable traffic accumulating in the ledger.
- The reference-realism scan samples the 60 most recent transcripts rather than the full history, so the coverage numbers are a recent-window estimate. The conclusion holds because the lift from 0.0724 to 0.1579 and the 9 suppressed collisions are directional and visible in the sample.
- This phase measures the density side the emitter owns, the 024 PREREQ-A prerequisite. It does not measure the 024 PREREQ-B corpus-geometry prerequisite, the reliable-negative-above-gold configuration a demote-only mechanism needs, which is a separate question carried by the 024 research.
- The handler firing-trigger change still records a null session when the caller runs session-less, which the emitter correctly skips. Lifting that residual gap would require the MCP client to supply a session on every search, which is outside this phase's two-file scope.
<!-- /ANCHOR:limitations -->
