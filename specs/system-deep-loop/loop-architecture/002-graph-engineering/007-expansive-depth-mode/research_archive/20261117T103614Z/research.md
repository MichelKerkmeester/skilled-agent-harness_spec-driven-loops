---
title: "Expansive-depth sub-mode for deep-research and deep-review: diagnosis, design and integration map"
description: "Why the deep-loop research and review loops stop early and stay on their init-time questions, and an additive opt-in frontier sub-mode (--depth-mode=expansive) that widens and deepens scope, with a file-by-file integration map and the defects found on the way."
trigger_phrases:
  - "expansive depth mode"
  - "depth-mode expansive"
  - "frontier veto"
importance_tier: "normal"
contextType: "research"
---
# Expansive-depth sub-mode for deep-research and deep-review

Synthesis of 7 native `@deep-research` iterations, run 2026-11-17, session `2026-11-17T07:52:43.000Z`. The iteration narratives in `research/iterations/` are the primary record, and every claim below cites one of them or the code they cite. Labels: **CONFIRMED** means a code trace or a live run showed it. **INFERENCE** means it is derived and names its check. **DESIGN** means a proposal, not shipped behavior.

## 1. Executive Summary

The loops do not stay narrow because their thresholds are too low. They stay narrow because **every stop signal and every focus source is anchored to the question set written at init, and nothing in the runtime grows that set during a run**. So a loop that answers its 3-7 init questions narrowly looks exactly like a converged one. [SOURCE: research/iterations/iteration-001.md] [SOURCE: research/iterations/iteration-002.md]

None of the existing breadth levers does all three things a widening mode needs:
- **discover** new scope;
- **steer** focus toward it;
- **count** it in the stop decision.

The coverage graph discovers but does not steer. The divergent pivot steers but does not discover. `wave_orchestration` would partition work, but it never runs. [SOURCE: research/iterations/iteration-003.md]

The recommended design is an additive, opt-in **frontier sub-mode** behind a separate flag, `--depth-mode=default|expansive`, for both loop types:
- **Proposals:** the leaf proposes typed `frontier_proposal` rows in its delta file.
- **Admission:** a workflow step admits them under depth, fan-out, budget and dedupe rules, then writes them to `research/inbox.jsonl`, the one channel that already grows the counted question set.
- **Projection:** the reducer projects a `frontier` field into the findings registry.
- **Focus:** Next Focus picks the open node with the lowest depth.
- **Stop:** `convergence.cjs` gains one veto, `frontierOpen`, placed after the `minIterations` floor. It can only turn a STOP candidate into CONTINUE while frontier nodes are open, and it is unreachable when the flag is off. [SOURCE: research/iterations/iteration-005.md] [SOURCE: research/iterations/iteration-006.md]

The run also found **nine defects and drifts (D1-D9)** that affect default runs. D1-D7 should ship as separate default-path fixes, outside the sub-mode (§13). The one the topic named holds in corrected form:
- A configured `--config-dir` on a single-executor research run with `cli-claude-code` is **silently dropped**.
- An explicit `--claude-config-dir` is **rejected loudly**.
- An inherited `CLAUDE_CONFIG_DIR` still reaches the child.
- Fan-out research lineages are **not** affected. [SOURCE: research/iterations/iteration-002.md] [SOURCE: research/iterations/iteration-007.md]

## 2. Research Question and Scope

The question was how to design an expansive-depth sub-mode for `system-deep-loop` deep-research and deep-review that widens and deepens scope instead of staying narrowly focused. It had to handle two example targets well:
1. "research the last 100 commits and find bugs, drifts and improvement opportunities";
2. "analyze system-skill-advisor and find improvement opportunities for auto-utilization of skills and commands when a user is just chatting".

The sub-mode had to be additive and opt-in, with no change to default deep-loop behavior. Seven key questions (Q1-Q7) were tracked in `research/deep-research-strategy.md`, and all seven are answered.

**Out of scope:** implementation and runtime code edits. This packet is research only.

## 3. Method

