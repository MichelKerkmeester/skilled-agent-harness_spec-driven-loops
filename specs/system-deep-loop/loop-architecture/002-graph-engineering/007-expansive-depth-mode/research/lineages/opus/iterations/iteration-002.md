# Iteration 2: Orchestration robustness (F-1-003)

## Focus
Frontier node F-1-003 covers six parts: process tree and kill semantics, mid-run provider quota and `--only-lineage` reruns, re-entrancy, the ledger as the only live view, capability-aware dealing of frontier nodes, and a root dashboard.

Backlog rows 3, 5 and 10 are already built: the root config at spawn, per-lineage outcomes with a rerun command, the finished-lineage skip and `--only-lineage`, and the live-lineage refusal. This pass reads that code and reports only what is still missing.

## Actions Taken
1. Read the TSX re-exec bootstrap, both signal handler sets and `terminateLineageProcess` (`fanout-run.cjs`).
2. Read the live-lineage refusal (`fanout-run.cjs` with `isLineageAlive` and `collectOpenLineages` in `fanout-pool.cjs`).
3. Read the quota failure path, the retryability derivation, `rerunCommandFor` and `buildLineageOutcomes`.
4. Read `partitionFrontierNodes`, the seed node shape and the executor `liveTools.webSearch` policy.
5. Read the progress heartbeat, then this run's own root `orchestration-status.log`.

## Findings
1. **Kill semantics: only SIGINT and SIGTERM on the outer runner reach the lineages.**
   - The outer process re-executes itself under `--import tsx` and forwards just SIGINT and SIGTERM to that child. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:70-100]
   - The child's handlers kill every lineage *process group*, because lineages spawn `detached` as group leaders. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:474-487] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:723-727] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:848-869] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2432]
   - Three paths leave the lineage CLIs orphaned:
     - SIGKILL to the outer pid, which is what a watchdog's `kill -9` sends;
     - SIGHUP when the terminal closes, which neither handler list includes;
     - `kill -- -<runner pgid>`, which cannot reach the lineages because they lead their own groups.
   - The inner child also never notices that its parent died.
   - **Change:**
     - (a) add SIGHUP to both handler lists;
     - (b) in the TSX child, watch for parent death (`process.stdin` end when piped, or `process.ppid` turning 1, polled every few seconds) and run the same `writeStoppedSummary`;
     - (c) add `fanout-run.cjs --stop --base-artifact-dir <dir>`, which reads the ledger's `spawned` pids through the existing `collectOpenLineages` and `isLineageAlive`, then sends SIGTERM to each live group.
   - Value H, effort S, risk L.
2. **The live-lineage refusal names the pids but offers no way to stop them.**
   - The refusal says `Stop it before re-running`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4089-4102]
   - It detects liveness by probing `-pid` and `pid` with signal 0. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:284-321]
   - **Change:** print the `--stop` command from finding 1(c) in that message, as `rerun_command` already does for failures. Value M, effort S, risk L.
3. **A quota rerun repeats the exhausted provider.**
   - A quota failure is named (`failure.reason = 'quota'`) from the provider's words, and the failure class leaves it non-retryable, so no retry burns the allowance. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4735-4750] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/result-envelopes/legacy-shadow.ts:96-108]
   - But `rerunCommandFor` rebuilds the original argv with `--only-lineage <label>`, so the rerun points at the same matrix entry and the same exhausted provider. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1267-1277]
   - The gen2 review recovery needed a hand-written `fanout-config-recovery.json` to move deepseek from opencode-go to llmgateway. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json]
   - **Change:** add `--lineage-override '<label>={"model":...,"kind":...}'`, applied after matrix parsing and only together with `--only-lineage`. Then emit a quota outcome's `rerun_command` with a placeholder override and a note naming the exhausted provider.
   - The resumed lineage keeps its directory and session. The finished-lineage executor refusal does not apply, because the lineage is unfinished.
   - Value M-H, effort S, risk L.
4. **Re-entrancy has a race window before the first spawn.**
   - The only guard against two runners on one packet is the ledger's `spawned` rows. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4089-4102] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4532-4544]
   - Two runners that start inside the same setup window (config parsing, seed partition, finished-lineage classification) both read no live lineage, and both spawn into the same lineage directories.
   - **Change:** take an exclusive `O_EXCL` runner lock at `<base>/.fanout-run.lock` that holds the outer and inner pids and the run id. Refuse when its holder answers `isLineageAlive`, and take over the lock when the holder is dead.
   - Value M, effort S, risk L.
