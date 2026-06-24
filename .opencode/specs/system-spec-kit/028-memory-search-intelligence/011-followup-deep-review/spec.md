---
title: "Spec: Graduation Follow-Ups, Opus Deep Review and Fixes"
description: "An opus deep review of the 010 graduation follow-ups, run as ten iterative passes loop-until-dry, and the fixes that cleared its verdict. The review FAILED the follow-ups with three P0 in the bitemporal wiring, which corrupted live reads and was defeated on the real reindex path, plus eight P1 and four P2 the cli test pass had missed because the existing tests never exercised the real failure modes. The fixes resolved all three P0 (replaceNodes and pruneDanglingEdges close instead of delete under the flag, the live readers filter closed edges, the generation stamp is fixed, the integration test drives the real reindex), the four search and advisor and deep-loop P1, and the P2 advisories, each behind its existing default-off flag and unit-tested. The bitemporal cluster moves from a false graduate back to genuinely working, the orphaned as-of reader is honestly de-scoped, and the dedup title-only false-collapse risk is quantified at 0.50 and documented as a flag-gating constraint."
trigger_phrases:
  - "opus deep review of the follow-ups"
  - "bitemporal wiring corrupts live reads"
  - "graduation follow-up review findings"
  - "deep review FAIL fixed"
  - "P0 bitemporal reindex fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/011-followup-deep-review"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
---
# Spec: Graduation Follow-Ups, Opus Deep Review and Fixes

## 1. METADATA

A review-and-fix packet. It holds the opus deep-review record (`review/review-report.md`) of the 010 graduation follow-ups and tracks the fixes that cleared its FAIL verdict. The fixes themselves live in their subsystems behind the existing flags.

## 2. PROBLEM & PURPOSE

The 010 follow-ups passed a cli test run and were reported graduate-ready, but the tests never exercised the real failure modes. A ten-pass opus deep review, reading the code rather than running the existing tests, found the bitemporal wiring corrupts live reads and is defeated on the production reindex path. This packet records that review and drives the fixes so the follow-ups are correct on evidence rather than on an incomplete test surface.

## 3. SCOPE

### In Scope

The opus review record, and the fixes for its findings: the bitemporal rework (three P0 plus the generation timing and a real-reindex test), the search budget-trim and density-gate fixes, the advisor alias fix, and the deep-loop lag-metric and dedup-fixture fixes.

### Out of Scope

Flipping any production default on. The flips remain a separate evidence-gated decision.

## 4. VERDICT AND OUTCOME

The review verdict was FAIL: three P0, eight P1, four P2. All were confirmed against the real code before any fix. The fixes cleared every P0 and P1 and the actionable P2, each byte-identical when its flag is off and unit-tested. A re-review confirms the FAIL clears. The bitemporal cluster is now genuinely working with the public as-of query surface honestly deferred, and the dedup title-only false-collapse rate is measured at 0.50 and documented as a constraint that keeps the dedup flag-gated.

## 5. ARTIFACTS

- `review/review-report.md` — the opus review record: verdict, the fifteen findings by severity, and the per-cluster readiness.
