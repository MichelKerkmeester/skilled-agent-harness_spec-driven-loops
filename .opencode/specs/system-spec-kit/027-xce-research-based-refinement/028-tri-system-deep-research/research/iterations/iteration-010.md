# Iteration 010 — Angle 10

**Angle:** Retention sweep semantics: protected tiers, dry-run vs apply parity, interaction with the retention reducer.

**Summary:** The protected-tier guard exists and is tested, but reducer integration changes retention semantics: shadow/blocked modes stop baseline deletion, active evidence is not publicly passable, and dry-run does not preview the same feedback decisions as apply.

**Findings kept:** 4

## [P1][BROKEN-FEATURE] Feedback-retention shadow/blocked modes pause baseline TTL deletion

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:458-483 returns immediately with swept:0 for shadow or activeBlocked; .opencode/skills/system-spec-kit/mcp_server/tests/feedback-reducers-integration.vitest.ts:211-237 and :240-267 assert rows stay unchanged; .opencode/skills/system-spec-kit/feature_catalog/04--maintenance/memory-retention-sweep.md:18-20 says the sweep deletes expired delete_after rows.
- Detail: When feedback retention learning is enabled in default shadow mode, the retention sweep records feedback audits and exits before the normal delete path. That means expired unprotected rows are not swept, so a learning/audit flag changes the core retention-enforcement semantics.
- Fix sketch: Record feedback shadow/blocked audits, then fall through to the existing baseline protected-tier TTL sweep instead of returning early.

## [P1][BROKEN-FEATURE] Active retention evidence is not reachable through the public sweep tool or scheduler

- Evidence: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503-506 exposes only dryRun; .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28-31 is strict by default, :336-338 accepts only dryRun, and :622 allowlists only dryRun; .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:269 and :277 call runMemoryRetentionSweep with only dryRun:false; activeGatePassed requires args.shadowEvaluationPassed at memory-retention-sweep.ts:291-304.
- Detail: The library supports feedbackRetention.shadowEvaluationPassed, but the MCP schema and scheduled interval cannot provide it. Docs claim active applies when the caller supplies shadow-evaluation evidence, yet the runtime surfaces under investigation do not expose a valid evidence path.
- Fix sketch: Add a validated public promotion input, preferably a stored shadow-evaluation receipt or gate id rather than caller-supplied raw signals, and wire scheduler behavior explicitly.

## [P1][BUG] Dry-run feedback decisions do not use the same signal source as apply

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:291-299 uses [] for signals on dryRun unless args.signals is injected, but aggregates feedback_events for non-dry runs; public schemas only allow dryRun at tool-schemas.ts:503-506 and tool-input-schemas.ts:336-338; the dry-run test relies on internal injected signals at tests/memory-retention-feedback-learning.vitest.ts:120-139.
- Detail: A public dry-run cannot preview real feedback-based extend/protect/delete decisions because it evaluates with an empty signal set. Apply/shadow runs can aggregate real feedback, so dry-run vs apply parity breaks exactly where operators need a safe preview.
- Fix sketch: Have dry-run compute decisions from the same aggregateEvents window as apply, while keeping writes and audits disabled.

## [P2][REFINEMENT] MCP response hides feedback-retention reports

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:75-104 defines feedbackRetention/extendedIds in the result and :641-642 returns them; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:71-86 omits feedbackRetention and extendedIds from MCP response data; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/004-retention-reducer/tasks.md:37-39 says the sweep feedbackRetention report includes decisions, audit counts, active-block state, and applied ids.
- Detail: The internal library exposes useful reducer diagnostics, but the public handler strips them. Operators cannot inspect feedback decisions from the tool response and must infer behavior from audit tables or source-only tests.
- Fix sketch: Include a sanitized feedbackRetention summary and extendedIds in the MCP success data when the feature is enabled.
