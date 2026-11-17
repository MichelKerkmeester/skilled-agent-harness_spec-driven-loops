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

Synthesis of two research generations, both run 2026-11-17, and one independent review of the result:
- **Generation 1:** 7 native `@deep-research` iterations (Opus 5.5), session `2026-11-17T07:52:43.000Z`. Its packet, iteration narratives included, is archived at `research_archive/20261117T103614Z/` and cited at that path.
- **Generation 2:** 5 `cli-devin` iterations (`swe-2-max`), session `2026-11-17T10:36:36.000Z`, which verified and extended generation 1. Its narratives live in `research/iterations/`.
- **Independent review:** an adversarial review by Fable 5.2 (`scratch/fable-5-2-review.md`), with every P0 and P1 finding and a sample of P2 findings re-traced against the code by Opus 5.5 (`scratch/opus-verification-log.md`).

Every claim below cites an iteration narrative or the code it cites. Where generation 2 corrected generation 1, the correction is marked **CORRECTED (gen 2)**. Where the independent review corrected either generation and the verification upheld it, a short **Corrected after independent review:** note keeps the history visible. Labels: **CONFIRMED** means a code trace or a live run showed it. **INFERENCE** means it is derived and names its check. **DESIGN** means a proposal, not shipped behavior.

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
- **Stop:** `convergence.cjs` gains one veto, `frontierOpen`, placed after the `minIterations` floor. It can only turn a STOP candidate into CONTINUE while frontier nodes are open, and it is unreachable when the flag is off.
- **Close:** a node that ends unanswered must still close its counted question and stop counting against the graph thresholds. Generations 1 and 2 left this out. Without it an expansive run cannot reach a clean stop (§8, close rules).

[SOURCE: research_archive/20261117T103614Z/iterations/iteration-005.md] [SOURCE: research_archive/20261117T103614Z/iterations/iteration-006.md]

The run also found **nine defects and drifts (D1-D9)** that affect default runs. D1-D7 should ship as separate default-path fixes, outside the sub-mode (§13). The one the topic named holds in corrected form:
- A configured `--config-dir` on a single-executor research run with `cli-claude-code` is **silently dropped**.
- An explicit `--claude-config-dir` is **rejected loudly**.
- An inherited `CLAUDE_CONFIG_DIR` still reaches the child.
- Fan-out research lineages are **not** affected. [SOURCE: research_archive/20261117T103614Z/iterations/iteration-002.md] [SOURCE: research_archive/20261117T103614Z/iterations/iteration-007.md]

**Generation 2 added four things** (§18-§20):
1. **It re-verified D1, D2, D3, D5, D6, D7 and D9 against current code.** All hold as code facts. Corrected after independent review: generation 2 said the D7 projection seam had moved out of `legacy-compatibility.ts`. It had not. The upcast at `legacy-compatibility.ts:643-660` drops the fields by omission, so no field name appears there (§4 item 7). The review also showed that D3, D10 and D14 overstate their consequences (§13).
2. **It corrected the pivot-yield claim.** A divergent pivot after `all_questions_answered` buys `min(remaining iterations, remaining pivots)`, up to 3 pivots, not "about one iteration".
3. **It mapped the review side and found it has no question surface at all.** A review frontier must land in `candidateCoverage`/`searchDebt`, not in an inbox. It also found five new defects (D10-D14). Corrected after independent review: D10 is not the worst of them. The workflow allows only the four canonical dimension names (`deep-review.yaml:654`), so D10 is reachable only through a config that breaks that rule. It is a hardening gap, and fixing it needs a decision first.
4. **It designed completed-run extension, which the operator asked to have built.** It adopts the reserved `completed-continue` lineage mode, spelled `--extend=N`, with a new `run_extended` ledger event. The run keeps its session and generation, and the duration budget is raised rather than resetting `createdAt`. Corrected after independent review: the new ceiling must be computed from elapsed time, `max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + M`. The duration check counts idle wall-clock time since `createdAt`, so a plain `+= M` stops any extension started later than the old budget before its first dispatch (§19 item 4).

It then sequenced everything into slices (§20): 12 from iteration 5, plus slice M for D14, which the orchestrator observed. The extension ships first; the defect slices ship in any order; the frontier sub-mode comes after them, research before review. [SOURCE: research/iterations/iteration-001.md] [SOURCE: research/iterations/iteration-002.md] [SOURCE: research/iterations/iteration-003.md] [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-005.md]

**The independent review changed five things the build depends on** (verified by trace, see `scratch/opus-verification-log.md`):
1. **Extension duration formula** (P0): as above.
2. **Slice F is a ledger schema change, not an additive projection edit** (P0). The drop chain is the upcast, the stem's two-field optional schema, its data type and the projection writer. Restoring `keyQuestions` would also switch the `focusAlignment` guard on for every research run. Verification found one more consequence of the same drop: research's `findings_not_enumerated` gate in `verify-iteration.cjs` never runs, because it reads `findingsCount` from the projected row (CONFIRMED by trace, not live).
3. **The frontier design gains close rules** (P1): for nodes that end unanswered, for graph QUESTION nodes, and for the stuck sub-branch.
4. **Slice A's file and test list now includes the missed handlers** (P1): typed reducers, legacy projections, lifecycle filters, the review lineage-mode set, two `system-spec-kit` tests and eleven doc lines.
5. **D4, D8 and D13 are verified**, and §12's two "unknown location" items are closed.

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

Q2, Q3, Q5 and Q6 are answered. Q1 is answered: generation 2 left D4 and D8 open, and the independent review verified both by trace. Q4 is scoped but not answered (§12).

**Out of scope:** implementation and runtime code edits. This packet is research only.

## 3. Method

Generation 1 used seven fresh-context `@deep-research` leaf iterations with externalized state:
- Iterations 1-6 took Q1-Q7 in order. Iteration 2 closed both Q2 and Q7.
- Iteration 7 was a blocked-stop recovery iteration (§14).

Generation 2 used five `cli-devin` (`swe-2-max`) iterations under `stopPolicy: max-iterations`, so convergence was telemetry only and all five ran. Each iteration read the archived generation-1 synthesis first. The focus order was Q1, then Q3, then Q2, then Q6 (with Q4 as secondary, which went unused), then Q5.
- From iteration 2 on, the focus followed the reducer's Next Focus, or the leaf's own recommendation where the reducer's line restated it.
- The completed generation-1 packet could not be extended in place, so generation 2 opened through `--restart` (D11, §19).

After synthesis, Fable 5.2 reviewed this document adversarially against about 30 runtime, workflow, config and doc files. Opus 5.5 then re-traced each P0 and P1 finding, each defect verdict and all twelve P2 findings against the code before this version was written. No live run was repeated in either step.

