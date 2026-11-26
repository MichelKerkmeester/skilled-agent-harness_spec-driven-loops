---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: v4.2.0.0 logic and features: remaining bugs, docs that drifted from the code, and bad UX in what shipped since v4.1.0.0
- Started: 2026-11-25T16:24:14Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: 2026-11-25T16:24:14Z
- Parent Session: 2026-11-25T08:04:38Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Overlay engine and doctor overlay commands: relayout, rollback, repin, json-entry merge, path and case handling in .skilled/commands/doctor/scripts/overlay-engine.cjs and its callers. | overlay-engine | 1.00 | 2 | complete |
| 2 | Overlay engine, diff-driven: sibling call sites of the json-entry fixes (512be46971a 2b9a2328922 9bee9df5cc0 a9d52c1087d cd8091a09d3 5f1af6159d0) and the layout-link letter-case fixes (8ab99ee8106 5a6f2e211c3 aba8f76e97f); close Q1. | overlay-engine | 1.00 | 2 | complete |
| 3 | Q2, the deep-loop runtime, diff-driven: list git log v4.1.0.0..v4.2.0.0 for .skilled/skills/system-deep-loop/ and .skilled/commands/deep/, then read the hunks for fan-out (fanout-run.cjs, fanout-merge.cjs), the expansive frontier and frontier_drained (frontier-admit.cjs, convergence.cjs), --extend (workflow-steps.cjs extend-research), and the append gateway. Check each against its doc (deep-research.md flag table, loop-protocol.md, convergence.md) for logic bugs and drift. | deep-loop-runtime | 1.00 | 1 | complete |
| 4 | Q2 fan-out, diff-first: read only the in-window trust and stop hunks of fanout-run.cjs and fanout-merge.cjs (git show 2bfee12379d 86f6c584b1b 4fc94bae0d3 e111720dc88 978b74e8df7), checking for logic bugs and drift from the fan-out docs. Settle the run_extended lineageId lead (workflow-steps.cjs:166 sets lineageId to parentSessionId while iteration rows use sessionId): does any reader filter on it? Then close Q2 with a verdict. | deep-loop-fanout | 1.00 | 1 | complete |
| 5 | Q3 skill advisor, diff-first: in-window hunks for loop offers, typed-only Python fallback, common-words floor, native versus Python parity; misroute probes and doc drift | skill-advisor | 0.83 | 3 | complete |
| 6 | Q4 session hooks and spec tooling, diff-first: in-window hunks for the Claude Stop decision auto-record (autoRecordDecisions), tail packet detection (collectTailSpecFolders), and nested sub-tracks in create, validate and relocate | session-hooks | 1.00 | 3 | complete |
| 7 | Q5 operator UX, diff-first: read the messages the new v4.2.0.0 commands and hooks show operators and judge each for silent failure, misleading text, unsafe defaults or dead ends: the Claude Stop nudge and the auto-record failure that only reaches the hook log, doctor overlay refusals and remedies, the --extend and fan-out stop messages, the create.sh sub-track errors, and the sk-git worktree-naming and goal hop messages. Run each where cheap and quote the exact text. | operator-ux | 0.83 | 3 | complete |
| 8 | Finish the operator UX question: read the worktree-naming.sh hunks from 957f47570f3 and 16f83331276 (.skilled/skills/sk-git/scripts/), run its provisioning and refusal messages in a scratch worktree or scratch repo, then give the operator UX verdict. If budget remains, settle the open side lead: mergeResearchFrontier (.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786) has no trust gate while fanout-merge.md:50 says an untrusted lineage claims no coverage. | operator-ux | 0.83 | 3 | complete |
| 9 | Confirmation pass on open severity questions: advisor self-heal of an empty or corrupt skill-graph.sqlite, failed skill_graph_scan exit code, cross-lineage frontier id collisions and merged-frontier readers, Claude Code Stop-hook stderr visibility, win32 signal-stop P2 | - | 0.67 | 6 | complete |
| 10 | Last iteration. Settle whether any base-directory step after a fan-out merge reads registry.frontier from the merged findings-registry.json; run the pinned stop-identity test; write the closing ranked summary | deep-loop-runtime | 0.60 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 123
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Does the overlay engine and its doctor commands (relayout, rollback, repin, json-entry merge, path and case handling) carry logic bugs in v4.2.0.0?
- [x] Do the deep-loop runtime changes (fan-out, expansive frontier, frontier_drained, --extend, convergence and the append gateway) carry logic bugs or drift from their docs?
- [x] Does the skill advisor (loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity) misroute or drift from its docs?
- [x] Do the session hooks and spec tooling (Stop decision auto-record, tail packet detection, nested sub-tracks in create, validate and relocate) carry bugs or UX friction?
- [x] Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████▇▆▆▇▇▆▅▅▅▃▂▂▁
- score sparkline: ███████▇▆▆▇▇▆▅▅▅▃▂▂▁
- Last 3 ratios: 0.83 -> 0.67 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":129,"code.claude.com":1,"other":29}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- (a) `parseArguments` treats any token whose text after its first two characters is `upstream`, `to`, `stage` or `rollback` as that flag [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975], from commit `0bfe4d6e929`. So `auto`, `onto` and `xxto` act as `--to`. Reproduced: `repin --upstream /tmp xxto deadbeef --root /nonexistent-zz` gets past parsing to `root is not a directory` (exit 2) instead of printing usage. (iteration 1)
- (b) `status --json` prints plain text, not JSON, for a usage error and for a root that is not a directory [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9020] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. That contradicts the catch block's own comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9044], from commit `f965c658d49`. Reproduced with `status --json --root /nonexistent-zz`. (iteration 1)
- (c) `repin --rollback` has no staleness guard. `backup.json` records only the bytes from before the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6641]. `rollbackUnderLock` checks only that the backup itself is intact [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. It never checks that the live tree still holds what the run wrote. So rolling back an older run after later re-pins, applies or hand edits overwrites them and removes the paths that run created. The route's plan is only a `find` listing of the run folder [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76]. This is inference and was not executed. (iteration 1)
- (d) The relayout's final `run node ... apply` line lacks the `from <root>:` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939], from commit `3d39e6a488b`. The in-window sweep `e7244e53648` left it as it was. (iteration 1)
- **`documentLayout` misreads the indent unit or line ending.** None found on a read of the opener-step logic. The function had six in-window fixes, and the archived run already holds M7 for it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220]. (iteration 1)
- **overlay.md omits `--stage` and `repin --json`.** Not drift. overlay.md documents the `/doctor:overlay` route, which uses `--stage` internally [SOURCE: .skilled/commands/doctor/overlay.md:110]. The engine's USAGE lists both flags [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:133]. A route narrower than its engine is not a contradiction. (iteration 1)
- **Pre-existing, out of window by NON-GOALS.** Each of these was blamed to a commit that `git merge-base --is-ancestor` puts before `v4.1.0.0`. They are recorded as observations, not findings: (iteration 1)
- **Rollback writes through a linked ancestor.** It does not. `isDirectory` uses `lstat`, so a link standing where a folder was is unlinked rather than followed [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:273] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7381]. (iteration 1)
- **The relayout backup skips files silently.** It does not. `copyForBackup` prints a `skipped` line for each protected path it leaves out, and the failure message names them [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580]. (iteration 1)
- Proving (c) by execution needs a live re-pin with a later edit, which writes outside this packet. It is left as inference. (iteration 1)
- **Restored dropped values keep upstream's layout, not the live file's.** This is deliberate and the same on both restore paths. `restoreDroppedSets` writes the pin's own slice back ("so the file returns to upstream's bytes") [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2112]. `restoreDroppedKeys` does the same with `pinnedValueText` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2199]. (iteration 2)
- **The `documentLayout` chain `2b9a2328922`..`5f1af6159d0` has a reader bug.** None found by reading. The reader does the following: (iteration 2)
- **The json-entry layout fixes missed an emitter.** They did not. After `512be46971a`, every value writer passes the document's `unit` and `eol`, and none uses a hard-coded `\n` or two spaces: (iteration 2)
- **The legacy flush-left rewrite skips `insertObjectKeys`.** Not a miss. Before `512be46971a`, that rewrite took its indent from `existing.keyStart`, which sits at the start of a line, so it never wrote flush-left. Only `set` and `setKeyOnItem` read the indent at the value's start, and both got the `isLegacyFlushLeft` path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1304]. (iteration 2)
- **The removal edits mangle CRLF files.** They do not. They delete from the previous item's end or to the next item's start, so they insert no line ending [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1732] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1833]. (iteration 2)
- `documentLayout` has a single caller [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228]. (iteration 2)
- `insertItems` and `appendItems` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1561] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1581] (iteration 2)
- `insertObjectKeys` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1620] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1638] (iteration 2)
- `set` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1426] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1445] (iteration 2)
- `setKeyOnItem` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1483] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1492] (iteration 2)
- It breaks ties toward the shorter step, and otherwise falls back to the shallowest indent [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220]. (iteration 2)
- It counts steps only from a line that opens one container, with strings stripped first. (iteration 2)
- It requires the next line's indent to extend the opener's. (iteration 2)
- It takes the majority line ending. (iteration 2)
- None that the reducer should treat as exhausted. The json-entry layout chain is closed for sibling sites, and a further pass on it is unlikely to pay. (iteration 2)
- The doc states the same rule [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:65], so there is no drift. (iteration 2)
- **`frontier_drained` drifts from its docs.** It does not. The research candidate needs `depthMode == expansive`, `fanoutLineage`, at least one frontier node, none open or active, and at least one answered [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1243]. `fanoutLineage` is set only when the config carries `fanout_lineage_artifact_dir` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1673], and "open" counts both `open` and `active` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1667]. That matches [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:191] and [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130]. The node-status vocabulary has no extra in-flight status that the open count would miss [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:79]. (iteration 3)
- **The `--extend-minutes` arithmetic is off.** It is not. The code computes `max(prior, elapsed) + M`, defaults M to the prior budget, and keeps no budget when the prior was 0 [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:157]. That matches [SOURCE: .skilled/commands/deep/research.md:119]. The reproduction gave 1062 = 1002 elapsed minutes + 60. (iteration 3)
- **The gateway's legacy research branch mis-mints identity.** No defect was found. It drops caller-keyed fields before the builder mints them, and it uses the gateway clock for completed iterations [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:452]. (iteration 3)
- **The research `--extend` warning should name `frontier_drained` as the review twin does.** It should not. `--extend` refuses fan-out [SOURCE: .skilled/commands/deep/research.md:118], and only a fan-out lineage forms the research candidate [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1244]. (iteration 3)
- None this iteration. The `frontier_drained` stop logic and the `--extend-minutes` arithmetic are candidates for the reducer to mark exhausted. (iteration 3)
- **A second signal re-enters the runner's stop.** It cannot. `writeStoppedSummary` returns early once it has written [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5255]. (iteration 4)
- **The `run_extended` lineageId breaks a restarted run (iteration 3 lead).** It does not, on the live path, and the line is out of window anyway. (iteration 4)
- **The exited-leader member split reads start times in the wrong zone.** It does not. Both sides are rendered under `TZ=UTC` and parsed field by field with `Date.UTC` (commit `4fc94bae0d3`) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282]. (iteration 4)
- **The research trust merge keys untrust on the wrong iteration field.** It does not. `findingUntrustReason` is passed `finding.addedAtIteration` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:841], and the reducer writes key findings with `addedAtIteration: iteration.run` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818]. (iteration 4)
- `process.on` (from `978b74e8df7`) keeps libuv catching the repeat, so the repeat no longer kills the process with the default disposition. This matches [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:183]. (iteration 4)
- Reproduced on a scratch copy of this packet, which is itself a restart (generation 2, `parentSessionId` set). `extend-research` exited 0 and staged `scope.lineageId = 2026-11-25T08:04:38Z`. The gateway accepted it (exit 0, receipt sequence 8, `projectionRefreshed: true`), and a later iteration record with `lineageId = sessionId` was accepted too (exit 0, sequence 9). (iteration 4)
- Residual: the typed reducer's `assertRunIdentity` refuses a lineageId that differs from `run_initialized`'s [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:465]. Its callers were not traced, so a typed full-ledger fold of a restarted and extended run is unverified. (iteration 4)
- The `run_extended` lineageId lead is closed for the live gateway path. The reducer can mark it exhausted. (iteration 4)
- The grace wait blocks synchronously on `Atomics.wait`, so a queued handler runs only after `process.exit` has already been called in `finally` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714]. (iteration 4)
- The research trust merge's labelling and question reopening read clean. A further pass on it is unlikely to pay, except for the frontier lead below. (iteration 4)
- The same `lineageId = lineage.parentSessionId || sessionId` was already in the v4.1.0.0 YAML at line 594 (`git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`). `d239dd6d2ae` only moved it into [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166]. (iteration 4)
- Untrusted-only answers go back to open, and the doc states the same rule [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50]. (iteration 4)
- Using the parent as the lineage id is the packet's convention, not a slip. The legacy deltas contract reads `scope.lineageId` back as `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96], and `run_restarted` takes its archived lineage from `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:654]. (iteration 4)
- Forcing the CLI degraded path: no env switch exists. It runs only when the daemon is unreachable [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1636], so finding 1's render step stays inferred. (iteration 5)
- None. (iteration 5)
- Duplicate rows when the consumed write fails. The writer keys rows by source key [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:806], and `recordConsumedKeys` skips keys already logged [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:936]. (iteration 6)
- None to promote. The relocate two-level rewrite (`relocate.mjs`) was only grep-read for depth logic and is not exhausted. (iteration 6)
- The live record in this packet holds rows Q001 to Q007, all `Recorded automatically:`, one source comment each, and no duplicates [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:37] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/decision-record.md:43]. (iteration 6)
- Two sub-track levels in the track reader: the depth guard reports a declared folder past level 2 and never reads it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41] (`MAX_SUB_TRACK_DEPTH = 2`, added in `b0b3c8d9bf1`). In `validate.sh`, sub-track detection recognizes a level-2 sub-track only directly inside a level-1 one [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:222], and the recursive walk descends exactly one more level [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:453]. `create.sh` refuses a `--track` with four or more segments and prints an actionable message (`b0b3c8d9bf1` hunk). No two-level path break was found in what was read. (iteration 6)
- `[speckit] This packet fits no existing sub-track of demo. Consider proposing a new sub-track.` printed on a level-2 create in scratch. The scratch sub-track descriptions held no keywords, so the advice is a fixture artifact and is not counted. The "fits no" branch is also unchanged in the window. (iteration 7)
- None to promote. (iteration 7)
- A scan exit code that reads success when the scan's own status is `failed`. The CLI returns `invoked.isError ? EXIT_RUNTIME : EXIT_SUCCESS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1702], and whether a failed scan sets `isError` was not traced. This is left as a lead, not counted. (iteration 8)
- The file-mode regression in `957f47570f3` was restored before the tag, as noted under Checked clean. (iteration 8)
- A unit stub of `processStartOf`: `classifyLineagesForStop`, `lineageIdentityRefusal` and `processStartOf` are not in `module.exports`. The pinned vitest case covers the same row shape. (iteration 9)
- None new. (iteration 9)
- `--extend`, `step_frontier_*` and the frontier caps as post-merge readers. The first two are refused on a fan-out config, and the seed steps run before spawn, not after the merge. (iteration 10)
- The reducer as a reader of the merged frontier. It rebuilds the frontier from the node store. (iteration 10)
- The stuck-close gate at yaml:1388 on merged data, because the merged frontier has no `activeNodeId`. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
### Iteration 9 — blocked by [sourceDiversity]
- Recovery: Clear the failed quality guards before stopping: sourceDiversity (q-002; q1; q3; q5).
- Gate results: none recorded
- Timestamp: 2026-11-25T17:09:53.633Z

### Iteration 10 — blocked by [sourceDiversity]
- Recovery: Clear the failed quality guards before stopping: sourceDiversity (q-002; q1; q3; q5).
- Gate results: none recorded
- Timestamp: 2026-11-25T17:17:58.370Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
