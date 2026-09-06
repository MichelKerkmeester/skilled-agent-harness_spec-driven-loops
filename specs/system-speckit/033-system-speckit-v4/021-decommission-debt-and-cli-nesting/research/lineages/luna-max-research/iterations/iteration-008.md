# Iteration 8: Gate integrity and false-green outcomes

## Focus

Inspect validation, freshness, generated-metadata, continuity, completion, and
routing guard contracts for outcomes that look green while the decommission
remains incomplete. This is source-only research; no validator or writeback tool
was executed.

## Findings

1. **LUNA-033 — Dist-freshness checker errors can be silently treated as success by `validate.sh`. P1. CONFIRMED error-path defect; practical false-green impact inferred.** `validate.sh` treats exit 69 as stale and any other nonzero freshness exit as a warning before invoking the compiled orchestrator. The freshness checker has a distinct `status: 'error'` result for missing watched source paths, no watched sources, and checker failures, but its CLI exits 69 only when `result.stale` is true and otherwise exits 0. Therefore a freshness error can produce exit 0, no warning in `validate.sh`, and allow the compiled validator to report a normal result. The exact stale-versus-error runtime sequence requires a provisioned checkout and a matching failure condition, so the policy defect is confirmed while the false-green consequence is inferred. Smallest fix: make the freshness CLI return a dedicated nonzero code for `status: 'error'`, and make `validate.sh` stop with a system-error result rather than continue on that code. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:275-299] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-626,675-689,894-946] [INFERENCE: an error result that exits 0 is invisible to the caller and can leave a stale-but-runnable compiled gate as the apparent authority]

2. **LUNA-034 — Generated `status: complete` can pass strict validation while completion evidence disagrees. P1. CONFIRMED.** The status/completion consistency capability defaults to report mode because of a known backlog; the integrity resolver keeps `STATUS_COMPLETE_EVIDENCE_MISMATCH` nonblocking unless `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` is explicitly enabled. The orchestrator's final verdict counts only `error` entries, so an `info` mismatch does not change `passed: true`, including under `--strict`. A generated packet can consequently claim complete while its `implementation-summary.md` is below 100% or `tasks.md` has unchecked items. Smallest fix: enforce the consistency rule for decommission packets (or graduate the default globally) and require an explicit waiver for known legacy folders. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:176-201] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:202-264,377-394] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:917-933]

3. **LUNA-035 — Continuity freshness is opt-in and treats absent evidence as a passing skip. P1. CONFIRMED.** The CLI runs the continuity rule only when `SPECKIT_COMPLETION_FRESHNESS` is truthy. Even when opted in, no completion claim, a missing fingerprint, or a zero placeholder returns `status: pass` with a “skipped” code, and missing implementation-summary/frontmatter/graph timestamps also return pass-style skip results. Strict mode only escalates `warn`; it cannot distinguish these skips from a fresh pass. Thus completion orchestration can have no continuity freshness proof while receiving a successful status. Smallest fix: represent not-applicable/skipped as a distinct non-success outcome and make completion claims require a usable fingerprint plus the relevant packet timestamps, or explicitly record a bounded legacy waiver. [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:88-93,296-316,350-409,537-555]

4. **LUNA-036 — Explicit validation bypasses and missing completion sections return zero, indistinguishable from a validated pass to exit-code callers. P2. CONFIRMED operator-contract risk.** `validate.sh` exits 0 when `SPECKIT_SKIP_VALIDATION` is set and also exits 0 for `SPECKIT_VALIDATION=false`. Separately, `check-completion.sh` exits 0 when `tasks.md` lacks the verification anchor, explaining that the folder may be Level 1. These are legitimate opt-out/Level-1 cases when intentionally selected, but a wrapper that checks only process success cannot tell “validated and complete” from “validation skipped/not applicable.” Smallest fix: emit a machine-readable skipped status and require callers that assert completion to reject it unless an explicit, recorded policy waiver is present. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:17-22,114-115] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:438-451]

## Ruled Out

- The mcp-route guard is not treated as a completion gate: its documented contract has only `allow` and `warn`, and its manifest/read errors fail open by design. That is a routing-safety limitation, not evidence that the spec validator claims decommission completion. [SOURCE: .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:219-273]
- Dispatch hard-rule evaluation skips unknown checks and treats thrown checks as passed, but it protects command dispatch rather than producing the spec packet's completion verdict. This pass does not promote that separate fail-open contract into a decommission finding. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:119-161]
- Generated metadata integrity and synopsis drift are not globally grandfathered by default: the capability flags document enforcement as the default for the integrity and drift gates; the finding is limited to the separately default-off status/completion consistency rule and opt-in continuity rule. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:62-115]

## Dead Ends

- No validator, freshness CLI, completion script, or writeback command was executed. The user-bound lineage forbids those writes; all claims here are derived from source contracts and control flow.

## Edge Cases

- The dist-freshness error path may be rare in a fully provisioned checkout; it remains load-bearing because `validate.sh` delegates freshness authority to that exit code.
- A packet with no generated metadata is intentionally not scored by the metadata integrity rule, so this iteration does not claim that authored-only packets are falsely validated by that rule. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:308-341]
- An explicit validation skip can be correct for a diagnostic or Level-1 packet. The risk is the zero exit code crossing a caller boundary without a skipped-state marker.

## Questions Remaining

- Q7 is partially answered: the dist-freshness error exit, status/completion report mode, and continuity opt-in/skipped states can hide incomplete work; explicit route/dispatch fail-open behavior is outside the completion verdict.
- Q1-Q6 remain open at the package/debt level. Next focus: deferred validator, doctor, local-database, and migration debt from the 052 landing log.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:17-22,114-115,275-299]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-626,675-689,894-946]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/config/capability-flags.ts:62-115,176-201]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts:202-264,308-405]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:917-933]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:88-93,296-316,350-409,537-555]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:438-451]
- [SOURCE: .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:219-273]
- [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:119-161]

## Assessment

- New information ratio: 0.79
- Questions addressed: Q7 gate integrity and false-green outcomes
- Questions answered: Q7 = partial; one confirmed exit-code defect, one confirmed nonblocking status mismatch, one confirmed opt-in/skipped continuity contract, and one confirmed indistinguishable bypass contract.
- Confidence: high for all four source-control-flow findings; medium for the real-world frequency of the dist-freshness false-green sequence.

## Reflection

- What worked and why: comparing result-status construction with the outer CLI exit conditions exposed a concrete error path that a normal stale-only review would miss.
- What did not work and why: the route and dispatch guards are intentionally fail-open and do not own completion status, so their behavior could not be promoted into a decommission finding without inventing a caller contract.
- What I would do differently: next, trace the deferred 052 debts to live validator/doctor/local-database callers and check whether their current owners have an enforced closure path.

## Recommended Next Focus

Angle 1/2 follow-up: deferred validator-class defects, machine-local SQLite doctor behavior, old database backup/restore surfaces, and migration debt recorded in the 052 landing log.
