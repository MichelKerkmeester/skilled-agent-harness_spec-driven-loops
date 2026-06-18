---
title: "Tasks: Phase 2: cli-claude-code Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-claude-code frontmatter tasks"
  - "frontmatter authoring tasks"
  - "claude code doc contract tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code"
    last_updated_at: "2026-06-11T12:45:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-002-cli-claude-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: cli-claude-code Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 6/6 docs fail on trigger_phrases, importance_tier, and contextType all missing (`check-skill-doc-frontmatter.sh --skill cli-claude-code --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author the full contract block on the 4 references, phrases derived from each doc body (`.opencode/skills/cli-claude-code/references/{agent_delegation,claude_tools,cli_reference,integration_patterns}.md`)
- [x] T003 Author the full contract block on the 2 assets (`.opencode/skills/cli-claude-code/assets/{prompt_quality_card,prompt_templates}.md`)
- [x] T004 Apply tier judgment: `important` for `cli_reference.md` (formal flag/invocation contract); the other 5 docs stay `normal`; all 6 get contextType `implementation`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Coverage check green: `PASS mode=coverage scope=cli-claude-code docs=6 carrying-detailed-block=6 violations=0`
- [x] T006 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "claude code permission modes" ranks cli-claude-code first (0.95) with `!claude code permission modes(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T007 Diff hygiene: git diff shows frontmatter-only addition hunks for the 6 files
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
- **Pilot recipe**: `../008-deep-loop-runtime/implementation-summary.md`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
