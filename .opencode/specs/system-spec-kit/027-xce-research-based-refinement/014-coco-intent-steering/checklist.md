---
title: "Checklist — Phase 007 Coco-Index Intent Steering"
description: "Verification checklist for Phase 007: P0/P1/P2 items mapped to REQ-NNN with verification commands. Must-pass before merge."
trigger_phrases:
  - "027 phase 007 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Items get checked off during implementation"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.0 -->
# Verification Checklist: Coco-Index Intent Steering + Bounded Query Expansion

<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — MUST PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 1 | [ ] | CHK-001 | Intent classifier passes 30+ fixture cases (precision ≥ 0.85) | REQ-001 | `pytest mcp-coco-index/tests/test_intent_classifier.py -v` |
| 2 | [ ] | CHK-002 | 3-embedding ceiling enforced (assertion failure on >3 embed calls) | REQ-002 | `pytest mcp-coco-index/tests/test_query_expansion.py::test_embedding_cap` |
| 3 | [ ] | CHK-003 | Per-sub-query fetch budget = existing `fetch_k = unique_k * 4` | REQ-003 | Snapshot test asserts no fanout multiplier on candidate count |
| 4 | [ ] | CHK-004 | Exact-intent suppression covers all 5 cases (quoted/regex/path/ID/empty) | REQ-004 | `pytest test_query_expansion.py::test_suppression_*` (5 cases) |
| 5 | [ ] | CHK-005 | `rankingSignals` populated with `intent`, `expanded_to`, `sub_query_idx` | REQ-005 | Snapshot test on result envelope |
| 6 | [ ] | CHK-006 | Feature flag `SPECKIT_COCOINDEX_INTENT_EXPAND=0` default off; flag-off behavior identical to today | REQ-006 | Diff test: flag-off output equals current behavior on 20-query baseline |
| 7 | [ ] | CHK-007 | Lexical-only behavior unchanged when flag off (zero regressions) | REQ-006 | Existing coco test suite passes unchanged |
| 8 | [ ] | CHK-008 | Strict spec validation passes for Phase 007 folder | n/a | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering --strict` exits 0 |

## P1 — SHOULD PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 9 | [ ] | CHK-009 | Telemetry envelope has all 4 new fields populated | REQ-007 | Snapshot test on `cocoindex-calibration.ts` envelope |
| 10 | [ ] | CHK-010 | Path-class intent priors apply correctly per intent family | REQ-008 | Unit tests for each intent → path-class mapping |
| 11 | [ ] | CHK-011 | Path-class boost magnitude bounded ±0.05 | REQ-008 | Assertion in `_ranked_result()` test |
| 12 | [ ] | CHK-012 | Advisor first-action hint integrates with Phase-005 mandate brief OR works standalone | REQ-009 | `vitest run render-coco-hint.vitest.ts` (both paths) |
| 13 | [ ] | CHK-013 | Latency overhead p50 < 100ms (within 2× baseline) | REQ-010 | `pytest test_latency_benchmark.py` |
| 14 | [ ] | CHK-014 | Sub-query results merged correctly (no original-query rows lost) | REQ-001 | Unit test: original-query rows always present when score ≥ threshold |
| 15 | [ ] | CHK-015 | `expansion_suppressed_reason` telemetry value matches expected suppression heuristic | REQ-004 | Per-suppression-case fixture asserts reason string |
| 16 | [ ] | CHK-016 | Voyage rate-limit fallback degrades to original-query-only with telemetry | REQ-002 | Mock rate-limit test |

## P2 — NICE TO HAVE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 17 | [ ] | CHK-017 | SKILL.md documents new flag + intent families | REQ-011 | Manual review |
| 18 | [ ] | CHK-018 | references/search_patterns.md updated with expansion-active behavior | REQ-011 | Manual review |
| 19 | [ ] | CHK-019 | ENV_REFERENCE.md documents both flags | REQ-006, REQ-009 | grep ENV_REFERENCE.md for `SPECKIT_COCOINDEX_INTENT_EXPAND` and `SPECKIT_COCOINDEX_FIRST_ACTION_HINT` |
| 20 | [ ] | CHK-020 | Telemetry envelope overhead < 200B per response | REQ-007 | Snapshot test on envelope size delta |
| 21 | [ ] | CHK-021 | Empty-query handling: no embedding call, no expansion, empty result set | edge case | Unit test |
| 22 | [ ] | CHK-022 | Concurrent multi-tenant queries don't share classifier/expander state | edge case | Concurrency stress test |
| 23 | [ ] | CHK-023 | implementation-summary.md filled post-implementation (not at scaffold time) | n/a (post-impl) | Manual after Sub-Phase 4 complete |
| 24 | [ ] | CHK-024 | Description.json children entry added to parent 027 | n/a | grep parent description.json for `007-coco-intent-steering` |
| 25 | [ ] | CHK-025 | Phase-006 eval (when shipped) measures expansion lift on labeled task set | success metric | Phase-006 paired comparison report |

---

## VERIFICATION COMMANDS QUICK-RUN

```bash
# Strict spec validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering --strict

# Python tests (classifier, expansion, latency)
cd .opencode/skills/mcp-coco-index && pytest tests/ -v

# TypeScript tests (advisor render)
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/__tests__/skill_advisor/render-coco-hint.vitest.ts

# Diff test (flag-off equals baseline)
SPECKIT_COCOINDEX_INTENT_EXPAND=0 ccc search "find error handling" > /tmp/before.json
# (apply implementation)
SPECKIT_COCOINDEX_INTENT_EXPAND=0 ccc search "find error handling" > /tmp/after.json
diff /tmp/before.json /tmp/after.json  # expected: empty
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

See P0/P1 test items above for verification commands. Coverage spans unit, integration, diff (backward-compat), and Phase-006 paired-comparison eval.
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

Default-off flag is the ship-readiness gate. Active rollout requires Phase-006 eval lift evidence (when applicable).
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

Sign-off requires: all P0 items above checked, strict validation passing, implementation-summary.md filled with file:line evidence, and Phase-006 eval gate documented when active-mode rollout is in scope.
<!-- /ANCHOR:sign-off -->
