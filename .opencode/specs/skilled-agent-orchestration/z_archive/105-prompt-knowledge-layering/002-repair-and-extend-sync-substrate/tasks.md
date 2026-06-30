---
title: "Tasks: Phase 2 — Repair + extend sync substrate"
description: "Task tracking for rewriting check-prompt-quality-card-sync.sh as a duplication guard and fixing the broken path reference in cli_prompt_quality_card.md."
trigger_phrases:
  - "repair sync substrate tasks"
  - "duplication guard tasks"
  - "check-prompt-quality-card-sync tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
    last_updated_at: "2026-06-02T18:04:11Z"
    last_updated_by: "completion-agent"
    recent_action: "All tasks complete"
    next_safe_action: "Phase 006 turns guard GREEN"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: repair-and-extend-sync-substrate

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

- [x] T001 Read existing check-prompt-quality-card-sync.sh and understand the 3-mirror hash-comparison logic (.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh)
- [x] T002 Read cli_prompt_quality_card.md Mirror Sync section to locate the broken path reference (.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md)
- [x] T003 [P] Enumerate all 5 cli-* quality card paths to confirm they exist on disk
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite check-prompt-quality-card-sync.sh — replace hash comparison with grep-based duplication guard covering all 5 cli-* cards (.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh)
- [x] T005 Add framework-table header pattern (`| Framework | Best for | Complexity band |`) as the first grep target
- [x] T006 Add CLEAR-table header pattern (`| Dimension | Floor | Pre-dispatch question |`) as the second grep target
- [x] T007 Implement fail-closed logic: MISSING cards count as failures; any FAIL card sets overall exit to 1; exit 0 only when all 5 pass
- [x] T008 Fix broken checker-path reference in cli_prompt_quality_card.md Mirror Sync section (.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `bash -n check-prompt-quality-card-sync.sh` to confirm script has no syntax errors
- [x] T010 Run guard against live repo — confirm it exits 1 and emits FAIL for 4 cards still inlining the tables
- [x] T011 Confirm guard emits PASS for the one card that does not inline the tables
- [x] T012 Verify corrected path in cli_prompt_quality_card.md resolves to the real script on disk
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
