# Deep Context Strategy

## Scope

Gather reuse-first codebase context for the **URL slug utility** (`slugify`) in the
`fx-001-review-target` behavior-benchmark fixture. Target feature/area: a single
dependency-free function that converts short human-readable labels into URL-safe
slugs (lowercase, trim, non-alphanumeric-run collapse to single hyphen, no edge
separators, 60-char cap).

Scope path: `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target`

## Seeded Frontier (initial focus)

Frontier source: `glob_grep_fallback` (code graph unavailable this session).

| Rank | Kind | Path | Symbol | Anchor |
|------|------|------|--------|--------|
| 1 | SLICE | `src/slugify.js` | `slugify` | `function slugify(input, maxLen)` @ line 9; `module.exports = slugify` @ line 31 |

No `require`/import statements present — zero dependency nodes expected.

## Executor Pool (by-model-shared-scope)

Every seat sweeps the SAME focus each iteration; cross-executor agreement is the
confidence signal.

| Label | Kind | Model | Prompt Framework |
|-------|------|-------|------------------|
| native-a | native | opus | (none — native seat) |
| native-b | native | opus | (none — native seat) |

## Known Context

None — prior-context lookup returned no indexed results (memory MCP unavailable this session).

## Known Context Summary

None.

## Loop Parameters

- Max iterations: **1** (single parallel sweep; terminal cap → `maxIterationsReached`)
- Convergence threshold: **0.10** (per-iteration new-agreement-eligible-findings floor)
- Relevance gate: **0.55** (drop findings below this; keep `[0.40, 0.55)` as marginal)
- Agreement min: **2** distinct executors for a finding to be agreement-eligible

## Next Focus

Sweep the seeded frontier slice (`src/slugify.js :: slugify`) with both native seats.
