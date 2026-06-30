---
title: "Tasks: Phase 14: sk-code Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code frontmatter tasks"
  - "frontmatter batch tasks"
  - "doc contract normalization tasks sk-code"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/014-sk-code"
    last_updated_at: "2026-06-11T13:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/references/smart_routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-014-sk-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: sk-code Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 88/88 docs fail; 76 carry title+description only, 12 webflow references carry partial blocks, 3 of those with 9 trigger phrases over the cap (`check-skill-doc-frontmatter.sh --skill sk-code --coverage`)
- [x] T002 Digest sweep: one Python pass dumping frontmatter + H1 + headings + intro per doc so phrases can be authored without full reads (`.opencode/skills/sk-code/references/`, `.opencode/skills/sk-code/assets/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Author contract blocks for references/motion_dev (7), references/opencode (19), router roots (3), references/universal (4) with surface-qualified phrases (`.opencode/skills/sk-code/references/{motion_dev,opencode,universal}/`, `references/{phase_detection,smart_routing,stack_detection}.md`)
- [x] T004 [P] Author/normalize references/webflow (35): trim the three 9-phrase lists, lowercase mixed-case phrases, replace single-word phrases, drop the stray `keywords` key (`.opencode/skills/sk-code/references/webflow/`)
- [x] T005 [P] Author contract blocks for assets (20: motion_dev 2, opencode 12, universal 2, webflow 4) (`.opencode/skills/sk-code/assets/`)
- [x] T006 Apply all 88 patches in one assertion-guarded batch run reusing title/description lines verbatim; guards: fence present, single-line scalars, 3-8 lowercase multi-word phrases, body suffix byte-identical (`/tmp/patch_fm_sk_code.py`, patched=88 of 88)
- [x] T007 Tier/contextType judgment: `important` on 7 contract/gate docs; `general` on the 3 router docs, `research` on multi_agent_research, `planning` on motion_dev decision_matrix, `implementation` elsewhere
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Coverage check green: `PASS mode=coverage scope=sk-code docs=88 carrying-detailed-block=88 violations=0`
- [x] T009 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "webflow swiper patterns" ranks sk-code first (0.95) with `!webflow swiper patterns(signal)` in the reason; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T010 Diff hygiene: `git diff --stat` shows exactly 88 sk-code files changed, sampled hunks are frontmatter-only
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
