---
title: "Checklist — Phase 010 Coco-Memory Context Extras"
description: "Verification checklist for Phase 010. P0/P1/P2 items mapped to REQ-001..018."
trigger_phrases:
  - "027 phase 010 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-coco-memory-context-extras"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Items get checked off during implementation"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.0 -->
# Verification Checklist: Coco-Memory Context Extras

<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — MUST PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 1 | [ ] | CHK-001 | Coco `data.results` ordering bit-identical pre/post exemplar feature | REQ-001 | Snapshot diff test |
| 2 | [ ] | CHK-002 | `exemplars` field is SEPARATE response group; never blended into ranking | REQ-001 | Schema introspection test |
| 3 | [ ] | CHK-003 | `coco_query_examples_vec` table SEPARATE from `code_chunks_vec` | REQ-002 | Schema check; reindex code chunks doesn't touch examples |
| 4 | [ ] | CHK-004 | Storage cap (~2000 rows); TTL ~90 days; top-3 output; similarity ≥0.80 | REQ-003 | Cap, TTL, threshold tests |
| 5 | [ ] | CHK-005 | Stale reconciliation covers all 3 conditions (file/range/hash) | REQ-004 | Reconciliation tests for each |
| 6 | [ ] | CHK-006 | Privacy: no comment text in exemplar rows | REQ-006 | Schema review + grep |
| 7 | [ ] | CHK-007 | Memory `data.results` ordering bit-identical pre/post curator | REQ-010, REQ-015 | Snapshot diff test (Stage 4 immutability) |
| 8 | [ ] | CHK-008 | Curator output schema validation rejects invented IDs | REQ-011 | Schema validation test |
| 9 | [ ] | CHK-009 | Budget split: `retrievalCandidateLimit` + `presentationLimit` + `curationTokenBudget` knobs work independently | REQ-012 | Budget split test |
| 10 | [ ] | CHK-010 | Hard timeout 1500-2500ms with deterministic fallback | REQ-013 | Mock-timeout test |
| 11 | [ ] | CHK-011 | Cache extension `mode: 'context_curation'` keying works correctly | REQ-014 | Cache key test; candidate-set hash stable |
| 12 | [ ] | CHK-012 | Both feature flags default off; flag-off output bit-identical to today | REQ-009, REQ-017 | Flag-off diff tests |
| 13 | [ ] | CHK-013 | Strict spec validation passes for Phase 010 folder | n/a | `validate.sh ... --strict` exits 0 |

## P1 — SHOULD PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 14 | [ ] | CHK-014 | `ccc_examples_clear` maintenance op (CLI + MCP tool) works | REQ-005 | Maintenance op test |
| 15 | [ ] | CHK-015 | Cold start (empty bank) → no `exemplars` key in response | REQ-007 | Cold start test |
| 16 | [ ] | CHK-016 | Capture trigger fires only on `helpful`/`partial` ratings | REQ-008 | Capture trigger test |
| 17 | [ ] | CHK-017 | ADR-002 decision (extend `ccc_feedback` schema vs new writer) documented | REQ-008 | Manual review of ADR-002 |
| 18 | [ ] | CHK-018 | Telemetry events surfaced (cache hit/miss, timeout, parse failure, selected IDs, omitted high-rank IDs, token/cost, eval outcome) | REQ-016 | Eval logger test |
| 19 | [ ] | CHK-019 | Both flag families documented in `ENV_REFERENCE.md` | REQ-009, REQ-017 | grep verification |
| 20 | [ ] | CHK-020 | Curator deterministic fallback covers all 4 failure modes (timeout/parse/invalid-id/no-LLM) | REQ-013 | Fallback tests |
| 21 | [ ] | CHK-021 | Curator output buckets correctly populated (causalChain/tierExemplars/directEvidence/supportingContext/omittedButAvailable) | REQ-011 | Schema population test |
| 22 | [ ] | CHK-022 | Stage 4 ordering MUST NOT be mutated; `score`/`rrfScore`/`intentAdjustedScore` preserved | REQ-015 | Immutability test |

## P2 — NICE TO HAVE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 23 | [ ] | CHK-023 | Coco existing tests pass with flag off | REQ-001 | `pytest mcp-coco-index/tests/` |
| 24 | [ ] | CHK-024 | Voyage embed fail at exemplar capture is graceful | edge case | Mock-fail test |
| 25 | [ ] | CHK-025 | Phase-005 lift gate documented for both features | REQ-018 | Manual review of docs |
| 26 | [ ] | CHK-026 | Eval criteria for active-mode promotion documented (task success ≥ baseline; cited-source correctness ≥ baseline; missed-critical-context ≤ baseline; latency budget; nondeterministic-variance bound) | REQ-018 | Manual review |
| 27 | [ ] | CHK-027 | implementation-summary.md filled post-implementation | n/a (post-impl) | Manual after Sub-Phase 5 |
| 28 | [ ] | CHK-028 | Description.json children entry added to parent 027 | n/a | grep parent description.json |

---

## VERIFICATION COMMANDS QUICK-RUN

```bash
# Strict spec validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-coco-memory-context-extras --strict

# All Phase 010 vitest (memory side)
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/__tests__/search/

# All Phase 010 pytest (coco side)
cd .opencode/skills/mcp-coco-index && pytest tests/

# Specific feature tests
npx vitest run mcp_server/__tests__/search/context-curator.vitest.ts
npx vitest run mcp_server/__tests__/search/curator-fallback.vitest.ts
pytest mcp-coco-index/tests/test_example_bank.py

# Diff tests (flag-off parity)
SPECKIT_COCOINDEX_EXEMPLARS=false pytest mcp-coco-index/tests/
SPECKIT_CONTEXT_CURATOR=false npx vitest run
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
