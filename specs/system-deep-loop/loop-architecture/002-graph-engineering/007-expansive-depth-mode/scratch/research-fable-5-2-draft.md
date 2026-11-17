---
title: "Expansive-depth sub-mode for deep-research and deep-review: diagnosis, design and integration map"
description: "Why the deep-loop research and review loops stop early and stay on their init-time questions, an additive opt-in frontier sub-mode (--depth-mode=expansive) that widens and deepens scope, completed-run extension (completed-continue / --extend=N), the defect register D1-D14 and a slice-by-slice build plan."
trigger_phrases:
  - "expansive depth mode"
  - "depth-mode expansive"
  - "frontier veto"
  - "completed-continue extension"
  - "deep loop change slices"
importance_tier: "normal"
contextType: "research"
---
# Expansive-depth sub-mode for deep-research and deep-review

Synthesis of two research generations, both run 2026-11-17:
- **Generation 1:** 7 native `@deep-research` iterations (Opus 5.5), session `2026-11-17T07:52:43.000Z`. Its packet, iteration narratives included, is archived at `research_archive/20261117T103614Z/` and cited at that path.
- **Generation 2:** 5 `cli-devin` iterations (`swe-2-max`), session `2026-11-17T10:36:36.000Z`, which verified and extended generation 1. Its narratives live in `research/iterations/`.

Every claim below cites an iteration narrative or the code it cites. Where generation 2 corrected generation 1, the correction is stated in place and marked **CORRECTED (gen 2)**. Labels: **CONFIRMED** means a code trace or a live run showed it. **INFERENCE** means it is derived and names its check. **DESIGN** means a proposal, not shipped behavior.

## 1. Executive Summary

The loops do not stay narrow because their thresholds are too low. They stay narrow because **every stop signal and every focus source is anchored to the question set written at init, and nothing in the runtime grows that set during a run**. So a loop that answers its 3-7 init questions narrowly looks exactly like a converged one. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-001.md] [SOURCE: research_archive/20261117T103614Z/iterations/iteration-002.md]

None of the existing breadth levers does all three things a widening mode needs:
- **discover** new scope;
- **steer** focus toward it;
- **count** it in the stop decision.

The coverage graph discovers but does not steer. The divergent pivot steers but does not discover. `wave_orchestration` would partition work, but it never runs. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-003.md]

The recommended design is an additive, opt-in **frontier sub-mode** behind a separate flag, `--depth-mode=default|expansive`, for both loop types:
- **Proposals:** the leaf proposes typed `frontier_proposal` rows in its delta file.
- **Admission:** a workflow step admits them under depth, fan-out, budget and dedupe rules, then writes them to `research/inbox.jsonl`, the one channel that already grows the counted question set.
- **Projection:** the reducer projects a `frontier` field into the findings registry.
- **Focus:** Next Focus picks the open node with the lowest depth.
- **Stop:** `convergence.cjs` gains one veto, `frontierOpen`, placed after the `minIterations` floor. It can only turn a STOP candidate into CONTINUE while frontier nodes are open, and it is unreachable when the flag is off. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-005.md] [SOURCE: research_archive/20261117T103614Z/iterations/iteration-006.md]

The run also found **nine defects and drifts (D1-D9)** that affect default runs. D1-D7 should ship as separate default-path fixes, outside the sub-mode (§13). The one the topic named holds in corrected form:
- A configured `--config-dir` on a single-executor research run with `cli-claude-code` is **silently dropped**.
- An explicit `--claude-config-dir` is **rejected loudly**.
- An inherited `CLAUDE_CONFIG_DIR` still reaches the child.
- Fan-out research lineages are **not** affected. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-002.md] [SOURCE: research_archive/20261117T103614Z/iterations/iteration-007.md]

**Generation 2 added four things** (§18-§20):
1. **It re-verified D1, D2, D3, D5, D6, D7 and D9 against current code, line by line.** All hold. One location claim moved: the projection seam is no longer in `legacy-compatibility.ts`. **CORRECTED (Fable review):** the location did not move. The drop is still the upcast at `legacy-compatibility.ts:643-660`, which copies only five fields, backed by the stem's two-field optional schema and the projection writer `legacy-projections/deep-research-contract.ts:312-325` (§4 item 7). D3 holds only in part: the floor is gated to research, but a review run cannot stop at iteration 1 (§4 item 5).
2. **It corrected the pivot-yield claim.** A divergent pivot after `all_questions_answered` buys `min(remaining iterations, remaining pivots)`, up to 3 pivots, not "about one iteration".
3. **It mapped the review side and found it has no question surface at all.** A review frontier must land in `candidateCoverage`/`searchDebt`, not in an inbox. It also found five new defects (D10-D14), the worst being that custom `reviewDimensions` can never be covered, which disables both the clean stop and the review pivot. **CORRECTED (Fable review):** the workflow forbids custom dimensions ("Every element MUST be one of the four canonical dimension names", `deep-review.yaml:654`) and no code enforces that line. So D10 is reachable only through a hand-edited config, and it is a hardening gap, not the worst new defect.
4. **It designed completed-run extension, which the operator asked to have built.** It adopts the reserved `completed-continue` lineage mode, spelled `--extend=N`, with a new `run_extended` ledger event. The run keeps its session and generation, and the duration budget is raised rather than resetting `createdAt`. **CORRECTED (Fable review):** the raise must be computed from the clock, not added to the old ceiling. The duration check charges all wall-clock time since `createdAt`, idle time included, so a plain `+= M` re-stops any extension started later than the old budget (§19 item 4).

It then sequenced everything into slices (§20): 12 from iteration 5, plus slice M for D14, which the orchestrator observed. The extension ships first; the defect slices ship in any order; the frontier sub-mode comes after them, research before review. [SOURCE: research/iterations/iteration-001.md] [SOURCE: research/iterations/iteration-002.md] [SOURCE: research/iterations/iteration-003.md] [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-005.md]

## 2. Research Question and Scope

The question was how to design an expansive-depth sub-mode for `system-deep-loop` deep-research and deep-review that widens and deepens scope instead of staying narrowly focused. It had to handle two example targets well:
1. "research the last 100 commits and find bugs, drifts and improvement opportunities";
2. "analyze system-skill-advisor and find improvement opportunities for auto-utilization of skills and commands when a user is just chatting".

The sub-mode had to be additive and opt-in, with no change to default deep-loop behavior. Generation 1 tracked seven key questions (Q1-Q7, archived strategy), and all seven are answered.

