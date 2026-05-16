# Standalone System Skill Advisor MCP Discussion

## 1. TL;DR

- Constraints A + B mean the extracted advisor must own both its MCP server process and `skill-graph.sqlite` under `.opencode/skills/system-skill-advisor/`, not under `system-spec-kit` and not inside `spec_kit_memory`.
- The original "co-resident with system-spec-kit MCP server" shape is no longer viable; the surviving shapes are a standalone advisor MCP with legacy tool ids, or a standalone advisor MCP with a new namespaced public surface plus compatibility shims.
- Recommendation: pick **Standalone Advisor MCP With Legacy Tool Bridge**. It satisfies the hard constraints while minimizing breakage for hooks, Python shim users, and current MCP callers.
- Top risks: duplicate startup/build plumbing across four runtimes, embedding-provider dependency leakage from `@spec-kit/shared`, and concurrent/competing graph writers during migration.
- Top backwards-compat questions: whether `advisor_*` ids remain stable, and how long `spec_kit_memory` should expose proxy/deprecation tools for callers that still invoke advisor tools there.
- Migration cost by follow-on packet: 002 scaffold new skill folder = M; 003 move source/tests + DB = L; 004 runtime config + compatibility bridge = L; 005 validation/install cleanup = M; optional 006 deprecation removal = S/M.
- I would not introduce `system_skill_advisor.*` as the first public surface. Use the MCP server name for namespacing and keep tool ids stable until the extraction has settled.

## 2. Impact Analysis

### MCP Server Topology

Today: The advisor is documented as a package under `system-spec-kit` and the package README says its native MCP tools are the primary runtime surface while Python remains compatibility fallback (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/README.md:32`, `:36-38`). The bootstrap guide is stronger: "do not register a second MCP server" (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/INSTALL_GUIDE.md:8`). The actual server is `context-server`, which registers all tools from `TOOL_DEFINITIONS` (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:917-930`) and dispatches calls through `dispatchTool` (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1030-1037`).

Forced by A + B: The advisor has to become a second stdio MCP server, separate from `spec_kit_memory`. That means one extra process per runtime session, one extra server entry in each runtime config, and a dedicated entrypoint, likely under `.opencode/skills/system-skill-advisor/mcp_server/dist/`.

Options: One viable option is a TypeScript standalone server that imports/moves advisor handlers, descriptors, and skill-graph storage into the new skill. Another is a thin standalone server that depends on a shared library package while the old server keeps proxy wrappers temporarily.

ADR decision: Choose whether `spec_kit_memory` fully drops advisor registration immediately or keeps proxy/deprecation tools for one migration window. My recommendation is proxy/deprecation for one window only.

### 4-Runtime Config

Today: `opencode.json` registers `spec_kit_memory` as `node .opencode/bin/spec-kit-memory-launcher.cjs` (`opencode.json:19-24`). Codex does the same in `.codex/config.toml` (`.codex/config.toml:9-12`). Claude and Gemini also point to the same launcher (`.claude/mcp.json:10-14`, `.gemini/settings.json:26-31`). No current config registers a separate advisor MCP server.

Forced by A + B: All four runtime configs need a second MCP entry, probably `system_skill_advisor`, using a new launcher. Gemini also has hook commands that call built artifacts under `system-spec-kit/mcp_server/dist/hooks/...` (`.gemini/settings.json:85`, `:97`, `:109`, `:115`, `:127`), so hook binaries need either relocation or wrapper paths.

Options: Add a parallel `system_skill_advisor` MCP server entry everywhere while leaving `spec_kit_memory` unchanged. Or replace the existing server entry with a compound launcher that starts both processes, but that violates the clean process boundary and makes failures harder to diagnose.

ADR decision: Decide the new server id and config update policy. I recommend a separate `system_skill_advisor` MCP entry in all four configs, not a compound launcher.

### Tool Registration

