# Iteration 4: Q4, graph-loop principles from 002-graph-engineering for a widening sub-mode

## Focus

Q4. This iteration mines the 002-graph-engineering program for principles that a widening sub-mode could use: frontier expansion, node and edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules. Each principle is mapped onto the deep-loop runtime: registry, coverage graph, `inbox.jsonl` and `convergence.cjs`.

The secondary focus confirms iteration 3's inference that the append gateway drops `graphEvents` and gap fields from the research state-log projection.

Interpretation: the study syntheses are the primary evidence. The capstone S6 and the S1, S4 and S5 syntheses were read. The `reference/` guides 02, 03 and 05 and the parent `research/research.md` were also read. `context/` was reached only through those syntheses' citations and was not read directly.

## Actions Taken

1. Read the capstone `006-cross-study-integration/research/research.md` in full.
2. Grepped `reference/02`, `reference/03` and `reference/05`, then read the fan-out/fan-in, budget and coverage sections.
3. Grepped the S1, S3, S4 and S5 syntheses and the parent `research/research.md`, and read the S5 P4, S1 readiness/budget and S4 status lines.
4. Traced the research iteration path through the append gateway (`append-mode-event.cjs`) into `legacy-compatibility.ts`.
5. Read the focusAlignment guard and the research-facts projection in `convergence.cjs`.

## Findings

All graph-engineering principles below are DESIGN-level doctrine, not shipped behavior. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:23]

### Q4: principles and runtime mapping

1. **Frontier growth is a typed proposal that the workflow converts. The leaf never writes it.**
   - S1 models mid-run change as `GraphPatchProposalV1`, which carries a precondition digest and the affected frontier. Accepting it creates a new topology version.
   - S5 makes `need_new_source_scope`, `need_parallel_work` and `propose_next_focus` typed data. Only the enclosing workflow may convert them into an edge or a dispatch.
   - Runtime mapping: the leaf emits frontier-node proposals in its delta. The YAML or reducer becomes the automated writer of `research/inbox.jsonl`, which has none today (iteration 2 F3).

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:87] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:89] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:91]

2. **Depth and breadth are bounded by narrow-only inheritance and nested budgets.**
   - A sealed child binds maximum depth, child count and a conserved budget slice, and it may only narrow them.
   - Budgets nest run, then subgraph, then node, then attempt. Exhaustion chooses an explicit edge and never weakens gates.
   - Admission checks run in the order registry, policy, budget, depth, reachability, acyclicity. They use a worst-case estimate plus a runtime meter.
   - Runtime mapping: each frontier node carries `depth` and `parentId`. The config adds `maxDepth`, `maxFrontierNodes` and a per-node iteration slice, and an admission check runs before any inbox write.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:283] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:101] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md:42] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md:356]

3. **The program's stop rule is obligation accounting, not novelty.**
   - Completeness means every scoped obligation is accounted for, including blockers and negative results. A bounded loop may end `abstain`, `blocked` or `exhausted`.
   - S4 and S6 both read a falling self-reported novelty ratio as corpus-exhaustion telemetry, not as proof of convergence.
   - Runtime mapping: an expansive run stops when the frontier is empty, meaning every node is answered, blocked, exhausted or abstained, or when the budget is spent. `newInfoRatio` becomes a per-node signal.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:455] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/004-graph-engineering-master/research/research.md:17] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:553]

4. **Keep the shipped StopDecision live and add the frontier check beside it.**
   - S6 says S5's `StopDecision` stays the live per-loop stop owner. A graph convergence gate is a separate target-state addition.
   - S5 says do not replace the novelty, MAD and coverage vote.
   - The parent study calls the graph layer a structural guard, never a replacement.
   - Runtime mapping: add a frontier-exhaustion guard to `convergence.cjs`. It can only veto STOP while frontier nodes remain open, so default runs are unchanged.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:336] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:34] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/research/research.md:57]

5. **The typed knowledge graph already describes coverage-driven traversal.**
   - The adapter route reason is "remaining question lacks coverage".
   - Omitted edges lower coverage but never change the inline ratio.
   - Runtime mapping: uncovered `QUESTION` nodes in the coverage graph become traversal candidates. This closes iteration 3's gap, where the graph discovers questions but does not steer focus.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md:151] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/research/research.md:66]