Evidence sources:
- `convergence.cjs`, `reduce-state.cjs` (research and review), `continuity-thread.cjs`, the divergent-pivot modules, the coverage-graph libraries, `fanout-run.cjs`, `dispatch-iteration.cjs`, `executor-audit.ts`, `verify-iteration.cjs` and `append-mode-event.cjs`, plus its legacy-compatibility upcast, the ledger schemas, the typed reducers and the legacy projections;
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
   - The review template sets `antiConvergence.minIterations: 2`, which `stopDecisionConfig` reads, but the floor is never applied to review (defect D3).
   - Corrected after independent review: generations 1 and 2 concluded that a review run can stop at iteration 1. It cannot. Both review stop candidates need `coverageAge >= 1`: the clean stop directly, and the composite vote through its `dimensionCoverage` signal, without which the other two signals stay under the 0.60 bar. `reviewCoverageAge` counts the evidence records after the one that completed coverage, and there is one evidence record per iteration number, so any review stop candidate needs at least two iterations. With the shipped floor of 2, applying it changes no default run; it matters only for a configured floor above 2.

   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159] [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:12] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:785] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1106] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1430] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1347]
6. **The graph decision can only veto** (CONFIRMED). Its five thresholds (questionCoverage, claimVerificationRate, contradictionDensity, sourceDiversity, evidenceDepth) are all ratios over existing nodes, and none measures unvisited ground. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:432]
7. **Correction to iteration 1:** the `focusAlignment` guard does not penalize widening on research runs today. It is never evaluated (CONFIRMED by trace).
   - The guard only counts records that carry both `answeredQuestions` and `keyQuestions`; `:1594` is only where its input is built. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:871]
   - Those records are state-log rows, and the research gateway path drops `keyQuestions` from them. The drop happens by omission at four points, so none of them names the field (CONFIRMED by trace):
     1. the upcast builds the `iteration_completed` data from `status`, `newInfoRatio`, `ruledOut`, `focus` and `answeredQuestions` only; [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:643]
     2. the stem's optional-field rules allow only `focus` and `answeredQuestions`; [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:657]
     3. the data type has no other field; [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:185]
     4. the projection writer emits a ten-key row, which matches the ten keys generation 2 measured live. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:312]
   - Corrected after independent review: generation 2 grepped `legacy-compatibility.ts`, found no `keyQuestions`, and concluded the drop had moved to an unlocated module. Generation 1's location was right. [SOURCE: research/iterations/iteration-001.md]
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
5. **The review reducer has the same shape** (CONFIRMED). Its focus sources are the latest leaf `nextFocus`, the first uncovered entry of the four hard-coded `REQUIRED_DIMENSIONS`, the pivot focus and blocked-stop text. Corrected after independent review: that is the order the code evaluates them, and later assignments win. The precedence is blocked-stop text (when it is the most recent event), then the pivot focus, then the latest leaf `nextFocus`, then the first uncovered default dimension. A review frontier branch must be placed against this order. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2184]
6. **Question resolution is literal string equality, with no semantic test** (CONFIRMED). A question resolves when it is already `checked` (a `- [x]` strategy line or a prior registry `resolved`), when a record's `answeredQuestions` holds its exact text, when a record with answered questions has a single `keyQuestions` entry equal to it (dead today, because the projection drops `keyQuestions`), or when a record's `focus` equals it. A mode that splits or rewrites questions needs stable ids. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2481] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1219]

## 6. Existing Breadth Levers (Q3)

| Lever | What it adds | Adds questions or nodes mid-run? | What it lacks |
|---|---|---|---|
| Divergent pivot | One Council-chosen focus at a STOP candidate, at most 3 times, depth 1, no recursion | No. It sets `next_focus` only. | No registry write. Candidates are drawn only from existing state, and the code says they "test an existing in-scope finding rather than widening the research topic". |
| Coverage graph | Signals that can block a stop | Yes: agent-declared QUESTION nodes | Never steers focus; it is a second question set the reducer ignores. |
| Sliding-window | A windowed novelty measure | No | Measurement only. |
| `off` / `max-iterations` | Duration | No | Same direction. |
| Native fan-out | Model diversity, cross-model attribution | No | Every lineage gets the same topic, so there is no scope partition. |
| `wave_orchestration` | A question-partitioned parallel design | Partly (adjacent-question boost) | Reference-only and never executed; it prunes below the median. |
| Review dimensions | Four fixed axes with a 0.8 coverage gate | No | No sub-target decomposition. A dimension outside the four canonical names can never be marked covered (D10), but the workflow allows only those four. |

[SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1056] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1197] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:281] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:578] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1670] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2078] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:628] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:654]

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

## 8. The Expansive-Depth Sub-Mode Design (Q5) (DESIGN)

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

**Depth budget.** `maxIterations` is split 50% / 35% / 15% across depths 0-1, 2 and 3. Unused budget rolls down, never up. When a level's share is spent, its open nodes close as `exhausted: budget`. At the default caps (10 iterations for research, 7 for review) that is 5, 3.5 and 1.5 iterations per band for research, against a node cap of 40. So the node cap must be tied to `maxIterations`, or the design must state the minimum `maxIterations` an expansive run needs; otherwise most admitted nodes close as `exhausted: budget` (added after independent review). [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:3] [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:9]

**Stop veto `frontierOpen`.** It sits immediately after the `minIterations` floor and before the gates, guards and graph decision.
- It only converts a STOP candidate into CONTINUE.
- It applies only while open or active nodes exist and depth budget remains.
- It never creates a STOP, and never outranks the cap, failures, pause or the `off` and `max-iterations` policies.
- The frozen `stopReason` enum is untouched; only the reasonDetail vocabulary grows.
- It is a no-op when the flag is off or the frontier is empty.
- While admitted nodes are counted questions, `all_questions_answered` cannot fire with a node open, so in practice the veto acts on `composite_converged`. The stop-decision table test must build a composite candidate to exercise it.

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159]

**Local stuck handling.** STUCK_RECOVERY fires earlier in the order than any candidate. So under expansive mode the YAML's STUCK_RECOVERY handler first closes the active node as `exhausted` and advances focus. It falls through to global recovery only when no open node remains. `convergence.cjs` is not reordered. The expansive sub-branch must keep the existing `stuckRecovery` event append: `deriveLoopCounters` rebuilds `stuckCount` from the log and resets it on that event, so dropping the append would let the next low-yield iteration close the next node after a single iteration. The reset holds on both loops today: research appends `stuckRecovery` directly, and review's `deep_review.recovery_started` stem is projected back as a `stuckRecovery` event (verified after independent review). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1313] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1216] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:239]

**Focus.** Under the flag, a new reducer branch picks the next node: lowest depth first, then a node with no covering FINDING, then the oldest. The branch goes after the pivot focus and the blocked-stop recovery, and before continuity. Breadth at a level therefore completes before depth, and frontier ids replace the prose path that defect D5 shows can hijack focus.

**Composition.**
- With `divergent`: the Council pivot fires only once the frontier is terminal, and each pivot can reopen breadth through admission.
- With `sliding-window`: no change.
- With fan-out: open depth-1 nodes are partitioned round-robin across lineages, and a fan-in guard checks that every depth-1 node is accounted for.