Generation 2 tracked six questions in `research/deep-research-strategy.md`:
- **Q1:** re-verify the generation-1 design and D1-D9;
- **Q2:** the review side;
- **Q3:** pivot yield and the honest fix for D1;
- **Q4:** the skill-advisor scorer and gate;
- **Q5:** change slices;
- **Q6:** completed-run extension. The operator injected Q6 through `research/inbox.jsonl` during the run.

Q2, Q3, Q5 and Q6 are answered; Q1 is answered except D4 and D8; Q4 is scoped but not answered (§12).

**Out of scope:** implementation and runtime code edits. This packet is research only.

## 3. Method

Generation 1 used seven fresh-context `@deep-research` leaf iterations with externalized state:
- Iterations 1-6 took Q1-Q7 in order. Iteration 2 closed both Q2 and Q7.
- Iteration 7 was a blocked-stop recovery iteration (§14).

Generation 2 used five `cli-devin` (`swe-2-max`) iterations under `stopPolicy: max-iterations`, so convergence was telemetry only and all five ran. Each iteration read the archived generation-1 synthesis first. The focus order was Q1, then Q3, then Q2, then Q6 (with Q4 as secondary, which went unused), then Q5.
- From iteration 2 on, the focus followed the reducer's Next Focus, or the leaf's own recommendation where the reducer's line restated it.
- The completed generation-1 packet could not be extended in place, so generation 2 opened through `--restart` (D11, §19).

Evidence sources:
- `convergence.cjs`, `reduce-state.cjs` (research and review), `continuity-thread.cjs`, the divergent-pivot modules, the coverage-graph libraries, `fanout-run.cjs`, `dispatch-iteration.cjs`, `executor-audit.ts` and `append-mode-event.cjs`, plus its legacy-compatibility upcast;
- both workflow YAMLs and the command docs;
- the 002-graph-engineering syntheses and reference docs;
- the skill-advisor runtime and a `git log -100` profile.

**Orchestrator deviation (recorded per the brief):**
- For iterations 2-7 the orchestrator wrote `next_focus` by hand. The reducer's Next Focus was iteration 1's status sentence, which is itself defect D5 (§13).
- This run's trajectory was steered, so it is not evidence of how default focus selection behaves.
- The prompt packs were rendered with a local helper that calls the shipped `renderPromptPack`.
- Generation 2 was orchestrated the same way: a local per-iteration driver ran the YAML loop steps in order. In iteration 1 the driver loaded the executor-audit helper wrongly, so the executor provenance row was missing. `verify-iteration` then failed with `executor_missing`, and `redispatch_once` re-dispatched an iteration that had already landed. The second leaf refused to overwrite and wrote nothing. The provenance row was backfilled with the shipped helper, and verification then passed. This exposed D14 (§13).

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
   - **CORRECTED (Fable review):** the floor is not applied to review, but a review run cannot stop at iteration 1. Both review stop candidates need `coverageAge >= 1`: the clean stop at `convergence.cjs:1106-1111`, and the composite vote through its `dimensionCoverage` signal at `:785-793`, without which the other two signals stay under the 0.60 bar (`:773-784`, `:831-833`). `reviewCoverageAge` (`:1430-1443`) counts evidence records after the one that completed coverage, so a candidate needs at least two iterations. With the shipped floor of 2, applying it changes nothing; it matters only for a configured floor above 2. The key sits at `antiConvergence.minIterations`, which `:1347-1349` reads. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:785] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1430]
6. **The graph decision can only veto** (CONFIRMED). Its five thresholds (questionCoverage, claimVerificationRate, contradictionDensity, sourceDiversity, evidenceDepth) are all ratios over existing nodes, and none measures unvisited ground. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:432]
7. **Correction to iteration 1:** the `focusAlignment` guard does not penalize widening on research runs today. It is never evaluated (CONFIRMED by trace).
   - Its input comes from state-log rows.
   - The research gateway projection drops `keyQuestions` from those rows. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1594]
   - **CORRECTED (gen 2):** the drop is confirmed live, but its location has moved. `legacy-compatibility.ts` no longer names `keyQuestions` or the route-proof fields at all. The dropping now happens elsewhere in the gateway's projection path, and that module is not located yet (INFERENCE). [SOURCE: research/iterations/iteration-001.md]
   - **CORRECTED (Fable review):** the generation-2 correction above is wrong, and generation 1's location stands. The file does not name `keyQuestions` because it drops it by omission. The chain is (CONFIRMED by trace):
     1. the upcast builds the `iteration_completed` data from `status`, `newInfoRatio`, `ruledOut`, `focus` and `answeredQuestions` only; [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:643]
     2. the stem's optional-field rules allow only `focus` and `answeredQuestions`; [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:657]
     3. the data type has no other field; [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:185]
     4. the projection writer emits a ten-key row. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:312]

     The guard itself needs both lists on a record (`convergence.cjs:871-875`); `:1594` is only the input builder.
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
   - **CORRECTED (Fable review):** that list is the order the code evaluates, not the precedence. Later assignments win (`reduce-state.cjs:2184-2215`), so the precedence is: blocked-stop text, then the pivot focus, then the latest leaf `nextFocus`, then the first uncovered default dimension. A review frontier branch must be placed against this order.
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
| Review dimensions | Four fixed axes with a 0.8 coverage gate | No | No sub-target decomposition. **Gen 2:** a custom dimension can never be marked covered (D10, §18). **CORRECTED (Fable review):** custom dimensions are forbidden by `deep-review.yaml:654`, so this applies only to a hand-edited config. |

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

[SOURCE: research_archive/20261117T103614Z/iterations/iteration-005.md]

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

**CORRECTED (Fable review): five gaps this design must close before Slice J.**
1. **No rule closes the counted question of a node that ends unanswered.** An inbox row becomes a counted open question. A question resolves only when a record's `answeredQuestions` holds its exact text, when a record has one `keyQuestions` entry equal to it (dead, because the projection drops `keyQuestions`), or when a record's `focus` equals it. Nothing maps `exhausted`, `blocked`, `abstained` or `pruned` to resolution, so each such node leaves an open question: `all_questions_answered` is unreachable and the `questionEntropy` signal needs 85% answered. The reducer needs an explicit rule, for example resolving a `frontier`-origin question when its node reaches a terminal status, with the status recorded. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2486] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:815]
2. **A visited node can close without being answered.** By the third resolution path, one non-error iteration whose `focus` equals the question text resolves it. If the frontier Next Focus branch emits the node's question text, nodes close by being visited. The design must say whether the focus string is the question text or a node id. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2497]
3. **Admitted QUESTION nodes can block the graph stop for good.** Question coverage counts a question only with two answering findings and divides by all QUESTION nodes. Source diversity is averaged over all QUESTION nodes too. Low values become `uncovered_questions` and `source_diversity_guard` blockers, and a blocked graph becomes BLOCKED. The upsert step needs a rule for a pruned or exhausted node, such as not writing it, or removing it on close. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:583] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:448] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1012]
4. **Local stuck handling is one strike per node after the first.** `stuckCount` is rebuilt from the log on every pass and resets only on a ratio above the threshold. After the YAML closes a stuck node, the next low-yield iteration is stuck again at once and closes the next node after one iteration. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1335]
5. **The node cap is out of step with the default iteration caps.** `maxFrontierNodes` is 40, while `maxIterations` defaults to 10 for research and 7 for review. At 50/35/15 that is 5, 3.5 and 1.5 iterations per depth band, so most admitted nodes would close as `exhausted: budget`. Tie the node cap to `maxIterations`, or state the minimum cap an expansive run needs.

