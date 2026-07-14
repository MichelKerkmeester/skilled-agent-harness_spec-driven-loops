---
title: "Tasks: Phase 6: advisor-and-integration"
description: "Task list for the class-aware referrer sweep, reciprocal-edge repoint, graph regeneration, and CI card-sync gate."
trigger_phrases:
  - "advisor integration tasks"
  - "cli referrer sweep tasks"
  - "skill graph regeneration tasks"
  - "phase 006 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the referrer-sweep task list"
    next_safe_action: "Execute the sweep after phase 005"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: advisor-and-integration

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

- [ ] T001 Confirm phase 005 landed; load the phase 001 breakage-class taxonomy
- [ ] T002 Re-run the referrer grep sweep for the old flat paths against the live worktree
- [ ] T003 [P] Confirm the advisor rebuild/compiler command is available
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Repoint the `skill_advisor.py` alias maps and the literal `.opencode/skills/cli-claude-code` path key to the hub layout
- [ ] T005 Repoint the constitutional path templates in `CLAUDE.md`, `AGENTS.md`, and `cli-dispatch-skill-preload.md`
- [ ] T006 Repoint the reciprocal `enhances` edges to `cli-external`, the `outsourced-agent-handback-docs.vitest.ts` hardcoded flat paths, and the active prose referrers
- [ ] T007 Regenerate `skill-graph.json` from metadata through the advisor rebuild path; do not hand-edit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-run the stale-path grep sweep; confirm zero active hits outside `cli-external/` and historical text, and that the handback vitest passes
- [ ] T009 Run `check-prompt-quality-card-sync.sh` + its `.github/workflows/prompt-card-sync.yml` gate against the final layout, and the logical-name no-op grep
- [ ] T010 Run phase-folder validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Stale-path sweep clean, CI gate green, logical-name strings provably untouched
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
