---
title: "Tasks: Phase 3: sk-git-integration-doc-and-router"
description: "Task list for authoring the GitKraken MCP reference doc and updating sk-git's router."
trigger_phrases:
  - "gitkraken mcp doc tasks"
  - "phase 003 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/007-gitkraken-mcp-integration/003-sk-git-integration-doc-and-router"
    last_updated_at: "2026-07-14T20:50:40Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase task list ahead of implementation"
    next_safe_action: "Write the reference doc, then update SKILL.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/gitkraken_mcp_integration.md"
      - ".opencode/skills/sk-git/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-sk-git-integration-doc-and-router"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: sk-git-integration-doc-and-router

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

- [x] T001 Re-read `references/github_mcp_integration.md` as the structural mirror source (`.opencode/skills/sk-git/references/github_mcp_integration.md`)
- [x] T002 Re-read `SKILL.md` router section, keyword-triggers list, §4 RULES, and §5 REFERENCES before editing (`.opencode/skills/sk-git/SKILL.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write `references/gitkraken_mcp_integration.md` with Overview, Tool Selection Guide, Available Tools, Usage Examples, Error Handling, safety carve-out (`spec.md` REQ-001)
- [x] T004 Add `GITKRAKEN_MCP` to `INTENT_SIGNALS` and `RESOURCE_MAP` in `SKILL.md`'s router pseudocode (`spec.md` REQ-002)
- [x] T005 Add `gitkraken`/`gitlens` to §1 "Owned (route here)" keyword triggers (`spec.md` REQ-002)
- [x] T006 [P] Add the references-table row in §5 REFERENCES (`spec.md` REQ-003)
- [x] T007 [P] Add the local-git-mutation safety rule in §4 RULES (`spec.md` REQ-004)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `validate.sh` on this phase folder
- [x] T009 Grep-confirm new router/trigger/rule text exists in `SKILL.md`
- [x] T010 Manually compare the new doc's section headers against `github_mcp_integration.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — `verified`
- [x] No `[B]` blocked tasks remaining — `verified`
- [x] `checklist.md` evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
