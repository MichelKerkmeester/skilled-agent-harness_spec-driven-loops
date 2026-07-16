# Skill-Advisor CLI Feasibility Research - gpt Lineage

## 1. Executive Verdict

Go for a dual-stack `mk_skill_advisor` CLI, but do not remove or weaken the MCP server. The viable architecture is a generated Node CLI over the existing handler/compat stack, with launcher/IPC auto-spawn for warm daemon access and a reconciled Python legacy facade for `advisor_recommend`.

The current `skill_advisor.py` is valuable prior art, not the finished CLI. It provides recommendation fallback, health, validation, deep-routing, batch modes, and a native bridge, but it does not cover `advisor_rebuild`, `skill_graph_scan`, `skill_graph_query`, or `skill_graph_propagate_enhances` as first-class commands [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3479].

## 2. Method

This lineage ran 10 forced KQ-focused iterations. Evidence came from TypeScript registry/handler files, Python fallback scripts, launcher lifecycle code, runtime hooks/configs, and read-only timing measurements.

## 3. 9-Tool Parity Matrix

| MCP Tool | Current Handler | State Class | Current Python CLI Coverage | Required CLI Mapping | Daemon/IPC Need |
|---|---|---:|---|---|---|
| `advisor_recommend` | `handleAdvisorRecommend` via direct dispatch [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:57] | Read-only | Yes, plus local/native force modes | `skill-advisor recommend` | Prefer warm native/IPC; local fallback allowed |
| `advisor_rebuild` | `rebuildAdvisorIndex` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:59] | Mutates SQLite/generation | No | `skill-advisor rebuild [--force]` | Needs single-writer/lease discipline |
| `advisor_status` | `readAdvisorStatus` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:97] | Read-only diagnostic | Partial via `--health` | `skill-advisor status` | Can direct-read; daemon evidence improves trust |
| `advisor_validate` | `handleAdvisorValidate` registered [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:63] | Heavy read/diagnostic | Partial via `--validate-only` | `skill-advisor validate --confirm-heavy-run` | No daemon required, but uses live files/DB |
| `skill_graph_scan` | `handleSkillGraphScan` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:28] | Mutates SQLite/generation/embeddings | No | `skill-advisor graph scan` | Trusted caller and single-writer needed |
| `skill_graph_query` | `handleSkillGraphQuery` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/query.ts:45] | Read-only | No | `skill-advisor graph query` | Direct DB read acceptable |
| `skill_graph_status` | `handleSkillGraphStatus` registered [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:134] | Read-only | Partial via health internals | `skill-advisor graph status` | Direct DB read acceptable |
| `skill_graph_validate` | `handleSkillGraphValidate` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts:40] | Read-only diagnostic | Partial via `--validate-only` | `skill-advisor graph validate` | Direct DB read acceptable |
| `skill_graph_propagate_enhances` | `handleSkillGraphPropagateEnhances` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:34] | Report/propose read; apply mutates files | No | `skill-advisor graph propagate-enhances` | Trusted caller; apply mode requires explicit gate |

## 4. Daemon Dependency Loss Table

| Resident Capability | Evidence | If CLI Is Per-Call Only | Required Adaptation |
|---|---|---|---|
| FS watcher auto-rebuild | Watcher tracks `SKILL.md`, `graph-metadata.json`, debounce, storm limits, busy retry [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:100] | Lost | Keep daemon for watch mode; CLI can trigger explicit scan/rebuild |
| Prompt cache | Process-local exact cache, 5-minute TTL, 1000-entry cap [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts:10] | Lost between invocations | Hooks must use warm daemon/in-process compat |
| Trust-state daemon evidence | Status checks env PID and process liveness when available [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts:118] | Degraded | CLI status reports artifact freshness plus daemon evidence separately |
| Telemetry/shadow sink | Append/rotate JSONL sink with workspace guard [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts:80] | Possible but less centralized | Keep same sink helpers; preserve prompt-safe writes |
| IPC bridge | Launcher bridges to lease holder instead of starting duplicate daemon [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:235] | Lost if bypassed | CLI auto-spawn must reuse launcher bridge |
| Embedder resolution | Server resolves active embedder at startup [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:268] | Repeated or skipped | Mutating graph commands use daemon or explicit setup path |