Today: Advisor tool descriptors live under `skill_advisor/tools/*` and are imported into the memory server's `tool-schemas.ts` (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:11-15`). They are appended to the memory server's global `TOOL_DEFINITIONS` list (`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:1088-1095`). Runtime dispatch imports advisor handlers directly into `mcp_server/tools/index.ts` (`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:13-18`) and maps `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate` in a local dispatcher (`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:83-104`).

Forced by A + B: Tool descriptors, Zod input schemas, and dispatch have to move with the advisor server. The memory server must stop importing advisor tool modules, otherwise the process boundary is fake.

Options: Move `skill_advisor/tools`, `skill_advisor/schemas`, and `skill_advisor/handlers` into `.opencode/skills/system-skill-advisor/mcp_server/`, and give the new server its own `tool-schemas.ts` plus dispatcher. Alternatively, factor common descriptors into a neutral package, but that adds indirection before the extraction proves itself.

ADR decision: Decide whether the standalone server owns both descriptor JSON Schema and Zod validation. I recommend yes; keep schema ownership local to the advisor package.

### DB Ownership

Today: `skill-graph.sqlite` is named in `skill-graph-db.ts` (`.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:102-105`) but its path defaults to `DATABASE_DIR` from the memory server core config (`.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:13`, `:273-275`). `context-server.ts` hardcodes the skill graph path as `path.join(DATABASE_DIR, 'skill-graph.sqlite')` (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:228-230`). The database directory README confirms `mcp_server/database/` stores generated runtime databases, including SQLite sidecars (`.opencode/skills/system-spec-kit/mcp_server/database/README.md:31-39`, `:83-93`).

Forced by A + B: The DB path resolver must stop using `system-spec-kit/mcp_server/core/config.ts` for advisor state. `skill-graph.sqlite`, `-wal`, and `-shm` should live under something like `.opencode/skills/system-skill-advisor/mcp_server/database/`.

Options: A package-local `advisor-db-paths.ts` can resolve `SYSTEM_SKILL_ADVISOR_DB_DIR` with a default under the new skill. A stronger option is to make the DB path non-configurable except for tests, reducing accidental re-collocation with memory.

ADR decision: Decide whether any env override is allowed. I recommend allowing `SYSTEM_SKILL_ADVISOR_DB_DIR` for tests/CI only, while defaulting to the new skill-local database directory.

### Concurrent Writers

Today: The DB module uses a module-level singleton and WAL mode (`.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:189-190`, `:248-250`). Startup/watcher indexing has an in-process scan gate (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1497-1543`), but tool-triggered writes also exist: `skill_graph_scan` calls `indexSkillMetadata` and `refreshSkillEmbeddings` (`.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:49-50`), while `advisor_rebuild` calls `indexSkillMetadata` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:84-86`).

Forced by A + B: Once the DB is advisor-owned, the standalone advisor process should be the only writer. The memory MCP should not run `skill_graph_scan` against that DB after the cutover unless it calls the advisor MCP as a client, which is not worth the IPC complexity.

Options: Keep `skill_graph_*` tools with advisor server and remove them from memory, or split graph inspection (`skill_graph_status/query`) into advisor and leave no skill-graph tools in memory. Do not let both servers open the same SQLite file for writes.

ADR decision: Decide whether `skill_graph_*` belongs to the standalone advisor server. I recommend yes, because those tools manage the same DB that advisor recommendations consume.

### Embedding Pipeline

Today: Skill embeddings use the memory MCP's shared embedding factory import (`.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:9`). `refreshSkillEmbeddings` creates a provider and writes embeddings into `skill_nodes` (`.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:733-799`). The semantic shadow lane also creates a provider for prompt embeddings and loads skill embeddings from the skill graph DB (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/semantic-shadow.ts:5-6`, `:68-83`, `:127-132`). The current server startup validates embedding config and sets `EMBEDDING_DIM` inside `context-server.ts` (`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1827-1840`).

