DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 7 Prompt Pack

## State

Iteration 7/10; max-iterations forced. Active P0=0 P1=6 P2=0. The latest claim-adjudication gate failed only because `P1-006` used string confidence instead of a number.
Dimension: traceability, second-pass evidence quality.
Frozen target: `.opencode/specs/sk-design/017-remediation-program-review`, validated 118-file manifest, HEAD `7b9d3b6b71`.
Focus: map every active P1 to executable assertions or explicit missing/blocked coverage. Audit whether reported green test counts actually exercise each claim, especially production digest binding, stale-generation requery semantics, operational docs, parent status, and generated metadata. Distinguish missing tests from tests blocked by absent md-generator dependencies. Re-read `P1-006` and emit a stable-ID refinement with the same hash and a complete typed adjudication whose confidence is a numeric value in `[0,1]`.

## Required Bindings

Emit canonical six BINDING lines before state reads for exact target/specFolder, maxIterations 10, convergence 0.1, mode review, and all dimensions.

## State And Outputs

Use lineage config/state/registry/strategy. Write only `iterations/iteration-007.md`, append state, `deltas/iter-007.jsonl`, and update strategy.

## Constraints

- Exactly one LEAF iteration; no subagents; no remediation; target read-only. Load review-core.
- Strict manifest scope. Code Graph unavailable. Use direct assertion reads, exact searches, and focused test execution. Do not use Python.
- Re-emit `P1-006` as refined with stable content hash and complete typed packet: findingId, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, numeric confidence, downgradeTrigger.
- New findings require full schema/hash and complete typed packets for P0/P1.
- Canonical iteration 7 route proof; session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new; matching delta/state record and exact final verdict.
- Continue after telemetry convergence; select a distinct maintainability or parity angle for iteration 8.

## Allowed Write Paths

Only the four named lineage-local artifacts.

## Banned Operations

No delete, rename, truncation, staging, commit, or write outside those paths. Record and contain violations.
