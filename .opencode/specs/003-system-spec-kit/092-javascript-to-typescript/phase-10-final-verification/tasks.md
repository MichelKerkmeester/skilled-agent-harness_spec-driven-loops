# Tasks: Phase 9 - Final Verification

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**3-Tier Task Format (Level 3+):**
```
T### [W-X] [P?] Description (scope) [effort] {deps: T###}
```

---

## Workstream

**W-J:** Verification Agent (Session 4, Agents 9-10)

---

## Phase 9: Final Verification Tasks

> **Goal:** Full system verification before declaring completion.
> **Workstream:** W-J
> **Effort:** Verification only, no new file creation
> **Dependencies:** Phases 0-8 complete (SYNC-001 through SYNC-009)

---

### Build Verification

- [ ] T310 [W-J] Clean build: `npm run build` completes with 0 errors [15m] {deps: SYNC-009}
  - Execute from project root: `npm run build`
  - Verify all 3 workspaces compile successfully (shared, mcp_server, scripts)
  - Verify no TypeScript compilation errors
  - Verify all `.d.ts` declaration files generated
  - **Evidence required**: Terminal output showing `Exit 0` and "Build successful" messages

- [ ] T311 [W-J] Type check: `tsc --noEmit` passes with 0 errors [10m] {deps: T310}
  - Execute: `tsc --noEmit` from project root
  - Verify 0 type errors across all workspaces
  - Verify 0 warnings
  - Verify project references resolve correctly
  - **Evidence required**: Terminal output showing "Found 0 errors"

- [ ] T312 [W-J] All tests: `npm test` passes 100% (all 59 test files) [15m] {deps: T310}
  - Execute: `npm test`
  - Verify all MCP server tests pass (46 files)
  - Verify all scripts tests pass (13 files)
  - Verify 0 test failures, 0 test errors
  - **Evidence required**: Test summary showing `59/59 passed`

---

### Functional Verification

- [ ] T313 [W-J] MCP server starts: `node mcp_server/context-server.js` initializes all 20+ tools [15m] {deps: T310}
  - Start MCP server: `node mcp_server/context-server.js`
  - Verify server initialization log shows all tool names
  - Verify no runtime errors during startup
  - Verify database connection established
  - List of expected tools:
    - memory_context, memory_search, memory_match_triggers
    - memory_save, memory_update, memory_delete, memory_get
    - memory_index_scan, memory_index_file, memory_index_refresh
    - causal_graph, causal_link_add, causal_link_remove
    - checkpoints_save, checkpoints_restore, checkpoints_list
    - session_learning_save, session_learning_get
    - cognitive_consolidate, tier_promote
    - search_intent, search_fuzzy
  - **Evidence required**: Server log showing tool initialization list

- [ ] T314 [W-J] CLI works: `node scripts/memory/generate-context.js` produces valid memory file [15m] {deps: T310}
  - Choose a spec folder (e.g., `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`)
  - Execute: `node scripts/memory/generate-context.js [spec-folder-path]`
  - Verify script completes without errors
  - Verify memory file created in `[spec-folder]/memory/` directory
  - Verify memory file has valid structure (frontmatter, sections, content)
  - **Evidence required**: `ls -l` showing created memory file + file size

- [ ] T315 [W-J] Embeddings: At least one provider (Voyage/OpenAI/HF-local) connects and produces embeddings [15m] {deps: T313}
  - Verify environment variables set (VOYAGE_API_KEY or OPENAI_API_KEY)
  - Start MCP server and observe embedding provider initialization log
  - Verify provider connects successfully (no connection errors)
  - Verify embedding dimension matches expected (1024 for Voyage, 1536 for OpenAI)
  - **Alternative**: If no API keys available, verify HF-local provider initializes
  - **Evidence required**: Log line showing provider initialization success

- [ ] T316 [W-J] SQLite: Database CRUD + vector search verified [15m] {deps: T313}
  - Use MCP tools to test database operations:
    - `memory_save` — create a test memory
    - `memory_get` — retrieve the memory by ID
    - `memory_search` — query with vector search
    - `memory_delete` — remove the test memory
  - Verify all operations complete successfully
  - Verify vector search returns results with similarity scores
  - **Evidence required**: Tool response logs showing successful CRUD + search

---

### Structural Verification

- [ ] T317 [W-J] Zero `.js` source files remain (only compiled output) [10m] {deps: T310}
  - Execute: `find . -name '*.js' -not -path '*/node_modules/*' -not -name '*.config.js'`
  - Verify all `.js` files are compiled output (have corresponding `.ts` source)
  - Verify no hand-written `.js` source files remain in:
    - shared/
    - mcp_server/
    - scripts/
  - **Exception**: Root-level config files (e.g., `jest.config.js`) are acceptable
  - **Evidence required**: File list with verification that each `.js` has a `.ts` counterpart

- [ ] T318 [W-J] No `any` in public API function signatures [15m] {deps: T311}
  - Execute: `grep -rn ': any' --include='*.ts' shared/ mcp_server/ scripts/ | grep -v test | grep -v node_modules`
  - Review results — verify `any` types are:
    - Only in private helper functions (acceptable)
    - Only in test files (excluded from search)
    - Zero occurrences in exported function signatures
  - **Exceptions allowed**:
    - `Record<string, any>` for JSON data (acceptable pattern)
    - Third-party library types that return `any` (document)
  - **Evidence required**: Grep output with count of `any` occurrences + justification for each

- [ ] T319 [W-J] No circular project references [5m] {deps: T311}
  - Verify `tsc --build` completed successfully (from T311)
  - Confirm dependency graph is a DAG: `shared` ← `mcp_server` ← `scripts`
  - Verify no circular errors in TypeScript project references
  - **Evidence required**: Statement confirming DAG structure validated

- [ ] T320 [W-J] All documentation paths match actual file locations [15m] {deps: SYNC-009}
  - Spot-check 10 random path references from READMEs and reference files
  - Verify each path resolves to an existing file
  - Check:
    - `shared/README.md` — directory structure listing
    - `mcp_server/README.md` — module paths
    - `scripts/README.md` — script paths
    - `SKILL.md` — script invocation paths
    - `references/memory/save_workflow.md` — CLI command paths
  - **Evidence required**: Checklist of 10 paths with ✓ marks confirming existence

---

## Completion Criteria

- [ ] All tasks T310-T320 marked `[x]`
- [ ] No `[B]` blocked tasks
- [ ] All evidence requirements satisfied
- [ ] SYNC-010 barrier passed: Migration Verified ✅

---

## Cross-References

- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md` (CHK-170 through CHK-185)
- **Master Tasks**: See `../tasks.md` (Phase 9, lines 910-940)
- **Specification**: See `../spec.md`
