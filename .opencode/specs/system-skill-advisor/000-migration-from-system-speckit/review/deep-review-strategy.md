# Deep Review Strategy

## Dispatcher
- target_agent: deep-review
- resolved_route: /deep:review:auto -> .opencode/agents/deep-review.md
- agent_definition_loaded: true
- mode: review
- target: .opencode/specs/system-skill-advisor
- specFolder: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit
- maxIterations: 20
- convergenceThreshold: 0.10

## Dimensions
- [x] correctness — iteration 001 score: 0.42; structural migration path/numbering defects found.
- [x] traceability — iteration 001 score: 0.45; stale pre-move references and metadata path mismatches found.

## Running Finding Counts
- P0: 0
- P1: 6
- P2: 0

## What Worked
- Iteration 001: Direct filesystem audit over the bound system-skill-advisor track plus the listed system-speckit parents found migration-specific stale metadata, missing child references, stale cross references, and numbering gaps.

## What Failed
- Iteration 001: Pre-existing review state files were not present before this leaf iteration; first-run loop state was initialized under the pre-bound packet.

## Exhausted Approaches
- PRODUCTIVE: direct graph-metadata JSON parse and filesystem existence checks.
- PRODUCTIVE: git diff HEAD~5..HEAD rename list as stale pre-move path seed.
- PRODUCTIVE: direct line reads for representative metadata evidence.

## Edge Cases and Carry-Forward
- No orphaned empty shell folders were found among old rename source directories.
- The audit intentionally ignored known non-structural content quality debt per dispatch scope.
- Category 3 checks treated the actual spec path as the path under `.opencode/specs/`; entries using `system-spec-kit` or old system-skill-advisor migration roots do not match folders on disk.

## Next Focus
- dimension: none
- focus area: synthesis/report follow-up by orchestrator
- reason: requested five structural categories were covered in one bounded iteration
- rotation status: complete
- blocked/productive carry-forward: productive filesystem/metadata audit can be reused for fix verification
- required evidence: rerun graph-metadata path/existence and numbered-child gap checks after fixes
