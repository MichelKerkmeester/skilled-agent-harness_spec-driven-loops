---
title: "Tasks: 078/002 /spec_kit:complete Authoring-Time sk-code Load"
description: "Task list for Phase 2: scaffold, dispatch cli-codex, validate, commit."
trigger_phrases: ["078/002 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/078-opencode-authoring-recipe/002-spec-kit-load"
    last_updated_at: "2026-05-05T18:10:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 implementation + verification complete"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-002-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 078/002 /spec_kit:complete Authoring-Time sk-code Load

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

- [x] T001 Author 078/002 spec.md with 13 REQs mapped to 077 finding IDs
- [x] T002 Survey existing /spec_kit:complete YAMLs to identify insertion points
- [x] T003 Build /tmp/078-002-codex-prompt.md with explicit insertion patterns (auto + confirm symmetric)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch cli-codex (gpt-5.5/high/fast) via stdin redirection
- [x] T005 Verify cli-codex exit 0 + summary cites all 5 modified files + 1 new changelog
- [x] T006 YAML parseability check (auto + confirm) → both PASS
- [x] T007 REQ greps: 8/8 REQ-001..REQ-008 verified (REQ-004 used case-insensitive)
- [x] T008 alignment-verifier on sk-code → PASS (24 files, 0 findings)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 validate.sh --strict on 078/002 → exit 0 (errors:0 warnings:0)
- [x] T010 Author 078/002 plan.md, tasks.md, implementation-summary.md
- [ ] T011 Refresh 078/002 description.json + graph-metadata.json
- [ ] T012 git add + commit "feat(sk-code): release v3.2.1.0 — cross-skill authoring-time load contract (078/002)"
- [ ] T013 git push origin main → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 13 tasks complete
- [ ] validate.sh --strict on 078/002 exits 0
- [ ] One commit on main + push origin/main 0/0 sync
- [ ] sk-code v3.2.1.0 visible in 3 places (SKILL.md, description.json, changelog)
- [ ] Both /spec_kit:complete YAMLs reference sk-code authoring-time load
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: 078/001 sk-code v3.2.0.0 (Phase 1 foundation)
- Parent: 078-opencode-authoring-recipe (phase parent)
- Successor: 078/003 coco-priority (depends on Phase 2 doc-as-source-of-truth)
- 077 findings closed: F-009-001, F-009-002, F-008-004, F-006-004 (4 P1 findings)
- Changelog: `.opencode/skills/sk-code/changelog/v3.2.1.0.md`
- Modified files: 4 (2 YAMLs + 2 SKILL.md) + 1 description.json + 1 new changelog
<!-- /ANCHOR:cross-refs -->
