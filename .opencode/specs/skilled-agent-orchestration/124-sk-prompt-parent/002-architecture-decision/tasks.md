---
title: "Tasks: Phase 2: architecture-decision"
description: "Decision-gate task list for freezing the sk-prompt parent-hub architecture before phase 003 scaffold work. Tasks track decision recording, open-question disposition, target-shape drafting, and human approval."
trigger_phrases:
  - "sk-prompt decision tasks"
  - "architecture gate tasks"
  - "prompt parent phase 002"
  - "mode registry task list"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision"
    last_updated_at: "2026-07-09T17:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted architecture-decision task list"
    next_safe_action: "Complete review and obtain operator approval before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-architecture-decision"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Phase 007 owns empirical routing-class validation for prompt-models"
    answered_questions:
      - "prompt-improve manual-testing material remains packet-local"
      - "prompt-models metadata normalizes to 0.9.0.0 while the parent hub fold-in targets 1.0.0.0"
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

- [x] T001 Read the locked operator decisions and treat them as frozen inputs (`spec.md`) — Evidence: `decision-record.md` ADR-001..003.
- [x] T002 Confirm phase 002 is documentation-only and must not modify live skill folders (`spec.md`) — Evidence: no edits under `sk-prompt/` or `sk-prompt-models/` this phase.
- [x] T003 [P] Check parent-hub doctrine for required registry/router fields (`plan.md`) — Evidence: `plan.md` §3 ARCHITECTURE cites the 8 required per-mode fields.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record the five locked decisions with rationale and phase 003 effect (`plan.md`) — Evidence: `decision-record.md` ADR-001..004.
- [x] T005 Resolve prompt-improve manual-testing-playbook ownership as packet-local (`plan.md`) — Evidence: `decision-record.md` ADR-004.
- [x] T006 Resolve prompt-models version reconciliation to packet `0.9.0.0` and hub `1.0.0.0` (`plan.md`) — Evidence: `decision-record.md` ADR-004 Implementation.
- [x] T007 Record prompt-models routing-class as deferred to phase 007 empirical benchmark evidence (`spec.md`) — Evidence: `spec.md` §12 OPEN QUESTIONS.
- [x] T008 Draft the future `mode-registry.json` target shape for two workflow packets (`plan.md`) — Evidence: `plan.md` §3 ARCHITECTURE Decision Record table.
- [x] T009 Draft the future `hub-router.json` target shape with base three outcomes and `defaultMode: "prompt-improve"` (`plan.md`) — Evidence: `plan.md` §3 ARCHITECTURE Decision Record table.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify `spec.md`, `plan.md`, and `tasks.md` contain no scaffold placeholders (`002-architecture-decision/`) — Evidence: `validate.sh --strict` passed 0/0.
- [x] T011 Verify template anchors, frontmatter, `SPECKIT_LEVEL`, and `SPECKIT_TEMPLATE_SOURCE` markers are preserved (`002-architecture-decision/`) — Evidence: `validate.sh --strict` ANCHORS_VALID pass.
- [x] T012 Obtain operator approval or amendment before phase 003 starts (`002-architecture-decision/`) — Evidence: decisions locked via explicit AskUserQuestion answers, re-verified zero-drift in phase 001, confirmed here.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All phase 002 drafting tasks are complete or explicitly amended by the operator — Evidence: T001-T012 all checked.
- [x] The only remaining architecture question is the phase 007 routing-class benchmark question — Evidence: `spec.md` §12 OPEN QUESTIONS single remaining item.
- [x] Human approval is recorded before phase 003 begins — Evidence: `spec.md` Status = Approved.
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
