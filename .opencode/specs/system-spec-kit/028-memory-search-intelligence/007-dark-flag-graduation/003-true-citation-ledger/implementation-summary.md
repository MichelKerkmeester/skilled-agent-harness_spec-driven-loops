---
title: "Implementation Summary: True-Citation Ledger Density Benchmark"
description: "Built a read-only feasibility harness for the default-off SPECKIT_TRUE_CITATION_EMITTER and ran it on the live corpus against the 024 ledger-density prerequisite. The emit pipe is proven separable on a scratch copy (3 used, 2 not-used), but the live search_shown corpus carries 0 session-scoped shown rows of 1711 and the bare integer detector matches mostly prose-count noise (7.24 percent coverage, short ids like 8 and 16). The live true_citation_events table is absent. The verdict is REFINE: plumb a stable session id into the search_shown write so the emitter can fire, then re-anchor the reference key on content the assistant actually echoes. No production code edited, no live ledger written, flag stays default-off byte-identical."
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
    recent_action: "Ran the read-only harness, authored the REFINE verdict"
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
      - "The emit pipe is provably separable: a scratch replay with a session-scoped shown set and an id-echoing turn wrote 3 used and 2 not-used pairs."
      - "The live firing-trigger ceiling is zero: all 1711 search_shown rows carry a null session id, so the emitter's session-scoped reconstruction reaches nothing."
      - "The bare integer detector matches mostly prose-count noise: 7.24 percent shown-id coverage dominated by short ids colliding with counts in text."
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
| **Verdict** | REFINE |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only feasibility benchmark for the default-off `SPECKIT_TRUE_CITATION_EMITTER`, measured against the 024 demote-only reranker's PREREQ-A ledger-density prerequisite on the live corpus. The harness `scripts/citation-ledger-feasibility.mjs` backs the live database up read-only and runs four measurements, all traced into `results/metrics.json`. No production code was edited, no live ledger row was written, and `SPECKIT_TRUE_CITATION_EMITTER` remains default-off and byte-identical when off.

The findings:

**The emit pipe is provably separable.** A scratch replay seeded a session-scoped shown set with three ids echoed in a synthetic post-search turn and two not echoed, ran the emit against a scratch copy of the live database, and read back 5 pairs, 3 used and 2 not-used, separation proven. The mechanism is sound, so any zero below is an input gap, not a code defect.

**The live shown universe is populated but session-blind.** The live `search_shown` corpus holds 1711 rows across 380 distinct queries and 304 distinct memory ids, mean shown-set size 4.50. But every row carries a null or empty session id, so the session-scoped shown count is 0 of 1711. The production search handler records the row with `queryId = String(_evalQueryId ?? _searchStartTime)` and `sessionId ?? null`, and the live rows are all bare millisecond timestamps with a null session, the non-eval prod branch that supplies no session id. The emitter scopes its reconstruction by session id and the session-stop hook mines the closing session, so a real session-scoped emit reaches nothing. The firing-trigger ceiling is zero.

**The bare integer detector matches mostly number noise.** The reference-realism scan over 13376 real assistant turns found a 7.24 percent shown-id reference coverage, 22 of 304 distinct shown ids ever matched. The matched ids skew short and the sampled context shows the matches are ordinary prose counts (`8 packets`, `16/18 complete`, `all 16 edits`), not citations. The assistant cites a memory by its content, its title, or its spec path, not by its database integer id, so even the 7.24 percent overstates the real citation signal.

**The live ledger density a reranker could consume is zero.** A real used or not-used pair needs both a session-scoped shown set AND an assistant turn that echoes a shown id. On the live corpus the first gate is hard zero and the second is near-zero collision noise, and the live `true_citation_events` table is absent, so the density is zero. This is consistent with 024: the gold-and-ledger intersection was 0.4 percent with the emitter off, and enabling the emitter as built would not lift it because the emitter cannot fire on the session-blind corpus.

**Verdict: REFINE.** GRADUATE is ruled out because the live ledger density is zero, so a demote-only reranker would still earn 0.000 by construction, the exact block 024 recorded. CUT is ruled out because the emit pipe is provably correct and produces precisely the shown-but-unused negative the corpus lacks. The block is two named input gaps, both fixable behind the existing default-off flag.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness resolves the live database path from the server config, backs it up read-only, and measures the live `search_shown` ledger structure including the session-scoped count that is the firing-trigger ceiling. It then backs the live database up to a scratch copy, forces the flag on inside its own process, seeds a session-scoped shown set with echoed and not-echoed ids, runs `emitTrueCitationsForSession` against the scratch copy, and reads back the used and not-used split. Separately it scans the 60 most recent transcripts for standalone matches of the live shown ids through the production `parseAssistantTextTurns`, and buckets the matches by digit length so short-id collisions are visible. Every number lands in `results/metrics.json`, the single source for the data tables in `benchmark-results.md` and this verdict. The flag-off byte-identity was confirmed in-process: the emit returns zeros and does not create the shadow table.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **A read-only measurement plus a scratch replay, not a live emitter run.** Enabling the live emitter to grow a real ledger would write the live database, take many sessions to accumulate, and still not isolate a code defect from an input gap. A read-only measurement plus a scratch replay answers the density question safely and immediately.
- **The session-scoped shown count is the firing-trigger ceiling.** The emitter reconstructs by session id and the hook mines the closing session, so a null-session row is unreachable by a real emit, which makes the session-scoped count the honest upper bound on what the emitter could ever ledger.
- **Bucket the reference matches by digit length.** The bare integer detector collides with prose counts, so reporting the matched ids by digit length and sampling their context exposes the 7.24 percent coverage as mostly noise rather than letting it read as real density.
- **REFINE, not CUT, because the pipe is proven.** The scratch replay shows the emit writes a correct used-versus-unused split, so the design is the right shape and the block is two fixable input gaps, which is a REFINE not a CUT.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- The emitter is measured on the production path, the live `search_shown` rows the production search handler writes, 1711 rows reported in `results/metrics.json`.
- The harness reads the live database read-only, proven by the absent live `true_citation_events` table after the run. The single emit write landed on a scratch copy that was removed.
- The scratch replay wrote a correct 3-used 2-not-used split, separation proven.
- The flag-off emit returns `{ emitted: 0, used: 0, notUsed: 0 }` and does not create the shadow table, verified in-process.
- Every number in `benchmark-results.md` is present in `results/metrics.json`, and `node scripts/citation-ledger-feasibility.mjs` rebuilds it from the live corpus.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The reference-realism scan samples the 60 most recent transcripts rather than the full history, so the 7.24 percent coverage is a recent-window estimate, not a lifetime figure. The conclusion holds because the matches in the sample are visibly prose-count collisions rather than citations, which a larger sample would not reverse.
- This phase measures the density side the emitter owns, the 024 PREREQ-A prerequisite. It does not measure the 024 PREREQ-B corpus-geometry prerequisite, the reliable-negative-above-gold configuration a demote-only mechanism needs, which is a separate question carried by the 024 research.
- The two refinements, plumbing a session id into the `search_shown` write and re-anchoring the reference key on content the assistant echoes, are designed here but not implemented, deferred to a successor phase behind the existing flag with a follow-up density re-benchmark against the 024 bar.
<!-- /ANCHOR:limitations -->
