# Deep Review Strategy — Relation-Inference Backfill Subsystem (021 + 023)

## Review Charter
Mandatory post-implementation deep-review of the substantive ship: the relation-inference backfill that mutates the production causal graph. Target is READ-ONLY; reviewers write findings only.

## Scope Files
- `lib/causal/relation-backfill.ts` — 4 collectors (spec-chain, lineage, similarity, supersession), dry-run/transaction/summary
- `lib/causal/relation-coverage.ts` — honest stat + backfillJob hint
- `handlers/causal-graph.ts` — `memory_causal_stats({ backfill })` entry point
- `schemas/tool-input-schemas.ts` — backfill option schema (strict)
- `tools/types.ts` — dispatch type
- `tests/relation-backfill-similarity.vitest.ts`, `tests/relation-backfill-unit.vitest.ts`

## Dimensions (risk-ordered)
1. **correctness** — inference accuracy, edge direction, dedup direction-safety, dryRun semantics, guard inheritance, idempotency, byRelation accounting
2. **security** — SQL parameterization in the new scans, input validation (strict schema), DoS/unbounded-scan, data-integrity (false edges corrupting traversal/scoring), scope/privilege
3. **traceability** — spec↔code alignment (ADR-001..003 vs implementation), checklist evidence, honest-stat claim vs actual behavior, the live dry-run (421 candidates: 218 caused / 200 contradicts / 3 supports) matches design intent
4. **maintainability** — clarity, naming, comment hygiene, test quality/coverage, extension-point cleanliness, tech debt

## Known Context (prior verification already performed — do NOT re-derive, find what it MISSED)
- Inline 3-lens adversarial verify on 023 (correctness / db-safety-determinism / scope-tests-hygiene) → all approve, P2-only, remediated (tie-break, README, 3 added tests).
- Combined suite green: tsc clean, 269 causal/dispatch/layer tests, 11 similarity tests.
- Deployed live; dry-run smoke-tested via daemon IPC.
- FOCUS the review on dimensions/angles the inline verify did NOT cover deeply: **security** (SQL injection in dynamic scans, DoS), **traceability** (spec/ADR↔code drift), **maintainability** (long-term), and any correctness edge the 3 lenses missed (e.g. supersession edge DIRECTION correctness, contradicts traversal-scoring impact of injecting 200 auto-edges).

## Convergence
maxIterations 7, threshold 0.10. P0 blocks convergence. Adversarial verify on all P0/P1.