5. **The ledger, the only live view, says that lineages are alive but not how far along they are.**
   - Progress rows carry only `duration_ms` and pool gauges. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2206-2223]
   - This run's own root ledger shows only `{"event":"progress","label":"opus","duration_ms":540011,"gauges":{...}}` once a minute. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/orchestration-status.log]
   - **Change:** in `onProgress`, read each lineage's state log tail and registry frontier stats, and add `{iterations, lastCommitAt, stopRows, nodes:{answered,open,total}, unexaminedPasses}` to the progress row. The last field comes from iteration 1's `passEvidence`.
   - Value H, effort S, risk L.
6. **A root dashboard is a render of that enriched ledger.**
   - The fan-out root keeps no dashboard by design: the completed-dashboard refresh and the terminal heartbeat skip under `config.fanout`. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2135-2143]
   - `status.cjs` accepts only `loopType`, `readOnly`, `sessionId` and `specFolder`, and nothing renders a fan-out. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/status.cjs:37]
   - **Change:** add `fanout-run.cjs --status --base-artifact-dir <dir>`, a read-only table with one row per lineage built from the last enriched progress row. It shows state, iterations against budget, last commit age, nodes answered against dealt, and flagged passes. The conductor can poll it, and it needs no writer of its own.
   - Value M-H, effort S-M, risk L.
7. **Dealing ignores what a lineage can do.**
   - `partitionFrontierNodes` deals open depth-1 nodes round-robin in id order. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:354-364]
   - The gen3 conductor had to place the web question at F-1-005 by hand so that it would land on opus. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md:94-99]
   - Each lineage's web capability is already resolved as `liveTools.webSearch`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2565] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:40-45]
   - **Change:**
     - accept an optional `needs: ["web"]` on seed rows;
     - give each lineage a capability set from its kind plus `webSearch !== 'disabled'`;
     - deal the needs-tagged nodes first, round-robin among capable lineages, then the rest round-robin as now.
   - The deal stays deterministic, so the merge's partition guard still checks node ids. A needs-tagged node with no capable lineage is refused before spawn.
   - Value M, effort S-M, risk L.
8. **An observed gap with no change proposed: the partition guard sees only node ids.** The gen3 deepseek topic drift was fixed by stopping a drained lineage (row 7, built in `b3fea67595e`). The guard still cannot see a lineage working another lineage's *question* through its topic text, but with the drain stop that path should no longer occur. I list it as watch-only. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md:182-193] [INFERENCE: based on commit b3fea67595e "stop a fan-out lineage once its frontier share drains"]

## Questions Answered
- F-1-003 (orchestration robustness): each of its six parts has one concrete change, with value, effort and risk (findings 1-7).

## Questions Remaining
- Prior art (F-1-005) and the two depth-2 follow-ups under F-1-001 (F-2-006 log shapes, F-2-007 thresholds).

## Ruled Out
- **A run-level lock through `loop-lock.cjs`.** That lock is per-loop and per-artifact-dir, and the lineages already hold their own. A runner lock at the base directory is simpler (finding 4).
- **Treating a quota hit as retryable.** That would burn the same allowance again. The current non-retryable class is right; only the rerun path is missing.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: "kill semantics" could mean either the runner killing lineages or an operator killing the runner. I covered both: the runner side works on SIGINT and SIGTERM, and the operator side has the gaps.
- Contradictory evidence: the gen3 log says killing "the runner PID" misses the lineage CLIs. The code forwards SIGTERM, so a plain `kill <outer pid>` does reach them. The miss holds for SIGKILL, SIGHUP and group kills only. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:89-93]
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `runtime/scripts/fanout-run.cjs`: 30-37, 60-100, 340-400, 462-500, 723-727, 840-870, 1267-1310, 2195-2223, 2565, 4080-4110, 4148-4196, 4528-4552, 4725-4765
- `runtime/scripts/fanout-pool.cjs`: 120-145, 280-340, 737-760
- `runtime/lib/result-envelopes/legacy-shadow.ts`: 85-110; `runtime/lib/deep-loop/executor-config.ts`: 40-85
- `runtime/scripts/status.cjs`: 1-30; `deep-research.yaml`: 2135-2153
- `research/orchestration-status.log` (this run); `review/fanout-config-recovery.json`; `scratch/dogfood-research-gen3.md`

## Assessment
- New information ratio: 0.81
- Questions addressed: F-1-003
- Questions answered: F-1-003

## Reflection
- **What worked:** reading the built rows' code first. It showed the finished-lineage skip, outcome rows and live refusal already exist, so the findings name only the gaps.
- **What did not work:** taking the gen3 log's kill claim at face value. The code shows that SIGTERM is forwarded, so the claim had to be narrowed.
- **What I would do differently:** run a live SIGKILL probe on a stub runner. I skipped it because it would spawn processes outside the lineage's remit.

## Recommended Next Focus
F-1-005: prior art from the web (Inspect eval sets, OpenHands, LangGraph, the Claude Agent SDK, AutoGen) on worker honesty, heterogeneous executors and partial reruns.
