# Deep Review Workflow Bindings

BINDING: spec_folder=.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set
BINDING: artifact_dir=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review/lineages/gpt55-p017c004-1
BINDING: session_id=fanout-gpt55-p017c004-1-1781757625173-xsur7n
BINDING: executor=cli-opencode model=openai/gpt-5.5-fast
BINDING: loop_type=review
BINDING: maxIterations=1
BINDING: resolveArtifactRoot=skipped per fanout_lineage_artifact_dir override

## Context Loading Notes

- `memory_match_triggers` succeeded on retry without the untrusted fanout session id and returned no direct trigger matches.
- `memory_context` was attempted for workflow context loading, but the MCP endpoint rejected the session scope with `E_SESSION_SCOPE`; direct spec files were used as prior context instead.
- Code graph outline was attempted and blocked because the code graph was stale and required a full scan; direct reads plus exact Grep were used for review evidence.

## Read-Only Reproduction

Command outcome:

```text
labeled set must be a JSON array of {query, memoryId, relevant}
```

The command parsed the shipped starter labeled-set JSON and passed it to `loadLabeledSet()` from the shipped implementation.
