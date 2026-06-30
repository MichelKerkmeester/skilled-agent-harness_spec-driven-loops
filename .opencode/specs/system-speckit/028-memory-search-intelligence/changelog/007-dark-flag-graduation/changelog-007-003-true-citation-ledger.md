---
title: "Changelog: True-Citation Ledger Density Benchmark [007-dark-flag-graduation/003-true-citation-ledger]"
description: "Chronological changelog for the True-Citation Ledger Density Benchmark benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/003-true-citation-ledger` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

This phase benchmarked `SPECKIT_TRUE_CITATION_EMITTER` against the 024 ledger-density prerequisite on the live corpus, read-only, then implemented two refinements behind the flag and re-benchmarked. The firing trigger now threads the validated `effectiveSessionId` into the `search_shown` write, and the reference key now anchors on the memory title the assistant echoes rather than the bare integer id. The anchor-aware detector lifts real-transcript reference coverage from 7.24 percent to 15.79 percent and suppresses 9 prose-count false positives. The verdict is REFINE: the design is now sound and the signal separation is trustworthy, but the live ledger density a reranker could consume is still zero because the 1711 existing `search_shown` rows are all null-session and predate the firing-trigger fix.

### Added

- `scripts/citation-ledger-feasibility.mjs`: read-only feasibility harness that backs the live database up read-only, measures the live `search_shown` ledger structure and the session-scoped firing-trigger ceiling, replays the emit pipe against a scratch copy, and runs the production detector twice over the same real transcript turns for a bare-id versus anchor-aware coverage comparison.
- `results/metrics.json`: measured ledger structure, scratch replay results and reference-realism rollup, rebuilt by `node scripts/citation-ledger-feasibility.mjs`.
- `benchmark-results.md`: full data tables covering the live ledger metrics, both replay segments, the anchor-aware versus bare-id coverage comparison and the REFINE verdict with rationale.
- Phase folder docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`.

### Changed

- `handlers/memory-search.ts`: the `search_shown` write now threads the validated `effectiveSessionId` rather than the prior `sessionId ?? null`, so a closing session can reconstruct the shown set. The change is byte-identical when `SPECKIT_TRUE_CITATION_EMITTER` is off because the row is shadow-only and never reaches ranking.
- `lib/feedback/true-citation-emitter.ts`: the detector now keys on the memory title anchor when present and demotes the bare integer id to a fallback for memories with no usable anchor. A `distinctiveAnchorWords` reducer drops generic doc-type stopwords and requires all distinctive words to appear before the anchor fires. `reconstructShownSets` enriches each shown set with per-id titles via a read-only `lookupContentAnchors` query against `memory_index`. The change is byte-identical when the flag is off.

### Fixed

- The firing trigger recorded `sessionId ?? null` on the non-eval `search_shown` path, so all 1711 existing rows carried a null session id and the emitter's session-scoped reconstruction always returned an empty set. The validated `effectiveSessionId` is now threaded at the write site.
- The bare integer detector matched prose counts such as `8 packets` and `16/18 complete`, producing 7.24 percent apparent coverage that overstated the real citation signal. The anchor-aware reference key removes 9 identified prose-count false positives (`16`, `26`, `20924`, `21800`, `6100`, `4811`, `4807`, `3467`, `3342`) and lifts real coverage to 15.79 percent over 13417 turns.

### Verification

 - tsc clean - PASS, build clean.
 - Emitter tests - PASS, 8 existing tests pass unchanged.
 - Feedback and handler suites - PASS, 64 tests pass unchanged.
 - Flag-off byte-identity - PASS, emit returns `{ emitted: 0, used: 0, notUsed: 0 }` and does not create the shadow table.
 - Scratch replay id-only segment - PASS, 3 used 2 not-used, separation proven.
 - Scratch replay anchor segment - PASS, 1 used 1 not-used, bare-id prose-count collision correctly suppressed.
 - Anchor-aware reference coverage - 0.1579 over 13417 turns, 9 false positives suppressed, all numbers present in `results/metrics.json`.
 - Live database read-only - PASS, `true_citation_events` absent before and after the run, `feedback_events` row count unchanged.
 - Strict validation - PASS, this child folder.

### Files Changed

- `handlers/memory-search.ts`: firing-trigger fix threads `effectiveSessionId` into the `search_shown` write.
- `lib/feedback/true-citation-emitter.ts`: reference-key refinement adds anchor-aware detection with a distinctive-words threshold and demotes bare-id to a fallback.
- `scripts/citation-ledger-feasibility.mjs`: new read-only feasibility harness.
- `results/metrics.json`: new measured output rebuilt by the harness.
- `benchmark-results.md`: new benchmark report with full data tables and REFINE verdict.
- `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md`: phase spec folder docs.
- `description.json` / `graph-metadata.json`: phase search metadata.

### Follow-Ups

- The live ledger is empty today and the residual block is a data backlog, not a code gap. The honest next step is to leave the emitter behind the flag and let session-carrying, anchor-resolvable traffic accumulate a real ledger.
- A re-run of the 024 PREREQ-A density check against the accumulated ledger is the gate for any future GRADUATE decision.
- The handler firing-trigger still records a null session when the caller runs session-less. Lifting that residual gap requires the MCP client to supply a session on every search, which is outside this phase's two-file scope.
- The 024 PREREQ-B corpus-geometry prerequisite is not measured here. That question is carried by the 024 research separately.
