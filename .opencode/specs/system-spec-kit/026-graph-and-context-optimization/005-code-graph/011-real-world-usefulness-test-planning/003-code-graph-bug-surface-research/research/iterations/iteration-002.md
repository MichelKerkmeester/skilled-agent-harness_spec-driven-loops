# Iteration 2 — Issue A: Default Scope Policy + SPECKIT_CODE_GRAPH_INDEX_SKILLS Verification

## METADATA
- Iteration: 2 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 1 — Issue A: default scope policy + `SPECKIT_CODE_GRAPH_INDEX_SKILLS` verification

## INVESTIGATION
Read the research charter, native-rerun synthesis, trial log, and `research/iterations/iteration-001.md`. Initial read of `iteration-001.md` returned missing; a later directory read showed it had been created concurrently, so this artifact was reconciled against it before finalization.

Iteration 1 already established the main Issue A P0: default scope excludes `.opencode/skills/**` and the other internal `.opencode` folders. It also found env-value validation and nonexistent granular skill selection gaps. This iteration avoids re-counting those prior findings and narrows to the requested verification question: whether `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` at MCP startup expands both scan and query defaults, plus adjacent runtime config/docs gaps.

Traced the scope policy from `code_graph/lib/index-scope-policy.ts` into explicit scans, default indexer config, path filtering, query readiness, and readiness-block projection:

- `resolveIndexScopePolicy()` parses `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` as `includedSkillsList: "all"`, marks `source: "env"`, clears skill excludes, and creates a scope fingerprint.
- `code_graph_scan` passes scan args into `resolveIndexScopePolicy()`. If `includeSkills` is omitted and the MCP server process has `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, scan scope expands to all skills.
- `code_graph_query` does not accept scope arguments, but it calls `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })`. `ensure-ready` resolves the active scope from `process.env` during `detectState()`, so query readiness also observes the env-expanded default scope.
- The readiness contract only projects freshness to readiness/trust fields; it does not alter scope. Scope mismatch decisions happen in `ensure-ready`.

Answer to the verification question: yes, when `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` is present in the MCP server process environment at startup, the default scope expands for both scan and query-readiness paths. Caveat: an explicit per-call scan override such as `includeSkills:false` is stored as `source:"scan-argument"` and is intentionally trusted by the read path instead of being re-expanded from env.

## FINDINGS
- P1 `.codex/config.toml:13` — the cli-codex MCP startup env does not set any `SPECKIT_CODE_GRAPH_INDEX_*` flags, while `opencode.json` does; remediation: add the same maintainer-scope env flags under `[mcp_servers.spec_kit_memory.env]` for Codex or document that cli-codex must launch with an external `.env`.
- P2 `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:261` — the env reference describes `SPECKIT_CODE_GRAPH_INDEX_SKILLS` as a scan opt-in and cites scan files, but the query/readiness path also consumes the env through `ensure-ready`; remediation: update the docs/source column to include `code_graph/lib/ensure-ready.ts` and state that config changes require MCP server restart.

## EVIDENCE
Native rerun baseline:

- `../002-native-deferred-trial-rerun/trials/trial-log.jsonl` recorded `N-CG-001` as a successful `includeSkills:true` scan with `filesIndexed:9280`, `totalNodes:56843`, and `totalEdges:36347`.
- The same log recorded `N-CG-005` as a default-scope scan with `totalNodes:0`, `previousTotalNodes:56843`, and notes that the default-scope scan wiped the populated index.
- `../002-native-deferred-trial-rerun/synthesis-report-native-rerun.md` classifies the default-scope exclusion as P0 and says the default excludes the system code users work on.
- `research/iterations/iteration-001.md` already records the default `.opencode` exclusion as a P0 at `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14`, so this iteration treats that as prior context rather than a new finding.

Scope policy:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:75` parses unset/false skills env as `none`; line 80 parses `true` as `all`; line 98 reads `env[CODE_GRAPH_INDEX_SKILLS_ENV]`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:140` derives `includeSkills` from `includedSkillsList !== "none"`; line 145 only emits skill exclude globs when the list is `none`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:170` marks policy source as `env` when any env-derived include is enabled.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:149` documents the default `.opencode` exclusions; lines 159-164 append policy-driven excludes.
- `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts:72` applies the code-graph policy; lines 80-85 include all skills when `includedSkillsList === "all"` and reject skills when it is `none`.

Scan path:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:256` calls `resolveIndexScopePolicy()` with per-call args; line 263 passes the resolved policy into `getDefaultConfig()`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:342` persists the scope policy after scan, and line 426 builds the readiness block from the scan outcome.

Query/readiness path:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` calls `ensureCodeGraphReady()` before any query operation, with inline full scan disabled at line 1091.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293` resolves active scope from `process.env`; lines 302-310 compare active scope against stored scope and request a full scan on env/stored drift.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:537` intentionally honors the last explicit scan's stored scope; lines 542-552 parse the stored scope and use it for inline indexing.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:241` only wraps freshness into `canonicalReadiness` and `trustState`; it does not change scope.

