---
title: "Feature Specification: Deep Research Hygiene and Negative Knowledge Dedup"
description: "Packet 122 bundles DR-005, C-008, and DR-008 hygiene fixes."
trigger_phrases:
  - "deep-research"
  - "DR-005"
  - "C-008"
  - "DR-008"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/004-deep-research/006-hygiene-fix-pack"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented packet 122 hygiene fixes"
    next_safe_action: "Use commit handoff in implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh"
      - ".opencode/skills/deep-research/SKILL.md"
    completion_pct: 100
---
# Feature Specification: Deep Research Hygiene and Negative Knowledge Dedup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 119 identified three P2 hygiene gaps: duplicate ruled-out directions could accumulate, workflow YAML script references lacked a direct existence check, and the deep-research skill allowed-tools list needed post-118 pruning verification.

### Purpose
Close the hygiene pack without broad refactors: deduplicate negative knowledge by content hash, add a lightweight script-path verifier, and verify no deleted deep-loop graph MCP tools remain in deep-research `SKILL.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- DR-005: Deduplicate `ruledOut` and dead-end registry rows by content hash.
- C-008: Add shell verifier for Node `.cjs` paths referenced by four deep-loop workflow YAML files.
- DR-008: Audit deep-research `SKILL.md` allowed-tools frontmatter for deleted `mcp__mk_spec_memory__deep_loop_graph_*` entries.
- Add targeted regression coverage for negative-knowledge dedup.

### Out of Scope
- Rewriting YAML workflow shape.
- Changing deep-review reducer behavior.
- Removing live memory, CocoIndex, code-index, or skill-advisor MCP tool entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Modify | Deduplicate ruled-out directions by content hash |
| `.opencode/skills/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Add DR-005 dedup regression test |
| `.opencode/skills/deep-research/scripts/verify-yaml-script-paths.sh` | Create | Verify workflow YAML script paths exist |
| `.opencode/skills/deep-research/SKILL.md` | Read/Audit | Confirm no deleted graph MCP tools remain |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/004-deep-research/006-hygiene-fix-pack/*` | Create | Level 2 packet documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Duplicate negative knowledge is collapsed | Identical text appears once with first-seen iteration |
| REQ-002 | YAML script verifier exists | Shell script checks four workflow YAMLs |
| REQ-003 | Deleted graph tools are absent | Grep for deleted prefix returns no matches |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Dedup is deterministic | Content hash is normalized and stable |
| REQ-005 | Script verifier passes locally | Reports PASS with checked script count |
| REQ-006 | Packet docs validate strictly | Level 2 strict validator passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ruledOutDirections` collapses duplicate text and preserves first-seen iteration.
- **SC-002**: `verify-yaml-script-paths.sh` passes for the four deep-loop YAML assets.
- **SC-003**: DR-008 grep reports no deleted graph MCP tools.
- **SC-004**: Targeted reducer Vitest passes.
- **SC-005**: Packet strict validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-deduping similar but distinct rows | Medium | Hash normalized full text, not fuzzy match |
| Risk | YAML grep misses unusual quoting | Low | Match checked-in command shapes and run verifier |
| Dependency | Existing script locations | Medium | Verify all referenced `.cjs` files exist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Dedup remains linear in ruled-out row count.

### Security
- **NFR-S01**: No new external dependencies or secret-bearing files.

### Reliability
- **NFR-R01**: Script verifier exits non-zero on missing YAML or script paths.
- **NFR-R02**: Dedup output remains idempotent across reducer runs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Duplicate text in later iterations preserves the first iteration number.
- Different text with similar wording remains distinct.

### Error Scenarios
- Missing workflow YAML causes verifier failure.
- Missing referenced `.cjs` script causes verifier failure.

### State Transitions
- Existing generated registries refresh with deduped rows on next reducer run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Reducer, test, shell script, docs |
| Risk | 8/25 | Additive hygiene only |
| Research | 8/20 | Roadmap and SKILL audit |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
