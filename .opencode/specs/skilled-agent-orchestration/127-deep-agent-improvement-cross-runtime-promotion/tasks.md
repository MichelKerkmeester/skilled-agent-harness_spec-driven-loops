---
title: "Task List: Packet 127 deep-agent-improvement cross-runtime promotion"
description: "Task breakdown for hard four-runtime mirror gate and partial-state recovery."
trigger_phrases:
  - "packet 127 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-deep-agent-improvement-cross-runtime-promotion"
    recent_action: "Tracked packet 127 implementation tasks."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Rerun Vitest."
---
# Task List: Packet 127 deep-agent-improvement cross-runtime promotion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Marker | Meaning |
| --- | --- |
| [x] | Complete |
| [ ] | Pending |
| [!] | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet 123 roadmap entry for packet 127.
- [x] T002 Read iteration 008 multi-runtime sync finding.
- [x] T003 Read packet 124 and 126 ADRs for mirror TODO and advisory boundary.
- [x] T004 Read current promotion helper, gate helper, scanner, reducer, and references.
- [x] T005 Confirm writable scope excludes actual runtime agent definitions and sibling skills.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create `_lib/mirror-sync-verify.cjs` with four runtime path map.
- [x] T011 Implement Markdown body extraction and Codex TOML `developer_instructions` extraction.
- [x] T012 Implement normalized token comparison with runtime path normalization.
- [x] T013 Extend `_lib/promotion-gates.cjs` with mirror sync state and gate evaluation.
- [x] T014 Wire `promote-candidate.cjs` to enforce hard mirror sync for agent-definition targets.
- [x] T015 Emit structured `MIRROR_SYNC_GATE_FAILED` error with present/missing/drift runtime lists.
- [x] T016 Add optional state-file writes for `mirror_sync_state`.
- [x] T017 Update `reduce-state.cjs` to surface latest mirror sync state and recovery action.
- [x] T018 Update promotion and mirror drift references.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Add Vitest fixture with all four mirrors in sync.
- [x] T021 Add Vitest fixture with one mirror missing.
- [x] T022 Add Vitest fixture with Codex TOML body drift while Markdown mirrors match.
- [x] T023 Run `node --check` on modified `.cjs` files.
- [x] T024 Run direct verifier smoke on live DAI mirrors.
- [!] T025 Run new Vitest. Blocked because `.opencode/node_modules` is absent and `npx` cannot reach npm under restricted network.
- [x] T026 Run packet 127 strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T030 Author `spec.md`.
- [x] T031 Author `plan.md`.
- [x] T032 Author `tasks.md`.
- [x] T033 Author `checklist.md`.
- [x] T034 Author `decision-record.md`.
- [x] T035 Author `implementation-summary.md`.
- [x] T036 Author `description.json` and `graph-metadata.json`.
- [x] T037 Add Commit Handoff section with suggested commit and explicit `git add` paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Task | Reference |
| --- | --- |
| T001 | Packet 123 improvement roadmap |
| T002 | Iteration 008 final adversarial sweep |
| T003 | Packet 124 ADR-001 and packet 126 ADR-001 |
| T010-T017 | ADR-001 in `decision-record.md` |
| T020-T022 | `scripts/tests/mirror-sync-verify.vitest.ts` |
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:architecture-tasks -->
## L3: Architecture Tasks

- [x] AT-001 Define the four-runtime promotion gate contract.
- [x] AT-002 Define Codex TOML body-equivalence exception.
- [x] AT-003 Define partial mirror state machine and rollback default.
- [x] AT-004 Validate that the verifier is reusable outside promotion.
- [x] AT-005 Keep runtime agent definitions read-only in this packet.
<!-- /ANCHOR:architecture-tasks -->
