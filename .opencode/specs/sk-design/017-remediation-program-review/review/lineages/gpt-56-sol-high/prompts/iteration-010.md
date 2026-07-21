DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration 10 Prompt Pack

## State

Final forced iteration 10/10. JSONL has ten substantive active P1 claims, but the reducer shows nine because first-seen iteration 8 gave `P1-007` and `P1-008` the same hash; later same-ID refinements cannot change reducer identity.
Dimension: correctness, final adversarial stabilization/replay.
Frozen target: `.opencode/specs/sk-design/017-remediation-program-review`; validated 118-file manifest; pinned HEAD `7b9d3b6b71`.

## Required Work

1. Re-read direct source anchors for all ten substantive claims and challenge each against counterevidence: publication digest, playbook paths, parent phase map, database README paths, generated metadata, generation-drift classification, malformed operator inputs, absent-root status, shadow-parity scope, and p95 evidence.
2. Confirm, downgrade, disprove, or merge each claim. No broad new discovery; this is stabilization.
3. Repair append-only reducer identity without editing history:
   - Mark old IDs `P1-007` and `P1-008` resolved in the canonical iteration record via `resolvedFindings:["P1-007","P1-008"]`.
   - Emit two new active superseding findings: `P1-011` for malformed operator options and `P1-012` for absent-root status.
   - Give `P1-011` and `P1-012` distinct canonical snake-case `content_hash` values from path, line range, finding type, and normalized description; include `supersedesFindingId` and complete typed adjudication packets with numeric confidence.
   - Explain in narrative that the old merged IDs are resolved only as an identity-repair supersession, not because the defects were fixed.
4. Preserve the other eight active IDs unless direct counterevidence supports a recorded transition.

## Required Bindings

Emit canonical six BINDING lines before state reads for exact target/specFolder, maxIterations=10, convergence=0.1, review mode, and all dimensions.

## State And Outputs

Read lineage config/state/registry/strategy. Write only `iterations/iteration-010.md`, append state, `deltas/iter-010.jsonl`, and update strategy.

## Constraints

- One LEAF iteration; no subagents/fixes; target read-only. Load review-core.
- Strict manifest scope; direct anchor rereads, exact state inspection, focused tests. Code Graph unavailable. Do not use Python.
- New `P1-011`/`P1-012` need full finding schema, distinct canonical content_hash, and complete typed adjudication. The iteration's `findingsNew` must contain these two IDs and `resolvedFindings` must contain the two superseded IDs.
- Canonical iteration 10 route proof; session `fanout-gpt-56-sol-high-1784650021792-031fvi`, generation 1, lineage new; delta first record matches state; exact final verdict.
- Set next focus to synthesis only. Stop reason after this pass is `maxIterationsReached`.

## Allowed Write Paths

Only the four named lineage-local outputs.

## Banned Operations

No delete, rename, truncation, staging, commit, target generation, or write elsewhere. Record and contain violations.
