---
title: "Verification Checklist: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-25"
trigger_phrases:
  - "code-graph ccc residue checklist"
  - "ccc doc cleanup verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/014-remediate-codegraph-naming"
    last_updated_at: "2026-05-25T15:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Verified all gates; checklist complete"
    next_safe_action: "Commit the remediation packet to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-codegraph-naming-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001/002/003 + SC-001..004
- [x] CHK-002 [P0] Technical approach defined in plan.md — doc-alignment, grep-gated
- [x] CHK-003 [P1] Dependencies identified and available — none (code already renamed; 013 confirmed)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — N/A (documentation-only; no `.ts`/code touched — verified `rg 'structural search|getstructural' -g '*.ts'` == 0)
- [x] CHK-011 [P0] No console errors or warnings — N/A (no code)
- [x] CHK-012 [P1] Error handling implemented — N/A (no code)
- [x] CHK-013 [P1] Code follows project patterns — docs follow sk-doc README/feature_catalog/playbook conventions; ToC↔heading numbering kept consistent
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — `rg -i ccc` == 0; no dead links; targets exist; full residue sweep 0
- [x] CHK-021 [P0] Manual testing complete — gate greps + ToC/heading consistency checks run (see implementation-summary)
- [x] CHK-022 [P1] Edge cases tested — distinguished legit `structural`/`semantic` (index/intent) from residue `structural search` (renamed ccc); preserved legit, removed residue
- [x] CHK-023 [P1] Error scenarios validated — N/A (no runtime behavior)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (deprecation rename residue) + `cross-consumer` (docs describe deleted code).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the deprecation's `ccc → "structural search"` + `ccc_* → code_graph_* and detect_changes` find-replaces; all instances grep-swept (ccc, structural search, phantom tool, getstructural, semantic-runtime).
- [x] CHK-FIX-003 [P0] Consumer inventory: 13 docs across system-code-graph; each replacement target verified to exist in the real tree (handlers, tools, tests).
- [x] CHK-FIX-004 [P0] Security/path/parser fixes — N/A (no code path touched; verified no `.ts` leakage).
- [x] CHK-FIX-005 [P1] Matrix axes — residue pattern × doc-file; final sweep covers all 6 patterns.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — N/A (docs).
- [x] CHK-FIX-007 [P1] Evidence pinned to the doc edits in this packet (uncommitted working tree at time of verification).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none added (doc text only)
- [x] CHK-031 [P0] Input validation implemented — N/A (no code)
- [x] CHK-032 [P1] Auth/authz working correctly — N/A (no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec scope + Files-to-Change reconciled to the 13 edited files incl second-wave expansion; tasks marked complete
- [x] CHK-041 [P1] Code comments adequate — N/A (no code)
- [x] CHK-042 [P2] README updated — `system-code-graph/README.md` + `SKILL.md` + `ARCHITECTURE.md` updated to reality
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files created
- [x] CHK-051 [P1] scratch/ cleaned before completion — empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-25
<!-- /ANCHOR:summary -->
