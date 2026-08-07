# Context Report: deep-loop-runtime README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file evidence on the component families, the consumers and the entry points.

---

## 1. PURPOSE

`deep-loop-runtime` is the shared library and runtime behind the deep loops. It provides executor dispatch, prompt-pack rendering, output validation, atomic state, single-writer locking, JSONL repair, a coverage-graph store, Bayesian convergence scoring, fallback routing and council durability primitives, consumed by `deep-research`, `deep-review`, `deep-context`, `deep-ai-council` and `deep-improvement` through TypeScript imports and direct `.cjs` script calls.

## 2. PROBLEM

Before this runtime existed, the deep-loop infrastructure lived inside `system-spec-kit/mcp_server/` and was reached through MCP tools. Two consumer skills depended on the internals of a third package, every workflow call paid the MCP marshalling and JSON-parse cost, and each loop would otherwise duplicate executor config, atomic-state writes, JSONL repair, single-writer locking, coverage-graph ownership, Bayesian scoring and fallback routing. The consolidation moved all of it into one peer skill and replaced the MCP tools with direct script calls, so every loop shares one hardened implementation.

## 3. COMPONENT FAMILIES

- `lib/deep-loop/`: executor-config and executor-audit (dispatch and provenance), prompt-pack (iteration prompt rendering), post-dispatch-validate (markdown, JSONL and delta checks), atomic-state (tmpfile-plus-rename writes), jsonl-repair (corrupt-tail recovery), loop-lock (single-writer lockfile), permissions-gate, bayesian-scorer (convergence score with Laplace smoothing) and fallback-router.
- `lib/coverage-graph/`: the coverage-graph DB, queries and signals that back the context and review stop paths.
- `lib/council/`: multi-seat dispatch, round-state JSONL, adjudicator-verdict scoring, cost guards, session-state hierarchy, the council graph and convergence for the AI council.
- `scripts/`: the fan-out pool, run and merge entry points plus the shared CLI guards.

## 4. CONSUMERS AND ENTRY POINTS

Consumers: `deep-research`, `deep-review`, `deep-context`, `deep-ai-council` and `deep-improvement`. They import the `lib/` modules and call the `.cjs` entry points directly (for example `convergence.cjs`, `upsert.cjs`, the fan-out scripts and `multi-seat-dispatch.cjs`). The runtime is not a user-facing command; it is the foundation the loop skills and their commands run on.

## 5. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, the component map and the consumer contract |
| `references/` | Component and integration documentation |
| `lib/deep-loop/` | Executor, prompt-pack, validation, atomic-state, locking, scoring and fallback modules |
| `lib/coverage-graph/` | Coverage-graph DB, queries and signals |
| `lib/council/` | Multi-seat dispatch, round state, adjudication, cost guards and the council graph |
| `scripts/` | Fan-out pool, run and merge entry points |

## 6. BOUNDARIES

It is the shared foundation, not a loop you invoke directly. The user-facing surfaces are the consumer skills and their commands; this runtime is what they ride. It does not own spec folders, memory or continuity (`system-spec-kit` does), and it does not define the per-loop convergence policy (each consumer sets that on top of the shared scorer and coverage graph).

## 7. TROUBLESHOOTING & FAQ MATERIAL

- A loop's state log is corrupt: jsonl-repair recovers a trailing corrupt line before read; mid-line corruption needs manual inspection.
- Two writers raced the state log: the loop-lock single-writer lockfile prevents it.
- FAQ: why a shared runtime exists rather than per-loop duplication; which skills consume it; how a consumer calls the scripts; what the coverage graph and Bayesian scorer provide.

## 8. STALE FACTS (must fix on rewrite)

1. The current README cites "27 vitest files"; the suite actually has more (around 36). The rewrite avoids a brittle test count.
2. The current README says "four direct-invocation script entry points"; there are more (around eight `.cjs` entry points). The rewrite describes the entry points without a hard count. The new template carries no version line.

## 9. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, components and consumers; iteration 2 verified the component owning-files, the entry points and stale facts, each cited to a file. Converged before the 3-iteration ceiling.
