---
title: "Implementation Summary: 002 Deep-Review Remediation"
description: "Closing synthesis for the 3 P1 + 39 P2 findings. Every finding is CLOSED with evidence."
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation"
    last_updated_at: "2026-05-11T11:30:00Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Synthesized all finding closure evidence"
    next_safe_action: "Run strict validator and targeted tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 002 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- STATUS: COMPLETE — filled after T4 synthesis -->

---

## Metadata

| Field | Value |
|-------|-------|
| Packet | `002-deep-review-remediation` |
| Parent | `009-causal-graph-channel-routing` |
| Final Status | CLOSED |
| Findings Open | 0 |

## What Was Built

Tier 1 closed the release blockers by wiring entity-density cache invalidation into both commit paths and adding the integration coverage that proves post-delete scores refresh without waiting for TTL. The 001 resource-map drift was also resolved, including the playbook path, changelog row, stress-test row, scratch rows, and summary counts.

Tier 2 closed the reliability, defensive, observability, and test-maintenance findings across `entity-density.ts`, `query-router.ts`, `routing-telemetry.ts`, and `memory-crud-health.ts`. The highest-risk changes were bounded: cache rebuild failures preserve prior state, env-flag parsing is explicit, routing reasons are clamped, and telemetry snapshot failure now degrades to a zero-value response.

The doc and metadata passes reconciled the 001 packet with the shipped implementation: status fields, DoD, handover continuity, test counts, live-smoke references, feature catalog, playbook rate guidance, checklist evidence, and graph key-files are all aligned. No finding was accepted open.

## How It Was Delivered

The packet landed through sequential T1-T3 batches followed by this T4 documentation and validation pass.

## Key Decisions

- Wire entity-density invalidation after successful commits.
- Tighten graph-channel preservation env-flag parsing.
- Keep duplicated `ChannelName` with a source-of-truth comment.
- Rename telemetry docs to rolling-window language.
- Close packet status docs as part of completion.

---

## Per-Finding Closing Status

