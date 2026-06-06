---
title: "Tasks: cli-cross-rcaf-propagation"
description: "Tracks completed packet 113/006 work for propagating medium pre-planning density guidance across the CLI prompt quality cards."
trigger_phrases:
  - "113/006 propagation tasks"
  - "medium pre plan card tasks"
  - "cross cli card mirror tasks"
  - "rcaf propagation task list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
    last_updated_at: "2026-05-17T12:18:18Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-completed-task-state"
    next_safe_action: "use-113-007-for-held-validation-findings"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/cli-claude-code/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-codex/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-gemini/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All packet 113/006 implementation tasks are complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cross-rcaf-propagation

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Confirm 113/003 eval-loop finding source and propagation boundary
- [x] T002 Verify RCAF is already present in the master card and four sibling mirrors
- [x] T003 Define held scope for bundle-gate-aversion and anti-hallucination findings
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add medium pre-planning density guidance to `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`
- [x] T005 Mirror the note into `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md`
- [x] T006 Mirror the note into `.opencode/skills/cli-codex/assets/prompt_quality_card.md`
- [x] T007 Mirror the note into `.opencode/skills/cli-gemini/assets/prompt_quality_card.md`
- [x] T008 Mirror the note into `.opencode/skills/cli-opencode/assets/prompt_quality_card.md`
- [x] T009 Bump sibling SKILL.md versions for cli-claude-code, cli-codex, cli-gemini, and cli-opencode
- [x] T010 Add sibling changelog entries for v1.1.6.0, v1.4.3.0, v1.2.6.0, and v1.3.2.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirm no packet 113/007 held findings were added to CLI prompt cards
- [x] T012 Confirm the packet records RCAF as already present rather than newly introduced
- [x] T013 Fill Level 3 packet documentation for completed work
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed for packet scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
