# Decision Record: SQLite reader for the factory metadata probe

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

## ADR-009-01: Use `node:sqlite`, not `better-sqlite3`, for active-embedder metadata reads

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-27 |
| **Deciders** | main_agent (Opus), cli-codex gpt-5.5 (008 research) |
| **Context packet** | 009-embedder-auto-resolution-fix |

### Context

Phase 008 root-caused the `auto`→`hf-local` degradation to `factory.ts` reading active-embedder metadata via `execFileSync('sqlite3', …)`, which returns `null` on `ENOENT` when `sqlite3` is not on the daemon's restricted `PATH`. The 008 ranked recommendation was to replace the shell-out with a **Node SQLite read using `better-sqlite3`** ("already a server dependency").

Verification during 009 implementation planning showed that recommendation does **not** hold for the `shared` layer:

- `better-sqlite3` is **MODULE_NOT_FOUND from the repo root** — it is declared only by `mcp_server/package.json` (`^12.6.2`) and hoisted into `mcp_server/node_modules`, not the workspace root.
- `factory.ts` lives in the `@spec-kit/shared` workspace. Node resolves bare specifiers by the **importing file's location**, so `import Database from 'better-sqlite3'` from `shared/dist/embeddings/factory.js` walks up `shared/…` and would **fail to resolve even inside the running daemon** (it never reaches `mcp_server/node_modules`).
- `shared/types.ts` only does `import type … from 'better-sqlite3'` (erased at compile time — no runtime resolution), so its presence does not prove runtime availability.
- `shared/package.json` deps are intentionally light (`@huggingface/transformers` only). Adding a native module to that layer is a deliberate dependency-surface change with a per-platform build cost.
- The daemon's Node is **v25** and exposes the built-in **`node:sqlite`** (`DatabaseSync`); the codebase's read-only idiom (`new Database(path, { readonly: true, fileMustExist: true })`) maps cleanly onto it.

### Decision

Use the built-in **`node:sqlite` `DatabaseSync`** (opened read-only) for the factory's active-embedder metadata probes. Do **not** add `better-sqlite3` to the `shared` layer.

Import `node:sqlite` **defensively** (lazy/guarded) so that on a Node runtime without it (`<22.5`, below the `>=20.11` `engines` floor) the probe warns once and returns `null`, letting the existing cascade continue — the same outcome a fresh host already gets, so no regression.

### Consequences

- **Positive:** zero new runtime dependencies in `shared`; no native-module build; no module-resolution boundary problem; removes the `PATH`/`sqlite3` dependency that was the root cause.
- **Negative:** the new probe path requires Node ≥22.5 (above the documented `>=20.11` floor). Mitigated by the defensive import + graceful-null fallback. `node:sqlite` also emits an `ExperimentalWarning` (acceptable; can be suppressed at the call site if noisy).
- **Follow-on:** stop swallowing probe errors silently (008 §7) — emit a single `console.warn` on read failure so future PATH/DB issues surface.

### Alternatives rejected

| Alternative | Why rejected |
|-------------|--------------|
| `better-sqlite3` (008 rec) | Not resolvable from `shared/dist` (declared only in `mcp_server`); adds a native dep to a deliberately light layer |
| Keep the `sqlite3` shell-out | It *is* the bug (ENOENT on restricted PATH) |
| Inject `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` in MCP config (008 fix c) | Config-fragile, repo-layout-specific, and still depends on `sqlite3` being executable |
| Launcher passes resolved DB dir (008 fix a) | Helps launch-context drift but does not remove the missing-`sqlite3` dependency |
