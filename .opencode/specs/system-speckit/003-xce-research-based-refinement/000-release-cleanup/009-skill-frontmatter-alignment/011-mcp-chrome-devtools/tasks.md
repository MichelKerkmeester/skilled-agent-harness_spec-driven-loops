---
title: "Tasks: Phase 11: mcp-chrome-devtools Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-chrome-devtools frontmatter tasks"
  - "chrome devtools doc contract tasks"
  - "bdg doc frontmatter tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools"
    last_updated_at: "2026-06-11T13:05:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-chrome-devtools/references/session_management.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-011-mcp-chrome-devtools"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: mcp-chrome-devtools Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 3/3 docs fail on missing `trigger_phrases`, `importance_tier`, and `contextType` (`check-skill-doc-frontmatter.sh --skill mcp-chrome-devtools --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author the detailed block on all 3 references: 6 content-derived phrases each plus tier and contextType (`.opencode/skills/mcp-chrome-devtools/references/{cdp_patterns,session_management,troubleshooting}.md`)
- [x] T003 Tier/contextType judgment: all 3 docs stay `normal` + `implementation` — the skill carries how-to and diagnostic guides, no formal dispatch-contract docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Coverage check green: `PASS mode=coverage scope=mcp-chrome-devtools docs=3 carrying-detailed-block=3 violations=0`
- [x] T005 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "bdg session health check" ranks mcp-chrome-devtools first (0.95) with `!bdg session health check(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T006 Diff hygiene: git diff shows frontmatter-only hunks for the 3 files (+9 lines each, 0 deletions)
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
- **Pilot recipe**: `../008-deep-loop-runtime/`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
