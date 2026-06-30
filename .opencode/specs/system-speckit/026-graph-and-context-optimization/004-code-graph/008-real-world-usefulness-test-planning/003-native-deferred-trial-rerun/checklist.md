---
title: "Verification Checklist: Native Rerun of Deferred Usefulness Cells"
description: "Checklist for native measurements, backlog fix verification, synthesis update, and strict validation."
trigger_phrases:
  - "native rerun usefulness"
  - "026/007/012/002"
  - "native synthesis update"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/003-native-deferred-trial-rerun"
    last_updated_at: "2026-05-06T04:47:44.000Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Verified native rerun packet artifacts"
    next_safe_action: "Fix code graph P0 backlog or run separate live-runtime campaign"
    blockers:
      - "Code graph native scope policy and parser failures remain unresolved"
      - "Plugin/runtime integration still needs a separate authenticated live-runtime campaign"
    key_files:
      - "checklist.md"
      - "trials/trial-log.jsonl"
      - "synthesis-report-native-rerun.md"
    session_dedup:
      fingerprint: "sha256:b8573afd98812522094e9f5aa54f5d37d81833610eaaa1bd3f99e41c397950d4"
      session_id: "026-007-012-003-native-deferred-trial-rerun"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which live-runtime campaign should validate plugin/runtime integration next?"
    answered_questions:
      - "P0 prior backlog fixes are verified."
      - "P1 native rerun results are captured."
      - "P2 synthesis is updated."
---
# Verification Checklist: Native Rerun of Deferred Usefulness Cells

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim native rerun done until complete |
| **[P1]** | Required | Must complete OR document deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-007.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` native measurement capture phases.
- [x] CHK-003 [P1] Dependencies identified. Evidence: `plan.md` Dependencies table.
- [x] CHK-004 [P0] Prior execution packet read first. Evidence: `../001-sandbox-usefulness-trials/` docs reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No production source code modified. Evidence: packet docs plus parent metadata only.
- [x] CHK-011 [P0] Trial log is structured JSONL. Evidence: `trials/trial-log.jsonl`.
- [x] CHK-012 [P1] Native blockers are recorded instead of inferred around. Evidence: blocked code graph rows.
- [x] CHK-013 [P1] Docs follow local packet pattern. Evidence: Level 2 anchors and metadata files present.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Prior P0 backlog fix verified: Codex session-start smoke flag. Evidence: `node ...session-start.js --smoke` valid envelope.
- [x] CHK-021 [P0] Prior P0 backlog fix verified: Copilot offline unauthenticated preflight. Evidence: two `SPEC-KIT-COPILOT-CONTEXT` markers emitted.
- [x] CHK-022 [P1] Native code graph results captured. Evidence: seven code graph rows in `trials/trial-log.jsonl`.
- [x] CHK-023 [P1] Native advisor results captured. Evidence: three S-HK-02 rows, all correct.
- [x] CHK-024 [P1] Compaction recovery formatting captured. Evidence: one partial S-HK-04 row.
- [x] CHK-025 [P0] Strict validation passes. Evidence: `validate.sh --strict` exit 0 after packet authoring.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded. Evidence: code graph findings classified as `product-failure-mode`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: scope policy, scan persistence, structural indexer, query drift detector listed in `plan.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: day-to-day graph users and startup/resume consumers listed in `plan.md`.
- [x] CHK-FIX-004 [P0] Algorithm invariant identified. Evidence: zero-node scans must not overwrite populated graph state without warning or rejection.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Evidence: `implementation-summary.md` records 13 native rows.
- [x] CHK-FIX-006 [P1] Hostile state variant documented. Evidence: scope mismatch and parser crash state transitions captured.
- [x] CHK-FIX-007 [P1] Evidence is pinned to packet-local raw files or trial log values. Evidence: `trials/raw/` and `trials/trial-log.jsonl`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: raw files contain no tokens.
- [x] CHK-031 [P0] Authenticated runtime state not copied into docs. Evidence: advisor raw files contain probe outputs only.
- [x] CHK-032 [P1] Deferred runtime campaign stays scoped. Evidence: plugin/runtime integration marked deferred.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: same 13 native measurements across docs.
- [x] CHK-041 [P1] Native-derived backlog includes file paths. Evidence: `synthesis-report-native-rerun.md`.
- [x] CHK-042 [P2] Synthesis updated. Evidence: code graph OVERHEAD, hooks USEFUL, plugin/runtime DEFERRED.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Trial artifacts are packet-local. Evidence: `trials/` subfolder.
- [x] CHK-051 [P1] Raw advisor probe placeholders are packet-local. Evidence: `trials/raw/advisor-*.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06
<!-- /ANCHOR:summary -->
