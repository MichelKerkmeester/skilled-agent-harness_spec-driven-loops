---
title: "Feature Specification: Robust embedding-provider auto-resolution fix (node:sqlite metadata read)"
description: "Implement the 008-recommended durable fix so EMBEDDINGS_PROVIDER=auto resolves the active local (ollama) embedder without depending on a sqlite3 binary on PATH, then revert the interim ollama pin."
trigger_phrases:
  - "embedder auto resolution fix"
  - "factory node:sqlite metadata read"
  - "revert embeddings provider ollama pin"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/009-embedder-auto-resolution-fix"
    last_updated_at: "2026-05-27T13:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "shipped-009-auto-confirmed-live-resolving-ollama-via-node-sqlite"
    next_safe_action: "none-009-complete-optional-push-to-remote"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".claude/mcp.json"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000009"
      session_id: "embedder-auto-resolution-fix-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root cause (008): sqlite3 shell-out returns null on ENOENT under restricted PATH"
      - "SQLite reader choice: node:sqlite (built-in), NOT better-sqlite3 (unresolvable from shared/)"
---
# Feature Specification: Robust embedding-provider auto-resolution fix (node:sqlite metadata read)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (live-confirmed: `auto`→ollama after reconnect) |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
| **Predecessor** | `008-embedder-provider-auto-resolution` (research) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 008 proved why `EMBEDDINGS_PROVIDER=auto` silently degrades to the unhealthy `hf-local` fallback even though ollama is up and owns the active vector shard: `factory.ts` reads the active-embedder metadata by **shelling out to a bare `sqlite3` binary** (`querySqliteScalar` → `execFileSync('sqlite3', …)`), and that helper **returns `null` on *any* error, including `ENOENT`**. The mk-spec-memory daemon runs with a restricted GUI/MCP `PATH` that lacks `sqlite3`, so every metadata probe fails silently → `resolveActiveOllamaEmbedder()` returns null → `resolveProvider()` falls past ollama to `hf-local`. The current mitigation is an explicit `EMBEDDINGS_PROVIDER=ollama` config pin, which is non-portable.

### Purpose
Implement the 008-recommended durable fix — **(b)** replace the `sqlite3` shell-out with a Node SQLite read, and **(d)** honor `active_embedder_provider` generically (build the shard path from provider/model/dim, not a hardcoded ollama pattern) — so `auto` reliably resolves the active local provider. Then revert the interim pin to `auto`.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the `sqlite3`-subprocess metadata probes in `factory.ts` with a `node:sqlite` (`DatabaseSync`, readonly) read.
- Stop silently swallowing probe errors (008 §7): warn once on a read failure.
- Read `active_embedder_provider` from `vec_metadata` and construct the shard path generically; default to `ollama` when the key is absent (back-compat with current DBs).
- Regression test proving `auto` resolves the active provider when `sqlite3` is not on `PATH`.
- Revert the interim `EMBEDDINGS_PROVIDER=ollama` pin to `auto` after the fix verifies.

### Out of Scope
- Changing the cascade order or cloud-provider behavior.
- The reconcile tool (006) and success-vector-coverage hygiene (007).
- Adding a native SQLite dependency to the `shared` layer (the fix uses the built-in `node:sqlite`).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Swap sqlite3 shell-out probes for `node:sqlite` read; generalize shard-path + provider resolution; warn on probe failure |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.<test>` (or mcp_server suite) | Create | Regression test: `auto` resolves active provider with sqlite3 absent from PATH |
| `.claude/mcp.json` | Modify | Revert `EMBEDDINGS_PROVIDER` `ollama` → `auto` (symlink target of `.mcp.json`) |
| `opencode.json` | Modify | Revert `EMBEDDINGS_PROVIDER` `ollama` → `auto` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Active-embedder metadata read must not depend on a `sqlite3` binary on `PATH` | The probes use `node:sqlite`; no `execFileSync('sqlite3', …)` remains in the resolution path |
| REQ-002 | `auto` resolves the active ollama embedder on this host | §6 verification passes: `EMBEDDINGS_PROVIDER=auto` + PATH without `/usr/bin` + no DB env → `resolveProvider()` returns `ollama` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Provider resolution is portable (no hardcoded ollama in the shard path) | Shard path built from `active_embedder_provider`/name/dim; defaults to `ollama` when the key is absent |
| REQ-004 | Probe failures are surfaced, not silently swallowed (008 §7) | A `console.warn` is emitted once when the metadata read fails |
| REQ-005 | Interim pin reverted to `auto` after verification | `.claude/mcp.json` + `opencode.json` show `auto`; a reconnect resolves `ollama` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the pin reverted to `auto` and a restricted `PATH`, `memory_health.embeddingProvider.provider === "ollama"`.
- **SC-002**: No new runtime dependency added to the `shared` layer (`node:sqlite` is built-in).
- **SC-003**: The regression test fails against the old shell-out code and passes against the new `node:sqlite` code.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `node:sqlite` requires Node ≥22.5; `shared` `engines` floor is `>=20.11` | Old-Node hosts can't use the new probe | Defensive import; on unavailability warn + return null (graceful cascade — no worse than a fresh host). See `decision-record.md` |
| Risk | Active-shard vs embed-provider mismatch (008 §7) | Re-embeds land in the wrong shard | Generic provider/shard resolution keeps them aligned |
| Risk | Reverting the pin re-activates `auto` | A subtly wrong fix re-breaks embeds | Revert ONLY after §6 verification passes; reconnect and confirm health |
| Dependency | `factory.ts` resolution cascade | Fix must fit the existing chain | Change is confined to the metadata-probe helpers + `readActiveOllamaEmbedderFromDb` |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
Provider resolution must not spawn a subprocess; the `node:sqlite` read is in-process and bounded to a few small scalar queries per DB candidate.

### Security
Read-only DB access only (no writes, no network, no credentials). Existing SQL escaping (`quoteSqlString`/`quoteSqlIdentifier`) or prepared-statement binding is retained — no injection regression.

### Reliability
On any probe failure (missing module, unreadable DB), the resolver warns once and returns null so the cascade continues — never throws into startup.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `active_embedder_provider` key absent → default to `ollama` (current DBs store only name/dim).
- `active_embedder_name`/`dim` missing or zero rows in the shard → return null (cascade).

### Error Scenarios
- `sqlite3` not on PATH → no longer relevant (no subprocess); previously the silent-null bug.
- `node:sqlite` unavailable (Node <22.5) → warn once, return null (graceful cascade).
- Corrupt/locked DB file → caught, warn, return null.

### State Transitions
- Interim pin `ollama` (explicit override) → `auto` (cascade resolves ollama via the fixed probe) after verification + reconnect.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low-to-moderate. The change is confined to `factory.ts`'s metadata-probe helpers and `readActiveOllamaEmbedderFromDb`; the public `resolveProvider()` contract and cascade order are unchanged. Primary risk is the `shared`-layer module boundary (resolved by choosing built-in `node:sqlite`) and re-activating `auto` (mitigated by verify-before-revert).

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. 008 answered root cause + portable-fix ranking; the SQLite-reader choice is settled in `decision-record.md`.

<!-- /ANCHOR:questions -->
