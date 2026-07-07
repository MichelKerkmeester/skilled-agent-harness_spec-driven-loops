---
title: "Tasks: 078/001 sk-code OpenCode Authoring Recipe"
description: "Task list for Phase 1: scaffold, dispatch cli-codex, validate, commit."
trigger_phrases: ["078/001 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/008-sk-code-authoring"
    last_updated_at: "2026-05-05T17:45:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 1 implementation complete via cli-codex"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-001-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 078/001 sk-code OpenCode Authoring Recipe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |
| `[~]` | In progress |
| `[!]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold 078 parent + 4 phase children via create.sh --phase --phases 4
- [x] T002 Move 078 to skilled-agent-orchestration/ track
- [x] T003 Author 078 parent spec.md (lean: phase decomposition + 4 child manifest)
- [x] T004 Author 078/001 spec.md (12 REQs mapped to 077 finding IDs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Build /tmp/078-001-codex-prompt.md (12 work items + canonical structures)
- [x] T006 Dispatch cli-codex (gpt-5.5/high/fast) via stdin redirection
- [x] T007 Verify cli-codex exit 0 + summary cites all 6 new files + 3 modified files
- [x] T008 Spot-check new files exist + have correct 6-section structure
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 validate.sh --strict on 078/001 → exit 0
- [x] T010 Author 078/001 plan.md, tasks.md, implementation-summary.md
- [ ] T011 Refresh 078/001 description.json + graph-metadata.json
- [ ] T012 git add + commit "feat(sk-code): release v3.2.0.0 — OpenCode authoring recipe foundation (078/001)"
- [ ] T013 git push origin main → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 13 tasks complete
- [ ] validate.sh --strict on 078/001 exits 0
- [ ] One commit on main + push origin/main 0/0 sync
- [ ] sk-code v3.2.0.0 visible in 3 places (SKILL.md, description.json, changelog filename + header)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: 077 deep-research synthesis (research.md)
- Parent: 078-opencode-authoring-recipe (phase parent)
- Successor: 078/002 spec-kit-load (depends on Phase 1 shipping)
- 077 findings closed: F-001-005, F-006-002, F-007-001, F-007-002, F-008-001, F-008-002, F-008-004, F-010-001, F-010-004 (9 P1 findings)
- Changelog: `.opencode/skills/sk-code/changelog/v3.2.0.0.md`
- New assets: `assets/opencode/checklists/{skill,agent,command,mcp_server,spec_folder}_authoring.md` + `assets/opencode/recipes/spec_folder_write.md`
<!-- /ANCHOR:cross-refs -->