The run used seven fresh-context `@deep-research` leaf iterations with externalized state:
- Iterations 1-6 took Q1-Q7 in order. Iteration 2 closed both Q2 and Q7.
- Iteration 7 was a blocked-stop recovery iteration (§14).

Evidence sources:
- `convergence.cjs`, `reduce-state.cjs` (research and review), `continuity-thread.cjs`, the divergent-pivot modules, the coverage-graph libraries, `fanout-run.cjs`, `dispatch-iteration.cjs`, `executor-audit.ts` and `append-mode-event.cjs`, plus its legacy-compatibility upcast;
- both workflow YAMLs and the command docs;
- the 002-graph-engineering syntheses and reference docs;
- the skill-advisor runtime and a `git log -100` profile.

**Orchestrator deviation (recorded per the brief):**
- For iterations 2-7 the orchestrator wrote `next_focus` by hand. The reducer's Next Focus was iteration 1's status sentence, which is itself defect D5 (§13).
- This run's trajectory was steered, so it is not evidence of how default focus selection behaves.
- The prompt packs were rendered with a local helper that calls the shipped `renderPromptPack`.

## 4. Diagnosis: Why the Loops Stop Early or Stay Narrow (Q1)

1. **The stop order is fixed, and the script owns it** (CONFIRMED). First match wins:
   1. max-iterations cap;
   2. 3 consecutive failures;
   3. stuck → STUCK_RECOVERY;
   4. `convergenceMode: off`;
   5. `stopPolicy: max-iterations`;
   6. stop candidate;
   7. `minIterations` floor;
   8. quality guards;
   9. graph decision.

   The YAML only branches on the result. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:963]
2. **The question count is fixed at init** (CONFIRMED).
   - `totalQuestions` is `answeredCount + openCount` from the registry.
   - Once every registered question is answered, `all_questions_answered` becomes a stop candidate without a vote. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1415] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1149]
3. **The weighted vote rewards answering the known questions** (CONFIRMED).
   - It has three signals, and a signal without enough history drops out of the denominator.
   - In iterations 1-2 the answered fraction alone (`questionEntropy` ≥ 0.85) carries the vote. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:805] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:819]
4. **`newInfoRatio` is self-reported and relative to the current focus** (CONFIRMED). Drilling one sub-question drives it down. The novelty-corroboration guard can veto a stop, but it never adds scope. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:568]
5. **`minIterations` is a lower bound only, and it applies to research only** (CONFIRMED).
   - It is gated on `loopType === 'research'`.
   - The review template sets `minIterations: 2`, but it is never applied, so a review run can stop at iteration 1 (defect D3). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159] [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:12]
6. **The graph decision can only veto** (CONFIRMED). Its five thresholds (questionCoverage, claimVerificationRate, contradictionDensity, sourceDiversity, evidenceDepth) are all ratios over existing nodes, and none measures unvisited ground. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:432]
7. **Correction to iteration 1:** the `focusAlignment` guard does not penalize widening on research runs today. It is never evaluated (CONFIRMED by trace).
   - Its input comes from state-log rows.
   - The research gateway upcast drops `keyQuestions` from those rows. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1594] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:643]
8. **`off` and `max-iterations` extend duration, not direction** (CONFIRMED). The loop keeps working the same question set. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1138]

**Root cause** (INFERENCE from 2-6): no signal measures unexplored surface, such as unvisited commits or files, unexpanded nodes or emergent questions. Narrow-and-done is indistinguishable from converged.

## 5. Focus Selection (Q2)

1. **Research Next Focus precedence** (CONFIRMED). First match wins:
   1. the divergent-pivot focus;
   2. a blocked-stop recovery;
   3. the latest carried-forward open question;
   4. "Follow up on" the last finding;
   5. the first open registry question.

   A promoted idea is used only when nothing else exists. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2420] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:130]
2. **Carried-forward questions steer focus but never enter the stop count** (CONFIRMED). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:76] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2587]
3. **`research/inbox.jsonl` is the only path that grows the counted question set, and nothing writes to it** (CONFIRMED by repo grep; INFERENCE that no indirect writer exists). [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1137]
4. **The YAML focus pipeline narrows by design** (CONFIRMED).
   - The stuck-recovery "Widen scope" is prompt text only.
   - The target is still `least_explored`, chosen from the existing questions. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1218]
