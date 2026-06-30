---
title: "Tasks: Command Documentation Cleanup"
description: "PENDING task list for command doc and runtime mirror sweep."
trigger_phrases:
  - "028 release cleanup commands tasks"
  - "commands cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/006-commands"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed review tasks, all in-scope command docs verified"
    next_safe_action: "Concurrent session owns deep/ and agent_router.md doc edits"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-commands"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Command Documentation Cleanup

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

- [x] T001 Run discovery for command doc and runtime mirror sweep. (28 .opencode/commands .md files, .claude/commands symlinks to .opencode/commands, no .codex/commands)
- [x] T002 Save candidate paths as phase evidence. (19 in-scope .md docs after excluding deep/ and agent_router.md)
- [x] T003 Confirm packet 030 is not in the candidate list. (no packet 030 path in any command doc)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Review every candidate document against current source files. (19 docs read, every referenced path grep-verified to resolve)
- [x] T005 Remove stale file, feature and route claims. (added missing fable-mode route row to doctor/speckit.md, no other drift found)
- [ ] T006 Apply HVR voice edits. DESCOPED for this run: dispatcher scoped work to factual drift only and explicitly forbade wholesale restyle of deliberate prose. Pre-existing em dashes remain in prompt.md, memory/search.md, sk-skill-parent.md, memory/learn.md.
- [x] T007 Keep out-of-scope document families unchanged. (deep/ and agent_router.md untouched, no code or packet 030 edits)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run em dash scan. (pre-existing em dashes found in deliberate prose, none introduced by the edit, voice sweep descoped per T006)
- [x] T009 Run semicolon character scan. (no semicolon or em dash introduced by the doctor/speckit.md edit)
- [x] T010 Run stale-reference scan. (only stale-session feature-name hits in resume.md, not actionable)
- [x] T011 Run strict validation for this child folder. (validate.sh --strict exits 0, RESULT PASSED)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-scope tasks marked `[x]`. (T006 voice sweep DESCOPED per dispatcher, not a blocker for the factual-drift scope)
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification evidence is recorded. (discovery counts, path-resolution scans, fable-mode route diff)
- [x] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
