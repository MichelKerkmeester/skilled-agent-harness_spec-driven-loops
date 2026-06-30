# Iteration 38: S5-08 Advisor Runtime Mode Projection

## Focus

[S5-08] Should `advisor_recommend` resolve deep-loop modes through a generated artifact derived from `mode-registry.json`, and what is the runtime-coupling cost? This builds on S4-08, which already established that the drift guard should become generator-backed. This pass narrows the answer to the live recommendation surface: generated projection yes; live per-call registry reads no.

## Actions Taken

- Loaded the deep-loop hub and deep-research iteration contract, then followed the leaf-agent delta-file path instead of appending to the shared state log.
- Reviewed prior S4-08 output to avoid duplicating the generator/drift-guard findings.
- Inspected OUR registry, TypeScript alias layer, Python deep routing layer, MCP `advisor_recommend` handler, and public response schema.
- Mined loop-cli-main for centralized derived constants, typed catalogs, and typed IPC discriminators.
- Mined kasper for the cost model of runtime configuration coupling: forced reload, equality check, and downstream scorer/state refresh.

## Findings

1. **Rank 1 - Use a generated projection artifact on the advisor hot path, not live `mode-registry.json` reads.**

   Reference mechanism: loop-cli centralizes source data and imports derived static surfaces. `PROJECT_COLORS` is the source object [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/config/constants.ts:29`], `PROJECT_COLOR_KEYS` is derived from it [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/config/constants.ts:38`], and the i18n layer derives `I18nKey` from the imported catalog [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/i18n/index.ts:1`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/i18n/index.ts:3`]. The architecture explicitly names config constants and i18n as central surfaces [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:213`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:216`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`. It currently hand-codes the deep alias groups [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13`] and `DEEP_MODE_BY_CANONICAL` [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96`], while `mode-registry.json` already states the advisor should avoid cross-skill runtime registry reads [TARGET: `.opencode/skills/deep-loop-workflows/mode-registry.json:4`].

   Backlog item: generate a small checked-in projection module or JSON artifact from `mode-registry.json`, then import that artifact from `aliases.ts`. Keep the generator/test as the only code that reads the registry. The generated artifact should include `workflowMode`, `legacyAdvisorId`, alias groups, routing class, source hash, and schema version.

   Why it helps: it preserves the current hot-path decoupling while removing the duplicated hand-maintained mode projection. Port-difficulty: med. Tag: quick-win.

2. **Rank 2 - Publish the resolved deep-loop `mode` in the MCP `advisor_recommend` response.**

   Reference mechanism: loop-cli keeps the transport contract typed and discriminated. `IpcRequest` enumerates request `type` variants [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:90`], `IpcResponse` enumerates response `type` variants [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:116`], and the client parses socket lines into that typed response contract before acting [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/client/ipc.ts:27`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts`. The public recommendation schema exposes `skillId`, score, confidence, uncertainty, lanes, docs, redirects, and lifecycle status, but no `mode` field [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:208`]. The Python advisor path already computes and attaches `{skill: "deep-loop-workflows", mode: <workflowMode>}` [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2518`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2532`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2590`], but the TypeScript MCP handler drops that shape when building public recommendations [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:247`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:260`].

   Backlog item: add an optional `mode` or `workflowMode` field to `AdvisorRecommendationSchema`, populated only when `skillId === "deep-loop-workflows"` and the generated projection resolves the winning legacy mode or alias. Keep the skill identity merged; publish the discriminator beside it.

   Why it helps: callers can load the hub plus the correct packet without re-deriving intent from prose. Port-difficulty: med. Tag: quick-win.

3. **Rank 3 - Include generated projection freshness in advisor cache/source signatures.**

   Reference mechanism: kasper treats runtime configuration as a live dependency and reloads downstream state only when it changes. The plugin has a guarded reload interval [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:373`], forces a fresh config load [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:378`], compares the fresh config with the active config [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:379`], then refreshes state and scorer model only on change [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:382`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:384`]. The config loader merges layered sources and caches unless forced [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:151`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:191`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts`. The cache signature currently uses freshness, generation, and last generation bump [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:51`], and the prompt cache key is built from that signature plus prompt/options [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:357`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:386`].

   Backlog item: add the generated projection artifact hash or schema version to the advisor source signature, or ensure advisor rebuild generation bumps whenever the generated projection changes. If the artifact is imported at process start only, status should surface stale/needs-restart when the on-disk generated hash differs from the loaded hash.

   Why it helps: generated routing changes cannot be hidden behind a hot prompt-cache hit or a long-lived daemon process. Port-difficulty: med. Tag: quick-win.

4. **Rank 4 - Keep `--dump-routing-maps` as a parity/debug surface, but make it dump generated projection metadata.**

   Reference mechanism: kasper emits operational events as structured JSONL records, with event name plus arbitrary fields [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:27`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:33`]. It also logs `config_reloaded` with the changed routing-relevant fields after a successful reload [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:386`].

   Exact OUR target file: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`. The CLI already has `--deep-skill-routing-json` for mode routing [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3762`] and `--dump-routing-maps` for drift-guard consumption [TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3764`; TARGET: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3815`].

   Backlog item: keep `--dump-routing-maps`, but have it report generated projection metadata: source registry hash, generated schema version, generated-at timestamp, lexical keys, alias-fold keys, and whether the loaded artifact is fresh. The drift guard can then compare artifacts without executing live scoring code.

   Why it helps: it makes the generator/debug contract observable without adding runtime reads of `mode-registry.json` to normal recommendations. Port-difficulty: easy. Tag: quick-win.

## Questions Answered

- S5-08: yes, `advisor_recommend` should resolve deep-loop modes through a generated projection derived from `mode-registry.json`.
- The generated artifact should be a runtime input to the advisor scorer/response builder, but `advisor_recommend` should not parse `mode-registry.json` on each call.
- The runtime-coupling cost is mostly cache/freshness and daemon lifecycle: projection changes must invalidate prompt-cache signatures or bump advisor generation, and long-lived advisor processes need a stale-artifact signal.
- The public MCP response currently loses the mode discriminator that the Python advisor path already computes.

## Questions Remaining

- Decide artifact shape: TypeScript module plus Python module, shared JSON loaded by both, or generated TS with a Python dump generated from the same source.
- Decide whether the public field should be named `mode`, `workflowMode`, or `deepLoopMode`. `workflowMode` is less ambiguous and matches the registry.
- Decide whether generated projection freshness belongs in advisor status, prompt-cache source signature, or both.

## Next Focus

[S5-09] Could `skill_graph_propagate_enhances` surface deep-loop-runtime as an explicit enhancer edge for the consumer loops so the advisor co-surfaces the shared runtime?
