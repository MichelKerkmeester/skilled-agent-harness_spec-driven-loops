# System Spec-Kit & Memory MCP — Comprehensive Bug Fix

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Spec ID**        | 096                                                          |
| **Parent**         | 003-memory-and-spec-kit                                      |
| **Level**          | 3 (500+ LOC changes)                                         |
| **Status**         | Draft                                                        |
| **Created**        | 2026-02-09                                                   |
| **Risk**           | HIGH                                                         |
| **Estimated LOC**  | 2,000–3,000+ across ~50 files                                |
| **Estimated Bugs** | ~200 (15 CRITICAL, 45 HIGH, 75 MEDIUM, 65 LOW)              |

---

## 1. Overview

Comprehensive bug-fix audit of the entire `system-spec-kit` codebase located at `.opencode/skill/system-spec-kit/`. This spec addresses ~200 bugs discovered across all subsystems, ranging from critical crashers and data-corruption risks to low-severity documentation mismatches.

The codebase is a **TypeScript monorepo** using npm workspaces with three packages:

| Package        | Path                                           | Purpose                                    |
| -------------- | ---------------------------------------------- | ------------------------------------------ |
| `shared/`      | `.opencode/skill/system-spec-kit/shared/`      | Shared types, embeddings, utilities        |
| `mcp_server/`  | `.opencode/skill/system-spec-kit/mcp_server/`  | MCP server, handlers, search, cognitive    |
| `scripts/`     | `.opencode/skill/system-spec-kit/scripts/`     | Shell scripts, extraction, templates       |

---

## 2. Scope

### In Scope

Fix ~200 bugs across the following subsystems:

| Subsystem                  | Key Files                                                                 | Bug Count |
| -------------------------- | ------------------------------------------------------------------------- | --------- |
| **Shell scripts**          | validate.sh, create.sh, compose.sh                                       | ~8        |
| **Configuration**          | config.ts, path-security.ts                                              | ~4        |
| **MCP server**             | context-server.ts                                                        | ~4        |
| **Embedding system**       | factory.ts, embeddings.ts, provider-chain.ts, openai.ts, voyage.ts       | ~10       |
| **Search pipeline**        | memory-search.ts, hybrid-search.ts, bm25-index.ts, cross-encoder.ts     | ~21       |
| **Cognitive memory**       | tier-classifier.ts, prediction-error-gate.ts, attention-decay.ts (FSRS)  | ~7        |
| **Atomicity/transactions** | memory-save.ts, memory-crud.ts, session-manager.ts, checkpoints.ts      | ~20       |
| **Type system**            | shared/types.ts, all handler files                                       | ~7        |
| **Test coverage**          | New test files across mcp_server/ and scripts/                           | ~35 gaps  |

### Out of Scope

- Feature additions or new capabilities
- UI/UX changes
- Architecture redesign or major refactoring beyond what is required for bug fixes
- Performance optimization (unless directly caused by a bug)
- Migration to different libraries or frameworks

---

## 3. Severity Breakdown

| Severity     | Count | Examples                                                                      |
| ------------ | ----- | ----------------------------------------------------------------------------- |
| **CRITICAL** | ~15   | macOS date crash, DB no-op save, FSRS formula 18.5x off, embedding dimension |
| **HIGH**     | ~45   | JSON injection, transaction gaps, dead code paths, stale DB handles           |
| **MEDIUM**   | ~75   | Race conditions, unbounded growth, incomplete sanitization, score bugs        |
| **LOW**      | ~65   | Documentation mismatches, naming inconsistencies, minor caching issues        |

---

## 4. Risk Assessment

| Risk Factor                    | Level  | Mitigation                                             |
| ------------------------------ | ------ | ------------------------------------------------------ |
| Shared codebase (symlinked)    | HIGH   | Phase-by-phase execution with typecheck gates          |
| Cross-package dependencies     | MEDIUM | Dependency graph enforced; phases ordered accordingly  |
| No existing test coverage      | HIGH   | Phase 7 adds tests; each phase verified by build/type  |
| Many files touched (~50)       | MEDIUM | Small, focused commits per phase; build after each     |
| Critical system (memory/search)| HIGH   | CRITICAL bugs first; rollback plan per phase           |

---

## 5. Success Criteria

1. All ~200 bugs fixed or explicitly deferred with justification
2. `npm run typecheck` passes after each phase
3. `npm run build` succeeds after each phase
4. `npm test` passes after Phase 7
5. No new bugs introduced (verified by type system and tests)
6. All CRITICAL and HIGH bugs resolved (no deferrals without approval)

---

## 6. Constraints

- **Shared codebase**: `.opencode/` is a symlink to the Public Release repo. Changes affect ALL projects using this framework.
- **Backward compatibility**: All existing MCP tool interfaces must remain unchanged.
- **Build system**: Must pass `npm run typecheck` and `npm run build` after every phase.
- **No feature additions**: Bug fixes only. If a fix requires interface changes, document in decision-record.md.
