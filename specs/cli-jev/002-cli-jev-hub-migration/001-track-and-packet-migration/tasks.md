---
title: "Tasks: Phase 1: track-and-packet-migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/001-track-and-packet-migration"
    last_updated_at: "2026-09-20T13:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Task list authored at closeout from the executed move"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-001-track-and-packet-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: track-and-packet-migration

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Capture the pre-move baseline: `git status --porcelain` and the reference census for the old spec path (repo root)
- [x] T002 Record the old-path census by string form: 150 specs-prefixed, 22 track-prefixed, 14 bare (repo root)
- [x] T003 [P] Confirm the target track root is empty and untracked (`specs/cli-jev`, `git ls-files specs/cli-jev`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move the packet: `git mv specs/cli-external-orchestration/074-cli-jev-creation specs/cli-jev/001-cli-jev-creation`
- [x] T005 Author the track description (`specs/cli-jev/description.json`)
- [x] T006 Author the track graph metadata declaring both children (`specs/cli-jev/graph-metadata.json`)
- [x] T007 Hand-fix the packet metadata the repair tool refuses: description `specFolder`/`parentChain` and the goal and acceptance-criteria pointers across the parent and its five children (`specs/cli-jev/001-cli-jev-creation/**`)
- [x] T008 Run the derived repair pass: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs/cli-jev --apply`
- [x] T009 Rewrite the citations over live trees in one ordered substitution pass, 36 files: the moved packet, the skill-side cli-jev docs and the two generated retrieval surfaces (`specs/cli-jev/**`, `.skilled/skills/cli-external-orchestration/cli-jev/**`)
- [x] T010 Regenerate the trigger index (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/trigger-index.json`)
- [x] T011 Regenerate the retrieval fixtures so no fixture embeds the retired path (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/**`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the recursive strict gate on both packets and record the printed result (`specs/cli-jev/001-cli-jev-creation`, `specs/cli-jev/002-cli-jev-hub-migration`)
- [x] T013 [P] Run the zero-hit census for `cli-external-orchestration/074-cli-jev-creation` over live trees and the track-root sweep, and record that `cli-jev` reports `declared=2 actual=2` (repo root)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
