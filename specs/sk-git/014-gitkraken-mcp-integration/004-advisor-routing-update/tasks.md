---
title: "Tasks: Phase 4: advisor-routing-update"
description: "Task list for updating sk-git's graph-metadata.json and the advisor's explicit-lane boosts."
trigger_phrases:
  - "gitkraken advisor routing tasks"
  - "phase 004 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/004-advisor-routing-update"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase task list ahead of implementation"
    next_safe_action: "Apply the graph-metadata.json and explicit.ts edits"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-advisor-routing-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: advisor-routing-update

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

- [x] T001 Re-read `explicit.ts` `TOKEN_BOOSTS`/`PHRASE_BOOSTS` and confirm no existing `gitkraken`/`gitlens` claim (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Update `sk-git/graph-metadata.json` domains/intent_signals/derived.trigger_phrases (`spec.md` REQ-001)
- [x] T003 [P] Add `TOKEN_BOOSTS.gitkraken` (`spec.md` REQ-002)
- [x] T004 [P] Add `PHRASE_BOOSTS['gitlens launchpad']` (`spec.md` REQ-003)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the vocabulary-agreement vitest suite (`spec.md` REQ-004)
- [x] T006 Run `advisor_rebuild` then `advisor_validate` (`spec.md` REQ-005)
- [x] T007 Run an `advisor_recommend` smoke test with a GitKraken-shaped prompt
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
