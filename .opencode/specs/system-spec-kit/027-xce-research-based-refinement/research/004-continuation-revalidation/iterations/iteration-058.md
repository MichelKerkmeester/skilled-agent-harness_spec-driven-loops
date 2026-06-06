# Iteration 058: Semantic Trigger Backfill/Promotion

## Focus
Define safe batching, resume behavior, and promotion metrics for Phase 007 semantic trigger backfill, especially large trigger indexes and shadow telemetry. This iteration treated Phase 007 as a hybrid lexical-first feature that must remain default-off until shadow evidence proves recall gains without false activation.

## Findings
1. Phase 007 already makes the key safety decision: lexical matching remains primary, semantic recall is a feature-flagged fallback, semantic-only hits are source-tagged and reduced-activation, and the master flag defaults off with `shadow|union` modes. The backfill/promotion plan should preserve those controls rather than introduce an alternate live path. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:124]
2. The existing scope puts trigger embedding generation in `memory_index_scan` and save-time best-effort generation, while forbidding synchronous embedding inside `memory_match_triggers`; therefore large-index backfill must be an out-of-band resumable maintenance job with cached-runtime-only lookup. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:112] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:129]
3. Safe batching metrics should be tracked per `(memory_id, phrase_hash, model_id, dimensions)`: scanned memories, eligible trigger phrases, ready/failed/pending counts, cache-hit/cache-miss counts, provider error class, rate-limit count, elapsed time, and high-water cursor. This follows from the derived table primary key and `embedding_status` design. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:106] [INFERENCE: batching fields derived from Phase 007 table key plus `embedding_status` requirements]
4. Resume should be cursor-plus-status based: restart from the last committed memory cursor, skip rows with matching ready `(phrase_hash, model_id, dimensions)`, retry failed/pending rows only within bounded retry policy, and preserve cold-start no-op behavior when embeddings are absent. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:147] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:258]
5. Promotion from shadow to union needs all existing Phase 007 success metrics green: exact lexical precision 1.0, semantic paraphrase recall at threshold 0.84 at least 0.7, distractor false-positive rate at most 0.05, p95 latency within 100ms WARN, zero embed calls in trigger requests, flag-off diff identical, and external/equivalent eval recall lift at least 0.15. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:269] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:285]

## Decisions / Recommendations
- **Keep** the hybrid lexical-first design and default-off `shadow|union` rollout.
- **Revise** Phase 007 to add an explicit backfill job contract: batch size, cursor, retry policy, status counters, and safe interruption semantics.
- **Add** a promotion checklist that requires shadow telemetry stability before `union`: lexical parity, false-positive ceiling, recall lift, latency p95, and zero runtime embed calls.
- **Defer** adaptive per-trigger thresholds until after shadow data exists; Phase 007 already marks adaptive thresholding as data-dependent. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/decision-record.md:163]

## Ruled Out
- Live synchronous embedding during trigger calls: rejected because Phase 007 states the hot path must never generate embeddings and latency budget is tight. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:115]
- Direct semantic replacement of lexical matching: rejected because explicit command triggers are a control surface and false positives affect cognitive activation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:49]

## Dead Ends
- Treating a large trigger-index backfill as a single transaction should not be promoted: it would lack restartability and cannot expose per-batch telemetry. [INFERENCE: based on derived-table status fields and large-index risk]

## Edge Cases
- Ambiguous input: "safe batching/resume/promotion metrics" could mean implementation API or rollout policy; this iteration chose rollout-facing contracts and deferred exact API names.
- Contradictory evidence: none found.
- Missing dependencies: external XCE README was referenced by older specs but not present under `external/` in this workspace; fallback was Phase 007's captured citation and local implementation/planning evidence. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:92]
- Partial success: large-index cardinality could not be measured from a live DB in this iteration, so metrics are contractual rather than empirically sized.

## Sources Consulted
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:47`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/spec.md:106`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:129`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/plan.md:269`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/decision-record.md:163`

## Assessment
- New information ratio: 0.80
- Questions addressed: semantic trigger backfill batching; resume safety; promotion metrics; default-off shadow telemetry.
- Questions answered: safe batching/resume/promotion metrics for Phase 007.

## Reflection
- What worked and why: Phase 007 already had strong safety invariants, so the research could convert them into operational backfill and promotion gates.
- What did not work and why: no live trigger-index cardinality was available, preventing empirical batch-size tuning.
- What I would do differently: run a read-only DB cardinality query in a later implementation packet to set concrete default batch sizes.

## Recommended Next Focus
Use these Phase 007 gates as inputs to the Phase 008 reducer gate review so learned feedback never treats shadow-only semantic matches as live-quality relevance signals.
