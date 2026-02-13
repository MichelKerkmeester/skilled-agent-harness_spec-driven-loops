# Plan: Phase 9 - Final Verification

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-J
> **Session:** 4
> **Agent Allocation:** Agents 9-10
> **Status:** Pending
> **Created:** 2026-02-07

---

## Goal

Full system verification before declaring the JavaScript to TypeScript migration complete. This phase performs no new file conversions — it validates that all 8 previous phases produced a working, well-typed, fully functional system.

---

## Scope

### In Scope
- Build verification (clean build, type checking, test execution)
- Functional verification (MCP server, CLI scripts, embeddings, database operations)
- Structural verification (no `.js` source files, no `any` in public APIs, DAG validation, documentation accuracy)
- Integration verification (end-to-end workflows)

### Out of Scope
- New file conversions (all conversions complete in Phases 0-8)
- Documentation updates (completed in Phase 8)
- Test file modifications (completed in Phase 7)

---

## Verification Categories

### 1. Build & Compilation

| Check | Command | Success Criteria |
|-------|---------|------------------|
| Clean build | `npm run build` | Exit 0, all workspaces compile |
| Type check | `tsc --noEmit` | 0 errors, 0 warnings |
| Project references | `tsc --build` | DAG validated, no circular errors |

### 2. Runtime Verification

| System | Test | Success Criteria |
|--------|------|------------------|
| MCP Server | `node mcp_server/context-server.js` | All 20+ tools initialize |
| CLI Scripts | `node scripts/memory/generate-context.js [spec-folder]` | Valid memory file produced |
| Embeddings | Provider connection test | At least 1 provider (Voyage/OpenAI/HF) works |
| Database | CRUD + vector search | Operations complete, results returned |

### 3. Test Suite Verification

| Test Group | Files | Pass Rate |
|------------|------:|-----------|
| MCP Tests (cognitive/scoring) | 12 | 100% |
| MCP Tests (search/storage) | 10 | 100% |
| MCP Tests (handlers/integration) | 10 | 100% |
| MCP Tests (remaining) | 14 | 100% |
| Scripts Tests | 13 | 100% |
| **TOTAL** | **59** | **100%** |

### 4. Source Audit

| Verification | Method | Target |
|--------------|--------|--------|
| Zero `.js` source | `find . -name '*.js' -not -path '*/node_modules/*'` | Only compiled output (no source) |
| No `any` in public API | `grep -r ': any' --include='*.ts' \| grep -v test` | Minimal/zero results |
| Import graph | Visual inspection of `tsconfig.json` references | `shared` ← `mcp_server` ← `scripts` (DAG) |

### 5. Documentation Audit

| Category | Files | Verification |
|----------|------:|--------------|
| READMEs | 7 | All paths match file system |
| SKILL.md | 1 | Script references updated |
| References | 14 | Code examples use TypeScript |
| Assets | 1 | Template mappings current |
| CHANGELOG | 1 | Migration entry complete |

### 6. Integration Workflows

| Workflow | Steps | Pass Criteria |
|----------|-------|---------------|
| Memory Save | User → CLI → Database → Vector Index | Memory file created, indexed, searchable |
| Memory Search | Query → Hybrid Search → Rerank → Format | Results returned with scores |
| Context Generation | Spec Folder → Extractors → Memory File | Valid memory/ output |

---

## Success Metrics

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| TypeScript strict errors | 0 | `tsc --noEmit` |
| Test pass rate | 100% (59/59 files) | `npm test` |
| MCP tools functional | All 20+ tools respond | `node context-server.js` log |
| CLI scripts functional | All 3 entry points work | Manual execution |
| Source `.js` files remaining | 0 | `find` command |
| `any` usage in public API | 0 | `grep` audit |
| Documentation accuracy | 100% (paths match) | Spot-check 10 references |
| Circular project references | 0 | `tsc --build` validation |

---

## Agent Allocation (Session 4)

| Agent | Responsibility | Estimated Time |
|-------|----------------|----------------|
| Agent 9 | Build verification + test execution + source audit | 1.5h |
| Agent 10 | Functional verification (MCP + CLI) + integration testing | 1.5h |

