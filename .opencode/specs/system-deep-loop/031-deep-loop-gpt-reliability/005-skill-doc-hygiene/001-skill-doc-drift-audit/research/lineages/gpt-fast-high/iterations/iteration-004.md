# Iteration 4: Orchestrate Routing Claims After Phase 009

## Focus

Compare docs about command-owned deep loop routing with phase 009's registry-backed orchestrate rows.

## Findings

1. Current `orchestrate.md` has explicit priority rows for `/deep:context` -> `@deep-context` and `/deep:review` -> `@deep-review`, and a registry-backed `Deep Route:` rule. [SOURCE: .opencode/agents/orchestrate.md:71-79] [SOURCE: .opencode/agents/orchestrate.md:187-209]
2. Phase 009 says this was intentional: `@deep-context` and `@deep-review` were the missing two deep-mode rows, and both were manually traced through the completed table. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing/implementation-summary.md:50-57] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing/implementation-summary.md:99-101]
3. `cli-opencode/SKILL.md` still says command-owned loop executors including `deep-review` are dispatched only by parent commands and must never route through `orchestrate`. That is stale at least for `deep-review`, because the current orchestrator explicitly routes `/deep:review` requests to `@deep-review` as a leaf under the registry-backed contract. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:292] [SOURCE: .opencode/agents/orchestrate.md:79]

## Sources Consulted

- `.opencode/agents/orchestrate.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/cli-opencode/SKILL.md`
- `009-orchestrate-universal-routing/implementation-summary.md`

## Assessment

- newInfoRatio: 0.65
- Novelty: narrowed a broad routing claim to a concrete stale subclaim for `deep-review`.
- Confidence: medium-high. The wording may intend to forbid raw external `opencode run --agent deep-review`, but it also says never route through orchestrate, which conflicts with phase 009/current orchestrate.

## Reflection

- Worked: reading current `orchestrate.md` avoided inferring from phase docs only.
- Failed: the dispatch boundary between parent command and orchestrator is subtle; fixes should preserve the valid direct-`--agent` prohibition while removing the false "never orchestrate" claim.
- Ruled out: no stale claim was found that `@deep` itself should be Task-dispatched; current orchestrate explicitly forbids it. [SOURCE: .opencode/agents/orchestrate.md:128]

## Recommended Next Focus

Check plugin docs for `deep-route-guard` rename fallout and omitted `mk-deep-loop-guard` coverage.
