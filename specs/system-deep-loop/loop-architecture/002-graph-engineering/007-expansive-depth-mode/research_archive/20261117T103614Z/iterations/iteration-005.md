# Iteration 5: Q5, a concrete design for the expansive-depth sub-mode

## Focus

Q5. This iteration designs the sub-mode from iteration 4's principle catalog:
- (a) the frontier node schema and where it is stored;
- (b) worked decompositions of both example targets;
- (c) admission and pruning rules;
- (d) the depth budget and the frontier-exhaustion stop veto.

It also covers two secondary questions:
- why this run's graph `sourceDiversity` reads 0.00;
- the `evidenceRecords` trace that iteration 4 finding 14 left open.

Interpretation: the result is a design (DESIGN-level, not shipped). Code was read only to pin down storage constraints and the stop-composition point. The git log and `system-skill-advisor` were read only to make the decompositions realistic.

## Actions Taken

1. Grepped `convergence.cjs` for `sourceDiversity` and read the graph signal `computeResearchSourceDiversityFromData`. Then traced `quality_class` across the runtime: signals, query sanitizer, `iteration-graph-upsert.cjs`, `upsert.cjs` and tests. Counted the graph events in deltas 001-004.
2. Traced `evidenceRecords` in `buildStopDecisionInput` (`convergence.cjs`).
3. Profiled the last 100 commits by conventional-commit scope and by top-level path cluster.
4. Listed the layout of `system-skill-advisor`, and read the exports of `prompt-policy.ts` (`shouldFireAdvisor` skip reasons) and `command-attach.ts`.
5. Listed the `specs/system-skill-advisor/routing-and-scoring` children to use as the dedupe set for admission.

## Findings

### Secondary: two code-backed findings

1. **The graph `sourceDiversity` reads 0.00 because nothing produces `quality_class`.**
   - The research graph signal does not count sources. For each QUESTION node it counts the distinct `metadata.quality_class` values on SOURCE nodes that are cited by findings answering that question. It then averages over all QUESTION nodes, so unanswered questions count in the denominator too. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:680]
   - The threshold is 1.5, with the role `blocking_guard`. Below it, a `source_diversity_guard` blocker is pushed. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:437] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:448]
   - The plumbing would carry the value:
     - `quality_class` is on the metadata allowlist [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:131].
     - The delta splitter spreads every node field through [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:143].
     - `upsert.cjs` stores `metadata` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:235].
   - No producer sets the value. A repo grep for `quality_class` under `system-deep-loop` hits only the signal, the sanitizer and two test files, which hand-build `metadata: { quality_class: 'primary' }` [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:49].
   - The prompt pack's mandated node shape has no `metadata` field. This run's SOURCE nodes carry only `id`, `kind`, `label` and `path` [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deltas/iter-002.jsonl:1].
   - So a contract-compliant research run scores 0 on every question, however many sources it cites.
   - [INFERENCE: based on the signal code and the absent producer] For contract-compliant research runs, the graph STOP gate's sourceDiversity check is unsatisfiable. A graph decision that requires every trace entry to pass (iteration 1 F8) can then never reach `STOP_ALLOWED` on research. To confirm, run `convergence.cjs` read-only on this packet and read `graph_decision`.

2. **Two different metrics share the name `sourceDiversity`.**
   - The quality-guard `sourceDiversity` counts cited sources per answered question (iteration 1 F7) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:858].
   - The graph signal counts distinct quality classes (finding 1) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1744].
   - The dashboard's "sourceDiversity 0.00" is the graph signal. Adding more sources can never raise it.

3. **Iteration 4 finding 14 is settled: focusAlignment is `notEvaluated` on research runs.**
   - `buildStopDecisionInput` builds `iterationRecords` from `files.stateLogRows`, then filters them into `evidenceRecords` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1594] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1597].
   - Those are gateway projection rows, and they lack `keyQuestions` (iteration 4 F12).
   - So the guard's both-lists filter never matches.
   - This corrects iteration 1 F6: the guard does not penalize widening on research today. It would start to if the projection ever kept `keyQuestions`, and the sub-mode must not depend on that.

