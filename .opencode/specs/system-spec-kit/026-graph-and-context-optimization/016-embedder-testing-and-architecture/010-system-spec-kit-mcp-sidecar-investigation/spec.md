---
title: "System-Spec-Kit MCP Sidecar Investigation — Phase Parent"
description: "Lean phase parent for investigating system-spec-kit MCP sidecar-related code for drift, dead code, security risks, over-engineering, simplification opportunities, and refinement."
trigger_phrases:
  - "system-spec-kit mcp sidecar investigation"
  - "arc 010 sidecar investigation"
  - "sidecar drift simplification research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation"
    last_updated_at: "2026-05-22T21:00:18Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-arc-010-sidecar-investigation-parent"
    next_safe_action: "run-001-deep-research-drift-and-simplification"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
      - "001-deep-research-drift-and-simplification/"
    session_dedup:
      fingerprint: "sha256:0100100100100100100100100100100100100100100100100100100100100100"
      session_id: "016-embedder-testing-and-architecture-010"
      parent_session_id: null
    completion_pct: 0
    status: "planned"
    open_questions: []
    answered_questions:
      - "Parent dispatch pre-approved arc 010 scaffold and nested research child."
      - "Literal-naming discipline satisfied by system-spec-kit-mcp-sidecar-investigation and deep-research-drift-and-simplification."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# System-Spec-Kit MCP Sidecar Investigation

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This is a lean phase-parent control file. Control docs stay limited to
  {spec.md, description.json, graph-metadata.json}. Heavy working docs live in
  child phase folders where they stay accurate to that phase's actual research.
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

Investigate the system-spec-kit MCP server sidecar-related surface for drift, dead code, security risks, over-engineering, simplification opportunities without function loss, and refinement candidates. This arc is research-only: it produces actionable evidence for a later remediation packet and does not implement fixes.

Reference scout findings set the initial inspection boundary: the primary sidecar surface is about 1,076 LOC across `mcp_server/lib/embedders/sidecar-client.ts` (548), `sidecar-worker.ts` (229), and `.opencode/bin/lib/ensure-rerank-sidecar.cjs` (299). The broader supporting embedders layer is about 1,845 LOC total. This is a high-churn surface with 3 commits in the last 30 days, and the initial sidecar feature landed in commit `0d14b39` about 8 days before this scaffold.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Priority | Status |
|---|---|---|---|
| `001-deep-research-drift-and-simplification/` | Deep research on sidecar drift, dead code, security, over-engineering, simplification, and refinement | P0 | Planned |
| `002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/` | Phased remediation packet for P0/P1 resource bounds, lifecycle, and TS/CJS rerank parity findings from arc 010/001 | P0 | Planned |

### Phase Transition Rules

- Child phases own detailed research plans, tasks, checklists, state, and synthesis files.
- Research outputs identify findings and evidence only; implementation remains out of scope for arc 010.
- The parent `graph-metadata.json` points to the active child through `derived.last_active_child_id`.
- A later remediation packet must cite the child research synthesis before editing sidecar code.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-deep-research-drift-and-simplification` | Follow-on remediation packet | 20 iterations complete, convergence event recorded, findings registry populated, and final synthesis categorized across all six angles | Child strict validation exits 0 and `research/research.md` or final synthesis section is present. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

1. Run `001-deep-research-drift-and-simplification/` to produce a 20-iteration evidence base across drift detection, dead-code discovery, security review, over-engineering analysis, simplification opportunities, and refinement options.
<!-- /ANCHOR:what-needs-done -->
