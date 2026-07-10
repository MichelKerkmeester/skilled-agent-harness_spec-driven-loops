---
title: "Tasks: Phase 2: architecture-decision"
description: "Decision-gate task list for freezing the cli-external parent-hub architecture before phase 003 scaffold work. Tasks track decision recording, the scorer-contract capture, target-shape drafting, and human approval."
trigger_phrases:
  - "cli-external decision tasks"
  - "architecture gate tasks"
  - "cli parent phase 002"
  - "mode registry task list"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted architecture-decision task list"
    next_safe_action: "Complete review and obtain operator approval before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Shared dispatch hook lift to hub root vs packet-local"
    answered_questions:
      - "Both modes workflow; scorer sources from mode-registry; default route cli-opencode"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Optional [P] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the locked operator decisions and treat them as frozen inputs (`spec.md`)
- [ ] T002 Confirm phase 002 is documentation-only and must not modify live skills, advisor code, hook, or CI (`spec.md`)
- [ ] T003 [P] Check parent-hub doctrine for required registry/router fields (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Record the five locked decisions with rationale and downstream effect (`decision-record.md`)
- [ ] T005 State the family-cli-to-scorer consequence and pair ADR-004/ADR-005 as one atomic change (`decision-record.md`)
- [ ] T006 Record the scorer contract: source, resolution target, no-hub-noun rule, dist refresh, and 11-case fixture re-baseline with negative-preservation (`decision-record.md`)
- [ ] T007 Record the shared-hook-lift question as an open ADR-002 sub-decision (`decision-record.md`)
- [ ] T008 Draft the future `mode-registry.json` target shape for two workflow packets (`plan.md`)
- [ ] T009 Draft the future `hub-router.json` target shape with base three outcomes and `defaultMode: "cli-opencode"` (`plan.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify the phase files contain no scaffold placeholders (`002-architecture-decision/`)
- [ ] T011 Verify template anchors, frontmatter, `SPECKIT_LEVEL`, and `SPECKIT_TEMPLATE_SOURCE` markers are preserved (`002-architecture-decision/`)
- [ ] T012 Obtain operator approval or amendment before phase 003 starts (`002-architecture-decision/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All phase 002 drafting tasks are complete or explicitly amended by the operator
- [ ] The only remaining architecture question is the phase 007 routing-class benchmark question plus the ADR-002 hook-lift sub-decision
- [ ] Human approval is recorded before phase 003 begins
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