The veto is also redundant for `all_questions_answered` while admitted nodes are counted questions. It only acts on `composite_converged`, so the stop-decision table test has to build a composite candidate.

## 9. Worked Decompositions of Both Example Targets — DESIGN

**Target 1, "the last 100 commits: bugs, drifts, improvement opportunities", runs as `loopType: review`.** Profile of `git log -100` on 2026-11-17: 20 merges, 32 `chore(system-spec-kit)` trigger-index rebuilds, 9 changelog commits, and the rest across doctor, decision-capture, session-handover, sk-doc and sk-code. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-005.md]
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

**CORRECTED (gen 2): the binding layer for target 2 is the gate, not the scorer.**
- `prompt-policy.ts` decides fire or skip from closed sets: `CASUAL_ACKNOWLEDGEMENTS`, `WORK_INTENT_VERBS`, `STOP_WORDS` and `GOVERNANCE_MARKERS`. It also applies length and token thresholds from `data/prompt-policy.default.json`; each threshold can be overridden by an environment variable.
- A casual or short chat prompt returns `fire: false` **before** scoring runs.
- `df-idf.ts` only computes corpus statistics, so a casual prompt never reaches it.

The frontier decomposition for target 2 should therefore root its depth-1 work in the gate and its threshold config, and treat the scorer as depth 2. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:1] [SOURCE: research/iterations/iteration-005.md]

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

[SOURCE: research_archive/20261117T103614Z/iterations/iteration-006.md]

## 11. Recommendations

Generation 2 replaced generation 1's two-step ordering with a slice plan (§20). In short:

1. **Build completed-run extension first** (Slice A, §19). It is self-contained and is the operator's priority.
2. **Ship the defect fixes as separate slices, in any order or in parallel** (Slices B-I and L): D2, D3, D5, D6 plus the heading mismatch, D7/D9, D1, D10, D12 and pivot hygiene. Each one changes default behavior or a contract, so none belongs inside the opt-in. **CORRECTED (Fable review):** Slice M (D14) belongs in this group too. D10 (Slice H) first needs a decision: enforce the four-name rule in code, or support custom dimensions (§13).
3. **Then build the research frontier sub-mode** (Slice J), in generation 1's internal order:
   1. config and flag;
   2. a golden byte-identity test;
   3. reducer projection and Next Focus;
   4. `step_frontier_admit`;
   5. the veto;
   6. the proposal rows;
   7. the graph upsert;
   8. fan-out `frontier_scope`.

   It needs D, E, F and G landed first.
4. **Build the review frontier last** (Slice K). It needs H, I and J, and it admits into `candidateCoverage`/`searchDebt`, not an inbox (§18).
5. **Pilot on target 2**, rooted at the `prompt-policy.ts` gate (§9 correction). Then run target 1 as a review run with fan-out partitioning of the 7 subsystem nodes.
6. **Track** frontier size, pruned nodes, revisits and budget spent per depth on the dashboard.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Raise `minIterations` to get depth | It only delays a stop and adds no direction | convergence.cjs:1159 | g1-1 |
| `convergenceMode: off` or `stopPolicy: max-iterations` as the widening fix | Duration only, same question set; `max-iterations` also removes the only signal that can trigger a pivot | convergence.cjs:1138 | g1-1, g1-3, g2-2 |
| Stuck recovery as a widening mechanism | "Widen scope" is prompt text; the target is still `least_explored` | deep-research.yaml:1218 | g1-2 |
| Ideas backlog as a mid-run scope source | Used only when no other focus exists | reduce-state.cjs:2420 | g1-2 |
| Sliding-window as a breadth lever | Swaps the novelty measure only | convergence.cjs:534 | g1-3 |
| Fan-out as a scope partition, as shipped | Every lineage gets the same topic | fanout-run.cjs:1670 | g1-3 |
| A fifth `--convergence-mode=expansive` value | Mutually exclusive with `divergent` and `sliding-window` | convergence.cjs:55 | g1-6 |
| A new mode-registry entry | Loop-type enum and one-to-one command, agent and packet binding | mode-registry.json; dispatch-iteration.cjs:41 | g1-6 |
| Promoting `wave_orchestration` | Rejected by the graph program; fan-out already covers parallelism | deep-research.yaml:2078; reference/05:397 | g1-4, g1-6 |
| Widening the gateway research upcast to keep frontier fields | Changes the ledger path for every research run. **CORRECTED (Fable review):** Slice F widens this same upcast for route-proof and telemetry fields, so this reason and Slice F cannot both stand (§20). | append-mode-event.cjs:406 | g1-6 |
| Reordering stuck after the veto in `convergence.cjs` | Changes default ordering | convergence.cjs:1130 | g1-6 |
| Storing frontier state on research iteration records | The gateway projection drops the fields | live projection probe | g1-5, g2-1 |
| Leaf-emitted QUESTION graph events as the frontier source of truth | Emission is inconsistent: 17, 20, 1, 0 in gen 1; 0 on two of five gen-2 iterations | deltas | g1-5, g2 |
| Depending on the 036 target-state components | Classified Missing; the plane is dark | 006 research.md:233 | g1-4 |
| "A pivot after `all_questions_answered` buys about one iteration" | Wrong in general: `all_questions_answered` stays true, every later stop re-pivots, up to `maxPivots: 3` | divergent-pivot.ts:285; convergence.cjs:1149 | g2-2 |
| `minRemainingIterations` as a meaningful pivot guard | Unreachable: the cap at convergence.cjs:1115 outranks it | divergent-pivot.ts:287, :739 | g2-2 |
| Review frontier admission through `research/inbox.jsonl` | The review reducer has no question surface; nothing would read the row | reduce-state.cjs (0 inbox hits) | g2-3 |
| `--extend=N` as a flag separate from the lineage mode | Same machinery, split vocabulary; `completed-continue` is already the reserved name | deep-research.yaml:514; loop-protocol.md:119 | g2-4 |
| Re-stamping `createdAt` on extension to reset the duration clock | Erases the elapsed-time audit; raise `maxDurationMinutes` instead. **CORRECTED (Fable review):** raise it from elapsed time, `max(prior, elapsedAtExtension) + M`; a plain `+= M` re-stops at once (§19 item 4). | deep-research.yaml:882 | g2-4 |
| Recording an extension as a plain `resumed` event | A budget top-up becomes indistinguishable from a resume | ledger schema | g2-4 |
| Treating the df-idf scorer as the target-2 gate | Casual prompts are skipped upstream in `prompt-policy.ts` | prompt-policy.ts:21 | g2-5 |
| Shipping the frontier sub-mode as one change | The defect layer is independently shippable and de-risks the four surfaces frontier composes | slice plan | g2-5 |

