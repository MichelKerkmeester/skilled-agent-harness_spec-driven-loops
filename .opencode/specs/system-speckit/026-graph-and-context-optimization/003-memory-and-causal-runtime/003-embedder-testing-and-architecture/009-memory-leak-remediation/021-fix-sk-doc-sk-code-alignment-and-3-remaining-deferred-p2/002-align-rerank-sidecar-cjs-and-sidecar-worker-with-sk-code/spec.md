---
title: "Spec: Rerank Sidecar CJS and Sidecar Worker sk-code Alignment"
description: "Level 2 packet aligning ensure-rerank-sidecar.cjs JSDoc/module sections and sidecar-worker.ts TSDoc with sk-code documentation standards without logic changes."
trigger_phrases:
  - "021 002 rerank sidecar sk-code alignment"
  - "ensure-rerank-sidecar JSDoc"
  - "sidecar-worker TSDoc"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code"
    last_updated_at: "2026-05-23T12:05:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
    session_dedup:
      fingerprint: "sha256:0210020210020210020210020210020210020210020210020210020210020210"
      session_id: "021-002-sk-code-rerank-sidecar-worker-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 spec folder and branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Rerank Sidecar CJS and Sidecar Worker sk-code Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (021 sk-doc/sk-code alignment parent) |
| **Predecessors** | `../001-identify-and-close-3-remaining-deferred-p2/implementation-summary.md`; `fbb8a23cda`; `e5113fedc4`; `8dfafc7189`; `f081112aab` |
| **Handoff Criteria** | Documentation-only source edits; both sk-code drift verifiers pass; embedders vitest passes; launcher vitest passes; mcp-server typecheck passes; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two sidecar files have documented sk-code drift. `.opencode/bin/lib/ensure-rerank-sidecar.cjs` lacks the required module banner, section dividers, and JSDoc for exported and non-trivial helpers. `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` has the correct module/section structure but internal helpers lack TSDoc.

### Purpose
Align both files with the recent sk-code documentation style sweep while preserving runtime behavior exactly. This packet is a pure documentation pass: no function renames, variable renames, import reordering, control-flow edits, or fixture changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `MODULE: rerank-sidecar launcher` boxed header below `'use strict';` in `ensure-rerank-sidecar.cjs`.
- Add section dividers to `ensure-rerank-sidecar.cjs` for imports, constants/errors, utility helpers, config hash, owner token, owner identity, ledger I/O, reaper/pre-flight reap, spawn path, and exports.
- Add JSDoc to exported functions and non-trivial internal helpers in `ensure-rerank-sidecar.cjs`, including params, returns, and explicit throws where applicable.
- Add TSDoc to listed internal helpers in `sidecar-worker.ts`, including params, returns, and throws where applicable.
- Update this packet's Level 2 docs with verification evidence.

### Out of Scope
- Runtime behavior changes.
- Renaming functions, parameters, variables, classes, or exported names.
- Reordering imports or moving code beyond documentation placement.
- Editing tests or sibling source files.
- Git commit, push, or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Add CJS module/section headers and JSDoc only |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modify | Add TSDoc only; keep existing module and sections |
| `<this-folder>/*.md` | Modify | Record scaffold, plan, checklist evidence, ADR, verification, and handoff |
| `<this-folder>/description.json` | Generate | Metadata for memory/spec graph visibility |
| `<this-folder>/graph-metadata.json` | Generate | Graph metadata for packet visibility |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve logic exactly | Diff contains comments/docstrings/section headers only in source files |
| REQ-002 | CJS module header | `ensure-rerank-sidecar.cjs` keeps `'use strict';` and has `MODULE: rerank-sidecar launcher` immediately after |
| REQ-003 | CJS section dividers | Logical blocks in `ensure-rerank-sidecar.cjs` have sk-code-style section dividers |
| REQ-004 | CJS JSDoc coverage | Exported and non-trivial helper functions/classes in `ensure-rerank-sidecar.cjs` have JSDoc with param/return/throws where applicable |
| REQ-005 | Worker TSDoc coverage | Listed helpers in `sidecar-worker.ts` have TSDoc with param/return/throws where applicable |
| REQ-006 | Drift verifier coverage | `verify_alignment_drift.py` exits 0 for `.opencode/bin/lib` and the embedders lib scope |

### P1 - Required (complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Preserve embedders behavior | Requested embedders vitest command exits 0, with one F48 retry allowed |
| REQ-008 | Preserve launcher behavior | Requested `ensure-rerank-sidecar.vitest.ts` command exits 0, with one F48 retry allowed |
| REQ-009 | Preserve type safety | `npm run typecheck --workspace=@spec-kit/mcp-server` exits 0 |
| REQ-010 | Preserve packet docs | Scaffold and final `validate.sh <spec-folder> --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ensure-rerank-sidecar.cjs` has the requested module banner, logical section dividers, and JSDoc for exported/non-trivial helpers.
- **SC-002**: `sidecar-worker.ts` has TSDoc on the 19 listed helper functions.
- **SC-003**: Source diffs contain no executable code changes.
- **SC-004**: Both drift verifier scopes exit 0.
- **SC-005**: Requested vitest/typecheck/spec-validation gates exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Comment insertion accidentally moves or edits code | High | Inspect diff for source lines without `+//`, `+/**`, or `+ *` additions only |
| Risk | Section headers conflict with verifier expectations | Medium | Use existing sk-code header/divider conventions and run both drift verifier scopes |
| Risk | TSDoc claims throw behavior inaccurately | Medium | Read helper bodies and document only real throw paths |
| Dependency | Existing sidecar test suites | Medium | Run both requested vitest commands and typecheck |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Documentation states helper intent, inputs, outputs, and failure modes without duplicating implementation line-by-line.

### Reliability
- **NFR-R01**: Runtime code remains byte-for-byte equivalent except added comments/docblocks and section headers.

### Security
- **NFR-S01**: New comments do not expose secrets, tokens, environment values, or operationally sensitive payloads.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Documentation Boundaries
- Helpers that only normalize optional dependency bags should document dependency injection behavior without implying production-only semantics.
- Functions that swallow errors intentionally should document fallback behavior rather than declaring throws.

### Error Scenarios
- If any verification command fails for a non-F48 reason, implementation stops and the packet records DEFERRED evidence.
- If the diff shows logic changes, those changes are reverted before continuing.

### State Transitions
- Packet starts as documentation-only alignment and completes only after checklist evidence and strict validation are synchronized.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Two source files plus packet docs |
| Risk | 12/25 | Documentation-only, but high function count and launcher surface |
| Research | 8/20 | Requires predecessor style exemplars and verifier gates |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. User specified scope, files, verification commands, and no-commit constraint.
<!-- /ANCHOR:questions -->
