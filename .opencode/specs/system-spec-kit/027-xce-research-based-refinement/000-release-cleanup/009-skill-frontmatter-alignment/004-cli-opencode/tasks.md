---
title: "Tasks: Phase 4: cli-opencode Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-opencode frontmatter tasks"
  - "frontmatter authoring tasks"
  - "doc contract authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode"
    last_updated_at: "2026-06-11T09:38:23Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-004-cli-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: cli-opencode Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 9/9 docs carry title+description only, all missing trigger_phrases, importance_tier and contextType (`check-skill-doc-frontmatter.sh --skill cli-opencode --coverage`)
- [x] T002 Read all 9 doc bodies before authoring phrases (`.opencode/skills/cli-opencode/{references,assets}/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author frontmatter on the 7 references (`.opencode/skills/cli-opencode/references/{agent_delegation,cli_reference,context-budget,destructive_scope_violations,integration_patterns,opencode_tools,permissions-matrix}.md`)
- [x] T004 Author frontmatter on the 2 assets (`.opencode/skills/cli-opencode/assets/{prompt_quality_card,prompt_templates}.md`)
- [x] T005 Apply tier policy: `important` for the three dispatch-contract/invariant docs (`cli_reference.md`, `integration_patterns.md`, `destructive_scope_violations.md`); the other six stay `normal`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Coverage check green: `PASS mode=coverage scope=cli-opencode docs=9 carrying-detailed-block=9 violations=0`
- [x] T007 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "opencode self-invocation guard" ranks cli-opencode first (0.95) with `!opencode self-invocation guard(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T008 Diff hygiene: this phase's hunks are leading-fence-only on all 9 files; 3 files (`prompt_quality_card.md`, `prompt_templates.md`, `cli_reference.md`) also carry pre-existing body hunks from the in-flight 028 branch session, untouched here
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
