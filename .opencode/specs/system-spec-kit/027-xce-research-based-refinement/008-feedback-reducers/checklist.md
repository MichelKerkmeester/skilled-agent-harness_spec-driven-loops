---
title: "Checklist — Phase 008 Shared Feedback Reducers"
description: "Verification checklist for Phase 008 — 35 items across 5 sub-phases mapped to REQ-001..029. P0 includes the 3 P0 precondition fixes."
trigger_phrases:
  - "027 phase 008 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Items get checked off during implementation"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.0 -->
# Verification Checklist: Shared Feedback Reducers

<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — MUST PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 1 | [ ] | CHK-001 | P0-1: `auto-session` edges capped at 0.5 strength via broadened `isAutoEdgeCreator` | REQ-001 | `vitest run causal-edges-auto-provenance.vitest.ts` |
| 2 | [ ] | CHK-002 | P0-1: same predicate fix in `consolidation.ts:352-359` Hebbian gating | REQ-001 | Test: hebbian creation respects auto-* prefix |
| 3 | [ ] | CHK-003 | P0-2: pre-existing manual edge NOT overwritten by reducer upsert | REQ-002 | `vitest run insert-edge-manual-guard.vitest.ts` |
| 4 | [ ] | CHK-004 | P0-3: `RetentionExpiredRow` schema includes `importance_tier` + 4 other tier fields | REQ-003 | TypeScript type check + grep |
| 5 | [ ] | CHK-005 | P0-3: `selectExpiredRows` returns extended row type | REQ-003 | `vitest run retention-sweep-tier.vitest.ts` |
| 6 | [ ] | CHK-006 | P0-3: constitutional/critical records NEVER deleted on TTL expiry (sweep `protect` action) | REQ-003 + REQ-024 | Integration test: constitutional with expired delete_after → `protect` decision |
| 7 | [ ] | CHK-007 | Aggregation reducer idempotent for identical inputs | REQ-006 | Run-twice test |
| 8 | [ ] | CHK-008 | Weighted positive formula correct (0 floor; positive-only; negative-only; mixed) | REQ-005 | `vitest run aggregation.vitest.ts` formula edge cases |
| 9 | [ ] | CHK-009 | Consumer A delta clamped at ±0.10 boundary | REQ-010 | `pytest test_feedback_reducer.py::test_clamping` |
| 10 | [ ] | CHK-010 | Consumer A cold start = no behavior change (`delta=0`) | REQ-012 | Diff test: empty JSONL → identical output |
| 11 | [ ] | CHK-011 | Consumer B emits `ENABLED(A→B)` at exactly strength 0.3 with `created_by='auto-session'` | REQ-017 | Inspection test on emitted edges |
| 12 | [ ] | CHK-012 | Consumer B DEFERRED only — no live invocation paths from `logFeedbackEvent` or `memory_search` | REQ-018 | Code review + grep |
| 13 | [ ] | CHK-013 | Consumer B caps enforced (≤5 sources, MAX_EDGES_PER_NODE, CAP_PER_WINDOW) | REQ-021 | Cap tests for each |
| 14 | [ ] | CHK-014 | Consumer C all 5 RetentionDecision rules tested (constitutional/critical/pinned/important+positive/normal) | REQ-024 | `vitest run retention-reducer.vitest.ts` |
| 15 | [ ] | CHK-015 | Edge floor NARROW: only manual + both-endpoints-high-tier OR constitutional-chain evidence | REQ-025 | `vitest run edge-floor-narrow.vitest.ts` (3 cases: auto NOT floored, one-end-high NOT floored, both-end-high floored) |
| 16 | [ ] | CHK-016 | Strict spec validation passes for Phase 008 folder | n/a | `validate.sh ... --strict` exits 0 |
| 17 | [ ] | CHK-017 | All 3 feature flags default off; flag-off behavior identical to current | REQ-014, 022, 029 | Flag matrix tests |

