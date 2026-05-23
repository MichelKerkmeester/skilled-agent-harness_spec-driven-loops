---
title: "Tasks: Research Synthesis and Remediation Map"
description: "Task list for Research Synthesis and Remediation Map."
trigger_phrases:
  - "research-synthesis-and-remediation-map"
  - "memory leak 1"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map"
    last_updated_at: "2026-05-22T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed the consolidated remediation map and source evidence index."
    next_safe_action: "Start 002-telemetry-and-process-verification-harness."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "checklist.md"
      - "decision-record.md"
      - "resource-map.md"
      - "research/remediation-map.md"
      - "research/source-evidence-index.md"
    session_dedup:
      fingerprint: "sha256:0101010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from relocated 020 and 024 source research under the parent arc."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->
# Tasks: Research Synthesis and Remediation Map

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Outcome |
|-----------|---------|
| M1 | Source research archives recovered into phase 001. |
| M2 | Level 3 docs added and synchronized. |
| M3 | Old packet references removed from active parent metadata. |
| M4 | Old source packet folders deleted. |
| M5 | Final validation passes. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [x] T001 Read source evidence from packets 020 and 024.
- [x] T002 Confirm affected surfaces and same-class producers.
- [x] T003 Define verification matrix and no-kill safety boundaries.
- [x] T003A Recover original research archives into this phase's `research/source-research/` directory.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Milestone M2]

- [x] T004 Implement scoped synthesis docs for this phase.
- [x] T005 Add verification gates for timeout, parent-death, stale state, and expected-daemon boundaries where applicable.
- [x] T006 Update phase docs with evidence and handoff notes.
- [x] T006A Add Level 3 `checklist.md`, `decision-record.md`, and `resource-map.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Milestone M3]

- [x] T007 Run strict spec validation.
- [x] T008 Defer live process/memory telemetry checks to phase 002.
- [x] T009 Update parent phase map status and next safe action.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Metadata Cleanup [Milestone M3]

- [x] T010 Remove old 020 child reference from `002-spec-memory-stack` metadata.
- [x] T011 Remove old 024 child reference from `004-code-index-stack` metadata.
- [x] T012 Update source archive paths to phase-local `research/source-research/`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Deletion [Milestone M4]

- [x] T013 Delete old `020-cli-process-memory-leak-deep-research` packet folder after validation.
- [x] T014 Delete old `024-cli-deep-research-memory-leak-audit` packet folder after validation.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Final Verification [Milestone M5]

- [x] T015 Re-run strict validation for phase 001.
- [x] T016 Re-run strict validation for `009-memory-leak-remediation`.
- [x] T017 Re-run strict validation for `002-spec-memory-stack`, `004-code-index-stack`, and the `016` umbrella parent.
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-deferred P0/P1 tasks are complete.
- [x] No destructive cleanup path lacks exact ownership proof.
- [x] Validation evidence is recorded in implementation-summary.md.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Source packet 020 archive**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research`
- **Source packet 024 archive**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`
<!-- /ANCHOR:cross-refs -->
