# Iteration 019 — Angle 19

**Angle:** mcp_server INSTALL_GUIDE and README accuracy against the dual-stack (MCP + CLI front door) reality.

**Summary:** The core dual-stack READMEs are mostly updated, but several install and plugin-bridge docs still describe pre-CLI or pre-launcher realities. The highest-risk issues are false client-entrypoint guidance and invalid verification commands.

**Findings kept:** 5

## [P1][README-MISALIGNMENT] Spec-memory mcp_server README points MCP clients at the backend dist file instead of the launcher

- Evidence: .opencode/skills/system-spec-kit/mcp_server/README.md:39 says `dist/context-server.js` is the MCP client config entry and :237 says it is used by client configuration; opencode.json:18-23 registers `node .opencode/bin/mk-spec-memory-launcher.cjs`; .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:327 says do not point clients at `dist/context-server.js` directly.
- Detail: The code/config reality is launcher-fronted: clients register the launcher, which supervises the backend and IPC bridge. The README still describes the compiled backend artifact as the client-facing entry, which can lead operators to bypass the front-proxy lifecycle and dual-stack behavior.
- Fix sketch: Change README entrypoint wording so `mk-spec-memory-launcher.cjs` is the MCP config entry and `dist/context-server.js` is described only as the launcher-spawned backend artifact.

## [P1][README-MISALIGNMENT] Code-graph plugin bridge README still claims the bridge is broken and session-resume based

- Evidence: .opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md:28-36 says imports are broken and the bridge is non-functional; current bridge code at .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:310-344 warm-probes and calls `.opencode/bin/code-index.cjs` with `--warm-only`; .opencode/skills/system-code-graph/mcp_server/README.md:137 documents the CLI route.
- Detail: The README describes a pre-repair bridge that imported moved session-resume modules and should be retired. The actual bridge now routes through the daemon-backed code-index CLI and blocks prompt-time maintenance tools, so the README is materially false.
- Fix sketch: Rewrite the plugin bridge README around the current CLI/IPC route, warm-only probe behavior, prompt-safe maintenance blocking, and validation commands.

## [P1][DOC-DRIFT] Skill Advisor install guide gives an invalid `advisor_validate` example

- Evidence: .opencode/skills/system-skill-advisor/INSTALL_GUIDE.md:85-89 shows `mk_skill_advisor.advisor_validate({"skillSlug":null})`; schema at .opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:278-282 requires `confirmHeavyRun: true`; tool reference .opencode/skills/system-skill-advisor/references/runtime/tool_ids_reference.md:50 says `advisor_validate` requires `confirmHeavyRun=true`.
- Detail: Following the install guide verification command will fail schema validation because the required confirmation field is missing. The example also does not use the documented MCP namespace form from the tool reference.
- Fix sketch: Update the install verification example to `mcp__mk_skill_advisor__advisor_validate({"confirmHeavyRun":true,"skillSlug":null})` and add the equivalent `skill-advisor.cjs advisor_validate --confirm-heavy-run true` form if desired.

## [P2][DOC-DRIFT] Install guides do not verify the daemon-backed CLI front doors

- Evidence: .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:247-281 verifies only `dist/context-server.js`; .opencode/skills/system-code-graph/INSTALL_GUIDE.md:155-183 verifies only MCP calls and package checks; dual-stack docs at .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:543-545 and .opencode/skills/system-code-graph/README.md:81-88 document `spec-memory.cjs` / `code-index.cjs` warm-only CLI behavior.
- Detail: The install guides are canonical bootstrap docs but stop at MCP and build checks, leaving the full-parity CLI layer unverified. That misses the new transport-down recovery path and makes setup incomplete for the current dual-stack architecture.
- Fix sketch: Add per-system CLI smoke checks: `list-tools`, a read-only status call with `--format json`, and a sandboxed `--warm-only` unavailable-daemon exit-75 check.

## [P2][README-MISALIGNMENT] Spec-kit plugin bridge README inventory is stale after the spec-memory bridge addition

- Evidence: .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md:27-31 lists `spec-kit-skill-advisor-bridge.mjs`; actual glob of `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/*` returned `spec-kit-opencode-message-schema.mjs`, `mk-spec-memory-bridge.mjs`, and `README.md`; .opencode/skills/system-spec-kit/mcp_server/README.md:37 documents the `mk-spec-memory-bridge.mjs` CLI route.
- Detail: The directory README names a bridge file that is no longer present and omits the current spec-memory bridge. This makes local navigation misleading for the OpenCode plugin dual-stack path.
- Fix sketch: Refresh the directory tree and key-file table to list `mk-spec-memory-bridge.mjs` and remove the stale advisor bridge entry.
