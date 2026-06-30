# Operator Runbook: skill-advisor jina-embeddings-v3 swap

> **Status:** PARTIAL — operator-discipline approach. Full cross-wiring of skill-graph-db.ts writer to the new EmbedderAdapter layer is deferred to **010/004** (see "Known Architecture Gap" below).

## Overview

This runbook documents how to swap skill-advisor's active embedder from the gemma baseline (the OLD `createEmbeddingsProvider` factory default via llama-cpp-baseline) to jina-embeddings-v3 (the NEW EmbedderAdapter layer shipped in 010/001).

**Authored:** 2026-05-17
**Verified against:** commit `170aa2c98` (after P0-D fix) + commit `d5c1355b1` (after E review)
**Maintainer:** skill-advisor team

---

## Architecture Context (READ FIRST)

010/001 shipped the parallel pluggable EmbedderAdapter layer mirroring mk-spec-memory 016/001-003. The layer consists of:

- `lib/embedders/adapter.ts` — `EmbedderAdapter` interface
- `lib/embedders/registry.ts` — MANIFESTS (8 vetted embedders including jina-embeddings-v3 @ 1024d via Ollama)
- `lib/embedders/schema.ts` — `setActiveEmbedder()` writes to `vec_metadata` + creates `vec_<dim>` table
- `lib/embedders/adapters/ollama.ts` — OllamaAdapter for HTTP-based embedding (jina-v3 native path)
- `lib/embedders/adapters/llama-cpp-baseline.ts` — fallback adapter wrapping the OLD `createEmbeddingsProvider` factory (for gemma baseline)

### Half-wired state (010/002 architectural finding)

010/001 wired the **READ path**:
- `lib/scorer/lanes/semantic-shadow.ts:72` — uses `getAdapter(active.name)` for query embeddings
- `lib/skill-graph/skill-graph-db.ts:840` — `loadSkillEmbeddings()` reads from `vec_<active.dim>` when `hasActiveEmbedderPointer()` is true

010/001 did NOT wire the **WRITE path**:
- `lib/skill-graph/skill-graph-db.ts:769` — `refreshSkillEmbeddings()` still uses OLD `createEmbeddingsProvider()` + writes only to legacy `skill_nodes.embedding` BLOB column
- The OLD factory only supports voyage/openai/llama-cpp/hf-local providers — has NO native Ollama provider, so it cannot produce jina-v3 vectors

### Net effect of the half-wired state

If you set `vec_metadata.active_embedder_name = 'jina-embeddings-v3'` WITHOUT also wiring `refreshSkillEmbeddings()` to use the new adapter layer:
1. `vec_metadata` reads `jina-embeddings-v3` ✅
2. `loadSkillEmbeddings()` reads from `vec_1024` table — but the table is **empty** because no writer populates it
3. `semantic-shadow.ts` query embeddings via jina-v3 ✅ — but find no matches in the empty `vec_1024` table
4. **Result**: semantic-shadow lane silently degrades to zero results until 010/004 ships

This is the P1-1 finding from the E deep-review (review-002/iteration-003 — "active embedder pointer switches reads to vec tables while refresh still writes legacy embeddings").

---

## Operator-Discipline Approach (this packet's deliverable)

Given the half-wired state, the operator-safe swap procedure is:

**DO NOT flip the active pointer in production until 010/004 ships the writer cross-wiring.**

This runbook documents the eventual swap procedure assuming 010/004 has shipped:

### Prerequisites
- 010/001 (pluggable layer) — shipped at commit `ed5eb0e56`
- **010/004 (writer cross-wiring) — REQUIRED, not yet shipped** ← BLOCKING
- jina-v3 model pulled via Ollama: `ollama pull jina/jina-embeddings-v3` (or use Ollama-served path)
- skill-advisor daemon stopped (operator action)

### Swap procedure (post-010/004)

