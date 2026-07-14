DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 1 Prompt Pack

## STATE

Iteration: 1 of 4. Focus: correctness. Prior findings: P0=0 P1=0 P2=0. Dimension coverage: 0/4. Convergence is telemetry-only before iteration 4 because `stopPolicy=max-iterations`.

Review Target: `.opencode/specs/sk-code/019-split-doc-template-alignment`

Review Scope:
- `.opencode/specs/sk-code/019-split-doc-template-alignment/*.md`
- `.opencode/skills/sk-code/code-opencode/{references,assets}/**/*.md`
- `.opencode/skills/sk-code/code-webflow/{references,assets}/**/*.md`
- `.opencode/skills/sk-code/code-quality/{references,assets}/**/*.md`

## REQUIRED BINDINGS

Emit these exact lines before review work:

BINDING: target=.opencode/specs/sk-code/019-split-doc-template-alignment
BINDING: maxIterations=4
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=.opencode/specs/sk-code/019-split-doc-template-alignment

## SHARED DOCTRINE

Read `.opencode/agents/deep-review.md` and `.opencode/skills/sk-code/code-review/references/review_core.md`. Execute exactly one correctness iteration as the `deep-review` LEAF. Do not dispatch sub-agents or invoke another CLI. The outer `cli-opencode` fan-out lineage already owns orchestration.

## STATE FILES

- Config: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-config.json`
- State Log: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deep-review-strategy.md`
- Iteration narrative: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/iterations/iteration-001.md`
- Delta: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/deltas/iter-001.jsonl`

## REVIEW ANGLE

Verify current structural and behavioral completion claims against representative and known-risk files. Check whether the documented 163-file conformance, overview ordering, frontmatter/version shape, snake_case names, and preservation/link claims remain correct. Use deterministic searches/checks where useful, but every finding must cite direct `file:line` evidence. Distinguish pre-existing out-of-scope content from packet-authored conformance defects.

## WRITE BOUNDARY

The review target is read-only. The ONLY writable paths are the iteration narrative, state-log append, delta, and strategy paths above. Do not write config, registry, dashboard, report, source files, command files, skills, agents, or any path outside `confirm-a`.

## OUTPUT CONTRACT

Produce all three required artifacts. The narrative must end with exactly one final line: `Review verdict: PASS`, `Review verdict: CONDITIONAL`, or `Review verdict: FAIL`. Append exactly one canonical `type:"iteration"` JSONL record with complete route proof, finding details, traceability checks, session id `fanout-confirm-a-1783921047347-ky9ry5`, generation 1, lineageMode `new`, and executor `{kind:"cli-opencode",model:"openai/gpt-5.6-sol-fast"}`. The delta's first line must be the same iteration record. Include review-depth v2 search ledger data for this non-trivial scope. Every new P0/P1 needs a typed claim-adjudication packet in the narrative and structured finding detail.
