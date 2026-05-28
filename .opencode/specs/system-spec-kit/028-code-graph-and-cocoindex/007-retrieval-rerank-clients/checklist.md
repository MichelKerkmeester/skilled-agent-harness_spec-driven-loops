---
title: "Checklist — Phase 007 Retrieval Rerank Clients"
description: "Verification checklist for Phase 007. P0/P1/P2 items mapped to REQ-001..016."
trigger_phrases:
  - "027 phase 010 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/007-retrieval-rerank-clients"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Items get checked off during implementation"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.0 -->
# Verification Checklist: Retrieval Rerank Clients

<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — MUST PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 1 | [ ] | CHK-001 | `RerankClient<T>` + `EmbeddingCacheClient` interfaces type-check | REQ-001, REQ-005 | `tsc --noEmit` |
| 2 | [ ] | CHK-002 | Memory rerank output bit-identical pre/post adapter swap | REQ-002 | `vitest run memory-rerank-adapter.vitest.ts` snapshot diff empty |
| 3 | [ ] | CHK-003 | Coco standalone behavior bit-identical when flag off | REQ-007, REQ-012 | Coco existing test suite + diff test |
| 4 | [ ] | CHK-004 | Interface contract tests reject memory-tier or code-chunk fields | REQ-008, REQ-013 | `vitest run rerank-client-contract.vitest.ts` |
| 5 | [ ] | CHK-005 | Score-origin + rankingSignals preserved through Coco adapter round-trip | REQ-003, REQ-004 | Round-trip test in adapter test file |
| 6 | [ ] | CHK-006 | Circuit-breaker fallback path triggers correctly with `provider: 'fallback-score-only'` signal | REQ-010 | `vitest run circuit-breaker-fallback.vitest.ts` |
| 7 | [ ] | CHK-007 | NO `EmbeddingCacheClient` adapter for Coco shipped in this phase (DEFERRED) | REQ-009 | grep absence of Python `EmbeddingCacheClient` adapter |
| 8 | [ ] | CHK-008 | Strict spec validation passes for Phase 007 folder | n/a | `validate.sh ... --strict` exits 0 |

## P1 — SHOULD PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 9 | [ ] | CHK-009 | Existing memory rerank test suite passes unchanged | REQ-011 | `npx vitest run mcp_server/__tests__/search/` |
| 10 | [ ] | CHK-010 | Cross-backend overlap telemetry events fire on appropriate conditions | REQ-006 | `vitest run cross-backend-telemetry.vitest.ts` |
| 11 | [ ] | CHK-011 | Documentation for future RQ-A5 fusion consumer (composability + abstraction boundary) | REQ-014 | Manual review of README/header docs |
| 12 | [ ] | CHK-012 | Feature flag `SPECKIT_COCO_USE_SHARED_RERANK=false` documented | REQ-015 | grep ENV_REFERENCE |
| 13 | [ ] | CHK-013 | Stage3 dependency injection enables test-time RerankClient mocking | REQ-002 | Test uses mock RerankClient injection |
| 14 | [ ] | CHK-014 | Cross-encoder.ts properly implements RerankClient<MemoryDocument> | REQ-001 | TypeScript implements check |
| 15 | [ ] | CHK-015 | embedding-cache.ts properly implements EmbeddingCacheClient | REQ-005 | TypeScript implements check |

## P2 — NICE TO HAVE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 16 | [ ] | CHK-016 | Telemetry event size < 50B per event | REQ-016 | Snapshot test on event size |
| 17 | [ ] | CHK-017 | Coco rerank adapter Python OR TS bridge decision documented | open Q | ADR or commit message |
| 18 | [ ] | CHK-018 | implementation-summary.md filled post-implementation | n/a (post-impl) | Manual after Sub-Phase 4 |
| 19 | [ ] | CHK-019 | Description.json children entry added to parent 027 | n/a | grep parent description.json |
| 20 | [ ] | CHK-020 | RQ-A5 fusion consumer (when shipped) successfully composes RerankClient<T> | future | RQ-A5 phase consumes interface without modification |

---

## VERIFICATION COMMANDS QUICK-RUN

```bash
# Strict spec validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/007-retrieval-rerank-clients --strict

# All Phase 007 vitest
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/__tests__/search/

# Memory rerank parity
npx vitest run mcp_server/__tests__/search/memory-rerank-adapter.vitest.ts

# Interface contract
npx vitest run mcp_server/__tests__/search/rerank-client-contract.vitest.ts

# Coco standalone (flag off)
SPECKIT_COCO_USE_SHARED_RERANK=false cd .opencode/skills/mcp-coco-index && pytest tests/
```

---

<!-- L3 STRUCTURAL APPENDIX -->

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

See "VERIFICATION COMMANDS QUICK-RUN" section above for repeatable checks.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

Pre-implementation requirements covered in `spec.md` Section 4 REQUIREMENTS + this checklist's P0 items above.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- All P0 items above must pass before merge.
- Code review against spec REQ-NNN list (each requirement → corresponding checklist item).
- Strict validation green.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING

See P0/P1 test items above for verification commands. Coverage spans unit, integration, diff (backward-compat), and Phase-004 paired-comparison eval.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

All REQ-NNN items have CHK entries; all CHK items have verification commands. Cross-reference completeness verified by spec validation.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY

Privacy guards documented in `spec.md` (no comment text in learned tables; aggregate-only schemas). No new external attack surface (default-off + local-only).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION

`ENV_REFERENCE.md` updates + `SKILL.md` updates documented in P1/P2 items above.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

See `resource-map.md` for full file inventory by category.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

Strict spec validation must exit 0. All P0 items must be green. P1/P2 polish over implementation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

See `decision-record.md` ADR-001 for L3 designation rationale. Architecture checks: cross-component boundaries respected; abstraction-boundary tests pass.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Latency budget + cost bounds verified per success metrics in `plan.md`.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

Default-off flag is the ship-readiness gate. Active rollout requires Phase-004 eval lift evidence (when applicable).
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Privacy, audit-ledger, governance gates per `spec.md` REQ-NNN list. No SaaS dependencies introduced.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

`ENV_REFERENCE.md` + `SKILL.md` updates verified per P1 items above.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Sign-off requires: all P0 items above checked, strict validation passing, implementation-summary.md filled with file:line evidence, and Phase-004 eval gate documented when active-mode rollout is in scope.
<!-- /ANCHOR:sign-off -->