**Close rules (added after independent review).** Generations 1 and 2 did not say how a node that ends unanswered stops counting. Without these rules an expansive run with any `exhausted`, `blocked`, `abstained` or `pruned` node can end only by the cap or by the two ratio signals.
1. **Question close.** An admitted node is a counted open question. Nothing maps a terminal frontier status to resolution, so `all_questions_answered` cannot be reached and `questionEntropy` needs 85% answered. The reducer already treats a `checked` question as resolved, so the rule can reuse that path: when a `frontier`-origin question's node reaches a terminal status, the reducer marks it resolved and records the status. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2499] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:815]
2. **Visited is not answered.** A question resolves after one non-error iteration whose `focus` equals its text. If the frontier Next Focus branch emits the node's question text as focus, nodes close by being visited. The design must emit a node id or a focus string that differs from the question text, or accept visit-closes on purpose. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2497]
3. **Graph close.** Question coverage counts a QUESTION node as covered only with two answering findings, and divides by all QUESTION nodes. Source diversity is also averaged over all QUESTION nodes. Low values become `uncovered_questions` and `source_diversity_guard` blockers, and a blocked graph turns a stop into BLOCKED. `step_frontier_graph_upsert` needs a rule for a pruned or exhausted node: do not write it, or remove or re-kind it on close. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:583] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:673] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:448] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1012]

## 9. Worked Decompositions of Both Example Targets (DESIGN)

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
  - command surfacing: the generated command table `COMMAND_ROWS`, `TRACKED_COMMANDS`, `DEPTH_WORDING` and `attachCommand`;
  - the scorer;
  - the per-runtime hook adapters;
  - a chat-intent class taxonomy, admitted at depth 2 only after the gate and scorer nodes return evidence.
- **Dedupe set:** the 10 existing `specs/system-skill-advisor/routing-and-scoring/001-010` packets. A match is admitted only as "what did 00N leave open".
- **Optional depth-2 review node:** on the `prompt-policy.ts` thresholds, once a concrete defect is suspected.

Corrected after independent review and verification: the earlier text named a `COMMAND_POLICIES` table. `command-attach.ts` no longer exports one (a guard test asserts its absence); the command data lives in `COMMAND_ROWS` (:64) and `TRACKED_COMMANDS` (:123), with `DEPTH_WORDING` at :275 and `attachCommand` at :517. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:126] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:275] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:517] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:624]

The scorer node's details rest on the directory listing only (INFERENCE); `df-idf.ts` was not read.

**CORRECTED (gen 2): the binding layer for target 2 is the gate, not the scorer.**
- `prompt-policy.ts` decides fire or skip from closed sets: `CASUAL_ACKNOWLEDGEMENTS`, `WORK_INTENT_VERBS`, `STOP_WORDS` and `GOVERNANCE_MARKERS`. It also applies length and token thresholds from `runtime/data/prompt-policy.default.json`; each threshold can be overridden by an environment variable.
- A casual or short chat prompt returns `fire: false` **before** scoring runs.
- `df-idf.ts` only computes corpus statistics, so a casual prompt never reaches it.

The frontier decomposition for target 2 should therefore root its depth-1 work in the gate and its threshold config, and treat the scorer as depth 2. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:1] [SOURCE: research/iterations/iteration-005.md]

## 10. Integration Map (Q6) (DESIGN, file by file)

| Surface | Change | Default-path effect |
|---|---|---|
| `.skilled/commands/deep/research.md`, `review.md` (flag table) and the presentation assets | Add `--depth-mode=default\|expansive`. Do **not** add a fifth `--convergence-mode` value, which would exclude `divergent` and `sliding-window`. | None when absent |
| `deep-research/assets/deep-research-config.json`, `deep-review/assets/deep-review-config.json` | Add `antiConvergence.depthMode: "default"` and an `expansiveDepth` block (maxDepth 3, maxChildrenPerNode 6, maxFrontierNodes tied to `maxIterations`, depthShares). Add `depthMode` to `lockedFields` and the optimizer manifest so the optimizer cannot switch widening on. | An absent key reads as default |
| `deep-research.yaml`, `deep-review.yaml` | Write the new keys in `step_create_config`. Add `step_frontier_admit` after verify-iteration and before `step_reduce_state`, and `step_frontier_graph_upsert` after `step_graph_upsert`, both `enabled_when depthMode == expansive`, with the graph close rule (§8). Add the expansive STUCK_RECOVERY sub-branch, keeping the `stuckRecovery` append. Leave `wave_orchestration` reference-only and give it a pointer. | Step list unchanged when off |
| `.skilled/agents/deep-research.md`, `deep-review.md` | Add the `frontier_proposal` delta row type. Leaves propose; they never write the inbox. | None |
| `prompt-pack-iteration.md.tmpl` (both) and the renderer | Add a conditional `## FRONTIER` block (node id, scope, budget, depth) and the proposal row shape. The allowed-write list must stay consistent with the agent definition (defect D6). | Same bytes when off |
| `deep-research/scripts/reduce-state.cjs` | Add `'frontier'` to `VALID_QUESTION_ORIGINS`; today unknown origins silently become `operator` (defect D4). Add the `buildRegistry` frontier field, emitted only when opted in, and the question close rule (§8). Add the frontier branch in `resolveNextFocus`. | Registry identical when off |
| `runtime/scripts/reduce-state.cjs` (review) | The same Next Focus frontier branch in the review block at :2184, placed against its last-assignment-wins order (§5 item 5). | Same |
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

Four tests are new:
1. a golden test: with `depthMode` absent, the registry, dashboard, Next Focus and rendered prompt pack are byte-identical;
2. a stop-decision table: `frontierOpen` appears only under expansive mode with open nodes, acts on a `composite_converged` candidate, and never outranks the cap, failures or stuck;
3. a reducer test: a `frontier`-origin inbox row keeps its origin;
4. a close test: a node that ends `exhausted` resolves its counted question and stops counting in the graph question-coverage and source-diversity signals.

[SOURCE: research_archive/20261117T103614Z/iterations/iteration-006.md]

## 11. Recommendations

Generation 2 replaced generation 1's two-step ordering with a slice plan (§20). In short:

1. **Build completed-run extension first** (Slice A, §19). It is self-contained and is the operator's priority. Use the elapsed-time duration formula and the full file list in §20.
2. **Ship the defect fixes as separate slices, in any order or in parallel** (Slices B-I, L and M): D2, D3, D5, D6 plus the heading mismatch, D7/D9, D1, D10, D12, pivot hygiene and D14. Each one changes default behavior or a contract, so none belongs inside the opt-in. Two of them need a decision before they are specified:
   - **Slice F:** may the research upcast and its schema widen (§12 item 6)?
   - **Slice H:** enforce the four-name dimension rule in code, or support custom dimensions (§12 item 7)?
3. **Then build the research frontier sub-mode** (Slice J), in generation 1's internal order:
   1. config and flag;
   2. a golden byte-identity test;
   3. reducer projection, Next Focus and the question close rule;
   4. `step_frontier_admit`;
   5. the veto;
   6. the proposal rows;
   7. the graph upsert with its close rule;
   8. fan-out `frontier_scope`.

   It needs D, E, F and G landed first.
