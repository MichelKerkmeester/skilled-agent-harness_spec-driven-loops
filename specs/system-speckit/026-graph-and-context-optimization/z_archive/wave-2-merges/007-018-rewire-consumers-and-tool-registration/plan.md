---
title: "Implementation Plan: Rewire consumers and tool registration"
description: "Update sibling-skill imports, test discovery, and plugin bridge path after the code-graph source move."
trigger_phrases:
  - "004 rewire consumers plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-018-rewire-consumers-and-tool-registration"
    last_updated_at: "2026-05-14T08:06:12Z"
    last_updated_by: "codex"
    recent_action: "Planned Phase 004 import rewiring"
    next_safe_action: "Rewrite imports and validate"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Rewire consumers and tool registration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

After Phase 003 moves the source tree, update all remaining system-spec-kit consumers to import from `.opencode/skills/system-code-graph/mcp_server/code_graph/`. Keep tool schemas inline, keep the MCP server co-resident, keep stable tool IDs, and move test discovery to the new package owner.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] ADR-001 Q3/Q4/Q5 accepted co-resident MCP, stable tool IDs, and sibling imports.
- [x] Phase 003 is executing atomically in this dispatch.
- [x] Plugin loader behavior can be checked from `.opencode/plugins/README.md`.

### Definition of Done
- [x] Handler, hook, context-server, tool registration, session, test, and skill_advisor imports rewired.
- [x] system-spec-kit Vitest config no longer includes moved code-graph suites.
- [x] system-code-graph Vitest config includes moved code-graph and stress-test suites.
- [x] Typecheck exits 0.
- [x] Vitest smoke exits 0 or is explicitly skipped with cause.
- [x] Packet strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ESM, Vitest |
| **Framework** | Co-resident MCP tool registration under `spec_kit_memory` |
| **Storage** | DB owner changed in Phase 003; consumers call direct functions |
| **Testing** | Typecheck + focused Vitest smoke |

### Approach
1. Use `rg` to identify all code imports, mocks, and dynamic imports targeting old `code_graph/` paths.
2. Replace old relative paths with paths from each file to `../../../system-code-graph/mcp_server/code_graph/...` or the correct relative equivalent.
3. Keep inline tool schemas unchanged except for any actual broken imports.
4. Update Vitest include patterns in both packages.
5. Keep `.opencode/plugins/spec-kit-compact-code-graph.js` in `.opencode/plugins/` because that folder is the OpenCode auto-load path, and update only its `BRIDGE_PATH`.
6. Run typecheck and fix import errors until green.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory imports and plugin loader path.

### Phase 2: Implementation
- Rewrite import paths and mock strings.
- Update Vitest configs.
- Update plugin bridge path.

### Phase 3: Verification
- Run strict packet validation.
- Run system-spec-kit typecheck.
- Run system-code-graph Vitest smoke.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Static | Import resolution | `npx tsc --noEmit -p mcp_server/tsconfig.json` |
| Runtime smoke | Moved test imports | `npx vitest run mcp_server/code_graph/tests/code-graph-scan.vitest.ts` |
| Docs | Packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- Phase 003 source move must complete in the same dispatch.
- Phase 001 ADR-001 decisions are binding.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Revert import rewrites, Vitest config changes, and plugin bridge path update together with Phase 003 moves. Tool IDs and schemas are unchanged, so rollback does not require compatibility shims.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | Phase 003 targets known | Need destination paths |
| Phase 2 | Phase 1 | Rewrite after inventory |
| Phase 3 | Phase 2 | Verify after rewiring |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Import inventory and rewrite | ~60 min |
| Config/plugin path updates | ~20 min |
| Validation iteration | ~60 min |
| **Total** | **~140 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Typecheck exposes a dependency cycle that cannot be fixed by path rewiring.
- Plugin loader cannot resolve the moved bridge.
- Vitest smoke cannot run due to missing package-local config/deps.

### Recovery
1. Restore old import paths if Phase 003 is reverted.
2. Keep plugin entrypoint in `.opencode/plugins/`.
3. Record unresolved validation failures in implementation summary instead of claiming completion.

### Data Safety
This phase does not mutate DB contents.
<!-- /ANCHOR:enhanced-rollback -->
