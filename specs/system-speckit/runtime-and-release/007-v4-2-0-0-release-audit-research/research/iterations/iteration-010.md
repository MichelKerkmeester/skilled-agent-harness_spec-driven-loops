# Iteration 10: Base-directory readers of the merged frontier, the stop-identity test, and the closing summary

## Focus
This is the last iteration. It settles the open question from iteration 9: after a fan-out merge, does any step in the base directory read `registry.frontier` from the merged `findings-registry.json`? If one does, f-iter008-003 is re-graded from doc drift to a logic defect. The iteration then runs the pinned stop-identity test and closes with a ranked summary of every confirmed finding in this run.

Interpretation: "reads" means any workflow step or script that consumes the merged file's `frontier`. That covers gates, convergence and report text. The other carried question, whether a lineage dealt zero nodes can seed its own `F-1-*` ids, is deferred.

## Actions Taken
1. Read the merge's load and write path in `fanout-merge.cjs`, the `mergeResearchFrontier` output shape, and the reducer's frontier source.
2. Read the fan-out branch of `deep-research.yaml`: the spawn step, the `--extend` and frontier-cap refusals, and every `phase_synthesis` step after `step_fanout_merge`.
3. Grepped `convergence.cjs`, `workflow-steps.cjs` and `frontier-admit.cjs` for registry and frontier reads. Read the `--registry-path` argument of `step_graph_convergence`.
4. Checked `phase_loop` for a fan-out `skip_when`, and checked whether the pre-synthesis gate's `on_B` predates v4.1.0.0.
5. Ran `tests/unit/fanout-stop-identity.vitest.ts` with the package's vitest.

## Findings
1. **Citation correction.** Line 1732 is the per-lineage load name, not the merged write [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1732]. The merged registry is written at `path.join(artifactDir, registryName)`, which is `{artifact_dir}/findings-registry.json`. It is written atomically together with a `deep-research-findings-registry.json` copy [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1887] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1894]. That is the same file as `state_paths.registry` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:218], so iteration 9's overlap holds.

2. **On the normal fan-out path, no gate reads the merged frontier.**
   - `--extend` is refused on a fan-out config before anything spawns [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:365]. The frontier caps are refused the same way [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:377].
   - Fan-out jumps straight to `phase_synthesis` and skips `phase_init` and the main loop [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:427]. The `frontierOpen` veto, the frontier pivot gate and the stuck-close gate therefore never run in the base directory.
   - The stuck-close gate could not fire on merged data even if reached. It needs `registry.frontier.activeNodeId` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1388], and `mergeResearchFrontier` returns only `nodes`, `stats` and `partitionGuard` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:808].
   - The reducer rebuilds `registry.frontier` from `frontier-nodes.jsonl`, not from the prior registry [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3503]. The fan-out resource-map branch also never rewrites the merged registry, and the completed-dashboard reducer pass is skipped on fan-out [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2155].

3. **Two synthesis steps do consume the merged frontier, so untrusted nodes reach `research.md` unlabeled (new).**
   - `step_hydrate_summary_metrics` builds `divergence_summary`, including the "remaining frontier", from the registry [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1970].
   - `step_compile_research` writes the Divergence Map's "remaining frontier from `{state_paths.registry}`" [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2045].
   - The merged nodes carry no `_untrusted` label [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786]. So the final synthesis lists a rejected lineage's answered and open nodes as if they counted. That contradicts "An untrusted lineage claims no coverage" [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50]. This is the second, independent consumer that iteration 9 asked for.

4. **A gate can read the merged frontier on one path, so f-iter008-003 is re-graded to a logic defect at P3. This is traced, not executed.**
   - `gate_pre_synthesis` runs after `step_fanout_merge` in confirm mode, and nothing skips it on fan-out [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1974]. Its `on_B`, "Run more iterations", goes to `phase_loop` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1995], and `phase_loop` has no fan-out `skip_when` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:977].
   - In that loop, `step_graph_convergence` passes `--registry-path "{state_paths.registry}"`, which is the merged file [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1103].
   - `convergence.cjs` then counts `frontierOpen` and `frontierAnswered` over every merged node, untrusted lineages included [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1665]. Under expansive depth, an untrusted lineage's open node can hold the `frontierOpen` CONTINUE veto.
   - Severity stays P3 because the path is narrow: confirm mode only, the operator must pick B on a fan-out run, and the loop is capped by `max_iterations`.
   - The untrusted-merge code is in the window (`965b88ca150`). The gate's `on_B` predates it: `f921b2c65b0` is an ancestor of v4.1.0.0.

