---
title: "Tasks: 078/003 mcp-coco-index Canonical-Priority + Portability"
description: "Task list for Phase 3: scaffold, dispatch cli-codex, py_compile + validate, commit."
trigger_phrases: ["078/003 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/078-opencode-authoring-recipe/003-coco-priority"
    last_updated_at: "2026-05-05T18:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 3 implementation + verification complete"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-003-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 078/003 mcp-coco-index Canonical-Priority + Portability

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

- [x] T001 Author 078/003 spec.md with 14 REQs mapped to 077 finding IDs
- [x] T002 Survey mcp-coco-index settings.py + query.py to identify insertion points
- [x] T003 Build /tmp/078-003-codex-prompt.md with explicit Python edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch cli-codex (gpt-5.5/high/fast) via stdin redirection
- [x] T005 Verify cli-codex exit 0 + summary cites all 5 modified files + 1 new changelog
- [x] T006 py_compile syntax check on all 4 modified Python files → PASS
- [x] T007 Codex venv'd manual verification (round-trip + canonical matcher + ranking boost) → PASS
- [!] T008 pytest tests/test_settings.py — BLOCKED in Claude shell (missing mcp + cocoindex deps); codex venv test PASS is the signal
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 validate.sh --strict on 078/003 → exit 0 (errors:0 warnings:0)
- [x] T010 alignment-verifier on sk-code → PASS
- [x] T011 Author 078/003 plan.md, tasks.md, implementation-summary.md
- [ ] T012 Refresh 078/003 description.json + graph-metadata.json
- [ ] T013 git add + commit "feat(mcp-coco-index): release v1.1.0 — canonical-priority + portability (078/003)"
- [ ] T014 git push origin main → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 14 tasks complete (T008 acknowledged-blocked is the exception, not a failure)
- [ ] validate.sh --strict on 078/003 exits 0
- [ ] One commit on main + push origin/main 0/0 sync
- [ ] mcp-coco-index v1.1.0 visible in 2 places (SKILL.md, changelog)
- [ ] CANONICAL_RESOURCE_PATHS + canonical_resource_paths + canonical_resource_boost all live in code
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: 078/002 sk-code v3.2.1.0 (cross-skill authoring-time load)
- Parent: 078-opencode-authoring-recipe (phase parent)
- Successor: 078/004 validator-cleanup (depends on canonical paths being live)
- 077 findings closed: F-001-002, F-005-001, F-005-002, F-005-004, F-007-005, F-008-005, F-009-003, F-009-004 (3 P1 + 5 P2 findings)
- Changelog: `.opencode/skills/mcp-coco-index/changelog/v1.3.0.0.md`
- Modified files: settings.py + query.py + indexer.py + test_settings.py + SKILL.md
<!-- /ANCHOR:cross-refs -->
