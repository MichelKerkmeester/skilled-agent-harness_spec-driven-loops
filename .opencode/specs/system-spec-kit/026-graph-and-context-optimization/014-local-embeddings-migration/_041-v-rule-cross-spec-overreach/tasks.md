---
title: "Tasks: 040 V-rule cross-spec overreach fix"
description: "Task ledger for setup, implementation, and verification of the V8 overreach fix."
trigger_phrases:
  - "040 tasks"
  - "V8 overreach tasks"
importance_tier: "critical"
contextType: "spec"
status: "partial"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_041-v-rule-cross-spec-overreach"
    last_updated_at: "2026-05-14T15:37:00Z"
    last_updated_by: "main-agent"
    recent_action: "Verification complete except build blocked by mcp_server/dist EPERM writes"
    next_safe_action: "Resolve dist write permissions and rerun npm run build"
    completion_pct: 90
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 040 V-rule cross-spec overreach fix

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

- [x] T001 Accept pre-bound Gate 3 phase folder for 040.
- [x] T002 Read existing 037 packet docs for Level-2 shape.
- [x] T003 Read `validate-memory-quality.ts` V8 helpers and rule body.
- [x] T004 Read existing `validate-memory-quality-v8-regex-narrow.vitest.ts`.
- [x] T005 Create 040 packet directory manually.
- [x] T006 Author description.json and graph-metadata.json.
- [x] T007 Author spec.md and plan.md with canonical Level-2 anchors.
- [x] T008 Author tasks.md, checklist.md, and implementation-summary.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 Add explicit metric suffix denylist to V8 candidate validation.
- [x] T010 Reject candidates immediately preceded by ADR context.
- [x] T011 Replace file-path fallback with full nested spec-folder extraction.
- [x] T012 Add high-cross-reference document detection.
- [x] T013 Raise scattered foreign threshold to 4 for decision-record, handover, and implementation-summary docs.
- [x] T014 Create `validate-memory-quality-v8-overreach.vitest.ts` with T040-01 through T040-05.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T015 Run `npm run build` from `.opencode/skills/system-spec-kit/scripts` (blocked by EPERM writes under `mcp_server/dist`).
- [x] T016 Run new V8 overreach Vitest.
- [x] T017 Run existing V8 regex-narrow Vitest.
- [x] T018 Run live validator against 037 `decision-record.md`.
- [x] T019 Run strict validation against this 040 packet.
- [x] T020 Update implementation-summary.md verification table with actual evidence.
- [x] T021 Mark completion metadata and final task states.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Build, targeted tests, live validator, and strict packet validation have PASS/FAIL evidence.
- [x] Implementation summary contains actual verification output.
- [x] Final response emits the binding trace requested by the user.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Predecessor**: `../037-llama-cpp-embedding-worker-deep-dive/decision-record.md`
<!-- /ANCHOR:cross-refs -->
