---
title: "Feature Specification: 014 Manual Testing Validation"
description: "Level 2 packet for end-to-end manual testing of the Skill Advisor surface via cli-opencode native MCP tool calls."
trigger_phrases:
  - "013/009/014 manual testing"
  - "advisor manual testing validation"
  - "skill advisor playbook run"
  - "014 manual testing"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/014-manual-testing-validation"
    last_updated_at: "2026-05-14T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Manual testing validation closed out with strict docs repaired and plugin bridge tests recovered"
    next_safe_action: "Commit scoped close-out changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: 014 Manual Testing Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

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
| **Spec Folder** | `014-manual-testing-validation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The post-013/009 Skill Advisor extraction needed end-to-end manual validation from the OpenCode runtime, not only package-level tests. The manual playbook covered 42 scenarios across native MCP tools, hooks and plugin behavior, compatibility controls, daemon behavior, indexing, lifecycle routing, scorer fusion, and Python compatibility.

### Purpose

Validate the live advisor surface using native `mcp__system_skill_advisor__*` and `mcp__system_skill_advisor__skill_graph_*` calls, classify every scenario as PASS, FAIL, INCONCLUSIVE, or GAP, and record the close-out evidence in a strict-validating Level 2 packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Run all 42 scenario files from the manual testing playbook.
- Bucket each scenario as PASS, FAIL, INCONCLUSIVE, or GAP.
- Validate all advisor MCP tools are live-callable from OpenCode.
- Verify cross-runtime hook behavior through file inspection where direct hook execution is outside the MCP surface.
- Record final binding counts and strict-validation evidence.
- Repair this packet's strict template, anchor, frontmatter, and checklist priority compliance during close-out.

### Out of Scope

- Advisor production code changes during the manual-testing packet.
- Tool-id, server-id, or skill-id renames.
- Branch creation, force-push, or `--no-verify`.
- Fixing unrelated vitest failures outside the plugin bridge compatibility surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Align packet specification with Level 2 template. |
| `plan.md` | Modify | Align packet plan with Level 2 template. |
| `tasks.md` | Modify | Align task ledger with Level 2 template. |
| `checklist.md` | Modify | Normalize checklist priority tags and required sections. |
| `implementation-summary.md` | Modify | Record close-out evidence in required summary sections. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Manual validation covers all playbook scenarios. | Final summary records 42 scenarios with PASS, FAIL, INCONCLUSIVE, and GAP counts. |
| REQ-002 | P0 and P1 coverage meets the manual gate. | P0+P1 PASS rate is at least 80 percent, with every non-PASS result explained. |
| REQ-003 | Advisor MCP tool surface is live-callable. | `advisor_recommend`, `advisor_status`, `advisor_validate`, `advisor_rebuild`, and skill graph tools are exercised or verified. |
| REQ-004 | Packet 014 strict validation passes. | `validate.sh 014-manual-testing-validation --strict` exits 0. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Plugin bridge vitest regression is classified. | Both plugin bridge compat suites pass after restoring the expected spec-kit workspace dependency install. |
| REQ-006 | Parent and lane validation are not regressed. | Strict validation passes for parent `009-system-skill-advisor-extraction` and lane `002-skill-advisor-semantic-lane`. |
| REQ-007 | Scope remains within the dispatch whitelist. | Staged changes include only the authorized packet docs and any authorized regression evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Packet 014 strict validation passes with zero errors.
- **SC-002**: Advisor vitest is at least 291 passing tests, or the plugin bridge failures are explicitly documented as non-regressions.
- **SC-003**: Parent `009` and lane `013` strict validation pass.
- **SC-004**: No production bugs are introduced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Runtime-only scenarios cannot be fully exercised through MCP | Some daemon and Python compatibility checks remain INCONCLUSIVE. | Record each limitation with evidence and keep PASS/FAIL/GAP counts honest. |
| Risk | Partial local `node_modules` tree hides source truth | Plugin bridge subprocess can exit 1 before fail-open logic runs. | Restore the system-spec-kit workspace install and rerun the compat suites. |
| Dependency | D2b extraction and advisor graph state | Manual testing assumes 011, 012, and 013 shipped. | Read D2b summary and validate current tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Validation claims must be backed by fresh command output.
- **NFR-R02**: INCONCLUSIVE scenario results must identify the missing runtime capability.

### Maintainability

- **NFR-M01**: Packet docs must use the canonical Level 2 section and anchor contract.
- **NFR-M02**: Checklist entries must use `CHK-NNN [PN]` priority tags for validator compatibility.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Runtime Boundaries

- Python shim and daemon lifecycle scenarios can be INCONCLUSIVE when the OpenCode MCP surface cannot safely manipulate those runtime states.
- Plugin bridge tests can fail from a partial dependency install even when source code is unchanged.

### Validation Boundaries

- Strict validation must pass for the packet even when historical manual-testing content was scaffolded by another runtime.
- Parent and lane validation must be checked after packet edits because nested docs feed continuity surfaces.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five packet docs plus test evidence classification. |
| Risk | 12/25 | Cross-package plugin bridge dependency state affected test results. |
| Research | 10/20 | Required manual dispatch log, D2b summary, bridge tests, and template contracts. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option C for updating the related 013/009/014 packet.
<!-- /ANCHOR:questions -->
