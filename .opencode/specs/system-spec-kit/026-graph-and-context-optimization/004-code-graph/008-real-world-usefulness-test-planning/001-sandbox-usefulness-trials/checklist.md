---
title: "Verification Checklist: Real-World Usefulness Test Execution"
description: "Checklist for trial execution, synthesis, deferred cell documentation, and strict validation."
trigger_phrases:
  - "real-world usefulness execution"
  - "026/007/012/001"
  - "usefulness synthesis"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/001-sandbox-usefulness-trials"
    last_updated_at: "2026-05-06T04:35:32.335Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Verified local trial artifacts and deferred runtime gaps"
    next_safe_action: "Review synthesis gaps or rerun deferred live runtime cells"
    blockers:
      - "Authenticated/networked external CLI runtimes unavailable in sandbox"
      - "Claude Code and OpenCode native live sessions unavailable from sandbox"
    key_files:
      - "checklist.md"
      - "analysis/aggregated-metrics.md"
      - "synthesis-report.md"
    session_dedup:
      fingerprint: "sha256:0260070120010260070120010260070120010260070120010260070120010260"
      session_id: "026-007-012-001-sandbox-usefulness-trials"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved for this execution packet."
---
# Verification Checklist: Real-World Usefulness Test Execution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim execution done until complete |
| **[P1]** | Required | Must complete OR get documented deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-008.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` Completed/Deferred cells tables.
- [x] CHK-003 [P1] Dependencies identified. Evidence: `plan.md` Dependencies table.
- [x] CHK-004 [P0] Parent packet docs read first. Evidence: execution notes in `implementation-summary.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No production source code modified. Evidence: packet files only plus parent graph metadata.
- [x] CHK-011 [P0] Raw outputs are preserved. Evidence: `trials/raw/` and `trials/control/`.
- [x] CHK-012 [P1] Runtime blockers recorded instead of fabricated. Evidence: `synthesis-report.md` Deferred Cells.
- [x] CHK-013 [P1] Specs follow project packet pattern. Evidence: Level 2 anchors and metadata files present.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Automatable cells run. Evidence: 36 completed assisted rows with non-zero usefulness.
- [x] CHK-021 [P0] Controls captured. Evidence: 35 control rows in `trials/trial-log.jsonl`.
- [x] CHK-022 [P1] Aggregation generated. Evidence: `analysis/aggregated-metrics.md`.
- [x] CHK-023 [P1] Per-scenario deltas generated. Evidence: `analysis/per-scenario-deltas.md`.
- [x] CHK-024 [P0] Strict validation passes. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/001-sandbox-usefulness-trials --strict` exited 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded or not applicable. Evidence: execution packet, not a production fix.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `plan.md` Affected Surfaces.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for measured/deferred surfaces. Evidence: `plan.md` Deferred Cells.
- [x] CHK-FIX-004 [P0] Algorithm invariant identified. Evidence: usefulness cannot be claimed from relevance alone.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Evidence: `plan.md` Completed/Deferred cells.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant documented as unavailable. Evidence: external CLI blocked rows.
- [x] CHK-FIX-007 [P1] Evidence is pinned to packet-local raw files. Evidence: trial-log raw_output_path fields.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: external CLI auth failures are described without token material.
- [x] CHK-031 [P0] Prompt corpus uses local labeled prompts only. Evidence: `labeled-prompts.jsonl` rows are referenced by id.
- [x] CHK-032 [P1] Runtime auth gaps are not bypassed. Evidence: Copilot/Gemini cells deferred.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: same completed/deferred counts across docs.
- [x] CHK-041 [P1] Improvement backlog includes file:line citations. Evidence: `synthesis-report.md`.
- [x] CHK-042 [P2] Synthesis report written. Evidence: `synthesis-report.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Trial artifacts are packet-local. Evidence: `trials/` subfolder.
- [x] CHK-051 [P1] Generated analysis is packet-local. Evidence: `analysis/` subfolder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06
<!-- /ANCHOR:summary -->
