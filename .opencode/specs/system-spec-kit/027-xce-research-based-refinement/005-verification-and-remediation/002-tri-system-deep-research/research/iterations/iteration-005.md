# Iteration 005 — Angle 5

**Angle:** consumption_log fingerprint utility: is query_hash consumed anywhere? Dead instrumentation vs planned use; retention of the table itself.

**Summary:** query_hash is not wholly dead: rows are actively written and library analytics group by the fingerprint, but production consumers do not use those analytics and scheduled replay cannot use the clean schema. The utility also has a privacy defect because the persisted fingerprint includes raw query prefixes.

**Findings kept:** 4

## [P0][BUG] query_hash persists raw query prefix despite PII-clean claims

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:105-116 formats fingerprints as <first-8-chars-of-query>:<sha256-prefix>; .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:12-13 and :30-31 claim raw query text is never stored.
- Detail: The clean schema removed query_text, but query_hash still stores the first 8 raw characters of the query. That can persist sensitive query fragments in the SQLite table and in checkpoints, contradicting the privacy contract.
- Fix sketch: Change query_hash to a hash-only or non-content fingerprint and update tests/docs that expect raw prefixes.

## [P1][BROKEN-FEATURE] Scheduled shadow evaluation cannot consume clean consumption_log queries

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:204-211 returns [] when consumption_log lacks query_text; :423-427 skips the cycle when the query pool is empty; .opencode/skills/system-spec-kit/feature_catalog/11--scoring-and-calibration/shadow-feedback-holdout-evaluation.md:18-30 claims default-on holdout evaluation over queries.
- Detail: The clean query_hash-only schema makes production query replay impossible because the scheduler still requires raw query_text. As a result, the scheduled runtime path skips instead of evaluating recent consumption telemetry.
- Fix sketch: Introduce an explicit privacy-preserving replay pool, or document scheduled replay as disabled until raw-query-free replay exists.

## [P2][REFINEMENT] query_hash analytics are implemented but not called by production code

- Evidence: Command `rg -n "getConsumptionPatterns|getConsumptionStats" ".opencode/skills/system-spec-kit/mcp_server" -g "*.ts" -g "!**/tests/**"` returned only definitions/exports in consumption-logger.ts; handlers write rows at memory-search.ts:1584-1609, memory-context.ts:1891-1917, memory-triggers.ts:795-808.
- Detail: query_hash is consumed by getConsumptionPatterns for grouping, but no non-test production path calls those analytics helpers. The table is not dead because handlers actively write to it, but the fingerprint utility is currently library/test-level instrumentation rather than an exposed operational signal.
- Fix sketch: Either expose consumption stats/patterns through an audit/admin surface with retention policy, or retire the unused analytics helpers and document the table as write-only telemetry.

## [P1][README-MISALIGNMENT] Consumption logging docs disagree on active versus inert behavior

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/telemetry/README.md:58 and :84-93 say consumption logging is deprecated/inert/always false; consumption-logger.ts:91-96 delegates to isFeatureEnabled; rollout-policy.ts:53-66 treats missing flags as enabled; mcp_server/ENV_REFERENCE.md:364 says SPECKIT_CONSUMPTION_LOG defaults true.
- Detail: The code path is graduated default-on unless explicitly disabled, but telemetry README and the manual playbook still describe an inert logger. This can cause audits to expect no rows while runtime handlers are allowed to write consumption_log events.
- Fix sketch: Align telemetry README, manual playbook, and environment reference to the same default-on/default-off contract.