4. **Build the review frontier last** (Slice K). It needs I and J, and H only if custom review dimensions are kept as a feature. It admits into `candidateCoverage`/`searchDebt`, not an inbox (§18).
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
| Widening the gateway research upcast to keep frontier fields | Eliminated for frontier fields only: frontier data already has a non-ledger channel (delta and inbox rows). Slice F does widen this same upcast, stem schema and type for route-proof, telemetry, `findingsCount` and `keyQuestions`, by the operator decision of 2026-11-17 recorded in §12 item 6. | append-mode-event.cjs:406; legacy-compatibility.ts:643 | g1-6, review |
| Reordering stuck after the veto in `convergence.cjs` | Changes default ordering | convergence.cjs:1130 | g1-6 |
| Storing frontier state on research iteration records | The gateway projection drops the fields | live projection probe; legacy-compatibility.ts:643 | g1-5, g2-1 |
| Leaf-emitted QUESTION graph events as the frontier source of truth | Emission is inconsistent: 17, 20, 1, 0 in gen 1; 0 on two of five gen-2 iterations | deltas | g1-5, g2 |
| Depending on the 036 target-state components | Classified Missing; the plane is dark | 006 research.md:233 | g1-4 |
| "A pivot after `all_questions_answered` buys about one iteration" | Wrong in general: `all_questions_answered` stays true, every later stop re-pivots, up to `maxPivots: 3` | divergent-pivot.ts:285; convergence.cjs:1149 | g2-2 |
| `minRemainingIterations` as a meaningful pivot guard | Unreachable: the cap at convergence.cjs:1115 outranks it | divergent-pivot.ts:287, :739 | g2-2 |
| Review frontier admission through `research/inbox.jsonl` | The review reducer has no question surface; nothing would read the row | reduce-state.cjs (0 inbox hits) | g2-3 |
| `--extend=N` as a flag separate from the lineage mode | Same machinery, split vocabulary; `completed-continue` is already the reserved name | deep-research.yaml:514; loop-protocol.md:119 | g2-4 |
| Re-stamping `createdAt` on extension to reset the duration clock | Erases the elapsed-time audit; raise `maxDurationMinutes` instead | deep-research.yaml:882 | g2-4 |
| `maxDurationMinutes += M` as the extension duration rule | The duration check counts idle wall-clock time since `createdAt`, so any extension started after the old budget stops before its first dispatch; use `max(prior, elapsedAtExtension) + M` | deep-research.yaml:888, :897; deep-review.yaml:938 | review |
| `maxIterations += N` as the extension iteration rule | A run that converged at 7 of 10 would get 6 more iterations for `--extend=3`; use `continuedFromRun + N` | convergence.cjs:1115 | review |
| Recording an extension as a plain `resumed` event | A budget top-up becomes indistinguishable from a resume | ledger schema | g2-4 |
| A `verify-iteration.cjs` reason split for D14 | The reasons are already distinct; `executor_missing` is returned only after the narrative, state record and delta checks pass. The fix is a reason filter on `redispatch_once` | verify-iteration.cjs:479, :520, :530, :573 | review |
| Treating the df-idf scorer as the target-2 gate | Casual prompts are skipped upstream in `prompt-policy.ts` | prompt-policy.ts:21 | g2-5 |
| Shipping the frontier sub-mode as one change | The defect layer is independently shippable and de-risks the four surfaces frontier composes | slice plan | g2-5 |

## Divergence Map

- **Convergence mode:** `default` in both generations. No divergent pivots were prepared or taken, and the registry records no saturated directions or overrides.
- **Breadth came from the orchestrator, not the runtime.** Generation 1 hand-steered `next_focus` in iterations 2-7. Generation 2 opened a second generation with new questions, and the operator injected Q6 through the inbox mid-run.
- **Inbox injection worked as designed.** The reducer promoted the operator row into the counted question set on the next reduce. This is live proof of the growth path the frontier design relies on (§8). The independent review added the other half: growth through the inbox needs a matching close rule, or the grown set blocks the stop.
- **Remaining frontier:** the open questions in §12.
- This section documents breadth only. It does not claim the topic converged because the frontier was broadened.

## 12. Open Questions

1. **Q4, the target-2 gate, is scoped but not answered.** Four reads remain, all under `.skilled/skills/system-skill-advisor/`:
   - `runtime/lib/prompt-policy.ts:80-223`, the evaluate function and its reason vocabulary;
   - the threshold values in `runtime/data/prompt-policy.default.json`;
   - what a `fire: false` skips at the hook call site (`hooks/claude/user-prompt-submit.ts`, `runtime/handlers/advisor-recommend.ts`);
   - the fixture `runtime/tests/legacy/advisor-fixtures/skippedShortCasual.json`, the cheapest ground truth.

   Corrected after independent review: the earlier paths left out the `runtime/` prefix. [SOURCE: research/iterations/iteration-005.md]
2. **Closed: D4 and D8.** Generation 2 left them unverified. The independent review verified both by trace (§13), so no slice carries them as a task.
3. **Closed: the two "unknown" locations.** The D7/D9 drop is the four-point chain in §4 item 7. `extractSection` matches a `## ` heading exactly, case-insensitive (D13). [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1891]
4. **Decided 2026-11-17: should `maxCouncilSeatOutputs: 9` be per pivot or lifetime?** As lifetime, a resumed pivot burns seats without completing. This is the decision point for Slice L. The operator chose per attempt: 3 council seat outputs per council attempt, with at most one quorum retry per pivot, so up to 6 seat outputs per pivot, and `maxPivots: 3` still capping the run. "Council" here is divergent mode's internal three-seat vote in `runtime/lib/deep-loop/divergent-pivot.ts`, not the deprecated ai-council mode.
5. **Under `stopPolicy: convergence`, an extension with no new questions re-stops at once** on `all_questions_answered`. Slice A must either couple extension with inbox injection or document the `--convergence-mode=off` window (§19).
6. **Decided 2026-11-17, option 1 (widen the upcast). Slice F: may the research upcast and its ledger schema widen?** Two options:
   - widen the upcast, the stem's optional fields and its type, so route-proof, telemetry, `findingsCount` and `keyQuestions` reach the state log; this switches the `focusAlignment` guard and the research `findings_not_enumerated` gate on for every research run;
   - keep the upcast narrow, treat the delta as the documented source for leaf fields (as `verify-iteration.cjs` already does for route proof), and point the findings gate and `focusAlignment` at the delta.

   The Eliminated Alternatives row on widening the upcast must agree with whichever is chosen. The operator chose the first option, widening, and the row now eliminates widening for frontier fields only.
7. **Decided 2026-11-17, support. D10: enforce or support?** Enforce the four-name rule at `deep-review.yaml:654` in code (smaller), or support custom dimensions in `buildDimensionCoverage` (a feature, which Slice K would then depend on). The operator chose support: every configured dimension is tracked and can be covered, and Slice K depends on Slice H.
8. **Synthesis snapshot name for repeated extensions.** The protocol asks for `research/synthesis-v{generation}.md` before a `completed-continue` flow, but extension keeps the generation, so a second extension would reuse the name (§19 item 9).
9. **Extension status value and review lineage shape.** §19 item 6 resets the config status to `initialized`, the only other value the workflow writes; `active` would be a deliberate new value. Still open: whether an extended config with `initialized` classifies as `resume` in every `:confirm` branch, which was not traced beyond the classify step. The review config has flat lineage fields, not a `lineage` block with `allowedModes` (§19 items 5 and 6).

## 13. Defects and Drift Register (affecting default runs)