## Divergence Map

- **Convergence mode:** `default` in both generations. No divergent pivots were prepared or taken, and the registry records no saturated directions or overrides.
- **Breadth came from the orchestrator, not the runtime.** Generation 1 hand-steered `next_focus` in iterations 2-7. Generation 2 opened a second generation with new questions, and the operator injected Q6 through the inbox mid-run.
- **Inbox injection worked as designed.** The reducer promoted the operator row into the counted question set on the next reduce. This is live proof of the growth path the frontier design relies on (§8).
- **Remaining frontier:** the open questions in §12.
- This section documents breadth only. It does not claim the topic converged because the frontier was broadened.

## 12. Open Questions

1. **Q4, the target-2 gate, is scoped but not answered.** Four reads remain:
   - `prompt-policy.ts:80-223`, the evaluate function and its reason vocabulary;
   - the threshold values in `data/prompt-policy.default.json`;
   - what a `fire: false` skips at the hook call site (`hooks/claude/user-prompt-submit.ts`, `handlers/advisor-recommend.ts`);
   - the fixture `tests/legacy/advisor-fixtures/skippedShortCasual.json`, the cheapest ground truth.
   - **CORRECTED (Fable review):** the real paths under `.skilled/skills/system-skill-advisor/` are `runtime/data/prompt-policy.default.json`, `hooks/claude/user-prompt-submit.ts`, `runtime/handlers/advisor-recommend.ts` and `runtime/tests/legacy/advisor-fixtures/skippedShortCasual.json`.

   [SOURCE: research/iterations/iteration-005.md]
2. **D4 and D8 were not re-verified in generation 2.** They become verification tasks inside Slices D and A. **CORRECTED (Fable review):** both are now verified by trace (§13), so this item is closed.
3. **Two locations are still unknown.** The projection-writer module that now drops route-proof and telemetry fields (D7/D9) has not been found. Nor has `extractSection`'s heading-match rule (D13). Each is the first task of its slice. **CORRECTED (Fable review):** both are found. The drop chain is in §4 item 7. `extractSection` matches a heading exactly, case-insensitive (`deep-research/scripts/reduce-state.cjs:1891-1895`). This item is closed.
4. **Should `maxCouncilSeatOutputs: 9` be per pivot or lifetime?** As lifetime, a resumed pivot burns seats without completing. This is the decision point for Slice L.
5. **Under `stopPolicy: convergence`, an extension with no new questions re-stops at once** on `all_questions_answered`. Slice A must either couple extension with inbox injection or document the `--convergence-mode=off` window (§19).

## 13. Defects and Drift Register (affecting default runs)

