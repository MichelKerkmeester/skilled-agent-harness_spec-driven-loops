# Iteration 17: Validation bridge exit semantics

## Focus

Trace a strict-only freshness rule from its CLI exit behavior through the
validator registry bridge and the aggregate orchestrator verdict. This pass is
limited to a new false-green path and does not repeat the already recorded
opt-in, report-mode, or missing-artifact freshness findings.

## Findings

1. **LUNA-056 — The validation orchestrator discards a node rule's nonzero exit code, so strict continuity freshness can produce an overall pass. P1. CONFIRMED false-green path; CI/completion impact is INFERRED from consumers of the aggregate report.** The registry marks `CONTINUITY_FRESHNESS` as a strict-only error rule. Its CLI emits a `status\twarn` record for stale continuity when enforcement is not enabled, then exits 1 when invoked with `--strict`. The orchestrator's `runRegistryNodeRule` checks only `result.error` and whether stdout is empty; it parses the stdout status and never checks `result.status`. A strict stale result is therefore mapped to an ordinary warning entry, and the aggregate `passed` field is computed from `summary.errors === 0`, allowing the report to say passed even though the node rule exited nonzero. Smallest fix: treat a nonzero node-rule exit as an error unless the emitted status is an explicitly allowed nonblocking result, or map strict `warn` to `error` before computing `passed`. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:356-363] [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:536-558] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-314] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:917-933] [INFERENCE: a caller relying on the aggregate `passed` field can accept stale continuity during strict validation; no validation command was run]

## Ruled Out

- The strict-pass-freshness scheduled workflow is explicitly documented as report-only and its own process exits nonzero for regressions/new failures/errors. It was not promoted as an active merge-gate failure in this iteration. [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3-11,62-69,87-101] [SOURCE: .opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts:301-329]
- The shell-rule bridge already rejects a nonzero shell child status before parsing its output; this finding is specific to the node-rule bridge. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:316-348]

## Dead Ends

- No new metadata schema or generated-file finding was promoted; the same node bridge contract is the relevant seam for those rules, but this finding is grounded in the continuity freshness exit path.

## Edge Cases

- A nonzero node exit with a valid warning payload may be intentional for a report-mode rule. The bridge still needs an explicit policy because strict mode is the caller's request to make warnings blocking, while the current aggregate only counts errors.
- An uncaught node-rule failure with no stdout is already surfaced as a bridge error; the gap is a nonzero exit accompanied by parseable warning output.

## Questions Remaining

- Q7 gains a confirmed strict validation bridge false-green path.
- Q1 and Q6 remain open for live residue and successor coverage.
- Q2-Q5 remain open for registrations, dependencies, tests, and documentation drift.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:356-363]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:291-347,536-558]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:286-314,316-348,917-933]
- [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3-11,62-101]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts:301-329]

## Assessment

- New information ratio: 0.91
- Questions addressed: Q7
- Questions answered: Q7 = expanded (strict node-rule exit can be masked)
- Confidence: high for the bridge and aggregate behavior; medium for operational impact because no validator run was executed

## Reflection

- What worked and why: following one rule through registry metadata, child process behavior, bridge parsing, and aggregate status exposed the lost exit signal.
- What did not work and why: direct validator execution was out of scope for this detached research run because the user prohibited validation tooling and external writes.
- What I would do differently: inspect the reducer/gateway synthesis contracts next for a similar mismatch between event acceptance and final completion state.

## Recommended Next Focus

Angle 7/lineage integrity: inspect the detached research gateway, projection paths, synthesis compiler, and resource-map handoff for state-path mismatches or success claims that do not cover the full run.
