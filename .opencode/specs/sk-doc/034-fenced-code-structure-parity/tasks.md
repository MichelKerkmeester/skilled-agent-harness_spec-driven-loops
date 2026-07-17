---
title: "Tasks: Fenced Code Block Structure Parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fence fix tasks"
  - "template parity tasks"
  - "swallowed section tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/034-fenced-code-structure-parity"
    last_updated_at: "2026-07-17T13:56:23.385Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown for the four template fence fixes"
    next_safe_action: "Run strict validation and refresh packet metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-readme/assets/install_guide_template.md"
      - ".opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md"
      - ".opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md"
      - ".opencode/skills/sk-git/assets/pr-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-034-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fenced Code Block Structure Parity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run a fence-aware diagnostic mapping every fence open/close in the four templates [Test: `fence-aware diagnostic scan`]
- [x] T002 Read each malformed region to confirm the intended example boundary [File: `install_guide_template.md:271-347`]
- [x] T003 [P] Classify each fix as widen-to-4-backticks or rebalance-orphan [Source: `CommonMark fenced-code rule`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Widen the §5 scaffold example fence, open and true close, to 4 backticks (parent_skill_hub_template.md) [File: `parent_skill_hub_template.md:119,266`]
- [x] T005 Widen the §4 structure example fence to 4 backticks (skill_asset_template.md) [File: `skill_asset_template.md:234,301`]
- [x] T006 Widen the §12 breaking-changes example fence to 4 backticks (pr-template.md) [File: `pr-template.md:421,439`]
- [x] T007 Widen the six §7 error-example fences to 4 backticks (install_guide_template.md) [File: `install_guide_template.md:277-347`]
- [x] T008 Wrap the §13 COMPLETE TEMPLATE example in one 4-backtick fence (install_guide_template.md) [File: `install_guide_template.md:599`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run the fence-aware scan on all four files (sequential real sections, none swallowed, none unclosed) [Test: `fence-aware scan`]
- [x] T010 Run `validate_document.py` on all four files (valid, 0 errors, 0 warnings)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fence-aware scan and validator both clean on all four files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
