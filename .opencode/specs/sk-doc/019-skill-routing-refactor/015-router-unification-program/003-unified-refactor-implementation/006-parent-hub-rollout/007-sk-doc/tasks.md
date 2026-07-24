---
title: "Tasks: sk-doc Compiled Router Rollout"
description: "Completed implementation and verification tasks for the sk-doc parent-hub canary."
trigger_phrases: ["sk-doc rollout tasks", "sk-doc canary status", "sk-doc router tasks"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/007-sk-doc"
    last_updated_at: "2026-07-19T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Completed rollout tasks"
    next_safe_action: "Retain shadow-only candidate"
    blockers: []
    key_files: ["tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:badede66ad69576c8c83246b273bd64b8f443198dfaad2db739c1ea03811b990"
      session_id: "sk-doc-rollout-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---
<!-- ANCHOR:notation -->
## Task Notation

`[x]` means completed; `[ ]` means pending; `[P]` means parallelizable; `[B]` means blocked.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read sibling archetypes and design authority. [EVIDENCE: `harness/validate-canary.cjs` pins the derived contract.]
- [x] T002 Read shared contracts, scorer path, hub, registry, and all packets. [EVIDENCE: `harness/validate-canary.cjs` exercises the shared path.]
- [x] T003 Capture protected pre-write hashes. [EVIDENCE: `harness/validate-canary.cjs` verifies every pinned hash.]
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Implement compiler and typed router (`lib/`). [EVIDENCE: `node harness/validate-canary.cjs` exited code 0.]
- [x] T011 Implement policy card, activation, and execution fences (`lib/`). [EVIDENCE: `node harness/validate-canary.cjs` exited code 0.]
- [x] T012 Author independent canaries (`fixtures/`). [EVIDENCE: `node harness/validate-canary.cjs` scored 18/18 rows.]
- [x] T013 Generate canonical policy and activation artifacts (`harness/build-artifacts.cjs`). [EVIDENCE: `node harness/build-artifacts.cjs` exited code 0.]
- [x] T014 Implement real-scorer and rollback validation (`harness/validate-canary.cjs`). [EVIDENCE: `node harness/validate-canary.cjs` exited code 0.]
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Prove byte-identical rebuild. [EVIDENCE: `node harness/validate-canary.cjs` reports byteIdenticalRecompile.]
- [x] T021 Pass 18 typed rows through shared projector and real scorer. [EVIDENCE: `node harness/validate-canary.cjs` reports 18/18 REAL-GREEN.]
- [x] T022 Pass parity, algebra, default, ambiguity, and bundle checks. [EVIDENCE: `node harness/validate-canary.cjs` reports every falsifier gate true.]
- [x] T023 Pass execution and fenced rollback drills. [EVIDENCE: `node harness/validate-canary.cjs` reports exact rollback and epoch 2.]
- [x] T024 Run every CommonJS syntax check. [EVIDENCE: `node --check` exited code 0 for seven files.]
- [x] T025 Run strict packet and final scope/hash audits. [EVIDENCE: `validate.sh --strict` ran; freshness is reported separately.]
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Deterministic artifacts and REAL-GREEN canary. [EVIDENCE: `node harness/validate-canary.cjs` exited code 0.]
- [x] Frozen scorer and authored inputs unchanged. [EVIDENCE: `harness/validate-canary.cjs` verifies before/after hashes.]
- [x] Required Level-2 files agree on shadow-only status. [EVIDENCE: `activation/manifest.candidate.json` retains legacy authority.]
<!-- /ANCHOR:completion -->

---
<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