| Id | Defect | Evidence | Status |
|---|---|---|---|
| D1 | **Graph `sourceDiversity` cannot pass on contract-compliant research runs.** It counts distinct `metadata.quality_class` per question. No runtime producer sets the value; only tests do. `upsert.cjs` copies leaf metadata verbatim with no vocabulary check, so any string counts. | coverage-graph-signals.ts:653, :680; upsert.cjs:235; coverage-graph-query.ts:123 | CONFIRMED live (gen 1 §14); re-verified gen 2 and by independent review |
| D2 | **Config-dir routing on single-executor research with `cli-claude-code`.** A configured `--config-dir` is silently dropped, and an explicit `--claude-config-dir` raises a UsageError. An inherited `CLAUDE_CONFIG_DIR` leaks through. Fan-out is not affected. | dispatch-iteration.cjs:213-220, :355, :407; deep-research.yaml:1442; deep-review.yaml:1519; fanout-run.cjs:3962, :3995 | CONFIRMED by trace, re-verified gen 2 and by independent review |
| D3 | **The review `antiConvergence.minIterations: 2` floor is configured but never applied.** It is gated on `loopType === 'research'`. Every review stop candidate already needs two iterations (`coverageAge >= 1`), so with the shipped floor no default run changes; only a configured floor above 2 is affected. | deep-review-config.json:12; convergence.cjs:1159, :1347, :785-793, :1106-1111, :1430-1443 | CONFIRMED (gate). Corrected after independent review: the "stop at iteration 1" consequence was overstated. Low priority. |
| D4 | **An unknown question origin silently becomes `operator`.** | deep-research/scripts/reduce-state.cjs:128-133, :204-207 | CONFIRMED gen 1; re-verified by trace after independent review |
| D5 | **Free text under "Questions Remaining" takes over Next Focus.** Answered questions are never filtered out. The leaf's parsed `nextFocus` has no consumer on the research path. The hijack needs at least one open machine question. The review chain has the same hijack. | reduce-state.cjs:1927-1939, :2427-2473, review :2184-2215; continuity-thread.cjs:86-106, :130 | CONFIRMED, "no reader" upgraded to CONFIRMED gen 2 |
| D6 | **The agent definition allows writing `research.md` under `progressiveSynthesis`, but the prompt pack's allowed-write list excludes it.** | .skilled/agents/deep-research.md; prompt-pack-iteration.md.tmpl:42-45 | CONFIRMED live, 12 of 12 iterations across both generations |
| D7 | **Leaf route-proof and telemetry fields are dropped from the research state-log projection.** The drop is the upcast at legacy-compatibility.ts:643-660, backed by the stem's two-field optional schema (deep-research-ledger-schema.ts:657-660), its type (deep-research-ledger-types.ts:185-200) and the ten-key projection writer (legacy-projections/deep-research-contract.ts:312-325). For route proof this is a documented trade-off: `verify-iteration` reads the delta instead (verify-iteration.cjs:502, :552-568). Found during verification: `findingsCount` is dropped too, so research's `findings_not_enumerated` gate reads `NaN` and never runs (verify-iteration.cjs:533-535). | as listed; live projection | CONFIRMED live, both generations; findings-gate consequence CONFIRMED by trace, not live. Corrected after independent review: generation 2's "location moved, writer not located" was wrong. |
| D8 | **A transient lock left by a dead session blocks resume for up to 60 minutes.** A lock taken without `--owner-pid` is marked transient, and a transient lock is never checked for a live pid. The workflow TTL is at least 30 minutes, and a lock is stale after twice its TTL. | loop-lock.cjs:183-186; runtime/lib/deep-loop/loop-lock.ts:641; deep-research.yaml:411 | CONFIRMED live gen 1; re-verified by trace after independent review |
| D9 | **The `focusAlignment` guard is never evaluated on research** (the projection drops `keyQuestions`, and the guard needs both lists on a record). Restoring the field turns the guard on for every research run. | convergence.cjs:871-875, :1594 | CONFIRMED live gen 2 |
| D10 | **NEW (gen 2). A `reviewDimensions` entry outside the four canonical names can never be marked covered.** `buildDimensionCoverage` writes only the four `REQUIRED_DIMENSIONS` keys, while convergence counts every configured dimension as missing until covered. So `all_dimensions_clean` is unreachable, and the review pivot, which triggers only on that reason, is dead too. The workflow says "Every element MUST be one of the four canonical dimension names", but that is a prose rule for the orchestrator and no code enforces it, so the defect needs a config that breaks the rule. | reduce-state.cjs:1223-1250; convergence.cjs:1540-1556, :1106-1111, :1145; divergent-review-pivot.ts:338-340; deep-review.yaml:654 | CONFIRMED by trace. Corrected after independent review: a hardening gap for out-of-contract configs, not the worst defect; fix needs the decision in §12 item 7. |
| D11 | **NEW (gen 2). A completed run cannot be extended.** Research `on_completed_session` halts, and review `on_completed_session` re-synthesizes but cannot add iterations. `completed-continue` is reserved but deferred, so the only path is `--restart`, which archives the registry, strategy and questions. Hit live: generation 2 had to open through a restart. | deep-research.yaml:515-519; deep-review.yaml:584-587; loop-protocol.md:119-146 | CONFIRMED live; fix designed (§19) |
| D12 | **NEW (gen 2). `fanout-merge.cjs` drops every review coverage surface.** The merged registry keeps findings, debt and verdict, but drops `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence` and `ruledOutCandidates`. A merge-time coverage guard has nothing to read. The research merge does carry open and resolved questions. | fanout-merge.cjs:869-997, :981-996, :789-843 | CONFIRMED by trace |
| D13 | **NEW (gen 2). The narrative heading contract is mismatched on research.** `extractSection` matches a `## ` heading exactly, case-insensitive. The prompt pack asks for "Next Focus", while the reducer and the agent definition use "Recommended Next Focus", so a pack-compliant narrative is not parsed. No behavioral effect today, because the parsed value has no consumer (D5). "Questions Remaining" matches on both sides. Review accepts all three spellings and is not affected. | reduce-state.cjs:1891-1895, :1930; prompt-pack-iteration.md.tmpl:61; .skilled/agents/deep-research.md:228; runtime/scripts/reduce-state.cjs:355 | CONFIRMED by trace after independent review (was INFERENCE) |
| D14 | **NEW (gen 2, observed by the orchestrator). `executor_missing` triggers `redispatch_once` on an iteration that already landed.** The verify gate does tell the cases apart: it returns `executor_missing` only after the narrative, state record and delta checks pass. The defect is in the workflow: `redispatch_once` fires on the first failure of any reason, in both YAMLs. The second leaf correctly refused to overwrite and burned a full dispatch. | verify-iteration.cjs:479-483, :520, :530, :570-573; deep-research.yaml:1539; deep-review.yaml:1634 | CONFIRMED live. Corrected after independent review: the mechanism is the workflow's reason-blind redispatch, not the verify gate. |

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
- The independent review and its verification repeated no live run. Every "CONFIRMED live" above is this packet's own observation.

## 15. Risks

