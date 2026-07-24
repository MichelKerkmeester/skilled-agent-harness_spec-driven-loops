# Iteration 2: Cutover Action Semantics

## Dispatcher
- Focus dimension: correctness
- Budget profile: verify
- Scope: parity harness, cutover playbook gate, tests, and representative router producers

## Files Reviewed
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-cutover-luna.test.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs`

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F002**: Cutover gate false-passes compiled `clarify` and `reject` decisions — `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs:207-210` — The gate labels any decision whose action is not `route` as `compiled-defers-to-legacy` and returns PASS. Compiled routers actually emit `clarify` and `reject`; those are terminal decisions, not legacy fallback. A compiled reject or clarify that disagrees with a legacy route therefore bypasses intent comparison and false-passes the cutover gate. The test suite covers only explicit `defer`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs:207-217] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-cutover-luna.test.cjs:62-70] [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:40-66] [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:140-153]
  - Finding class: class-of-bug
  - Scope proof: Exact search found `clarify`/`reject` producers across multiple hub routers, while the cutover test has one non-route case and it is `defer` only.
  - Affected surface hints: cutover playbook executor, cli-external-orchestration router, sk-doc router, all clarify-capable hubs
  - Recommendation: pass only `action === 'defer'` as fallback; compare `clarify` and `reject` against the normalized legacy action/projection and add negative tests for both.

```json
{"findingId":"F002","claim":"The cutover gate incorrectly treats compiled clarify and reject outcomes as legacy fallback and can report PASS for a real action mismatch.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs:207-217",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-cutover-luna.test.cjs:62-70",".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:40-66",".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:140-153"],"counterevidenceSought":"Searched cutover-gate tests for clarify/reject handling and reviewed the parity harness's normalized action comparison; only defer is tested in the cutover executor, while the parity harness correctly preserves non-route action identity.","alternativeExplanation":"The executor may have been authored when defer was the only non-route outcome, but current routers demonstrably emit clarify and reject.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade only if the executor is proven unreachable for every router capable of clarify/reject or those actions are normalized to defer before this function.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Confirmed producer-consumer action mismatch"}]}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: partial; the primary parity harness distinguishes actions correctly, but the cutover playbook executor does not.
- `checklist_evidence`: not executed in this iteration.

## Integration Evidence
- Multiple production routers emit `clarify`; cli-external-orchestration also emits `reject`.
- The primary parity harness compares `action`, `selectionKind`, and ordered targets, so this defect is isolated to the cutover playbook executor.

## Edge Cases
- `defer` remains a valid legacy-fallback PASS.
- `clarify` and `reject` need explicit action parity.
- A non-route decision with unexpected intents is also currently accepted because the broad branch short-circuits before comparison.

## Confirmed-Clean Surfaces
- The primary `compiledParity()` path preserves and compares non-route action identity.
- Adversarial tests prove route misroutes and compiled leaf gaps still drift.

## Ruled Out
- SD-015 exemption leaking into served routes: directly covered by a negative twin test. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:502-534]
- `selectionKind` actor/evidence tie classification drift: focused tests cover one-actor and multi-actor shapes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:593-647]

## Next Focus
- Dimension: security
- Focus area: path containment, environment controls, fail-safe routing, and manifest trust boundaries
- Reason: correctness now has two confirmed findings; rotate to the next required dimension
- Rotation status: correctness covered, security next
- Blocked/productive carry-forward: primary parity harness is productive; cutover non-route branch remains active
- Required evidence: resolver, manifest path controls, and environment-state tests

Review verdict: CONDITIONAL