| Id | Defect | Evidence | Status |
|---|---|---|---|
| D1 | **Graph `sourceDiversity` cannot pass on contract-compliant research runs.** It counts distinct `metadata.quality_class` per question. No runtime producer sets the value; only tests do. `upsert.cjs` copies leaf metadata verbatim with no vocabulary check, so any string counts. | coverage-graph-signals.ts:653, :680; upsert.cjs:235; coverage-graph-query.ts:123 | CONFIRMED live (gen 1 §14); re-verified gen 2 |
| D2 | **Config-dir routing on single-executor research with `cli-claude-code`.** A configured `--config-dir` is silently dropped, and an explicit `--claude-config-dir` raises a UsageError. An inherited `CLAUDE_CONFIG_DIR` leaks through. Fan-out is not affected. | dispatch-iteration.cjs:213-220, :355, :407; deep-research.yaml:1442; deep-review.yaml:1519; fanout-run.cjs:3962, :3995 | CONFIRMED by trace, re-verified gen 2 |
| D3 | **The review `minIterations: 2` floor is configured but never applied.** It is gated on `loopType === 'research'`. | deep-review-config.json:12; convergence.cjs:1159, :1347 | CONFIRMED, re-verified gen 2. **CORRECTED (Fable review):** OVERSTATED. The gate is real, but every review stop candidate already needs two iterations (`coverageAge >= 1`, convergence.cjs:785-793, :1106-1111, :1430-1443), so with the shipped floor of 2 no default run changes. |
| D4 | **An unknown question origin silently becomes `operator`.** | reduce-state.cjs:128, :204 | CONFIRMED gen 1; not re-verified. **CORRECTED (Fable review):** re-verified by trace at deep-research/scripts/reduce-state.cjs:128-133, :204-207. |
| D5 | **Free text under "Questions Remaining" takes over Next Focus.** Answered questions are never filtered out. The leaf's parsed `nextFocus` has no consumer on the research path. The review chain has the same hijack. | reduce-state.cjs:1927-1939, :2427-2473, review :2184-2215; continuity-thread.cjs:86-106, :130 | CONFIRMED, "no reader" upgraded to CONFIRMED gen 2 |
| D6 | **The agent definition allows writing `research.md` under `progressiveSynthesis`, but the prompt pack's allowed-write list excludes it.** | .skilled/agents/deep-research.md; rendered prompt packs | CONFIRMED live, 12 of 12 iterations across both generations |
| D7 | **Leaf route-proof and telemetry fields are dropped from the research state-log projection.** `verify-iteration` passes only through the delta fallback. The location moved from `legacy-compatibility.ts:643` to a projection writer not yet located. | verify-iteration.cjs:255-271, :560-563; live projection | CONFIRMED live, both generations. **CORRECTED (Fable review):** the location claim is WRONG. The drop is located and did not move: legacy-compatibility.ts:643-660 (upcast), deep-research-ledger-schema.ts:657-660 (optional fields), deep-research-ledger-types.ts:185-200, legacy-projections/deep-research-contract.ts:312-325 (projection writer). |
| D8 | **A transient lock left by a dead session blocks resume for up to 60 minutes.** Pid liveness is not checked. | loop-lock.cjs:183-186 | CONFIRMED live gen 1; not re-verified. **CORRECTED (Fable review):** re-verified by trace. A transient lock is never checked for a live pid (runtime/lib/deep-loop/loop-lock.ts:641), and the workflow sets a TTL of at least 30 minutes with staleness at twice that (deep-research.yaml:411). |
| D9 | **The `focusAlignment` guard is never evaluated on research** (the projection drops `keyQuestions`). | convergence.cjs:871, :1594 | CONFIRMED live gen 2 |
| D10 | **NEW (gen 2). A custom `reviewDimensions` entry can never be marked covered.** `buildDimensionCoverage` writes only the four `REQUIRED_DIMENSIONS` keys, while convergence counts every configured dimension as missing until covered. So `all_dimensions_clean` is unreachable, and the review pivot, which triggers only on that reason, is dead too. | reduce-state.cjs:1225-1247; convergence.cjs:1540-1556, :1106-1111, :1145; divergent-review-pivot.ts:338-340 | CONFIRMED by trace. **CORRECTED (Fable review):** OVERSTATED. The trace holds, but the input is outside the workflow contract: "Every element MUST be one of the four canonical dimension names" (deep-review.yaml:654). No code enforces that line, so the defect needs a hand-edited config. The smaller fix is to enforce the rule in code. |
| D11 | **NEW (gen 2). A completed run cannot be extended.** Research `on_completed_session` halts, and review `on_completed_session` re-synthesizes but cannot add iterations. `completed-continue` is reserved but deferred, so the only path is `--restart`, which archives the registry, strategy and questions. Hit live: generation 2 had to open through a restart. | deep-research.yaml:515-519; deep-review.yaml:584-587; loop-protocol.md:119-146 | CONFIRMED live; fix designed (§19) |
| D12 | **NEW (gen 2). `fanout-merge.cjs` drops every review coverage surface.** The merged registry keeps findings, debt and verdict, but drops `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence` and `ruledOutCandidates`. A merge-time coverage guard has nothing to read. | fanout-merge.cjs:869-997, :981-996 | CONFIRMED by trace |
| D13 | **NEW (gen 2). The narrative heading contract is mismatched.** The prompt pack asks for "Next Focus", while the reducer parses "Recommended Next Focus" and "Questions Remaining". Whether `extractSection` matches both is unread. | reduce-state.cjs:1927, :1930 | INFERENCE; first task of Slice E. **CORRECTED (Fable review):** CONFIRMED for research. `extractSection` matches a heading exactly (reduce-state.cjs:1891-1895), the pack asks for "Next Focus" (prompt-pack-iteration.md.tmpl:61), and the reducer and the agent definition use "Recommended Next Focus" (.skilled/agents/deep-research.md:228). No behavioral effect today, because the parsed value has no consumer (D5). "Questions Remaining" matches. Review accepts all three spellings (runtime/scripts/reduce-state.cjs:355) and is not affected. |
| D14 | **NEW (gen 2, observed by the orchestrator). `executor_missing` triggers `redispatch_once` on an iteration that already landed.** The verify gate cannot tell a missing provenance row from a missing iteration, so it re-dispatches finished work. The second leaf correctly refused to overwrite and burned a full dispatch. | deep-research.yaml:1514, :1539; this run, gen-2 iteration 1 | CONFIRMED live. **CORRECTED (Fable review):** OVERSTATED on mechanism. The verify gate does tell the cases apart: it returns `executor_missing` (verify-iteration.cjs:570-573) only after the narrative, state record and delta checks passed (:479-530). The defect is that `redispatch_once` (deep-research.yaml:1539) fires on any reason. |

## 14. Run Evidence: Live Confirmations From This Packet

- **D1 is confirmed live (generation 1).**
  - After iteration 6, `convergence.cjs` returned **BLOCKED** (`source_diversity_guard`, sourceDiversity 0.00 against a threshold of 1.5).
  - Iteration 7 attached its own `quality_class` labels.
  - The next check read **2.0** and returned STOP_ALLOWED.

  So the guard can't pass without a producer, and any self-chosen label passes it. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-007.md]
- **D5 is visible in generation 1's strategy.** Iteration 1's status sentence became Next Focus verbatim.
- **D6, D7 and D9 occurred on every iteration of both generations.** Generation 2 iteration 1 probed the projection directly. The submitted record carried 14 route-proof and telemetry fields; the projected row kept 10 core keys. [SOURCE: research/iterations/iteration-001.md]
- **D11 was hit by this packet.** Extending the completed generation-1 run required `--restart` and a hand-carried Known Context.
- **D14 was hit by this packet** in generation 2, iteration 1 (§3).
- **Mid-run inbox injection worked.** The operator's Q6 row was promoted on the next reduce and answered in iteration 4.
- **Ratio trajectories.** Generation 1: 0.91, 0.89, 0.80, 0.86, 0.85, 0.86, 0.63. Generation 2: 0.63, 0.80, 0.90, 0.90, 0.85. These are self-reported, focus-relative values, so they describe the trajectory only and are not evidence of completeness.

## 15. Risks

- **Frontier runaway or cost growth.** Mitigations: the depth, children and total caps, narrow-only budgets, and the `maxIterations` hard cap.
- **Leaf over-proposing.** Mitigations: the relevance gate requires an evidence anchor, the dedupe step, and workflow-owned admission (leaves cannot write the inbox).
- **Default-path regression.** Mitigations: the flag gating, the absent-key-reads-as-default rule, and the golden byte-identity test. Slices C (D3) and D (D5) deliberately change default timing and focus, and must say so in their changelogs.
- **Gaming the stop guards** (D1). The sub-mode must not rely on `sourceDiversity` until Slice G lands. Until then, report it as `notEvaluated` under expansive mode. **CORRECTED (Fable review):** `notEvaluated` exists only on the quality guard that counts SOURCE nodes (`convergence.cjs:858-866`). D1 is the graph signal, a number checked against 1.5 (`:437`, `:448`), which has no such state. Suppressing it under expansive mode needs its own change in `evaluateResearch`.
- **Ledger-schema drift from Slice A.** A new `run_extended` stem touches both ledger schemas and the upcaster. Mitigated by `check-ledger-stem-producers` and `check-projection-coverage`.
- **Extension re-stopping immediately** under `stopPolicy: convergence` with an unchanged question set (§12 item 5).
- **CORRECTED (Fable review): extension re-stopping on the duration check.** Wall-clock time since `createdAt` counts, idle time included, so an extension started after the old budget stops before its first dispatch unless the new ceiling is computed from elapsed time (§19 item 4).
- **CORRECTED (Fable review): a frontier that cannot close.** Unanswered terminal nodes leave counted questions open and QUESTION nodes uncovered, which blocks both the question stop and the graph stop (§8, gaps 1 and 3).
- **CORRECTED (Fable review): Slice F is a ledger schema change.** It widens the same upcast the Eliminated Alternatives table rejects for frontier fields, and restoring `keyQuestions` turns the `focusAlignment` guard on for every research run.

