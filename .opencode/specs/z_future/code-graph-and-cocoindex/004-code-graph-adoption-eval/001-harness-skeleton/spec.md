---
title: "Feature Specification: 001 Harness Skeleton"
description: "Sequential bootstrap child for the code graph adoption eval CLI orchestrator skeleton and module-loader plumbing."
trigger_phrases:
  - "027 006 001 harness skeleton"
  - "code graph adoption eval harness skeleton"
  - "code-graph-adoption-eval.js"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/001-harness-skeleton"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement orchestrator skeleton and module-loader plumbing"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-001-harness-skeleton"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 001 Harness Skeleton

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval` |
| **Depends On** | None |
| **Estimated LOC** | ~200 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The adoption evaluation needs a runnable CLI entry before token metrics, task fixtures, report generation, and stress integration can attach to it. Without the bootstrap, parallel children would invent incompatible input and output contracts.

### Purpose
Create the sequential harness skeleton for `code-graph-adoption-eval.js`, including module-loader plumbing, CLI argument parsing boundaries, run directory conventions, and extension points for the later child packets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the CLI entry skeleton for `code-graph-adoption-eval.js`.
- Define loader hooks for token measurement, fixture loading, and report generation.
- Establish baseline and after condition naming.
- Establish run output directory and JSONL row handoff contract.

### Out of Scope
- Token DB query implementation.
- Final task fixture content.
- Report rendering math.
- Stress test coverage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/scripts/dist/eval/code-graph-adoption-eval.js` | Create | CLI orchestrator skeleton and module-loader plumbing |
| `mcp_server/scripts/dist/eval/README.md` | Create/Modify | Minimal invocation notes if needed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CLI skeleton accepts task/run options | Invalid options fail fast; valid options produce a normalized run config |
| REQ-002 | Module-loader contract is defined | Later children can plug in token, fixture, and report modules without rewriting the CLI |
| REQ-003 | Baseline and after conditions are represented explicitly | Result rows include `condition: "baseline" | "after"` |
| REQ-004 | Incremental output path convention exists | Run rows can be written under a stable per-run directory |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | CLI supports dry-run validation | Dry run prints planned task/condition matrix without dispatching subprocesses |
| REQ-006 | Skeleton leaves clear seams for subprocess hardening | Dispatcher placeholder is injectable and testable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `code-graph-adoption-eval.js --dry-run` can construct the run matrix.
- Later children 002, 003, and 004 can work against stable loader contracts.
- Child 005 can test the skeleton without invoking live providers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Skeleton over-specifies later module internals | Medium | Keep contracts around inputs/outputs only |
| Risk | CLI path differs from repo conventions | Medium | Match existing `mcp_server/scripts/dist/eval` layout |
| Dependency | Earlier code_graph tools | Low for skeleton | Runtime after condition remains blocked until parent dependencies land |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Dry-run execution must avoid provider subprocess calls.
- **NFR-M01**: Loader contracts should be documented in code-level names, not hidden in comments only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Missing task file: fail before any run directory writes.
- Empty task set: report configuration error.
- Unknown condition: fail before dispatch.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | Low | Bounded child packet with a narrow implementation surface |
| Risk | Medium | Integration with the parent harness contract must stay aligned |
| Dependencies | Medium | Depends on the declared predecessor packets |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:related-docs -->

