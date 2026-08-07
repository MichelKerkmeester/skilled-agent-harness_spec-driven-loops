---
title: "Tasks: Phase 13: mcp-code-mode Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-code-mode frontmatter tasks"
  - "code mode doc contract tasks"
  - "frontmatter authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/013-mcp-code-mode"
    last_updated_at: "2026-06-11T09:37:11Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/references/naming_convention.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-013-mcp-code-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: mcp-code-mode Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 7/7 docs fail with trigger_phrases, importance_tier, and contextType all missing (`check-skill-doc-frontmatter.sh --skill mcp-code-mode --coverage`)
- [x] T002 Read all 7 doc bodies so trigger phrases derive from actual content (`.opencode/skills/mcp-code-mode/{references,assets}/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the three contract fields on the 5 references; `naming_convention.md` gets tier `important` (UTCP naming invariant), `architecture.md` and `tool_catalog.md` get contextType `general`, the rest `implementation` (`.opencode/skills/mcp-code-mode/references/{architecture,configuration,naming_convention,tool_catalog,workflows}.md`)
- [x] T004 Author the three contract fields on the 2 assets as `implementation`/`normal` (`.opencode/skills/mcp-code-mode/assets/{config_template,env_template}.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Coverage check green: `PASS mode=coverage scope=mcp-code-mode docs=7 carrying-detailed-block=7 violations=0`
- [x] T006 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "call_tool_chain patterns" surfaces mcp-code-mode at 0.62 with `!call_tool_chain patterns(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T007 Diff hygiene: git diff shows frontmatter-only addition hunks for the 7 files (the unrelated `mcp_server/package-lock.json` change predates this phase)
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
