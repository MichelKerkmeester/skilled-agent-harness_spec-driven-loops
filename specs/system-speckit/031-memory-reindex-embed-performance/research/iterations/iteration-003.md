# Iteration 3: Model-Server Socket Fallback Reachability

## Focus

Determine whether the overlong `resolveModelServerSocketPath()` fallback is reachable through real repository-managed launcher paths, close the resolver/caller inventory, recommend a permanent short-path default without implementing it, and independently re-verify iteration 1's source write-back caller inventory.

## Actions Taken

1. Enumerated every production and test reference to `resolveModelServerSocketPath()`, `startModelServerDemandListener()`, `mk-spec-memory-launcher.cjs`, and `mk-skill-advisor-launcher.cjs` across the launcher, CLI, plugin-bridge, command, stress-harness, and test surfaces.
2. Traced environment construction for OpenCode and Claude MCP registrations, both daemon-backed CLI shims, their TypeScript cold-spawn paths, the skill-advisor plugin bridge, and the substrate stress harness.
3. Traced model-control initialization and feature gating in both launchers to distinguish "launcher invoked without the variables" from "the overlong model socket is actually resolved and bound."
4. Re-ran an independent exact-symbol sweep for every `finalizeMemoryFileContent(` call and every `persistQualityLoopContent` reference, then inspected both write sites and all option-setting sites.

## Findings

### F-011: Normal MCP registrations do not reach the fallback

Both checked-in host registrations invoke the launchers with an explicit shared model target, `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock`, and a short service-specific `SPECKIT_IPC_SOCKET_DIR`. This is true for OpenCode and Claude. Consequently, the normal MCP-launched mk-spec-memory and mk-skill-advisor paths return the explicit model target at the first resolver branch and never construct the database-directory fallback. [SOURCE: opencode.json:18-27] [SOURCE: opencode.json:47-59] [SOURCE: .claude/mcp.json:9-17] [SOURCE: .claude/mcp.json:37-48] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:469-478]

### F-012: The daemon-backed CLI cold-spawn paths omit the model URL but remain below `sun_path`

`spec-memory.cjs` and `skill-advisor.cjs` each synthesize a short `SPECKIT_IPC_SOCKET_DIR` (`/tmp/mk-spec-memory` and `/tmp/mk-skill-advisor`) before entering their compiled CLIs. The compiled CLIs repeat that defaulting and spawn their launcher with `env: process.env`. Therefore a CLI cold start with no ambient model URL resolves the model socket below the short service directory rather than below the repository database directory. This does not overflow, although it can diverge from the explicitly configured cross-service `/tmp/mk-hf-embed/hf-embed.sock` sharing target. [SOURCE: .opencode/bin/spec-memory.cjs:133-159] [SOURCE: .opencode/bin/skill-advisor.cjs:85-107] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/spec-memory-cli.ts:840-862] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts:1052-1085]

The substrate stress harness is also safe: it directly launches mk-spec-memory but explicitly supplies a generated short socket directory, with an in-code comment identifying the long default as unsafe. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/stress-test/substrate/run-substrate-stress-harness.mjs:816-831]

### F-013: A real plugin path can invoke the advisor launcher without either variable, but the model overflow is normally masked

The OpenCode skill-advisor plugin bridge is a real non-shell launcher caller. `callAdvisorTool()` creates an MCP stdio transport for `mk-skill-advisor-launcher.cjs` using `createChildEnv()`. That allowlist forwards `SPECKIT_IPC_SOCKET_DIR` only when it already exists in the plugin host environment, does not include `HF_EMBED_SERVER_URL`, and does not synthesize the short default used by `createCliChildEnv()`. The bridge's warm-only CLI fallback is different and safe because `createCliChildEnv()` always supplies `/tmp/mk-skill-advisor`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:46-91] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:208-233] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:375-390] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs:730-763]

That omission does not make the model-specific `sun_path` failure part of the default plugin flow. Advisor-owned model supervision is opt-in via `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1`; otherwise the launcher creates the control object but does not call its socket resolver or start its demand listener. If the opt-in is supplied through the launcher's repository `.env` loading while both socket variables remain absent, the post-server-launch `startDemandListener()` path resolves the system-spec-kit database fallback and reaches the 103-byte assertion. On macOS an earlier advisor daemon IPC path under its database directory can fail first, so the model overflow is a latent/conditionally reachable second failure rather than the first failure in the ordinary plugin route. [SOURCE: .opencode/bin/mk-skill-advisor-launcher.cjs:50-75] [SOURCE: .opencode/bin/mk-skill-advisor-launcher.cjs:932-947] [SOURCE: .opencode/bin/mk-skill-advisor-launcher.cjs:988-1009] [SOURCE: .opencode/bin/mk-skill-advisor-launcher.cjs:1410-1417] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1044-1049] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1368-1375]

No cron job, worktree-session wrapper, command repair route, or GitHub workflow that directly executes either launcher was found in the targeted executable/config search. The other direct references are host configuration, CLI cold-spawn code, the plugin bridge, stress/integration harnesses, tests, or documentation/validation references. One skipped IPC integration test does spawn mk-spec-memory without the variables, but that case exits on a lease-held/no-bridge branch before model-listener startup. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge.vitest.ts:130-170] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge.vitest.ts:231-240]

### F-014: The unsafe socket fallback has one implementation authority; nearby database fallbacks are not socket paths