| ID | Severity | Cluster | File | Status | Evidence / Rationale |
|----|----------|---------|------|--------|----------------------|
| P1-C-001 | P1 | reliability | entity-density.ts:146-154 | CLOSED | memory-save.ts:47/180-182/2583 + memory-bulk-delete.ts:8/27-41/149/256 + integration test entity-density-commit-hooks.vitest.ts (2 tests pass) |
| P1-002 | P1 | resource-map | 001/resource-map.md:55 | CLOSED | resource-map.md:55 path 210→272 |
| P1-003 | P1 | resource-map | 001/resource-map.md:73 | CLOSED | resource-map.md:73 changelog row verified/resolved |
| P1-001 | P2 (downgraded) | performance | query-router.ts | CLOSED | query-router.ts pre-computed intent dedup |
| P2-001 | P2 | maintainability | routing-telemetry.ts:14 | CLOSED | routing-telemetry.ts:14 SOURCE OF TRUTH comment (per ADR-003) |
| P2-002 | P2 | maintainability | routing-telemetry.ts:33-35 | CLOSED | routing-telemetry.ts rolling-window doc rename (per ADR-004) |
| P2-003 | P2 | maintainability | query-router.ts:183 | CLOSED | query-router.ts:183 flag self-gate added |
| P2-004 | P2 | defensive | memory-crud-health.ts:626 | CLOSED | memory-crud-health.ts:629-643 try/catch + zero fallback |
| P2-008 | P2 | correctness | entity-density.ts:105-116 | CLOSED | entity-density.ts:120 PRESERVES PRIOR CACHE comment + catch path preserves state |
| P2-009 | P2 | observability | query-router.ts:144-317 | CLOSED | query-router.ts:387 routingReasons emits `bm25-preserved-by-intent` |
| P2-010 | P2 | reliability | entity-density.ts:95-116 | CLOSED | entity-density.ts:11 CONCURRENCY comment documenting single-threaded invariant |
| P2-011 | P2 | access-control | entity-density.ts:150-154 | CLOSED | entity-density.ts:153-158 JSDoc on invalidateEntityDensityCache export rationale |
| P2-012 | P2 | defensive | query-plan.ts:74,258 | CLOSED | query-router.ts:89/298/348/417 routingReasons clamp to 120 chars |
| P2-013 | P2 | observability | query-router.ts:207-213 | CLOSED | query-router.ts:92/257 safeGetDb warn-once |
| P2-014 | P2 | playbook | 272-...:55 | CLOSED | playbooks/272-...md:55 rate 0.6→0.4 with classifier note |
| P2-015 | P2 | resource-map | 001/resource-map.md | CLOSED | resource-map.md row for routing-telemetry-stress.vitest.ts added |
| P2-016 | P2 | feature-catalog | 12-graph-channel-preservation.md:59-67 | CLOSED | feature_catalog/12-graph-channel-preservation.md line refs refreshed |
| P2-017 | P2 | docs | routing-telemetry.ts:50 | CLOSED | routing-telemetry.ts:52-65 getSnapshot JSDoc |
| P2-018 | P2 | docs | query-router.ts:144 | CLOSED | query-router.ts:144 shouldPreserveBm25 JSDoc |
| P2-019 | P2 | docs | query-router.ts:160 | CLOSED | query-router.ts:160 isGraphChannelPreservationEnabled JSDoc |
| P2-020 | P2 | docs | query-router.ts:1-6 | CLOSED | query-router.ts:1-6 module header refreshed |
| P2-021 | P2 | maintainability | entity-density.ts:46-58 | CLOSED | entity-density.ts:48-54 parseTriggerPhrases JSDoc |
| P2-022 | P2 | tests | query-router.vitest.ts:33,415 | CLOSED | query-router.vitest.ts duplicate env-flag constant deduped via shared helper |
| P2-023 | P2 | tests | query-router.vitest.ts + routing-telemetry-stress.vitest.ts | CLOSED | tests/__helpers__/test-env.ts created; both test files refactored |
| P2-C-001 | P2 | reliability | entity-density.ts:109-114 | CLOSED | entity-density.ts:109-120 error path preserves cache |
| P2-C-002 | P2 | tests | entity-density.vitest.ts | CLOSED | entity-density.vitest.ts new test 012-ED-3.3 |
| S7-001 | P2 | security | entity-density.ts:32,69-92 | CLOSED | entity-density.ts:33 SIZE invariant comment |
| P2-TR-001 | P2 | docs-inconsistency | 001/implementation-summary.md:87,124 | CLOSED | 001/implementation-summary.md lines 87/124/130 test counts canonicalized to 95 |
| P2-TR-002 | P2 | resource-map | 001/resource-map.md:59-74 | CLOSED | resource-map.md rows for scratch/live-smoke + stress-test added |
| P2-TR-003 | P2 | docs | 001/scratch/live-smoke-results.md:80 | CLOSED | 001/scratch/live-smoke-results.md:80 line ref 167-189→183-205 |
| P2-TR-004 | P2 | feature-catalog | 12-graph-channel-preservation.md:50-53 | CLOSED | feature_catalog/12-...md validation table includes routing-telemetry-stress.vitest.ts |
| P2-TR-005 | P2 | resource-map | 001/resource-map.md:29 | CLOSED | resource-map.md summary count updated (Skills/Total) |
| P2-TR-006 | P2 | docs | 001/implementation-summary.md:35 | CLOSED | 001/implementation-summary.md Q2 (rate band) expanded to full paragraph |
| P2-TR-007 | P2 | checklist | 001/checklist.md:142 | CLOSED | 001/checklist.md CHK-051 + CHK-052 evidence updated |
| ADV-001 | P2 | env-parsing | query-router.ts:160-163 | CLOSED | query-router.ts:160-182 env-flag tightening; new vitest tests at query-router.vitest.ts:542 |
| ADV-002 | P2 | tests | query-router.vitest.ts:60-72 | CLOSED | query-router.vitest.ts withFeatureFlag now wired 3× |
| ADV-003 | P2 | reliability | entity-density.ts:109-114 | CLOSED | entity-density.ts:120 error path comment fix + catch preserves cache |
| F10-001 | P2 | docs-staleness | 001/spec.md:49 | CLOSED | 001/spec.md Status field updated |
| F10-002 | P2 | docs-staleness | 001/plan.md:60-73 | CLOSED | 001/plan.md DoD checkboxes ticked |
| F10-003 | P2 | docs-inconsistency | 001/handover.md:30 | CLOSED | 001/handover.md completion_pct=100 |
| F10-004 | P2 | defensive | entity-density.ts:79 | CLOSED | entity-density.ts:79 SAFETY comment on HighDegreeRow cast |
| F10-005 | P2 | maintainability | routing-telemetry.ts:31 | CLOSED | routing-telemetry.ts redundant Set dedup removed |
| F10-006 | P2 | metadata | 001/graph-metadata.json:50,54 | CLOSED | 001/graph-metadata.json key_files deduplicated to 4 unique entries |

---

## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `tsc --noEmit` | PASS | exit 0 |
| query-router + entity-density + telemetry-stress + integration tests | PASS | 91 tests / 4 files (vitest run) |
| `validate.sh --strict` 002 packet | PASS | exit 0 (after T4.A-D fixes) |
| T1.3 integration test passes | PASS | 2 tests / `tests/integration/entity-density-commit-hooks.vitest.ts` |
| T2a.2 entity-density rebuild test passes | PASS | new test `012-ED-3.3` |
| T2a.5 env-flag parsing tests pass | PASS | new tests at `query-router.vitest.ts:542` |

---

## Known Limitations

None. All tracked findings are CLOSED.

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| Packet | `002-deep-review-remediation` |
| Parent | `009-causal-graph-channel-routing` |
| Final Status | CLOSED |
| Findings Open | 0 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The packet shipped cache invalidation wiring in `memory-save.ts` and `memory-bulk-delete.ts`, source/test reliability polish, traceability doc fixes, metadata cleanup, and final synthesis for all tracked findings.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The work landed as 21 sequential T1-T3 batches followed by the T4 documentation and validation pass.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS

- Wire entity-density invalidation after successful commits.
- Tighten graph-channel preservation env-flag parsing.
- Keep duplicated `ChannelName` with a source-of-truth comment.
- Rename telemetry docs to rolling-window language.
- Close packet status docs as part of completion.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION SUMMARY

Strict validation uses `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict`; targeted tests use `npx vitest run tests/query-router.vitest.ts tests/entity-density.vitest.ts tests/routing-telemetry-stress.vitest.ts tests/integration/entity-density-commit-hooks.vitest.ts`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## LIMITATIONS

No tracked limitations remain open.
<!-- /ANCHOR:limitations -->
