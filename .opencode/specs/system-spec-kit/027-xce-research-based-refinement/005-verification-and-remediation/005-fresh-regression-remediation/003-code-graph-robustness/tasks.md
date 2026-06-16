---
title: "Tasks: Code-Graph Engine Robustness Remediation"
description: "One task per deep-review finding in this sub-phase (8 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/tasks.md"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code-Graph Engine Robustness Remediation

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] 003-S1 Capture the subsystem test/validation baseline.
- [ ] 003-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [ ] 003-T001 · `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1508` — Record edge tombstones for edges referencing the soon-to-be-deleted orphan nodes BEFORE the node DELETE (e.g. recordEdgeTombstonesForSymbols over symbol_ids whose file_id NOT IN code_files), mirroring _[P2]_
- [ ] 003-T002 · `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1505` — Wrap the cleanupOrphans body in d.transaction(() => { ... })() so tombstone recording and the node/edge deletes commit atomically, matching removeFile/replaceNodes/replaceEdges. _[P2]_
- [ ] 003-T003 · `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1141` — Replace with the literal `1` (the correct neutral seed for a min-reduce over confidences in [0,1]), or drop the seed and special-case empty chains explicitly if a distinct seed value was ever intended _[P2]_
- [ ] 003-T004 · `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:412` — Stamp truncationReason only on entries actually affected: 'trace_limit' only when this file was the one omitted (or attach a section-level flag instead), 'deadline' only on entries recorded after the  _[P2]_
- [ ] 003-T005 · `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:482` — Derive ambiguous for neighbor entries from edge evidence (e.g. evidenceClass==='INFERRED' or confidence below a threshold), or document that 'ambiguous' refers solely to anchor-resolution identity and _[P2]_
- [ ] 003-T006 · `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:459` — On a same-depth collision, append the additional edge to edgeChain (or keep the highest-confidence edge) instead of discarding; or document that the breadcrumb is a single representative path. _[P2]_
- [ ] 003-T007 · `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:487` — Remove lines 487-499, or add an assertion/comment that expandAnchor is symbol-anchor-only since buildContext pre-handles file anchors. _[P2]_
- [ ] 003-T008 · `.opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:223` — Guard addDocument against an already-present symbolId (early-return or rebuild that doc's postings) so the exported SymbolPackedBm25Index is safe for arbitrary callers, not only the dedup-guaranteed D _[P2]_
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] 003-V1 vitest per fix against a fixture graph DB.
- [ ] 003-V2 Whole-gate delta reported (no regressions).
- [ ] 003-V3 Update each finding's status in the registry (fixed/refuted).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 8 findings resolved (fixed or refuted-with-reason); verification gate green. No fixes applied in this scaffold.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
