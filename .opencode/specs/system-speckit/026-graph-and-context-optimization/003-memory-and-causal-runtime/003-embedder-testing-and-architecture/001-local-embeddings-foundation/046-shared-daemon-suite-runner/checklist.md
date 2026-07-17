---
title: "Verification Checklist: 045 Shared Daemon Suite Runner"
description: "Verification checklist for the direct MCP shared-daemon scenario runner."
trigger_phrases:
  - "045 checklist"
  - "shared daemon runner verification"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner"
    last_updated_at: "2026-05-14T17:53:33Z"
    last_updated_by: "cli-codex-gpt-5-5-high"
    recent_action: "Wired second cocoindex_code MCP client; 403/404/407/410 PASS via shared daemon"
    next_safe_action: "Operator: optional full-suite run 401-415; operator: commit grouping"
    blockers: []
    key_files:
      - "checklist.md"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000045"
      session_id: "046-shared-daemon-suite-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "CocoIndex execution is handled by a second shared StdioClientTransport to cocoindex_code, while memory scenarios stay on spec_kit_memory."
---
# Verification Checklist: 045 Shared Daemon Suite Runner

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-009.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` Architecture and Testing Strategy.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: SDK 1.26.0 found; memory daemon tools listed; CocoIndex `search` listed through the second shared client.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks. Evidence: `node --check _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` exited 0.
- [x] CHK-011 [P0] No console errors or warnings from runner syntax/unit checks. Evidence: syntax check and Vitest passed.
- [x] CHK-012 [P1] Error handling implemented. Evidence: unavailable tools return SKIP per server; tool errors return FAIL; both clients close in `finally`.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: Node ESM, scoped helpers, and explicit verification paths.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met for the targeted shared-daemon smoke. Evidence: 403 PASS, 404 PASS, 407 PASS, 410 PASS.
- [x] CHK-021 [P0] Manual testing complete. Evidence: smoke command `node _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs --scenarios 403,404,407,410 </dev/null` exited 0.
- [x] CHK-022 [P1] Edge cases tested. Evidence: parser unit covers unquoted keys and `num_results`; routing unit covers memory, CocoIndex, and unknown server selection.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: unavailable surfaces still return controlled SKIP; CocoIndex transient startup failures are retried narrowly.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: architectural gap closure with shared CocoIndex MCP routing.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: launcher and `StdioServerTransport` references inspected.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: only parser vitest imports runner helper.
- [x] CHK-FIX-004 [P0] Parser fixes include adversarial cases where applicable. Evidence: unquoted object keys and alias normalization covered.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: `plan.md` affected surfaces section includes memory, CocoIndex, and unavailable server routing.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable. Runner uses explicit repo paths and closes its daemon client.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit files and command outputs in this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: runner reads no secret values and writes no env dump.
- [x] CHK-031 [P0] Input validation implemented. Evidence: scenario list parser accepts numeric ids and ranges; missing files SKIP.
- [x] CHK-032 [P1] Auth/authz not applicable. Runner is local evidence tooling.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: docs name the same files, two-client architecture, smoke result, and shipped state.
- [x] CHK-041 [P1] Code comments adequate. Evidence: runner helpers are named and straightforward; no extra prose required.
- [x] CHK-042 [P2] README update not applicable. Evidence: packet-local docs include run recipe.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only or evidence locations. Evidence: runner and TSV live in requested `_sandbox/.../evidence`; 410 workload lives in requested `_sandbox/.../410`.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: no scratch files created in 045 packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->