5. **The review reducer has the same shape** (CONFIRMED). Its focus sources are the latest `nextFocus`, then the first uncovered entry of the four hard-coded `REQUIRED_DIMENSIONS`, then the pivot focus, then blocked-stop text. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2184]
6. **Question resolution is literal string equality, with no semantic test** (CONFIRMED). A mode that splits or rewrites questions needs stable ids. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2481]

## 6. Existing Breadth Levers (Q3)

| Lever | What it adds | Adds questions or nodes mid-run? | What it lacks |
|---|---|---|---|
| Divergent pivot | One Council-chosen focus at a STOP candidate, at most 3 times, depth 1, no recursion | No. It sets `next_focus` only. | No registry write. Candidates are drawn only from existing state, and the code says they "test an existing in-scope finding rather than widening the research topic". |
| Coverage graph | Signals that can block a stop | Yes: agent-declared QUESTION nodes | Never steers focus; it is a second question set the reducer ignores. |
| Sliding-window | A windowed novelty measure | No | Measurement only. |
| `off` / `max-iterations` | Duration | No | Same direction. |
| Native fan-out | Model diversity, cross-model attribution | No | Every lineage gets the same topic, so there is no scope partition. |
| `wave_orchestration` | A question-partitioned parallel design | Partly (adjacent-question boost) | Reference-only and never executed; it prunes below the median. |
| Review dimensions | Four fixed axes with a 0.8 coverage gate | No | No sub-target decomposition. |

[SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1056] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1197] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:281] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:578] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1670] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2078] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:628]

**The pivot's state-record seeds are dead in practice** (CONFIRMED). The pivot reads the gateway-refreshed state log. That projection keeps only status, ratio, focus, answered questions and ruled-out digests. So the five free-text seed fields (`verificationGaps`, `contradictions`, and the rest) and `graphEvents` never reach it. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:655] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1068]

## 7. Graph-Engineering Principles Usable Here (Q4)

All of these are design-level doctrine in the 002 program, not shipped behavior. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:23]

1. **Frontier growth is a typed proposal; the workflow converts it.** The leaf never writes it. Sources: S1 `GraphPatchProposalV1`; S5 `need_new_source_scope` and `propose_next_focus`. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:87] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:89]
2. **Bounds inherit narrow-only.** Depth, child count and budget can only narrow from parent to child. Admission checks run in a fixed order: registry, policy, budget, depth, reachability, acyclicity. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:283] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md:356]
3. **The stop rule is obligation accounting, not novelty.** A run is done when every node is answered, blocked, exhausted or abstained. A falling novelty ratio is telemetry, not proof. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:455]
4. **Keep the live StopDecision and add the graph check beside it, never in its place.** [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:336]
5. **Traversal is coverage-driven.** "Remaining question lacks coverage" is the route reason. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md:151]
6. **Swarm fan-out is a flat pool** with distinct inputs and a deterministic join that preserves contradictions. Wave and `depends_on` scheduling stays rejected. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/05-deep-loop-to-graph-mapping.md:397]
7. **Fan-in counts its inputs and reduces in layers.** Batch summaries come before the final pass. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:438]
8. **Readiness is separate from width.** Work streams as nodes become ready, and synthesis is the only barrier. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:39]
9. **An applicability gate decides when to use it.** Use it for targets that split into many independent units, not for single-question lookups. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:229]
10. **Do not depend on unbuilt components.** The graph compiler, belief projection and policy compiler are classified Missing, and the 036 plane is dark. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:233]

## 8. The Expansive-Depth Sub-Mode Design (Q5) — DESIGN

**Frontier node.** Its fields are:
- `id`, `parentId`, `depth`;
- `kind`: `root|subsystem|batch|surface|question|drift-pair`;
- `loopType`, `label`, `scope` (paths, commit range, question id);
- `budget`: iterations, tool calls and child slots, narrow-only;
- `status`: `open|active|answered|blocked|exhausted|abstained|pruned`;
- `statusReason`, `provenance` (proposedBy, evidence, admittedAt) and `dedupeKey`.

