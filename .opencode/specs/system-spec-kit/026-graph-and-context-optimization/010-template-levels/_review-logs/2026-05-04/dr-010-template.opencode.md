/spec_kit:deep-review:auto __ABS_PATH__ --max-iterations=5

You are running the official `/spec_kit:deep-review:auto` workflow on a single phase child of `010-template-levels` for 5 iterations. Review focus: IMPLEMENTATION CODE (templates, scripts, skill assets, command YAML, validators) — NOT just spec.md / plan.md / tasks.md cross-references.

## TARGET AUTHORITY
Approved spec folder: __ABS_PATH__
THIS DISPATCH'S PHASE: __PHASE_FOLDER__
Phase parent: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels

## UNIFIED SETUP — non-interactive answers
review_target            = __ABS_PATH__
review_target_type       = spec_folder
review_dimensions        = implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage, cross-runtime-mirror-consistency
spec_folder              = __ABS_PATH__
execution_mode           = auto
maxIterations            = 5
convergenceThreshold     = (skill default — do not override)

## SCOPE GUIDANCE
Read the phase's `resource-map.md` (if present) or `implementation-summary.md` to enumerate the IMPLEMENTATION FILES the phase touched. That ledger is the primary review surface — feed it into the deep-review setup as scope. The blast radius lives in `.opencode/skill/system-spec-kit/templates/`, `.opencode/skill/system-spec-kit/scripts/spec/`, the manifest+resolver+renderer trio (per ADR-005 in 003), and per-phase impacted files.

## DO
- Pass `--max-iterations=5` (already on the command line above).
- Bias review dimensions toward IMPLEMENTATION CODE.
- Treat resource-map / implementation-summary file ledgers as authoritative scope.
- Let `scripts/reduce-state.cjs` be the single state writer.
- Stop early only if convergence detector fires before iteration 5.
- Each iteration MUST produce both the iteration markdown (`review/iterations/iteration-NNN.md`) and a JSONL delta record.

## DON'T
- DO NOT write a custom bash/shell loop to parallelize iterations. The YAML workflow is the only legal driver.
- DO NOT invoke the `@deep-review` LEAF agent directly via the Task tool. `@deep-review` is single-iteration LEAF and MUST be driven by the command's workflow.
- DO NOT manually initialize deep-review state files via node/python/shell. Let the YAML workflow's setup phase do this.
- DO NOT write iteration prompts or state to `/tmp` or any path outside `__ABS_PATH__/review/`.
- DO NOT skip the JSONL delta append.
- DO NOT review only spec.md / plan.md / tasks.md.

## EXPECTED ARTIFACTS
- __ABS_PATH__/review/iterations/iteration-001.md ... iteration-005.md
- __ABS_PATH__/review/deep-review-state.jsonl  (≥5 records of type=="iteration")
- __ABS_PATH__/review/review-report.md         (final synthesis with `## Findings` heading and P0/P1/P2 counts)

On completion, report the path to review-report.md and the final P0/P1/P2 counts.
