---
title: "Tasks: Phase 5: adapter-sk-doc"
description: "Pending tasks for planning the sk-doc reference adapter: standardSource wiring, verify-first check(), the known-deviation suppression list, and discover()."
trigger_phrases:
  - "sk-doc adapter tasks"
  - "alignment reference adapter tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/005-adapter-sk-doc"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted task list, none executed yet"
    next_safe_action: "Start T001 once 004 gate approved"
    blockers:
      - "004-scoping-and-discovery not yet executed"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-adapter-sk-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: adapter-sk-doc

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Read `.opencode/skills/sk-doc/scripts/validate_document.py` in full for its CLI contract and exit-code semantics.
- [ ] T002 [P] Read `.opencode/skills/sk-doc/scripts/extract_structure.py` in full for its DQI scoring and document-type detection.
- [ ] T003 [P] Read `.opencode/skills/sk-doc/shared/references/core_standards.md` for filename conventions and document-type detection.
- [ ] T004 [P] Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/iterations/iteration-001.md` and `iteration-002.md` for the real known-deviation findings.
- [ ] T005 Re-read phase 004's finalized `discover(scope)->artifacts` contract signature.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- These tasks belong to a future execution pass, gated behind 004-scoping-and-discovery execution. -->

- [ ] T006 [B] Author `deep-alignment/references/adapters/sk_doc_adapter.md` with the `standardSource`/`check`/`discover` specification.
- [ ] T007 [B] Author `deep-alignment/references/adapters/sk_doc_known_deviations.md` seeded with the four real findings plus the changelog convention.
- [ ] T008 [B] Implement the adapter wiring script that shells out to `validate_document.py --json` and `extract_structure.py`.
- [ ] T009 [B] Implement `discover()` for the `docs`/`sk-doc` lane.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- These tasks belong to a future execution pass, gated behind 004-scoping-and-discovery execution. -->

- [ ] T010 [B] Dry-run the adapter against a known corpus and confirm it reproduces the 130-packet's real findings, minus the four suppressed deviations.
- [ ] T011 [B] Confirm the adapter never asserts a reality-drift finding without first re-running the relevant validator (VERIFY-FIRST).
- [ ] T012 [B] Confirm the adapter's `discover()`/`check()` signatures match phase 004's contract exactly.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
