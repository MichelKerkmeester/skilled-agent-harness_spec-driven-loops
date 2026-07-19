---
title: "Tasks: sk-design Compiled Router Rollout"
description: "Implementation and verification task ledger for the sk-design parent-hub canary."
trigger_phrases: ["sk-design rollout tasks", "sk-design canary status", "sk-design router tasks"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/006-sk-design"
    last_updated_at: "2026-07-19T11:08:33.000Z"
    last_updated_by: "codex"
    recent_action: "Recorded the sk-design rollout task evidence."
    next_safe_action: "Retain the compiled candidate in shadow-only authority."
---
# Tasks: sk-design Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---
<!-- ANCHOR:notation -->
## Task Notation

`[x]` means verified; `[ ]` means pending; `[P]` means parallelizable; `[B]` means blocked.
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read required sibling, hub, packet, shared, authority, and template sources. [VERIFIED: source hashes are bound in `activation/acceptance.json`.]
- [x] T002 Capture the three protected scorer hashes. [VERIFIED: `harness/validate-canary.cjs` checks fixed digests before and after.]
- [x] T003 Lock writes to this child. [EVIDENCE: plan.md:1 records the child-local write boundary.]
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Implement the shared-compiler adapter and nested router parser. [EVIDENCE: lib/registry-compiler.cjs:1 compiles six destinations and ninety leaves.]
- [x] T011 Implement typed routing and leaf projection. [EVIDENCE: lib/router.cjs:1 and harness/validate-canary.cjs:1 cover thirteen route-gold cases.]
- [x] T012 Implement card, activation, and execution fences. [EVIDENCE: lib/execution-fence.cjs:1 and lib/activation-gate.cjs:1 enforce authority and rollback.]
- [x] T013 Generate compiled and activation artifacts. [VERIFIED: `node harness/build-artifacts.cjs` exits zero.]
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Prove deterministic byte-identical rebuild. [VERIFIED: validator reports `byteIdenticalRecompile: true`.]
- [x] T021 Pass live and persisted rows through the real scorer. [VERIFIED: validator reports 13/13 twice with writeback false.]
- [x] T022 Prove negative algebra, bundle order, and leaf closure. [EVIDENCE: harness/validate-canary.cjs:1 exercises all closed-algebra branches.]
- [x] T023 Prove VERIFY-before-COMMIT and byte-exact rollback. [EVIDENCE: harness/validate-canary.cjs:1 reports fence epoch two and equal rollback hashes.]
- [x] T024 Pass every CommonJS syntax check. [VERIFIED: `node --check` exits zero for seven files.]
- [x] T025 Pass strict packet validation and final hash/scope audit. [EVIDENCE: `validate.sh --strict` reports Errors: 0 and Warnings: 0; final SHA-256 and scope audits match baseline.]
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Deterministic artifacts and REAL-GREEN canary. [VERIFIED: canary exits zero with status `REAL-GREEN`.]
- [x] Frozen scorer and authored inputs unchanged. [VERIFIED: final protected SHA-256 audit matches the baseline.]
- [x] Strict packet validator reports zero errors. [EVIDENCE: `validate.sh --strict` exits zero with Errors: 0 and Warnings: 0.]
<!-- /ANCHOR:completion -->

---
<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
