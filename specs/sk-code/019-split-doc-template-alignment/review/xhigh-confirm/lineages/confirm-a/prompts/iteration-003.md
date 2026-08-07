DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 3 Prompt Pack

## STATE

Iteration: 3 of 4. Focus: traceability. Active findings: P0=0 P1=0 P2=1 (`P2-001`, security framing). Completed dimensions: correctness, security. Convergence remains telemetry-only until iteration 4 under `stopPolicy=max-iterations`.

Review Target: `.opencode/specs/sk-code/019-split-doc-template-alignment`

Review Scope:
- `.opencode/specs/sk-code/019-split-doc-template-alignment/*.md`
- `.opencode/skills/sk-code/code-opencode/{references,assets}/**/*.md`
- `.opencode/skills/sk-code/code-webflow/{references,assets}/**/*.md`
- `.opencode/skills/sk-code/code-quality/{references,assets}/**/*.md`

## REQUIRED BINDINGS

BINDING: target=.opencode/specs/sk-code/019-split-doc-template-alignment
BINDING: maxIterations=4
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=.opencode/specs/sk-code/019-split-doc-template-alignment

## SHARED DOCTRINE

Read `.opencode/agents/deep-review.md`, all four lineage state files, prior iteration artifacts, and `.opencode/skills/sk-code/code-review/references/review_core.md`. Execute exactly one traceability iteration as the `deep-review` LEAF. Do not dispatch sub-agents or invoke another CLI.

## STATE FILES

- Config: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/iterations/iteration-003.md`
- Delta: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deltas/iter-003.jsonl`

## REVIEW ANGLE

Execute the hard `spec_code` and `checklist_evidence` protocols. Reconcile R1-R5, all checked task/checklist completion claims, the implementation summary, and the current 163-file corpus. Distinguish current-state proof from historical provenance that cannot be replayed. Inspect whether the summary's Post-Completion Follow-Up still describes issues that the current files show as fixed, and whether any inconsistent completion or verification wording is actionable. Revisit `P2-001` only for cross-dimension dedup/refinement, not as a new finding.

## WRITE BOUNDARY

The review target is read-only. Write only the iteration narrative, append-only state record, delta, and strategy paths above. Do not write config, registry, dashboard, report, reviewed sources, or outside `confirm-a`.

## OUTPUT CONTRACT

Produce all three artifacts and end the narrative with the exact verdict line. Append exactly one `type:"iteration"` record with `dimensions:["traceability"]`, complete route proof, cumulative finding counts, session id `fanout-confirm-a-1783921047347-ky9ry5`, generation 1, lineageMode `new`, and executor `{kind:"cli-opencode",model:"openai/gpt-5.6-sol-fast"}`. The delta's first line must match. Set `reviewDepthSchemaVersion:2` and satisfy the complete v2 applicability, target-selection, search-coverage, graphless-fallback ledger, and disposition-link contract. Every new P0/P1 requires the typed claim-adjudication packet in both narrative and structured details.
