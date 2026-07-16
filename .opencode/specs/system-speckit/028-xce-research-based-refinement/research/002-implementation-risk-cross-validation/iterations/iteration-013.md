# Iteration 004 - IRQ4 Phase 004 Confidence-Edge-Case Stress

## Focus

IRQ4 stress-tested Phase 004's plan to strengthen the skill-advisor hook brief from soft wording (`use ${label}`) to first-action mandate wording (`MUST invoke ${label} FIRST (...) - ${action_hint}`). The phase is intentionally render-layer only: it requires preserving the confidence gate at `render.ts:124-133`, preserving token caps, covering the available skill list, and avoiding scorer changes (`004-skill-advisor-first-action-mandate/spec.md:37-49`, `004-skill-advisor-first-action-mandate/spec.md:92-96`, `004-skill-advisor-first-action-mandate/spec.md:107-111`).

## Actions Taken

- Read the Phase 004 spec requirements and risks: confidence >= 0.8 must be preserved (`004-skill-advisor-first-action-mandate/spec.md:44`, `004-skill-advisor-first-action-mandate/spec.md:109`), `DEFAULT_TOKEN_CAP` must be honored (`004-skill-advisor-first-action-mandate/spec.md:47-48`, `004-skill-advisor-first-action-mandate/spec.md:110`), and scorer changes remain out of scope (`004-skill-advisor-first-action-mandate/spec.md:92-96`).
- Read prior pt-02 iterations. Iteration 001-003 use a blocking-first validation tone and do not report advisor-brief tone side effects; Iteration 003 only hands off IRQ4 as the next focus (`027-xce-research-based-refinement-pt-02/iterations/iteration-001.md:15-57`, `027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:17-71`, `027-xce-research-based-refinement-pt-02/iterations/iteration-003.md:91-93`).
- Read the full renderer. The default cap is 80 tokens, ambiguous cap is 120, hard max is 120, and `capText()` applies an approximate 4 chars/token cap (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:39-65`). The current threshold filter is inclusive on confidence (`>= 0.8`) and applies uncertainty only when `passes_threshold` is not already true (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`).
- Read the producer integration. `passingRecommendations()` repeats the same `passes_threshold === true` bypass and otherwise requires confidence >= threshold plus uncertainty <= threshold (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:148-162`). The producer then renders through `renderSharedBrief()` and `renderAdvisorBrief()` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:176-193`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:217-224`).
- Listed scorer files only, per constraint. No scorer change is proposed.
- Read renderer/producer/cache tests. Existing assertions pin the old `use ${label}` text in renderer and producer tests (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:21-30`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:45-60`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:83-90`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts:93-109`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts:112-156`).
- Ran three read-only advisor probes for CLI-skill behavior. Explicit Codex delegation prompts returned `cli-codex` above 0.8, while read-only `.codex/agents` inspection returned no recommendation; this matches the regression fixture that expects `cli-codex` for "delegate to codex for code generation" (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:34`) and the routing corpus that expects no skill for `.codex/agents` inspection (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl:19`).

## Findings

### f-iter004-001 - CONFIRMED - Confidence boundary is inclusive at exactly 0.80

Evidence: Both the renderer and producer use `recommendation.confidence >= (thresholdConfig?.confidenceThreshold ?? 0.8)` for the fallback threshold path (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:153-162`). Therefore, with `passes_threshold: false` or absent and default thresholds, confidence `0.79` does not render, `0.80` renders if uncertainty is <= 0.35, and `0.81` renders if uncertainty is <= 0.35. If `passes_threshold: true`, all three can pass regardless of the local numeric comparison (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-132`).

Verdict: CONFIRMED. Phase 004 can truthfully say the confidence threshold is inclusive. Add a regression test for `0.79/0.80/0.81` so "MUST invoke" does not accidentally become exclusive during the wording edit.

### f-iter004-002 - BLOCKING - High uncertainty can still pass through `passes_threshold: true`

Evidence: The renderer accepts any recommendation with `passes_threshold === true` before checking confidence and uncertainty (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-132`). The producer prefilter does the same (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:153-162`). That means `confidence=0.80, uncertainty=0.85, passes_threshold=false` is suppressed, but the same numeric pair with `passes_threshold=true` renders a brief and would become "MUST invoke" after Phase 004.

Verdict: BLOCKING for the stronger directive unless the scorer contract guarantees `passes_threshold` already encodes the uncertainty threshold. Because Phase 004 is render-layer only, the minimum safe amendment is a fixture documenting the intended invariant: high-uncertainty recommendations must not have `passes_threshold: true`, or renderer must explicitly re-check uncertainty before emitting mandate wording.

### f-iter004-003 - CONFIRMED - Proposed concise hints fit both 80-token and 120-token caps

Evidence: The renderer caps normal output to `DEFAULT_TOKEN_CAP` (80 tokens, about 320 chars) and ambiguous output to `AMBIGUOUS_TOKEN_CAP` (120 tokens, about 480 chars) through `capText()` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:39-65`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:149-158`). The phase explicitly expects concise hints and flags brief growth from about 60-80 chars to about 90-180 chars (`004-skill-advisor-first-action-mandate/spec.md:47-48`, `004-skill-advisor-first-action-mandate/spec.md:137-139`, `004-skill-advisor-first-action-mandate/spec.md:161-162`). Existing tests already check ambiguous output <= 480 chars and hard-cap output <= 120 approximate tokens (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:58-61`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts:316-340`).

