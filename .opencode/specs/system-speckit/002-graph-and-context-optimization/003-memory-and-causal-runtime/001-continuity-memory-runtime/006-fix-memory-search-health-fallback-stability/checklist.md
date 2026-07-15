---
title: "Verification Checklist: Memory search Clusters 4-7 remediation"
description: "Verification Date: 2026-05-08"
trigger_phrases:
  - "memory search clusters 4-7 checklist"
  - "causal-stats verification checklist"
  - "quality fallback verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability"
    last_updated_at: "2026-05-08T21:30:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Verified packet-focused remediation tests and recorded repo-wide full-suite blocker"
    next_safe_action: "Resolve repo-wide Vitest baseline failures if full-suite pass is required"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:064afa1687c8c6cb6838c7eb061ce2a449a6d46d29a83a82d595f20746627a5b"
      session_id: "memory-clusters-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Memory search Clusters 4-7 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available in `plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript compile passes via direct installed compiler: `node ../node_modules/typescript/lib/tsc.js --noEmit --composite false -p tsconfig.json`. Requested `pnpm tsc --noEmit` wrapper failed because `tsc` is not linked.
- [ ] CHK-011 [P0] Full Vitest suite passes with zero net regressions. Evidence: `pnpm vitest run` currently fails repo-wide with 6 failed suites and 208 failed tests.
- [x] CHK-012 [P1] Error handling implemented for daemon, FTS fallback, and DB-missing paths.
- [x] CHK-013 [P1] Code follows local MCP server import and response-envelope patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| ID | Priority | Requirement | Verification |
|----|----------|-------------|--------------|
| CHK-REQ-005 | [P1] | `memory_causal_stats` emits all relation keys. | `causal-stats-output.vitest.ts` asserts all canonical keys are present. |
| CHK-REQ-006 | [P1] | Health degrades when `meetsTarget=false`. | `causal-stats-output.vitest.ts` asserts no healthy status below target. |
| CHK-REQ-007 | [P1] | Quality gap triggers fallback engagement. | Router/search test asserts fallback plan engages when `quality:"gap"` and `avg_score<0.20`. |
| CHK-REQ-008 | [P1] | Folder discovery rejects weak signal. | `folder-discovery-threshold.vitest.ts` asserts `"Semantic Search"` does not bind weakly. |
| CHK-REQ-009 | [P1] | Cold-start ephemeral degraded hint suppressed. | Existing/new memory-context test asserts no hint for `sessionScope:"ephemeral"` and `eventCounterStart:0`. |
| CHK-REQ-010 | [P1] | Relation coverage targets exposed. | `causal-stats-output.vitest.ts` asserts coverage targets/current state exist. |
| CHK-REQ-011 | [P1] | Dedup engages across calls in a memory session. | Memory-context/search metadata shows stable `effectiveSessionId`; full suite covers session state. |
| CHK-REQ-012 | [P2] | CocoIndex status exposed in `memory_health`. | `cocoindex-daemon-probe.vitest.ts` covers reachable, unreachable, and degraded probe states. |
| CHK-REQ-013 | [P2] | Below-target coverage emits remediation hint. | `causal-stats-output.vitest.ts` asserts hint contains `Top N unlinked records` or backfill command. |
| CHK-REQ-014 | [P2] | Custom-answer routing documented. | `commands/memory/search.md` documents custom answers become QUERY with auto-detected intent. |
| CHK-REQ-015 | [P2] | Trigger and constitutional channels participate in dedup metadata. | Response metadata exposes canonical source counts and session dedup state. |
| CHK-REQ-016 | [P2] | Formal 20-paraphrase corpus passes >=80%. | `intent-classifier-corpus.vitest.ts` asserts corpus accuracy. |
| CHK-REQ-017 | [P2] | Naming disambiguated. | Grep/docs/tests use `structural code graph` and `memory causal graph` for user-facing surfaces. |

- [x] CHK-020 [P0] All P1 acceptance criteria met by packet-focused implementation and tests.
- [x] CHK-021 [P0] Manual/runtime smoke evidence documented in `implementation-summary.md`.
- [x] CHK-022 [P1] Edge cases from `spec.md` tested or documented.
- [x] CHK-023 [P1] Error scenarios validated for daemon and lexical fallback.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `class-of-bug` for Clusters 4, 5, 6, and 7.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with `rg` evidence during implementation.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests where applicable; daemon PID details avoid process arguments.
- [x] CHK-FIX-005 [P1] Matrix axes listed: relation type, session scope, folder signal strength, daemon status, quality label.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variants executed for threshold and daemon probe env reads.
- [x] CHK-FIX-007 [P1] Evidence is pinned to this packet's verification commands in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation preserved for query, specFolder, and daemon path reads.
- [x] CHK-032 [P1] Daemon probe does not expose process arguments or environment values.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, command docs, and summary synchronized.
- [x] CHK-041 [P1] Code comments are limited to non-obvious behavior.
- [x] CHK-042 [P2] README not applicable; command spec updated instead.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only.
- [x] CHK-051 [P1] scratch/ cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 10/11 |
| P1 Items | 17 | 17/17 |
| P2 Items | 7 | 7/7 |

**Verification Date**: 2026-05-08
<!-- /ANCHOR:summary -->
