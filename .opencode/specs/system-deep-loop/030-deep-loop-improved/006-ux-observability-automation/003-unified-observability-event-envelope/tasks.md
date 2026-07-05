---
title: "Tasks: Unified Observability Event Envelope"
description: "Completed task ledger for producer-side observability envelope normalization."
trigger_phrases:
  - "unified observability envelope"
  - "observability event envelope"
  - "observability-events.cjs"
  - "normalizeObservabilityEvent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/003-unified-observability-event-envelope"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/round-state-jsonl.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/status.cjs"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Unified Observability Event Envelope

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

- [x] T001 Read the completed spec and confirm producer-side envelope scope (`spec.md`).
- [x] T002 Inventory native event producers named in the spec (`fanout-run.cjs`, `deep_research_auto.yaml`, `convergence.cjs`, `round-state-jsonl.cjs`, `status.cjs`).
- [x] T003 [P] Keep unified reader and historical JSONL migration out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `observability-events.cjs` with `normalizeObservabilityEvent()` and `appendObservabilityEvent()`.
- [x] T005 Add envelope fields for schema, event id, producer, stream, subject, event, status, and payload.
- [x] T006 Wire fan-out events through the append helper (`fanout-run.cjs`).
- [x] T007 Wire single-loop telemetry events through the append helper (`deep_research_auto.yaml`).
- [x] T008 Wire convergence, round-state, and status events through the append helper (`convergence.cjs`, `round-state-jsonl.cjs`, `status.cjs`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify normalization produces every required envelope field.
- [x] T010 Verify native payload remains available under `payload`.
- [x] T011 Verify an envelope-wrapped fan-out row parses without breaking the existing consumer.
- [x] T012 Update plan and task docs to reflect completed implementation (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