[SOURCE: research/iterations/iteration-005.md]

**Storage.** Frontier state never lives on research state-log rows, because the gateway drops non-core fields there. It lives in three places:
- **Leaf proposal:** a `frontier_proposal` row in `deltas/iter-NNN.jsonl`.
- **Canonical growth path:** admitted nodes become `research/inbox.jsonl` rows with `origin: "frontier"`, written by the workflow.
- **Registry projection:** `findings-registry.json` gets a `frontier: {nodes, stats}` field, rebuilt by the reducer. The stop veto reads this field.
- **Traversal view:** the workflow also upserts admitted nodes into the coverage graph as QUESTION nodes with `DERIVED_FROM` edges, so traversal no longer depends on the leaf emitting graph events. Leaf emission in this run was 17, 20, 1 and 0 node events across iterations 1-4.

**Admission order.** The first failure prunes the proposal with its reason:
1. relevance: it carries an evidence anchor from the parent's work and its scope intersects the root;
2. dedupe against frontier, registry, rejected patterns and Exhausted Approaches;
3. depth ≤ `maxDepth` (3);
4. children ≤ `maxChildrenPerNode` (6) and the run total ≤ `maxFrontierNodes` (40);
5. budget is monotone;
6. acyclic.

A node whose first iteration falls below threshold with no child proposals closes as `exhausted`, and its slice returns to the parent.

**Depth budget.** `maxIterations` is split 50% / 35% / 15% across depths 0-1, 2 and 3. Unused budget rolls down, never up. When a level's share is spent, its open nodes close as `exhausted: budget`.

**Stop veto `frontierOpen`.** It sits immediately after the `minIterations` floor and before the gates, guards and graph decision.
- It only converts a STOP candidate into CONTINUE.
- It applies only while open or active nodes exist and depth budget remains.
- It never creates a STOP, and never outranks the cap, failures, pause or the `off` and `max-iterations` policies.
- The frozen `stopReason` enum is untouched; only the reasonDetail vocabulary grows.
- It is a no-op when the flag is off or the frontier is empty.

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159]

**Local stuck handling.** STUCK_RECOVERY fires earlier in the order than any candidate. So under expansive mode the YAML's STUCK_RECOVERY handler first closes the active node as `exhausted` and advances focus. It falls through to global recovery only when no open node remains. `convergence.cjs` is not reordered.

**Focus.** Under the flag, a new reducer branch picks the next node: lowest depth first, then a node with no covering FINDING, then the oldest. The branch goes after the pivot focus and the blocked-stop recovery, and before continuity. Breadth at a level therefore completes before depth, and frontier ids replace the prose path that defect D5 shows can hijack focus.

**Composition.**
- With `divergent`: the Council pivot fires only once the frontier is terminal, and each pivot can reopen breadth through admission.
- With `sliding-window`: no change.
- With fan-out: open depth-1 nodes are partitioned round-robin across lineages, and a fan-in guard checks that every depth-1 node is accounted for.

## 9. Worked Decompositions of Both Example Targets — DESIGN

**Target 1, "the last 100 commits: bugs, drifts, improvement opportunities", runs as `loopType: review`.** Profile of `git log -100` on 2026-11-17: 20 merges, 32 `chore(system-spec-kit)` trigger-index rebuilds, 9 changelog commits, and the rest across doctor, decision-capture, session-handover, sk-doc and sk-code. [SOURCE: research/iterations/iteration-005.md]
- **Depth 0:** the root, `HEAD~100..HEAD`.
- **Pruned at init:** merges as `merge-no-own-diff`, and index rebuilds as `generated-artifact`, with one sampled node checking that the generator is deterministic.
- **Depth 1:** 7 subsystem nodes taken from path clusters (doctor, spec-kit runtime, session-handover, decision-capture, sk-doc, sk-code, skill-advisor routing).
- **Depth 2:**
  - batch nodes of up to 10 in-cluster commits, reviewed on the four existing dimensions;
  - one `drift-pair` node per changed (code, doc) pair, asking whether the doc still describes the code.
