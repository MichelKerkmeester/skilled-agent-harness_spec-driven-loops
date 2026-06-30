# Deep Research: Why `EMBEDDINGS_PROVIDER=auto` silently resolves to hf-local instead of the active ollama embedder

> **Executor:** cli-codex `gpt-5.5`, reasoning `high`, service tier `fast` (focused single-pass investigation, read-only).
> **Status:** Converged — root cause proven with code evidence; ranked portable fix recommended.
> **Canonical source:** this file. Spec: `../spec.md`.

---

## 1. EXECUTIVE SUMMARY

`EMBEDDINGS_PROVIDER=auto` is documented as a local-first cascade (`ollama → hf-local → openai → voyage`). On this host it silently resolved to **hf-local** (unhealthy, no backend) even though ollama is up, has `nomic-embed-text:v1.5`, and owns the active vector shard.

**Root cause (proven):** the factory's active-embedder detection reads SQLite metadata by **shelling out to a bare `sqlite3` binary** (`querySqliteScalar` → `execFileSync('sqlite3', …)`), and that helper **returns `null` on *any* error, including `ENOENT`**. The daemon inherits a restricted `PATH` (GUI/MCP launch context) that does not include `sqlite3`, so every metadata probe fails silently → `readActiveOllamaEmbedderFromDb()` returns null → `resolveProvider()` falls through past ollama to the `hf-local` "Local fallback provider".

This corrects the initial hypothesis (that `resolveSpecKitPackageRoot()` failed to locate the DB). The package-root resolver actually works; the failure is the `sqlite3` PATH dependency in the metadata read path.

**Recommended fix:** replace the `sqlite3` shell-out with a Node SQLite read (`better-sqlite3`, already a server dependency) **and** honor `active_embedder_provider` generically (construct the shard path from provider/model/dim rather than the hardcoded ollama pattern). This removes the PATH dependency and the ollama-only assumption while keeping the cascade portable for hosts without ollama.

---

## 2. RESEARCH QUESTION & SCOPE

Why does `auto` resolve to hf-local instead of the active, working ollama embedder, and what is the most robust **portable** fix (no hardcoded provider) so `auto` reliably resolves the active local provider? See `../spec.md` REQ-001/002/003.

---

## 3. METHODOLOGY

Single-pass deep investigation by cli-codex (gpt-5.5, high reasoning, fast tier), read-only, verifying each claim against the actual source (built `shared/dist/embeddings/factory.js` + TS sources + the launcher + the MCP configs), starting from evidence gathered by the orchestrator and instructed to correct or extend it rather than trust it.

---

## 4. ROOT CAUSE (proven, with evidence)

The `resolveProvider()` cascade prefers ollama via `resolveActiveOllamaEmbedder()` → `readActiveOllamaEmbedderFromDb()`, which calls `querySqliteScalar()` / `tableExistsInSqlite()` to read `vec_metadata` + verify the dim table. `querySqliteScalar()` executes a **bare `sqlite3`** subprocess and **swallows every error to `null`** (including `ENOENT` when `sqlite3` is not on `PATH`). The mk-spec-memory daemon is launched by the MCP client with `process.env` passed through unchanged and **no `PATH` normalization**, so on a host where `sqlite3` is not on the daemon's `PATH`, all probes return null → null active ollama embedder → cascade falls through to `hf-local`.

Decisive evidence:
- `querySqliteScalar()` shell-out + null-on-any-error — `shared/embeddings/factory.ts:284`
- `readActiveOllamaEmbedderFromDb()` (uses the probes) — `factory.ts:352`
- `resolveActiveOllamaEmbedder()` — `factory.ts:417`
- `resolveProvider()` cascade → `hf-local` fallback — `factory.ts:609`
- Launcher passes `process.env` unchanged, no `PATH`/DB-env normalization — `mk-spec-memory-launcher.cjs:343`

**Hypothesis corrected:** `resolveSpecKitPackageRoot()` walks up from `import.meta.url`, finds the skill root even when run from `shared/dist/embeddings/factory.js`, and (with `auto` + no DB env) resolves ollama *when `sqlite3` is available*. The package-root path is not the failure.

**Why the live host showed hf-local:** the daemon's `PATH` lacked `sqlite3`. (Interactive shells embed nomic fine because `sqlite3` + ollama are both reachable there.)

---

## 5. RANKED FIX TABLE