### Agent 9: Build & Structure
1. Execute clean build (`npm run build`)
2. Run type check (`tsc --noEmit`)
3. Execute full test suite (`npm test`)
4. Audit source files (no `.js` source remaining)
5. Audit public API (no `any` types)
6. Validate import graph (DAG structure)

### Agent 10: Runtime & Integration
1. Start MCP server, verify all tools initialize
2. Test CLI scripts (generate-context, rank-memories)
3. Verify embedding provider connection
4. Test database operations (CRUD + vector search)
5. Run integration workflows end-to-end
6. Spot-check 10 documentation paths

---

## Verification Workflow

```
Phase 9 Start
     ↓
┌────────────────────────────────┐
│ Agent 9: Build Verification    │
│ - npm run build (0 errors)     │
│ - tsc --noEmit (0 errors)      │
│ - npm test (100% pass)         │
└────────────────────────────────┘
     ↓
┌────────────────────────────────┐
│ Agent 9: Structural Audit      │
│ - Zero .js source files        │
│ - No any in public API         │
│ - DAG validated                │
└────────────────────────────────┘
     ↓                    ↓
┌────────────────┐  ┌────────────────────────────┐
│ Agent 10:      │  │ Agent 10:                  │
│ MCP Server     │  │ CLI Scripts                │
│ - Starts       │  │ - generate-context works   │
│ - 20+ tools    │  │ - rank-memories works      │
│ - No errors    │  │ - cleanup works            │
└────────────────┘  └────────────────────────────┘
     ↓                    ↓
┌────────────────────────────────┐
│ Agent 10: Integration          │
│ - Memory save workflow         │
│ - Memory search workflow       │
│ - Context generation workflow  │
└────────────────────────────────┘
     ↓
┌────────────────────────────────┐
│ Documentation Spot-Check       │
│ - 10 random path references    │
│ - All match file system        │
└────────────────────────────────┘
     ↓
SYNC-010: Migration Complete ✅
```

---

## Evidence Requirements

All checklist items (CHK-170 through CHK-185, plus L3+ sections CHK-200 through CHK-252) require evidence. Example formats:

- **Build**: Terminal output showing `Exit 0`
- **Tests**: `npm test` summary showing `59/59 passed`
- **MCP Server**: Log showing all tool names initialized
- **CLI**: File existence proof (`ls -l memory/001-[name].md`)
- **Source Audit**: Command output (`find` results)
- **Documentation**: Spot-check list with ✓ marks

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Test failures after conversion | Roll back to Phase 7 completion state, re-verify test conversions |
| MCP server fails to start | Check `opencode.json` paths, verify `context-server.js` compiled correctly |
| Embedding provider connection fails | Use mock provider fallback, document API key configuration |
| Documentation paths stale | Automated path checker script (future enhancement) |

---

## Completion Criteria

- [ ] All CHK-170 through CHK-185 items verified (Phase 9 core)
- [ ] All CHK-200 through CHK-252 items verified (L3+ governance)
- [ ] All 8 architectural decisions (D1-D8) have status: Decided
- [ ] No P0 blockers remaining
- [ ] Evidence provided for all P0 and P1 items
- [ ] Sign-off table completed in checklist.md

---

## Dependencies

- **Phase 0**: TypeScript standards established
- **Phase 1**: Infrastructure setup complete
- **Phase 2**: Circular dependencies resolved
- **Phase 3**: shared/ converted
- **Phase 4**: mcp_server/ foundation converted
- **Phase 5**: mcp_server/ upper layers converted
- **Phase 6**: scripts/ converted
- **Phase 7**: All tests converted
- **Phase 8**: All documentation updated

**Critical Path:** All prior phases MUST be complete before Phase 9 begins. This is a gate, not a parallel workstream.

---

## Cross-References

- **Specification**: See `../spec.md`
- **Tasks**: See `tasks.md` (T310-T320)
- **Checklist**: See `checklist.md` (CHK-170 through CHK-252)
- **Decisions**: See `../decision-record.md` (D1-D8 validation)
- **Master Plan**: See `../plan.md` (Phase 9, lines 350-365)
