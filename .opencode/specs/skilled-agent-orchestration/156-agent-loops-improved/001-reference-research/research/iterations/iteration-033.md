# Iteration 33: S4-09 Speckit Unattended Pipeline Mapping

## Focus

[S4-09] What from loop-cli's `/ob-autopilot` propose -> apply -> archive -> merge pipeline should SpecKit adopt for unattended runs, especially the clean-failure policy that preserves the working branch instead of merging unverified work?

## Actions Taken

- Checked the deep-research state and strategy for prior S4-09 coverage; S4-09 is still open, while recent S4 work covered telemetry, question provenance, and run-now sentinel mechanics.
- Searched `loop-cli-main` for the autopilot command and read `.opencode/commands/ob-autopilot.md` with line numbers.
- Read SpecKit router files `.opencode/commands/speckit/plan.md`, `.opencode/commands/speckit/implement.md`, and `.opencode/commands/speckit/complete.md`.
- Read the corresponding `:auto` workflow assets to map whether current autonomous mode already has branch isolation, no-prompt semantics, phase commits, archive, merge, or clean-failure behavior.

## Findings

1. Add an explicit unattended lifecycle envelope to `/speckit:complete`, separate from today's `:auto`.
   - Reference mechanism: loop-cli defines `/ob-autopilot` as a full no-human lifecycle that branches from `main`, proposes, applies, archives, and merges back only after verification (`external/loop-cli-main/.opencode/commands/ob-autopilot.md:13-15`, `external/loop-cli-main/.opencode/commands/ob-autopilot.md:25-33`).
   - Exact OUR target file: `.opencode/commands/speckit/complete.md` should expose the contract beside its current mode routing; `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` is the owned workflow asset currently marked autonomous (`complete.md:31-37`, `speckit_complete_auto.yaml:23-34`).
   - Why it helps: SpecKit `:auto` means fewer approvals, not a crash/failure-safe unattended pipeline. A distinct `:autopilot` or `--unattended` mode would prevent silent semantic drift and give loops a stable entrypoint.
   - Port difficulty: hard.
   - Tag: deep-rewrite.

2. Teach `/speckit:plan` to emit unattended-ready task metadata as the propose phase output.
   - Reference mechanism: autopilot runs `/ob-propose` without checkpoints, generates proposal/specs/tasks, annotates every task with agent, dependency, and touched-file metadata, then commits the proposal phase (`external/loop-cli-main/.opencode/commands/ob-autopilot.md:35-39`).
   - Exact OUR target file: `.opencode/commands/speckit/plan.md` should name the unattended propose contract; `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` owns plan writing and validation (`plan.md:31-37`, `speckit_plan_auto.yaml:620-644`).
   - Why it helps: current planning creates `tasks.md` and marks parallel tasks, but unattended implement needs deterministic task metadata for branch-preserved retries, wave grouping, and conflict-safe execution.
   - Port difficulty: medium.
   - Tag: quick-win.

3. Convert unattended `/speckit:implement` stops into bounded failure states, not prompts.
   - Reference mechanism: autopilot applies the plan without returning control between waves, reopens failing tasks only within the underlying retry policy, and halts on stalls, exhausted retry, or uncleared verification failure (`external/loop-cli-main/.opencode/commands/ob-autopilot.md:41-46`, `external/loop-cli-main/.opencode/commands/ob-autopilot.md:68-74`).
   - Exact OUR target file: `.opencode/commands/speckit/implement.md` should document the unattended implement route; `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` currently still contains user-prompt stops for debug escalation and low-confidence cases (`implement.md:31-38`, `speckit_implement_auto.yaml:430-479`).
   - Why it helps: unattended loops cannot stop for "A/B/C" or debug-offer prompts. They need machine-readable terminal reasons such as `no_eligible_tasks`, `retry_exhausted`, `verification_failed`, and `uncertainty_blocked`.
   - Port difficulty: medium.
   - Tag: deep-rewrite.

4. Fold archive and merge into `/speckit:complete` closeout only after strict verification succeeds, with branch preserved on failure.
   - Reference mechanism: autopilot archives the just-implemented change in place on the same branch, commits archive output, then merges to `main` only if verification passed and the tree is clean; merge conflicts abort and preserve the branch (`external/loop-cli-main/.opencode/commands/ob-autopilot.md:48-64`, `external/loop-cli-main/.opencode/commands/ob-autopilot.md:68-74`).
   - Exact OUR target file: `.opencode/commands/speckit/complete.md` should own the end-to-end closeout contract; `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` already has strict checklist and validation checkpoints that can become the merge precondition (`complete.md:41-46`, `speckit_complete_auto.yaml:946-960`).
   - Why it helps: SpecKit complete currently closes the spec workflow, but unattended runs need a final shipping boundary: archive/update docs, commit phase artifacts, merge or stop with the feature branch intact.
   - Port difficulty: hard.
   - Tag: deep-rewrite.

## Questions Answered

- [S4-09] SpecKit should not treat existing `:auto` as equivalent to loop-cli autopilot. The portable pattern is a separate unattended lifecycle: branch first, run plan/propose without prompts, run implement/apply without inter-wave user returns, archive in place, verify, merge only on clean success, and preserve the branch on any hard failure.

## Questions Remaining

- Should SpecKit implement this as a new `/speckit:autopilot` command, a `:autopilot` mode on `/speckit:complete`, or an explicit `--unattended` flag routed through `complete.md`?
- Where should the branch/commit/merge state live: a new workflow asset under `.opencode/commands/speckit/assets/`, or shared system-spec-kit git orchestration helpers?
- Should unattended mode be allowed to push `main`, or should it stop after local merge and leave push/PR policy to `sk-git`?

## Next Focus

[S2-04] How does kasper apply time-decay half-life weighting so stale observations fade? Map the portable signal math onto `deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.
