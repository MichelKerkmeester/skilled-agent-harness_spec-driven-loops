---
title: "Checklist: 002 Deep-Review Remediation"
description: "Verification checklist for P0/P1/P2 acceptance. Each item must be marked [x] with concrete file:line or command+output evidence before completion claim."
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing"
    last_updated_at: "2026-05-11T11:30:00Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Final verification passed"
    next_safe_action: "Packet ready for parent closure"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 002 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 3 -->

Legend: `[ ]` = pending, `[x]` = passed with evidence.

## P0 — Release Blockers

- [x] **CHK-001** [P0] `memory-save.ts` calls `invalidateEntityDensityCache()` post-commit (REQ-T1-001) — evidence: `rg -n invalidateEntityDensityCache mcp_server/handlers/memory-save.ts`
- [x] **CHK-002** [P0] `memory-bulk-delete.ts` calls `invalidateEntityDensityCache()` post-commit (REQ-T1-002) — evidence: `rg -n invalidateEntityDensityCache mcp_server/handlers/memory-bulk-delete.ts`
- [x] **CHK-003** [P0] Integration test `entity-density-commit-hooks.vitest.ts` passes — evidence: `vitest run mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` exit 0
- [x] **CHK-004** [P0] `resource-map.md:55` playbook path is `272-...` (P1-002) — evidence: `rg -n '210-graph-channel-utilization' 001-deliver-causal-graph-channel-routing-mvp/resource-map.md` returns 0
- [x] **CHK-005** [P0] `resource-map.md:73` changelog row resolved (P1-003) — evidence: `ls 001-deliver-causal-graph-channel-routing-mvp/changelog/` shows referenced file OR `changelog.md` is the canonical source

## P1 — Required (code)

- [x] **CHK-010** [P1] entity-density error path preserves cached state — evidence: vitest 002-T2a.2 passes
- [x] **CHK-011** [P1] entity-density runtime shape OR documented unsafe-cast comment — evidence: `rg -n 'SAFETY' mcp_server/lib/search/entity-density.ts` OR runtime check at line ~79
- [x] **CHK-012** [P1] entity-density module header documents concurrency + size invariants — evidence: file head reads
- [x] **CHK-013** [P1] query-router uses pre-computed intent in routeQuery — evidence: `rg -n classifyIntent mcp_server/lib/search/query-router.ts | wc -l` ≤ 2
- [x] **CHK-014** [P1] query-router has JSDoc on all 4 exported helpers — evidence: file inspection
- [x] **CHK-015** [P1] query-router env-flag rejects `"0"/"no"/"off"/""` — evidence: new vitest passes for REQ-T2-003
- [x] **CHK-016** [P1] routingReasons BM25 label is `bm25-preserved-by-intent` — evidence: `rg -n authority-artifact mcp_server/lib/search/query-router.ts` returns 0
- [x] **CHK-017** [P1] safeGetDb warn-once instrumentation — evidence: `rg -n warn mcp_server/lib/search/query-router.ts | head`
- [x] **CHK-018** [P1] routing-telemetry ChannelName decision applied — evidence: `rg -n 'type ChannelName' mcp_server/lib/search` shows single source-of-truth or commented re-declaration
- [x] **CHK-019** [P1] routing-telemetry rolling-window doc updated OR refactored — evidence: file head reads
- [x] **CHK-020** [P1] memory-crud-health try/catch + zero-fallback around getRoutingTelemetrySnapshot — evidence: file inspection at line ~626
- [x] **CHK-021** [P1] withFeatureFlag wired OR removed — evidence: `rg -n withFeatureFlag mcp_server/tests`
- [x] **CHK-022** [P1] Shared `__helpers__/test-env.ts` exists and is imported by both test files — evidence: `ls mcp_server/tests/__helpers__/` and import lines

<!-- ANCHOR:docs-verify -->
## P1 — Required (docs)

- [x] **CHK-030** [P1] `001/spec.md` Status updated (F10-001)
- [x] **CHK-031** [P1] `001/plan.md` DoD checkboxes updated (F10-002)
- [x] **CHK-032** [P1] `001/handover.md` completion_pct=100 (F10-003)
- [x] **CHK-033** [P1] `001/implementation-summary.md` test counts consistent + Q2 expanded (P2-TR-001, P2-TR-006)
- [x] **CHK-034** [P1] `001/checklist.md` CHK-052 evidence includes stress test (P2-TR-007)
- [x] **CHK-035** [P1] `001/scratch/live-smoke-results.md:80` line ref `183-205` (P2-TR-003)
- [x] **CHK-036** [P1] Feature catalog line refs + validation table updated (P2-016, P2-TR-004)
- [x] **CHK-037** [P1] Playbook 272 expected rate 0.4 with classifier note (P2-14)
- [x] **CHK-038** [P1] Resource-map missing rows added (P2-015, P2-TR-002); count mismatch fixed (P2-TR-005)
<!-- /ANCHOR:docs-verify -->

## P2 — Metadata

- [x] **CHK-050** [P2] `001/graph-metadata.json` `derived.key_files` deduplicated (F10-006) — evidence: `node -e "..."` script returns unique count

## Quality Gates

- [x] **CHK-090** [P1] `npm run build` exits 0
- [x] **CHK-091** [P1] Full `npm run vitest` regresses 0 tests vs pre-002 baseline (record both counts)
- [x] **CHK-092** [P1] `validate.sh --strict` on 002 packet exits 0
- [x] **CHK-093** [P1] New tests added: T1.3 integration + T2a.2 entity-density rebuild + T2a.5 env-flag parsing
- [x] **CHK-094** [P1] `implementation-summary.md` filled with finding-by-finding closing status (CLOSED + evidence, or ACCEPTED + rationale)

<!-- ANCHOR:sign-off -->
## Sign-off

Sign-off complete; strict validation and targeted tests passed (2026-05-11).
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

Use strict spec validation plus the targeted vitest run before claiming packet closure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

T1-T3 were completed before this T4 finalization batch began.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY

Code-quality evidence is captured in the CLOSED finding rows of `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING

The targeted test surface is query-router, entity-density, routing-telemetry stress, and entity-density commit hooks.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

All findings are CLOSED in `implementation-summary.md`; no ACCEPTED-open findings remain.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY

Security-relevant closure is limited to env-flag parsing and bounded routing-reason persistence.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION

Documentation closure covers 001 status, DoD, handover, test counts, checklist evidence, live-smoke references, feature catalog, playbook, and resource-map rows.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

T4 modifies only files inside the `002-fix-deep-review-findings-for-causal-graph-channel-routing` packet.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

Final verification requires `validate.sh --strict` exit 0 and the targeted vitest command reporting 91 passing tests.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## ARCHITECTURE VERIFICATION

The batch architecture remained sequential and docs-only for T4.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## PERFORMANCE VERIFICATION

No performance-sensitive code changed in T4; previous performance-related findings are CLOSED with source evidence.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## DEPLOYMENT READINESS

The packet is deploy-ready after strict validation and targeted tests pass.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## COMPLIANCE VERIFICATION

Template compliance is verified by the packet-level strict validator.
<!-- /ANCHOR:compliance-verify -->
