# Iteration 3: Q2, the deep-loop runtime, diff-driven (extend, frontier_drained, append gateway)

## Focus
This iteration worked on Q2, whether the deep-loop runtime changes carry logic bugs or drift from their docs, plus the UX question (Q4). `git log v4.1.0.0..v4.2.0.0` lists 438 commits over `.skilled/skills/system-deep-loop/` and `.skilled/commands/deep/`, so the focus was narrowed to the smallest in-window surfaces named in the dispatch:
- `workflow-steps.cjs extend-research`: 464 lines, 4 in-window commits.
- the `frontier_drained` candidate in `convergence.cjs`: commit `b3fea67595e`.
- the append gateway's identity minting in `append-mode-event.cjs`: commits `1e2add8bab3` and `6ec426de2db`.

`fanout-run.cjs` (6266 lines, 66 in-window commits) and `fanout-merge.cjs` (1949 lines, 14 commits) were deferred to the next iteration.

## Actions Taken
1. Listed the window's commits and the per-file commit counts for the six named scripts, plus the `-G'frontier_drained|extend-research|--extend'` subset.
2. Read `extendResearch` and `extendReview` in `workflow-steps.cjs`, and the YAML step that calls them.
3. Read the `frontier_drained` candidate and the research and review frontier facts in `convergence.cjs`, the node-status sets in `frontier-admit.cjs`, and both docs that describe the candidate.
4. Read the gateway's legacy research branch and the `stable-identity-missing` decision in `legacy-compatibility.ts`.
5. Traced who reads and writes `inbox.jsonl`: `reduce-state.cjs`, `frontier-admit.cjs` and `fanout-run.cjs`. Ran a two-case reproduction of `extend-research` on scratch fixtures under the session scratchpad.
6. Ran `git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`. It has no `pendingInbox` or "no pending inbox" text, so the logic is new in the window and is not code moved from v4.1.0.0.

## Findings
1. **P3 (UX, doc drift): the research `--extend` re-stop warning goes silent once the inbox has ever held a line.**
   - `extendResearch` counts every non-empty line of `research/inbox.jsonl` as a pending question [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:195]. It shows the warning only when that count is zero [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:206], and the warning text says "has no pending inbox question" [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:207].
   - Nothing ever removes a consumed line. The reducer only reads the inbox [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3431] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3454]. It merges each line into the registry by `inboxId` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1163]. The only other writers append [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:871] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:638].
   - So a question the run already answered still counts as pending, and the operator gets no warning before an extension that re-stops on `all_questions_answered` at once.
   - Under `depth_mode == expansive` the inbox always holds the frontier rows [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:800], so the warning can never fire for that whole class of run.
   - The flag table tells operators to "add questions to `research/inbox.jsonl` before you extend" [SOURCE: .skilled/commands/deep/research.md:118]. It does not say that old lines already silence the warning.
   - Reproduced: a `complete` config with 3 iteration rows and one stale inbox line returned `"warning":null`. The same config with no inbox file returned the warning. Both runs exited 0.
   - Introduced by `2c80c64f391` (2026-11-17, inside the window: v4.1.0.0 is its ancestor). Moved into the script unchanged by `d239dd6d2ae`.
   - The fix is to count only inbox ids that the registry does not yet hold as answered, or to word the warning on coverage instead of the inbox [INFERENCE: based on the reducer's inboxId merge at reduce-state.cjs:1278 and the warning gate at workflow-steps.cjs:206].

## Ruled Out
- **`frontier_drained` drifts from its docs.** It does not. The research candidate needs `depthMode == expansive`, `fanoutLineage`, at least one frontier node, none open or active, and at least one answered [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. `fanoutLineage` is set only when the config carries `fanout_lineage_artifact_dir` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1673], and "open" counts both `open` and `active` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1667]. That matches [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191] and [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130]. The node-status vocabulary has no extra in-flight status that the open count would miss [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:79].
- **The research `--extend` warning should name `frontier_drained` as the review twin does.** It should not. `--extend` refuses fan-out [SOURCE: .skilled/commands/deep/research.md:118], and only a fan-out lineage forms the research candidate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1244].
- **The `--extend-minutes` arithmetic is off.** It is not. The code computes `max(prior, elapsed) + M`, defaults M to the prior budget, and keeps no budget when the prior was 0 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:157]. That matches [SOURCE: .skilled/commands/deep/research.md:119]. The reproduction gave 1062 = 1002 elapsed minutes + 60.
- **The gateway's legacy research branch mis-mints identity.** No defect was found. It drops caller-keyed fields before the builder mints them, and it uses the gateway clock for completed iterations [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:452].

## Dead Ends
- None this iteration. The `frontier_drained` stop logic and the `--extend-minutes` arithmetic are candidates for the reducer to mark exhausted.

## Edge Cases
- Ambiguous input: the dispatch named six surfaces across 438 commits, more than one iteration can read. The three smallest were taken, and fan-out was deferred.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: Q2 is only partly covered. `fanout-run.cjs` and `fanout-merge.cjs` were not read, so Q2 stays open.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:119-300
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1195-1280, 1650-1676, 1850-1870
- .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:70-135, 871
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:395-520
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:530-565
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1163, 3431, 3454
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:638
- .skilled/commands/deep/research.md:118-119
- .skilled/commands/deep/assets/deep-research.yaml:560, 800
- .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191
- .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130
- git show 2c80c64f391, b3fea67595e, 1e2add8bab3; git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml

## Assessment
- New information ratio: 1.0 (1 of 1 finding is new and reproduced; the clean surfaces are recorded as ruled out, not as findings).
- Questions addressed: Q2 (the deep-loop runtime), Q4 (UX).
- Questions answered: none.

## Reflection
- What worked and why: picking the smallest in-window script first paid off. `workflow-steps.cjs` is new in the window and short, so one reproduction proved the bug without a live run.
- What did not work and why: the commit list is too large to triage by subject line. The fan-out scripts alone carry 80 in-window commits, so they need an iteration of their own.
- What I would do differently: start from the fix commits whose subjects name trust or stop semantics, and read only their hunks.

## Questions Answered
- None. Q2 stays open until the fan-out scripts are read.

## Questions Remaining
- Q2: the deep-loop runtime (fan-out still open).
- Q3: the session hooks and spec tooling.
- Q4: operator UX (one more defect found here).
- The skill advisor question.

## Recommended Next Focus
Q2 fan-out, diff-driven:
- Read the in-window trust and stop hunks of `fanout-run.cjs` and `fanout-merge.cjs`: `2bfee12379d` (lineage trust on the research merge), `86f6c584b1b` (untrusted lineages and review coverage), `4fc94bae0d3` and `e111720dc88` (`--stop` and runner signals), and `978b74e8df7` (survivors).
- Check one lead along the way. `extendResearch` scopes `run_extended` to `lineageId = lineage.parentSessionId || sessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166], while the iteration rows use `sessionId`, and on a restarted run those differ. Verify whether any ledger or projection reader filters on `scope.lineageId`, and blame the line, before calling it a finding.
