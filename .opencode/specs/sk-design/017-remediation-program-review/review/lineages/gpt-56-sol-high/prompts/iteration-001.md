DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 1 Prompt Pack

## State

Iteration: 1 of 10. Stop policy is max-iterations; convergence is telemetry only before iteration 10.
Dimension: correctness.
Prior findings: P0=0 P1=0 P2=0.
Review target: `.opencode/specs/sk-design/017-remediation-program-review`.
Review scope: the 118 unique existing files in `.opencode/specs/sk-design/017-remediation-program-review/goal-file-manifest.txt`, at pinned HEAD `7b9d3b6b71` and range `5772e0bfd3..7b9d3b6b71`.
Focus: inventory and behavioral invariants across the interface-command rewrite, styles-library restructure, and persistent-database activation. Sample all three packets and identify the highest-risk correctness producers/consumers for later passes.

## Required Setup Bindings

Emit these canonical lines before any state read or workflow output:

```text
BINDING: target=.opencode/specs/sk-design/017-remediation-program-review
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=.opencode/specs/sk-design/017-remediation-program-review
```

## State Files

- Config: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-config.json`
- State log: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-state.jsonl`
- Registry: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-strategy.md`
- Narrative output: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/iterations/iteration-001.md`
- Delta output: `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deltas/iter-001.jsonl`

## Constraints

- Execute exactly one LEAF review iteration. Do not dispatch sub-agents.
- Load `.opencode/skills/sk-code/code-review/references/review-core.md` before severity calls.
- Reviewed target files are read-only. Do not implement fixes.
- Write only the narrative, append-only state log, delta, and strategy paths listed above.
- Every finding requires concrete manifest-scoped `file:line` evidence, finding class, scope proof, affected-surface hints, and content hash in JSONL.
- Every new P0/P1 requires a typed claim-adjudication packet.
- The narrative absolute final line must be exactly `Review verdict: PASS`, `Review verdict: CONDITIONAL`, or `Review verdict: FAIL`.
- The state append must use `type: "iteration"`, iteration `1`, the required route proof, session id `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation `1`, lineage mode `new`, and all required fields.
- The delta first line must match the canonical iteration state record.
- Code Graph is unavailable; use direct reads, exact searches, Git comparisons, and executable checks as appropriate.
- Bundle contents and concurrent system-deep-loop work are out of scope.

## Allowed Write Paths

- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/iterations/iteration-001.md`
- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-state.jsonl` (append only)
- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deltas/iter-001.jsonl`
- `.opencode/specs/sk-design/017-remediation-program-review/review/lineages/gpt-56-sol-high/deep-review-strategy.md`

## Banned Operations

Do not delete, rename, truncate, stage, commit, or modify any other path. If a would-be action exceeds this boundary, record a scope violation instead of executing it.