6. **Swarm fan-out is a flat-pool frontier of detached filesystem lineages. Wave scheduling stays rejected.**
   - The join is deterministic: content first, then an ID tie-break, with `CONTRADICTS` variants kept.
   - `wave`/`depends_on` metadata is rejected and must not be approximated.
   - The decision guide requires distinct fan-out inputs.
   - Runtime mapping: expansive fan-out partitions frontier nodes across flat-pool lineages. Today every lineage gets the same topic (iteration 3 F8). The mapping does not revive `wave_orchestration`.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/05-deep-loop-to-graph-mapping.md:384] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/05-deep-loop-to-graph-mapping.md:397] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/05-deep-loop-to-graph-mapping.md:403] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/research/research.md:96] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:569]

7. **Fan-in needs an input-count guard and layered reduction.**
   - Never synthesize from a partial set and call the result complete.
   - For many branches, summarize per batch, then write the answer from the summaries.
   - Runtime mapping: synthesis checks that every frontier node is accounted for. A 100-commit target summarizes per batch before the final synthesis.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:438] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:455]

8. **Readiness is separate from execution width.**
   - A barrier is valid only when the consumer needs the complete set, cross-set dedupe or a total comparison. Otherwise stream ready items.
   - Runtime mapping: frontier nodes are worked as they become ready, and only synthesis is a barrier.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:39]

9. **An applicability gate decides when the mode fits.**
   - Graphs lose on simple lookups, and fan-out alone does not justify graph structure. What decides is whether width comes with verification and routing.
   - Runtime mapping: the sub-mode stays opt-in. It fits targets that break into many independent units, such as commits or skills and commands. It does not fit single-question research.

   [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:229] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:469]

10. **S1 already names the expansion metrics.** They are fan-out width, branch prune ratio, retry and revisit rate, straggler tax, and cost per certified outcome. Runtime mapping: add dashboard metrics for frontier size, pruned nodes and revisits. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:101]

11. **The principles can be used without the target-state components.**
    - The 036 plane is dark.
    - The typed graph compiler and admission, the belief projection and the policy compiler are classified Missing.
    - Runtime mapping: adopt the principles as additive deep-loop rules over the inbox, the registry and a convergence guard. Do not depend on 036 target-state components.

    [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:33] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:233]

### Secondary: gateway field drop (confirmed)

12. **Confirmed: the research gateway drops `graphEvents` and most record fields from the state log.**
    - The legacy upcast of a research `iteration_completed` keeps only `status`, `rawNewInfoRatio`, `ruledOut` as digest refs, `focus` and `answeredQuestions`.
    - The state-log rows for iterations 1-3 confirm this independently. They carry no `graphEvents`, `keyQuestions`, `sourcesQueried` or `toolsUsed`, and `ruledOut` appears only as `legacy-jsonl:<hash>:ruled-out:N`. Ruled-out text therefore never reaches the projection.
    - `graphEvents` still reach the coverage graph through the delta file (iteration 3 F6).

    [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:643] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:655] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl:6]

13. **Research and review records are handled differently.**
    - Deep-review iteration records travel whole (`data: { record: rawEvent }`).
    - Research records pass through the lossy legacy upcast.
    - An expansive sub-mode that needs frontier fields on the research state log needs a research iteration stem that keeps them, or it must read them from deltas.

    [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:446] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:455]