5. **Pre-existing, inferred, out of the window: the pre-synthesis gate's B on a fan-out run enters a main loop that `phase_init` never set up.** The base directory never ran `phase_init` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:427], yet `on_B` returns to `phase_loop` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1995]. Whether the loop fails or runs on the root config was not executed. This is recorded as a lead, not a finding in the window.

6. **The stop-identity test passes 7/7 with exit 0.** This confirms the mechanism of f-iter004-001 and does not clear it. The case "refuses a pid whose process is not the recorded lineage, or that has no recorded identity" passed. It pins a spawned row with no `process_start` as refused [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts:236], and that is the row win32 now writes [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1279]. Output: `Test Files 1 passed (1)`, `Tests 7 passed (7)`, Duration 12.07s, vitest v4.1.12, `EXIT=0`. The output was saved to the session scratchpad as `stop-identity-vitest.txt`.

## Closing Summary: confirmed findings of this run, ranked by severity
No P0 or P1 was found. Re-grade rows are folded into their parent findings. The prior run's 16 archived findings are excluded.

| Rank | Severity | Id | Finding | file:line | Commit |
|---|---|---|---|---|---|
| 1 | P2 | f-iter004-001 (+009-006) | A fan-out runner stopped by a signal leaves lineages that have no `process_start` running. That is always the case on win32. | fanout-run.cjs:1037, :1279, :1408, :1419 | `a20a1d96a05` |
| 2 | P2 | f-iter006-001 | The Stop auto-record misreads a packet path that ends at a JSON `\n` escape, so a phase child resolves wrongly. | session-stop.ts:49, :52, :831 | `d57563b175a` |
| 3 | P2 (inferred) | f-iter006-002 | An unlocked read-rebuild-rename of decision-record.md races a concurrent save, and the lost rows are still marked consumed. | decision-record-writer.ts:787, :819; session-stop.ts:216 | `d57563b175a` |
| 4 | P3 (re-graded to logic defect) | f-iter008-003 (+009-004) | The merged frontier counts an untrusted lineage's nodes. The final synthesis reports them, and a confirm-mode B re-entry gates on them. | fanout-merge.cjs:786, :803, :1887; convergence.cjs:1665; deep-research.yaml:1103, :1995, :2045; fanout-merge.md:50 | `965b88ca150` |
| 5 | P3 | f-iter002-001 | A destination that changes shape and letter case at once is refused as unowned. The case-fold fix was incomplete. | overlay-engine.cjs:2511, :2575 | `5a6f2e211c3` |
| 6 | P3 | f-iter002-002 | A layout link can delete a distinct, byte-identical user file because the `isSameFile` guard is missing. | overlay-engine.cjs:3382 (cf. :2622) | `8ab99ee8106` |
| 7 | P3 | f-iter006-003 | A failed consumed append lets the next Stop overwrite an edited row. | decision-record-writer.ts:323 | `d57563b175a` |
| 8 | P3 | f-iter003-001 | The `--extend` re-stop warning goes silent once the inbox has ever held a line, and it never fires on expansive runs. | workflow-steps.cjs:195, :206 | `2c80c64f391` |
| 9 | P3 | f-iter005-001 | In degraded mode, a refused `/deep:*` command is printed as the reader's typed choice. | skill_advisor.py:4624; skill-advisor-cli.ts:1563 | `73d98332fff` + `777feef2920` |
| 10 | P3 (cause inferred) | f-iter005-002 | The native hub leads a refused single-pass review, 0.912 against 0.877. | fusion.ts:1322 | `527fc5f9d43` (inferred) |
| 11 | P3 | f-iter007-001 (+009-005) | The operator never sees the Stop auto-record outcome, which reaches stderr only on an exit-0 hook. | session-stop.ts:217, :221, :769, :903 | `d57563b175a` |
| 12 | P3 | f-iter007-002 | A refused level-2 `create.sh` sub-track gets no remedy. | create.sh:1458, :1461 | `b0b3c8d9bf1` |
| 13 | P3 | f-iter007-003 | The non-Claude goal hop warning can be false and names no next step. | skilled-loop:486 | `12fe3abc66b` |
| 14 | P3 | f-iter008-001 (+009-001) | Provisioning can report a tree ready when skill-graph.sqlite exists but is unusable. P2 is ruled out because the advisor self-heals. | worktree-naming.sh:801, :809 | `957f47570f3` |
| 15 | P3 | f-iter008-002 (+009-002) | A failed skill-graph scan prints no reason. The exit is non-zero, but the output goes to `/dev/null`. | worktree-naming.sh:806 | `957f47570f3` |
| 16 | P3 | f-iter001-001 | The repin rollback's list-runs remedy cannot be pasted as printed. | overlay-engine.cjs:7404 | `59d26c89f38` |
| 17 | P3 | f-iter001-002 | A finished relayout's backup has no restore command. | overlay-engine.cjs:8879 | `3aab896957e` |
| 18 | By design | f-iter005-003 | A typed command beside a stuck run is offered as a rerun, not as `/doctor:deep-loop`. | deep-loop-offer-cases.json:123 | not attributed |
| 19 | No severity | f-iter009-003 | Frontier ids at depth 2 and below can collide across lineages, with no consequence shown. | frontier-admit.cjs:280, :831 | not attributed |

