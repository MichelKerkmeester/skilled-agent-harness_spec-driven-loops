---
title: "Spec: shared embedder logic with spec-memory [template:level_1/spec.md]"
description: "Refactor packet to make skill-advisor consume the same shared embedder factory and default embedder infrastructure as mk-spec-memory/spec-memory."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
  - "CodeRankEmbed default"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded planned packet from deep-research cleanup dispatch"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `003-skill-advisor-stack` |
| **Predecessor** | `003-skill-advisor-stack/001-pluggable-architecture/` through `004-skill-graph-db-writer-cross-wire/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill-advisor and mk-spec-memory currently have separate embedder registries with competing defaults and parallel factory implementations. The operator decision is to remove that drift by making skill-advisor consume the same shared embedder factory infrastructure and align its active default to `sbert/nomic-ai/CodeRankEmbed`.

### Purpose

Extract or promote a shared embedder factory/registry that both skills use, then prove the two surfaces produce identical embeddings for the same input.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Align skill-advisor active default to `sbert/nomic-ai/CodeRankEmbed`.
- Extract shared embedder factory logic from mk-spec-memory/spec-memory embedders into a module consumable by skill-advisor.
- Update skill-advisor registry/factory imports to use the shared module.
- Add regression coverage that asserts identical embeddings for the same input across both skills.

### Out of Scope

- CocoIndex changes; the operator states CocoIndex is already on the same model.
- A new MCP embedder management API for skill-advisor.
- Unrelated reindex or ranking changes outside embedder selection.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | Modify/extract | Source registry/factory pattern for shared module |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Shared factory entrypoint used by both stacks |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` | Modify | Consume shared registry/default |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | Use shared provider/factory path consistently |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts` | Create | Regression proving identical embeddings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared factory module exists | Both spec-memory and skill-advisor import provider construction from the same shared factory/registry path |
| REQ-002 | Skill-advisor active default flips to `sbert/nomic-ai/CodeRankEmbed` | Registry/default resolution test asserts the exact provider/model string |
| REQ-003 | Parallel factory implementation removed or reduced to wrapper | Skill-advisor no longer maintains a competing default registry for the same embedder choices |
| REQ-004 | Regression test proves embedding equality | Same input through both skill surfaces yields identical vector values or a documented deterministic parity tolerance |
| REQ-005 | Existing skill-advisor scorer behavior stays green | Existing embedder and scorer vitest suites still pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill-advisor and spec-memory share one embedder factory contract.
- **SC-002**: Skill-advisor resolves `sbert/nomic-ai/CodeRankEmbed` by default.
- **SC-003**: Regression test catches future default drift between the two skills.
- **SC-004**: CocoIndex remains untouched.

### Acceptance Scenarios

- **Given** the same input text and the shared default embedder, **When** spec-memory and skill-advisor request embeddings, **Then** the produced vectors are identical under the shared adapter contract
- **Given** skill-advisor starts with no active embedder override, **When** its registry resolves the active default, **Then** it selects `sbert/nomic-ai/CodeRankEmbed` rather than gemma
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared module import paths may cross package boundaries awkwardly | Build or runtime resolution failures | Keep shared module under an existing workspace-resolved package path and test dist freshness |
| Risk | Vector dimensions/defaults differ from existing skill-advisor DB | Requires reindex or migration | Document reindex precondition and keep data migration out of this scaffold unless implementation needs it |
| Dependency | mk-spec-memory/spec-memory embedder registry | Refactor depends on current registry structure | Read current registry before implementation and keep compatibility wrappers if needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should existing skill-advisor sqlite data be reindexed in this packet, or should this packet stop at code/test parity? Proposed: code/test parity; reindex only if required for tests.
<!-- /ANCHOR:questions -->
