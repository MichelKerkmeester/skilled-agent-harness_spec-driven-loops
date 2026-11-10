# Deep Research Dashboard - gemini-3-8-flash-code-standards

Auto-generated from JSONL, reducer registry, and strategy. Never manually edited.

## Iteration Table

| Iteration | Status | Focus | Findings | newInfoRatio | Timestamp |
|-----------|--------|-------|----------|--------------|-----------|
| 1 | complete | Iteration 1: runtime/lib and runtime/api audit | 8 | 1.0 | 2026-09-06T09:40:00Z |

## Question Status

- Open: Q2
- Answered: Q1

## Convergence Trend

- Convergence threshold: 3 (telemetry only; stopPolicy max-iterations)
- Ratios: 1.0
- Interpretation: Initial iteration over unopened surfaces produced 8 verified findings across boundary seams, reverse layering, frontmatter duplication, CLI stream discipline, exception swallowing, and API test coverage.

## Dead Ends

- `runtime/lib/discovery/spec-document-finder.ts` handler dependency was confirmed as an authorized seam, not a violation.

## Blocked Stops

(none)

## Graph Convergence

- Graph decision: pending

## Next Focus

Iteration 2: Audit `runtime/hooks` (claude, codex, cursor, devin, lib), `.cjs` and `.mjs` scripts under `runtime/cli` outside retrieval, and `shared/**` beyond frontmatter and path containment.
