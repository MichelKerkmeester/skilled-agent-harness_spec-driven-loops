# Iteration 5: Value — where projection earns its complexity

## Focus

Establish whether the capability earns its complexity and which use cases justify a model round-trip versus simpler deterministic formatting. Angle: VALUE, grounded in the skill contract, privacy/configuration/runbook/support-matrix/rollback docs, and the evaluation evidence classes.

## Actions Taken

- Read the skill's WHEN TO USE / WHEN NOT TO USE and ALWAYS/NEVER rules.
- Read the privacy, configuration, runbook, support-matrix, and rollback docs.
- Read the evaluation evidence-class contract and the release-gate prerequisites.

## Findings

1. The capability is explicitly scoped away from durable content. The skill's WHEN NOT TO USE excludes "rewriting durable Markdown or any on-disk file" — that "changes canonical bytes and is explicitly out of scope". So the value claim is bounded to transient display of a terminal message, not authored artifacts. [SOURCE: .opencode/skills/sk-communication/SKILL.md:33-40]

2. The complexity ledger is real and gate-heavy. A live path requires: protected-span representation, privacy classification before ranking, provider routing, prompt profiles, capability-freshness checks, restoration, deterministic semantic vetoes, an optional judge, runtime/client ownership, content-free telemetry, a compatibility doctor, a six-runtime injected rehearsal, a real credentialed provider smoke, and a powered blinded human non-inferiority study. Every one of these is a prerequisite or an invariant, not optional polish. [SOURCE: .opencode/skills/sk-communication/SKILL.md:143-160] [SOURCE: packages/cli-communication-projection/docs/runbook.md:3-29]

3. Release is gated on human evidence, not proxy scores. The runbook's step 8 requires "the powered, blinded HUMAN non-inferiority study"; proxy or synthetic scores are "diagnostic only and do not authorize release". `assertHumanCertifiable` throws on any `llm-proxy` or provisional result. This means the value question cannot be settled by another model's opinion — it requires measured human comprehension benefit. [SOURCE: packages/cli-communication-projection/docs/runbook.md:19-21] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:28-38]

4. The high-value slice is complex, multi-sentence, user-facing prose. The two presentation tiers (`full-projection` vs `safe-native`) and `canClaimFullProjectionParity` (requires `ownsCompleteMessage && ownsAtomicRenderDecision`) imply full projection is only for a complete, atomically-owned message. Short statuses, typed lifecycle events, command/result summaries, raw tool data, secret-heavy diagnostics, and incomplete streams have little incremental readability value from a model and carry added latency/failure modes. [SOURCE: .opencode/skills/sk-communication/SKILL.md:132-135] [SOURCE: packages/cli-communication-projection/src/clients/types.ts:101-105] [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:52-87]

5. Privacy and consent further narrow the admissible value boundary. Hosted routing requires a named provider/model, operator consent, and fresh retention/training facts; local-only forbids hosted identifiers; mixed requires an explicit ordered fallback list. Any missing/stale/contradictory fact fails closed to the exact original. So value is only claimable inside an explicitly approved privacy mode — never a silent quality upgrade. [SOURCE: packages/cli-communication-projection/docs/privacy.md:7-32] [SOURCE: packages/cli-communication-projection/docs/configuration.md:1-15]

6. The rollback contract makes a low-risk experiment feasible. Rollback disables projections, selects `OriginalOnlyEmergencyMode`, reinstalls the previous exact tarball offline, and verifies the canonical transcript digest — no provider call, no canonical mutation. This means a narrow deterministic-first rollout with append/sidecar (safe-native) is reversible by construction, which is the correct first value test. [SOURCE: packages/cli-communication-projection/docs/rollback.md:1-37]

## Ruled Out

- Enabling projection for every message: short/structured output has little incremental value while every model route adds latency, provider, validation, and fallback cost.
- Using hosted routing as a default quality upgrade: it requires consent and fresh privacy evidence, with no source-backed provider/tier winner.
- Treating proxy/synthetic/injected evidence as product-value proof: release requires human-certified non-inferiority.

## Dead Ends

- No user-value benchmark or deterministic prose baseline exists in the package; the value claim is therefore a contract-grounded hypothesis, not a measured ROI.

## Edge Cases

- The supplied DeepSeek smoke is an anecdote, not a benchmark statistic; iterations 1-2 established its reproducibility gap.

## Sources Consulted

- [SOURCE: .opencode/skills/sk-communication/SKILL.md:33-40,117-160]
- [SOURCE: packages/cli-communication-projection/docs/privacy.md:1-32]
- [SOURCE: packages/cli-communication-projection/docs/configuration.md:1-15]
- [SOURCE: packages/cli-communication-projection/docs/runbook.md:3-29]
- [SOURCE: packages/cli-communication-projection/docs/support-matrix.md:19-26]
- [SOURCE: packages/cli-communication-projection/docs/rollback.md:1-37]
- [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:28-38]
- [SOURCE: packages/cli-communication-projection/src/clients/types.ts:101-105]
- [SOURCE: packages/cli-communication-projection/src/contracts/event.ts:52-87]

## Assessment

- New information ratio: 0.70
- Novelty justification: converting the privacy/consent, human-evidence, and rollback contracts into a concrete reversible deterministic-first adoption boundary is a new value framing versus a generic "projection is nice to have".

## Reflection

- What worked: reading the runbook, privacy, configuration, support-matrix, and rollback docs as a set turned value into a gated, reversible decision boundary rather than a vague judgment.
- What did not work: no in-package user-value metric exists, so the value conclusion must remain conditional and explicitly unmeasured.
- What I would do differently: the next concrete step is a fixed-corpus comparison of deterministic skeleton, whole-message projection, and hybrid slot projection on multi-sentence warnings/recovery messages.

## Recommended Next Focus

Phase synthesis: reconcile all five iterations into `research.md` and `resource-map.md`, preserving the open quality-efficacy question and the conditional deterministic-first value recommendation.
