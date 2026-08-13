# Iteration 15: Classify checkpoints and rewind

## Focus

Test the claim that Pi lacks checkpoints, rewind, and recovery.

## Findings

- Pi auto-saves sessions as JSONL trees and supports resume, tree navigation, fork, clone, and branch summaries. [SOURCE: https://pi.dev/docs/latest/sessions]
- `SessionManager` exposes branch movement, entry lookup, tree traversal, context reconstruction, and custom entries. [SOURCE: https://pi.dev/docs/latest/session-format]
- This is conversation-state rewind and branching. It is not a filesystem snapshot or transaction that reverts tool side effects.
- Verdict: “checkpoints & rewind missing” is refuted for conversation history, verified for native filesystem rollback, and misleading when left unqualified. Filesystem snapshots should remain a separate safety product, not cache scope.

## Sources Consulted

- `https://pi.dev/docs/latest/sessions`
- `https://pi.dev/docs/latest/session-format`

## Assessment

- newInfoRatio: 0.53
- Novelty justification: Splits one vague claim into conversation-state support and filesystem-state absence.
- Confidence: High.

## Reflection

- Worked: Session-format documentation provides the exact state model.
- Failed/ruled out: Reimplementing Pi session persistence inside a cache plugin is ruled out.

## Recommended Next Focus

Classify Context Engine claims against Pi compaction and session reconstruction.
