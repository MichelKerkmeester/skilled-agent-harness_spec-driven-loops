---
title: "Feature Specification: sk-design structural anomalies"
description: "Four small independent structural items across sk-design modes: a vestigial node_modules stub to remove, an operator decision on loose .mjs executables to record as Planned, a missing benchmark index to add, and two legitimate absences to record without fixing."
trigger_phrases:
  - "sk-design structural anomalies"
  - "design-mcp-open-design loose executables"
  - "compiled-routing missing index"
  - "vestigial node_modules stub"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T14:53:08.592Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec covering four independent structural items"
    next_safe_action: "Remove the vestigial node_modules stub (lowest-risk item first)"
    blockers:
      - "Loose .mjs executables decision requires operator input before any move"
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
      - ".opencode/skills/sk-design/design-mcp-open-design/"
      - ".opencode/skills/sk-design/benchmark/reports/compiled-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: sk-design structural anomalies
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — no work started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four small, unrelated structural irregularities surfaced during the hub-wide template audit that don't belong to any single mode's own conformance child: a vestigial empty test-result stub sitting where a real dependency install would go, four loose executable scripts at a packet root when every sibling mode keeps its executables under `scripts/` or `corpus/`, a benchmark run-category directory missing the index file its siblings all have, and two structural absences (`procedures/` in one mode, `scripts/` in another) that are legitimate rather than gaps.

### Purpose

Resolve the two clearly mechanical items (the stub, the missing index), explicitly record the loose-executables tradeoff as an operator decision rather than sweeping it, and record the two legitimate absences without inventing a fix for something that isn't broken.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Removing `.opencode/skills/sk-design/design-md-generator/node_modules/`, confirmed to contain only `.vite/vitest/<empty-sha>/results.json` and nothing else.
- Adding a missing index file (`README.md`) to `.opencode/skills/sk-design/benchmark/reports/compiled-routing/`, modeled on the pattern its sibling run directories (`baseline/`, `2026-07-06--after-009--router/`, etc.) already use — each has its own `README.md`; `compiled-routing/` is the one sibling missing one.
- Recording, without executing, the tradeoff for moving `design-mcp-open-design`'s four root-level `.mjs` files (`grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, `return-reconciliation.mjs`) under `scripts/` — left explicitly Planned pending operator input.
- Recording, without fixing, that `design-mcp-open-design` has no `procedures/` and `design-motion` has no `scripts/` — both are legitimate absences, not gaps.

### Out of Scope

- Moving the four `.mjs` files — that requires an operator decision (see Open Questions) and, once made, updates to `return-reconciliation.mjs:9`'s import, the transport tests, and `shared/scripts/design-command-surface-check.mjs`. None of that executes in this packet.
- Any other mode's own template/structure conformance (owned by children 002-007).
- Adding a `procedures/` to `design-mcp-open-design` or a `scripts/` to `design-motion` — both would be manufacturing structure the modes don't need.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/node_modules/` | Delete | Vestigial stub containing only an empty vitest result cache |
| `benchmark/compiled-routing/README.md` | Create | Missing index, modeled on sibling run-directory `README.md` files |
| `design-mcp-open-design/*.mjs` (4 files) | None (decision recorded only) | Left Planned; see Open Questions |
| (no path — record only) | Documented, not fixed | `design-mcp-open-design/procedures/` and `design-motion/scripts/` absences recorded as legitimate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `design-md-generator/node_modules/` is removed | `find .opencode/skills/sk-design/design-md-generator/node_modules` returns "No such file or directory"; `design-md-generator/backend/node_modules/` (the real install) is untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `benchmark/compiled-routing/README.md` exists and indexes its run subdirectories | File exists; lists `2026-07-21--playbook-verify--sonnet`, `2026-07-21--real--luna-high`, `2026-07-21--verify--luna-high` (or whatever subdirectories exist at authoring time) |
| REQ-003 | The `.mjs` relocation tradeoff is recorded with both sides stated, not silently swept | Open Questions section names the affected import (`return-reconciliation.mjs:9`), the transport tests, and `design-command-surface-check.mjs` |
| REQ-004 | The two legitimate absences are recorded without a fabricated fix | Spec states both absences and why each is legitimate, with no corresponding task to add the missing folder |
| REQ-005 | The stub removal never touches the real `design-md-generator/backend/node_modules/` install | `ls .opencode/skills/sk-design/design-md-generator/backend/node_modules` still resolves after REQ-001 executes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The vestigial stub is gone and the real `backend/node_modules/` install is unaffected.
- **SC-002**: `benchmark/compiled-routing/` has the same self-describing index its sibling benchmark directories have.
- **SC-003**: The `.mjs` decision and the two legitimate absences are documented, not acted on without operator sign-off.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Confusing the vestigial `design-md-generator/node_modules/` stub with the real `backend/node_modules/` install | Deleting the wrong directory breaks a real dependency install | Verify the stub's only content is `.vite/vitest/<empty-sha>/results.json` before deleting; never touch `backend/node_modules/` |
| Risk | Sweeping the `.mjs` move without operator input | Breaks `return-reconciliation.mjs:9`'s import, transport tests, and `design-command-surface-check.mjs` without sign-off | Leave explicitly Planned; do not move in this packet |
| Dependency | Sibling `benchmark/` directory README pattern | New index must match the existing per-run `README.md` shape | Read `benchmark/baseline/README.md` before authoring the new index |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The stub-removal step never touches `design-md-generator/backend/node_modules/`, the real install.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **Stub turns out not to be empty**: if `design-md-generator/node_modules/` contains anything beyond `.vite/vitest/<empty-sha>/results.json`, halt and re-classify before deleting — do not assume the audit's snapshot is still accurate at execution time.
- **Sibling benchmark directories change shape before this packet executes**: re-read whichever run subdirectories actually exist under `compiled-routing/` at execution time rather than trusting this spec's list.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Should the four `.mjs` files at `design-mcp-open-design/`'s root move under `scripts/`?** Every other mode keeps its executables under `scripts/` or `corpus/`; `design-mcp-open-design` is the only mode with loose executables at its packet root. Moving them changes the import in `return-reconciliation.mjs:9` (`import { PAIRED_MODES } from './grounding-receipt.mjs'` would become a relative path change), the transport tests under `design-mcp-open-design/tests/`, and `shared/scripts/design-command-surface-check.mjs`. This is a deliberate tradeoff (consistency vs. churn across a live transport's import graph) requiring operator input — left **Planned**, not executed, in this packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
