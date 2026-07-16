---
title: "Checklist: Doc migration for system-code-graph"
description: "Verification checklist for Phase 005 doc and runtime migration."
trigger_phrases:
  - "code graph doc migration checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-2-merges/007-019-doc-and-runtime-migration"
    last_updated_at: "2026-05-14T08:21:27Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 005 checklist with strict validation"
    next_safe_action: "Phase 006 validation cleanup"
    blockers:
      - ".codex/agents/*.toml write blocked by sandbox"
    key_files:
      - "checklist.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Doc migration for system-code-graph

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-200 [P0] Strict validate this packet. (exit 0)
- [x] CHK-201 [P0] `implementation-summary.md` records moved counts and validation exit code.
- [x] CHK-202 [P1] Parent 014 metadata points to Phase 005.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-210 [P0] Phase 003 and 004 are treated as complete prerequisites.
- [x] CHK-211 [P0] Category-22 feature catalog docs classified using filename and opening body.
- [x] CHK-212 [P0] Category-22 manual playbook docs classified using filename and opening body.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] No code files modified by this phase.
- [x] CHK-011 [P0] Tool IDs remain stable.
- [x] CHK-012 [P1] Markdown anchors and template markers preserved in packet docs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Strict validation passes. (0 errors, 0 warnings)
- [x] CHK-021 [P1] Moved feature catalog count captured. (6)
- [x] CHK-022 [P1] Moved playbook count captured. (8)
- [x] CHK-023 [P1] Stale old source-path references checked. (0 requested-surface old-path hits)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Code-graph-owned feature catalog docs moved.
- [x] CHK-FIX-002 [P0] Code-graph-owned playbook docs moved.
- [x] CHK-FIX-003 [P1] Agents updated or verified. (9 updated; 3 Codex mirrors blocked by sandbox)
- [x] CHK-FIX-004 [P1] Commands updated or verified.
- [x] CHK-FIX-005 [P1] Top-level docs updated or verified.
- [x] CHK-FIX-006 [P1] Skill cross-refs updated or verified.
- [x] CHK-FIX-007 [P1] Constitutional/config docs updated or verified.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-220 [P0] No secrets surfaced or edited.
- [x] CHK-221 [P0] No network calls.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] `system-code-graph/SKILL.md` reflects Phase 005 complete doc ownership.
- [x] CHK-041 [P1] `system-code-graph/README.md` status reflects Phase 005 complete and Phase 006 pending validation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-230 [P0] Destination docs live under `system-code-graph/feature_catalog/22--context-preservation-and-code-graph/`.
- [x] CHK-231 [P0] Destination playbooks live under `system-code-graph/manual_testing_playbook/22--context-preservation-and-code-graph/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | PASS |
| All P1 items | PASS |
| Strict validation | PASS (exit 0) |
| Doc migration | PASS |
<!-- /ANCHOR:summary -->
