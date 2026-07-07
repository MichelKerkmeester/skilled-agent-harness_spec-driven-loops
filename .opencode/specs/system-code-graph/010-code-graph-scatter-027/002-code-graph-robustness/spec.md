---
title: "Feature Specification: Code-Graph Engine Robustness Remediation"
description: "Remediation sub-phase of the 027 fresh+regression deep-review: 8 findings (0 P1) in this subsystem, each carried as a task with its registry recommendation. Scaffold only — no fixes applied."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/010-code-graph-scatter-027/002-code-graph-robustness"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase spec from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code-Graph Engine Robustness Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (findings carried as tasks; no fixes applied) |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Findings** | 8 (0 P1 / 8 P2) |
| **Handoff Criteria** | Every listed finding fixed-or-refuted-with-reason, each code fix test-gated; vitest per fix against a fixture graph DB. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Sub-phase of `005-fresh-regression-remediation` (phase parent). It owns the subsystem cluster from the fresh+regression deep-review's findings registry. Per operator directive every finding is carried (refuted ones as hardening, asserted ones fix-as-stated). Source: `../../review/fresh-regression-75/deep-review-findings-registry.json`.

**Scope Boundary**: only findings assigned to this sub-phase by `fix-coverage.json`. No cross-phase edits.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-review surfaced 8 findings in this subsystem. Left unaddressed they carry robustness and traceability debt. This sub-phase remediates each.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the 8 findings enumerated in tasks.md (and `fix-coverage.json`).
**Out of scope**: findings owned by sibling sub-phases; any change outside the cited files + their tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** (003-T001, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1508`: Record edge tombstones for edges referencing the soon-to-be-deleted orphan nodes BEFORE the node DELETE (e.g. recordEdgeTombstonesForSymbols over symbol_ids whose file_id NOT IN code_files), mirroring
- **R2** (003-T002, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1505`: Wrap the cleanupOrphans body in d.transaction(() => { ... })() so tombstone recording and the node/edge deletes commit atomically, matching removeFile/replaceNodes/replaceEdges.
- **R3** (003-T003, P2) — `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1141`: Replace with the literal `1` (the correct neutral seed for a min-reduce over confidences in [0,1]), or drop the seed and special-case empty chains explicitly if a distinct seed value was ever intended
- **R4** (003-T004, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:412`: Stamp truncationReason only on entries actually affected: 'trace_limit' only when this file was the one omitted (or attach a section-level flag instead), 'deadline' only on entries recorded after the 
- **R5** (003-T005, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:482`: Derive ambiguous for neighbor entries from edge evidence (e.g. evidenceClass==='INFERRED' or confidence below a threshold), or document that 'ambiguous' refers solely to anchor-resolution identity and
- **R6** (003-T006, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:459`: On a same-depth collision, append the additional edge to edgeChain (or keep the highest-confidence edge) instead of discarding; or document that the breadcrumb is a single representative path.
- **R7** (003-T007, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:487`: Remove lines 487-499, or add an assertion/comment that expandAnchor is symbol-anchor-only since buildContext pre-handles file anchors.
- **R8** (003-T008, P2) — `.opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:223`: Guard addDocument against an already-present symbolId (early-return or rebuild that doc's postings) so the exported SymbolPackedBm25Index is safe for arbitrary callers, not only the dedup-guaranteed D

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Every finding resolved (fixed, or refuted-with-reason recorded in the registry).
- vitest per fix against a fixture graph DB.
- No regression to prior epic-sweep remediations; whole-gate delta reported.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Asserted findings may be false positives (Round-2 refuted 3/16 code candidates) — confirm against cited code before editing.
- Doc/metadata edits must keep validate.sh --strict green.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time; raise per-task if a cited finding proves refuted on inspection.
<!-- /ANCHOR:questions -->
