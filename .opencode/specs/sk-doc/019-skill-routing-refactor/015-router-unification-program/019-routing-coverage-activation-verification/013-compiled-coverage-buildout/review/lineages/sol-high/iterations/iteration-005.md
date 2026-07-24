# Iteration 5: Duplicated Matcher And Cutover Telemetry Drift

## Dispatcher
- Focus dimension: maintainability
- Budget profile: verify
- Scope: per-hub matcher duplication, legacy boundary behavior, default-on telemetry, and lockstep cohort evidence

## Files Reviewed
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs`
- `.opencode/skills/sk-doc/hub-router.json`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs`
- `.opencode/bin/compiled-routing-foundation.vitest.ts`

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F005**: `sk-doc` compiled matcher over-routes `preview` as `review` — `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:23-29` — The compiled router substring-matches every non-command keyword. `sk-doc`'s quality vocabulary contains bare `review`, while the frozen legacy replay applies a word boundary specifically so `preview` does not match `review`. Direct replay confirms the divergence: compiled routes `"preview this document"` to `create-quality-control`; legacy returns no intents and `deferReason: no-mode-scored`. This disproves byte-identical behavior beyond the finite route-gold corpus. [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:23-29] [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:174-184] [SOURCE: .opencode/skills/sk-doc/hub-router.json:37] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:440-453]
  - Finding class: class-of-bug
  - Scope proof: Exact vocabulary scan found bare `review` in `sk-doc`; direct compiled and legacy executions on the same negative prompt produced route versus defer. The same boundary set is duplicated in some routers but missing in `sk-doc`.
  - Affected surface hints: sk-doc compiled router, shared keyword matching semantics, negative route-gold corpus, per-hub router copies
  - Recommendation: share the legacy boundary-aware keyword matcher or mirror its complete rule in every compiled router; add `preview` and acronym-containment negatives to each affected hub's parity corpus.

```json
{"findingId":"F005","claim":"The default-on sk-doc compiled router routes a prompt containing preview because it substring-matches the bare review keyword, while legacy correctly defers using a word boundary.","evidenceRefs":[".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:23-29",".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:174-184",".opencode/skills/sk-doc/hub-router.json:37",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:440-453"],"counterevidenceSought":"Ran the public compiled front door and frozen legacy replay with the identical prompt 'preview this document'; compiled returned a route to create-quality-control and legacy returned no intents. Searched per-hub routers for the boundary keyword set and found it absent in sk-doc.","alternativeExplanation":"The finite route-gold corpus reports zero drift because it lacks this negative lexical case; that does not reconcile the direct runtime divergence.","finalSeverity":"P1","confidence":1.0,"downgradeTrigger":"Downgrade only after compiled and legacy produce the same action for preview/review boundary negatives and a regression test locks the behavior.","transitions":[{"iteration":5,"from":null,"to":"P1","reason":"Direct compiled-versus-legacy reproduction"}]}
```

### P2 Findings
- **F006**: Benchmark flag telemetry still encodes the pre-cutover cohort — `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:783-806` — `classifyFlagState(undefined)` reports `permitsCompiledWhenEligible: false` and comments that the cohort is empty, while the runtime's default cohort contains seven hubs and unset permits compiled for them. The test locks the stale value. This field is currently report telemetry rather than a gate, so severity is advisory. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:783-806] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:187-205] [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:380-400]
  - Finding class: cross-consumer
  - Scope proof: Exact search found the field emitted into benchmark reports and no decision consumer; runtime permission remains correct.
  - Affected surface hints: compiled parity report, flag-state matrix test, benchmark consumers
  - Recommendation: derive the field from `flagPermitsCompiled(hubId)` or remove the hub-dependent boolean from a hub-agnostic classifier.

## Traceability Checks
- `spec_code`: fail for byte-identical routing as a universal behavior claim; direct negative replay found drift.
- `checklist_evidence`: fail for CHK-010/CHK-030's broad identity wording; the evidence proves corpus parity, not arbitrary-prompt identity.
- `feature_catalog_code`: pass for default-on wording and seven-hub cohort naming.
- `playbook_capability`: partial because the negative lexical class is absent from route-gold coverage.

## Integration Evidence
- Direct compiled command: `SPECKIT_COMPILED_ROUTING=1 node .opencode/bin/compiled-route.cjs --hub sk-doc --prompt "preview this document"` returned a single route to `create-quality-control`.
- Direct legacy replay on the same prompt returned no intents and `deferReason: no-mode-scored`.
- Runtime and advisor cohort copies are guarded equal by `.opencode/bin/compiled-routing-foundation.vitest.ts:71-73`.

## Edge Cases
- Bare `review` inside `preview` is confirmed.
- The legacy boundary set also covers `lcp`, `inp`, and `cls`; duplicated per-hub matchers should be checked for the same containment class.

## Confirmed-Clean Surfaces
- Seven `SKILL.md` directives and both parent templates use consistent default-on and kill-switch wording.
- Runtime and advisor default-on cohorts have an equality test.

## Ruled Out
- Cohort-copy drift today: a dedicated equality test compares runtime and advisor sets.
- The flag telemetry defect changing live routing: exact search found it in reporting/tests only.

## Next Focus
- Dimension: correctness
- Focus area: negative lexical matrix across hubs and router parity beyond route-gold fixtures
- Reason: max-iterations policy requires broader angles after all dimensions are covered
- Rotation status: all four dimensions covered; begin stabilization and adversarial expansion
- Blocked/productive carry-forward: F005 opens a same-class matcher audit; F006 is advisory
- Required evidence: direct negative probes and matcher inventories

Review verdict: CONDITIONAL