The only underlying implementation of model socket resolution is `model-server-supervision.cjs:469-479`. Both launchers are wrappers or consumers of that function, and `createModelServerControl()` closes over the same resolver. `modelServerRespawnLockPath()` and `modelServerGiveUpPath()` also use the system-spec-kit database directory when their target is TCP, but those values are ordinary lock/cooldown file paths and are not passed to AF_UNIX `bind()`. They do not create another `sun_path` overflow site. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:469-479] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:531-544] [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:1044-1049] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:984-988] [SOURCE: .opencode/bin/mk-skill-advisor-launcher.cjs:943-947]

### F-015: Safest permanent fix is a canonical short model-socket fallback independent of `dbDir`

The fallback should default to the same shared target already pinned by both MCP configurations: `/tmp/mk-hf-embed/hf-embed.sock`. The specific implementation change should introduce one model-server default directory/target constant in `model-server-supervision.cjs` and make `resolveModelServerSocketPath()` use it whenever neither `options.listenTarget` nor `HF_EMBED_SERVER_URL` nor `SPECKIT_IPC_SOCKET_DIR` is set. Crucially, `options.dbDir` must no longer participate in AF_UNIX socket fallback construction; retaining `rawDbDir || shortDefault` would not fix launcher calls because both launchers supply `dbDir`. Existing explicit URL, TCP, and socket-directory precedence should remain unchanged. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:469-478] [SOURCE: opencode.json:26-27] [SOURCE: opencode.json:40]

This is safer than fixing individual callers because it makes the exported resolver valid by construction, preserves cross-launcher sharing, covers future callers, and keeps the existing ownership/symlink/mode checks around the chosen socket directory. Implementation should update the cross-launcher resolver test, which currently codifies the database-directory fallback, and add an assertion that the empty-environment default equals the canonical short shared path and remains at most 103 bytes on Darwin. No source change was made in this research iteration. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:487-528] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:171-180]

### F-016: Independent Key Question 1 closing sweep confirms iteration 1's inventory is complete

The fresh exact-symbol sweep found only one `finalizeMemoryFileContent()` definition and two call sites, both inside `processPreparedMemory()`: one after successful chunked indexing and one after the non-chunked transaction. Both are guarded by the single `shouldPersistFinalizedFile` value, which requires `persistQualityLoopContent` and finalized content. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:640-665] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2389-2391] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2591-2601] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2785-2791]

Every production `persistQualityLoopContent` reference is in the same file: the option declaration/default, the guard, the origin-derived assignment in `indexMemoryFile()`, and two explicit `false` assignments in atomic-save indexing. The only reference outside that file is the regression-test description. No additional setter, forwarded option, or direct finalizer caller exists in the codebase search. Therefore iteration 1's production caller inventory is independently confirmed complete: async ingest remains the sole identified live residual bug because its missing scan origin selects `direct`; there is no second missed write-back mechanism. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2217-2249] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2966-2976] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:4022-4043] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts:1620]

## Questions Answered

1. **Key Question 3: answered.** Normal OpenCode/Claude MCP registrations, daemon-backed CLI cold starts, and the stress harness use short paths. The plugin bridge is a real launcher path that can omit both variables, but default-off advisor model supervision and an earlier daemon IPC constraint normally mask the model-specific overflow. The exported fallback remains invalid and should become the canonical shared `/tmp/mk-hf-embed/hf-embed.sock` independently of `dbDir`.
2. **Key Question 1 closing check: confirmed.** The independent finalizer/persistence sweep found no caller omitted by iteration 1. Async ingest is still the only residual production write-back bug in that class.

## Questions Remaining

1. What exact `mcp_timeout` default and retry behavior does the active OpenCode version apply?
2. What holds the SQLite writer lock during the observed long scan stall?
3. Which incremental daemon lease, re-election, and lock-arbitration changes have the best concurrency payoff?

## Sources Consulted

- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/mk-skill-advisor-launcher.cjs`
- `.opencode/bin/spec-memory.cjs`
- `.opencode/bin/skill-advisor.cjs`
- `.opencode/skills/system-spec-kit/mcp-server/spec-memory-cli.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- `.opencode/skills/system-spec-kit/mcp-server/stress-test/substrate/run-substrate-stress-harness.mjs`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts`
- `opencode.json`
- `.claude/mcp.json`

## Assessment

- `newInfoRatio`: 0.76
- Novelty justification: this iteration identified a real environment-filtering launcher path, separated launcher omission from actual model-bind reachability, closed the resolver implementation inventory, selected a caller-independent canonical fallback, and independently re-confirmed the prior write-back inventory.
- Confidence: high for checked-in call sites, environment construction, resolver precedence, and write-back reference completeness; medium-high for runtime reachability wording because host-level environment injection outside the repository can alter which explicit variables the plugin process inherits.

## Reflection

- Worked: separating invocation reachability, feature-gate reachability, and AF_UNIX bind reachability avoided calling a latent conditional failure a normal production failure.
- Worked: exact-symbol sweeps bounded both the model resolver and source finalizer inventories.
- Ruled out: normal MCP registrations, CLI shims, and the substrate harness as overflow paths because each supplies a short explicit target or directory.
- Ruled out: `modelServerRespawnLockPath()` and `modelServerGiveUpPath()` as additional `sun_path` sites; their database fallbacks are regular files for TCP-target bookkeeping.
- Search limitation: an initial repository-wide Grep response exceeded the tool's JSON record limit; the search was repeated against the relevant executable/config roots and exact file types.

## SCOPE VIOLATIONS

None. The proposed resolver and test changes are outside this research iteration's allowed write paths and were not implemented.

## Next Focus

Investigate Key Question 4 by instrumenting the SQLite writer-lock lifecycle conceptually from `memory_index_scan` through transaction acquisition, embedding/backfill work, and lock-holder diagnostics, without repeating the already-closed source-write-back or launcher timing audits.
