# Iteration 14: Fan-out and Lineage as Graph Branches

## Focus
Map the live fan-out runner and research divergent-pivot input machinery onto graph primitives: parallel/map branches, isolated subgraphs, fan-in joins, governed branch selection, backtracking, and the boundaries that must remain stronger than generic graph parallelism.

## Actions Taken
- Read the authoritative iteration prompt pack, configuration, state log, strategy, and findings registry before selecting the focus.
- Verified that the write-once iteration and delta paths were absent before writing.
- Ran a bounded local symbol search over `fanout-run.cjs`, then narrowed the evidence path after a recursive search timed out.
- Inspected the fan-out prompt/dispatch, asynchronous process, executor-command, lineage-artifact, and completion-validation sections together with `divergent-research-pivot.ts`.

## Findings
1. **[P1] Fan-out is an explicit branch frontier, but its current scheduler is deliberately flat-pool rather than graph-native wave routing.** The runner admits only `research` and `review` fan-out loop types, iterates configured executor lineages, rejects `wave` assignment and dependency/touch metadata when the conflict-safety substrate is unavailable, and rewrites accepted execution to `flat_pool`. This maps cleanly to a graph `map`/`Send` frontier, but the current code does not establish graph edges for `depends_on` or a graph scheduler; those semantics are rejected rather than silently approximated. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432]
2. **[P1] Each lineage is a detached subgraph with a concrete artifact boundary, stronger than ordinary shared graph state.** `buildLoopPrompt` binds a lineage label, session ID, executor kind, and `lineageDir`; the prompt explicitly directs every output to that directory, and native invocation passes `--fanout-lineage-artifact-dir`. The execution/finalization path then records invocation metadata, installs a write guard, keeps logs under the lineage directory, runs salvage, and requires lineage-local artifacts and state records before completion. This is a filesystem-enforced branch boundary (with a prompt-only caveat for some CLI executors), not merely a logical state key. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1085-1165] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1168-1203] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2640]
3. **[P1] Parallelism and executor diversity are already first-class runtime concerns.** `runLineageProcess` uses asynchronous `spawn`, tracks active children, drains output, applies a timeout, and converts termination into a typed result so the pool can overlap lineages. Separate command builders fingerprint and launch Codex, Claude, native OpenCode, and CLI OpenCode styles with effective model, permission, sandbox, and web-search configuration. A graph adapter should therefore wrap this process boundary as a branch executor instead of replacing it with an unbounded model-generated node. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1352-1456] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1555-1702]
4. **[P1] Divergent pivot preparation is a governed graph-branch selector with deduplication and backtracking inputs, not an executor.** The research adapter derives candidate seeds from open/carried questions, contradiction records, verification gaps, missing source classes, and alternate evidence methods; it renders three analytical/critical/pragmatic seat mandates; and it carries current focus, saturated directions, ruled-out directions, prior selections, and rejected candidates into a deduplicated frontier. The imported `PivotConfigInput`, seat, usage, and candidate types tie this preparation to the authoritative divergent-pivot mechanics, while the adapter itself only prepares input and must not be treated as the focus writer. In graph terms, it supplies a conditional-routing proposal plus a backtracking frontier; the transaction remains the authority boundary. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:25-58] [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:198-285] [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:292-315] [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:322-442] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts: imported contract at lines 12-17]
5. **[P1] The graph model adds visibility and join semantics, but fan-in must preserve lineage isolation and evidence authority.** The natural mapping is fan-out executor entries → parallel graph branches, lineage-local state/artifacts → branch-local subgraph state, pivot seats → conditional branch selection, and `fanout-merge.cjs` → the join/reducer that admits only validated lineage outputs. Shared graph state can expose branch progress, support pruning on budget/error/saturation, and detect cycles before dispatch; it must not become a second append authority or allow one branch to write another branch's packet. Exact merge conflict ordering and reducer behavior remain a verification gap because this pass did not perform a fresh direct read of `fanout-merge.cjs`; the existing lineage artifact/state checks are the minimum precondition for a safe join. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:228-290,553-718,2331-2640; .opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs; specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md; specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-013.md]

## Ruled Out
- Treating rejected `wave`, `depends_on`, or `touches` metadata as if it already formed a graph scheduler; the runner explicitly falls back to `flat_pool`. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432]
- Treating candidate preparation or seat output as authoritative focus mutation; the adapter returns preparation input and imports the separate divergent-pivot mechanics contract. [SOURCE: .opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:322-442]
- Sharing mutable authoritative packet state across branches before a validated fan-in; this would weaken the existing lineage write boundary. [INFERENCE: based on .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2331-2640 and specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
- Reopening live graph-database execution or database-first migration; prior packet state records the native-module failure and strategy marks that direction blocked. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events]

## Dead Ends
- The initial broad recursive search for the pivot symbol exceeded the command timeout. A direct `find` over `.opencode` and file-scoped `grep` recovered the canonical research adapter path without retrying the same broad search.
- Exact `fanout-merge.cjs` conflict-order semantics were not freshly verified in this bounded pass; do not promote an implementation claim about merge ordering until that file is read directly.

## Edge Cases
- Ambiguous input: none; the prompt's explicit fan-out/lineage focus was narrower than the strategy's generic reducer-snapshot next focus and was selected.
- Contradictory evidence: none newly found. The graph mapping is an architectural inference, not evidence that current fan-out is already a graph runtime.
- Missing dependencies: direct live graph execution remains unavailable per prior state; static source analysis was used instead. The exact merge implementation was not reread in this pass.
- Partial success: the branch, executor, isolation, and pivot findings are supported; merge conflict semantics and live parity remain open, so the next implementation/research step must verify them.

## Sources Consulted
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-432,1085-1203,1352-1456,1555-1702,2331-2640`
- `.opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:25-58,198-315,322-442`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:12-17` (imported mechanics contract)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` (merge boundary named for follow-up verification)
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md`
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-013.md`
- `specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103`
- `specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events`

## Assessment
- New information ratio: **0.80** (three findings are fully new implementation detail and two partially refine prior fan-out/graph mapping; no simplicity bonus claimed).
- Questions addressed: Q5 fan-out/lineage graph mapping; residual Q1/Q5 branch-isolation and authority boundaries.
- Questions answered: fan-out as parallel branches, detached lineage subgraphs, executor process boundary, and pivot candidate frontier semantics.
- Questions remaining: exact `fanout-merge.cjs` reducer/ordering rules; deterministic adapter/replay fixture and production convergence parity; 024 verification; owner-approved accounting for 034 and 036-046.

## Reflection
- What worked and why: narrow file-scoped searches plus contiguous source ranges exposed the branch contract, write boundary, executor matrix, and pivot frontier without rereading the already-saturated graph-database path.
- What did not work and why: a repository-wide recursive grep timed out before producing evidence; the broad search traversed unrelated phase material instead of the known runtime directory.
- What I would do differently: start with the known `.opencode/skills/system-deep-loop` root and read `fanout-merge.cjs` alongside the runner before making any claim about merge conflict order.

## Questions Remaining
- Branch-to-join replay and fanout-merge ordering remain to be verified (see state record).

## Recommended Next Focus
Read `fanout-merge.cjs` directly and build the deterministic branch-to-join replay fixture: verify logical ordering, duplicate/equivalent lineage handling, failure salvage, and graph-off/database-unavailable parity without moving authority from the append-only ledger or weakening `lineages/{label}/` containment.

## SCOPE VIOLATIONS
None. No researched target or reducer-owned file was modified.
