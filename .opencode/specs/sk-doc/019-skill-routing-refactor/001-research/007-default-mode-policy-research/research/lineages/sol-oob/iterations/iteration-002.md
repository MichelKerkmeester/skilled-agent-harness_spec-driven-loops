# Iteration 2: Replayable Correction Overlay

## Focus

This iteration designed and stress-tested a deterministic/adaptive hybrid that can learn from routing corrections without changing production policy online. The narrow interpretation is a two-plane system: an immutable, hash-addressed routing snapshot serves decisions, while a batch learning plane turns correction telemetry into a shadow candidate overlay that must pass replay and explicit promotion before it can become another immutable snapshot. Practical default tuning and unversioned live learning were excluded because the strategy marks those directions saturated or blocked.

## Findings

1. The current advisor already contains the essential production/shadow split. Its public response carries an `_shadow` comparison whose `liveWeightsFrozen` field is true, and durable shadow deltas are recorded only through an opt-in sink; the handler stores an HMAC identifier rather than raw prompt text. This means adaptation can be observed beside production without making the serving result depend on mutable learner state. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:448] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:463] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts:121]

2. Existing correction telemetry is intentionally too lossy to become an exception router. An outcome record retains only runtime, accepted/corrected/ignored status, selected skill, and optional corrected skill; its contract explicitly says prompts and scenarios cannot be reconstructed into gold cases. It can support aggregate calibration, but learning prompt-specific rules from this stream would either be impossible or would violate the prompt-safety boundary. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:81] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:452]

3. The shipped calibration reducer is already a bounded candidate generator, not an online trainer. It excludes low-sample, concentrated, and unattributed samples; caps proposed lane-weight and threshold changes; and emits a read-only proposal with live weights frozen, no automatic promotion, and held-out validation required. Those properties are the right learning-plane guardrails, but the proposal needs immutable base-policy and feature-schema identities before it is a replayable serving artifact. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:21] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:138] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:170] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:259] [INFERENCE: a weight proposal without the exact policy and feature versions it modifies cannot identify the historical scoring function]

4. A replayable hybrid can be represented as an immutable pair `(basePolicyHash, overlayHash)`. The base is the registry-derived projection already checked for hash freshness. A candidate overlay contains `schemaVersion`, `basePolicyHash`, `parentOverlayHash`, calibrator version, bounded weight/threshold deltas, training-window digest, held-out-fixture digest, and promotion evidence; its content hash is the overlay identity. Serving is then a pure evaluation of the pinned pair plus a versioned normalized feature vector, and each typed route plan records both hashes and the feature-schema version. The existing deterministic router replay and registry projection drift guard demonstrate both halves of this identity pattern. [SOURCE: .opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:60] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:159] [INFERENCE: content-addressing the base, overlay, and feature schema turns a learned candidate into a deterministic snapshot rather than mutable runtime state]

5. The hybrid must distinguish decision replay from end-to-end prompt replay. Persisting the normalized feature vector (or its packet-safe categorical form) with the two policy hashes is sufficient to reproduce selection without retaining raw text; reproducing feature extraction itself still requires a separately curated, opt-in gold fixture because the operational outcome log deliberately cannot supply one. Promotion should therefore run shadow comparison against held-out fixtures, then create a new overlay version only after an explicit gate. A base-hash or feature-schema mismatch must disable the overlay with a visible abstention/warning, and rollback means selecting the previous overlay hash rather than reversing learned state. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:452] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts:35] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-validate.vitest.ts:128] [INFERENCE: the prompt-safety boundary requires separate operational and curated replay ledgers; immutable overlay selection makes promotion and rollback auditable]

## Ruled Out

- Mutating live weights or router rules immediately after each correction: this makes the effective policy time-dependent and repeats the blocked live-only evaluation direction.
- Treating prompt-free accepted/corrected outcome rows as per-intent gold fixtures: the telemetry contract explicitly prevents prompt or scenario reconstruction.
- Automatically promoting every bounded calibration proposal: the current proposal contract freezes live weights and requires held-out validation, so automatic promotion would erase an intentional safety boundary.

## Dead Ends

- Reusing `shadow-deltas.jsonl` as the complete offline oracle. It can compare scores for an HMAC-keyed invocation, but it cannot replay raw feature extraction and does not identify an immutable base/overlay pair.

## Edge Cases

- Ambiguous input: “learn from corrections” could mean per-prompt exceptions or aggregate calibration. This iteration selected aggregate, batch calibration because the available telemetry is intentionally prompt-free; curated exceptions remain a separate fixture concern.
- Contradictory evidence: none. Adaptive shadow scoring and deterministic CI coexist because the shadow path is frozen and opt-in rather than part of the production decision.
- Missing dependencies: no observed correction corpus or held-out routing fixture was available in this lineage, so the architecture and invariants are source-backed but no empirical gain or latency claim is made.
- Partial success: none. The design answers the deterministic/adaptive contract question; empirical effectiveness remains deliberately unclaimed.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:448`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts:121`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:81`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:452`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:21`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:138`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:259`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts:35`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-validate.vitest.ts:128`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:159`
- `.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:60`

## Assessment

- New information ratio: 1.00 (4 fully new findings + 1 partially new finding = 0.90 raw; resolving the open architecture into a simpler two-plane model adds the 0.10 simplicity bonus)
- Questions addressed: Can Layer 0 safely eliminate hub-local routing while preserving modular packets, local context loading, and explicit authority boundaries?; What deterministic/adaptive hybrid could learn from routing corrections without making offline replay irreproducible?
- Questions answered: A hash-pinned, batch-promoted correction overlay can adapt routing while preserving deterministic replay. It supports the prior conditional Layer-0 collapse only as selection policy: the typed route plan and packet-local resolver must still load context and enforce authority.

## Reflection

- What worked and why: tracing the existing shadow sink, prompt-safe outcomes, calibration reducer, and projection hash exposed a nearly complete two-plane pattern instead of requiring a hypothetical learner.
- What did not work and why: broad searches mixed runtime shadow scoring, benchmark replay, and unrelated deep-loop replay; narrow source reads were required to separate serving policy, learning telemetry, and CI fixtures.
- What I would do differently: test a concrete overlay schema against a held-out routing corpus as soon as an operator-curated fixture exists, especially base-hash mismatch and rollback cases.

## Recommended Next Focus

Investigate cross-domain no-destination semantics from OS schedulers, IP/default routing, DNS, load balancers, and human reception, extracting only analogies that survive transfer.
