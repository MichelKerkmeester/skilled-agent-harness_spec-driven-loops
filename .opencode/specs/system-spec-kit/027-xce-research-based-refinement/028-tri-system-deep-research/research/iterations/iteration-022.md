# Iteration 022 — Angle 22

**Angle:** Semantic trigger fallback in production: shadow-mode telemetry, activation criteria, and what its goldens actually prove.

**Summary:** The code is conservative for returned results: default-off, shadow-only by default, and union only when explicitly env-enabled with weak lexical output. The production gap is evidence: shadow observations are not durable enough for the documented promotion criteria, and the documented union block is not enforced by code.

**Findings kept:** 5

## [P1][BROKEN-FEATURE] Shadow-mode telemetry is not durable enough to support promotion criteria

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:560-570 computes shadow stats and writes them to stderr; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:774-793 only attaches them to the response meta; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:392-402 and 812-814 persist only final trigger result IDs/scores; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval/spec.md:97-98 requires FP, recall, latency, cost, rollback promotion evidence.
- Detail: Production shadow mode currently produces per-call diagnostics, not a durable telemetry stream that can be aggregated into false-positive, recall, latency, cost, and rollback evidence. The eval logger records final lexical result IDs, but not semantic candidate IDs, scores, threshold bands, or cache/cost status.
- Fix sketch: Persist semantic shadow observations keyed by eval query/run id with lexical IDs, semantic IDs/scores, threshold bands, cache status, latency, and cost proxy fields.

## [P1][BROKEN-FEATURE] Union promotion gate is policy text, not enforced by code

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:66 and 91 say union is blocked until evidence passes; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval/implementation-summary.md:117-127 marks union BLOCKED; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:472-541 enables union solely from SPECKIT_SEMANTIC_TRIGGERS=true plus SPECKIT_SEMANTIC_TRIGGERS_MODE=union and weak lexical output.
- Detail: The implementation has no runtime check for promotion evidence before result-affecting union behavior. Any production process started with both env vars can add semantic hits when lexical matching is weak, despite docs saying promotion is blocked pending live evidence.
- Fix sketch: Add a separate promotion/evidence gate for union mode, or change the docs to state that the block is an operator policy rather than a code-enforced safety gate.

## [P2][DOC-DRIFT] Shadow activation criteria differ from the phase docs

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:49 and 89 say the semantic stage runs only when lexical is empty/weak; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:560-567 runs shadow when enabled and not a strong lexical match; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:485-496 applies the weak-lexical check only to union mode.
- Detail: Shadow mode can run for non-exact prompts that already produced enough lexical results, because it does not call isLexicalStageWeak. This is safe for returned results but contradicts the documented activation criteria and can skew production telemetry toward lexically sufficient calls.
- Fix sketch: Either add the same weak-lexical gate to shadow mode or update the docs to distinguish shadow-observation criteria from union-result criteria.

## [P2][DOC-DRIFT] Cold-start telemetry name promised in spec does not exist

- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval/spec.md:134 expects semantic_trigger_skipped_uncached to be logged; .opencode/skills/system-spec-kit/mcp_server/lib/triggers/semantic-trigger-matcher.ts:463-473 returns status no_query_embedding; .opencode/skills/system-spec-kit/mcp_server/tests/trigger-cold-start.vitest.ts:46-65 asserts no_query_embedding, not a named log event; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval/implementation-summary.md:99 admits the current code records no_query_embedding.
- Detail: The production behavior is a response/status diagnostic, not the named telemetry event described in the acceptance criteria. This matters because cold-start rates are part of rollout readiness, but there is no separately queryable skipped-uncached event.
- Fix sketch: Rename the spec acceptance criterion to no_query_embedding, or implement a structured semantic_trigger_skipped_uncached telemetry event.

## [P2][REFINEMENT] Goldens prove matcher machinery, not live 768d production readiness

- Evidence: .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/trigger-goldens.json:3-6 declares SYNTHETIC 48-dimensional vectors; .opencode/skills/system-spec-kit/mcp_server/tests/trigger-goldens.vitest.ts:47-72 computes precision/recall/FP over engineered vectors; .opencode/skills/system-spec-kit/mcp_server/tests/trigger-latency-budget.vitest.ts:7-16 checks 1,920 deterministic work units, not live p95; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/004-tests-goldens-shadow-eval/implementation-summary.md:121-125 blocks live FP, recall, latency, and cost evidence.
- Detail: The goldens are honest and useful: they prove threshold, margin, max, dedup, threshold-band, and handler machinery. They do not prove real embedding recall, false-positive rate, cost, or p95 latency for the active 768d profile.
- Fix sketch: Add a separate live-profile evaluation harness and ensure docs never cite synthetic golden pass rates as promotion evidence.