## 5. Prior-Art Verdict: Reconcile, Not Supersede

`skill_advisor.py` should coexist as a legacy compatibility facade, but the new 9-tool CLI should be canonical. The Python bridge has real value: `--force-local`, `--force-native`, `--batch-stdin`, `--health`, `--validate-only`, and deep-routing JSON are already operator-useful [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3502].

Measured local/native parity on 10 representative prompts was 10/10 same top recommendation. That supports reconciliation for `advisor_recommend`. It does not satisfy full tool parity.

## 6. Measured Timing

| Path | Samples | Median | Interpretation |
|---|---:|---:|---|
| `skill_advisor.py prompt --force-local` | 5 | 74.9ms | Fine for manual fallback, too expensive for ideal cache-hit hooks |
| `skill_advisor.py prompt --force-native` | 5 | 824.8ms | Not acceptable per prompt-submit event |
| `skill_advisor.py --health` | 5 | 49.8ms | Cheap diagnostic |
| `skill_advisor.py --validate-only` | 5 | 73.8ms | Cheap enough for explicit validation |
| `skill_graph_compiler.py --validate-only` | 5 | 35.1ms | Cheap read-only validation |
| `node -e process.exit(0)` | 5 | 39.6ms | Node process startup alone is non-trivial |
| batch 10 local | 5 | 275.2ms | Startup amortizes well |
| batch 10 native | 5 | 277.5ms | Native scoring is not the bottleneck when batched |

The hook verdict is sharp: warm-only. Prompt-submit hooks must use a warm daemon, in-process compat module, or cached result. One native Python bridge per prompt is the wrong shape.

## 7. Integration Surface Map

| Surface | Evidence | Migration Impact |
|---|---|---|
| OpenCode MCP config | `opencode.json` registers `mk_skill_advisor` with launcher/env [SOURCE: file:opencode.json:47] | Keep unchanged |
| Codex MCP config | `.codex/config.toml` registers launcher [SOURCE: file:.codex/config.toml:104] | Keep unchanged |
| Claude MCP config | `.claude/mcp.json` registers launcher [SOURCE: file:.claude/mcp.json:37] | Keep unchanged |
| Codex hooks | `.codex/hooks.json` and `.codex/settings.json` register `UserPromptSubmit` [SOURCE: file:.codex/hooks.json:27], [SOURCE: file:.codex/settings.json:14] | Hook path must stay warm/fail-open |
| Claude local hooks | `.claude/settings.local.json` registers `UserPromptSubmit` [SOURCE: file:.claude/settings.local.json:31] | Same |
| Runtime hook sources | Claude 246 lines, Gemini 260, Codex 425, Codex wrapper 254, Devin 252 [SOURCE: command:wc -l hook files] | 5 source adapters to preserve |
| OpenCode plugin | Plugin injects on `experimental.chat.system.transform` and exposes status tool [SOURCE: file:.opencode/plugins/mk-skill-advisor.js:710] | Bridge must stay prompt-safe and cached |
| Plugin bridge | Bridge prefers in-process compat, falls back to launcher/MCP subprocess [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:280] | CLI should not regress compat fast path |
| Doctor commands | `doctor_skill-advisor.yaml` 397 lines; `doctor_skill-budget.yaml` 111 lines [SOURCE: command:line-count scan across doctor assets] | Add CLI checks here |

## 8. Coexistence and Race Requirements

The launcher already has several defenses: bootstrap lock, strict single-writer check, bridge handoff, lease write/reprobe, child-exit cleanup, signal forwarding, and `process.on('exit')` cleanup [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:246], [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:635], [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:569].

The orphan incident class points to paths outside normal child-exit cleanup: killed parents, stale lease/no socket, removed worktree, or resident launcher without a caller-owned reap boundary. A CLI auto-spawn path needs owner token, process-group reaping, stale socket probe, idle timeout, and worktree-aware cleanup.