## 16. References

- Generation 1:
  - iteration narratives `research_archive/20261117T103614Z/iterations/iteration-001.md` … `iteration-007.md`, deltas beside them;
  - synthesis `research_archive/20261117T103614Z/research.md`.
- Generation 2:
  - iteration narratives `research/iterations/iteration-001.md` … `iteration-005.md`, deltas `research/deltas/iter-001..005.jsonl`;
  - prompt packs `research/prompts/`.
- Resource map: `research/resource-map.md`, emitted from the generation-2 deltas.
- Graph-engineering program: `specs/system-deep-loop/loop-architecture/002-graph-engineering/` (001-006 research, `reference/02`, `03` and `05`).
- Runtime:
  - `.skilled/skills/system-deep-loop/runtime/scripts/{convergence,reduce-state,fanout-run,fanout-merge,dispatch-iteration,append-mode-event,loop-lock,verify-iteration,upsert}.cjs`;
  - `deep-research/scripts/{reduce-state.cjs,divergent-research-pivot.ts}`;
  - `deep-review/scripts/divergent-review-pivot.ts`;
  - `runtime/lib/coverage-graph/*`, `runtime/lib/deep-loop/*`, `runtime/lib/deep-research-ledger-schema/*` and `runtime/lib/deep-review-ledger-schema/*`.
- Workflows and protocol:
  - `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml`;
  - `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`.
- Skill advisor: `.skilled/skills/system-skill-advisor/runtime/lib/{prompt-policy,df-idf,command-attach}.ts`.

## 17. Convergence Report

- **Generation 1:**
  - **Stop reason:** converged (`all_questions_answered`, graph STOP_ALLOWED) after 7 of 10 iterations.
  - **Blocked stop:** one, at the iteration-7 check (`source_diversity_guard`).
  - **Floor and pivots:** the `minIterations` floor of 3 cleared at iteration 4. No divergent pivots ran.
- **Generation 2:**
  - **Stop reason:** `maxIterationsReached` at the iteration-6 pre-dispatch check, under `stopPolicy: max-iterations`, so convergence was telemetry only.
  - **Iterations:** 5 of 5, all complete and verified.
  - **Questions:** 4 of 6 answered (Q2, Q3, Q5, Q6). Q1 is answered except D4 and D8; Q4 is scoped.
  - **Last 3 iterations:**
    - run 3, the review side (0.90);
    - run 4, completed-run extension (0.90);
    - run 5, change slices (0.85).
  - **Threshold:** convergence threshold 0.05.
- **Divergence summary:** no divergent pivots recorded in either generation.
- **Orchestrator notes:**
  - Generation 2 opened through `--restart` because of D11.
  - Iteration 1 needed an executor-provenance backfill and triggered one wasted redispatch (D14).
  - The operator injected Q6 through the inbox at iteration 2.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

## 18. Generation 2: Review-Side Findings (Q2)

1. **Custom `reviewDimensions` disable the clean stop and the review pivot (D10).** See §13. Runs that use only the four default dimensions are unaffected. [SOURCE: research/iterations/iteration-003.md] **CORRECTED (Fable review):** those are the only runs the workflow allows (`deep-review.yaml:654`), so this is a hardening gap for hand-edited configs. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:654]
2. **Review has no question surface.** A whole-file grep of the review reducer finds no `inbox`, `keyQuestions` or `openQuestions`. The review coverage universe is `reviewDimensions`, normalized once at init and locked. The surfaces that can grow are `searchDebt`, `candidateCoverage`, `ruledOutCandidates`, `cleanSearchProof` and `traceability.results`. A review frontier must admit there, or into a `registry.frontier` that the review nextFocus chain reads. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:645] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:203]
3. **The review nextFocus chain has the D5 hijack.** The leaf's free "Recommended Next Focus" outranks the first-uncovered-dimension fallback, and that fallback can only ever name one of the four defaults. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2184]
4. **The review pivot's seed vocabulary is closed and re-derivational.**
   - It has five seed sources: unswept dimensions, `searchDebt`, v2-ledger method gaps and non-pass traceability results.
   - Boundary regexes reject any seed implying expand-scope.
   - All three seat mandates forbid "expanding the configured target".
   - Combined with D10, a custom dimension yields a permanent `unswept-dimension` seed that can never close.

   [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:172] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:398]
5. **`fanout-merge.cjs` keeps no merged coverage map (D12).** Generation 1's merge-time coverage guard and its `frontier_scope` partition need Slice I first. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:981] **CORRECTED (Fable review):** that holds for the review frontier (Slice K) only. The research merge already carries open and resolved questions (`fanout-merge.cjs:789-843`), which is why Slice J does not depend on I.
6. **The review prompt pack has no `frontier_proposal` channel.** Every "frontier" hit in `deep-review.yaml` is the pivot's candidate frontier (PARTIALLY verified by enumerating grep hits). [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1239]

**Pivot yield, CORRECTED.** An accepted research pivot turns a STOP into CONTINUE and re-focuses from existing state. It never adds questions, so `all_questions_answered` stays true, and every later stop re-pivots until the budget runs out. The yield is therefore `min(maxIterations − triggerIteration, remaining pivots)`, with `maxPivots: 3`. The council seats share a lifetime cap, `maxCouncilSeatOutputs: 9`, which three pivots fill exactly.
- Under `:auto`, an accepted pivot is adopted with no operator in the loop. The binding failure mode is council disagreement, not running out of candidates.
- `stopPolicy: max-iterations` returns CONTINUE before any stop candidate exists, so it also makes the pivot path unreachable.

[SOURCE: research/iterations/iteration-002.md] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1163]

**D1 honest fix.** Derive `quality_class` at the single ingest choke point, `upsert.cjs`, from source attributes the leaf can't freely invent (repo path segment and file type, URL host), and strip any leaf-supplied value. Keep the vocabulary as a frozen constant beside `SAFE_METADATA_KEYS`, for example: `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other`, `unclassified`.

