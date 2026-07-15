---
title: "Tasks: Phase 18: sk-prompt Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-prompt frontmatter tasks"
  - "prompt skill doc authoring tasks"
  - "format guide contract tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt"
    last_updated_at: "2026-06-11T09:37:49Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/depth_framework.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-018-sk-prompt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: sk-prompt Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 5/5 docs fail on missing trigger_phrases, importance_tier, contextType (`check-skill-doc-frontmatter.sh --skill sk-prompt --coverage`)
- [x] T002 Read all 5 doc bodies to derive distinctive trigger phrases from actual content (`.opencode/skills/sk-prompt/{references,assets}/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author full contract block on the 3 format-guide assets; collapse folded `description: >` scalars to one line (`.opencode/skills/sk-prompt/assets/{format_guide_json,format_guide_markdown,format_guide_yaml}.md`)
- [x] T004 Author full contract block on `patterns_evaluation.md`: tier `normal`, contextType `implementation` (`.opencode/skills/sk-prompt/references/patterns_evaluation.md`)
- [x] T005 Author full contract block on `depth_framework.md`: tier `important` (blocking gates, canonical energy-level table), contextType `implementation` (`.opencode/skills/sk-prompt/references/depth_framework.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Coverage check green: `PASS mode=coverage scope=sk-prompt docs=5 carrying-detailed-block=5 violations=0`
- [x] T007 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "depth thinking rounds clear scoring rubric" ranks sk-prompt first (0.95) with `!clear scoring rubric(signal)` and `!depth thinking rounds(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T008 Diff hygiene: git diff shows frontmatter-only hunks for the 5 files
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
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
