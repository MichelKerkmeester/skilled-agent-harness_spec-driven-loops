# Iteration 45: S6-05 Wave Assignment Risk

## Focus

S6-05: risks of replacing our flat concurrency-capped pull-pool with loop-cli's push-assignment wave model for research/review fan-out, and where conflict safety breaks without git worktrees. This builds on the prior S6-07 conclusion that push-wave fan-out should come late; this iteration narrows the concrete breakpoints and target files.

## Actions Taken

1. Re-read the deep-research output contract and the existing S6-07 delta to avoid duplicating the already-recorded "push-wave last" finding.
2. Re-read loop-cli's wave rules in `AGENTS.md`, `/ob-apply`, and `/ob-propose`, focusing on push assignment, `depends_on`, `touches`, disjoint grouping, checkpoint commits, retry, and zero-progress stop.
3. Re-read our fan-out scheduler and runner: `fanout-pool.cjs`, `fanout-run.cjs`, `executor-config.ts`, and the research YAML fan-out step.
4. Compared the reference's code-writing wave assumptions against our research/review lineage model: isolated sub-packets, prompt-enforced write boundaries, capped FIFO pool, and pooled retry/partial completion.

## Findings

1. **Rank 1 - Do not add waves until fan-out config has assignment metadata.**
   Reference mechanism: loop-cli's proposal step derives mandatory `depends_on` and best-effort `touches` annotations for every task, then `/ob-apply` reads those annotations to build waves [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-propose.md:37-56`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:21`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`.
   Why it helps: our fan-out schema currently has executors, concurrency, retries, lag ceiling, and heartbeat, but no dependency or write-domain metadata [SOURCE: `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:265-271`]; without that, `fanout-pool.cjs` cannot know eligibility beyond FIFO order.
   Port difficulty: hard. Tag: deep-rewrite.

2. **Rank 2 - Replace FIFO queueing only with a domain-aware wave planner, not a raw push prompt.**
   Reference mechanism: loop-cli computes `eligible`, packs same-file tasks into one worker, chooses pairwise-disjoint groups, and caps the wave at max concurrency [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:30-39`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`.
   Why it helps: our pool flattens all items into an index queue and starts any next item while `active < concurrency` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:317-319`; `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:439-445`]. A wave port needs a planner that understands dependency readiness and disjoint artifact/write domains before the pump starts children.
   Port difficulty: hard. Tag: deep-rewrite.

3. **Rank 3 - The no-worktree conflict model breaks at our prompt-only write boundary.**
   Reference mechanism: loop-cli explicitly runs without worktrees, so safety comes from codegraph impact, `touches` globs, `git diff`, same-file packing, and group-path reverts [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/AGENTS.md:45-51`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:25-28`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
   Why it helps: our lineage prompt says outputs must stay under `lineageDir` [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:271-277`], but the runner comment states that the lineageDir-only boundary is enforced by prompt, not by a narrower sandbox [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:607-613`]. Without git worktrees or path-scoped sandboxing, a child that writes outside its lineage can collide with siblings and the pool has no authoritative touched-path set to revert.
   Port difficulty: hard. Tag: deep-rewrite.

4. **Rank 4 - Add an explicit flat-pool guard/telemetry before accepting wave-shaped config.**
   Reference mechanism: loop-cli tells the user when it degrades conflict checks and stops on stalls or exhausted retries instead of silently spinning [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:25-28`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:52-59`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
   Why it helps: the runner already writes an orchestration summary after the capped pool finishes [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:718-729`]. Adding `assignment_model: "flat_pool"` plus rejecting or warning on future `depends_on`/`touches` fields would prevent users from thinking they are getting wave safety before the planner exists.
   Port difficulty: easy. Tag: quick-win.

5. **Rank 5 - Do not let group retry semantics replace lineage retry semantics without a merge contract.**
   Reference mechanism: loop-cli commits each successful group, reverts failed group paths, retries once, and lets unrelated tasks continue while failed dependents block [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-apply.md:52-59`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`.
   Why it helps: our pool retries by lineage label when the failure is classified retryable, then reports partial success through the runner exit code [SOURCE: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:455-480`; `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:728-729`]. A wave model needs separate semantics for "lineage failed", "dependency blocked", "group retry exhausted", and "safe to merge sibling output"; otherwise fan-out synthesis could consolidate incompatible partial lineages.
   Port difficulty: med. Tag: deep-rewrite.

## Questions Answered

- S6-05 is answered at the risk-boundary level: replacing the flat pool is unsafe until fan-out lineages carry dependency and write-domain metadata, the pool has a real wave planner, and the runner has a stronger conflict boundary than prompt-only lineage isolation.
- S1-12/S4-11 were already covered at the mechanism level; this pass adds exact target mappings and the failure modes that block a direct port.
- The conflict-safety break without worktrees is not simply "same file edits"; in our system it is "same worktree plus prompt-only path isolation plus no touched-path authority for rollback."

## Questions Remaining

- Should our durable conflict boundary be path-scoped sandboxing, per-lineage git worktrees, or a stricter artifact-only fan-out contract?
- Should dependency metadata live in `executor-config.ts` as first-class schema, or in a separate fan-out assignment manifest generated by research/review workflows?
- Should native lineages join the same wave planner, or should the first wave implementation apply only to CLI lineages and keep native fan-out sequential?

## Next Focus

S6-06: how loop-cli's clean-failure/branch-preserved policy should reshape our promotion and rollback gate, especially where it conflicts with auto-apply and backup-rollback patterns.
