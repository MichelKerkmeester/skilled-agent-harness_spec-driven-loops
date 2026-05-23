---
executor: cli-devin
model: swe-1.6
iter: 7
started_at: 2026-05-23T08:19:00.000Z
finished_at: 2026-05-23T08:25:00.000Z
target_dimension: cost-latency
---

# Iter-007: Cost/Latency Dimension Exploration

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review contract characterization
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research contract characterization
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-003.md` — deep-council contract characterization (proposed)
4. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md` — overlap-surface inventory
5. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-005.md` — fixture-prompt suite
6. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-006.md` — saturation check + strategy enumeration
7. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
8. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/deep-research-state.jsonl` — prior state
9. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/packet-docs/implementation-summary.md` — 10-iteration deep-research cost evidence
10. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs/implementation-summary.md` — 15-iteration deep-research cost evidence
11. `.opencode/skills/sk-prompt/assets/model-profiles.json` — model cost profiles with avg_iter_wall_clock_min and quota pools
12. `.opencode/skills/cli-devin/assets/per-model-budgets.json` — per-model context budget defaults
13. `.opencode/skills/cli-codex/SKILL.md` — Codex executor cost model (gpt-5.5 pricing)
14. `.opencode/skills/cli-devin/SKILL.md` — Devin executor cost model (SWE-1.6 free, DeepSeek-v4-pro paid)
15. `.opencode/skills/cli-opencode/SKILL.md` — OpenCode executor cost model (opencode-go credits)

## Cost/Latency Findings

### F71 — Per-iteration wall time varies 3x across executor models
**Fingerprint:** `cost-latency:wall-time:executor-model-variance`
**Severity:** info
**Evidence:** Model profiles show avg_iter_wall_clock_min varies significantly: swe-1.6 (7 min), qwen3.6 (12 min), glm-5.1 (16 min), deepseek-v4-pro (18 min), kimi-k2.6 (22 min) [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:33, 78, 116, 147, 183]. This 3x variance (7 min vs 22 min) means deep-* skill cost depends heavily on executor choice. A 10-iteration deep-research using swe-1.6 costs ~70 minutes wall time, while the same 10 iterations using kimi-k2.6 costs ~220 minutes. Deep-council's multi-seat per-round structure (2-4 seats per round [iter-003 F35]) amplifies this variance — a 3-round deep-council session with 3 seats using kimi-k2.6 could cost 3 rounds × 3 seats × 22 min = 198 minutes per topic, versus 3 rounds × 3 seats × 7 min = 63 minutes using swe-1.6.
**Implication:** Cost-guard configuration in deep-council (max_rounds_per_topic, max_topics_per_session [iter-003 F33]) must account for executor-specific wall time multipliers. A session configured for max_rounds=3 with kimi-k2.6 could exceed practical time budgets even if iteration counts are modest.

### F72 — SWE-1.6 is free tier; other executors burn paid quota pools
**Fingerprint:** `cost-latency:executor-cost:swe-1.6-free-vs-paid`
**Severity:** info
**Evidence:** Model profiles show swe-1.6 uses "cognition-free" quota pool with free_tier=true [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:14, 21]. All other active models (deepseek-v4-pro, kimi-k2.6, glm-5.1, qwen3.6) use paid quota pools: deepseek-v4-pro uses "cognition-pro" [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:45], kimi-k2.6 uses "cognition-pro" [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:90], glm-5.1 uses "cognition-pro" [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:159], qwen3.6 uses "opencode-go" [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:128]. This means deep-* skills dispatched via cli-devin with --model swe-1.6 incur zero API cost, while the same skills with --model deepseek-v4-pro burn Cognition Pro quota. Deep-council's multi-seat structure (2-4 seats per round [iter-003 F35]) compounds this — a 3-round session with 3 seats using deepseek-v4-pro burns 9× the quota of a single swe-1.6 iteration.
**Implication:** Strategy D (Hybrid) should recommend swe-1.6 as default executor for cost-constrained deep-* sessions, with deepseek-v4-pro reserved for complex tasks requiring its strengths (complex reasoning, root-cause debugging [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:68-70]). Advisor routing rules (iter-008 deliverable) should surface cost implications when suggesting executor upgrades.

### F73 — Deep-council multi-seat structure amplifies cost 2-4x per round
**Fingerprint:** `cost-latency:deep-council:multi-seat-cost-amplification`
**Severity:** info
**Evidence:** Deep-council proposes 2-4 seats with different strategy lenses per round [iter-003 F35], with one-CLI-per-round invariant [iter-003 F36]. This means each round incurs 2-4× the executor cost of a single deep-review or deep-research iteration. If a deep-council session uses max_rounds_per_topic=3 (default [iter-003 F33]) with 3 seats per round using deepseek-v4-pro (paid Cognition Pro quota), the cost is 3 rounds × 3 seats = 9 paid executor invocations per topic. A 5-topic session (max_topics_per_session default [iter-003 F33]) would cost 5 topics × 9 invocations = 45 paid executor invocations. By contrast, a 10-iteration deep-research using swe-1.6 (free tier) costs zero API cost. This order-of-magnitude cost difference means deep-council requires explicit cost-guard configuration (max_rounds, max_topics) and operator awareness of quota pool burn rates.
**Implication:** Deep-council's cost-guard defaults (max_rounds_per_topic=3, max_topics_per_session=5 [iter-003 F33]) should be calibrated against executor choice. If using paid executors (deepseek-v4-pro, kimi-k2.6, glm-5.1), defaults should be lower (e.g., max_rounds=2, max_topics=3) to avoid quota exhaustion. If using swe-1.6 (free), higher defaults are acceptable.

### F74 — Historical deep-research packets show 10-15 iteration patterns with mixed executors
**Fingerprint:** `cost-latency:historical:deep-research-iteration-patterns`
**Severity:** info
**Evidence:** Packet 020 (CLI process memory leak deep research) executed 10 iterations with 5 Claude Code (Opus-route) and 5 Codex (GPT-5.5 xhigh fast) iterations [SOURCE: 020 implementation-summary.md:63]. Packet 024 (CLI deep research memory leak audit) executed 15 iterations with 5 Claude Code and 10 Codex iterations [SOURCE: 024 implementation-summary.md:76]. Both packets used sequential dispatch to avoid process-spam pressure [SOURCE: 020 implementation-summary.md:85]. This historical pattern suggests deep-research typically converges in 10-15 iterations when using mixed executors (Claude + Codex). The wall time for 020 was not explicitly documented, but 024 noted "Codex sandbox limits and Homebrew ccc collision prevented a clean successful-search RSS slope measurement" [SOURCE: 024 implementation-summary.md:111], indicating operational friction. By contrast, the current differentiation packet (130) uses cli-devin with swe-1.6 for all 6 iterations so far [SOURCE: deep-research-state.jsonl], with iter-001 taking 30 seconds, iter-002 taking 2 minutes, iter-003 taking 3 minutes, iter-004 taking 5 minutes, iter-005 taking 15 minutes, iter-006 taking 5 minutes — totaling ~30 minutes for 6 iterations.
**Implication:** Deep-research cost is executor-dependent. Historical packets using paid executors (Claude Opus, Codex GPT-5.5) likely incurred significant API cost for 10-15 iterations. The current packet using swe-1.6 (free) incurs zero API cost but may require more iterations to converge due to swe-1.6's limited reasoning depth [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:29]. Advisor routing should surface this trade-off: free but slower (swe-1.6) vs paid but faster (deepseek-v4-pro, gpt-5.5).

### F75 — Executor timeout requirements vary by model reasoning depth
**Fingerprint:** `cost-latency:executor-timeout:model-specific-requirements`
**Severity:** info
**Evidence:** cli-devin SKILL.md notes that "--model deepseek-v4 is reasoning-bound and frequently exceeds 15 minutes on non-trivial fixtures. Long-running harnesses should set ≥ 25-minute per-dispatch timeouts when using this preset" [SOURCE: .opencode/skills/cli-devin/SKILL.md:268]. By contrast, "--model swe-1.6 is the fastest preset; default per-dispatch timeouts (10–15 minutes) are typically sufficient" [SOURCE: .opencode/skills/cli-devin/SKILL.md:269]. Model profiles confirm this variance: swe-1.6 avg_iter_wall_clock_min=7, deepseek-v4-pro avg_iter_wall_clock_min=18, kimi-k2.6 avg_iter_wall_clock_min=22 [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:33, 78, 116]. Deep-council's multi-seat per-round structure [iter-003 F35] compounds timeout risk — a single round with 3 seats using kimi-k2.6 could require 3 × 22 min = 66 minutes if seats run sequentially, or parallel resource contention if seats run concurrently. Deep-review and deep-research YAML workflows must configure executor-timeout per model to avoid premature termination of long-running iterations.
**Implication:** Deep-* skills should model executor_timeout as a function of executor choice and seat count. Default timeouts should be higher for deepseek-v4-pro (25 min) and kimi-k2.6 (25 min) than for swe-1.6 (15 min). Deep-council should add a per-round timeout multiplier (e.g., round_timeout = seat_count × executor_timeout) to account for multi-seat sequential execution.

### F76 — Failure-tail behaviors include hang rates and empty-output risks
**Fingerprint:** `cost-latency:failure-tail:hang-and-empty-output-risks`
**Severity:** CONFUSING
**Evidence:** Model profiles note that kimi-k2.6 "can hang on complex fixtures" with "~5–10% hang rate documented in cli-devin SKILL.md §3" [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json:113-114]. cli-opencode SKILL.md documents a critical stdin-handling bug: "opencode v1.14.39 reads stdin at startup before session creation; without explicit closed stdin, automation hangs forever at 0% CPU after the +60s service=snapshot prune=7.days cleanup log line" [SOURCE: .opencode/skills/cli-opencode/SKILL.md:287]. Historical packet 024 noted "Codex sandbox limits and Homebrew ccc collision prevented a clean successful-search RSS slope measurement" [SOURCE: 024 implementation-summary.md.md:111], indicating operational friction. These failure-tail behaviors mean deep-* skills must implement retry logic and timeout guards. Deep-council's multi-seat structure [iter-003 F35] increases failure surface — if one seat hangs or returns empty output, the round may fail to converge, wasting the cost of other seats in that round.
**Implication:** Strategy D (Hybrid) should extract shared failure-recovery primitives from deep-loop-runtime (loop-lock, jsonl-repair, atomic-state [iter-003 F49]) and add seat-level failure detection for deep-council. Advisor routing should warn operators about executor-specific failure risks (e.g., kimi-k2.6 hang rate) when suggesting executor choices.

### F77 — Operator cost-of-confusion: wrong skill dispatch wastes iteration budget
**Fingerprint:** `cost-latency:operator-cost:wrong-skill-dispatch-waste`
**Severity:** DANGEROUS
**Evidence:** Iter-004 identified 2 DANGEROUS overlap findings: F56 (convergence-threshold default divergence) and F60 (operator-intent overlap on "iterate findings until convergence"). Iter-005 fixture F-fixture-008 shows a genuinely contested case where the correct skill is ambiguous without clarifying questions [iter-005 F84-92]. If an operator dispatches deep-research when deep-review is appropriate (e.g., "audit the embedder sidecar for drift" [iter-005 F23-29]), the session may run 10-15 iterations before converging on findings that don't match the operator's mental model (e.g., expecting P0/P1/P2 severity tiers but getting newInfoRatio without tiers [iter-002 F27]). The operator then must re-dispatch the correct skill, wasting the cost of the first session. This cost-of-confusion is amplified for deep-council due to its multi-seat cost structure [F73] — a wrong deep-council dispatch could burn 9-45 paid executor invocations before the operator realizes the error.
**Implication:** Advisor routing rules (iter-008 deliverable) must include clarifying questions for LOW-confidence fixtures (e.g., F-fixture-008). The cost of a 5-second clarifying question is trivial compared to the cost of a 15-iteration wrong-skill session (70-220 minutes wall time + paid quota burn). Strategy D (Hybrid) should prioritize advisor disambiguation over low-cost fixes like naming consistency.

### F78 — Convergence-threshold defaults create cost expectation mismatches
**Fingerprint:** `cost-latency:convergence:threshold-default-cost-mismatch`
**Severity:** DANGEROUS
**Evidence:** Iter-004 F56 documented convergence-threshold default divergence: deep-review default is 0.10 [SOURCE: .opencode/commands/spec_kit/deep-review.md:106], deep-research default is 0.05 [SOURCE: .opencode/commands/spec_kit/deep-research.md:97], deep-council proposes saturation_threshold default of 0.20 [iter-003 F43]. These defaults mean an operator expecting "default convergence" will get significantly different iteration counts across skills. A deep-research session with threshold 0.05 may require 20 iterations to converge, while a deep-review session with threshold 0.10 may converge in 10 iterations. If the operator is using a paid executor (deepseek-v4-pro, gpt-5.5), this 2× iteration count difference directly translates to 2× API cost. The danger is that operators familiar with one skill's default may incorrectly assume the same default applies to other skills, leading to cost surprise when the session runs longer than expected.
**Implication:** Strategy D (Hybrid) should standardize convergence-threshold defaults across all three skills (e.g., all use 0.10) OR surface the default explicitly in advisor routing when a skill is selected. Standardization reduces operator confusion, while surfacing defaults preserves skill-specific convergence semantics if divergence is intentional.

## Implications for Strategy Choice

### Impact on Strategy A (Keep-Distinct)
Strategy A's low cost (documentation sharpening only) is attractive, but the 2 DANGEROUS overlap findings (F56, F60) remain operator-facing risks. Cost-latency analysis adds urgency: wrong-skill dispatch cost (F77) and convergence-threshold mismatch (F78) directly burn operator budget. Advisor rules alone may not be sufficient if LOW-confidence fixtures (F-fixture-008) persist. Strategy A requires high advisor routing accuracy (≥ 90%) to avoid cost waste, which may not be achievable without clarifying questions.

### Impact on Strategy B (Merge Two-of-Three)
Strategy B's high cost (breaking changes to command surface, runtime refactor) is not justified by cost-latency findings. The distinct cost profiles (swe-1.6 free vs paid executors) and wall-time variance (7 min vs 22 min) are executor-specific, not skill-specific. Merging deep-review and deep-research would not resolve cost differences — the merged skill would still need to support both free (swe-1.6) and paid (deepseek-v4-pro, gpt-5.5) executors. The merge would lose the adversarial-vs-evidence distinction [iter-001 F15] without addressing the root cost drivers (executor choice, convergence defaults).

### Impact on Strategy C (Unify-With-Mode-Suffix)
Strategy C's medium cost (command entrypoint unification) could help with cost-of-confusion (F77) by making the deep-* family more discoverable. A unified `/spec_kit:deep` command with mode suffixes (:review, :research, :council) would reduce the cognitive load of remembering three separate commands. However, mode suffixes do not address the underlying convergence-threshold divergence (F78) or executor cost variance (F72). The unification could obscure cost differences if documentation does not clearly explain per-mode cost implications.

### Impact on Strategy D (Hybrid)
Strategy D's low-medium cost (extract shared primitives, keep distinct entrypoints) aligns well with cost-latency findings. The priority actions should be:
1. **Standardize convergence-threshold defaults** (address F78) — low-cost fix with high operator value.
2. **Implement advisor clarifying questions** for LOW-confidence fixtures (address F77) — reduces wrong-skill dispatch cost.
3. **Extract failure-recovery primitives** from deep-loop-runtime (address F76) — shared seat-level failure detection for deep-council.
4. **Surface executor cost implications** in advisor routing (address F72, F73) — warn operators about paid vs free executors and multi-seat cost amplification.

Strategy D preserves the distinct value propositions (adversarial P0 adjudication, negative knowledge, multi-seat opinion synthesis) while addressing the cost-related DANGEROUS findings. The cost of these fixes is low (documentation, advisor rules, shared primitives) compared to the cost of wrong-skill dispatches and convergence-threshold mismatches.

## Open Questions for Iter-008

1. **Routing rule cost-awareness:** Should iter-008 routing rules include explicit cost estimates (e.g., "This session will use deepseek-v4-pro (paid Cognition Pro quota). Estimated cost: 10 iterations × $X/iteration = $Y. Use swe-1.6 for free tier")?
2. **Convergence-threshold standardization:** Should iter-008 implement convergence-threshold standardization (all skills use 0.10) as a low-cost hybrid fix, or keep divergence and surface defaults in advisor routing?
3. **Clarifying question protocol:** Should iter-088 routing rules proactively ask clarifying questions for LOW-confidence fixtures (e.g., F-fixture-008: "Do architecture options exist or need discovery?"), or make a best-effort routing with explanation?
4. **Failure-recovery primitive extraction:** Should iter-008 extract seat-level failure detection from deep-loop-runtime for deep-council, or defer this to iter-009 (parity-test invariants)?
5. **Cost-guard calibration:** Should iter-008 calibrate deep-council cost-guard defaults (max_rounds_per_topic, max_topics_per_session) against executor choice (lower defaults for paid executors, higher for swe-1.6)?
6. **Historical cost analysis:** Should iter-008 analyze historical deep-research packets (020, 024) to extract actual API cost data (if available) for more accurate cost estimates?

## Next Iteration

**Iter-008 target:** Routing rule formalization with cost-awareness and clarifying questions. This is the planned next dimension from the deep-research-config.json dimensions list ["routing-rules"]. Iter-008 should implement the advisor routing rules previewed in iter-005, augmented with cost-awareness (F72, F73, F77) and clarifying questions for LOW-confidence fixtures (F-fixture-008).

**Exit condition for synthesis:** If iter-008 routing rule accuracy ≥ 90% on fixture suite AND iter-007 novelty rate < 0.2, branch to synthesis (iter-009 becomes parity-test invariants, iter-010 synthesizes research.md). Otherwise, continue with iter-009 (parity-test invariants) as planned.