## P1 — SHOULD PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 18 | [ ] | CHK-018 | Consumer A reducer reads JSONL line-by-line, not bulk-load | REQ-007 | Memory profile test (large JSONL fixture) |
| 19 | [ ] | CHK-019 | Consumer A path_class derivation matches indexer behavior | REQ-008 | Cross-check test against `classify_path()` |
| 20 | [ ] | CHK-020 | Consumer A SQLite schema migration applies cleanly | REQ-009 | Schema check on test DB |
| 21 | [ ] | CHK-021 | Consumer A min support: 5 events OR 3 distinct queries | REQ-010 | Boundary tests |
| 22 | [ ] | CHK-022 | Consumer A privacy: no comment text in learned table | REQ-013 | Schema review + grep |
| 23 | [ ] | CHK-023 | Consumer B selection algorithm prefers same-query then recent prior session | REQ-016 | Selection determinism test |
| 24 | [ ] | CHK-024 | Consumer B idempotency: re-run on same session bumps strength ≤0.05 clamped to 0.5 | REQ-020 | Run-twice test |
| 25 | [ ] | CHK-025 | Consumer C `dryRun=true` returns decisions without DB writes | REQ-026 | dryRun integration test |
| 26 | [ ] | CHK-026 | Consumer C promotion gate (live mutation requires shadow eval window) | REQ-027 | Promotion gate test |
| 27 | [ ] | CHK-027 | Consumer C sweep integration writes correct audit ledger entries (`extend`/`protect`/`delete`) | REQ-028 | Audit ledger inspection |
| 28 | [ ] | CHK-028 | All 3 flag families documented in `ENV_REFERENCE.md` | REQ-014, 022, 029 | grep ENV_REFERENCE for `SPECKIT_COCOINDEX_FEEDBACK`, `SPECKIT_SESSION_TRACE`, `SPECKIT_FEEDBACK_RETENTION` |
| 29 | [ ] | CHK-029 | Sub-Phase 1 (P0 fixes) MUST land before Sub-Phase 4 starts (verified by branch order) | preconditions | Process review (commit graph) |
| 30 | [ ] | CHK-030 | All existing causal-edges + retention-sweep tests still pass | n/a regression | Existing suites green |

## P2 — NICE TO HAVE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 31 | [ ] | CHK-031 | Consumer C edge floor: constitutional-chain evidence marker recognized | REQ-025 | Floor test with explicit evidence marker |
| 32 | [ ] | CHK-032 | Reducers safe under concurrent invocation (cron + manual maintenance) | REQ-006, 020, 026 | Concurrency stress test |
| 33 | [ ] | CHK-033 | Consumer A handles JSONL rotation/truncation gracefully | edge case | Rotation simulation test |
| 34 | [ ] | CHK-034 | implementation-summary.md filled post-implementation | n/a (post-impl) | Manual after Sub-Phase 5 |
| 35 | [ ] | CHK-035 | Description.json children entry added to parent 027 | n/a | grep parent description.json |

---

## VERIFICATION COMMANDS QUICK-RUN

```bash
# Strict spec validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers --strict

# All Sub-Phase 1 P0 fix tests
cd .opencode/skills/system-spec-kit && npx vitest run \
  mcp_server/__tests__/storage/causal-edges-auto-provenance.vitest.ts \
  mcp_server/__tests__/storage/insert-edge-manual-guard.vitest.ts \
  mcp_server/__tests__/governance/retention-sweep-tier.vitest.ts

# Sub-Phase 2 aggregation
npx vitest run mcp_server/__tests__/feedback/aggregation.vitest.ts

# Consumer B + C
npx vitest run mcp_server/__tests__/feedback/

# Consumer A (Python)
cd .opencode/skills/mcp-coco-index && pytest tests/test_feedback_reducer.py -v

# Constitutional protection regression sentinel
SPECKIT_FEEDBACK_RETENTION_LEARNING=true SPECKIT_FEEDBACK_RETENTION_MODE=shadow \
  npx vitest run mcp_server/__tests__/governance/retention-sweep-tier.vitest.ts
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

See P0/P1 test items above for verification commands. Coverage spans unit, integration, diff (backward-compat), and Phase-005 paired-comparison eval.
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

Default-off flag is the ship-readiness gate. Active rollout requires Phase-005 eval lift evidence (when applicable).
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

Sign-off requires: all P0 items above checked, strict validation passing, implementation-summary.md filled with file:line evidence, and Phase-005 eval gate documented when active-mode rollout is in scope.
<!-- /ANCHOR:sign-off -->