4. **Live evidence that gateway-path graph events are fragile.** Delta 001 carried 17 node events, delta 002 carried 20, delta 003 carried 1 and delta 004 carried 0 (counted by grep over `deltas/iter-00N.jsonl`). The graph's question set and coverage therefore depend on each leaf remembering to emit graph events. The sub-mode cannot treat leaf-emitted QUESTION nodes as the frontier's source of truth. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deltas/iter-004.jsonl:1] [INFERENCE: based on the per-delta counts]

### (a) Frontier node schema and storage

5. **The schema** (DESIGN). [INFERENCE: from iteration 4 F1-F3 and F10, and findings 3-4 here]

   ```json
   {"type":"frontier_node","id":"fn-<stable-slug>","parentId":"fn-root|null","depth":0,
    "kind":"root|subsystem|batch|surface|question|drift-pair",
    "loopType":"research|review","label":"...","scope":{"paths":[],"commits":"<range>","questionId":"q-..."},
    "budget":{"iterations":2,"toolCalls":48,"childSlots":4},
    "status":"open|active|answered|blocked|exhausted|abstained|pruned",
    "statusReason":"...","provenance":{"proposedBy":"iteration-N|init","evidence":["path:line"],"admittedAt":"iteration-N"},
    "dedupeKey":"<normalized scope digest>"}
   ```

   - `status` uses the obligation vocabulary from S4/S6: `answered`, `blocked`, `exhausted` and `abstained` are terminal and accounted; `pruned` is terminal and never worked.
   - `budget` is a slice of its parent and can only narrow (iteration 4 F2).

6. **Storage: three places, none of them on research state-log rows.** The gateway's legacy upcast drops non-core fields (iteration 4 F12), and `convergence.cjs` reads only those rows as iteration evidence (finding 3). So:
   - **Admission log (canonical growth path):** `research/inbox.jsonl` rows with `origin: "frontier"` (a new origin value) carry the node. The inbox is the only channel that grows the registry's question set (iteration 2 F3). The writer is the workflow step, never the leaf.
   - **Registry projection:** a new `findings-registry.json` field `frontier: { nodes: [...], stats: {open, terminal, pruned, maxDepthReached, budgetSpent} }`, rebuilt by the reducer from inbox rows and status transitions. This is the stop veto's input.
   - **Traversal view:** every admitted node of kind `question` (and every other kind, as a QUESTION node with a `DERIVED_FROM` edge to its parent) is upserted into the coverage graph by the workflow, not the leaf. This removes the dependence on leaf graph-event discipline that finding 4 shows. Uncovered QUESTION nodes then rank focus (iteration 4 F5).
   - The leaf's contribution is a typed `frontier_proposal` row in its delta file. Delta files are read whole by the reducer, so the row survives the gateway's field loss (iteration 4 F13).

   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1597] [INFERENCE: based on iteration 2 F3, iteration 4 F12-F13 and finding 4]

### (b) Worked decompositions

