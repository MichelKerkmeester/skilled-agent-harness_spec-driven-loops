---
title: "Tasks: Phase 017 - design_proof_token.md Relocation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 017 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/017-design-proof-token-relocation"
    last_updated_at: "2026-07-07T04:24:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All tasks completed"
    next_safe_action: "Write implementation-summary.md, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-proof-token-relocation-017"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 017 - design_proof_token.md Relocation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Repo-wide grep for `design_proof_token` across `.md`/`.json`/`.yaml`/`.txt`
- [x] T002 Read `design_proof_token.md` in full to rule out breaking internal relative links
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `git mv` `.opencode/skills/sk-design/references/design_proof_token.md` -> `.opencode/skills/sk-design/shared/design_proof_token.md`
- [x] T004 Remove the emptied `.opencode/skills/sk-design/references/` folder
- [x] T005 Repoint `hub-router.json` `defaultResource` entry; bump version 1.2.0.0 -> 1.2.1.0
- [x] T006 [P] Repoint `shared/assets/proof_of_application_card.md`
- [x] T007 [P] Repoint `shared/assets/context_loaded_card.md`
- [x] T008 [P] Repoint `mcp-open-design/references/cli_child_pairing.md`
- [x] T009 [P] Repoint `mcp-open-design/references/guarded_proxy.md` (2 occurrences)
- [x] T010 [P] Repoint `mcp-open-design/references/freshness_invalidation.md` (anchor preserved)
- [x] T011 [P] Repoint `mcp-open-design/references/inner_generator_binding.md` (2 occurrences, 1 anchor preserved)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Repo-wide grep confirms zero live stale hits (only changelog/review/closed-phase historical mentions remain)
- [x] T013 `python3 -c "import json; json.load(...)"` on `hub-router.json`
- [x] T014 Router-mode skill-benchmark re-run: D5 connectivity 100/100, verdict PASS
- [x] T015 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Grep sweep and D5 gate both confirm the move is clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
