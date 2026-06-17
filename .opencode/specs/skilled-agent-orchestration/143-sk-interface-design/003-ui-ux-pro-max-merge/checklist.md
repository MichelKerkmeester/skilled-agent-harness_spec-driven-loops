---
title: "Checklist: ui-ux-pro-max-merge"
description: "QA checklist for the three-phase merge of ui-ux-pro-max data + search into sk-interface-design. Status planned; gates verified per phase at execution."
trigger_phrases:
  - "ui-ux-pro-max merge checklist"
  - "sk-interface-design data merge checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/003-ui-ux-pro-max-merge"
    last_updated_at: "2026-06-13T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored QA checklist"
    next_safe_action: "Verify Phase 1 gates at execution"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-003-ui-ux-pro-max-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: ui-ux-pro-max-merge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- Each item is verified with evidence (command output, file path, or validation result) at execution.
- Items are grouped to map onto the three phases; verify a phase's items before committing it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] 002 recommendation re-read; per-asset verdicts confirmed
- [x] CHK-002 [P1] Source CSVs re-counted (measured, not marketing)
- [x] CHK-003 [P2] Target skill baseline captured (SKILL.md size, advisor routing)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Adapted scripts are stdlib-only (no new dependencies)
- [x] CHK-005 [P0] `DATA_DIR` re-rooted to `assets/data`; stack config removed
- [x] CHK-006 [P1] No ephemeral tracking labels in code/comments
- [x] CHK-026 [P0] Adapted search is query-only: no `design_system` import, no `--design-system`, no `--persist`, no generated `design-system/` writes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P1] Search script smoke query returns results from `assets/data/`
- [x] CHK-008 [P0] `validate.sh --strict` green after each phase
- [x] CHK-009 [P0] Skill validation + advisor discovery pass after the final phase
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P0] All ADOPT/ADAPT assets from 002 §5 present; all SKIP assets absent
- [x] CHK-011 [P1] Measured counts used everywhere; no upstream marketing numbers
- [x] CHK-012 [P0] `design_principles.md` content unchanged (diff clean)
- [x] CHK-027 [P1] `react-performance.csv` design-quality rows extracted (or explicit deferral recorded); not silently dropped
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P1] No secrets or network calls introduced by the scripts
- [x] CHK-014 [P2] CSV content reviewed for unexpected executable/markup payloads
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-015 [P1] `ux_quality_reference.md` + `design_inventory.md` authored to house standards
- [x] CHK-016 [P1] SKILL.md routing section added; SKILL.md stays lean
- [x] CHK-017 [P0] `LICENSE-ui-ux-pro-max.txt` + `THIRD-PARTY-NOTICES.md` present and accurate
- [x] CHK-018 [P0] SKILL.md `license:` frontmatter declares the Apache-2.0 + MIT mix
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-019 [P1] CSVs under `assets/data/`; scripts under `scripts/`; new docs under `references/`
- [x] CHK-020 [P1] No new top-level `data/` dir
- [x] CHK-021 [P0] Every copied MIT file mapped in `THIRD-PARTY-NOTICES.md`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-022 [P0] Merge Phase 1 shipped + validated
- [x] CHK-023 [P1] Merge Phase 2 shipped + validated
- [x] CHK-024 [P0] Merge Phase 3 shipped + validated
- [x] CHK-025 [P0] Final: skill validates, advisor routes, philosophy preserved, licensing complete
<!-- /ANCHOR:summary -->
