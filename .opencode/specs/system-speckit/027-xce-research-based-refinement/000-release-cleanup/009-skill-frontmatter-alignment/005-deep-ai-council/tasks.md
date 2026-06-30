---
title: "Tasks: Phase 5: deep-ai-council Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-ai-council frontmatter tasks"
  - "council doc normalization tasks"
  - "frontmatter campaign phase five"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/005-deep-ai-council"
    last_updated_at: "2026-06-11T09:45:08Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/references/structure/output_schema.md"
      - ".opencode/skills/deep-ai-council/assets/prompt_pack_round.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-005-deep-ai-council"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: deep-ai-council Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 18/18 docs fail — 13 on `contextType: reference`, 4 on missing `importance_tier`/`contextType`, 1 with no frontmatter (`check-skill-doc-frontmatter.sh --skill deep-ai-council --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Normalize `contextType` on workflow-rule references to `planning` (`.opencode/skills/deep-ai-council/references/{convergence/convergence_signals,convergence/deep_mode,convergence/depth_dispatch,convergence/failure_handling,integration/loop_protocol,patterns/anti_patterns,patterns/seat_diversity_patterns,scoring/scoring_rubric}.md`)
- [x] T003 Normalize `contextType` on persistence/parser/graph references to `implementation` (`.opencode/skills/deep-ai-council/references/{integration/graph_support,patterns/command_wiring,scoring/findings_registry,structure/folder_layout,structure/output_schema,structure/state_format}.md`)
- [x] T004 Promote tier `normal` to `important` on the four formal contract docs (`depth_dispatch.md`, `folder_layout.md`, `output_schema.md`, `state_format.md`); descriptive docs stay `normal`
- [x] T005 Add missing `importance_tier`/`contextType` to 2 references and 2 assets (`loop_protocol.md`, `quick_reference.md` as `general`, `deep_ai_council_dashboard.md`, `deep_ai_council_strategy.md`)
- [x] T006 Author the full canonical block on the bare asset (`.opencode/skills/deep-ai-council/assets/prompt_pack_round.md`)
- [x] T007 Phrase hygiene: `two-of-three-agree` to `two of three agree`; `council graph runtime CLI` and `council YAML workflow` lowercased
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Coverage check green: `PASS mode=coverage scope=deep-ai-council docs=18 carrying-detailed-block=18 violations=0`
- [x] T009 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "council escape hatches and two of three agree" ranks deep-ai-council first (0.95) with two `(signal)` doc matches; "council seat verdict and round prompt pack" surfaces it at 0.86 with `!council seat verdict(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T010 Diff hygiene: `git diff -U0` hunk headers all sit inside the leading fences of the 18 files
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