7. **Target 1, "the last 100 commits: bugs, drifts, improvement opportunities", is review-shaped.**
   - Real profile of `git log -100` at the time of reading (oldest commit `6e86790c72a`):
     - 20 merges;
     - 32 `chore(system-spec-kit)` commits, mostly trigger-index rebuilds (the HEAD commit is one);
     - 9 `docs(changelog)` commits;
     - the rest spread over `system-skilled-doctor`, `decision-capture`, `session-handover`, `sk-doc` and `sk-code`.
   - Top path clusters by file touches: `specs/system-skilled-doctor/001-*` (320), `.skilled/skills/system-spec-kit` (198), `specs/hooks-plugins-extensions/session-handover` (196), `specs/sk-doc/document-standards` (150), `specs/sk-code/hub-architecture` (98), `.skilled/skills/sk-doc` (72), `decision-capture` specs (63) and hooks (29), `.skilled/commands/doctor` (32), `specs/system-skill-advisor/routing-and-scoring` (31). [SOURCE: git log -100 --name-only, run 2026-11-17]
   - Decomposition, with `loopType: review` on every work node:
     - **depth 0:** `fn-root` "commits HEAD~100..HEAD".
     - **Init-time pruning:** the 20 merges are pruned as `merge-no-own-diff`. The trigger-index `chore` rebuilds are pruned as `generated-artifact`, unless they touch source beyond the index; then one sampled node checks the generator's determinism. Both are pruned before any iteration, so the 52 commits cost nothing.
     - **depth 1, subsystem nodes from path clusters:** doctor (skill and command), spec-kit runtime, session-handover (hook plus specs), decision-capture (hook plus specs), sk-doc, sk-code, skill-advisor routing. That is 7 nodes, within a fan-out cap of 8.
     - **depth 2, per subsystem:**
       - `batch` nodes of at most 10 consecutive in-cluster commits, reviewed on the four existing dimensions;
       - one `drift-pair` node per (code path, doc path) pair changed in the window, for example `.skilled/hooks/session-handover` against its spec and README. The drift edge is the review question "does the doc still describe the code".
     - **depth 3 (admitted only on evidence):** a `question` node when a batch review finds a suspected bug or drift whose cause lies outside the batch.
   - The fan-in reduces per batch, then per subsystem, then for the target (iteration 4 F7).

8. **Target 2, "system-skill-advisor chat-time auto-utilization", is research-shaped.** The surfaces come from the live code:
   - **`surface: prompt-policy gate`.** `shouldFireAdvisor` skips with reasons `skip_command`, `short_casual_acknowledgement` (visible chars at or below `MIN_VISIBLE_CHARS` and casual, with no work intent) and `below_prompt_policy_threshold`. These are exactly where "just chatting" prompts lose a recommendation. Child questions: which casual-but-intentful prompts fall below the floors, and what the env-tunable thresholds trade off. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:126] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:160] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:217]
   - **`surface: command surfacing`.** `COMMAND_POLICIES` (`run | start | ask`), `DEPTH_WORDING`, `typedCommandForTop` and `attachCommand`. Child questions: does chat phrasing trigger depth wording, and do `ask`-policy commands surface in chat at all. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:123] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:307]
   - **`surface: scorer`** (`runtime/lib/scorer`, `df-idf.ts`). This covers the confidence floor of 0.8 versus chat-length prompts.
   - **`surface: hook adapters`.** These are `hooks/claude`, `dsh`, `pi` and `vibe`, plus `skippedAdvisorResultFor` and the fallback directive. Child questions cover per-runtime parity. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55]
   - **`surface: chat-intent classes`.** A synthesized taxonomy node covering casual question, latent task, follow-up and meta-question. It is admitted at depth 2 only after the gate and scorer nodes return evidence.
   - **Dedupe set:** the 10 existing `specs/system-skill-advisor/routing-and-scoring/001-010` packets, for example `007-command-surfacing-and-workflow-enforcement` and `008-command-surfacing-build`. A proposed node whose scope digest matches a shipped packet is admitted only as a `question` asking "what did 00N leave open", never as a fresh survey.
   - **Mixed loop types:** all nodes run `loopType: research`, except an optional depth-2 `review` node on `prompt-policy.ts` thresholds once a concrete defect is suspected.

   [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:126] [INFERENCE: node list from directory listings of the advisor runtime/lib, hooks and routing-and-scoring specs]

### (c) Admission and pruning rules

