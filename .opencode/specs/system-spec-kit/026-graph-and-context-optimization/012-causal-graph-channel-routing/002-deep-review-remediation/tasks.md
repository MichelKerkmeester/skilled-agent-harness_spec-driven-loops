---
title: "Tasks: 002 Deep-Review Remediation"
description: "21 batches across 4 tiers, each one cli-codex dispatch. Update as each batch lands."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 002 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 3 -->

Legend: `[ ]` = pending, `[~]` = in-flight, `[x]` = done.

## Tier 1 — Release Blockers

- [ ] **T1.1** Wire `invalidateEntityDensityCache()` into `memory-save.ts` post-commit branch (P1-C-001 / REQ-T1-001)
- [ ] **T1.2** Wire `invalidateEntityDensityCache()` into `memory-bulk-delete.ts` post-commit branch (P1-C-001 / REQ-T1-002)
- [ ] **T1.3** Integration test + resource-map P1 fixes (P1-002, P1-003, P2-015, P2-TR-002, P2-TR-005, REQ-T1-003, REQ-T1-004)

## Tier 2a — Code Polish

- [ ] **T2a.1** `entity-density.ts` reliability cluster (P2-008, P2-010, P2-011, P2-C-001, P2-021, ADV-003, F10-004, S7-001)
- [ ] **T2a.2** `entity-density.vitest.ts` rebuild-after-success-failure test (P2-C-002)
- [ ] **T2a.3** `query-router.ts` pre-computed intent dedup (P1-001 downgraded)
- [ ] **T2a.4** `query-router.ts` JSDoc + module header + flag self-gate (P2-003, P2-017, P2-018, P2-019, P2-020)
- [ ] **T2a.5** `query-router.ts` env-flag tightening (ADV-001 / REQ-T2-003)
- [ ] **T2a.6** `query-router.ts` routingReasons label + clamp + safeGetDb warn-once (P2-009, P2-012, P2-013)
- [ ] **T2a.7** `routing-telemetry.ts` ChannelName + ring-buffer rename + Set dedup (P2-001, P2-002, F10-005)
- [ ] **T2a.8** `memory-crud-health.ts` try/catch fallback (P2-004)
- [ ] **T2a.9** Shared test helpers + dedup + withFeatureFlag wire-up (P2-022, P2-023, ADV-002)

## Tier 2b — Doc Polish

- [ ] **T2b.1** `001/spec.md` Status field (F10-001)
- [ ] **T2b.2** `001/plan.md` Definition of Done (F10-002)
- [ ] **T2b.3** `001/handover.md` completion_pct (F10-003)
- [ ] **T2b.4** `001/implementation-summary.md` test counts + Q2 answer (P2-TR-001, P2-TR-006)
- [ ] **T2b.5** `001/checklist.md` CHK-052 evidence (P2-TR-007)
- [ ] **T2b.6** `001/scratch/live-smoke-results.md` line ref (P2-TR-003)
- [ ] **T2b.7** Feature catalog + playbook (P2-016, P2-TR-004, P2-14)

## Tier 3 — Metadata

- [ ] **T3.1** `001/graph-metadata.json` key_files dedup (F10-006)

## Tier 4 — Quality Gate

- [ ] **T4.1** `npm run build` + full vitest baseline-vs-post (REQ-T2-004, REQ-T2-005)
- [ ] **T4.2** `validate.sh --strict` exit 0 (SC-003)
- [ ] **T4.3** Fill `002/implementation-summary.md` with closing-status table + verification table
- [ ] **T4.4** Optional: single `@review` agent confirmation pass
