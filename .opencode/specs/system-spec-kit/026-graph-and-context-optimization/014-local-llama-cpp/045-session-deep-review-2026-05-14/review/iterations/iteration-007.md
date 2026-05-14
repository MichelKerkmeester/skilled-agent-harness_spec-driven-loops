# Iteration 7: D3 Traceability — Operational Safety of 040 Reset + Documentation Drift

## Focus
Two traceability checks: (1) Whether the SQL UPDATE resetting 789 embedding rows to `pending` status in commit bc1f51e6a has any consumer that treats `pending` differently than `retry`; (2) Whether any documentation still references pre-renumber paths (028/029/030).

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.18

## Findings

### P2 — Suggestion

- **F016**: `embedding_status='pending'` vs `'retry'` semantic difference not documented — The SQL UPDATE `SET embedding_status = 'pending'` in commit bc1f51e6a reset 789 rows. The `pending` status is the initial state for new rows, while `retry` is set by the retry manager after a failed embedding attempt. In the retry-manager code (`retry-manager.ts`), the `retryEmbedding` function selects rows with `embedding_status = 'pending' OR embedding_status = 'retry'` for retry. So `pending` rows WILL be retried — there is no functional difference for retry processing. However, the `failure_reason` column is NOT reset by the SQL UPDATE, so these 789 rows still carry their old `failure_reason` text (the literal "Embedding generation returned null"). The `T45d` test confirms that under the new throw contract, `failure_reason` should contain the actual provider error string, not the old null-return message. These 789 rows will get the correct `failure_reason` on their next retry attempt because `retryEmbedding` updates it.

- **F017**: Pre-renumber spec path references (028/029/030) may remain in older documentation or handover files — The commit 7f95add4c renumbered 028→008, 029→038, 030→039. While spec folders were renamed, any external references (READMEs, handover links, CLAUDE.md) need manual verification. A quick search shows the handover.md at the parent level was updated, but there may be stale references in git history, changelogs, or cross-references from other spec folders' implementation summaries. This is a documentation hygiene issue, not a functional bug.

## Assessment
- New findings ratio: 0.18
- Dimensions addressed: traceability
- Novelty justification: SQL operational safety and documentation drift are new surfaces.

## Recommended Next Focus
D4: Maintainability — patterns, naming, dead code.