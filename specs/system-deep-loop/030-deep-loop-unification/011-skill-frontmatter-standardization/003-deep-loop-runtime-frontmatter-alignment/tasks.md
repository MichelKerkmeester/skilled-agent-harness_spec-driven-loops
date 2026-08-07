---
title: "Tasks: Phase 8: deep-loop-runtime Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-loop-runtime frontmatter tasks"
  - "frontmatter pilot tasks"
  - "doc contract normalization tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization/003-deep-loop-runtime-frontmatter-alignment"
    last_updated_at: "2026-06-11T11:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/references/script_interface_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-008-deep-loop-runtime"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: deep-loop-runtime Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 4/4 docs fail solely on `contextType: reference` outside the canonical enum (`check-skill-doc-frontmatter.sh --skill deep-loop-runtime --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Normalize `contextType` to `implementation` on all 4 references (`.opencode/skills/deep-loop-runtime/references/{coverage_graph_schema,integration_points,script_interface_contract,state_format}.md`)
- [x] T003 Promote tier `normal` to `important` on the two formal contract docs (`script_interface_contract.md`, `state_format.md`); descriptive docs stay `normal`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Coverage check green: `PASS mode=coverage scope=deep-loop-runtime docs=4 carrying-detailed-block=4 violations=0`
- [x] T005 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "deep-loop state format jsonl repair" ranks deep-loop-runtime first (0.95) with `!deep-loop state format(signal)` and `!jsonl repair(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T006 Diff hygiene: git diff shows frontmatter-only hunks for the 4 files
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
- **Consumer + checker packet**: `skilled-agent-orchestration/z_archive/112-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