- **Depth 3:** a question node, admitted only when a batch finds a cause outside itself.
- **Fan-in:** per batch, then per subsystem, then the whole target.

**Target 2, "system-skill-advisor auto-utilization when just chatting", runs as `loopType: research`.**
- **Depth-1 surfaces:**
  - the prompt-policy gate: `shouldFireAdvisor` skips with `short_casual_acknowledgement` and `below_prompt_policy_threshold`, exactly where chat prompts lose a recommendation;
  - command surfacing: `COMMAND_POLICIES`, `DEPTH_WORDING` and `attachCommand`;
  - the scorer;
  - the per-runtime hook adapters;
  - a chat-intent class taxonomy, admitted at depth 2 only after the gate and scorer nodes return evidence.
- **Dedupe set:** the 10 existing `specs/system-skill-advisor/routing-and-scoring/001-010` packets. A match is admitted only as "what did 00N leave open".
- **Optional depth-2 review node:** on the `prompt-policy.ts` thresholds, once a concrete defect is suspected.

[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:126] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:123]

The scorer node's details rest on the directory listing only (INFERENCE); `df-idf.ts` was not read.

## 10. Integration Map (Q6) — DESIGN, file by file

| Surface | Change | Default-path effect |
|---|---|---|
| `.skilled/commands/deep/research.md`, `review.md` (flag table) and the presentation assets | Add `--depth-mode=default\|expansive`. Do **not** add a fifth `--convergence-mode` value, which would exclude `divergent` and `sliding-window`. | None when absent |
| `deep-research/assets/deep-research-config.json`, `deep-review/assets/deep-review-config.json` | Add `antiConvergence.depthMode: "default"` and an `expansiveDepth` block (maxDepth 3, maxChildrenPerNode 6, maxFrontierNodes 40, depthShares). Add `depthMode` to `lockedFields` and the optimizer manifest so the optimizer cannot switch widening on. | An absent key reads as default |
| `deep-research.yaml`, `deep-review.yaml` | Write the new keys in `step_create_config`. Add `step_frontier_admit` after verify-iteration and before `step_reduce_state`, and `step_frontier_graph_upsert` after `step_graph_upsert`, both `enabled_when depthMode == expansive`. Add the expansive STUCK_RECOVERY sub-branch. Leave `wave_orchestration` reference-only and give it a pointer. | Step list unchanged when off |
| `.skilled/agents/deep-research.md`, `deep-review.md` | Add the `frontier_proposal` delta row type. Leaves propose; they never write the inbox. | None |
| `prompt-pack-iteration.md.tmpl` (both) and the renderer | Add a conditional `## FRONTIER` block (node id, scope, budget, depth) and the proposal row shape. The allowed-write list must stay consistent with the agent definition (defect D6). | Same bytes when off |
| `deep-research/scripts/reduce-state.cjs` | Add `'frontier'` to `VALID_QUESTION_ORIGINS`; today unknown origins silently become `operator` (defect D4). Add the `buildRegistry` frontier field, emitted only when opted in. Add the frontier branch in `resolveNextFocus`. | Registry identical when off |
| `runtime/scripts/reduce-state.cjs` (review) | The same Next Focus frontier branch in the review block at :2184. | Same |
| `mode-registry.json` | No new entry. A mode binds one command, agent, packet and loop type, and dispatch accepts only `research\|review`, so expansive is a modifier like `divergent`. | None |
| `runtime/scripts/convergence.cjs` | Add a `depthMode` passthrough in `stopDecisionConfig`. Add the `frontierOpen` veto after the floor at :1159, reading `registry.frontier.stats`, which is already loaded. No new CLI argument. | Unreachable when off |
| `append-mode-event.cjs` research upcast | No change. Frontier data travels through delta and inbox rows. | None |
| `fanout-run.cjs`, `fanout-merge.cjs` | Add a `frontier_scope:` binding modeled on `review_focus`, partitioning depth-1 nodes, plus a merge-time coverage guard. | Prompt unchanged when absent |

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:55] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1343] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:128] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:204] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:185] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:41] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:406]

