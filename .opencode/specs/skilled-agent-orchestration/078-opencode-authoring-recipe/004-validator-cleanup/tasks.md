---
title: "Tasks: 078/004 system-spec-kit Validator + MCP Tool Registry Cleanup"
description: "Task list for Phase 4: scaffold, dispatch cli-codex, validate, commit. Final phase of 078."
trigger_phrases: ["078/004 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/078-opencode-authoring-recipe/004-validator-cleanup"
    last_updated_at: "2026-05-05T19:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 4 complete; spec docs filled from placeholders"
    next_safe_action: "Commit + push placeholder fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-004-final"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 078/004 system-spec-kit Validator + MCP Tool Registry Cleanup

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

- [x] T001 Author 078/004 spec.md with 13 REQs mapped to 077 finding IDs
- [x] T002 Survey existing validator infrastructure + ROLLOUT_FLAGS context
- [x] T003 Build /tmp/078-004-codex-prompt.md with explicit work items
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch cli-codex (gpt-5.5/high/fast) via stdin redirection
- [x] T005 Codex log stalled mid-thinking but artifacts shipped — verified by direct inspection
- [x] T006 check-graph-metadata-shape.sh + check-description-shape.sh both created + executable
- [x] T007 validator-registry.json has both new rule entries
- [x] T008 ROLLOUT_FLAGS dir entry removed from system-spec-kit/SKILL.md
- [x] T009 mcp-coco-index/SKILL.md MCP Tool Coverage section + version 1.1.0 → 1.1.1
- [x] T010 tool_reference.md telemetry alignment (canonical_resource_boost added)
- [x] T011 changelog/v1.3.1.0.md authored (compact format)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 bash -n on both new rule scripts → PASS
- [x] T013 validate.sh --strict on 078/004 → exit 0 (errors:0 warnings:0)
- [x] T014 validate.sh --strict on 077 (regression check) → exit 0
- [x] T015 Author 078/004 plan.md, tasks.md, implementation-summary.md (caveat fix follow-up)
- [x] T016 Refresh 078/004 description.json + graph-metadata.json
- [x] T017 git add + commit "feat(078/004): final phase — validator shape rules + MCP coverage doc"
- [x] T018 git push origin main → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 18 tasks complete (T015 fixed via follow-up caveat commit)
- [x] validate.sh --strict on 078/004 exits 0
- [x] One commit on main + push origin/main 0/0 sync
- [x] mcp-coco-index v1.1.1 visible in 2 places (SKILL.md, changelog)
- [x] Both new validator rules executable + registered + bash -n clean
- [x] 078 packet 100% closed (4 phases shipped)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: 078/003 mcp-coco-index v1.1.0 (canonical-priority + portability)
- Parent: 078-opencode-authoring-recipe (phase parent)
- Successor: None — final phase of 078
- 077 findings closed: F-001-001, F-002-002 (specifically), F-003-001, F-004-001, F-004-002, F-008-003
- Findings partially-addressed (existing graph-metadata rule covers shape): F-002-001, F-002-003, F-002-004
- Changelog: `.opencode/skills/mcp-coco-index/changelog/v1.3.1.0.md`
- New validator rules: check-graph-metadata-shape.sh + check-description-shape.sh
<!-- /ANCHOR:cross-refs -->
