---
title: "Feature Specification: 012 - Deprecate Skill Graph and [012-deprecate-skill-graph-and-readme-indexing/spec]"
description: "This phase removes all Skill Graph (SGQS) behavior from the system-spec-kit memory MCP and narrows indexing scope to durable project knowledge only. The change also removes READ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "012"
  - "deprecate"
  - "skill"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: 012 - Deprecate Skill Graph and README/Skill-Ref Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase removes all Skill Graph (SGQS) behavior from the system-spec-kit memory MCP and narrows indexing scope to durable project knowledge only. The change also removes README indexing and workflows-code/sk-code `references/` and `assets/` indexing from MCP memory ingestion, then aligns commands, skills, agents, and root documentation with the new model.

**Key Decisions**: remove SGQS tools and graph cache paths entirely; remove README and skill reference/assets ingestion from memory indexing; enforce ANCHOR guidance for generated README outputs.

**Critical Dependencies**: MCP tool schema updates, retrieval/indexing handler changes, command/agent/skill text alignment, and test coverage updates across MCP server and documentation workflows.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 012 |
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-21 |
| **Branch** | `138-hybrid-rag-fusion` |
| **Parent** | `../spec.md` |
| **Phase Folder** | `012-deprecate-skill-graph-and-readme-indexing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current memory MCP still exposes SGQS skill-graph features and ingests README plus workflows-code/sk-code `references/` and `assets/` content. This broad ingestion adds noise, increases maintenance cost, and keeps deprecated feature paths alive across tool schemas, handlers, tests, commands, and docs.

### Purpose

Deprecate and remove all skill-graph capabilities and non-authoritative README/skill-reference indexing paths so memory retrieval stays focused on memory files, constitutional docs, and spec docs only, with synchronized command/skill/agent guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Deprecate and remove all Skill Graph/SGQS features from memory MCP runtime, schemas, tests, and docs.
- Remove README indexing from memory MCP discovery, save validation, and scoring paths.
- Remove workflows-code/sk-code `references/` and `assets/` indexing from memory MCP.
- Update command, skill, and agent docs/prompts so removed capabilities are not referenced as available.
- Enforce README anchor guidance so generated READMEs always include paired ANCHOR tags.

### Explicit In-Scope Path Patterns

- `.opencode/skill/**`
- `.opencode/command/**`
- `.opencode/agent/**`
- `.opencode/agent/chatgpt/**`
- `.opencode/skill/system-spec-kit/mcp_server/**`
- `README.md`

### Out of Scope

- Historical spec archives outside this phase folder, except minimal read-only reference when required for consistency checks.
- New retrieval features unrelated to deprecation/removal.
- Non-memory MCP subsystems with no SGQS/README/skill-ref indexing linkage.

### Files to Change (Representative)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Remove SGQS tools and indexing flags/descriptions tied to README and skill refs |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Remove README and skill reference/assets discovery/indexing paths |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Remove README acceptance path and README-specific type handling |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` | Modify | Remove SGQS handler exports/wiring |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts` | Delete | Remove SGQS MCP tool handlers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/skill-graph-cache.ts` | Delete/Modify dependents | Remove SGQS graph cache path |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` | Modify | Remove SGQS routing/weights, keep causal-only behavior |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/skill-ref-config.ts` | Modify/Delete | Remove skill reference/assets indexing config surface |
| `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modify | Remove SGQS/README/skill-ref indexing tests and replace with deprecation assertions |
| `.opencode/command/**/*.md` | Modify | Remove references to SGQS tools and removed indexing flags |
| `.opencode/agent/**/*.md` | Modify | Remove SGQS capability claims in agent guidance |
| `.opencode/agent/chatgpt/**/*.md` | Modify | Mirror agent guidance updates for chatgpt profile |
| `.opencode/skill/**/*.md` | Modify | Remove SGQS/readme-indexing claims and enforce README anchor guidance |
| `README.md` | Modify | Update product-level architecture and indexing source descriptions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove `memory_skill_graph_query` and `memory_skill_graph_invalidate` from MCP surface | Tools are absent from schemas, handler registration, and runtime dispatch |
| REQ-002 | Remove SGQS/skill-graph runtime dependencies | No runtime import or execution path depends on SGQS graph cache/query modules |
| REQ-003 | Remove README indexing from memory index scan | `memory_index_scan` no longer discovers or indexes README sources |
| REQ-004 | Remove README path acceptance from memory save | `memory_save` accepts only allowed non-README memory/spec/constitutional inputs |
| REQ-005 | Remove workflows-code/sk-code `references/` and `assets/` indexing | No config/handler path indexes skill reference/assets directories |
| REQ-006 | Align all command/skill/agent docs with removed capabilities | No active docs instruct users to use removed SGQS or removed indexing flags |
| REQ-007 | Enforce README anchor guidance in README generation workflows | README generation command assets/specs require paired ANCHOR tags |
| REQ-008 | Preserve green verification gates after removals | Target validation and tests pass with removed features |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Provide explicit deprecation notes for removed flags/tools | Documentation clearly states removed parameters and replacement behavior |
| REQ-010 | Update root README architecture and source inventory | Root docs no longer claim SGQS channel or README/skill-ref indexing |
| REQ-011 | Keep retrieval quality stable without SGQS/README/skill refs | Regression suite shows no break in supported retrieval behavior |
| REQ-012 | Add targeted tests for deprecation behavior | Tests assert removed-tool absence and excluded indexing sources |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No SGQS tool names remain in active tool schemas or runtime registry.
- **SC-002**: README files are not indexed by `memory_index_scan`.
- **SC-003**: workflows-code/sk-code `references/` and `assets/` are not indexed by `memory_index_scan`.
- **SC-004**: Command, skill, and agent documentation contains no stale SGQS/readme-indexing instructions.
- **SC-005**: README generation guidance requires valid paired ANCHOR tags.
- **SC-006**: Typecheck and relevant MCP test suites pass after deprecation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP schema and handler coupling | High | Land schema and handler removals in same change set |
| Dependency | Documentation breadth across command/agent/skill trees | Medium | Use targeted search sweeps with explicit replacement checklist |
| Risk | Hidden SGQS imports remain in tests/utilities | High | Add fail-fast grep checks and compile/test gates |
| Risk | Users rely on removed indexing flags | Medium | Add deprecation notes and examples of new canonical indexing scope |
| Risk | README generation outputs may omit anchors in edge templates | Medium | Add template-level anchor requirements plus validation task |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Index scan execution time does not regress after source removal and should improve or remain neutral.

### Security

- **NFR-S01**: No new writable/indexable file classes are introduced during deprecation.

### Reliability

- **NFR-R01**: Memory MCP startup and query flows remain stable with SGQS paths removed.

### Maintainability

- **NFR-M01**: Single source of truth for indexed-source policy is documented and reflected in tool schemas and handlers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- Existing databases containing `readme` document types must remain readable without requiring migration rollback.
- Existing docs mentioning SGQS in archived folders remain untouched unless explicitly in-scope.

### Error Scenarios

- Calling removed SGQS tools returns clear "tool not found" behavior via standard MCP dispatch.
- Calling removed indexing flags in clients should fail predictably or be ignored with explicit docs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Cross-cutting updates across MCP runtime, tests, commands, skills, and agents |
| Risk | 21/25 | Tool removal and indexing policy changes can break retrieval expectations |
| Research | 16/20 | Requires broad stale-reference sweep and source-policy verification |
| Multi-Agent | 8/15 | Single-agent execution, but broad surface coordination |
| Coordination | 11/15 | Many in-scope path families and synced docs required |
| **Total** | **80/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | SGQS symbol remnants break compile/test | H | M | Pre-merge grep gates + focused test suite |
| R-002 | Indexing contract mismatch between schema and handler | H | M | Update schema, handler, and tests in one phase |
| R-003 | Missed stale docs cause operator confusion | M | H | Mandatory content sweep across explicit path patterns |
| R-004 | Anchor guidance inconsistently enforced in README generation | M | M | Add explicit rule text and validation tasks |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Remove deprecated SGQS runtime (Priority: P0)

**As a** platform maintainer, **I want** SGQS tools and runtime modules removed, **so that** memory MCP only exposes supported retrieval primitives.

### US-002: Narrow memory indexing sources (Priority: P0)

**As a** memory MCP operator, **I want** README and skill reference/assets indexing removed, **so that** search context stays authoritative and less noisy.

### US-003: Keep docs and prompts truthful (Priority: P1)

**As an** AI workflow user, **I want** command/skill/agent docs to reflect actual capabilities, **so that** generated plans and actions do not call missing tools or flags.

### US-004: Keep README retrieval quality via anchors (Priority: P1)

**As a** documentation author, **I want** generated READMEs to always include anchors, **so that** section-level retrieval remains deterministic where README content is still consumed outside memory indexing.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 12. ACCEPTANCE SCENARIOS

1. **Given** a server build after this phase, **When** tool schemas are loaded, **Then** SGQS tool entries are absent.
2. **Given** an index scan request, **When** the scanner traverses workspace files, **Then** README files are excluded from indexing candidates.
3. **Given** a workspace with workflows-code/sk-code skill folders, **When** index scan executes, **Then** `references/` and `assets/` paths are excluded.
4. **Given** command documentation under `.opencode/command/**`, **When** a stale-reference scan runs, **Then** no docs recommend SGQS tools or removed indexing flags.
5. **Given** agent docs under `.opencode/agent/**` and `.opencode/agent/chatgpt/**`, **When** capability text is reviewed, **Then** SGQS memory capability claims are removed.
6. **Given** README generation command assets, **When** template guidance is applied, **Then** generated README outputs include paired `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` tags.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Should removed `includeReadmes` and `includeSkillRefs` inputs hard-fail with validation errors, or be accepted as no-op for one transition window?
- Is a database cleanup migration for existing `readme` rows required in this phase or deferred to a follow-up maintenance phase?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
