---
title: "Feature Specification: Fix Stress Docs"
description: "Repair confirmed stress-test documentation drift by aligning catalog, playbook, and stress_test README surfaces with the shipped automated Vitest harness."
trigger_phrases:
  - "stress test docs fix"
  - "automated stress harness documentation"
  - "substrate cleanup README"
  - "durability stress README"
  - "search quality stress README"
importance_tier: "normal"
contextType: "implementation"
parent: "../spec.md"
predecessor: "011-fix-code-graph-docs"
successor: "003-stress-and-skillmd-audit"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment/002-fix-stress-docs"
    last_updated_at: "2026-07-05T09:52:31Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Patched stress docs"
    next_safe_action: "No further action"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/feature_catalog/stress-testing/category-overview.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/stress-testing/README.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/stress-testing/run-stress-cycle.md"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stress-docs-fix-2026-07-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder was pre-approved by the user."
---
<!-- SPECKIT_TEMPLATE_SOURCE: level_1/spec.md | v2.2 -->
# Feature Specification: Fix Stress Docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | Current worktree, no commit requested |
| **Predecessor** | ../001-false-now-doc-corrections/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The stress-test documentation had five confirmed drifts from the shipped `mcp_server/stress_test/**` harness. The catalog and manual playbook described only the operator-run narrative cycle, while domain READMEs omitted real tests, referenced a phantom search-quality test, and missed the substrate sandbox cleanup behavior.

### Purpose
Bring the in-scope stress-test docs back to current reality without touching `SKILL.md`, changelog files, or any code/test files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the automated Vitest stress harness in the stress-testing catalog and playbook surface.
- Align stress_test README tables with the real domain folders and scripts.
- Update domain README file inventories for durability, search-quality, and substrate.
- Document substrate `--clean`, hermetic DB cleanup, and Vitest `afterAll` sandbox reap behavior.
- Record this implementation in the pre-approved spec folder.

### Out of Scope
- `SKILL.md` and changelog changes, because the audit confirmed those surfaces current and the user explicitly forbade touching them.
- Test or source code changes, because this packet fixes documentation only.
- `feature_catalog/pipeline-architecture/stress-test-cycle.md`, because the user scope lock allowed only `feature_catalog/stress-testing/**` for feature-catalog edits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/feature_catalog/stress-testing/category-overview.md` | Modify | Add automated harness coverage, domains, npm scripts, and version stamp. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/stress-testing/README.md` | Modify | Add automated harness cross-reference and scripts. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/stress-testing/run-stress-cycle.md` | Modify | Add automated stress-slice guidance and version stamp. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/README.md` | Modify | Add missing `durability/` key-file row and actual domain names. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md` | Modify | Add four real omitted durability tests. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md` | Modify | Remove phantom test reference and add real omitted tests. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/README.md` | Modify | Add missing files and sandbox cleanup contract. |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/005-speckit-surface-alignment/002-fix-stress-docs/` | Create | Level 1 implementation packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve scope lock. | Only the allowed docs and spec folder are modified. |
| REQ-002 | Fix catalog/playbook harness blindness. | stress-testing docs name the six real harness domains and five npm stress commands verified in `mcp_server/package.json`. |
| REQ-003 | Fix durability README inventory. | README lists all eleven real `.vitest.ts` files in `stress_test/durability/`. |
| REQ-004 | Fix search-quality README inventory. | Phantom `w11-code_graph-calibration-telemetry.vitest.ts` is removed and real omitted tests are listed. |
| REQ-005 | Fix substrate README cleanup gap. | README documents `--clean`, `.tmp-cg-db` cleanup, and Vitest `afterAll` sandbox cleanup verified in source/tests. |
| REQ-006 | Fix top-level stress README table. | KEY FILES includes `durability/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Refresh in-scope version stamps. | stress-testing docs use current system-spec-kit version `3.7.1.0` verified from `SKILL.md` and changelog file list. |
| REQ-008 | Validate the spec packet. | `validate.sh --strict` exits 0 for this spec folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the five confirmed audit findings has a before/after record in `implementation-summary.md`.
- **SC-002**: Grep checks find the new real file names and no longer find the phantom search-quality filename.
- **SC-003**: Strict spec validation passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Real `stress_test/**` file list | Incorrect docs if based only on the audit report. | Use `glob` and source reads before edits. |
| Dependency | `mcp_server/package.json` scripts | Catalog/playbook could cite non-existent commands. | Read package scripts before writing command docs. |
| Risk | Scope conflict on pipeline-architecture peer | Editing it would violate the user scope lock. | Leave that peer untouched and note the boundary. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The user pre-approved the spec folder and explicitly locked the edit scope.
<!-- /ANCHOR:questions -->