## 9. Design Deltas for Implementation

| Delta | Mechanism | Acceptance |
|---|---|---|
| D1 Generated CLI registry | Generate subcommands from `TOOL_DEFINITIONS`, advisor Zod schemas, and skill graph descriptors | `--help` shows all 9 tools; invalid args match MCP validation |
| D2 Python reconciliation | Keep `skill_advisor.py` for recommend/batch; delegate or document full-parity CLI handoff | 10-prompt local/native parity fixture remains green |
| D3 Trusted graph mutation policy | Require maintainer/trusted context for scan and propagate apply | Untrusted default fails closed |
| D4 Warm hook path | Hooks use daemon IPC/in-process compat/caches, not one-shot native bridge | Existing cache-hit p95 target remains below 60ms test bar [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/codex-user-prompt-submit-hook.vitest.ts:198] |
| D5 Rebuild/scan jobs | Explicit CLI commands with progress and exit codes | Generation before/after reported [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:95] |
| D6 Orphan reaping | Owner token, process group, stale socket, idle timeout | Stale lease/no-socket fixture leaves no extra launcher |
| D7 Config compatibility | MCP registrations remain; CLI is additive | OpenCode/Codex/Claude configs unchanged |
| D8 Exit map | 0/1/64/69/75 inherited from spec-memory | Shell callers can branch on usage/unavailable/temp failure |

## 10. Effort

Medium: 3 implementation packets.

1. CLI registry, parser, schema validation, JSON output, exit map.
2. Handler/IPC integration and Python facade reconciliation with parity tests.
3. Hook/plugin/doctor integration, lifecycle reaping fixtures, and docs.

## 11. Recommendations

Build the CLI. Make it additive, generated, and handler-backed. Keep MCP as the rich transport. Keep Python as a compatibility facade until every Gate-2 caller and hook path has moved to the new contract or explicitly chosen the legacy path.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Bless current `skill_advisor.py` as the final CLI | It lacks full coverage for rebuild and skill graph tools. | [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3479] | 1, 4, 9 |
| Remove MCP after CLI | Scope is dual-stack and registrations remain active. | [SOURCE: file:opencode.json:47] | 10 |
| Per-prompt native bridge in hooks | Median one-shot native path was 824.8ms. | [SOURCE: command:5-sample timing sweep] | 7 |
| Daemonless feature parity | Watcher, cache, IPC bridge, and resident telemetry semantics would be lost. | [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts:100] | 2 |
| Separate hand-written schemas | Existing exported schemas/descriptors are closer to the MCP source of truth. | [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts:377] | 3 |

## 12. Open Questions

- Exact `advisor_rebuild` and `skill_graph_scan` wall time under mutation-capable conditions was not measured because this lane was read-only outside its artifact directory.
- Live orphan process count could not be rechecked because `ps` was blocked by the sandbox.

## 13. Terminal KQ Answers

- KQ1: Full parity requires 9 generated subcommands; current Python covers only part.
- KQ2: Daemon services remain necessary for watch/cache/IPC/lease semantics.
- KQ3: Spec-memory pattern transfers, but schema/trusted-caller/graph deltas are real.
- KQ4: Reconcile Python; do not supersede immediately.
- KQ5: Rebuild/scan are explicit maintenance operations, not hook work.
- KQ6: Migration touches MCP configs, five hook adapters, OpenCode plugin/bridge, and doctor surfaces.
- KQ7: Warm-only hook policy is mandatory.
- KQ8: CLI spawn needs owner/reap guarantees beyond current normal-exit cleanup.
- KQ9: D1-D8 define implementation absorption points.
- KQ10: Go for additive CLI, no-go for MCP removal or Python-only answer.

## 14. References

- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py`
- `.opencode/bin/mk-skill-advisor-launcher.cjs`
- `.opencode/plugins/mk-skill-advisor.js`
- `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`
- Runtime hook/config files cited above
