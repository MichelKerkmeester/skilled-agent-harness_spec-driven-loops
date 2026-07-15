---
title: "Doc migration: category-22 split, agents, commands, top-level docs, skill cross-refs"
description: "Phase 005 migrates code-graph-owned category-22 docs into system-code-graph and updates runtime docs, agents, commands, top-level references, skill cross-refs, and constitutional/config references."
trigger_phrases:
  - "code graph doc migration"
  - "category 22 split"
  - "system-code-graph docs"
  - "phase 005 doc and runtime migration"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-merges/007-019-doc-and-runtime-migration"
    last_updated_at: "2026-05-14T08:21:27Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Phase 005 packet"
    next_safe_action: "Move category-22 code-graph docs and update references"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140005"
      session_id: "005-doc-and-runtime-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Doc and runtime metadata migration only; code changes are out of scope."
      - "Tool IDs remain stable: code_graph_*, ccc_*, and detect_changes."
      - "Phase 006 packet must not be scaffolded here."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Doc migration: category-22 split, agents, commands, top-level docs, skill cross-refs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `005-doc-and-runtime-migration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 003 and 004 moved the code-graph source and rewired imports, but the authored documentation and runtime guidance still describe code graph as part of `system-spec-kit`. Category 22 also mixes code-graph internals with shared hook, context, runtime, budget, skill-graph, and coverage-graph pages.

### Purpose
Split code-graph-owned docs into `.opencode/skills/system-code-graph/`, keep shared context and hook docs in `system-spec-kit`, and update agents, commands, top-level docs, skill cross-references, constitutional/config references, and the new `system-code-graph` skill docs so users and runtime surfaces point at the new ownership location without changing stable MCP tool IDs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create this Phase 005 spec packet.
- Update parent phase 014 metadata to include this child and mark it active.
- Move code-graph-core category-22 feature catalog docs with `git mv`.
- Move code-graph-core category-22 manual testing playbook docs with `git mv`.
- Update stayed shared docs with cross-skill references where they mention moved code-graph docs.
- Update code-graph path references in agent definitions, commands, top-level docs, skill cross-refs, constitutional/config references, `system-code-graph/SKILL.md`, and `system-code-graph/README.md`.

### Out of Scope
- Code changes.
- Tool ID changes.
- Phase 006 packet scaffolding.
- Git commits.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Phase 005 packet exists with Level 2 docs and metadata. | Seven requested files exist and validate. |
| REQ-002 | Parent 014 graph metadata includes Phase 005. | `children_ids` includes `005-doc-and-runtime-migration`; `last_active_child_id` points to it. |
| REQ-003 | Category-22 feature docs are split by ownership. | Code-graph internals move to `system-code-graph/feature_catalog/22--context-preservation-and-code-graph/`; shared docs stay. |
| REQ-004 | Category-22 playbook docs are split by ownership. | Code-graph internals move to `system-code-graph/manual_testing_playbook/22--context-preservation-and-code-graph/`; shared docs stay. |
| REQ-005 | Runtime guidance points at the new skill root. | Agents, commands, top-level docs, skill cross-refs, constitutional/config references no longer cite old code-graph source paths. |
| REQ-006 | Tool IDs remain stable. | Docs preserve `code_graph_*`, `ccc_*`, and `detect_changes` names. |
| REQ-007 | `system-code-graph` skill docs reflect Phase 005 state. | Scaffold banner removed or replaced; routing and references point at local docs. |
| REQ-008 | Validation evidence is captured. | Strict packet validation exit code and moved-doc counts recorded in summary. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validation passes for this Phase 005 packet.
- **SC-002**: Moved docs exist under `system-code-graph` and shared docs remain under `system-spec-kit`.
- **SC-003**: Path references to `.opencode/skills/system-spec-kit/mcp_server/code_graph/` are updated to `.opencode/skills/system-code-graph/mcp_server/code_graph/` in the requested surfaces.
- **SC-004**: Top-level and config docs mention `SPECKIT_CODE_GRAPH_DB_DIR` where env vars are documented.
- **SC-005**: No code files are modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mixed docs get moved too aggressively | Shared hook/runtime docs become harder to find | Keep mixed/shared docs in `system-spec-kit` and add cross-skill pointers. |
| Risk | Old source paths remain in commands or agents | Future operators follow stale guidance | Grep old path patterns after edits. |
| Risk | Docs imply tool ID churn | Runtime users try nonexistent names | Preserve stable `code_graph_*`, `ccc_*`, and `detect_changes` names throughout. |
| Dependency | Phases 003 and 004 complete | Docs point at already-moved source and stable registration | User confirmed typecheck and vitest were green before Phase 005. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The user pre-answered Gate 3 and supplied the Phase 005 split policy.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-Q01 | Quality | Markdown frontmatter keeps `_memory.continuity`. |
| NFR-Q02 | Traceability | Moves use `git mv` to preserve history. |
| NFR-Q03 | Compatibility | Tool names remain stable; only ownership/path references change. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Dimension | Assessment |
|-----------|------------|
| File volume | Medium: many docs/config surfaces, but simple path/reference edits |
| Behavioral risk | Low: no tool IDs or code paths changed in this phase |
| Verification | Medium: strict packet validation plus moved-count and stale-path grep checks |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES

- Category overview pages mention both shared context and code graph; these stay in `system-spec-kit`.
- Query intent routing and tool routing enforcement are shared routing docs; they stay unless the page is overwhelmingly code-graph-specific.
- Skill graph and coverage graph pages are separate subsystems and stay in `system-spec-kit`.
- Existing `.gitkeep` placeholders under `system-code-graph` may be removed when real docs are moved in.
<!-- /ANCHOR:edge-cases -->
