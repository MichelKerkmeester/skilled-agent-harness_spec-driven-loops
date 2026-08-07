---
title: "Tasks: Phase 12: mcp-click-up Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-click-up frontmatter tasks"
  - "clickup doc contract tasks"
  - "cupt reference normalization tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up"
    last_updated_at: "2026-06-11T09:27:45Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/references/cupt_commands.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-012-mcp-click-up"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: mcp-click-up Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 3/3 docs fail on `importance_tier missing; contextType missing` (`check-skill-doc-frontmatter.sh --skill mcp-click-up --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `importance_tier: normal` and `contextType: implementation` to the two invocation references (`.opencode/skills/mcp-click-up/references/{cupt_commands,mcp_tools}.md`)
- [x] T003 Add `importance_tier: normal` and `contextType: general` to the diagnostic guide (`.opencode/skills/mcp-click-up/references/troubleshooting.md`); existing trigger phrases kept (6 each, in-range, content-derived)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Coverage check green: `PASS mode=coverage scope=mcp-click-up docs=3 carrying-detailed-block=3 violations=0`
- [x] T005 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "cupt done wrong status on team filter" ranks mcp-click-up first (0.95) with `!cupt done wrong status(signal)` and `!cupt done(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T006 Diff hygiene: git diff shows frontmatter-only hunks for the 3 files (6 insertions, 0 deletions)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (coverage check + routing smoke without touching the live daemon)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification evidence**: See `implementation-summary.md`
- **Contract origin**: `../001-frontmatter-benefit-investigation/research.md`
- **Pilot precedent**: `../008-deep-loop-runtime/implementation-summary.md`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
