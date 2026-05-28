---
title: "Checklist — Phase 007 Memory Semantic Triggers"
description: "Verification checklist for Phase 007. P0/P1/P2 items mapped to REQ-NNN with verification commands."
trigger_phrases:
  - "027 phase 007 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memory-semantic-triggers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Items get checked off during implementation"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.0 -->
# Verification Checklist: Memory Semantic Triggers

<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — MUST PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 1 | [ ] | CHK-001 | Lexical-only behavior bit-identical when flag off (zero regression) | REQ-001 | `lexical-parity.vitest.ts` snapshot diff empty |
| 2 | [ ] | CHK-002 | Existing trigger-matcher test suite passes unchanged | REQ-001 | `npx vitest run mcp_server/__tests__/parsing/trigger-matcher` |
| 3 | [ ] | CHK-003 | Strong lexical command match short-circuits semantic stage (no embed call) | REQ-003 | Trace assertion test |
| 4 | [ ] | CHK-004 | Schema migration applies cleanly to existing memory DB fixture | REQ-004 | Migration test |
| 5 | [ ] | CHK-005 | Trigger embeddings stored in `memory_trigger_embeddings`; BLOB in `embedding_cache` | REQ-004 | Schema introspection test |
| 6 | [ ] | CHK-006 | `trigger_phrases` JSON remains source-of-truth; `--force` regenerates derived table | REQ-005 | Regen test on test DB |
| 7 | [ ] | CHK-007 | `memory-triggers.ts` Stage 2 hot path makes ZERO `embed` calls (cache lookup only) | REQ-006 | Code review + trace assertion |
| 8 | [ ] | CHK-008 | Semantic-only hits source-tagged: `matchSource: "semantic"` + `semanticScore` | REQ-007 | Snapshot test on result envelope |
| 9 | [ ] | CHK-009 | Activation guards: lexical=1.0, semantic=min(0.85, score) | REQ-008 | Unit test on activation block |
| 10 | [ ] | CHK-010 | Trigger goldens: exact precision = 1.0, paraphrase recall ≥ 0.7 at 0.84 threshold, distractor FP ≤ 0.05 | REQ-012 | `trigger-goldens.json` fixture run |
| 11 | [ ] | CHK-011 | Strict spec validation passes for Phase 007 folder | n/a | `validate.sh ... --strict` exits 0 |

## P1 — SHOULD PASS BEFORE MERGE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 12 | [ ] | CHK-012 | All 5 flag env vars documented in `ENV_REFERENCE.md` | REQ-009 | grep ENV_REFERENCE for `SPECKIT_SEMANTIC_TRIGGER` |
| 13 | [ ] | CHK-013 | Shadow mode logs would-have-fired hits without activation | REQ-010 | Eval logger test for shadow events |
| 14 | [ ] | CHK-014 | Threshold-band distribution recorded (0.78 / 0.82 / 0.86 buckets) | REQ-010 | `threshold-tuning.vitest.ts` |
| 15 | [ ] | CHK-015 | Cold-start: phrases without embeddings skipped silently | REQ-011 | `cold-start.vitest.ts` |
| 16 | [ ] | CHK-016 | Backfill via `memory_index_scan` populates `embedding_status='ready'` | REQ-006 | Index scan integration test |
| 17 | [ ] | CHK-017 | Save-time path generates embeddings without blocking save | REQ-006 | Save flow timing test |
| 18 | [ ] | CHK-018 | UNION semantics: lexical-strong → only lexical; lexical-empty → semantic returned | REQ-002 | `hybrid-handler.vitest.ts` |
| 19 | [ ] | CHK-019 | Latency p95 with shadow stage active ≤ 100ms WARN | REQ-013 | `latency-budget.vitest.ts` |
| 20 | [ ] | CHK-020 | CJK + Latin trigger phrases both supported in semantic stage | REQ-014 | Goldens fixture CJK coverage |

## P2 — NICE TO HAVE

| # | Status | ID | Item | REQ | Verification |
|---|--------|----|------|-----|--------------|
| 21 | [ ] | CHK-021 | Migration backward-compatible (forward-only ADD; no DROP) | REQ-004 | Manual schema review |
| 22 | [ ] | CHK-022 | In-memory trigger embedding cache concurrent-safe | REQ-002 | Concurrency stress test |
| 23 | [ ] | CHK-023 | Voyage rate-limit fallback degrades to lexical-only with telemetry | edge case | Mock rate-limit test |
| 24 | [ ] | CHK-024 | Multi-tenant scope filtering preserved through semantic stage | edge case | Scope filter test on semantic hits |
| 25 | [ ] | CHK-025 | Description.json children entry added to parent 027 | n/a | grep parent description.json |
| 26 | [ ] | CHK-026 | implementation-summary.md filled post-implementation | n/a (post-impl) | Manual after Sub-Phase 4 |
| 27 | [ ] | CHK-027 | 028/004-code-graph-adoption-eval eval (when shipped) measures paraphrase-task recall lift | success metric | 028/004-code-graph-adoption-eval paired comparison report |
| 28 | [ ] | CHK-028 | Trigger goldens fixture documented (purpose + variant taxonomy) | REQ-012 | Manual review |

---

## VERIFICATION COMMANDS QUICK-RUN

```bash
# Strict spec validation
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-memory-semantic-triggers --strict

# All Phase 007 vitest
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/__tests__/triggers/

# Lexical parity diff (regression sentinel)
SPECKIT_SEMANTIC_TRIGGERS=false npx vitest run mcp_server/__tests__/triggers/lexical-parity.vitest.ts

# Trigger goldens fixture
npx vitest run mcp_server/__tests__/triggers/ -- --reporter=json | jq '.testResults[] | select(.testFilePath | contains("trigger"))'

# Schema migration check
sqlite3 mcp_server/database/context-index*.sqlite ".schema memory_trigger_embeddings"
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

See P0/P1 test items above for verification commands. Coverage spans unit, integration, diff (backward-compat), and 028/004-code-graph-adoption-eval paired-comparison eval.
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

Default-off flag is the ship-readiness gate. Active rollout requires 028/004-code-graph-adoption-eval eval lift evidence (when applicable).
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

Sign-off requires: all P0 items above checked, strict validation passing, implementation-summary.md filled with file:line evidence, and 028/004-code-graph-adoption-eval eval gate documented when active-mode rollout is in scope.
<!-- /ANCHOR:sign-off -->
