# Iteration 009

## Focus

Determine which operator-facing defaults should become hard safety limits and which should remain explicit opt-in overrides.

## Actions Taken

1. Re-read the externalized state, reducer-owned next focus, prior cost/liveness findings, and iteration contract. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-state.jsonl:19-36] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:109-139] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-008.md:14-49]
2. Compared council defaults, normalization, computed upper bounds, and command setup text to identify where a default is only advisory rather than an enforced ceiling. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:15-21,61-100] [SOURCE: .opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:275-290,321-338] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth_dispatch.md:33-37]
3. Compared fan-out executor, concurrency, retry, timeout, heartbeat, watchdog, and budget normalization to the operator command contract. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:34-46,258-282] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:646-700,1059-1076,1131-1187] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:199-219,246-267]
4. Contrasted deep-loop controls with deep-improvement's explicit, auditable promotion overrides to derive an override policy that does not weaken containment. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model-benchmark-mode/score-delta-benchmark-gates.md:18-30,43-48]

## Findings

### F-ITER009-001 (P1): Aggregate dispatch volume needs a non-bypassable hard envelope

Council calls its defaults conservative and previews 45 seat outputs, but `normalizeCostGuards` accepts any positive topics, rounds, and seats and only computes their product. Research/review similarly accept positive iteration, count, and timeout values without an aggregate ceiling. The hard safety invariant should be evaluated before dispatch over the expanded plan: `lineages * iterations * (maxRetries + 1)` for fan-out and `topics * rounds * seats` for council, with an absolute session ceiling that `:auto`, `:confirm`, config files, and marker blocks cannot bypass. Operators may raise individual dimensions only while the aggregate remains under that ceiling. The exact numeric ceiling is a product/capacity decision, but the invariant and fail-closed boundary are not. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/cost-guards.cjs:61-100] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:258-282] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth_dispatch.md:33-37]

### F-ITER009-002 (P1): Concurrency and retries require hard maxima; cumulative budget must default on

Fan-out defaults to concurrency 2 and five retries, but both fields accept any positive/non-negative integer, while `max_cost_units_per_lineage` defaults to 0 (disabled) and the estimate excludes retries. Peak concurrency is a host-stability boundary, and retry count multiplies spend after failure, so both need absolute schema maxima. A cumulative approved/consumed budget must be enabled by default and checked before every retry. Lower values remain freely configurable; increases above conservative defaults should require explicit setup but still cannot exceed the absolute maxima. `:auto` should reject over-limit plans rather than silently ask or continue. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:272-282] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:658-700] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:216-219,258-267]

### F-ITER009-003 (P1): Finite process lifetime and unattended stall detection are safety limits, not tuning defaults

Executor timeout accepts any positive integer, and `--lineage-timeout-hours` can raise the four-hour ceiling to any positive value. Fan-out also permits `lagCeilingMs = 0`, `progressHeartbeatSeconds = 0`, and a raw `stallWatchdogMs = 0`; the watchdog only emits a warning and the synthetic heartbeat currently refreshes the timestamp it observes. A finite absolute process-tree lifetime, TERM-to-KILL reaping, and child-observed stall enforcement should be non-bypassable for autonomous runs. Operators may select shorter timeouts or request a longer timeout inside the absolute ceiling. Telemetry cadence may be disabled or tuned because it affects observability volume, but disabling telemetry must not disable or refresh the independent safety watchdog. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:34-46,272-282] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:646-655,1059-1076,1131-1187,1385-1399] [SOURCE: .opencode/commands/deep/assets/legacy/deep_research.body.md:120-126]

### F-ITER009-004 (P2): Depth and convergence controls should remain explicit bounded overrides

`maxIterations`, convergence threshold/mode, `stop-policy=max-iterations`, and council topic/round dimensions express desired evidence depth rather than containment by themselves. Making their defaults immutable would remove legitimate exhaustive-review and multi-topic use cases. They should remain operator controls, but values above the conservative default or policies that suppress early convergence should show the computed worst-case dispatch envelope and require an explicit opt-in. In `:confirm`, record operator identity/rationale and the resolved upper bound; in `:auto`, accept only a dedicated pre-bound override marker or flag and reject any value that crosses hard limits. [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:199-219,246-267] [SOURCE: .opencode/commands/deep/assets/legacy/deep_research.body.md:109-126] [SOURCE: .opencode/commands/deep/assets/compiled/deep_ai-council.contract.md:275-290,321-338]

### F-ITER009-005 (P2): Override provenance should copy the promotion-gate pattern, not become a generic unsafe switch

Deep-improvement already models narrow overrides as named flags (`--no-baseline-ok`, `--allow-hurt-fixtures`) that leave scoring unchanged and are exercised by tests. Deep-loop should use the same shape: one override per soft guard, persisted requested/effective values, computed envelope, rationale, and actor/mode. There should be no generic `--unsafe`, no override for write containment or process reaping, and no override that converts an absolute ceiling into a warning. This preserves operator agency without creating an undocumented second safety policy. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model-benchmark-mode/score-delta-benchmark-gates.md:18-30,43-48]

## Questions Answered

- **Which controls should be hard safety limits?** Aggregate expanded dispatch volume, cumulative retry spend, peak concurrency, finite process-tree lifetime/reaping, autonomous child-progress stall detection, and existing write/ownership boundaries.
- **Which controls should support explicit opt-in overrides?** Evidence-depth knobs such as iterations, convergence sensitivity, forced-depth stop policy, and council topic/round breadth, plus longer timeouts inside an absolute lifetime ceiling.
- **How should overrides behave?** Narrow, named, pre-dispatch, confirmable or explicitly pre-bound, persisted with requested/effective values and rationale, and incapable of crossing absolute ceilings.
- **What may safely default off?** Optional observability emission such as progress-heartbeat records may be disabled; containment checks and cumulative budgets may not.

## Questions Remaining

- How do deep-improvement candidate prompts, reducer boundaries, and dispatch budgets compare with the review and council failure patterns?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?
- Are review prompt/validator schema mismatches covered outside skill-local tests?
- What numeric hard ceilings fit supported host capacities, and should runtime capability profiles provide lower platform-specific ceilings?

## Ruled-Out Directions

- Making every current default immutable is ruled out because evidence-depth controls legitimately vary by task; containment must instead be enforced on the computed aggregate envelope. [SOURCE: .opencode/commands/deep/assets/legacy/deep_research.body.md:120-126] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/depth_dispatch.md:33-37]
- A generic `--unsafe` bypass is ruled out because it cannot preserve per-guard provenance or prevent accidental bypass of non-negotiable containment. The existing named promotion overrides demonstrate the safer pattern. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model-benchmark-mode/score-delta-benchmark-gates.md:18-30]
- Requiring council to adopt research/review delta-file schemas was not revisited because strategy marks that direction exhausted. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:77-90]

## Next Focus

Compare deep-improvement candidate prompts, reducer ownership, dispatch budgets, and promotion overrides with the failure and safety patterns established across research, review, and council.

## Assessment

- `newInfoRatio`: 0.74
- Novelty: The iteration converts prior cost/liveness defects into a concrete two-tier control policy and identifies deep-improvement's narrow override design as the reusable provenance pattern.
- Confidence: High for current validation behavior and the hard-versus-soft classification; exact numeric ceilings require capacity policy and benchmark evidence.

## SCOPE VIOLATIONS

None. No researched runtime, command, skill, agent, or test file was modified.
