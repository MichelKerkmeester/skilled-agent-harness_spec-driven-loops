# Deep Review Strategy

## Review Setup
- Target: `.opencode/skills/sk-doc/doc-quality/`
- Target type: skill
- Mode: review
- Max iterations: 4
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Route proof: `/deep:review:auto -> .opencode/agents/deep-review.md`

## Dimensions
- [x] correctness — iteration 002 complete; score 1 P1 / 0 P2
- [x] traceability — iteration 001 complete; score 3 P1 / 1 P2
- [x] maintainability — iteration 003 complete; score 0 P1 / 1 P2
- [x] security — iteration 004 complete; score 0 P1 / 0 P2

## Running Counts
- P0: 0
- P1: 4
- P2: 2

## What Worked
- Iteration 001: Contract-vs-reference comparison found productive traceability issues in mode naming, no-creation boundaries, validation/template fidelity, and stale section claims.
- Iteration 002: Runnable command/path review found a distinct correctness issue in copy-paste shell examples that use `../shared` from an invalid demonstrated cwd.
- Iteration 003: Maintainability pass found stale numbered-mode vocabulary across overflow references without duplicating prior operational findings.
- Iteration 004: Security/safety pass found no active P0/P1/P2 security issues; edit scope, anti-fabrication, escalation, and destructive-command boundaries are explicit in the primary contract.

## What Failed
- Prior retry aborted before initialization because restart-mode missing packet files were treated as fatal before first-run setup.
- Iteration 004: Final review report was requested, but LEAF write safety permits only iteration artifacts, strategy edits, and JSONL appends; report synthesis must be performed by the owning `/deep:review` workflow/reducer.

## Exhausted Approaches
- None yet.

## Edge Cases and Carry-Forward
- Restart initialization had no existing review packet to archive.
- Stop policy requires max-iterations; convergence telemetry must not stop before iteration 4.
- Iteration 001: Changelog validation is ambiguous because the validator supports `--type changelog`, while dispatch requested only `skill|readme|reference`; continue with explicit validation context.
- Iteration 002: The invalid `../shared` command-path finding overlaps the existing no-creation example finding but remains distinct because the path is wrong even before the workflow-boundary concern is considered.
- Iteration 003: Legacy numbered-mode vocabulary is tracked as P2 maintainability debt, separate from the earlier P1 mode-name table conflict.
- Iteration 004: Placeholder credentials in transformation examples are not real secrets; no security finding filed.
- Iteration 004: Final report path is not written by this LEAF because reports are outside the permitted writable set.

## Next Focus
- dimension: complete
- focus area: max-iterations reached; synthesize via owning `/deep:review` workflow/reducer
- reason: All four dimensions have been covered in iterations 001-004.
- rotation status: terminal iteration reached
- blocked/productive carry-forward: Active findings remain P1/P2; final report write is blocked for this LEAF by write-safety contract.
- required evidence: Reducer/orchestrator should aggregate iteration artifacts and produce final review report outside the LEAF write boundary.
