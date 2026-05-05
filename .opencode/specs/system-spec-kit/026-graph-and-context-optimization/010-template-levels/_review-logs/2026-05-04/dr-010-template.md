## TARGET AUTHORITY
Approved spec folder: __ABS_PATH__

# TASK
Run the official `/spec_kit:deep-review:auto` workflow on a single phase child of
`010-template-levels` for 5 iterations, with review focus pinned to IMPLEMENTATION
CODE (templates, scripts, skill assets, command YAML, validators) — not just the
spec.md / plan.md / tasks.md cross-reference layer.

You are GitHub Copilot CLI running model `gpt-5.5` with `--reasoning-effort high`.
Your working directory is the repo root. Each invocation reviews exactly one phase
folder; the operator batches up to 3 of these dispatches concurrently across the 8
phases.

# CONTEXT
- Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Phase parent: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels
- THIS DISPATCH'S PHASE: __PHASE_FOLDER__
- Absolute target path for THIS DISPATCH: __ABS_PATH__
- Skill contract: `.opencode/skill/sk-deep-review/SKILL.md` (FORBIDDEN INVOCATION PATTERNS section is binding)
- Command entrypoint: `.opencode/command/spec_kit/deep-review.md` + `assets/spec_kit_deep-review_auto.yaml`
- Why implementation-focus matters: 010 is a template-system rework; reviewing only
  the spec docs lets render/validator/manifest defects slip through. The actual
  blast radius lives in `.opencode/skill/system-spec-kit/templates/`,
  `.opencode/skill/system-spec-kit/scripts/spec/`, the manifest+resolver+renderer
  trio (per ADR-005 in 003), and per-phase impacted files listed in each child's
  `resource-map.md` (when present) or `implementation-summary.md`.

# INSTRUCTIONS
1. The phase folder is already pinned: `__ABS_PATH__`. Do NOT pick a different one.
2. Read the phase's `resource-map.md` (if present) or `implementation-summary.md`
   to enumerate the IMPLEMENTATION FILES the phase touched. This list is the
   primary review surface — feed it into the deep-review setup as scope.
3. Invoke the official command exactly:
       /spec_kit:deep-review:auto __ABS_PATH__ --max-iterations=5
4. When the YAML's UNIFIED SETUP PHASE asks for inputs, answer non-interactively
   using these values:
       review_target            = __ABS_PATH__
       review_target_type       = spec_folder
       review_dimensions        = implementation-spec-alignment, code-correctness,
                                  template-rendering-correctness, validator-coverage,
                                  cross-runtime-mirror-consistency
       spec_folder              = __ABS_PATH__
       execution_mode           = auto
       maxIterations            = 5
       convergenceThreshold     = (skill default — do not override)
5. Let the YAML workflow drive all dispatch, state writes, and convergence
   detection. Each iteration MUST produce both the iteration markdown
   (`review/iterations/iteration-NNN.md`) and the JSONL delta record.
6. On completion, the workflow writes `review/review-report.md`. Report the path
   and the final P0/P1/P2 counts back to the operator.

# DO
- Use `/spec_kit:deep-review:auto` exactly as written above (attached `:auto` suffix).
- Pass `--max-iterations=5` on the command line.
- Bias review dimensions toward IMPLEMENTATION CODE (the dimension list in step 4).
- Treat `resource-map.md` / `implementation-summary.md` file ledgers as the
  authoritative review scope.
- Let `scripts/reduce-state.cjs` be the single state writer.
- Stop early only if the YAML's convergence detector fires before iteration 5.

# DON'T
- DO NOT write a custom bash/shell loop to parallelize iterations inside this
  dispatch. The YAML workflow is the only legal driver.
- DO NOT invoke the `@deep-review` LEAF agent directly via the Task tool to
  simulate iterations — `@deep-review` is a single-iteration LEAF and MUST be
  driven by the command's workflow.
- DO NOT write iteration prompts or state to `/tmp` or any path outside
  `__ABS_PATH__/review/`.
- DO NOT skip the JSONL delta append — every iteration owes both markdown AND
  JSONL or `post-dispatch-validate.ts` will flag `iteration_file_*` /
  `jsonl_*` failures.
- DO NOT review only spec.md / plan.md / tasks.md. If the YAML setup defaults
  scope to docs-only, override via the `review_dimensions` values in step 4.
- DO NOT exceed 3 concurrent cli-copilot dispatches (operator-side ceiling — the
  GitHub Copilot API throttles above 3 per account; the operator handles batching,
  not you).

# EXPECTED ARTIFACTS AFTER RUN
- __ABS_PATH__/review/iterations/iteration-001.md ... iteration-005.md
  (or fewer iff convergence fired early)
- __ABS_PATH__/review/deep-review-state.jsonl  (≥5 records of type=="iteration")
- __ABS_PATH__/review/review-report.md         (final synthesis with `## Findings`
                                                heading and P0/P1/P2 counts)
