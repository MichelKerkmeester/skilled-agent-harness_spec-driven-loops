---
title: "Checklist: Claude Design parity keystone build"
description: "QA checklist for the lean keystone build (shared protocol + skill hooks)."
trigger_phrases:
  - "claude design parity build checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/007-claude-design-parity-build"
    last_updated_at: "2026-06-14T09:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified the keystone build"
    next_safe_action: "Operator reviews; commit when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/references/claude_design_parity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-007-claude-design-parity-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Claude Design parity keystone build

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- Each item verified with evidence (validation output or file inspection).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Hardened 005 keystone (previewImageUrl, no levers) confirmed
- [x] CHK-002 [P1] 006 net-new ideas (reuse/adherence, revision grammar, boundary) confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] Protocol content lives once in the shared reference (no duplication across skills)
- [x] CHK-004 [P1] SKILL.md hooks are minimal pointers, not inlined protocol
- [x] CHK-005 [P1] No ephemeral tracking labels in any doc/code
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] `package_skill.py` valid for sk-design-interface
- [x] CHK-007 [P0] `package_skill.py` valid for mcp-magicpath
- [x] CHK-008 [P0] `validate.sh --strict` green for the packet
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-009 [P0] Fidelity check uses `previewImageUrl`, not a `view`/`share` browser screenshot
- [x] CHK-010 [P0] Fidelity pass/fail gated on `ux_quality_reference.md` + anti-default critique
- [x] CHK-011 [P0] No style presets / named levers / pick-a-vibe anywhere
- [x] CHK-012 [P0] `design_principles.md` content unchanged by this build
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P1] No secrets, network calls, or new dependencies introduced
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P1] Protocol references the existing authorities (design_principles, ux_quality_reference, design_inventory)
- [x] CHK-015 [P1] mcp-magicpath canvas-side rule names the real CLI affordances (previewImageUrl, code status, --revision)
- [x] CHK-016 [P1] SKILL.md size under cap for both skills
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] Protocol lives in `sk-design-interface/references/`; mcp-magicpath references it cross-skill
- [x] CHK-018 [P1] graph-metadata key_files updated for the new reference
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-019 [P0] Shared protocol shipped and consolidates the keystone set
- [x] CHK-020 [P0] Both skills lean, hooked, and valid; anti-default guardrail held
<!-- /ANCHOR:summary -->