**Tests.** The existing guards stay green:
- stop decision: `stop-decision*`, `convergence-script`, `deep-research-convergence-floor`, `review-depth-convergence`;
- reducers: `deep-research-reduce-state`, the `deep-review-*` reducers;
- gateway: `append-mode-event-legacy-seam`;
- fan-out: `fanout-run`, `fanout-merge*`;
- dispatch, config and optimizer: `dispatch-iteration`, `executor-config`, `optimizer-manifest-anti-convergence`;
- pivot: `divergent-pivot*`.

Three tests are new:
1. a golden test: with `depthMode` absent, the registry, dashboard, Next Focus and rendered prompt pack are byte-identical;
2. a stop-decision table: `frontierOpen` appears only under expansive mode with open nodes, and never outranks the cap, failures or stuck;
3. a reducer test: a `frontier`-origin inbox row keeps its origin.

[SOURCE: research/iterations/iteration-006.md]

## 11. Recommendations

1. **Ship the default-path defect fixes first, as separate changes with their own tests** (§13: D1, D2, D3, D5, D6, D7). Each one changes default behavior or a contract, so none belongs inside the opt-in.
2. **Then build the sub-mode in this order:**
   1. config and flag surface, plus `lockedFields`;
   2. reducer origin, frontier projection and Next Focus branch;
   3. `step_frontier_admit` and the inbox writer;
   4. the `convergence.cjs` veto;
   5. the agent and prompt-pack proposal rows;
   6. the frontier graph upsert;
   7. fan-out `frontier_scope` and the fan-in guard.

   Land the golden byte-identity test before step 2.
3. **Pilot on target 2**, the advisor: it is research-shaped, with a small node count. Then run target 1 as a review run with fan-out partitioning of the 7 subsystem nodes.
4. **Track** frontier size, pruned nodes, revisits and budget spent per depth on the dashboard, the S1 expansion metrics.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Raise `minIterations` to get depth | It only delays a stop and adds no direction | convergence.cjs:1159 | 1 |
| `convergenceMode: off` or `stopPolicy: max-iterations` as the widening fix | Duration only, same question set | convergence.cjs:1138 | 1, 3 |
| Stuck recovery as a widening mechanism | "Widen scope" is prompt text; the target is still `least_explored` | deep-research.yaml:1218 | 2 |
| Ideas backlog as a mid-run scope source | Used only when no other focus exists | reduce-state.cjs:2420 | 2 |
| Sliding-window as a breadth lever | Swaps the novelty measure only | convergence.cjs:534 | 3 |
| Fan-out as a scope partition, as shipped | Every lineage gets the same topic | fanout-run.cjs:1670 | 3 |
| A fifth `--convergence-mode=expansive` value | Mutually exclusive with `divergent` and `sliding-window` | convergence.cjs:55 | 6 |
| A new mode-registry entry | Loop-type enum and one-to-one command, agent and packet binding | mode-registry.json; dispatch-iteration.cjs:41 | 6 |
| Promoting `wave_orchestration` | Rejected by the graph program; fan-out already covers parallelism | deep-research.yaml:2078; reference/05:397 | 4, 6 |
| Widening the gateway research upcast to keep frontier fields | Changes the ledger path for every research run | append-mode-event.cjs:406 | 6 |
| Reordering stuck after the veto in `convergence.cjs` | Changes default ordering | convergence.cjs:1130 | 6 |
| Storing frontier state on research iteration records | The gateway drops the fields, and `convergence.cjs` reads only those rows | legacy-compatibility.ts:643 | 5 |
| Leaf-emitted QUESTION graph events as the frontier source of truth | Emission is inconsistent: 17, 20, 1, 0 | deltas/iter-001..004.jsonl | 5 |
| Depending on the 036 target-state components | Classified Missing; the plane is dark | 006 research.md:233 | 4 |
| Reading the `context/` blog corpus directly | The study syntheses already cite it | — | 4 |

## Divergence Map

