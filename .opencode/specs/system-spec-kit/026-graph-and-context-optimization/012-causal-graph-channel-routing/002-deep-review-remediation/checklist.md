---
title: "Checklist: 002 Deep-Review Remediation"
description: "Verification checklist for P0/P1/P2 acceptance. Each item must be marked [x] with concrete file:line or command+output evidence before completion claim."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 002 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 3 -->

Legend: `[ ]` = pending, `[x]` = passed with evidence.

## P0 — Release Blockers

- [ ] **CHK-001** `memory-save.ts` calls `invalidateEntityDensityCache()` post-commit (REQ-T1-001) — evidence: `rg -n invalidateEntityDensityCache mcp_server/handlers/memory-save.ts`
- [ ] **CHK-002** `memory-bulk-delete.ts` calls `invalidateEntityDensityCache()` post-commit (REQ-T1-002) — evidence: `rg -n invalidateEntityDensityCache mcp_server/handlers/memory-bulk-delete.ts`
- [ ] **CHK-003** Integration test `entity-density-commit-hooks.vitest.ts` passes — evidence: `vitest run mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` exit 0
- [ ] **CHK-004** `resource-map.md:55` playbook path is `272-...` (P1-002) — evidence: `rg -n '210-graph-channel-utilization' 001-initial-delivery/resource-map.md` returns 0
- [ ] **CHK-005** `resource-map.md:73` changelog row resolved (P1-003) — evidence: `ls 001-initial-delivery/changelog/` shows referenced file OR `changelog.md` is the canonical source

## P1 — Required (code)

- [ ] **CHK-010** entity-density error path preserves cached state — evidence: vitest 002-T2a.2 passes
- [ ] **CHK-011** entity-density runtime shape OR documented unsafe-cast comment — evidence: `rg -n 'SAFETY' mcp_server/lib/search/entity-density.ts` OR runtime check at line ~79
- [ ] **CHK-012** entity-density module header documents concurrency + size invariants — evidence: file head reads
- [ ] **CHK-013** query-router uses pre-computed intent in routeQuery — evidence: `rg -n classifyIntent mcp_server/lib/search/query-router.ts | wc -l` ≤ 2
- [ ] **CHK-014** query-router has JSDoc on all 4 exported helpers — evidence: file inspection
- [ ] **CHK-015** query-router env-flag rejects `"0"/"no"/"off"/""` — evidence: new vitest passes for REQ-T2-003
- [ ] **CHK-016** routingReasons BM25 label is `bm25-preserved-by-intent` — evidence: `rg -n authority-artifact mcp_server/lib/search/query-router.ts` returns 0
- [ ] **CHK-017** safeGetDb warn-once instrumentation — evidence: `rg -n warn mcp_server/lib/search/query-router.ts | head`
- [ ] **CHK-018** routing-telemetry ChannelName decision applied — evidence: `rg -n 'type ChannelName' mcp_server/lib/search` shows single source-of-truth or commented re-declaration
- [ ] **CHK-019** routing-telemetry rolling-window doc updated OR refactored — evidence: file head reads
- [ ] **CHK-020** memory-crud-health try/catch + zero-fallback around getRoutingTelemetrySnapshot — evidence: file inspection at line ~626
- [ ] **CHK-021** withFeatureFlag wired OR removed — evidence: `rg -n withFeatureFlag mcp_server/tests`
- [ ] **CHK-022** Shared `__helpers__/test-env.ts` exists and is imported by both test files — evidence: `ls mcp_server/tests/__helpers__/` and import lines

## P1 — Required (docs)

- [ ] **CHK-030** `001/spec.md` Status updated (F10-001)
- [ ] **CHK-031** `001/plan.md` DoD checkboxes updated (F10-002)
- [ ] **CHK-032** `001/handover.md` completion_pct=100 (F10-003)
- [ ] **CHK-033** `001/implementation-summary.md` test counts consistent + Q2 expanded (P2-TR-001, P2-TR-006)
- [ ] **CHK-034** `001/checklist.md` CHK-052 evidence includes stress test (P2-TR-007)
- [ ] **CHK-035** `001/scratch/live-smoke-results.md:80` line ref `183-205` (P2-TR-003)
- [ ] **CHK-036** Feature catalog line refs + validation table updated (P2-016, P2-TR-004)
- [ ] **CHK-037** Playbook 272 expected rate 0.4 with classifier note (P2-14)
- [ ] **CHK-038** Resource-map missing rows added (P2-015, P2-TR-002); count mismatch fixed (P2-TR-005)

## P2 — Metadata

- [ ] **CHK-050** `001/graph-metadata.json` `derived.key_files` deduplicated (F10-006) — evidence: `node -e "..."` script returns unique count

## Quality Gates

- [ ] **CHK-090** `npm run build` exits 0
- [ ] **CHK-091** Full `npm run vitest` regresses 0 tests vs pre-002 baseline (record both counts)
- [ ] **CHK-092** `validate.sh --strict` on 002 packet exits 0
- [ ] **CHK-093** New tests added: T1.3 integration + T2a.2 entity-density rebuild + T2a.5 env-flag parsing
- [ ] **CHK-094** `implementation-summary.md` filled with finding-by-finding closing status (CLOSED + evidence, or ACCEPTED + rationale)
