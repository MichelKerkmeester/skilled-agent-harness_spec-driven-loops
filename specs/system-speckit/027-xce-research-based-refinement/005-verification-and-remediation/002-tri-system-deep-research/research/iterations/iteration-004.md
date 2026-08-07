# Iteration 004 — Angle 4

**Angle:** Shadow-evaluation replay starvation: post-PII the query pool is empty by design — privacy-preserving replay pool designs (hashed query classes, synthetic queries, opt-in ring buffer).

**Summary:** Shadow replay starvation is real and intentional after the PII cleanup, but the surrounding docs and tests still assume pre-cleanup raw-query replay. The safest path is a new replay-pool abstraction with no durable raw production query text and no raw prefixes in query_hash.

**Findings kept:** 5

## [P0][BUG] Query fingerprints still persist raw query prefixes

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:12-13 claims raw query text is never stored; .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:102-116 stores query.slice(0, 8) inside query_hash.
- Detail: The code does not store full query_text, but it durably stores the first 8 characters of the raw query. That can leak PII or secrets when a query begins with an email, name, token prefix, ticket id, or other sensitive leading text, and it contradicts the privacy claim.
- Fix sketch: Change query_hash to a non-reversible hash/class id with no raw prefix, and update diagnostics/tests to display redacted labels only.

## [P1][BROKEN-FEATURE] Default-on shadow evaluation has no replayable production query pool

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:145-157 creates consumption_log with query_hash but no query_text; .opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:204-210 returns [] when query_text is absent; .opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:423-426 skips the cycle.
- Detail: After the PII cleanup, production telemetry cannot feed shadow replay because replay requires raw query text. The scheduler can start, but clean-schema installations skip evaluation indefinitely with no cycle result, so promotion evidence never accumulates.
- Fix sketch: Add a privacy-preserving replay source, such as opt-in ephemeral query ring buffer, curated synthetic queries keyed by hash classes, or explicit eval-query enrollment.

## [P1][DOC-DRIFT] Docs still describe active weekly holdout replay

- Evidence: .opencode/skills/system-spec-kit/feature_catalog/scoring-and-calibration/shadow-feedback-holdout-evaluation.md:18-30 says the feature runs 20% of queries weekly and logs audit results; .opencode/skills/system-spec-kit/manual_testing_playbook/scoring-and-calibration/shadow-feedback-speckit-shadow-feedback.md:18-24 expects shadow_scoring_log rows; code at .opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:204-210 says the clean schema yields an empty pool.
- Detail: The docs describe the pre-PII behavior as if it still works in production. The code now explicitly treats an empty replay pool as the correct privacy outcome until a new replay pool exists.
- Fix sketch: Update feature catalog and playbook to state that scheduled production replay is currently starved on clean schemas and document the required replacement replay-pool design.

## [P1][BUG] Shadow-evaluation runtime tests self-skip under the clean schema

- Evidence: .opencode/skills/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:57-70 sets describe.skip when initConsumptionLog lacks query_text; .opencode/skills/system-spec-kit/mcp_server/tests/consumption-logger-privacy.vitest.ts:60-64 asserts query_text must not exist.
- Detail: The runtime test suite is gated on the old PII-bearing schema, while the privacy tests enforce the new schema. That means the meaningful scheduler/replay tests are skipped in the current architecture instead of validating the clean-schema skip path or a replacement replay pool.
- Fix sketch: Split tests into clean-schema starvation assertions plus a separate privacy-safe replay-pool fixture, and remove the old-schema describe.skip gate.

## [P2][NEW-FEATURE] Privacy-safe replay design has building blocks but no integration

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:321-329 already groups query_hash patterns; .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:128-140 stores query_id/memory_id feedback rows; .opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-db.ts:42-52 stores curated eval_queries with raw query text in the eval DB.
- Detail: The repo has hashed consumption classes, feedback labels, and a separate eval database, but shadow evaluation only uses consumption_log.query_text. A privacy-preserving pool could connect these without reintroducing durable raw production queries.
- Fix sketch: Introduce a replay-pool abstraction that can sample synthetic eval_queries by query_hash/intent class and optionally accept short-lived opt-in raw queries from an encrypted or memory-only ring buffer.