9. **Admission order**, adapted from reference/03's registry, policy, budget, depth, reachability, acyclicity (iteration 4 F2). A proposal is checked in this order, and the first failure records `pruned` with the reason:
   1. **Relevance gate:** the proposal must cite at least one evidence anchor (`path:line` or commit) produced while working its parent node, and its scope must intersect the root scope. Otherwise `pruned: off-target`.
   2. **Dedupe:** the normalized `dedupeKey` must not match an existing frontier node, a registry question, a `rejected_pattern` entry or a strategy Exhausted Approach. Otherwise `pruned: duplicate` or `pruned: exhausted-approach`.
   3. **Depth cap:** `depth <= maxDepth` (default 3).
   4. **Fan-out cap:** the parent's admitted children must be at most `maxChildrenPerNode` (default 6), and the run total must stay at most `maxFrontierNodes` (default 40).
   5. **Monotone budget:** the child's budget slice is at most the parent's remaining budget divided by its remaining child slots. The sum of children never exceeds the parent's remaining budget, and a child never widens its parent's slice.
   6. **Acyclicity:** a node may not list an ancestor's scope as its own.

   - **Pruning is also allowed after admission.** A node whose first iteration returns `newInfoRatio < convergenceThreshold` with no child proposals closes as `exhausted`, and its unspent slice returns to its parent's pool.

   [INFERENCE: from iteration 4 F2 and F6 and iteration 2's rejected-pattern cache]

### (d) Depth budget and the stop veto

10. **Depth budget.** The run budget is `maxIterations`, split by depth with geometric narrowing: depth 0 and 1 get 50%, depth 2 gets 35% and depth 3 gets 15%. A level's unused share rolls down, never up. When a depth's share is spent, open nodes at that depth close `exhausted: budget` instead of the run continuing. [INFERENCE: from iteration 4 F2 (narrow-only nested budgets) and F3]

11. **The frontier-exhaustion veto and how it composes with the existing stop** (DESIGN, additive). Iteration 1 F1 gives the existing order. The veto slots in after the minIterations floor, beside the quality guards:
    - **Hard stops stay first and win:** the max-iterations cap, 3 consecutive failures, the pause sentinel and `off`/`max-iterations` policies are unchanged.
    - **The veto only converts a STOP candidate (vote or `all_questions_answered`) into CONTINUE.** It applies when `expansiveDepth.enabled`, the registry's frontier has at least one `open` or `active` node, and the depth budget is not spent. The reason is `frontier_open`.
    - **It never creates a STOP.** When the frontier is fully terminal, the existing vote, guards and graph decision decide as today.
    - **Stuck handling is local.** When a node hits the stuck threshold, the veto layer closes it `exhausted` and advances focus to the next open node. Global `STUCK_RECOVERY` fires only when no open node remains.
    - **It reads only the registry `frontier` projection and the graph,** never iteration records, because research state-log rows lose fields (finding 3).
    - **Default runs are unchanged by construction.** With the flag off, or the frontier absent or empty, the veto is a no-op.
    - **The graph decision stays a guard.** Under expansive mode, the graph sourceDiversity blocker should be reported as `notEvaluated: no quality_class producer` rather than counted as a pass. Otherwise a run whose frontier closes would still be blocked forever (finding 1).

    [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:448] [INFERENCE: from iteration 1 F1 and F8, iteration 4 F4, and findings 1 and 3]

12. **Focus selection under the sub-mode.** The reducer's Next Focus picks the open frontier node by a fixed key: lowest depth first, then a node with no covering FINDING in the graph, then the oldest admission. So breadth at a level completes before depth, and readiness streams (iteration 4 F8). This new branch sits ahead of the existing precedence only when the flag is on. That also stops the "Questions Remaining free text takes over Next Focus" failure (iteration 2 F6), because frontier ids, not prose, choose the next focus. [INFERENCE: from iteration 2 F1 and F6 and iteration 4 F5 and F8]

13. **Fan-out mapping.** With native fan-out, partition the open depth-1 nodes across flat-pool lineages, giving each lineage a distinct `scope` rather than the same topic. Join through the existing deterministic merge, with a fan-in input-count guard: every depth-1 node must be accounted for. This replaces only the topic-copy behavior that iteration 3 F8 recorded. [INFERENCE: from iteration 3 F8 and iteration 4 F6 and F7]

## Questions Answered

- Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?

## Questions Remaining

- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?

## Ruled Out

- Storing frontier state on research iteration records. The gateway drops the fields, and `convergence.cjs` reads only those rows (finding 3, iteration 4 F12).
- Treating leaf-emitted QUESTION graph events as the frontier's source of truth. Emission is inconsistent: 17, 20, 1 and 0 node events across the 4 deltas (finding 4).
- Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes. The prompt contract mandates exact node shapes, and doing so would alter the live stop behavior of the run under study.

## Dead Ends

- None new.

## Edge Cases

- Ambiguous input: "where it lives" could mean one store. The design uses three stores with distinct owners, and the stop veto reads only the registry projection.
- Contradictory evidence: iteration 1 F6 (focusAlignment penalizes widening) contradicted iteration 4 F14 (probably not evaluated). Finding 3 here resolves it in favor of iteration 4: the guard is `notEvaluated` on research today.
- Missing dependencies: the advisor scorer internals (`runtime/lib/scorer`) were not read. The scorer node in finding 8 rests on the directory name and on CLAUDE.md's 0.8 confidence rule, not on scorer code.
- Partial success: none.

## SCOPE VIOLATIONS

- scope_violation (not executed): `progressiveSynthesis` is true, which would call for updating `research/research.md`. The prompt pack's allowed write list names only this narrative, the delta file and the gateway's own writes. `research/research.md` was not touched, as in iteration 4.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653-690
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:120-140, 251
- .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:136-146
- .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:235
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:437-449, 858, 1407-1420, 1594-1600, 1725-1745
- .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:49
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deltas/iter-001..004.jsonl (graph event counts)
- git log -100 (scope and path profile)
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:126-217
- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:15-395 (exports)
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55
- specs/system-skill-advisor/routing-and-scoring/ (child listing)

## Assessment

- New information ratio: 0.85. Of 13 findings, 9 are new (1, 2, 4, 5, 6, 7, 8, 9, 10) and 4 are partly new (3, 11, 12 and 13 refine iterations 1-4): (9 + 0.5 × 4) / 13 = 0.846, rounded to 0.85.
- Questions addressed: Q5, the sourceDiversity anomaly, and iteration 4 F14.
- Questions answered: Q5.

## Reflection

- **What worked and why:** tracing `quality_class` from the consumer to the absent producer explained the 0.00 in four greps. Profiling the git log by scope and path gave real pruning ratios: 52 of 100 commits pruned before work.
- **What did not work and why:** the scorer and the per-runtime hook adapters were not read, because the budget went to the stop-path traces. The target 2 decomposition is therefore shallower on scoring.
- **What I would do differently:** run `convergence.cjs` read-only on this packet to confirm the graph decision's blockers directly, rather than inferring them from code.

## Recommended Next Focus

Q6. Map the integration surface file by file:
- the flag and config (`antiConvergence.expansiveDepth` or a sibling block, and the `--expansive-depth` command flag);
- the agent contract addition (`frontier_proposal` delta rows) in `deep-research.md` and `deep-review.md`;
- the YAML admission step that writes inbox rows and upserts QUESTION nodes;
- the reducer `frontier` projection and the Next Focus branch;
- the convergence veto insertion point;
- the mode registry entry;
- the fan-out scope partition.

Also confirm that default runs stay byte-identical, and note the `quality_class` producer gap as a separate defect.

## Next Focus

Q6: integration surface for the expansive-depth sub-mode across agents, commands, YAMLs, reducer, mode registry and convergence.cjs, with the default path unchanged.
