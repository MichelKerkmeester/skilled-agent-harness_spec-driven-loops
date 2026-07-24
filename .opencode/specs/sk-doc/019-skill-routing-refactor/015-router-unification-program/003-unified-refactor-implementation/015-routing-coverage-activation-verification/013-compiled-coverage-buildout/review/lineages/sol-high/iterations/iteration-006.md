# Iteration 6: Boundary-Matcher Same-Class Sweep

## Dispatcher
- Focus dimension: correctness
- Budget profile: adjudicate
- Scope: bare boundary keywords in hub vocabularies and direct negative probes

## Files Reviewed
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/003-mcp-tooling/lib/router.cjs`
- `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs`
- `.opencode/skills/sk-code/hub-router.json`
- `.opencode/skills/system-deep-loop/hub-router.json`
- `.opencode/skills/sk-doc/hub-router.json`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F005 (refined)**: `sk-doc` compiled matcher over-routes `preview` as `review` — `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:23-29` — Same-class search found bare `review` vocabulary in `sk-code`, `system-deep-loop`, and `sk-doc`. Direct negative probes show `sk-code` and `system-deep-loop` compiled decisions both defer exactly like legacy because their routers implement the shared boundary set. `sk-doc` remains the confirmed active instance because its matcher lacks that guard. [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:28-54] [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs:50-77] [SOURCE: .opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:23-29] [SOURCE: .opencode/skills/sk-code/hub-router.json:49] [SOURCE: .opencode/skills/sk-doc/hub-router.json:37]
  - Finding class: class-of-bug
  - Scope proof: Vocabulary scan plus direct compiled/legacy `preview` probes cover every hub carrying the bare `review` token; only sk-doc diverged.
  - Affected surface hints: sk-doc compiled router, shared keyword matcher, negative parity corpus
  - Recommendation: unchanged; centralize or faithfully copy boundary-aware matching and add negative regression cases.

### P2 Findings
None.

## Traceability Checks
- `spec_code`: fail remains for sk-doc universal byte-identity; the class is now bounded by direct counterexamples on the other relevant hubs.
- `checklist_evidence`: partial; 7-hub corpus parity remains supported, while arbitrary-prompt identity is not.

## Integration Evidence
- `sk-code` compiled and legacy both defer on `preview this code`.
- `system-deep-loop` compiled and legacy both defer on `preview this architecture`.
- `sk-doc` remains route versus defer on `preview this document` from iteration 5.

## Edge Cases
- No relevant hub-router vocabulary contains bare `lcp`, `inp`, or `cls` in the scoped cohort.
- Other substring keywords may be intentionally fuzzy; this pass only adjudicated the exact boundary set owned by legacy.

## Confirmed-Clean Surfaces
- `sk-code` boundary guard mirrors legacy for the reviewed bare token.
- `system-deep-loop` boundary guard mirrors legacy for the reviewed bare token.

## Ruled Out
- Fleet-wide instance of F005: disproved for every other hub carrying bare `review` vocabulary.
- Acronym-containment instance in current hub-router vocabularies: no bare boundary acronyms were found.

## Next Focus
- Dimension: traceability
- Focus area: live verification claims, test counts, resolver parity, and frozen digests
- Reason: stabilize high-value completion evidence after same-class scope refinement
- Rotation status: expansion pass 1 complete
- Blocked/productive carry-forward: F005 stays active but is bounded to sk-doc
- Required evidence: current commands and exact result deltas

Review verdict: CONDITIONAL
