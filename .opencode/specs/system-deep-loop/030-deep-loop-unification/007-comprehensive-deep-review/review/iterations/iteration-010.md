# Iteration 010: Deep-Review Correctness

## Dimension

- Dimension: correctness
- Focus: `deep-review` packet self-consistency, convergence math, reducer correctness, and prompt-pack template correctness.
- Target: `.opencode/skills/system-deep-loop/deep-review/`

## Files Reviewed

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:2`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:3`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:364`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json:44`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:161`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:199`
- `.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md:179`
- `.opencode/skills/system-deep-loop/deep-review/references/state/state_format.md:231`
- `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:223`
- `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:234`
- `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:247`
- `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:1041`
- `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:1337`
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:81`
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:107`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`

Sampled: requested protocol/state/convergence docs, reducer code, prompt-pack template, this live review's config/state/strategy/registry, and shared review severity doctrine. Skipped: the remaining packet-local README/changelog/feature-catalog/playbook files and most of the 147-file packet because this pass was scoped to correctness self-consistency and reducer/template contracts.

## Findings by Severity

### P0

- None.

### P1

- None.

### P2

- **DR-010-P2-001**: Reducer warns on valid `findingsNew` arrays. The prompt-pack contract requires the canonical iteration record to use `"findingsNew":[]` and even shows append examples with an array, but `validateReviewRecordFields()` applies the same severity-bucket object validation to `findingsNew` that it applies to `findingsSummary`. The live registry already contains one warning for every prior valid iteration record with `findingsNew` as an array, so valid loop output is surfaced as schema drift. Evidence: `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:81`, `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:107`, `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:1337`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:364`. Recommendation: validate `findingsNew` as an array, or update the prompt/template/schema together if the intended live contract is severity buckets.
- **DR-010-P2-002**: Persisted `graph_convergence` events do not carry the signal payload needed to replay the documented convergence math. The convergence docs define rolling-average, MAD, and dimension-coverage formulas, and the reducer computes `graphConvergenceScore` from `latest.signals`. This live run's `graph_convergence` rows contain only decision metadata, so the registry can only show `graphConvergenceScore: 0` while still showing `graphDecision: CONTINUE`. That makes the graph convergence score non-replayable from the same event stream that claims the decision. Evidence: `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:223`, `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:234`, `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:247`, `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:1041`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:3`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:329`. Recommendation: either persist the convergence signal bundle on each `graph_convergence` event or document that graph events are decision-only and remove the misleading score rollup.

## Traceability Checks

| Check | Status | Evidence | Notes |
|---|---|---|---|
| Self-consistency: documented state vs live state | partial | `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:81`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:2` | The prompt contract and live prompt shape match on `findingsNew` arrays; the reducer's validator disagrees. |
| Convergence math replay | partial | `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md:223`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:3` | Formulas are documented, but live `graph_convergence` events omit the signal payload needed to verify them from state. |
| Reducer correctness | fail-advisory | `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:1337` | Confirmed a false-positive schema-warning bug; P2 because it currently pollutes warnings rather than stopping the loop. |
| Prompt-pack template correctness | pass-with-advisory | `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:1`, `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:57` | The rendered prompt received this session preserves the same route header, LEAF constraint, allowed-write list, and three-artifact contract, with hand-driven additions for this specific iteration. |

## Verdict

PASS with P2 advisories. No P0/P1 correctness issue was confirmed in this pass. The two new findings are reducer/telemetry correctness issues that should be fixed before relying on warnings or graph-convergence scores for automated stop decisions.

## Next Dimension

Iteration 11 should continue the `deep-review` packet with security. Focus on artifact-root/path containment, reducer write surfaces, shell/script boundaries, no-WebFetch claims, and whether the packet's tool/write allowances can escape the review packet.

Review verdict: PASS