Forced by A + B: The standalone advisor cannot rely on the memory server having initialized embedding config in the same process. It needs its own provider resolution, env notes, and startup validation, while reusing the same `@spec-kit/shared` implementation as a library dependency.

Options: Share code, not runtime. The advisor package can depend on `@spec-kit/shared` or a moved neutral shared package, but it should instantiate its own provider lazily. Sharing a live provider instance across MCP processes would require IPC or an embedding service and is not justified.

ADR decision: Decide whether `@spec-kit/shared` remains inside `system-spec-kit` or moves to a more neutral package. Short term: keep the file dependency and accept the naming leak. Long term: promote shared embeddings to a neutral `.opencode/skills/shared-runtime/` or package root.

### Tool-Id Naming

Today: The public tool ids are plain `advisor_*`. The hook reference lists `advisor_recommend`, `advisor_status`, `advisor_rebuild`, and `advisor_validate` as the native baseline (`.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md:39-47`). The tool descriptors also use those exact names (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts:25-33`, `advisor-rebuild.ts:8-18`, `advisor-status.ts:7-17`, `advisor-validate.ts:16-24`).

Forced by A + B: The server-level namespace changes from `spec_kit_memory` to the new MCP server id. In clients that expose namespaced MCP calls, `system_skill_advisor.advisor_recommend` is already unambiguous without changing the tool id itself.

Options: Keep `advisor_*` tools in the new server, or rename to `system_skill_advisor.*` / `system_skill_advisor_*`. A hard rename increases hook, docs, Python shim, and operator-guide churn for little gain.

ADR decision: Decide whether tool-id stability matters more than cosmetic namespace clarity. I recommend keeping `advisor_*` in the standalone server and using server id `system_skill_advisor` for namespace separation.

### Backwards Compatibility

Today: The extraction parent explicitly asks how existing `advisor_*` ids are preserved (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/006-system-skill-advisor-extraction/spec.md:28-31`) and says public ids are preserved unless the ADR chooses otherwise (`.../009-system-skill-advisor-extraction/spec.md:72-77`). The design child flags backwards compatibility for hooks, scripts, internal callers, and doctor commands (`.../001-design-and-decision-record/spec.md:64-67`).

