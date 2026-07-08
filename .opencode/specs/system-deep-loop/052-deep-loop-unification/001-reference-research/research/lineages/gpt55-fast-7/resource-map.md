# Resource Map: gpt55-fast-7 Deep Research Lineage

## Summary

This map records files and commands that directly supported convergence for the `gpt55-fast-7` detached research lineage.

## Specs

| Path | Role | Evidence |
|---|---|---|
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md` | Parent scope and out-of-scope behavior constraints | Lines 73-84, 128-145 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md` | Fanout invocation and manual fallback workaround | Lines 71-93, 101-112 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md` | Target layout and path-repair rule | Lines 154-175 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md` | Concrete Class A/B and tooling-borrow tables | Lines 68-99 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md` | External reference and advisor-corpus scope | Lines 57-80 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md` | Dependency-ordered migration stages | Lines 71-106 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md` | Optional fallback behavior scope | Lines 58-75 |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md` | Proposed fallback call site | Lines 43-57 |

## Runtime Code

| Path | Role | Evidence |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs` | Forward coupling sample | Line 11 |
| `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs` | Command contract path manifest and workspace anchor | Lines 15-27, 44-75 |
| `.opencode/skills/deep-loop-runtime/scripts/check-contract-drift.cjs` | Shared authority source list | Lines 38-43 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Detached lineage prompt builder and cli-opencode command builder | Lines 938-1018, 1299-1375 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Same-model retry and retry-exhaustion behavior | Lines 628-653 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Pure fallback route implementation | Lines 299-431 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Executor/fanout schemas and flag support | Lines 34-54, 258-282 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs` | system-spec-kit shared resolver seam | Line 18 |

## Workflow Code

| Path | Role | Evidence |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reverse coupling sample | Lines 14-20 |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs` | Reverse council runtime imports | Lines 14-18 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs` | Mixed runtime and system-spec-kit dynamic path seam | Lines 118-125 |

## Config And Tests

| Path | Role | Evidence |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/package.json` | Runtime typecheck borrow | Line 11 |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Runtime typeRoots borrow | Lines 12-14 |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Council test references to runtime integration tests | Line 31 |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Vitest include glob for runtime tests | Lines 18-21 |

## Commands And Generated Contracts

| Path | Role | Evidence |
|---|---|---|
| `.opencode/commands/deep/research.md` | Runtime renderer front door | Line 9 |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Live workflow contract and override behavior | Lines 128-145, 1286-1355 |
| `.opencode/commands/doctor/_routes.yaml` | External doctor route references | Lines 108-110 |

## Advisor And Plugin

| Path | Role | Evidence |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python merged identity and registry path | Lines 83, 2579 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | TypeScript merged identity | Lines 95-109 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Phrase boosts to old identity | Lines 105-128 |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl` | Advisor corpus label-field examples | Lines 24-50 |
| `.opencode/plugins/mk-deep-loop-guard.js` | Registry path and fail-open behavior | Lines 35, 75-86, 353-355 |

## Commands Run

| Command | Result |
|---|---|
| `rg -n "deep-loop-workflows\|deep-loop-runtime" ... \| wc -l` | 764 external old-name matches in scoped non-spec/non-dist surfaces |
| `rg -l "deep-loop-workflows\|deep-loop-runtime" ... \| wc -l` | 77 external files in scoped non-spec/non-dist surfaces |
| `rg -n "resolveFallback\|createFallbackRouter\|validateFallbackGraph" .opencode/skills/deep-loop-runtime ...` | 23 total fallback-router symbol hits, all implementation/tests/provenance checks; no fanout-pool caller |
