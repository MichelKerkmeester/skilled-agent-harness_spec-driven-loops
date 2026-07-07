---
title: "Verification Checklist: Real-World Usefulness Test"
description: "Checklist for scaffold validation and the later 012-EXEC empirical campaign."
trigger_phrases:
  - "real-world usefulness checklist"
  - "baseline measurements"
  - "scenario executed"
  - "synthesis report"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/001-usefulness-test-methodology"
    last_updated_at: "2026-05-05T00:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Created scaffold and future execution verification checklist"
    next_safe_action: "Fill strict-validation evidence for scaffold, then leave execution gates pending until 012-EXEC"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:4444444444444444444444444444444444444444444444444444444444444444"
      session_id: "026-007-012-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
# Verification Checklist: Real-World Usefulness Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim execution done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

This checklist has two lanes. Scaffold items can be verified in this packet. Execution items are intentionally pending until the user dispatches 012-EXEC.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-009.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` Architecture, CLI Matrix, and Scoring Rubric sections.
- [x] CHK-003 [P1] Dependencies identified and available for planning. Evidence: `plan.md` Dependencies section lists runtime, corpus, and metric dependencies.
- [ ] CHK-004 [P0] Baseline measurements captured before assisted execution. Evidence: 012-EXEC must attach control trial records.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No production code is modified by the scaffold. Evidence: planned file set is limited to spec docs and parent metadata.
- [x] CHK-011 [P0] No test scenarios executed in this packet. Evidence: `plan.md` and `implementation-summary.md` state execution is deferred.
- [x] CHK-012 [P1] Error handling planned for blocked runtime cells. Evidence: `spec.md` L2 Edge Cases and `plan.md` Dependencies.
- [x] CHK-013 [P1] Scaffold follows project spec patterns. Evidence: Level 2 anchors, frontmatter, and metadata files are present.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Child packet strict validation passes. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning --strict` exited 0 on 2026-05-05.
- [x] CHK-021 [P0] Parent packet strict validation passes. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph --strict` exited 0 on 2026-05-05.
- [x] CHK-022 [P1] Parent metadata contains child id. Evidence: JSON assertion printed `Parent metadata: PASS`.
- [ ] CHK-023 [P1] Edge cases are represented in the execution design. Evidence: `spec.md` L2 Edge Cases.
- [ ] CHK-024 [P1] Execution pass runs each scenario across required CLIs. Evidence: 012-EXEC trial log must show 58 cells with three assisted trials each or approved deferrals.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded or not applicable. Evidence: this is a planning scaffold, not a fix packet.
- [x] CHK-FIX-002 [P0] Same-class producer inventory is planned. Evidence: `plan.md` Affected Surfaces lists producers for execution inventory.
- [x] CHK-FIX-003 [P0] Consumer inventory is planned. Evidence: `plan.md` Affected Surfaces lists runtime consumers.
- [x] CHK-FIX-004 [P0] Algorithm invariant identified. Evidence: usefulness cannot be claimed from relevance alone.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `plan.md` CLI Matrix states 58 cells.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant is not applicable to this scaffold. Evidence: no code or runtime state is executed.
- [x] CHK-FIX-007 [P1] Evidence will be pinned during execution. Evidence: checklist requires file:line citations in the improvement backlog.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: docs include no credentials or private tokens.
- [x] CHK-031 [P0] Input validation approach defined for prompt corpus handling. Evidence: `spec.md` Data Boundaries require redaction and `UNKNOWN` for missing data.
- [x] CHK-032 [P1] Auth/authz not applicable to scaffold. Evidence: no runtime access or external CLI invocation occurs in this packet.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: 12 scenario ids and 7 CLI ids appear consistently across docs.
- [x] CHK-041 [P1] Code comments not applicable. Evidence: no source code is modified.
- [x] CHK-042 [P2] Synthesis report planned. Evidence: `plan.md` Phase 5 and `tasks.md` T206.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files are not stored in the packet. Evidence: no scratch artifacts are required for scaffold.
- [x] CHK-051 [P1] Packet files live under the approved child folder. Evidence: all new child docs are under `011-real-world-usefulness-test-planning/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 12/14 scaffold-time; execution P0 pending by design |
| P1 Items | 12 | 10/12 scaffold-time; execution P1 pending by design |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-05
<!-- /ANCHOR:summary -->