- **Frontier runaway or cost growth.** Mitigations: the depth, children and total caps, narrow-only budgets, and the `maxIterations` hard cap.
- **A frontier that cannot close.** Unanswered terminal nodes leave counted questions open and QUESTION nodes uncovered, which blocks both the question stop and the graph stop. Mitigation: the three close rules in §8, built inside Slice J and covered by the close test in §10.
- **Leaf over-proposing.** Mitigations: the relevance gate requires an evidence anchor, the dedupe step, and workflow-owned admission (leaves cannot write the inbox).
- **Default-path regression.** Mitigations: the flag gating, the absent-key-reads-as-default rule, and the golden byte-identity test. Slice D (D5) deliberately changes default focus, and Slice F, if it widens the upcast, switches the `focusAlignment` guard and the research findings gate on for every research run. Both must say so in their changelogs. Slice C changes no default run (§4 item 5).
- **Gaming the stop guards** (D1). The sub-mode must not rely on the graph `sourceDiversity` signal until Slice G lands. That signal is a number checked against 1.5 and has no "not evaluated" state; only the separate quality guard that counts SOURCE nodes does. Suppressing the graph signal under expansive mode would need its own change in `evaluateResearch`, so the simpler path is to land G first. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:858] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:437]
- **Ledger-schema drift from Slice A.** A new `run_extended` stem touches both ledger schemas, types and the upcaster, and every hand-written stem handler (§19 item 6). A stem missing from a typed reducer fails to compile (`assertNeverStem`), which is safe. A stem missing from a legacy projection fails silently: the event is in the ledger and absent from the state log. Mitigated by `check-ledger-stem-producers`, `check-projection-coverage` and a projection test for the new stem.
- **Extension re-stopping on the duration check.** Wall-clock time since `createdAt` counts, idle time included. Mitigated by the elapsed-time formula and a default for M (§19 item 4).
- **Extension re-stopping immediately** under `stopPolicy: convergence` with an unchanged question set (§12 item 5).

## 16. References

- Generation 1:
  - iteration narratives `research_archive/20261117T103614Z/iterations/iteration-001.md` … `iteration-007.md`, deltas beside them;
  - synthesis `research_archive/20261117T103614Z/research.md`.
- Generation 2:
  - iteration narratives `research/iterations/iteration-001.md` … `iteration-005.md`, deltas `research/deltas/iter-001..005.jsonl`;
  - prompt packs `research/prompts/`.
- Independent review: `scratch/fable-5-2-review.md` (Fable 5.2) and `scratch/opus-verification-log.md` (verification by Opus 5.5). Fable's corrected draft is kept at `scratch/research-fable-5-2-draft.md`.
- Resource map: `research/resource-map.md`, emitted from the generation-2 deltas.
- Graph-engineering program: `specs/system-deep-loop/loop-architecture/002-graph-engineering/` (001-006 research, `reference/02`, `03` and `05`).
- Runtime:
  - `.skilled/skills/system-deep-loop/runtime/scripts/{convergence,reduce-state,fanout-run,fanout-merge,dispatch-iteration,append-mode-event,loop-lock,verify-iteration,upsert}.cjs`;
  - `deep-research/scripts/{reduce-state.cjs,divergent-research-pivot.ts}`;
  - `deep-review/scripts/divergent-review-pivot.ts`;
  - `runtime/lib/coverage-graph/*`, `runtime/lib/deep-loop/*`, `runtime/lib/deep-research-ledger-schema/*`, `runtime/lib/deep-review-ledger-schema/*`, `runtime/lib/deep-research-reducers/*`, `runtime/lib/deep-review-reducers/*` and `runtime/lib/legacy-projections/*`.
- Workflows and protocol:
  - `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml`;
  - `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` and `deep-review/references/protocol/loop-protocol.md`.
- Skill advisor: `.skilled/skills/system-skill-advisor/runtime/lib/{prompt-policy,df-idf,command-attach}.ts`.

## 17. Convergence Report

- **Generation 1:**
  - **Stop reason:** converged (`all_questions_answered`, graph STOP_ALLOWED) after 7 of 10 iterations.
  - **Blocked stop:** one, at the iteration-7 check (`source_diversity_guard`).
  - **Floor and pivots:** the `minIterations` floor of 3 cleared at iteration 4. No divergent pivots ran.
- **Generation 2:**
  - **Stop reason:** `maxIterationsReached` at the iteration-6 pre-dispatch check, under `stopPolicy: max-iterations`, so convergence was telemetry only.
  - **Iterations:** 5 of 5, all complete and verified.
  - **Questions:** 4 of 6 answered (Q2, Q3, Q5, Q6). Q1 was answered except D4 and D8, which the independent review then verified; Q4 is scoped.
  - **Last 3 iterations:**
    - run 3, the review side (0.90);
    - run 4, completed-run extension (0.90);
    - run 5, change slices (0.85).
  - **Threshold:** convergence threshold 0.05.
- **Independent review:** Fable 5.2 reviewed the synthesis (2 P0, 9 P1, 12 P2; defect verdicts 10 CONFIRMED, 1 WRONG, 3 OVERSTATED). Opus 5.5 verified it against the code: both P0s and 8 of 9 P1s upheld, P1 finding 7 (tests) partly upheld; 10 of 12 P2s upheld, P2 findings 22 (stuck strike) and 23 (citations) partly upheld; all 7 defect verdicts upheld. Verification also found one new defect consequence (the research findings gate, D7) and one stale citation (`COMMAND_POLICIES`, §9). Detail: `scratch/opus-verification-log.md`.
- **Divergence summary:** no divergent pivots recorded in either generation.
- **Orchestrator notes:**
  - Generation 2 opened through `--restart` because of D11.
  - Iteration 1 needed an executor-provenance backfill and triggered one wasted redispatch (D14).
  - The operator injected Q6 through the inbox at iteration 2.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

## 18. Generation 2: Review-Side Findings (Q2)

1. **Out-of-contract `reviewDimensions` disable the clean stop and the review pivot (D10).** See §13. Runs that use only the four default dimensions are unaffected, and those are the only runs the workflow allows. Corrected after independent review: this is a hardening gap for configs that break `deep-review.yaml:654`, not a defect on contract-compliant runs. [SOURCE: research/iterations/iteration-003.md] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:654]
2. **Review has no question surface.** A whole-file grep of the review reducer finds no `inbox`, `keyQuestions` or `openQuestions`. The review coverage universe is `reviewDimensions`, normalized once at init and locked. The surfaces that can grow are `searchDebt`, `candidateCoverage`, `ruledOutCandidates`, `cleanSearchProof` and `traceability.results`. A review frontier must admit there, or into a `registry.frontier` that the review nextFocus chain reads. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:645] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:203]
3. **The review nextFocus chain has the D5 hijack.** The leaf's free "Recommended Next Focus" outranks the first-uncovered-dimension fallback, and that fallback can only ever name one of the four defaults. The pivot focus and a recent blocked stop outrank both (§5 item 5). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2184]
4. **The review pivot's seed vocabulary is closed and re-derivational.**
   - It has five seed sources: unswept dimensions, `searchDebt`, v2-ledger method gaps and non-pass traceability results.
   - Boundary regexes reject any seed implying expand-scope.
   - All three seat mandates forbid "expanding the configured target".
   - Combined with D10, an out-of-contract dimension yields a permanent `unswept-dimension` seed that can never close.

   [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:172] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:398]
