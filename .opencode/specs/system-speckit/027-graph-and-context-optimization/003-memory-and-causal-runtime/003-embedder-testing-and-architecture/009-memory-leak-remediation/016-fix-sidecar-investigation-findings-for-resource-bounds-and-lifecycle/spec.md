---
title: "Arc 010 Findings Remediation — Resource Bounds and Lifecycle"
description: "Lean phase parent for remediating arc 010/001 sidecar investigation findings across resource bounds, sidecar lifecycle, and TS/CJS rerank parity."
trigger_phrases:
  - "arc 010 phase 002 remediation"
  - "sidecar investigation findings resource bounds lifecycle"
  - "fix sidecar investigation findings"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-arc-010-phase-002-remediation-parent"
    next_safe_action: "start-001-fix-investigation-p0s"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
      - "001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack/"
    session_dedup:
      fingerprint: "sha256:0100020100020100020100020100020100020100020100020100020100020100"
      session_id: "010-sidecar-investigation-002"
      parent_session_id: null
    completion_pct: 0
    status: "complete"
    open_questions: []
    answered_questions:
      - "User pre-approved branch main, no commit, scaffold-only scope, and rule-20 compliant remediation packet naming."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# Arc 010 Findings Remediation — Resource Bounds and Lifecycle

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This is a lean phase-parent control file. Control docs stay limited to
  {spec.md, description.json, graph-metadata.json}. Heavy working docs live in
  child phase folders where they stay accurate to that phase's actual work.
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

Remediate the highest-risk findings from arc 010/001 deep research, which produced 110 deduped findings: 3 P0, 39 P1, and 68 P2. This packet focuses the first remediation slice on resource bounds at IPC and HTTP boundaries, sidecar lifecycle and process ownership, and JS/Python rerank sidecar drift.

Evidence sources:
- `../001-deep-research-drift-and-simplification/research/research.md`
- `../001-deep-research-drift-and-simplification/research/findings-registry.json`
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Priority | Status |
|---|---|---|---|
| `001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack/` | Close the 3 P0 security findings around unbounded JSON parsing and predictable temp files. | P0 | Completed |
| `002-fix-investigation-p1s-for-resource-bounds-and-input-validation/` | Close selected P1 resource-bound, input-validation, and predictable-ID findings. | P1 | Completed |
| `003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle/` | Close selected P1 lifecycle and process-ownership findings. | P1 | Completed |
| `004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity/` | Close selected P1 TS/CJS/Python parity and rerank twin drift findings. | P1 | Completed |

### Phase Transition Rules

- Each child phase validates independently with `validate.sh --strict`.
- The P0 phase runs first.
- P1 child phases may run in parallel only when dispatched independently under their own phase-folder discipline.
- No child phase modifies research artifacts under `../001-deep-research-drift-and-simplification/research/`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| Parent | `001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack` | P0 finding list, files, and remediation direction are captured. | Child checklist has one open row per P0 finding. |
| Any child | Parent | Per-finding closure is recorded in that child's checklist. | Checklist evidence includes commit hash and test file before closure. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

1. Close P0 resource-exhaustion and symlink-attack findings with bounded parsing and crypto-strong temp file names.
2. Close selected P1 resource-bound and input-validation findings with explicit caps and tests.
3. Close selected P1 sidecar lifecycle findings with explicit ownership and liveness invariants.
4. Close selected P1 TS/CJS/Python rerank drift findings with parity tests and one documented contract.
<!-- /ANCHOR:what-needs-done -->
