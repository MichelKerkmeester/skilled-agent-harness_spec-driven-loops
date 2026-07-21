DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 3 Prompt Pack

## State

Iteration: 3 of 10. `stopPolicy=max-iterations`; convergence is telemetry before 10.
Dimension: traceability.
Active findings: P0=0 P1=1 P2=0. Security finding `P1-001` remains active. Its prior adjudication packet omitted `findingId`, so the latest claim-adjudication event is failed.
Review target: `.opencode/specs/sk-design/017-remediation-program-review`; scope is its validated 118-entry manifest at pinned HEAD `7b9d3b6b71`.
Focus: full `spec_code` and `checklist_evidence` replay across packet 012/008 and packets 015/001/005/006 plus the 015 parent. Verify shipped-vs-deferred status, human-gated items, reported test counts, and evidence behind the publication/parity claims. Also re-read `P1-001` evidence and emit it as a refinement with a complete typed adjudication packet containing `findingId: "P1-001"` so the gate can recover.

## Required Setup Bindings

Emit the six canonical BINDING lines before state reads: target, maxIterations=10, convergence=0.1, mode=review, dimensions=correctness,security,traceability,maintainability, and the exact specFolder.

## State And Outputs

- Config: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-config.json`
- State: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-strategy.md`
- Narrative: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/iterations/iteration-003.md`
- Delta: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deltas/iter-003.jsonl`

## Constraints

- One LEAF iteration only; no Task/subagents; no fixes. Load review-core doctrine.
- Read state first. Review target is read-only. Write only narrative, state append, delta, and strategy.
- Execute both core protocols with structured status/results and file:line evidence. Applicable overlay `playbook_capability` must run or be explicitly partial/blocked; `feature_catalog_code` is N/A.
- Re-emit `P1-001` as a refinement, not a duplicate, with complete finding schema and typed adjudication fields including `findingId`, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
- Every new finding needs full schema and content hash; every new P0/P1 needs complete typed adjudication.
- Canonical iteration 3 route proof, session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new. Delta first record must match state.
- Narrative final line must exactly follow the verdict contract.
- Code Graph unavailable: use direct reads, exact searches, pinned Git evidence, and tests.
- Do not inspect bundle contents or concurrent system-deep-loop work.

## Allowed Write Paths

Only iteration-003.md, the append-only lineage state, iter-003.jsonl, and the lineage strategy listed above.

## Banned Operations

No deletion, rename, truncation, staging, commit, or any write outside those four paths. Record scope violations instead.
