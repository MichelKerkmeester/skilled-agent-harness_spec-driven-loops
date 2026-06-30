---
title: "Tasks: Claude Design parity keystone build"
description: "Task breakdown for the lean keystone build (shared protocol + skill hooks). All tasks complete."
trigger_phrases:
  - "claude design parity build tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/007-claude-design-parity-build"
    last_updated_at: "2026-06-14T09:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All build tasks complete"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Claude Design parity keystone build

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Confirm the hardened 005 + 006 combined keystone set
- [x] Scaffold the 007 packet + register in the 148 parent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Author `sk-design-interface/references/claude_design_parity.md` (the shared protocol)
- [x] Hook `sk-design-interface` SKILL.md (Core References + resource-loading row) + graph-metadata key_files
- [x] Hook `mcp-magicpath` SKILL.md (resource-loading row + canvas-side ALWAYS rule)
- [x] Confirm the fidelity mechanism is `previewImageUrl`, gated on the quality floor + anti-default critique
- [x] Confirm no style presets / named levers; `design_principles.md` untouched
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py` valid for both skills; SKILL.md under cap
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Shared protocol present and consolidates the keystone set
- [x] Both skills hooked, lean, and valid
- [x] Fidelity check `previewImageUrl`-based with the browser-test caveat
- [x] Anti-default guardrail held (no presets/levers); `design_principles.md` unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Shared protocol: `.opencode/skills/sk-design-interface/references/claude_design_parity.md`
- Source: `../005-claude-design-parity-research/` (hardened) + `../006-competitor-design-tools-research/`
- Consumer skill: `.opencode/skills/mcp-magicpath/`
<!-- /ANCHOR:cross-refs -->
