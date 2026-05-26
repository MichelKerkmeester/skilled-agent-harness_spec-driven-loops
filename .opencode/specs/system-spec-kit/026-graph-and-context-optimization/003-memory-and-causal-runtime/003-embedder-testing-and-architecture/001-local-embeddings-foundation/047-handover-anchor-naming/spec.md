---
title: "Feature Specification: Handover Anchor Naming Alignment"
description: "Align handover_state routing with the handover template and existing handover docs so routed saves no longer target a missing session-log anchor."
trigger_phrases:
  - "handover anchor naming"
  - "session-notes"
  - "session-log"
  - "handover_state routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming"
    last_updated_at: "2026-05-14T16:53:14Z"
    last_updated_by: "codex"
    recent_action: "Aligned handover routing to session-notes"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "047-handover-anchor-naming"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Template and existing handover docs use session-notes; router expectation was wrong."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Handover Anchor Naming Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`memory_save({ filePath: ".../014-local-embeddings-migration/handover.md", routeAs: "handover_state" })` routed to `handover.md::session-log`, but the handover template and live handover files use the `session-notes` anchor. The result was a planner blocker before the save could even evaluate the correct handover section.

### Purpose

Make `handover_state` routing target the canonical `session-notes` handover anchor and keep router tests, structural merge validation, and memory-save planner behavior aligned with that contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Map the divergence between the handover template, existing handover docs, router constants, tests, and save workflow reference docs.
- Update the router to target `session-notes`.
- Keep `handover.md::session-notes` appendable as a free-form section even when existing notes contain tables.
- Preserve explicit `routeAs` overrides as auditable warnings instead of structural blockers.
- Remove the false empty template-contract blocker produced by V-rule early returns.

### Out of Scope

- Rewriting existing 014 handover content.
- Migrating handover docs from `session-notes` to `session-log`; evidence showed `session-notes` is canonical.
- Solving the 014 handover V8 quality advisory, which is a separate cross-spec-content issue.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modify | Change default handover route anchor from `session-log` to `session-notes`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modify | Assert `handover_state` targets `session-notes`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts` | Modify | Update recent handover anchor fixture to `session-notes`. |
| `.opencode/skills/system-spec-kit/references/memory/save_workflow.md` | Modify | Update the canonical save router table to `handover.md::session-notes`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Modify | Treat handover `session-notes` as section-shaped and downgrade accepted drop-route overrides to warnings. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts` | Modify | Add regressions for handover session-notes append legality and accepted route override warnings. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Stop V-rule early returns from fabricating an empty template-contract blocker. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Router must target the actual handover anchor. | `handover_state` decisions return `handover.md`, `session-notes`, `append-section`. |
| REQ-002 | Existing handover docs must not require anchor renaming. | Grep evidence shows template and live docs already use `session-notes`. |
| REQ-003 | Planner must not fail with missing `session-log`. | Live diagnostic returns `targetAnchorId: "session-notes"` and no missing-anchor blocker. |
| REQ-004 | Focused tests must lock the behavior. | Router and spec-doc-structure Vitests pass. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Save workflow docs must match runtime behavior. | `save_workflow.md` lists `handover.md::session-notes`. |
| REQ-006 | Generated runtime must be refreshed. | `npm run build` passes after source changes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "session-log|session_log"` no longer finds the router/test/reference mismatch in active handover routing surfaces.
- **SC-002**: Focused Vitest suite passes for content router, intent routing, and spec-doc-structure.
- **SC-003**: Live `memory_save({ routeAs: "handover_state" })` planner reports `status: "planned"` with `blockers: []`.
- **SC-004**: 046 strict validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing handover notes contain tables inside free-form notes | Merge legality could classify the whole anchor as table-only | Special-case `handover.md::session-notes` as section-shaped. |
| Risk | `routeAs` forced saves can look drop-shaped | Planner could block an explicit operator override | Keep no-override drop content as error; accepted overrides become warnings. |
| Dependency | 014 handover V8 quality rule | Dry-run `would_pass` remains false on the large existing handover | Document as separate advisory; live planner route is blocker-free. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Router classification remains constant-time for default target selection.

### Security
- **NFR-S01**: No broad bypass for drop-shaped routed content; only explicit accepted route overrides downgrade the drop diagnostic.

### Reliability
- **NFR-R01**: Generated `dist/` artifacts are rebuilt so live MCP handlers use the same route contract as TypeScript source.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Handover `session-notes` with tables remains append-section compatible.
- Handover `session-notes` without tables remains append-section compatible.

### Error Scenarios
- Natural drop content without an accepted override still hard-fails cross-anchor contamination.
- V8 quality advisory on the existing 014 handover does not reappear as a fake template-contract blocker.

### State Transitions
- Planner-only routeAs diagnostics can now reach `planned` state with warnings instead of being blocked by anchor or template-contract drift.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Router, validation, handler classification, docs, focused tests. |
| Risk | 12/25 | Save routing and planner response semantics are shared surfaces. |
| Research | 10/20 | Required template/doc/router divergence map and live diagnostic verification. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
