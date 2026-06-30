---
title: "Tasks: Phase 3: cross-skill-and-code-refs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "sk-prompt-models cross-skill tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/003-cross-skill-and-code-refs"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/003-cross-skill-and-code-refs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: cross-skill-and-code-refs

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

- [x] T001 Update the card-sync guard `.sh` hardcoded `H` path; run the guard to confirm it resolves `sk-prompt-models`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Token-replace across the 8 referencing skills (non-generated files): cli-opencode, deep-loop-workflows, sk-prompt, cli-codex, cli-claude-code, system-spec-kit, deep-loop-runtime, system-skill-advisor
- [x] T003 Update `reviewer-regression.json` `outputsDir`
- [x] T004 [P] Update `secret-scrubber.vitest.ts` fixture string + `executor-config.ts` prose comment
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the secret-scrubber vitest; `rg "sk-prompt-small-model"` over each skill = 0 (minus generated/logs)
- [x] T006 Write implementation-summary.md and refresh continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Card-sync guard resolves the new path
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
