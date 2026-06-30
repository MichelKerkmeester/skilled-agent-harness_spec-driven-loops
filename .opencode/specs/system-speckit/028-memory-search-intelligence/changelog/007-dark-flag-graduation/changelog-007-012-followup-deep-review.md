---
title: "Changelog: Graduation Follow-Ups, Opus Deep Review and Fixes [007-dark-flag-graduation/012-followup-deep-review]"
description: "Chronological changelog for the graduation follow-ups deep review and fixes phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/012-followup-deep-review` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

An opus deep review ran ten iterative passes loop-until-dry over the 010 graduation follow-ups and returned a FAIL verdict: three P0 blockers in the code-graph bitemporal wiring, eight P1 conditional blockers and four P2 advisories. All three P0 were in the live-read and reindex paths, not reachable by the prior cli test pass. The fixes resolved every P0 and P1, each behind its existing default-off flag and confirmed byte-identical when the flag is off. A first re-review cleared the FAIL to PASS at zero P0 and zero P1. A second batch of seven recs and follow-ups then shipped, and a third re-review confirmed zero findings of any severity. The bitemporal cluster moved from a false graduate to genuinely working.

### Added

- A real two-scan reindex integration test that drives `persistIndexedFileResult` and `code_graph_scan` twice under the flag and asserts the as-of round trip returns the old target at the pre-reindex generation.
- An optional `asOf` parameter on `code_graph_query` routing through `asOfEdgesFrom` and a new `asOfEdgesTo`. Absent or flag-off calls fall through to the live readers unchanged.
- A stall detector measuring time-since-last-completion-while-pending (recommended default 2 minutes) replacing the prior lag-ceiling metric that fired on healthy backpressure.
- A Jaccard title-overlap gate on the dedup path that drops the title-only false-collapse rate from 0.50 to 0 while identical-dup collapse holds 7 of 7.
- Flag-off unit tests proving byte identity for every changed site.

### Changed

- `replaceNodes` closes instead of deletes edges under the bitemporal flag, so the close path in `replaceEdges` has rows to act on during a real reindex.
- `pruneDanglingEdges` closes (UPDATE invalid_at) instead of issuing an unconditional DELETE when the flag is on, making the flag-aware inline close reachable on the full-scan prune path.
- `queryEdgesFrom` and `queryEdgesTo` gained an `AND invalid_at IS NULL` filter under `codeGraphEdgeBitemporalReadsEnabled()` so live reads no longer return superseded edges.
- The generation stamp now bumps before the persistence loop so valid_at and invalid_at carry the current generation rather than the prior one, and the zero-width lifetime defect is resolved.
- The ensure-ready auto-index path bumps the generation under the flag so as-of windows written by that path are non-zero-width.
- `recordSupersedesLineage` stamps a valid_at on SUPERSEDES edges under the flag so lineage edges are as-of readable.
- The search budget-trim reserves at least one primary row before trimming exempt backfill, preventing the top-scored requested result from being evicted.
- The advisor alias guard in `fusion.ts` uses the canonical self-recommendation id set rather than matching only the exact string `'system-skill-advisor'`, closing the self-recommendation gap for the `skill-advisor` alias.
- The degree cap moved from an unbenchmarked 10 to 15 on evidence from a degree sweep that found a per-dependency cliff with linear no-knee cost.

### Fixed

- P0: Live readers returned both the closed and the open edge after a flag-on reindex because `queryEdgesFrom`/`queryEdgesTo` had no validity filter. Fixed by adding `AND invalid_at IS NULL` when the flag is on.
- P0: `pruneDanglingEdges` hard-deleted regardless of the flag, making the flag-aware inline close dead for the full-scan path. Fixed by closing under the flag.
- P0: `replaceNodes` hard-deleted edges before `replaceEdges` ran, so there was nothing to close on a real reindex and `asOfEdgesFrom` returned an empty result. Fixed by closing instead of deleting under the flag.
- P1: As-of stamps carried the prior generation due to a bump ordering issue. Fixed by bumping before the persistence loop.
- P1: The lag-ceiling metric fired on healthy backpressure queue depth rather than a stalled tail. Fixed by the replacement stall detector.
- P1: The advisor alias `'skill-advisor'` bypassed the self-recommendation guard in `fusion.ts`. Fixed by using the canonical id set.
- P1: The budget-trim could evict the top primary result under a hard squeeze. Fixed by the primary-row reservation.
- P2 (second batch): The ensure-ready path left zero-width as-of windows. Fixed by bumping the generation under the flag.
- P2 (second batch): SUPERSEDES lineage edges had no as-of-readable window. Fixed by stamping valid_at in `recordSupersedesLineage`.
- P2 (second batch): The dedup path had a 0.50 title-only false-collapse rate. Fixed by the Jaccard title-overlap gate.

### Verification

- Deep review (initial) - FAIL: 10 opus passes loop-until-dry, 3 P0 / 8 P1 / 4 P2 recorded in `review/review-report.md`.
- Re-review (first) - PASS: zero P0 and zero P1, FAIL verdict cleared, live-read path confirmed correct.
- Re-review (third) - PASS: zero P0 / P1 / P2 for the second batch, all six code fixes confirmed sound against source and tests.
- Flag-off byte identity - PASS: every changed site reads its flag once and keeps the original statement on the off branch, confirmed by flag-off unit tests per change.
- Integration test - PASS: real two-scan reindex as-of round trip returns the old target at the pre-reindex generation.
- Dedup proof - PASS: title-only false-collapse rate measured at 0.50 on a same-body different-title fixture class, driven to 0 by the Jaccard gate while identical-dup collapse holds 7 of 7.
- Strict validation - PASS: packet documents conform at Level 2.

### Files Changed

- `review/review-report.md`: Reference record for the opus deep review, read-only, not edited.
- `spec.md`: Created as the conformant Level 1 spec from the template.
- `plan.md`: Created documenting the deep-review method and the remediation approach.
- `tasks.md`: Created with the audit lenses and the fix tasks, marked complete with evidence.
- `implementation-summary.md`: Created recording the outcome, the key decisions and the re-review evidence.

### Follow-Ups

- Flipping any of the involved production defaults on stays a separate evidence-gated decision outside this packet.
- The `code_graph_context` multi-hop traversal remains live-only. As-of traversal was deliberately deferred.
- Unbounded history growth under the bitemporal flag (many generations of closed edges) is out of scope while the flag stays off.