The alternative is to derive it at query time in `computeResearchSourceDiversityFromData` and delete the stored field. That removes the gaming surface entirely, at the cost of the stored label in `query.cjs`.

The leftover gaming surface is honest: citing more distinct real sources raises the score. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:211] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:123]

## 19. Generation 2: Completed-Run Extension Design (Q6) — DESIGN

1. **The two loops differ today.** Research halts on a completed packet. Review skips to synthesis and re-synthesizes, but adds no iterations. `status: "complete"` is stamped late, after synthesis and the spec write-back. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:515] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:584]
2. **An in-loop extension path already exists under `:confirm`.** `gate_pre_synthesis.on_B` reads: "Run more iterations (increase max)… raise maxDurationMinutes in the config too". So the workflow already treats both budgets as mutable. The config's `fileProtection: immutable` binds the leaf and the optimizer, not the workflow. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1771]
3. **The cap and the floor need no code change.** `convergence.cjs` reads `config.maxIterations` and counts every iteration row. Pre- and post-extension iterations are one continuous count, which is the intended meaning. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1049] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115]
4. **The duration clock is the trap.** `elapsedMinutes` runs from the config's `createdAt`. A packet that finished near its ceiling would re-stop on the first duration check after extending. So extension raises `maxDurationMinutes` and never re-stamps `createdAt`. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:882]
   - **CORRECTED (Fable review):** the trap is wider than a packet that finished near its ceiling. The check is `floor((now − createdAt) / 60000) >= maxDurationMinutes`, and the step's own note says paused and waiting time counts. The default budget is 120 minutes. So any extension started more than the old budget after `createdAt`, which is every next-day extension, stops before its first dispatch if the ceiling is only raised by M, and always if M is omitted. Set `newMaxDurationMinutes = max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + M`, give M a default (the prior budget), and record `elapsedMinutesAtExtension` in the `run_extended` event. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:888] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:897] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:938]
5. **Adopt the reserved name.** Move `completed-continue` from `deferredModes` to `allowedModes`, and expose it as `--extend=N` with an optional `--extend-minutes=M`. [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:119]
   - **CORRECTED (Fable review):** only the research config has `allowedModes` and `deferredModes` (`deep-research-config.json:31-39`). The review config is flat, with no `lineage` block and neither list (`deep-review-config.json:3-7`). The review reducer also turns any mode outside `new|resume|restart` into `null` (`runtime/scripts/reduce-state.cjs:27`, `:112-114`), so it must learn the new mode. When M is omitted it needs the default from item 4.
6. **Event and config shape.**
   - Add a new stem per loop, `deep_research.run_extended` and `deep_review.run_extended`, appended through the gateway. Its fields:
     - `priorTailDigest`;
     - the same sessionId and generation;
     - `continuedFromRun`, the completed iteration count;
     - `extension: {addedIterations, priorMaxIterations, newMaxIterations, priorMaxDurationMinutes, newMaxDurationMinutes}`.
   - The config is mutated in place:
     - status changes from `complete` to `active`;
     - `maxIterations += N`;
     - `maxDurationMinutes += M`;
     - `lineage.continuedFromRun` is set.
   - Put the mutation in a pre-classify step, so classify lands on `resume` naturally. Review's `on_completed_session` must also check `lineage_mode` before its unconditional `skip_to: phase_synthesis`.

   [SOURCE: research/iterations/iteration-004.md]
   - **CORRECTED (Fable review):** six points the shape above leaves open or gets wrong.
     - **Status value.** The workflow writes only `initialized` and `complete` (`deep-research.yaml:565`, `:1927`) and classification tests only `status == 'complete'` (`:436`). `active` is a new value; use `initialized` or introduce it on purpose.
     - **Lock.** The mutation must run after `step_acquire_lock` (`deep-research.yaml:408`) and before `step_classify_session` (`:427`). The existing pre-init lifecycle step (`:270`) runs before the lock.
     - **Double event.** Landing on `resume` also appends a `resumed` event (`deep-research.yaml:446`). Decide whether both rows are wanted, since a plain `resumed` for an extension is an eliminated alternative.
     - **One mechanism.** If the pre-classify mutation is used, review never reaches `on_completed_session`, so the `lineage_mode` check there is the alternative, not an addition.
     - **Iteration budget.** `maxIterations += N` gives a run that converged at 7 of 10 six more iterations for `--extend=3`. `newMaxIterations = continuedFromRun + N` matches the flag's meaning.
     - **Stem handlers.** A new stem needs a case in each place that handles `run_resumed` today: the typed reducers and their exhaustive switches (`deep-research-reducer.ts:104-107`, `:1391`, `:1551`, `:1944`; `deep-review-reducer.ts:104-105`, `:493`, `:709`, `:1417`, `:1615`), the legacy projections that write the event back into the state log (`legacy-projections/deep-research-contract.ts:272-289`, `deep-review-state-contract.ts:138-158`), the lifecycle-event filters in both reducers (`deep-research/scripts/reduce-state.cjs:2245`, `:2294`; `runtime/scripts/reduce-state.cjs:497`, `:549`) and the stem-producer table (`deep-research-ledger-types.ts:758-761`). A stem missing from a projection fails silently: it is in the ledger and absent from the state log.
7. **The segment seam is free.** `current_segment` reads the latest `segment_start`, but nothing emits one today. The `run_extended` event can serve as the dashboard's before/after boundary without a new segment model. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1737]
8. **Edge case.** Under `stopPolicy: convergence`, `all_questions_answered` is still true after extending, so an extension without new questions re-stops. The contract should pair `--extend` with inbox question injection, which this packet proved works mid-run, or document the `off`/`max-iterations` window. Review has no question surface (§18), so on review the pairing would be candidate admission. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1149]
9. **Synthesis needs no change.** `step_read_all_iterations` globs every `iteration-*.md`, `step_update_config_status` re-marks the run complete, and the spec fence write-back replaces the whole block, so it is idempotent. The telemetry ledger must tolerate two `completed` terminal rows for one sessionId.
   - **CORRECTED (Fable review):** synthesis does need one change. The research protocol already states a precondition for this flow: "If reopening a completed packet later: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow". The design keeps the generation unchanged, so a second extension would write the same snapshot name. Add the snapshot step with a name that survives repeated extensions, or change the protocol line on purpose. [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:562]

## 20. Generation 2: Change-Slice Plan (Q5)

