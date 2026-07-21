DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 6 Prompt Pack

## State

Iteration 6/10, forced max-iterations. All dimensions have initial coverage; active P0=0 P1=5 P2=0. Iteration 5 found no new issues and consumer path closure was clean.
Dimension: security, second-pass integration.
Scope: validated 118-file manifest for `.opencode/specs/sk-design/017-remediation-program-review`, pinned HEAD `7b9d3b6b71`.
Focus: error propagation and trust-boundary closure across `style-library.mjs`, `persistent-adapter.mjs`, database retrieval/operator code, md-generator `study-prepare.ts` child-process handling, and the four corpus fallback classifiers. Test malformed output, nonzero child exit, sync/async adapter failures, stale-generation responses, path escape, and fallback classification. Do not retry the publication-digest finding unless new counterevidence changes it.

## Required Bindings

Emit six canonical BINDING lines before state reads: exact target/specFolder, maxIterations=10, convergence=0.1, mode review, all dimensions.

## State And Outputs

Read config/state/registry/strategy under the lineage root. Write only `iterations/iteration-006.md`, append state, `deltas/iter-006.jsonl`, and update strategy.

## Constraints

- One LEAF iteration; no subagents; no fixes; reviewed files read-only. Load review-core.
- Strict manifest scope. Code Graph unavailable; direct reads/searches and focused adversarial tests only. Do not use Python.
- Findings require file:line, full schema, hash, scope proof, affected surfaces; new P0/P1 require complete typed adjudication with findingId.
- Canonical iteration 6 route proof, session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new; matching delta first record; exact final verdict line.
- Treat convergence as telemetry and choose a distinct traceability/evidence angle for iteration 7.

## Allowed Write Paths

Only the four lineage-local outputs above.

## Banned Operations

No delete, rename, truncate, stage, commit, or write elsewhere. Record/contain scope violations.