5. **`fanout-merge.cjs` keeps no merged review coverage map (D12).** A review merge-time coverage guard and a review `frontier_scope` partition need Slice I first. Corrected after independent review: this holds for the review frontier (Slice K) only. The research merge already carries open and resolved questions, which is why Slice J does not depend on I. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:981] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:789]
6. **The review prompt pack has no `frontier_proposal` channel.** Every "frontier" hit in `deep-review.yaml` is the pivot's candidate frontier (PARTIALLY verified by enumerating grep hits). [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1239]

**Pivot yield, CORRECTED.** An accepted research pivot turns a STOP into CONTINUE and re-focuses from existing state. It never adds questions, so `all_questions_answered` stays true, and every later stop re-pivots until the budget runs out. The yield is therefore `min(maxIterations − triggerIteration, remaining pivots)`, with `maxPivots: 3`. The council seats share a lifetime cap, `maxCouncilSeatOutputs: 9`, which three pivots fill exactly.
- Under `:auto`, an accepted pivot is adopted with no operator in the loop. The binding failure mode is council disagreement, not running out of candidates.
- `stopPolicy: max-iterations` returns CONTINUE before any stop candidate exists, so it also makes the pivot path unreachable.

[SOURCE: research/iterations/iteration-002.md] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1163]

**D1 honest fix.** Derive `quality_class` at the single ingest choke point, `upsert.cjs`, from source attributes the leaf can't freely invent (repo path segment and file type, URL host), and strip any leaf-supplied value. Keep the vocabulary as a frozen constant beside `SAFE_METADATA_KEYS`, for example: `repo-code`, `repo-test`, `repo-spec`, `skill-doc`, `ledger-state`, `external-doc`, `external-other`, `unclassified`.

The alternative is to derive it at query time in `computeResearchSourceDiversityFromData` and delete the stored field. That removes the gaming surface entirely, at the cost of the stored label in `query.cjs`.

The leftover gaming surface is honest: citing more distinct real sources raises the score. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:211] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:123]

## 19. Generation 2: Completed-Run Extension Design (Q6) (DESIGN)

1. **The two loops differ today.** Research halts on a completed packet. Review skips to synthesis and re-synthesizes, but adds no iterations. `status: "complete"` is stamped late, after synthesis and the spec write-back. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:515] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:584]
2. **An in-loop extension path already exists under `:confirm`.** `gate_pre_synthesis.on_B` reads: "Run more iterations (increase max)… raise maxDurationMinutes in the config too, or the duration check stops the loop again". So the workflow already treats both budgets as mutable. The config's `fileProtection: immutable` is meant to bind the leaf and the optimizer, not the workflow (INFERENCE: no code enforcer of `fileProtection` was found outside tests). The optimizer's `lockedFields` include `lineage` and `status`, which the extension mutates; that list governs the optimizer, not the workflow. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1771] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:80]
3. **The cap and the floor need no code change.** `convergence.cjs` reads `config.maxIterations` and counts every iteration row, with no session or generation filter. Pre- and post-extension iterations are one continuous count, which is the intended meaning. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1049] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115]
4. **The duration clock is the trap.** The check is `floor((now − createdAt) / 60000) >= maxDurationMinutes`, and the step's own note says paused and waiting time counts. The default budget is 120 minutes. Extension never re-stamps `createdAt`, so the elapsed-time audit survives, and it sets the new ceiling from the clock:
   - `newMaxDurationMinutes = max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + M`;
   - M defaults to the prior budget when `--extend-minutes` is omitted;
   - `elapsedMinutesAtExtension` is recorded in the `run_extended` event.

   Corrected after independent review: generation 2 framed the trap as "a packet that finished near its ceiling" and proposed `maxDurationMinutes += M` with M optional. Because idle time counts, that rule stops any extension started more than the old budget after `createdAt`, which is every next-day extension, before its first dispatch. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:888] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:897] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:938] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:11]
5. **Adopt the reserved name.** Expose `completed-continue` as `--extend=N` with an optional `--extend-minutes=M`. In research, move it from `lineage.deferredModes` to `lineage.allowedModes`. Review has neither list and no `lineage` block: its lineage fields are flat (`lineageMode`, `generation`, `continuedFromRun`), and the review reducer's `LIVE_LINEAGE_MODES` turns any mode outside `new|resume|restart` into `null`, so it must learn the new mode (corrected after independent review). [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:119] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:27] [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:3] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:27]
6. **Event and config shape.**
   - Add a new stem per loop, `deep_research.run_extended` and `deep_review.run_extended`, appended through the gateway. Its fields:
     - `priorTailDigest`;
     - the same sessionId and generation;
     - `continuedFromRun`, the completed iteration count;
     - `extension: {addedIterations, priorMaxIterations, newMaxIterations, priorMaxDurationMinutes, newMaxDurationMinutes, elapsedMinutesAtExtension}`.
   - The config is mutated in place:
     - status changes from `complete` to `initialized`, the only other value the workflow writes and the one classification already handles; a new `active` value would have to be introduced on purpose;
     - `maxIterations = continuedFromRun + N`, so `--extend=3` on a run that stopped at 7 of 10 gives 3 more iterations, not 6. Here `continuedFromRun` must be the count the cap uses: every `type: iteration` row, one per iteration number, error and timeout rows included. If it counted only completed iterations, `--extend=N` would yield fewer than N; [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1270]
     - `maxDurationMinutes` per item 4;
     - the research `lineage.continuedFromRun` or the review top-level `continuedFromRun` is set.
   - Put the mutation in a pre-classify step that runs after `step_acquire_lock` and before `step_classify_session`, so it happens under the lock and classify lands on `resume` naturally. The existing pre-init lifecycle step runs before the lock and is the wrong place. If the pre-classify mutation is used, review never reaches `on_completed_session`, so a `lineage_mode` check there is the alternative mechanism, not an addition. Pick one.
   - Landing on `resume` also appends a `resumed` event from `on_resume`. Decide whether the extension writes both `resumed` and `run_extended`, or suppresses `resumed`, since a plain `resumed` for an extension is an eliminated alternative.
   - A new stem needs a case in every hand-written place that handles `run_resumed` today: the typed reducers' routing tables and exhaustive switches, the two legacy projections that write a stem back into the state log, the lifecycle-event filters in both `reduce-state.cjs`, and the stem-producer tables.

   Corrected after independent review: generation 2 used status `active`, `maxIterations += N`, no lock placement and a shorter file list. [SOURCE: research/iterations/iteration-004.md] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:408] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:427] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:436] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:446] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:565] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:106] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts:104] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:272] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:138] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2245] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:497] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:758]
7. **The segment seam is free.** `current_segment` reads the latest `segment_start`, but nothing emits one today. The `run_extended` event can serve as the dashboard's before/after boundary without a new segment model. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1737]
8. **Edge case.** Under `stopPolicy: convergence`, `all_questions_answered` is still true after extending, so an extension without new questions re-stops. The contract should pair `--extend` with inbox question injection, which this packet proved works mid-run, or document the `off`/`max-iterations` window. Review has no question surface (§18), so on review the pairing would be candidate admission. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1149]
9. **Synthesis needs one change.** `step_read_all_iterations` globs every `iteration-*.md`, `step_update_config_status` re-marks the run complete, and the spec fence write-back replaces the whole block, so it is idempotent. The telemetry ledger must tolerate two `completed` terminal rows for one sessionId. The research protocol also states a precondition for this flow: snapshot `research/research.md` as `research/synthesis-v{generation}.md` before any `completed-continue` flow. Extension keeps the generation, so a second extension would reuse the snapshot name. Slice A must add the snapshot step with a name that survives repeated extensions (for example one keyed by `continuedFromRun`), or change the protocol line on purpose. Corrected after independent review: generation 2 said synthesis needs no change. [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:562]

