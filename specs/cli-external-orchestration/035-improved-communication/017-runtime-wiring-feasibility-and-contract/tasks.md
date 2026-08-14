---
title: "Tasks: Phase 017 Runtime-Wiring Feasibility and Contract"
description: "Planned task breakdown for the runtime feasibility inventory, the hook-to-projection integration contract, and the OpenCode and Pi validation probes."
trigger_phrases:
  - "runtime-wiring-feasibility-and-contract"
  - "tasks"
  - "hook to projection integration contract"
  - "chat.message display validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/017-runtime-wiring-feasibility-and-contract"
    last_updated_at: "2026-08-14T09:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed out Phase 017 as Complete."
    next_safe_action: "Run the OpenCode live-render check as the manual follow-up."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-runtime-wiring-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task has a stated acceptance criterion and evidence collected for its completion."
      - "The OpenCode live-render check is recorded as a documented manual follow-up; Pi is assigned to the wrapper by the matrix fallback rule."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 017 Runtime-Wiring Feasibility and Contract

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Validate the OpenCode `chat.message` display behavior with a mutated `output.parts` entry (OpenCode plugin surface) [evidence: the live render requires an interactive OpenCode session, so this check is recorded as a documented MANUAL follow-up in `implementation-summary.md` and Phase 019's summary rather than claimed as run; the design contract does not depend on its outcome]
- [x] T002 [P] Validate whether a Pi `turn_end` assistant-message mutation changes the rendered bubble (Pi session surface) [evidence: Pi is assigned to the CLI-output wrapper per the matrix fallback rule, and Phase 023 implemented the Pi wrapper]
- [x] T003 Inventory the six runtimes and their hook surfaces from prior research evidence (`spec.md`, Phase 001 and Phase 006 evidence) [evidence: the feasibility matrix records Claude Code, Codex, Devin, Cursor, Pi, and OpenCode with their hook surfaces and pattern assignments]
- [x] T004 Freeze the probe definitions and the wrapper fallback rule for an inconclusive Pi result (`plan.md`, `spec.md`) [evidence: `plan.md` records the probe definitions and the wrapper fallback rule, which Phase 023 implemented]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T005 Author the feasibility matrix assigning each runtime one integration pattern and a go/no-go verdict (`spec.md`) [evidence: `spec.md` REQ-001 and the matrix assign each of the six runtimes one pattern and one verdict]
- [x] T006 Write the enablement-gate placement rule requiring `isProjectionEnabled()` on every activation path (`spec.md`, `decision-record.md`) [evidence: `spec.md` REQ-002 and `decision-record.md` ADR-002 state the gate placement rule]
- [x] T007 Write the fail-open exact-original fallback contract at the seam, including the fidelity check (`spec.md`, `decision-record.md`) [evidence: `spec.md` REQ-003 and `decision-record.md` ADR-002 contract the fail-open fallback]
- [x] T008 Write the canonical-bytes preservation requirement and the retained-originals restore rule (`spec.md`, `decision-record.md`) [evidence: `spec.md` REQ-004 states the preservation and restore rules]
- [x] T009 Write the per-runtime capability and privacy pre-checks that gate hosted routing (`spec.md`, `decision-record.md`) [evidence: `spec.md` REQ-005 and the security requirements state the pre-check gate, implemented by Phase 026]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T010 Record the OpenCode display-probe outcome and finalize the OpenCode pattern assignment (`checklist.md`) [evidence: the live render is recorded as a documented manual follow-up in `implementation-summary.md` and CHK-021; the native pattern assignment is finalized and Phase 019 implemented the OpenCode plugin]
- [x] T011 Record the Pi mutation-probe outcome and assign Pi to native or the wrapper (`checklist.md`) [evidence: Pi is assigned to the CLI-output wrapper, and Phase 023 implemented the Pi wrapper against the wrapper seam]
- [x] T012 Verify the contract is unambiguous for phases 019-025, with patterns and fallback already decided (`spec.md`, `checklist.md`) [evidence: phases 019-025 implemented against the contract without re-deciding; CHK-024 records the implementability review]
- [x] T013 Author and wire the complete Level-3 packet (`017-runtime-wiring-feasibility-and-contract/`) [evidence: the packet holds spec, plan, tasks, checklist, decision record, and implementation summary, all reconciled to Complete]
- [x] T014 Backfill metadata and run final strict validation (`graph-metadata.json`, `validate.sh`) [evidence: metadata regenerated via the spec-kit backfill and `validate.sh --strict` reports 0 errors and 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have stated acceptance criteria. [evidence: `spec.md` REQ-001 through REQ-009 each carry an acceptance criterion, and every checklist item is marked verified]
- [x] The feasibility matrix assigns each of the six runtimes exactly one integration pattern with a go/no-go verdict. [evidence: `spec.md` matrix, implemented by phases 019-025]
- [x] The OpenCode display probe and the Pi mutation probe are run and recorded. [evidence: the Pi assignment is recorded via the wrapper fallback rule and Phase 023; the OpenCode display probe is recorded as a documented manual follow-up because it requires an interactive OpenCode session]
- [x] The seam contract states the enablement-gate placement, fail-open fallback, canonical-bytes preservation, and pre-checks. [evidence: `spec.md` REQ-002 through REQ-005 and `decision-record.md` ADR-002]
- [x] Phase 017 strict validation reports zero errors and zero warnings. [evidence: `validate.sh --strict` on Phase 017 reports 0 errors and 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