14. **Correction to iteration 1 F6: the focusAlignment guard is probably not evaluated on research runs today.**
    - The guard evaluates only records that carry both `answeredQuestions` and `keyQuestions`. When no record has both, it returns `notEvaluated`.
    - `stopDecisionResearchFacts` copies `keyQuestions` only when the field is present.
    - The research projection drops `keyQuestions` (finding 12). The guard is therefore likely `notEvaluated`, not a penalty on widening.
    - This rests on an untraced assumption: that `evidenceRecords` are state-log rows rather than delta rows. The check is to trace the caller that builds `evidenceRecords` for `stopDecisionResearchFacts`.

    [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:871] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:883] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1419] [INFERENCE: based on finding 12 and the guard's both-lists filter]

### Synthesis for Q5

[INFERENCE: from findings 1-11]

The program supplies a consistent recipe:
1. A frontier of typed nodes, each with depth and a parent.
2. Expansion as leaf proposals that the workflow admits under depth, child-count and budget ceilings, then writes to `inbox.jsonl`.
3. Traversal driven by uncovered `QUESTION` nodes.
4. Optional flat-pool fan-out over partitioned frontier nodes, with a counted, layered fan-in.
5. A stop rule based on frontier exhaustion or budget, added as a veto beside the unchanged `StopDecision` vote.

## Questions Answered

- Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules?

## Questions Remaining

- Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?
- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?

## Ruled Out

- Reading the `context/` blog and paper corpus directly. The five study syntheses already cite it, and the budget favored the syntheses.
- Making the sub-mode depend on 036 target-state components (graph compiler, sealing, belief projection). S6 P4 classifies them Missing.

## Dead Ends

- None new. `wave`/`depends_on` scheduling remains a dead end for the sub-mode, because the program rejects approximating it (finding 6).

## Edge Cases

- Ambiguous input: none. The syntheses were read as the program's evidence, and `context/` was reached only through their citations.
- Contradictory evidence: finding 14 refines iteration 1 F6. The guard code penalizes widening only when both lists are present, and the research projection removes `keyQuestions`. This remains unresolved until the `evidenceRecords` caller is traced.
- Missing dependencies: none.
- Partial success: none.

## SCOPE VIOLATIONS

- scope_violation (not executed): `progressiveSynthesis` is true in the config, which would call for updating `research/research.md`. The prompt pack's allowed write list names only this narrative, the delta file and the gateway's own writes, so `research/research.md` was not created or edited.

## Sources Consulted

- specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md:1-553
- specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md:9-121
- specs/system-deep-loop/loop-architecture/002-graph-engineering/004-graph-engineering-master/research/research.md:15-36
- specs/system-deep-loop/loop-architecture/002-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:9-148
- specs/system-deep-loop/loop-architecture/002-graph-engineering/003-graph-arch/research/research.md (keyword grep)
- specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md:425-475
- specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md:42,130-160,356-430
- specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/05-deep-loop-to-graph-mapping.md:380-440
- specs/system-deep-loop/loop-architecture/002-graph-engineering/research/research.md (keyword grep)
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:395-470
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:620-665
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:868-888,1400-1425

## Assessment

- New information ratio: 0.86. Of 14 findings, 10 are new and 4 are partly new (findings 5, 6, 12 and 14 extend iterations 1-3): (10 + 0.5 × 4) / 14.
- Questions addressed: Q4, plus the iteration 3 gateway inference.
- Questions answered: Q4.

## Reflection

- **What worked and why:** reading the capstone first gave the program's settled versus open split. Targeted greps of the reference guides then supplied concrete, citable mechanisms: fan-in guards, admission order and flat-pool rules. These map one to one onto runtime files.
- **What did not work and why:** the capstone deals mostly with authority and 036 cutover. Most of it does not bear on widening, so the reference guides and S1/S5 lines carried the substance.
- **What I would do differently:** grep the reference guides before the capstone, because they hold the operational primitives.

## Recommended Next Focus

Q5. Design the sub-mode concretely:
- a frontier node schema (`id`, `kind`, `depth`, `parentId`, `status`, `budgetSlice`, `stableQuestionId`);
- decomposition rules for both example targets (commit batches by path or subsystem; the advisor's surfaces: hook, scoring, command surfacing, chat-intent);
- expansion and pruning admission (depth, child count, duplicate and non-goal filter);
- the frontier-exhaustion stop veto.

Also trace the `evidenceRecords` caller in `convergence.cjs`, to settle finding 14.

## Next Focus

Q5: frontier data model, target decomposition for the 100-commit and skill-advisor examples, expansion and pruning admission, depth and budget, and the frontier-exhaustion stop veto.
