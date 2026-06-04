# Deep Research Strategy

## Research Topic

Root-cause synthesis for the system-spec-kit / 026 comprehensive deep-review audit, focused on five unresolved questions: doc/schema-to-code drift, metadata drift systemic-ness, memory-correctness impact, P0 security severity calibration, and deep-loop fan-out blast radius.

## Known Context

The parent audit packet reports roughly 50 findings across fan-out review slices, including P0 security claims, P1 correctness and metadata findings, and deep-loop orchestration risks. The child research charter asks for synthesis, not remediation, and explicitly excludes modifying reviewed implementation files.

## Non-Goals

- Do not patch system-spec-kit code or packet metadata.
- Do not run the fan-out reducer or artifact-root resolver.
- Do not write outside this lineage artifact directory.
- Do not repeat every review finding; group findings by root cause and operational impact.

## Key Questions

1. What common root cause explains doc/schema-to-code drift?
2. Is metadata drift systemic or isolated?
3. What is the real impact of memory-correctness findings?
4. How should P0 security findings be calibrated under the local single-user MCP threat model?
5. What is the blast radius of deep-loop fan-out and lineage failure handling defects?

## Answered Questions

- Q1 answered in iteration 001.
- Q2 answered in iteration 002.
- Q3 answered in iteration 003.
- Q4 answered in iteration 004.
- Q5 answered in iteration 005.

## What Worked

Direct source reads worked better than relying on review summaries. The clearest pattern came from comparing public tool schemas, runtime Zod schemas, handlers, and downstream helpers for the same operation.

## What Failed

The broad `rg` fan-out search produced too much output for direct synthesis. Targeted reads of `fanout-run.cjs`, `fanout-pool.cjs`, memory handlers, and selected review reports produced the usable evidence.

## Exhausted Approaches

- Treating the P0 labels as uniform across deployment models. The code evidence shows real bypasses, but severity depends on whether governance scopes are real trust boundaries.
- Treating fan-out as serial. Current runtime code uses a capped pool for CLI lineages; the active defect is failure accounting.

## Ruled-Out Directions

- A single one-off documentation typo as the root cause. Drift appears in docs, public schemas, runtime schemas, generated metadata, changelog rollups, and async processors.
- Durable DB corruption from the entity-density cache issue. The cache can misroute graph-channel decisions before TTL refresh, but it does not itself corrupt stored data.

## Next Focus

Remediation should start with contract tests and one generated source of truth for tool inputs and metadata freshness, then fix the high-impact runtime defects: governed fallback filtering, causal-edge scope checks, fan-out exit-code accounting, and atomic save rollback semantics.

## Stop Conditions

Stop when all five key questions have evidence-backed answers, at least one source-backed root cause is recorded per question, and the final synthesis distinguishes current verified behavior from stale or uncertain review claims.
