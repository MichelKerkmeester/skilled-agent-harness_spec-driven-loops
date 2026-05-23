---
title: "Feature Specification: 044 Template contract divergence [template:level_2/spec.md]"
description: "memory_save rejected canonical V2.2 spec docs that strict validation accepted because it applied the generated-memory wrapper contract to hand-authored spec documents."
trigger_phrases:
  - "044 template contract divergence"
  - "memory_save strict validate divergence"
  - "canonical spec doc template contract"
  - "manual fallback spec doc save"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence"
    last_updated_at: "2026-05-14T16:49:00Z"
    last_updated_by: "codex"
    recent_action: "Reproduced and fixed memory_save versus strict-validate contract divergence"
    next_safe_action: "Monitor future memory_save dry-runs for canonical spec docs with specDocHealth.pass=true"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 044 Template contract divergence

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
| **Depends On** | `041-v-rule-cross-spec-overreach` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

During the 2026-05-14 substrate repair wave, several Codex-authored spec packets passed `validate.sh --strict` but `memory_save` dry-runs rejected the same canonical docs with `missing_blank_line_after_frontmatter` and `missing_section` violations. The rejected sections were generated-memory wrapper sections, not V2.2 spec-doc anchors.

### Purpose

Make `memory_save` and strict validation agree for canonical spec documents without weakening generated-memory template enforcement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reproduce the 040 `implementation-summary.md` divergence.
- Map the strict validator checks against the `memory_save` template-contract checks.
- Patch the save path so canonical spec docs that pass spec-doc health are accepted in manual-fallback mode.
- Add regression coverage for the dry-run acceptance path.

### Out of Scope

- Bulk migration of historical packet docs - not needed because spec docs remain canonical as V2.2 anchors.
- Rewriting strict validation to require generated-memory wrapper sections - rejected because it would mix two different contracts.
- Branch creation, commits, network calls, and spawned agents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Bypass generated-memory template-contract blocking for valid canonical spec docs. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Modify | Add regression for `memory_save` dry-run acceptance of a canonical spec doc. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence/` | Create | Level 2 packet documentation and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reproduce the divergence | 040 strict validation passes while pre-fix dry-run reports template-contract violations. |
| REQ-002 | Preserve generated-memory enforcement | Existing malformed generated-memory tests continue to reject invalid template content. |
| REQ-003 | Accept canonical spec docs | Dry-run for 040 `implementation-summary.md` returns `would_pass: true` after the patch. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document the contract map | Implementation summary lists memory-only markers, strict-only checks, and overlap. |
| REQ-005 | Verify packet and code | Focused Vitest, full save-pipeline Vitest, typecheck, strict validate 037/040/044 all pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_save` dry-run accepts the previously rejected 040 implementation summary while still reporting the non-blocking wrapper-contract details.
- **SC-002**: `validate.sh --strict` remains green for existing packets 037 and 040.
- **SC-003**: A regression test covers canonical spec-doc dry-run acceptance.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad bypass | Generated-memory files could skip template enforcement | Bypass is limited to manual-fallback content, passing sufficiency, known canonical spec document types, and `specDocHealth.pass=true`. |
| Risk | Spec-doc health is folder-level | A weak optional spec doc in a healthy folder could bypass wrapper checks | The bypass only applies to recognized canonical spec-doc filenames already accepted by the memory parser. |
| Dependency | Local MCP server TypeScript workspace | Regression tests and typecheck depend on local package state | Verified with targeted Vitest and `npm run typecheck --workspace=@spec-kit/mcp-server`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Dry-run remains non-mutating and does not add expensive shell validation.

### Security
- **NFR-S01**: File eligibility continues to use existing canonical spec-doc path validation.

### Reliability
- **NFR-R01**: Direct saves and dry-runs use the same bypass predicate so response and persistence behavior do not drift.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Canonical spec doc with V2.2 anchors but no generated-memory wrapper sections: accepted when spec-doc health passes.
- Generated-memory file missing wrapper sections: still rejected unless the legacy manual-fallback evidence bypass applies.
- Structural metadata JSON: unchanged existing structural metadata exemption.

### Error Scenarios
- `specDocHealth.pass=false`: template-contract violations remain blocking.
- Insufficient memory evidence: bypass does not apply because `sufficiencyResult.pass` is required.

### State Transitions
- Dry-run before fix: `would_pass=false`, structural template-contract violations.
- Dry-run after fix: `would_pass=true`, same details surfaced as non-blocking manual-fallback context.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One handler and one regression test. |
| Risk | 14/25 | Save-path gating affects memory indexing behavior. |
| Research | 14/20 | Required tracing strict validation, quality loop, parser, and dry-run envelope. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