- **Convergence mode:** `default`. No divergent pivots were prepared or taken, and the registry records no saturated directions or overrides.
- **Breadth in this run came from the orchestrator,** which steered `next_focus` by hand in iterations 2-7 (§3). It did not come from the runtime.
- **Remaining frontier:** the three open questions in §12. Each one names its check.
- This section documents breadth only. It does not claim the topic converged because the frontier was broadened.

## 12. Open Questions

1. Does a divergent pivot after `all_questions_answered` buy only about one re-check iteration before the same stop returns? (INFERENCE.) **Check:** a divergent-mode run log showing the stop reason after each pivot. [SOURCE: research/iterations/iteration-003.md]
2. The review-side pivot adapter, `divergent-review-pivot.ts`, and the `fanout-merge.cjs` internals were not read. The merge claims rest on the feature catalog.
3. Is `quality_class` meant to be a closed vocabulary, and who owns the producer: the leaf, or a workflow step that classifies sources by path? This decides the honest fix for D1.

## 13. Defects and Drift Register (affecting default runs)

| Id | Defect | Evidence | Status |
|---|---|---|---|
| D1 | **Graph `sourceDiversity` cannot pass on contract-compliant research runs.** It counts distinct `metadata.quality_class` per question. No producer sets the value; only tests do. The prompt's node shape has no `metadata`, and there is no vocabulary check, so any string counts. | coverage-graph-signals.ts:653, :680; upsert.cjs:235; prompt-pack-iteration.md.tmpl:54 | CONFIRMED live (§14) |
| D2 | **Config-dir routing on single-executor research with `cli-claude-code`.** A configured `--config-dir` is dropped silently: the research YAML never forwards `--claude-config-dir`, while the review YAML does. An explicit `--claude-config-dir` is rejected with a UsageError. An inherited `CLAUDE_CONFIG_DIR` passes through the `CLAUDE_` env allowlist, so the child runs on the parent shell's account. The research audit record omits `configDir`. Fan-out research lineages are **not** affected, because `fanout-run.cjs` injects `CLAUDE_CONFIG_DIR` without a loop-type condition. **Fix:** accept but do not require the flag for research (dispatch-iteration.cjs:213-219), drop the review-only guard at :355, and add the optional argument to the research YAML `if_cli_claude_code`. | dispatch-iteration.cjs:217, :355, :407; deep-research.yaml:1442; deep-review.yaml:1519; executor-audit.ts:155, :284; fanout-run.cjs:3962, :3995 | CONFIRMED by trace |
| D3 | **The review `minIterations: 2` floor is configured but never applied.** It is gated on `loopType === 'research'`. | deep-review-config.json:12; convergence.cjs:1159 | CONFIRMED by trace |
| D4 | **An unknown question origin silently becomes `operator`.** | reduce-state.cjs:128, :204 | CONFIRMED by trace |
| D5 | **Free text under "Questions Remaining" takes over Next Focus.** The agent's own Recommended Next Focus has no reader (grep-based INFERENCE). Carried-forward questions never drop answered ones, so stale text keeps steering focus. | continuity-thread.cjs:76, :88; reduce-state.cjs:1944, :2587; this run's strategy §11 and §11A | CONFIRMED live |
| D6 | **The agent definition allows writing `research/research.md` under `progressiveSynthesis`, but the prompt pack's allowed-write list excludes it.** Progressive synthesis therefore never happens. | .skilled/agents/deep-research.md:58, :309; prompts/iteration-7.md:62 | CONFIRMED live (7 of 7 iterations skipped it) |
| D7 | **Leaf route-proof fields are dropped from the research state-log projection.** The command contract says iteration state records must carry `target_agent`, `resolved_route` and `agent_definition_loaded`. `verify-iteration.cjs` passes only by reading them from the delta file, and warns on every iteration. | legacy-compatibility.ts:643; verify-iteration output, iterations 1-7 | CONFIRMED live |
| D8 | **A transient loop lock left by a dead session blocks resume for up to 60 minutes.** Transient locks expire on heartbeat age only (2 × TTL); pid liveness is not checked. | loop-lock.cjs:183-186; this run's resume | CONFIRMED live; recovered with an owner-scoped release under operator authorization |
| D9 | **The `focusAlignment` quality guard is never evaluated on research runs** (the gateway drops `keyQuestions`). This is harmless today, but the guard would start firing if the projection ever kept that field. | convergence.cjs:871, :1594 | CONFIRMED by trace |