| Rank | Fix | Robustness | Portability | Blast radius | Sketch (file:line) |
|---:|---|---|---|---|---|
| 1 | **(b) Harden factory DB discovery/read** — replace `execFileSync('sqlite3', …)` metadata probes with a Node SQLite read (`better-sqlite3`, already a server dep) + reuse `shared/paths.ts` db-dir resolution | High | High | Medium | `factory.ts:284`, `shared/paths.ts:71` |
| 2 | **(d) Persist/use `active_embedder_provider`** — resolve any active provider generically and build the shard path from provider/model/dim instead of the hardcoded ollama pattern | High | High | Medium | `mcp_server/lib/embedders/schema.ts:48`, `factory.ts:385` |
| 3 | **(a) Launcher passes resolved DB dir/path** — set `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` before `spawn()` from the already-resolved `dbDir` | Medium | Medium | Low | `mk-spec-memory-launcher.cjs:126,346` — helps launch-context drift but does NOT fix missing `sqlite3` |
| 4 | **(c) Inject DB dir in MCP config** — add `SPEC_KIT_DB_DIR` beside `EMBEDDINGS_PROVIDER` | Low | Low | Low | config-fragile, repo-layout-specific, still depends on `sqlite3` being executable |

---

## 6. RECOMMENDATION

Adopt **(b) + the provider part of (d)**: make active-provider resolution read the canonical DB via the Node SQLite dependency the server already uses (no `sqlite3` subprocess), then honor `active_embedder_provider` when present and construct the shard path generically. This:
- removes the daemon `PATH` dependency (the actual root cause),
- removes the ollama-only assumption (portable — non-ollama hosts still fall through the existing bootstrap cascade at `shared/embeddings/auto-select.ts:476`),
- lets the interim `EMBEDDINGS_PROVIDER=ollama` config pin be reverted to `auto`.

**Verify after fix:** launch with `EMBEDDINGS_PROVIDER=auto`, a `PATH` that excludes `/usr/bin` (so `sqlite3` is unreachable), and no `MEMORY_DB_PATH`/`SPEC_KIT_DB_DIR`; confirm `memory_health.embeddingProvider.provider === "ollama"` and the active shard path resolves to `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`.

---

## 7. SECOND-ORDER RISKS

- **Active-shard vs embed-provider mismatch:** search reads the ollama shard while a (mis)selected hf-local provider would embed into a *different* shard — re-embeds would not populate the active shard. Fix (d)'s generic provider/shard resolution keeps these aligned.
- **Silent-null anti-pattern:** `querySqliteScalar()` swallowing all errors to null hid the real failure for a long time. The fix should at least log probe failures (or surface them in `memory_health`) so future PATH/DB issues are not silent.
- **Interim pin interaction:** the explicit `EMBEDDINGS_PROVIDER=ollama` pin works precisely because `resolveProvider()`'s explicit-override branch short-circuits *before* the broken sqlite3 probe — so the pin is a valid stopgap, not a fix of the underlying cascade.

---

## 8. NEXT STEPS

`/speckit:plan` an implementation packet for fix (b)+(d): swap the factory metadata probes to a Node SQLite reader, add `active_embedder_provider`-aware generic resolution, add a regression test that simulates a `PATH` without `sqlite3`, then revert the interim `EMBEDDINGS_PROVIDER=ollama` pin to `auto` and verify per §6.

---

<!-- ANCHOR:references -->
## 9. REFERENCES

- Investigation transcript: cli-codex gpt-5.5 high fast (read-only), 2026-05-27.
- Primary code: `shared/embeddings/factory.ts` (`querySqliteScalar:284`, `readActiveOllamaEmbedderFromDb:352`, `resolveActiveOllamaEmbedder:417`, `resolveProvider:609`); `shared/embeddings/providers/ollama.ts` (`OLLAMA_MANIFESTS`/`getOllamaManifest`); `shared/paths.ts:71`; `shared/embeddings/auto-select.ts:476`; `mcp_server/lib/embedders/schema.ts:48`; `.opencode/bin/mk-spec-memory-launcher.cjs:343`.
- Related packets: 004 (backlog drain research), 005 (prevention fixes), 006 (reconcile tool), 007 (vector-coverage hygiene).
<!-- /ANCHOR:references -->
<!-- Evidence citations (file:line) are anchored above; see §4 Root Cause and §5 Ranked Fix Table for inline factory.ts:NNN references. -->
<!-- SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:609 -->
<!-- SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:284 -->
<!-- SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:343 -->
