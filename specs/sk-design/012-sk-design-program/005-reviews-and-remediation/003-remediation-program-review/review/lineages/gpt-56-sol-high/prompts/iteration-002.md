DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 2 Prompt Pack

## State

Iteration: 2 of 10. Stop policy is max-iterations; convergence is telemetry only before iteration 10.
Dimension: security.
Prior findings: P0=0 P1=0 P2=0. Correctness inventory is covered.
Review target: `.opencode/specs/sk-design/017-remediation-program-review`.
Review scope: the validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`.
Focus: persistent publication pointers and flat-artifact hydration trust boundaries. Trace pointer parsing/open behavior, symlink and containment handling, generation/digest binding, cutover/rollback inputs, missing-generation failure, and relevant adversarial tests. Seek counterevidence before severity calls.

## Required Setup Bindings

Before any state read, emit:
`BINDING: target=.opencode/specs/sk-design/017-remediation-program-review`
`BINDING: maxIterations=10`
`BINDING: convergence=0.1`
`BINDING: mode=review`
`BINDING: dimensions=correctness,security,traceability,maintainability`
`BINDING: specFolder=.opencode/specs/sk-design/017-remediation-program-review`

## State Files

- Config: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-config.json`
- State: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-strategy.md`
- Narrative: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/iterations/iteration-002.md`
- Delta: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deltas/iter-002.jsonl`

## Constraints

- Execute exactly one LEAF iteration; never dispatch sub-agents or implement fixes.
- Load review-core doctrine. Read state before review. Target files are read-only.
- Only narrative, state append, delta, and strategy are writable.
- Cite manifest-scoped `file:line` evidence. Include complete finding schema/content hash and typed adjudication for new P0/P1.
- Use canonical route proof, session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage `new`, iteration 2.
- Delta first line must match the canonical state append. Narrative final line must be the exact verdict contract.
- Code Graph unavailable: direct reads, exact searches, pinned diffs, and tests are the required fallback.
- Do not inspect bundle contents or concurrent system-deep-loop work.

## Allowed Write Paths

- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/iterations/iteration-002.md`
- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-state.jsonl` append only
- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deltas/iter-002.jsonl`
- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-strategy.md`

## Banned Operations

No deletion, rename, truncation, staging, commit, or write outside the four paths above. Record a scope violation instead.
