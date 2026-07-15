---
title: "Implementation Plan: Robust embedding-provider auto-resolution fix"
description: "Plan for replacing the factory sqlite3 shell-out with a node:sqlite read and generalizing provider/shard resolution, then reverting the interim ollama pin."
trigger_phrases:
  - "implementation"
  - "plan"
  - "embedder"
  - "auto-resolution"
  - "factory"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/009-embedder-auto-resolution-fix"
    last_updated_at: "2026-05-27T13:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-009-plan-for-node-sqlite-auto-resolution-fix"
    next_safe_action: "dispatch-cli-codex-gpt55-high-fast-to-implement-factory-fix"
    blockers: []
    completion_pct: 10
---
# Implementation Plan: Robust embedding-provider auto-resolution fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

> Spec: `./spec.md` · Decision: `./decision-record.md` · Research: `../008-embedder-provider-auto-resolution/research/research.md`

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ES module), `@spec-kit/shared` workspace |
| **Runtime** | Node v25 (daemon); `engines` floor `>=20.11` |
| **Storage** | SQLite (`context-index.sqlite` + per-embedder vector shards) |
| **Testing** | Vitest (mcp_server suite) |

### Overview
Phase 008 proved `EMBEDDINGS_PROVIDER=auto` degrades to unhealthy `hf-local` because `factory.ts` reads active-embedder metadata via `execFileSync('sqlite3', …)`, which returns `null` on `ENOENT` under the daemon's restricted `PATH`. This plan replaces that shell-out with a guarded `node:sqlite` read (decision-record ADR-009-01), generalizes the shard-path/provider resolution so it is not hardcoded to ollama, surfaces probe failures, and — only after verification under a sqlite3-less PATH — reverts the interim `EMBEDDINGS_PROVIDER=ollama` pin to `auto`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause proven with file:line evidence (008 research)
- [x] SQLite-reader choice decided (decision-record ADR-009-01)
- [x] Scope frozen in spec.md
- [x] Verification strategy defined (§4)

### Definition of Done
- [ ] No `execFileSync('sqlite3'` remains in the resolution path
- [ ] `shared` + `mcp_server` build clean
- [ ] Regression test passes (fails on old code)
- [ ] §6 verification: restricted PATH → `resolveProvider()` === `ollama`
- [ ] Pin reverted to `auto`; live `memory_health` confirms ollama after reconnect

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Confined refactor inside `factory.ts`'s metadata-probe layer — no change to the cascade order or the public `resolveProvider()` contract.

### Key Components
- **`node:sqlite` reader helper** (new): opens a DB readonly via `DatabaseSync`, runs a single-row scalar query, guarded so an unavailable module warns once and returns null.
- **Metadata probes** (`querySqliteScalar`, `readVecMetadataValue`, `tableExistsInSqlite`, `countRowsInSqliteTable`): re-pointed at the new reader.
- **`readActiveOllamaEmbedderFromDb`**: reads `active_embedder_provider` (default `ollama`); builds shard path `context-vectors__<provider>__<name>__<dim>.sqlite` generically.

### Data Flow
1. `resolveProvider()` calls `resolveActiveOllamaEmbedder()` → iterates DB candidates.
2. Each candidate is read via `node:sqlite` (no subprocess, no PATH dependency).
3. `active_embedder_name`/`dim`/`provider` resolve the shard; row-count > 0 confirms it.
4. On any read failure: warn once, return null → cascade continues (voyage → openai → hf-local).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reader
- [ ] Add guarded `node:sqlite` readonly reader helper
- [ ] Route the four metadata/table/count helpers through it
- [ ] Warn once on a probe read failure (stop silent-null)

### Phase 2: Generalize + cleanup
- [ ] Read `active_embedder_provider` (default `ollama`); build shard path generically
- [ ] Remove the orphaned `execFileSync`/`child_process` import

### Phase 3: Verify + roll out
- [ ] Regression test (sqlite3 off PATH)
- [ ] Build shared + mcp_server; run targeted tests
- [ ] §6 verification harness
- [ ] Revert pin `ollama`→`auto`; reconnect + confirm health

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | `shared` + `mcp_server` build | `tsc` |
| Regression | `auto` resolves with sqlite3 absent from PATH | Vitest |
| Integration | restricted-PATH provider resolution (§6) | node harness |
| Live | `memory_health.embeddingProvider` after pin revert + reconnect | MCP |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node:sqlite` (built-in) | Runtime | Green | Requires Node ≥22.5; defensive import degrades gracefully |
| ollama on :11434 | External | Green | Without it, cascade falls through (expected) |
| `factory.ts` cascade | Internal | Green | Fix must fit existing chain |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `auto` misresolves or embeds break after the pin revert.
- **Procedure**: re-pin `EMBEDDINGS_PROVIDER=ollama` in the configs + reconnect (instant); `git checkout` the `factory.ts` change if needed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Reader) ──> Phase 2 (Generalize) ──> Phase 3 (Verify + roll out)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reader | None | Generalize |
| Generalize | Reader | Verify |
| Verify + roll out | Generalize | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Reader | Medium | 30–45 min |
| Generalize + cleanup | Low | 20 min |
| Verify + roll out | Medium | 30–45 min |
| **Total** | | **~1.5–2 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Interim pin in place (system stays working until step 8)
- [ ] §6 verification green before pin revert
- [ ] Live health confirmed after reconnect

### Rollback Procedure
1. **Immediate**: re-pin `EMBEDDINGS_PROVIDER=ollama` in `.claude/mcp.json` + `opencode.json`.
2. **Reconnect**: `/mcp` reconnect to reload the daemon env.
3. **Revert code**: `git checkout -- .opencode/skills/system-spec-kit/shared/embeddings/factory.ts` if the regression is in the read path.
4. **Verify**: `memory_health.embeddingProvider.provider === "ollama"`.

### Data Reversal
- **Has data migrations?** No — read-only metadata change; no schema or data writes.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
-->