```bash
# 1. Snapshot DB for rollback safety
DB=".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite"
cp "$DB" "${DB}.snap-$(date +%Y%m%d-%H%M%S)"

# 2. Stop the daemon (operator action)
pkill -TERM -f "mk-skill-advisor-launcher.cjs"
pkill -TERM -f "system-skill-advisor/.*advisor-server.js"

# 3. Verify daemon stopped
ps -ef | grep -E "skill-advisor|skill_advisor" | grep -v grep
# (expect empty)

# 4. Set active embedder via one-shot script (requires 010/004 wiring)
node -e "
  import('./.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/lib/embedders/schema.js').then(({setActiveEmbedder}) =>
    import('better-sqlite3').then(({default: Database}) => {
      const db = new Database('${DB}');
      setActiveEmbedder(db, 'jina-embeddings-v3', 1024);
      console.log('Active embedder set to jina-embeddings-v3 @ 1024d');
    }));"

# 5. Trigger rebuild (010/004 writer populates vec_1024)
# NOTE: until 010/004 ships, this step needs a manual rebuild script

# 6. Restart daemon (will auto-start on next MCP request via launcher)

# 7. Smoke test
cd .opencode/skills/system-skill-advisor/mcp_server
python3 scripts/skill_advisor.py recommend "memory save" | head -10
# Expected: top-3 includes system-spec-kit
```

### Rollback (if smoke regresses)

```bash
# Restore from snapshot
cp "${DB}.snap-YYYYMMDD-HHMMSS" "$DB"

# Or: explicitly flip pointer back to gemma
node -e "
  import('./.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/lib/embedders/schema.js').then(({setActiveEmbedder}) =>
    import('better-sqlite3').then(({default: Database}) => {
      const db = new Database('${DB}');
      setActiveEmbedder(db, 'embeddinggemma-300m', 768);
    }));"
```

---

## Known Architecture Gap → 010/004 follow-on

The writer cross-wiring requires:

1. **Modify `refreshSkillEmbeddings()` in `skill-graph-db.ts`**:
   - When `hasActiveEmbedderPointer(database)` is true:
     - Get active embedder via `getActiveEmbedder(database)`
     - Use `getAdapter(active.name)` from `lib/embedders/registry.ts` instead of `createEmbeddingsProvider()`
     - Write to `vec_<active.dim>` table via INSERT OR REPLACE
   - When pointer NOT set:
     - Keep legacy code path (backward compatibility for fresh installs)

2. **Atomic swap discipline**: Wrap pointer flip + writer-target switch in a coordinated way to avoid the regression-risk surfaced by E review P1-1.

3. **Tests**: Add integration test that asserts round-trip (write via new adapter → read via `loadSkillEmbeddings`).

4. **Smoke**: 5-query top-3 sanity baseline after swap (this runbook's §"Swap procedure" step 7).

---

## Verification Status (this packet)

| R# | Requirement | Status | Notes |
|---|---|---|---|
| R1 | `vec_metadata.active_embedder_name` reads `jina-embeddings-v3` post-swap | **DEFERRED** | Blocked on 010/004 writer cross-wiring |
| R2 | Reindex completes without errors; row count preserved | **DEFERRED** | Reindex requires 010/004 |
| R3 | semantic-shadow smoke test returns non-empty top-3 | **DEFERRED** | Empty vec_1024 until 010/004 populates |
| R4 | `skill_advisor.py recommend "memory save"` includes `system-spec-kit` in top-3 | **DEFERRED** | See R3 |
| R5 | Existing skill-advisor test suite passes (regression baseline) | N/A (no code change in this packet) | task #49 pre-existing failures |

This packet ships:
- ✅ Operator runbook (this file)
- ✅ DB snapshot at `database/skill-graph.sqlite.snap-pre-jina-2026-05-17`
- ✅ Architecture-gap documentation (above)
- ❌ Actual swap execution (deferred to 010/004 cross-wiring + then runbook execution)

---

## Cross-references

- **E review P1-1**: `003-skill-advisor-stack/001-pluggable-architecture/review/review-report.md` §4 (regression-risk: pointer/refresh split)
- **E review P2-11**: same review §5 (documentation-alignment: docs claim env-var swap; impl uses vec_metadata)
- **D review P0-D fix**: commit `170aa2c98` (rescue-cap dead telemetry — unrelated but adjacent)
- **mk-spec-memory analog**: `016/001-003` (proves the pattern works at scale)
- **Snapshot location**: `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite.snap-pre-jina-2026-05-17`
