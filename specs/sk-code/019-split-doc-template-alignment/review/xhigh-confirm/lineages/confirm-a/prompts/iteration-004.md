DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 4 Prompt Pack

## STATE

Iteration: 4 of 4. Focus: maintainability and stabilization. Active findings: P0=0 P1=0 P2=3 (`P2-001` framing, `P2-002` stale follow-up, `P2-003` evidence replay). Completed dimensions: correctness, security, traceability. This is the required max-iteration terminal pass.

Review Target: `.opencode/specs/sk-code/019-split-doc-template-alignment`

Allowed read roots only:
- `.opencode/specs/sk-code/019-split-doc-template-alignment`
- `.opencode/skills/sk-code/code-opencode/references`
- `.opencode/skills/sk-code/code-opencode/assets`
- `.opencode/skills/sk-code/code-webflow/references`
- `.opencode/skills/sk-code/code-webflow/assets`
- `.opencode/skills/sk-code/code-quality/references`
- `.opencode/skills/sk-code/code-quality/assets`

## REQUIRED BINDINGS

BINDING: target=.opencode/specs/sk-code/019-split-doc-template-alignment
BINDING: maxIterations=4
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=.opencode/specs/sk-code/019-split-doc-template-alignment

## SHARED DOCTRINE

Read `.opencode/agents/deep-review.md`, all lineage state, registry, strategy, prior iteration artifacts, and `.opencode/skills/sk-code/code-review/references/review_core.md`. Execute exactly one maintainability/stabilization iteration as the `deep-review` LEAF. Do not dispatch sub-agents or invoke another CLI. Never search from a broader root than the explicit allowed roots above.

## STATE FILES

- Config: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/iterations/iteration-004.md`
- Delta: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deltas/iter-004.jsonl`

## REVIEW ANGLE

Assess safe follow-on change cost, clarity, ownership, repeated maintenance burdens, cross-resource consistency, and whether the template-aligned structure is mechanically supportable. Revisit the three active P2 findings for deduplication, refinement, or counterevidence; do not re-emit them as new. Do not retry the exhausted historical pre-change baseline. Instead, classify that limitation honestly and determine whether current documents provide enough durable ownership and verification guidance for future maintainers. Perform a stabilization search for any overlooked P0/P1 class within the maintainability scope.

## WRITE BOUNDARY

The target is read-only. Write only the iteration narrative, append-only state record, delta, and strategy. Do not write config, registry, dashboard, report, reviewed sources, or outside `confirm-a`.

## OUTPUT CONTRACT

Produce all three artifacts and end the narrative with the exact verdict line. Append exactly one `type:"iteration"` record with `dimensions:["maintainability"]`, complete route proof, cumulative counts, session id `fanout-confirm-a-1783921047347-ky9ry5`, generation 1, lineageMode `new`, and executor `{kind:"cli-opencode",model:"openai/gpt-5.6-sol-fast"}`. The delta's first line must match. Set `reviewDepthSchemaVersion:2` and satisfy the full v2 contract, including cited graphless-fallback rows and explicit handling of existing search debt. Every new P0/P1 requires a typed claim-adjudication packet. Because this is iteration 4, set Next Focus to synthesis/adversarial replay rather than a fifth review iteration.
