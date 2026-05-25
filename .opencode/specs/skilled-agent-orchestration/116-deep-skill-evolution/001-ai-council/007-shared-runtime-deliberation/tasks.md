---
title: "Tasks: sk-ai-council Shared Runtime Deliberation"
description: "Task list for the 124 AI Council deliberation packet."
trigger_phrases:
  - "124 sk-ai-council tasks"
  - "ai-council runtime deliberation tasks"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation"
    last_updated_at: "2026-05-23T05:04:55Z"
    last_updated_by: "codex"
    recent_action: "Completed task checklist for the deliberation packet."
    next_safe_action: "record-validation"
    blockers: []
    key_files:
      - "tasks.md"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:1241241241241241241241241241241241241241241241241241241241240003"
      session_id: "116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All requested packet and council artifacts were created."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-ai-council Shared Runtime Deliberation

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read inputs: 117 predecessor packet, `sk-ai-council`, `deep-loop-runtime`, and memory-leak/lifecycle precedent.
- [x] T001a [P] Capture current `sk-ai-council` surfaces: skill rules, agent contract, helper scripts, council graph, and consumers.
- [x] T001b [P] Capture `deep-loop-runtime` precedent: modules, scripts, storage, tests, 118 ADRs, and lifecycle rationale.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Seat 1 advocate-extract: argue for shared runtime extraction.
- [x] T003 Seat 2 advocate-keep-inline: argue against premature extraction.
- [x] T004 Seat 3 advocate-hybrid: argue for primitive-only extraction.
- [x] T005 Seat 4 adjudicator: score advocates and rule.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Council-report synthesis: verdict, convergence, findings, criteria, implementation sketch, and risks.
- [x] T006a ADR synthesis: 3-5 decision records in `decision-record.md`.
- [x] T006b Metadata: `description.json`, `graph-metadata.json`, config/state files.
- [x] T007 Strict validate: run `validate.sh --strict` and record evidence.
- [x] T007a Commit handoff: append suggested commit and absolute changed file paths to `council-report.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Council Report**: See `ai-council/council-report.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