Totals: 3 P2 (one inferred), 14 P3, 1 by-design and 1 without severity.

## Ruled Out
- `--extend`, `step_frontier_*` and the frontier caps as post-merge readers. The first two are refused on a fan-out config, and the seed steps run before spawn, not after the merge.
- The reducer as a reader of the merged frontier. It rebuilds the frontier from the node store.
- The stuck-close gate at yaml:1388 on merged data, because the merged frontier has no `activeNodeId`.

## Dead Ends
- None new.

## Edge Cases
- Ambiguous input: "reads" was taken to include report steps as well as gates. Both are listed separately, so either reading can be applied.
- Contradictory evidence: iteration 9 and the focus prompt cited fanout-merge.cjs:1732 as the merged write. The actual write is at :1887. This is corrected above, and the conclusion does not change.
- Missing dependencies: none.
- Partial success: the confirm-mode B path (Finding 4) is traced, not executed. Its severity rests on the trace.

## SCOPE VIOLATIONS
- None. The only write outside the packet is the test output, saved to the session scratchpad.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786-814, :1715-1745, :1885-1895
- .skilled/commands/deep/assets/deep-research.yaml:218, :365-386, :410-470, :977-990, :1103, :1388, :1931-2060, :2147-2160
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1373-1396, :1660-1675
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1208-1224, :2564, :3503
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts (run)
- research/deltas/iter-001..009.jsonl (finding rows for the summary)

## Assessment
- New information ratio: 0.60. Of 5 findings, 2 are fully new: the synthesis readers (F3) and the confirm-mode gate read (F4). Two are partially new: the normal-path trace (F2) and the test run (F6). One is a citation correction (F1). The simplicity bonus is not applied, because the open question closed on new evidence rather than on synthesis alone.
- Questions addressed: Q2, the deep-loop runtime.
- Questions answered: none newly, since all five strategy questions were already ticked. The carried question "does any base-directory step read the merged `registry.frontier`" is answered yes: two synthesis report steps on the normal path, and `step_graph_convergence` on the confirm-mode B path.

## Reflection
- What worked and why: following each post-merge step in YAML order, and checking each step's skip condition, settled the question without running a fan-out. The data flow is declared in the YAML.
- What did not work and why: trusting the inherited :1732 citation. A citation reused across iterations needs a reread before it carries a conclusion.
- What I would do differently: run a scratch confirm-mode fan-out to execute the B path, instead of tracing it.

## Questions Answered
- Does any base-directory step after a fan-out merge read `registry.frontier` from the merged `findings-registry.json`? Yes. See Findings 3 and 4.

## Questions Remaining
- Can a lineage dealt zero frontier nodes seed its own `F-1-*` ids? Still unverified.
- Does the confirm-mode B re-entry on a fan-out run work at all, given that `phase_init` never ran? This is pre-existing and was not executed.

## Recommended Next Focus
The run is at its iteration cap, so synthesis is next. For a follow-up remediation, fix the three P2s first. Then gate `mergeResearchFrontier` on lineage trust, or label untrusted nodes, and either skip `gate_pre_synthesis` B on fan-out or route it to a fresh fan-out.
