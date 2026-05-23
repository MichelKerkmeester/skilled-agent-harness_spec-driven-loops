---
title: "Checklist: Rerank Sidecar CJS and Sidecar Worker sk-code Alignment"
description: "Verification checklist for documentation-only JSDoc/TSDoc alignment in the rerank sidecar launcher and sidecar worker."
trigger_phrases:
  - "021 002 checklist"
  - "rerank sidecar alignment checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded"
    next_safe_action: "Add documentation-only source annotations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0210020210020210020210020210020210020210020210020210020210020210"
      session_id: "021-002-sk-code-rerank-sidecar-worker-docs"
      parent_session_id: null
    completion_pct: 10
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: Rerank Sidecar CJS and Sidecar Worker sk-code Alignment

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [ ] CHK-003 [P0] Scaffold strict validation passes before source edits
- [x] CHK-004 [P0] User pre-approved branch `main`, Level 2 folder, no commit, and two target source files
- [x] CHK-005 [P0] sk-code OpenCode JS/TS style references read
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `ensure-rerank-sidecar.cjs` keeps `'use strict';` and gains the requested module header
- [ ] CHK-011 [P0] `ensure-rerank-sidecar.cjs` has logical section dividers
- [ ] CHK-012 [P0] `ensure-rerank-sidecar.cjs` exported and non-trivial helpers have JSDoc
- [ ] CHK-013 [P0] `sidecar-worker.ts` listed helpers have TSDoc
- [ ] CHK-014 [P0] Source diff contains documentation-only changes
- [ ] CHK-015 [P0] Forbidden sibling files remain untouched by this packet
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Drift verifier passes for `.opencode/bin/lib`
- [ ] CHK-021 [P0] Drift verifier passes for mcp-server embedders lib
- [ ] CHK-022 [P0] Embedders vitest passes
- [ ] CHK-023 [P0] Launcher vitest passes
- [ ] CHK-024 [P0] mcp-server typecheck passes
- [ ] CHK-025 [P0] Final strict spec validation passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Set A CJS drift is closed by header, sections, and JSDoc
- [ ] CHK-FIX-002 [P0] Set B TypeScript drift is closed by helper TSDoc
- [ ] CHK-FIX-003 [P0] ADR records documentation-only decision and exemplar evidence
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] New documentation does not expose secrets, tokens, raw payloads, or environment values
- [ ] CHK-031 [P1] Error-path documentation avoids suggesting logging of sensitive runtime values
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `decision-record.md` includes the requested ADR
- [ ] CHK-042 [P1] `implementation-summary.md` includes verification and commit handoff
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No files outside approved source/docs scope are modified by this packet
- [ ] CHK-051 [P1] No git commit or branch mutation performed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 4/23 |
| P1 Items | 5 | 1/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-23

### Set Closure

| Set | Status | Evidence |
|-----|--------|----------|
| Set A | Pending | `ensure-rerank-sidecar.cjs` doc additions not yet verified |
| Set B | Pending | `sidecar-worker.ts` TSDoc additions not yet verified |
<!-- /ANCHOR:summary -->