Verdict: CONFIRMED with test obligation. With <=30-char hints, normal and ambiguous mandate text should fit without truncation for known skill labels. Add explicit tests for longest known label plus longest hint under normal and ambiguous rendering.

### f-iter004-004 - BLOCKING - Static `FIRST_ACTION_HINT` coverage is already inventory-fragile

Evidence: The spec says the map must cover "all 16 skills", but its in-scope list contains 17 entries if `agent_router` is counted (`004-skill-advisor-first-action-mandate/spec.md:83-90`). The same phase bans new files and changes outside `render.ts` (`004-skill-advisor-first-action-mandate/spec.md:92-96`), so a static map can drift whenever the advisor inventory changes. Current label sanitization allows any safe single-line skill label and does not restrict labels to that map (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:68-83`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:139-142`).

Verdict: BLOCKING for robustness. Phase 004 should define fallback behavior for missing hints, such as `FIRST_ACTION_HINT[topLabel] ?? 'open the skill instructions first'`, and a test proving an unknown safe skill label does not render `undefined` or suppress an otherwise valid recommendation.

### f-iter004-005 - CONFIRMED - CLI skills can exceed 0.8 only on explicit delegation wording in observed fixtures

Evidence: The regression fixture expects `cli-codex` for "delegate to codex for code generation" (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:34`). The routing corpus expects no skill for read-only `.codex/agents` inspection (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl:19`). Read-only probes matched that split: explicit Codex delegation returned `cli-codex` above 0.8, while `.codex/agents` inspection returned no recommendation.

Verdict: CONFIRMED but narrow. The mitigation is accurate for explicit CLI-delegation prompts, not for every prompt that merely mentions Codex. The first-action hint for CLI skills should include "dispatch via the CLI skill workflow" rather than language that sounds like opening a local source file.

### f-iter004-006 - BLOCKING - Legacy tests are string-pinned and must be updated intentionally

Evidence: Renderer tests assert exact old strings for live, stale, compact ambiguous, expanded ambiguous, and adversarial fixtures (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:21-30`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:45-60`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:83-90`). Producer tests also assert exact old strings and shared-payload parity (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts:93-109`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts:112-156`).

Verdict: BLOCKING for implementation planning. Existing tests will not continue passing unchanged. Phase 004 must rewrite these exact fixtures and add new directive-shape assertions while preserving the null, poisoning, freshness, cache, and cap tests.

### f-iter004-007 - NO-CHANGE-NEEDED - Prompt-cache hit rate should not change from brief wording alone

Evidence: The cache key is derived from canonical prompt, source signature, runtime, normalized max tokens, and stable threshold config; it does not include the rendered brief string (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/prompt-cache.ts:72-80`). The producer builds that key before subprocess invocation (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:461-470`) and stores successful rendered results after rendering (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:543-549`). Cache tests already pin exact hits, max-token key splits, TTL expiry, and oldest-entry eviction (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-prompt-cache.vitest.ts:12-105`).

Verdict: NO-CHANGE-NEEDED for cache hit rates. The only cache-related test updates needed are any producer tests whose cached `brief` value is now mandate-shaped.

## Questions Answered

- 0.79 / 0.80 / 0.81 boundary: `0.79` suppresses unless `passes_threshold: true`; `0.80` is inclusive; `0.81` passes, subject to uncertainty <= 0.35 on the local threshold path (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`).
- Uncertainty greater than confidence: suppressed when the renderer has to compute thresholds, but not suppressed if upstream sets `passes_threshold: true` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-132`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:153-162`).
- Token caps: concise hints fit; `capText()` remains the safety net for unexpectedly long labels or hints (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:39-65`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:149-158`).
- New skill added: without a fallback, a static map risks rendering `undefined` or suppressing a valid label depending on implementation; current sanitizer accepts safe labels independent of inventory membership (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:68-83`).
- CLI skills: explicit CLI delegation can score above 0.8, as the fixture expects for `cli-codex`; read-only `.codex/agents` inspection is expected to produce no skill (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:34`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl:19`).
- Legacy tests: exact old strings are pinned and must be rewritten; keeping behavior means preserving filtering, sanitization, freshness, cap, and shared-payload invariants, not preserving the literal text (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts:21-104`).
- Prompt-cache race/hit rate: wording alone does not affect cache key composition (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/prompt-cache.ts:72-80`).

## Questions Remaining

- Should Phase 004 re-check uncertainty in `render.ts` even when `passes_threshold: true`, or should it codify `passes_threshold` as a trusted scorer invariant with tests? The answer decides whether the mandate can safely rely on the current pass flag (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-132`).
- Should the map cover exactly the spec list, the live advisor inventory, or include a generic fallback for all sanitized labels? The spec's "16 skills" wording conflicts with the 17-name list shown in scope (`004-skill-advisor-first-action-mandate/spec.md:83-90`).
- Should ambiguous rendering use one shared hint for the top recommendation only, or include hints for both top candidates? Including both is clearer but longer; token caps can handle it if hints stay concise (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:144-158`).

## Next Focus

IRQ5 - Phase 005 subprocess reliability at 24-40 sequential dispatches.