## 14. Run Evidence: Live Confirmations From This Packet

- **D1 is confirmed live.**
  - After iteration 6, all 7 of 7 questions were answered and the vote produced a stop candidate. `convergence.cjs` returned **BLOCKED** (`graphStopBlocked`, blocker `source_diversity_guard`, sourceDiversity 0.00 against a threshold of 1.5), despite dozens of cited sources.
  - Iteration 7, a recovery iteration, attached `metadata.quality_class` to SOURCE nodes using its own source-kind labels.
  - The next check read sourceDiversity **2.0** and returned **STOP_ALLOWED** → `converged` / `all_questions_answered`.
  - This shows both halves of D1: the guard is unsatisfiable without a producer, and it is satisfied by whatever labels the leaf chooses.
  - [SOURCE: research/iterations/iteration-007.md] [SOURCE: research/deep-research-state.jsonl]
- **D5 is visible in this packet:**
  - iteration 1's status sentence became strategy §11 Next Focus verbatim;
  - §11A still lists Q2-Q6 after they were answered.
- **D6 and D7 occurred on every iteration.**
- **The ratio trajectory** was 0.91, 0.89, 0.80, 0.86, 0.85, 0.86, 0.63. These are self-reported, focus-relative values. They are trajectory metadata, not independent evidence of completeness.

## 15. Risks

- **Frontier runaway or cost growth.** Mitigations: the depth, children and total caps, narrow-only budgets, and the `maxIterations` hard cap.
- **Leaf over-proposing.** Mitigations: the relevance gate requires an evidence anchor, the dedupe step, and the workflow-owned admission (leaves cannot write the inbox).
- **Default-path regression.** Mitigations: the flag gating, the absent-key-reads-as-default rule, and the golden byte-identity test.
- **Gaming the stop guards** (shown live by D1). The sub-mode should not rely on `sourceDiversity` until D1 has a closed vocabulary and an honest producer. Until then, report it as `notEvaluated` under expansive mode.

## 16. References

- Iteration narratives: `research/iterations/iteration-001.md` … `iteration-007.md`. Delta streams: `research/deltas/iter-001..007.jsonl`.
- Resource map: `research/resource-map.md`, emitted from the deltas.
- Graph-engineering program: `specs/system-deep-loop/loop-architecture/002-graph-engineering/` (001-006 research, `reference/02`, `03` and `05`, and the parent `research/research.md`).
- Runtime:
  - `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`, `reduce-state.cjs`, `fanout-run.cjs`, `dispatch-iteration.cjs`, `append-mode-event.cjs` and `loop-lock.cjs`;
  - `deep-research/scripts/reduce-state.cjs` and `divergent-research-pivot.ts`;
  - `runtime/lib/coverage-graph/*` and `runtime/lib/deep-loop/{continuity-thread.cjs,divergent-pivot.ts,executor-audit.ts}`.
- Workflows: `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml`.

## 17. Convergence Report

- Stop reason: converged (`all_questions_answered`, graph STOP_ALLOWED) at the iteration-8 pre-dispatch check.
- Total iterations: 7 of a maximum of 10. The `minIterations` floor of 3 cleared at the iteration-4 check, and its event was appended late at the iteration-5 check.
- Questions answered: 7 / 7. Remaining questions: 0. Open verification items are listed in §12.
- Last 3 iteration summaries:
  - run 5, Q5 design (0.85);
  - run 6, Q6 integration map (0.86);
  - run 7, blocked-stop recovery and verification (0.63).
- Convergence threshold: 0.05.
- One `blocked_stop` at the iteration-7 check (`source_diversity_guard`). Recovery took one iteration.
- Divergence summary: no divergent pivots recorded (convergence mode `default`).
- Orchestrator notes:
  - `next_focus` was hand-steered in iterations 2-7 (§3);
  - the lock of a dead prior session was released with its recorded owner pid and nonce before reacquire (D8).
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.
