# Research: OpenCode version resolver families and the dispatch rule engine

## 1. Question

How does the cli-dispatch OpenCode version resolver (`.skilled/hooks/cli-dispatch/lib/opencode-version.mjs`) classify a binary's reported major version into a family, and what does the dispatch rule engine do with each family?

## 2. Answer

The resolver runs `<binary> --version` and parses the first `major.minor.patch` token. Major 1 resolves to `unsupported`, major 2 to `v2`, and every other major, plus any output it cannot parse, to `unknown`. Only `v2` is in `SUPPORTED_FAMILIES`. The rule engine (`dispatch-rule-checks.mjs`) uses the family as a rule filter. On `v2` it runs only the rules whose `appliesTo` includes `v2`. On `unsupported` or `unknown` it runs every rule, and it downgrades to `warn` any rule that does not cover every supported family. The engine never rewrites the command. It changes only severity and message, and the adapters turn a blocking severity into a refusal.

## 3. Scope

One iteration through the cli-opencode executor (OpenCode 2.3.2, `llmgateway/deepseek-v4.1-flash-1017`, effort `max`). The run was read-only research: no code changed.

## 4. Method

Iteration 1 read the resolver end to end, then the rule engine's evaluate core, the `cli-opencode` hard-rules sidecar, the rule-engine tests and the four preflight adapters. See `iterations/iteration-001.md`.

## 5. Findings

1. **Probe.** The resolver spawns `<path> --version` with a 3000 ms timeout and joins stdout and stderr before parsing. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:22] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:61]
2. **Parse.** It tests each token and each adjacent token pair against `VERSION_PATTERN`. The first match wins, and `Number(match[1])` is the major. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:23] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:196]
3. **Family map.** Major 1 maps to `unsupported` and major 2 to `v2`. Any other major, and any unparseable output, maps to `unknown`. `SUPPORTED_FAMILIES` is `['v2']`. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:200] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:21]
4. **Where the engine consumes the family.** `evaluate` takes an explicit `options.version`. Without one, it auto-resolves through `resolveOpencodeVersionSync` when the command has an `opencode … run` shape and at least one rule declares `appliesTo`. A rule without `appliesTo` is treated as covering `SUPPORTED_FAMILIES`. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1107] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1116]
5. **What each family does.**
   - `v2` skips the rules that do not name `v2`.
   - `unsupported` and `unknown` count as unresolved: every rule runs, and a rule that does not cover all supported families drops to `warn`.
   - All four `cli-opencode` rules declare `appliesTo: ["v2"]`, so they cover every supported family. On a v1 binary they keep their declared severity, which means the two `error` rules still block. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1120] [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1135] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:7]
6. **No command rewrite.** Violations come back as `{id, severity, message, check, passed:false}`, and the adapters map a block to a deny. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1139] [SOURCE: .skilled/hooks/cli-dispatch/claude/dispatch-preflight-lint.mjs:62]
7. **Cache.** The resolver keeps an in-process `Map` keyed by `[realpath, size, mtimeMs]`. `clearOpencodeVersionCache()` empties it. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:25] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:102]
8. **Overrides.** A bare name resolves through `PATH`, and an `$OPENCODE_BIN` or `${OPENCODE_BIN}` token is substituted. A path-qualified binary is probed only when it matches a trusted executable. Any other binary resolves to `unknown`. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:120] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:139]
9. **Errors.** Every resolver error degrades to `unknown`. In the async path, a probe failure or empty output is not cached. A probe that succeeds but parses to `unknown` is cached. The sync path wraps everything in try/catch. [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:281] [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:287]

## 6. Questions Answered

- Q1 (probe and parse): findings 1 and 2.
- Q2 (family map): finding 3.
- Q3 (engine per family): findings 4, 5 and 6.
- Q4 (cache, overrides, errors): findings 7, 8 and 9.

## 7. Uncertainty

- Only one source lens. Graph convergence reported `sourceDiversity` as a blocker. The orchestrator spot-checked two of the cited lines (`opencode-version.mjs:200-202` and `dispatch-rule-checks.mjs:1116-1136`), and both match the findings.
- A future major (3.x) resolves to `unknown`, not `unsupported`. That changes which rules run, so it matters if OpenCode ships a 3.x.

## 8. Eliminated Alternatives

- The idea that every `cli-opencode` rule drops to `warn` on a v1 binary. This is wrong: `appliesToAll` is computed against `['v2']`, so `appliesTo: ['v2']` counts as covering every supported family and keeps its declared severity.

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none (default convergence mode).
- Pivot failures and overrides: none.
- Remaining frontier: whether `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, the deep-loop's own resolver, draws the same family boundaries.

## 9. Open Questions

- Do `opencode-version.cjs` (deep-loop) and `opencode-version.mjs` (cli-dispatch) classify the same binary into the same family?

## 10. References

- `research/iterations/iteration-001.md`
- `research/resource-map.md`
- `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs`
- `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs`
- `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 1
- Questions answered: 4 / 4
- Remaining questions: 0
- Last 3 iteration summaries: run 1: opencode-version.mjs family resolution and dispatch-rule-checks.mjs consumption (1.0)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Graph decision at stop: STOP_BLOCKED (sourceDiversity); the max-iterations cap overrides it
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
