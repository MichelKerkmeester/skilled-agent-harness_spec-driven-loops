---
title: "Tasks: Standardize the mcp-* skills into the install-guide and doctor system"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp skill standardization tasks"
  - "doctor.sh tasks"
  - "install guide tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-skill-install-doctor-standardization"
    last_updated_at: "2026-06-15T06:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implementation tasks complete; verification and commit pending"
    next_safe_action: "Run validate.sh --strict, then scoped commit, then stop for review"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/INSTALL_GUIDE.md"
      - ".opencode/skills/mcp-click-up/scripts/doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-mcp-skill-install-doctor-standardization"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Standardize the mcp-* skills into the install-guide and doctor system

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Scope the install/doctor gap matrix across the five mcp skills
- [x] T002 Create packet 153 at Level 2 to satisfy Gate 3
- [x] T003 Provider preflight for the gpt-5.5-fast write seats (`opencode providers list`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Promote mcp-figma to 1.0.0.0 across SKILL.md, INSTALL_GUIDE.md, references, playbook (`.opencode/skills/mcp-figma/`)
- [x] T005 Rewrite the mcp-figma changelog as the 1.0.0.0 release (`.opencode/skills/mcp-figma/changelog/v1.0.0.0.md`)
- [x] T006 [P] Author mcp-open-design `scripts/{_common.sh,install.sh,doctor.sh}` (gpt-5.5 seat)
- [x] T007 Author the mcp-open-design INSTALL_GUIDE.md (`.opencode/skills/mcp-open-design/INSTALL_GUIDE.md`)
- [x] T008 [P] Author mcp-chrome-devtools `scripts/doctor.sh` (gpt-5.5 seat)
- [x] T009 [P] Author mcp-click-up `scripts/doctor.sh` (gpt-5.5 seat)
- [x] T010 Add `cli_skill_diagnostics:` to the central doctor and a router note (`.opencode/commands/doctor/`)
- [x] T011 Cross-reference mcp-figma in mcp-open-design and sk-design-interface (README, SKILL.md, graph-metadata)
- [x] T012 Add the mcp-open-design `mcp-servers/open-design` pointer doc
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `bash -n` all new scripts and `chmod +x` them
- [x] T014 Host fact-check generated scripts (bdg, cupt, od paths); fixed the click-up manual grep
- [x] T015 `package_skill --check` on mcp-figma and mcp-open-design; house-voice and comment-hygiene sweep
- [ ] T016 `validate.sh --strict` on this packet, then scoped commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Generated scripts verified against real sources
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