Forced by A + B: Existing callers that reach `advisor_recommend` through `spec_kit_memory` will break unless there is a transition strategy. Current docs and install guides tell users to run `advisor_status`, `advisor_recommend`, and `advisor_validate` directly (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/SET-UP_GUIDE.md:62-74`; `.opencode/install_guides/SET-UP - Skill Advisor.md:72-75`, `:124-136`).

Options: Provide temporary proxy tools in `spec_kit_memory` that return a deprecation response or internally shell/call the standalone server. Better: leave a clear fail-fast deprecation message and keep Python shim fallback functional. Best operational compromise: dual-register tool ids briefly in both servers, with memory-side tools marked deprecated and removed after install docs/configs land.

ADR decision: Decide whether dual registration is acceptable. I recommend one transition packet with dual registration, then removal.

### Launcher CJS

Today: `spec-kit-memory-launcher.cjs` loads `.env.local` / `.env`, ensures the skill layout, builds missing artifacts, acquires a bootstrap lock in the memory DB directory, records launcher state, then spawns `dist/context-server.js` (`.opencode/bin/spec-kit-memory-launcher.cjs:13-41`, `:123-154`, `:156-176`, `:178-184`, `:211-255`).

Forced by A + B: The advisor needs an analogous launcher or every runtime must assume the advisor server is already built. Because all four runtime configs currently call launchers, the least surprising path is `.opencode/bin/skill-advisor-launcher.cjs`.

Options: Copy the launcher pattern with advisor-local artifact checks and lock files, or make the runtime config call `node .opencode/skills/system-skill-advisor/mcp_server/dist/server.js` directly. Direct calls are faster but brittle on cold clones.

ADR decision: Decide whether cold-start build support is required. I recommend a new CJS launcher modeled on the existing memory launcher, but scoped to advisor artifacts and the advisor DB dir.

### Startup Hooks

Today: The hook reference says prompt-time adapters call `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })` and use native advisor when live or stale, then fallback when unavailable (`.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md:25-35`). The runtime matrix points hooks to files under `system-spec-kit/mcp_server/hooks/...` and the OpenCode plugin bridge under `system-spec-kit` paths (`.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md:50-60`). Gemini config hardcodes built hook paths under `system-spec-kit/mcp_server/dist/hooks/gemini/...` (`.gemini/settings.json:85`, `:97`, `:109`, `:115`, `:127`).

Forced by A + B: The hook contract should survive, but implementation ownership should move or wrap. Hooks are not themselves MCP tools; they need a stable way to call the advisor library/server and fail open without raw prompt persistence.

Options: Move hook producers into `system-skill-advisor` and update runtime configs. Or keep thin hook wrappers in `system-spec-kit` that import the new advisor compat package for one cycle. The first is cleaner; the second lowers migration risk.

ADR decision: Decide whether hooks move in the same packet as MCP extraction. I recommend wrapper-first, move-second: keep runtime hook paths stable while their implementation delegates to the new advisor package, then relocate configs once tests pass.

### Test Isolation

Today: Advisor tests live inside the memory MCP package tree and are run with the memory server Vitest config. The package README validates with `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck`, `run build`, and Vitest over `skill_advisor/tests/` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/README.md:172-182`). The tests README says this test folder covers advisor routing, handlers, hooks, schemas, Python parity, scorer paths, and compatibility behavior (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/README.md:26-35`, `:66-84`).

Forced by A + B: Standalone advisor should have its own `package.json`, `tsconfig`, `vitest.config.ts`, fixtures, and DB temp root. Tests should no longer require unrelated memory MCP startup or vector-index schema checks.

Options: Move all advisor tests into the new package and keep a few integration tests in `system-spec-kit` for proxy/deprecation compatibility. Or leave tests in memory until after source move; that undermines the standalone claim.

ADR decision: Decide whether tests move with source in 003. I recommend yes, with one small cross-package compatibility suite left behind temporarily.

### Install Path

Today: The install guide inventory includes "SET-UP - Skill Advisor" as a setup guide (`.opencode/install_guides/README.md:84-88`). That guide currently assumes system-spec-kit MCP server build output and `skill_graph_scan` in the same tool list (`.opencode/install_guides/SET-UP - Skill Advisor.md:17-21`, `:43-58`). It also states that the advisor reads scoring inputs from `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite` (`.opencode/install_guides/SET-UP - Skill Advisor.md:85`).

Forced by A + B: Install docs must add a first-class MCP guide or update the existing setup guide to register `system_skill_advisor`, run `skill-advisor-launcher.cjs`, and point DB troubleshooting at the new skill-local path.

Options: Add `MCP - System Skill Advisor.md` plus update `SET-UP - Skill Advisor.md`, or fold everything into the setup guide. Because this is now a standalone MCP server, it deserves an MCP install guide entry.

ADR decision: Decide the docs inventory shape. I recommend adding a new MCP guide and updating the setup guide to reference it.

## 3. Architectural Shape Recommendation

Pick **Standalone Advisor MCP With Legacy Tool Bridge**.

The winning shape is a dedicated `.opencode/skills/system-skill-advisor/` package with its own `mcp_server`, `database/skill-graph.sqlite`, launcher, runtime config entry, tool descriptors, schemas, handlers, tests, feature catalog, and playbook. It keeps public tool ids as `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate` on the new `system_skill_advisor` MCP server. During migration, `spec_kit_memory` either exposes deprecated proxy tools or a clear fail-fast compatibility response, then drops those imports once runtime configs and hooks are migrated.

This is the right trade: it honors the operator's hard process and DB ownership constraints without forcing every consumer to absorb a tool-id rename at the same time. The old co-resident shape is dead. The only real choice left is whether to preserve public ids or rename them; preserving ids reduces risk while server-level namespacing gives enough collision protection.

## 4. 5-Phase Migration Sequence (Provisional)

1. **002-scaffold-advisor-package**  
   Deliverable: Create `.opencode/skills/system-skill-advisor/` with `SKILL.md`, `README.md`, `graph-metadata.json`, `feature_catalog/`, `manual_testing_playbook/`, `references/`, and an empty `mcp_server/` scaffold. Include package-local database path policy and install-guide draft stubs, but do not move runtime behavior yet.  
   Critical dependency: 001 ADR ships.  
   Effort: M.

2. **003-move-advisor-source-db-and-tests**  
   Deliverable: Move advisor `handlers/`, `lib/`, `tools/`, `schemas/`, `scripts/`, `compat/`, and tests into the new package. Move skill-graph DB code with it, switch the default DB dir to `.opencode/skills/system-skill-advisor/mcp_server/database/`, and give the package its own TypeScript/Vitest config. Leave memory-side proxy imports only if needed for 004.  
   Critical dependency: 002 scaffold exists.  
   Effort: L.

3. **004-standalone-mcp-launcher-and-runtime-configs**  
   Deliverable: Add `.opencode/bin/skill-advisor-launcher.cjs`, standalone MCP server entrypoint, `system_skill_advisor` entries in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`, plus cold-start build/state handling. Keep `spec_kit_memory` alive for memory tools only.  
   Critical dependency: 003 source package builds.  
   Effort: L.

4. **005-hooks-compat-and-consumer-cutover**  
   Deliverable: Update hook wrappers, Python shim, OpenCode plugin bridge, doctor skill-advisor workflow, install guides, and any direct `advisor_*` consumers to target the standalone package/server. Keep legacy tool ids. Add deprecation/proxy behavior in `spec_kit_memory` only if required by live consumers, with tests proving both paths.  
   Critical dependency: 004 server launches in all runtimes.  
   Effort: L.

5. **006-validation-cleanup-and-deprecation-removal**  
   Deliverable: Run package-local Vitest, Python parity, hook smoke tests, runtime config validation, advisor live probes, DB path verification, and install guide checks. Remove old advisor source paths, stale docs that say "do not register a second MCP server", and any temporary `spec_kit_memory` proxies once consumers are cut over.  
   Critical dependency: 005 consumer cutover is green.  
   Effort: M.

## 5. Open Questions for the Operator

- Does `advisor_*` tool-id stability matter for the first standalone release, or are consumers allowed to migrate to renamed `system_skill_advisor_*` / `system_skill_advisor.*` tools immediately?
- Should `spec_kit_memory` keep temporary deprecated advisor proxy tools, or should calls through the old MCP server fail fast with a migration hint?
- What exact server id should runtime configs use: `system_skill_advisor`, `skill_advisor`, or `system-skill-advisor` where supported?
- Should `skill_graph_*` tools move into the advisor MCP server with the DB, or should any skill graph inspection tools remain visible through memory as read-only proxies?
- Should the standalone launcher be `.opencode/bin/skill-advisor-launcher.cjs` modeled on `spec-kit-memory-launcher.cjs`, or should runtime configs call the advisor server directly after install?
- Is `@spec-kit/shared` allowed as a dependency from the extracted package, despite the `spec-kit` name, or should shared embeddings/path/unicode helpers move to a neutral shared package first?
- Should the advisor DB path allow an env override such as `SYSTEM_SKILL_ADVISOR_DB_DIR`, or should it be fixed under `.opencode/skills/system-skill-advisor/` except in tests?
- Should runtime hooks move physically into `system-skill-advisor` in the same migration, or should stable wrappers remain under `system-spec-kit` until after standalone MCP cutover?
- What is the accepted deprecation window for docs and guides that currently instruct users to build `system-spec-kit/mcp_server` for advisor behavior?
- Should Python compatibility remain forever, or only until all four runtime hooks use the standalone TypeScript package directly?