| Slice | What | Main files | Proving tests | Default-path risk | Depends on |
|---|---|---|---|---|---|
| **A** | Completed-run extension: `completed-continue` / `--extend=N` (§19) | `commands/deep/{research,review}.md`; both YAMLs (lineage param, `note_deferred_branches`, pre-classify step, review `on_completed_session`); both ledger schemas and types; `legacy-compatibility.ts`; `loop-protocol.md`; config assets; regenerated contracts | `workflow-restart-lifecycle`, `deep-review-auto-restart-contract`, ledger-schema and upcast suites, `append-mode-event-legacy-seam`, reducer Lifecycle-section parity, double-terminal telemetry, playbook entry | LOW (opt-in); schema drift guarded by stem and projection checks. **CORRECTED (Fable review):** the file list is incomplete. Add both typed reducers (`deep-research-reducers/`, `deep-review-reducers/`), both legacy projections (`legacy-projections/deep-research-contract.ts`, `deep-review-state-contract.ts`), both `reduce-state.cjs` (lifecycle filters, review `LIVE_LINEAGE_MODES`), the review `loop-protocol.md`, `review-mode-contract.yaml`, `state-format.md`, both quick references, the research `SKILL.md` and strategy asset, and both agent definitions. Four `system-spec-kit` tests assert the "deferred" wording and must change with it: `deep-review-contract-parity`, `deep-review-reducer-schema`, `deep-research-contract-parity` (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Add the duration formula, the snapshot step and the lock placement from §19. | none |
| **B** | D2: forward config-dir on research `cli-claude-code` | `dispatch-iteration.cjs:213-220, :355, :407`; `deep-research.yaml:1442`; `executor-audit.ts` | `cli-claude-code`, `cli-matrix`, `combo-matrix` + research-configDir case | LOW | none |
| **C** | D3: apply the review `minIterations` floor | `convergence.cjs:1159` | `review-depth-convergence`, `review-stop-path-replay` + iteration-1 veto case | MEDIUM (review may run one more iteration). **CORRECTED (Fable review):** LOW. No default run changes, because every review stop candidate already needs two iterations (§4 item 5); only a configured floor above 2 is affected. The "iteration-1 veto case" can only be built from a hand-made stop-decision input. | before J. **CORRECTED (Fable review):** before K; it changes only the review floor. |
| **D** | D5 and the review twin: stop free text hijacking focus | research `reduce-state.cjs:1927-1939, :2427-2473`; `continuity-thread.cjs:86-106`; review `reduce-state.cjs:2184-2215` | `deep-research-reduce-state`, `continuity-thread` + answered-filter cases | MEDIUM (focus changes) | before J |
| **E** | D6 and D13: align the agent and prompt-pack write list and headings | `render_prompt_pack` in both YAMLs; `.skilled/agents/deep-{research,review}.md`; `extractSection` | `deep-research-deltas-contract`, `deep-review-deltas-contract`, `check-documentation-drift` | LOW-MEDIUM (leaf contract, change in lockstep) | before J |
| **F** | D7 and D9: keep route-proof and telemetry fields in the projection | locate the projection writer; `verify-iteration.cjs`. **CORRECTED (Fable review):** the writer is located: `legacy-compatibility.ts:643-660`, `deep-research-ledger-schema.ts:657-660`, `deep-research-ledger-types.ts:185-200`, `legacy-projections/deep-research-contract.ts:312-325` | `append-mode-event-cli`, `-legacy-seam`, `check-projection-coverage`, `deep-research-projections-contract` + route-proof survival | LOW (additive). **CORRECTED (Fable review):** MEDIUM. It is a ledger schema change that widens the research upcast, the move the Eliminated Alternatives table rejects for frontier fields, and restoring `keyQuestions` turns the `focusAlignment` guard on for every research run (D9). | before J |
| **G** | D1: derive `quality_class` at upsert, closed vocabulary | `upsert.cjs:211-245`; coverage-graph lib constant | `coverage-graph-signals`, `convergence-script` (fixtures change), `upsert-script`, `deep-research-graph-upsert` | LOW-MEDIUM (signal tightens) | before J |
| **H** | D10: cover custom review dimensions. **CORRECTED (Fable review):** decide first. The workflow forbids custom dimensions (`deep-review.yaml:654`); enforcing that in code is the smaller fix, and covering them is a feature. | `reduce-state.cjs:1225-1247` | review reducer suite, `review-depth-convergence` + custom-dimension clean stop | LOW-MEDIUM | before K |
| **I** | D12: carry coverage surfaces through the fan-out merge | `fanout-merge.cjs:869-997` | `fanout-review-focus` + merged-coverage case | LOW (additive) | before K |
| **J** | Research frontier sub-mode (§8, §10) | prompt pack, `step_frontier_admit`, research reducer, `convergence.cjs` veto, depth budget, `fanout-run.cjs` | new `frontier-admit` suite; reducer, veto, fan-out and authority-composition cases; golden byte-identity | MEDIUM (opt-in) | D, E, F, G |
| **K** | Review frontier (§18) | review pack proposal channel, review admission into `candidateCoverage`/`searchDebt`, `divergent-review-pivot.ts` seeds, review admit step | `deep-review-deltas-contract`, review admit suite, `review-depth-convergence` | MEDIUM (opt-in) | H, I, J |
| **L** | Pivot hygiene: per-pivot vs lifetime seat cap, dead `minRemainingIterations`, one council retry | `divergent-pivot.ts:285-288, :739` | `divergent-pivot`, `council/multi-seat-dispatch` | LOW | none |
| **M** | D14: stop `executor_missing` redispatching a landed iteration | `deep-{research,review}.yaml` `post_dispatch_validate.on_failure`; `verify-iteration.cjs` reason split. **CORRECTED (Fable review):** no reason split is needed. `verify-iteration.cjs` already returns `executor_missing` separately (`:570-573`); the change is a reason filter on `redispatch_once` in both YAMLs. | verify-iteration reason table + no-redispatch-when-narrative-present case | LOW | none |

**Order:** A, then B through I with L and M in any order or in parallel, then J, then K. Every slice extends existing vitest suites; only J needs a new suite file. D4 and D8 are verified inside D and A. [SOURCE: research/iterations/iteration-005.md]

**CORRECTED (Fable review):** four changes to this plan.
- D4 and D8 are already verified (§13), so no slice carries them as a task.
- Slice J also needs the question-close and graph-close rules from §8 (gaps 1 to 3). Without them an expansive run cannot reach a clean stop.
- Slice K depends on H only if custom review dimensions are kept as a feature.
- Slice F and the "Widening the gateway research upcast" row in Eliminated Alternatives contradict each other. Decide whether the upcast may widen before either F or J is specified.