Config evidence:

- `opencode.json:34` documents maintainer mode; lines 35-39 set all five `SPECKIT_CODE_GRAPH_INDEX_*` flags to `"true"`.
- `.codex/config.toml:13` starts the Codex `spec_kit_memory` env block; lines 14-24 set embeddings/session/causal flags but no `SPECKIT_CODE_GRAPH_INDEX_*` values.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:261` documents `SPECKIT_CODE_GRAPH_INDEX_SKILLS` defaulting to `false`, with only `index-scope-policy.ts` and `scan.ts` cited as sources.

Recommended `.env` / MCP startup snippet:

```env
SPECKIT_CODE_GRAPH_INDEX_SKILLS=true
SPECKIT_CODE_GRAPH_INDEX_AGENTS=true
SPECKIT_CODE_GRAPH_INDEX_COMMANDS=true
SPECKIT_CODE_GRAPH_INDEX_SPECS=true
SPECKIT_CODE_GRAPH_INDEX_PLUGINS=true
```

Recommended `opencode.json` shape:

```json
{
  "mcp": {
    "spec_kit_memory": {
      "environment": {
        "SPECKIT_CODE_GRAPH_INDEX_SKILLS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_AGENTS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_COMMANDS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_SPECS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_PLUGINS": "true"
      }
    }
  }
}
```

Recommended Codex MCP config shape:

```toml
[mcp_servers.spec_kit_memory.env]
SPECKIT_CODE_GRAPH_INDEX_SKILLS = "true"
SPECKIT_CODE_GRAPH_INDEX_AGENTS = "true"
SPECKIT_CODE_GRAPH_INDEX_COMMANDS = "true"
SPECKIT_CODE_GRAPH_INDEX_SPECS = "true"
SPECKIT_CODE_GRAPH_INDEX_PLUGINS = "true"
```

## NEW INSIGHTS
- The env flag does cover query-readiness, not only explicit scans. The query handler delegates to `ensure-ready`, and `ensure-ready` resolves the active scope from `process.env`.
- `readiness-contract.ts` is not part of scope selection. It is only the freshness-to-readiness/trust-state projection layer.
- `opencode.json` already encodes maintainer mode, but `.codex/config.toml` does not. That explains why a cli-codex executor can still reproduce default-scope behavior even when OpenCode sessions are configured correctly.
- Explicit per-call scan scope is deliberately sticky. If a scan was performed with `includeSkills:false`, query readiness trusts that stored scan scope rather than silently broadening to the env default.

## OPEN QUESTIONS
- Should maintainer mode be inferred automatically when the workspace root is this framework repository, or should all runtime configs be required to set `SPECKIT_CODE_GRAPH_INDEX_*` explicitly?
- Should startup hooks warn when `cwd` is the framework repo and `SPECKIT_CODE_GRAPH_INDEX_SKILLS` is not true?
- Should `code_graph_status` display the active startup scope flags so users can diagnose env/config drift without reading runtime config files?