## 20. Generation 2: Change-Slice Plan (Q5)

Corrected after independent review: Slices A, C, F, H and M and the order below changed. The verification log records each change.

| Slice | What | Main files | Proving tests | Default-path risk | Depends on |
|---|---|---|---|---|---|
| **A** | Completed-run extension: `completed-continue` / `--extend=N` (§19) | `commands/deep/{research,review}.md` (`--lineage-mode` rows); both YAMLs (lineage param, `note_deferred_branches`, locked pre-classify step, `on_resume` event choice, snapshot step); both ledger schemas and types, and the stem-producer tables; `legacy-compatibility.ts`; both typed reducers (`deep-research-reducers/`, `deep-review-reducers/`); both legacy projections (`legacy-projections/deep-research-contract.ts`, `deep-review-state-contract.ts`); both `reduce-state.cjs` (lifecycle filters, review `LIVE_LINEAGE_MODES`); config assets (research `lineage` lists, review flat fields); docs that call the mode deferred: both `loop-protocol.md`, `review-mode-contract.yaml`, review `state-format.md`, both quick references, research `SKILL.md` and strategy asset, both agent definitions | `workflow-restart-lifecycle`, `deep-review-auto-restart-contract`, ledger-schema and upcast suites, `append-mode-event-legacy-seam`, reducer Lifecycle-section parity, double-terminal telemetry, a `run_extended` projection case, a duration-ceiling case (extension started after the old budget), playbook entry. Two `system-spec-kit` assertions break and must change with the wording: `deep-review-contract-parity.vitest.ts:126` and `deep-review-reducer-schema.vitest.ts:120-121`. The assertions that the docs mention `completed-continue` survive, because the name stays. | LOW for default runs (opt-in), but it touches shared reducers and projections; a stem missing from a projection fails silently, so the projection case is required | none |
| **B** | D2: forward config-dir on research `cli-claude-code` | `dispatch-iteration.cjs:213-220, :355, :407`; `deep-research.yaml:1442`; `executor-audit.ts` | `cli-claude-code`, `cli-matrix`, `combo-matrix` + research-configDir case | LOW | none |
| **C** | D3: apply the review `minIterations` floor | `convergence.cjs:1159` | `review-depth-convergence`, `review-stop-path-replay` + a configured-floor-above-2 case (an iteration-1 case cannot be built from real loop state) | LOW: no default run changes, because every review stop candidate already needs two iterations | none |
| **D** | D5 and the review twin: stop free text hijacking focus | research `reduce-state.cjs:1927-1939, :2427-2473`; `continuity-thread.cjs:86-106`; review `reduce-state.cjs:2184-2215` | `deep-research-reduce-state`, `continuity-thread` + answered-filter cases | MEDIUM (focus changes) | after E; before J and K |
| **E** | D6 and D13: align the agent and prompt-pack write list and headings | `render_prompt_pack` in both YAMLs; `prompt-pack-iteration.md.tmpl`; `.skilled/agents/deep-{research,review}.md`; research `extractSection` callers | `deep-research-deltas-contract`, `deep-review-deltas-contract`, `check-documentation-drift` | LOW-MEDIUM (leaf contract, change in lockstep) | before J |
| **F** | D7 and D9: restore the leaf fields the research path needs; decided 2026-11-17 to widen the upcast (§12 item 6) | If widening: `legacy-compatibility.ts:643-660`, `deep-research-ledger-schema.ts:657-660`, `deep-research-ledger-types.ts:185-200`, `legacy-projections/deep-research-contract.ts:312-325`. If not: `verify-iteration.cjs` (findings gate reads the delta) and `convergence.cjs` (`focusAlignment` input) | `append-mode-event-cli`, `-legacy-seam`, `check-projection-coverage`, `deep-research-projections-contract` + route-proof survival, findings-gate-runs case | MEDIUM: either option switches the `focusAlignment` guard and the research findings gate on for every research run; widening is also a ledger schema change | decided (widen); before J |
| **G** | D1: derive `quality_class` at upsert, closed vocabulary | `upsert.cjs:211-245`; coverage-graph lib constant | `coverage-graph-signals`, `convergence-script` (fixtures change), `upsert-script`, `deep-research-graph-upsert` | LOW-MEDIUM (signal tightens) | before J |
| **H** | D10: review dimensions outside the four names. Decided 2026-11-17 (§12 item 7): support custom dimensions as a feature | Enforce: the review init or `convergence.cjs:1541` reader. Support: `runtime/scripts/reduce-state.cjs:1223-1250` | review reducer suite, `review-depth-convergence` + an out-of-contract dimension case | LOW-MEDIUM (support) | decided (support); before K |
| **I** | D12: carry coverage surfaces through the fan-out merge | `fanout-merge.cjs:869-997` | `fanout-review-focus` + merged-coverage case | LOW (additive) | before K |
| **J** | Research frontier sub-mode (§8, §10), including the three close rules and the stuck sub-branch that keeps the `stuckRecovery` append | prompt pack, `step_frontier_admit`, `step_frontier_graph_upsert`, research reducer (frontier field, Next Focus, question close), `convergence.cjs` veto, depth budget, `fanout-run.cjs` | new `frontier-admit` suite; reducer, veto (composite candidate), close, fan-out and authority-composition cases; golden byte-identity | MEDIUM (opt-in) | D, E, F, G, L |
| **K** | Review frontier (§18) | review pack proposal channel, review admission into `candidateCoverage`/`searchDebt`, `divergent-review-pivot.ts` seeds, review admit step | `deep-review-deltas-contract`, review admit suite, `review-depth-convergence` | MEDIUM (opt-in) | C, D, H, I, J, L |
| **L** | Pivot hygiene: per-pivot vs lifetime seat cap, dead `minRemainingIterations`, one council retry | `divergent-pivot.ts:285-288, :739` | `divergent-pivot`, `council/multi-seat-dispatch` | LOW | before J and K |
| **M** | D14: stop `executor_missing` redispatching a landed iteration | `deep-research.yaml` and `deep-review.yaml` `post_dispatch_validate.on_failure.redispatch_once`: a reason filter that re-dispatches only when the iteration did not land; no `verify-iteration.cjs` change | verify-iteration reason table + no-redispatch-when-narrative-present case | LOW | none |

**Order:** A merges first. Then B through I with L and M, with four edges: E before D, because D reads a heading the pack emits only after E; L before J and K, because J and K gate the pivot branch L rewrites; C and D before K, because K places its veto after the review floor C adds and extends the review focus block D rewrites. B, C, G and I have no ordering edge. The F and H decisions were taken on 2026-11-17 (§12 items 6 and 7). Then J, then K. Every slice extends existing vitest suites; only J needs a new suite file. D4 and D8 are already verified, so no slice carries them as a task. [SOURCE: research/iterations/iteration-005.md]
