---
title: "Tasks: mcp-magicpath"
description: "Task tracking for vendoring the MagicPath skill into .opencode/skills/mcp-magicpath and registering it."
trigger_phrases:
  - "magicpath tasks"
  - "install magicpath"
  - "mcp-magicpath"
  - "skill install tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-mcp-magicpath"
    last_updated_at: "2026-06-13T11:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task list for mcp-magicpath install"
    next_safe_action: "Run validate.sh --strict then generate-context.js"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-magicpath/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-147-mcp-magicpath"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: mcp-magicpath

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

- [x] T001 Confirm install target + skill name with operator (framework, `mcp-magicpath`)
- [x] T002 Download upstream skill files and verify SHA parity (`/tmp/magicpath-dl`)
- [x] T003 Scaffold spec folder 147 (`.opencode/specs/skilled-agent-orchestration/147-mcp-magicpath/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Place SKILL.md + 3 references (`.opencode/skills/mcp-magicpath/`)
- [x] T005 Adapt SKILL.md frontmatter: `name: mcp-magicpath` + house keywords line (`.opencode/skills/mcp-magicpath/SKILL.md`)
- [x] T006 Author house README.md (`.opencode/skills/mcp-magicpath/README.md`)
- [x] T007 Author schema-2 graph-metadata.json (`.opencode/skills/mcp-magicpath/graph-metadata.json`)
- [x] T008 Author + run scripts/install.sh; global CLI install (`.opencode/skills/mcp-magicpath/scripts/install.sh`)
- [x] T009 Update catalog index: row + counts (`.opencode/skills/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 sk-doc readme validator reports 0 issues
- [x] T011 skill_graph_scan + validate (0 errors) + advisor_recommend (top match, Gate 2 pass)
- [x] T012 validate.sh --strict on the spec folder; refresh metadata via generate-context.js
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (`magicpath-ai --version` resolves)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
