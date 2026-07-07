---
title: "Implementation Summary: Graduation Follow-Ups Deep Review and Fixes"
description: "The outcome of the 010 graduation follow-ups deep review and the fixes that cleared its FAIL verdict, with the re-review evidence and the byte-identity proof."
trigger_phrases:
  - "follow-up deep review summary"
  - "bitemporal fix summary"
  - "FAIL cleared re-review PASS"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/008-followup-deep-review"
    last_updated_at: "2026-07-06T19:16:40.702Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Closed the packet, FAIL cleared and second batch confirmed at zero findings"
    next_safe_action: "Evidence-gated decision to flip any of the involved defaults on"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/008-followup-deep-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Graduation Follow-Ups Deep Review and Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-followup-deep-review |
| **Completed** | 2026-06-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-review record and the fixes that cleared its verdict. An opus deep review ran ten iterative passes loop-until-dry over the 010 graduation follow-ups and FAILED them: three P0 bitemporal blockers, eight P1, and four P2. The cli test pass had been green only because the existing tests never exercised the real failure modes, so the opus deep read found them by reading the production read and write paths directly.

The three P0 were all in the code-graph bitemporal wiring. The live readers `queryEdgesFrom` and `queryEdgesTo` had no `invalid_at IS NULL` filter, so every production read returned both the closed and the open edge after a flag-on reindex. `pruneDanglingEdges` hard-deleted on the deferred full-scan prune regardless of the flag, so the flag-aware inline close was dead on the real path. And `replaceNodes` hard-deleted edges before `replaceEdges` ran, so there was nothing left to close on every real reindex and `asOfEdgesFrom` returned an empty result. All three were fixed to close instead of delete under the flag, the live readers gained the validity filter, the off-by-one generation stamp was corrected, and the integration test was rewritten to drive the real two-scan reindex.

The conditional P1 and the actionable P2 followed: the search budget-trim reserves a primary row before trimming exempt backfill, the advisor alias guard uses the canonical self-recommendation id set, the deep-loop lag metric stops firing on healthy backpressure, and the density gate and dedup advisories were reconciled. A second batch then shipped seven more recs and follow-ups: the ensure-ready path bumps the generation under the flag, `recordSupersedesLineage` stamps a valid_at, `code_graph_query` takes an optional `asOf`, the degree cap is set to 15 on a degree-sweep, the stall detector measures time-since-last-completion-while-pending, and a Jaccard title-overlap gate drops the dedup title-only false-collapse rate from 0.50 to 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `review/review-report.md` | Reference | The opus review record, read-only, documented not edited |
| `spec.md` | Created | The conformant Level 1 spec from the template |
| `plan.md` | Created | The deep-review method and the remediation approach |
| `tasks.md` | Created | The audit lenses and the fix tasks with evidence |
| `implementation-summary.md` | Created | This outcome and the re-review evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-first then flag-gated. The review read the real production paths rather than the green test fixtures, which is why it found the three P0 the cli pass had missed. The remediation confirmed every finding against its source site before touching it, so a P1 the review flagged as the advisor alias self-recommending was checked at `fusion.ts` before the canonical-id guard was applied. Each fix reads its flag once and keeps the original statement on the off branch, so the off path is byte-identical and a flag-off unit test proves it for every change. Three independent opus re-reviews re-read the committed code and re-scored, the first clearing the FAIL to PASS at zero P0 and zero P1, the third confirming the second batch at zero findings of any severity.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Trust the opus deep read over the green cli pass | The existing tests never exercised the real failure modes, so a green run was not evidence the wiring worked on the production reindex path |
| Confirm every finding against source before fixing | A review finding is a hypothesis, and three review claims in the sibling 012 audit turned out wrong, so each P0 and P1 was verified at its code site first |
| Keep every fix flag-gated and byte-identical off | Byte identity is the strongest proof the default-off behavior did not move while the gated path is repaired |
| Quantify the dedup title-only risk rather than assert it | The 0.50 false-collapse rate was measured on a same-body different-title fixture, then driven to 0 by the Jaccard gate, so the claim rests on a number |
| De-scope then later wire the orphaned as-of reader | The first re-review honestly deferred the public as-of surface, the second batch wired `code_graph_query asOf` so the reader is consumable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Deep read | Pass | Ten opus passes loop-until-dry, FAIL verdict with three P0, eight P1, four P2 recorded |
| Unit | Pass | Flag-off byte identity confirmed for every fix |
| Integration | Pass | The real two-scan reindex as-of round trip returns the old target at the pre-reindex generation |
| Re-review (first) | Pass | Zero P0 and zero P1, the FAIL clears, the live-read path confirmed correct |
| Re-review (third) | Pass | Zero P0, P1, and P2 for the second batch, all six code fixes sound against source and tests |

Byte-identity proof: every changed site reads its flag once and keeps the original statement on the off branch. The live readers run their original query strings, the edge removers delete, the lineage writer keeps NULL validity, the ensure-ready path does not bump, and a query without `asOf` runs the live reader plus the full dangling exclusion. The flag-off tests confirm each of these.

Dedup proof: the title-only false-collapse rate was measured at 0.50 on a same-body different-title fixture class, then the Jaccard title-overlap gate drops it to 0 while identical-dup collapse holds 7 of 7.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No production default flipped.** Every fix rides on an existing default-off flag, so the involved features stay off until a separate evidence-gated decision flips them.
2. **The as-of surface is exposed only on `code_graph_query` relationship operations.** The `code_graph_context` multi-hop traversal stays live-only, deferred by choice.
3. **Unbounded history growth under the bitemporal flag.** Many generations accumulate closed edges, out of scope here while the flag stays off.
4. **Readiness rests on opus deep read plus re-review, not on an exhaustive new test suite.** The fixes are unit-tested for byte identity and the integration test drives the real reindex, but the review is the primary evidence the cluster is genuinely working.
<!-- /ANCHOR:limitations -->
