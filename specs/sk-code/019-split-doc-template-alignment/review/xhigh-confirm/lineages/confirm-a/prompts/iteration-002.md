DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 2 Prompt Pack

## STATE

Iteration: 2 of 4. Focus: security. Prior findings: P0=0 P1=0 P2=0. Correctness is complete. Convergence score is telemetry-only before iteration 4 under `stopPolicy=max-iterations`.

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

Read `.opencode/agents/deep-review.md`, the four lineage state files, and `.opencode/skills/sk-code/code-review/references/review_core.md`. Execute exactly one security iteration as the `deep-review` LEAF. Do not dispatch sub-agents or invoke another CLI; the outer `cli-opencode` lineage owns orchestration.

## STATE FILES

- Config: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/iterations/iteration-002.md`
- Delta: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deltas/iter-002.jsonl`

## REVIEW ANGLE

Test the packet's claim that the work was documentation-only with no new capability or executable security impact. Inspect whether structural rewraps changed security semantics, broke warning/good-vs-bad framing, exposed unsafe snippets as recommendations, or made trust-boundary guidance materially misleading. The implementation summary already discloses pre-existing out-of-scope content concerns; adjudicate whether any concern was introduced or made completion-blocking by this packet instead of re-reporting known unrelated content. Every active finding requires direct `file:line` evidence and packet-scope proof.

## WRITE BOUNDARY

The review target is read-only. Write only the iteration narrative, append-only state record, delta, and strategy paths above. Do not write config, registry, dashboard, report, reviewed sources, or any path outside `confirm-a`.

## OUTPUT CONTRACT

Produce all three artifacts and end the narrative with the exact verdict line. Append exactly one `type:"iteration"` record with `dimensions:["security"]`, full route proof, session id `fanout-confirm-a-1783921047347-ky9ry5`, generation 1, lineageMode `new`, and executor `{kind:"cli-opencode",model:"openai/gpt-5.6-sol-fast"}`. The delta's first line must match the canonical state record. For this non-trivial scope, set `reviewDepthSchemaVersion:2` and satisfy the complete v2 contract: `reviewDepthApplicability` with `scopeClass`, `enforcement`, `reason`, `evidenceRefs`; `targetSelection`; `searchCoverage` including `graphCoverageMode`; and cited `searchLedger` rows with one valid disposition link each. Every new P0/P1 requires a typed claim-adjudication packet.
