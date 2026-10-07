---
title: "Tasks: Lib Consolidation"
description: "Reconstructed task breakdown for unifying the duplicated shared JavaScript modules of the system-spec-kit skill into one canonical library folder."
trigger_phrases:
  - "lib consolidation task list"
  - "shared module migration tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Lib Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory the modules duplicated or re-exported across the two lib folders (`spec.md`)
- [ ] T002 Decide which modules are shared and which stay context-specific, and record the ownership split (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create the shared lib directory and its README (`.opencode/skills/system-spec-kit/shared/README.md`)
- [ ] T004 Move `embeddings.js` to the shared lib (`.opencode/skills/system-spec-kit/shared/embeddings.js`)
- [ ] T005 Move `trigger-extractor.js` to the shared lib (`.opencode/skills/system-spec-kit/shared/trigger-extractor.js`)
- [ ] T006 Create a lightweight `retry-utils.js` without the vector-index dependency (`.opencode/skills/system-spec-kit/shared/retry-utils.js`)
- [ ] T007 Update the import paths in the CLI entry script (`.opencode/skills/system-spec-kit/scripts/generate-context.js`)
- [ ] T008 Update the CLI shared modules to stop re-exporting through cross-folder paths (`.opencode/skills/system-spec-kit/scripts/shared/*.js`)
- [ ] T009 Update the import paths in the MCP server entry script (`.opencode/skills/system-spec-kit/mcp_server/context-server.js`)
- [ ] T010 Update the import paths in the vector index module (`.opencode/skills/system-spec-kit/mcp_server/shared/vector-index.js`)
- [ ] T011 Update the import paths in the retry manager module (`.opencode/skills/system-spec-kit/mcp_server/shared/retry-manager.js`)
- [ ] T012 Update all affected READMEs to describe the new structure (`.opencode/skills/system-spec-kit/README.md`, `.opencode/skills/system-spec-kit/scripts/shared/README.md`, `.opencode/skills/system-spec-kit/mcp_server/shared/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Check for circular dependencies and remaining cross-folder imports (`plan.md`)
- [ ] T014 Confirm `generate-context.js` loads without pulling in `vector-index.js` (`scripts/generate-context.js`)
- [ ] T015 Exercise `memory_health`, `memory_search` and `memory_save` against the MCP server (`mcp_server/context-server.js`)
- [ ] T016 Confirm the READMEs accurately describe the consolidated structure (`.opencode/skills/system-spec-kit/README.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Existing functionality is preserved and all tests pass
- [ ] The dependency graph has no circular dependencies
- [ ] `generate-context.js` does not load `vector-index.js`
- [ ] Each module has one canonical location
- [ ] The READMEs describe the current structure
- [ ] No `../../` import path crosses a folder boundary
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
