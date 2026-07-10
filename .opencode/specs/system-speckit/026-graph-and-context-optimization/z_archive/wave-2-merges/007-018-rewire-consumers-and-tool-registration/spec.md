---
title: "Feature Specification: Rewire consumers: cross-subsystem imports, hooks, vitest config, plugin bridge"
description: "Rewire system-spec-kit consumers to import code-graph source from the new system-code-graph sibling skill while preserving co-resident MCP tool IDs and registration."
trigger_phrases:
  - "004 rewire code graph consumers"
  - "code graph sibling imports"
  - "system-code-graph tool registration"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-018-rewire-consumers-and-tool-registration"
    last_updated_at: "2026-05-14T08:15:39Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 004 rewiring and validation"
    next_safe_action: "Phase 005 doc migration or Phase 006 full cleanup can continue from this stable import state"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140004"
      session_id: "004-rewire-consumers-and-tool-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001 Q3 keeps MCP tools registered under spec_kit_memory."
      - "ADR-001 Q4 preserves code_graph_*, ccc_*, and detect_changes tool IDs."
      - "ADR-001 Q5 uses direct sibling-skill imports, not MCP round trips."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Rewire consumers: cross-subsystem imports, hooks, vitest config, plugin bridge

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
| **Branch** | `004-rewire-consumers-and-tool-registration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 003 moves the code-graph source tree, system-spec-kit handlers, hooks, tests, and registration code still reference the old local `code_graph/` paths. Without rewiring, TypeScript import resolution and runtime startup surfaces fail.

### Purpose
Rewire all consumers that remain in system-spec-kit to import from the moved system-code-graph sibling skill. Preserve the co-resident MCP server topology and stable tool IDs; only paths and test discovery move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update system-spec-kit handler imports from old `../code_graph/...` paths to system-code-graph sibling paths.
- Update context-server and tools registration imports while leaving tool IDs stable.
- Update hooks across Claude, Gemini, Codex, and shared memory surfaces.
- Update session snapshot and other session-library consumers discovered by typecheck.
- Update external tests and mocks that import code-graph modules.
- Update skill_advisor type/bench imports that reference code-graph modules.
- Remove system-spec-kit Vitest discovery patterns for moved code-graph tests.
- Enable system-code-graph Vitest discovery patterns.
- Update the compact code-graph plugin bridge path while keeping plugin loader placement safe.

### Out of Scope
- Code-graph source move and DB copy; that is Phase 003.
- Tool ID renames or MCP server topology changes.
- Algorithm, scoring, parser, scan-scope, or query semantic changes.
- Phase 005 documentation migration and Phase 006 cleanup.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Consumers import from system-code-graph. | No TypeScript imports or mocks point at removed system-spec-kit `code_graph/` source. |
| REQ-002 | Tool registration stays co-resident. | `tools/index.ts` still exports/registers stable code-graph handlers under spec_kit_memory. |
| REQ-003 | Tool schemas stay stable. | `tool-schemas.ts` retains inline schema definitions and stable tool names. |
| REQ-004 | Test discovery follows ownership. | system-spec-kit excludes moved code-graph tests; system-code-graph includes moved tests and stress tests. |
| REQ-005 | Plugin bridge resolves new bridge location. | Plugin entrypoint points at the moved bridge `.mjs`. |
| REQ-006 | Typecheck succeeds or failures are resolved within scope. | `npx tsc --noEmit -p mcp_server/tsconfig.json` exits 0 for system-spec-kit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Import rewiring count is recorded.
- **SC-002**: system-spec-kit typecheck exits 0.
- **SC-003**: system-code-graph Vitest smoke exits 0 or is recorded as skipped with cause.
- **SC-004**: Strict validation passes for this packet.
- **SC-005**: No tool IDs changed.
- **SC-006**: Evidence recorded: 214 import/path rewires, typecheck exit 0, Vitest smoke exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed import path | Typecheck or tests fail | Use repo-wide `rg` and typecheck iteration. |
| Risk | Plugin entrypoint moved out of loader path | OpenCode stops loading plugin | Keep `.opencode/plugins/` entrypoint if README confirms auto-load path. |
| Risk | Test discovery gap | Code-graph tests no longer run | Update system-code-graph Vitest include patterns. |
| Dependency | Phase 003 move complete | Rewire targets must exist | Execute atomically after physical move. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The plugin loader location is verified from `.opencode/plugins/README.md` during execution.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-C01 | Compatibility | Preserve stable tool IDs and direct in-process calls. |
| NFR-Q01 | Quality | Keep path changes surgical and avoid unrelated refactors. |
| NFR-S01 | Safety | Do not run the MCP server during migration. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Dynamic imports and `vi.mock` strings need the same sibling-path treatment as static imports.
- Extensionless import strings in tests may need matching extensionless sibling paths.
- Some text references to `code-graph` are documentation or fixture content and should not be changed in this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | Medium | Mostly import/config edits |
| **Surface area** | Medium-high | Handlers, hooks, tests, configs, plugin |
| **Risk** | Medium | Missed imports break typecheck |
| **Reversibility** | High | Path edits and config changes can be reverted |
<!-- /ANCHOR:complexity -->
