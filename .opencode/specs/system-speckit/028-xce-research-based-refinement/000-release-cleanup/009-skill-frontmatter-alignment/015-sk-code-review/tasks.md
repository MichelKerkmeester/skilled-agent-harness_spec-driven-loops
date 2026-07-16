---
title: "Tasks: Phase 15: sk-code-review Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code-review frontmatter tasks"
  - "review skill doc authoring tasks"
  - "doc contract authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review"
    last_updated_at: "2026-06-11T12:55:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/references/review_core.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-015-sk-code-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: sk-code-review Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 10/10 docs fail — 9 missing trigger_phrases/importance_tier/contextType, `pr_state_dedup.md` has no leading frontmatter block (`check-skill-doc-frontmatter.sh --skill sk-code-review --coverage`)
- [x] T002 Ground phrase authoring in doc content: section-header sweep across all 10 references plus full reads of `pr_state_dedup.md` and `review_core.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Append detailed fields inside the existing fence on the 9 title+description docs (`.opencode/skills/sk-code-review/references/{code_quality_checklist,fix-completeness-checklist,quick_reference,removal_plan,review_core,review_ux_single_pass,security_checklist,solid_checklist,test_quality_checklist}.md`)
- [x] T004 Author the full canonical block, including title and description, above the H1 of the fence-less doc (`.opencode/skills/sk-code-review/references/pr_state_dedup.md`)
- [x] T005 Apply tier policy: `important` for the two formal contract docs (`review_core.md`, `pr_state_dedup.md`); checklists and indexes stay `normal`
- [x] T006 Apply contextType policy: `implementation` default; `planning` for `removal_plan.md`; `general` for `quick_reference.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Coverage check green: `PASS mode=coverage scope=sk-code-review docs=10 carrying-detailed-block=10 violations=0`
- [x] T008 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "findings first severity ordering" ranks sk-code-review first (0.95) with `!findings first severity ordering(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T009 Diff hygiene: git diff shows insertion-only frontmatter hunks for the 10 files (83 lines)
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
