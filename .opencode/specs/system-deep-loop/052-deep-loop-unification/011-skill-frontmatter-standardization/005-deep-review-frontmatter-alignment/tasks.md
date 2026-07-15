---
title: "Tasks: Phase 10: deep-review Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-review frontmatter tasks"
  - "review doc contract tasks"
  - "frontmatter authoring tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/011-skill-frontmatter-standardization/005-deep-review-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:50:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-010-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: deep-review Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 12/12 docs fail; 3 partials miss only tier+contextType, 9 miss all detailed fields (`check-skill-doc-frontmatter.sh --skill deep-review --coverage`)
- [x] T002 Extract sibling deep-* trigger phrase sets to keep new deep-review phrases distinctive (`.opencode/skills/deep-{research,context,loop-runtime,improvement,ai-council}/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Complete the 3 partial blocks additively: tier + contextType appended after existing phrases (`.opencode/skills/deep-review/references/{convergence/convergence_signals,state/state_outputs,state/state_reducer_registry}.md`)
- [x] T004 Author full blocks for the 7 minimal references; tier `important` on the 4 formal contract docs (`convergence.md`, `loop_protocol.md`, `state_format.md`, `state_jsonl.md`), `normal` on the rest
- [x] T005 Author full blocks for the 2 assets: dashboard contextType `general`, strategy template contextType `planning` (`.opencode/skills/deep-review/assets/deep_review_{dashboard,strategy}.md`)
- [x] T006 Promote `state_reducer_registry.md` to tier `important` (reducer ownership + fail-closed invariants)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Coverage check green: `PASS mode=coverage scope=deep-review docs=12 carrying-detailed-block=12 violations=0`
- [x] T008 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "p0 p1 p2 severity ladder" ranks deep-review first (0.92) with `!p0 p1 p2 severity ladder(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T009 Diff hygiene: git diff shows additive frontmatter-only hunks for the 12 files (74 insertions, 0 deletions)
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
- **Consumer + checker packet**: `skilled-agent-orchestration/z_archive/112-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
