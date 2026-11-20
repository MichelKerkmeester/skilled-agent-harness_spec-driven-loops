# Iteration 5: Blocked-stop recovery (second sources for the answered nodes, and graph evidence)

## Focus
BLOCKED on: source_diversity_guard, evidence_depth_guard, uncovered_questions. Recovery: give the answered questions second sources, and record question-to-finding-to-source coverage in the graph.

The convergence script blocked the stop at the start of this iteration (`STOP_BLOCKED`), although all three frontier nodes were answered. The coverage graph held only the three frontier QUESTION nodes, because iterations 1-4 emitted no `graphEvents`. A `blocked_stop` event was recorded through the gateway (ledger sequence 6).

## Actions Taken
1. Ran the stop decision and read its blockers: source diversity 0.00 and evidence depth 0.00 against a threshold of 1.5, with 3 uncovered questions.
2. Read iteration-graph-upsert.cjs to see what it reads.
3. Looked for a second source behind the F-1-003(a) claim in the loop-counter tests (loop-counters-derivation.vitest.ts:679ff).
4. Counted the frontier assertions in both reducer suites, to back the risk rating on the F-1-001 projection merge.
5. Re-checked iteration 1's Finding 6 (the dead gateway fallback) against runtime-relative references.

## Findings
1. **The graph stop guards ignore the mandatory finding rows and read only the optional `graphEvents`.**
   - `iteration-graph-upsert.cjs` extracts only `record.graphEvents` (iteration-graph-upsert.cjs:122).
   - The prompt pack calls that field optional (prompt-pack-iteration.md.tmpl, CONSTRAINTS, "include an optional `graphEvents` array"). Yet it makes `finding` rows with `sources` mandatory in the delta (OUTPUT CONTRACT item 3).
   - The frontier mirror writes only QUESTION nodes (`frontier-admit.cjs graph`; 3 nodes and 0 edges in this lineage).
   - Result in this lineage: 23 cited findings and 3 answered nodes, and still `source_diversity_guard`, `evidence_depth_guard` and `uncovered_questions` block the stop. This costs at least one recovery iteration per lineage that relies on the contract's mandatory fields.
   - **Change:** have `iteration-graph-upsert.cjs` also derive one FINDING node per delta `finding` row, one SOURCE node per entry in `sources`, a CITES edge for each, and an ANSWERS edge to the QUESTION node of each `answeredQuestions` entry. Then the guards read what the contract already requires, and `graphEvents` becomes a pure extra.
   - Value H (removes a systematic extra iteration and makes the guards runtime-independent), effort S-M, risk low.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:122] [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:54] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/opus/deep-research-state.jsonl (blocked_stop at run 5)]
2. **Second source for F-1-003(a): the per-node stuck tests cover review only.**
   - The `per-node stuck accounting under expansive depth` suite (loop-counters-derivation.vitest.ts:679ff) builds review rows (`dimensions`, `frontierNodeId`, P2 counts) and has no `loopType: 'research'` case after line 679. The research cases (104, 127) are lineage-wide.
   - Together with the `loopType === 'review'` gate at convergence.cjs:1774-1778, this confirms research is counted lineage-wide.
   - The change needs research cases in that suite.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:679] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1774]
3. **Second source for the F-1-001 projection-merge risk.** The research reducer suite mentions `frontier` 63 times (deep-research-reduce-state.vitest.ts), the review state-reducer suite 96 times (deep-review-state-reducer.vitest.ts) and frontier-admit.vitest.ts 47 times. A shared `projectFrontier` must keep all three green, so the medium risk rating stands. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts]
4. **Correction to iteration 1, Finding 6: the gateway fallback is not dead. It serves a cwd of `runtime/`.**
   - `scripts/append-mode-event.cjs` resolves when the working directory is `.skilled/skills/system-deep-loop/runtime/`. The runtime README and the playbook name the script that way (runtime/lib/mode-append-gateway/README.md:98; runtime/manual-testing-playbook/script-entry-points/append-mode-event-script.md:48).
   - The same YAML steps pass repo-root-relative paths for everything else, such as `.skilled/...` scripts and `{state_paths.*}` under `specs/`, so no step works end to end from that cwd.
   - **Revised change:** declare `working_directory: "{repo_root}"` on every gateway step, as the frontier steps already do (deep-research.yaml:375), then delete the 11 fallback lines.
   - Value low-M, effort S, risk low-medium. A vendored layout that runs from `runtime/` would need checking.
   [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md:98] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:375] [INFERENCE: based on the mixed relative paths inside the same step commands]

## Questions Answered
None new. This pass strengthens the evidence behind the three answered nodes and records graph coverage for them.

## Questions Remaining
None in scope.

## Ruled Out
- Emitting `graphEvents` retroactively for iterations 1-4. Iteration records are write-once. This iteration's record carries the coverage for all three questions instead.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: iteration 1's "dead fallback" against runtime-relative docs. Resolved in Finding 4, which narrows the claim.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:9, 122
- .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl
- .skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts:104, 127, 679-700
- .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts
- .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md:98
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1128
- .skilled/commands/deep/assets/deep-research.yaml:375
- this lineage's convergence.cjs output at iteration 5 (blockers)

## Assessment
- New information ratio: 0.55
- Questions addressed: F-1-001, F-1-003, F-1-005, by corroboration
- Questions answered: none new

## Reflection
- What worked and why: reading the blocker text and then the upsert's input filter turned a process obstacle into the lineage's highest-value-per-effort finding.
- What did not work and why: iterations 1-4 relied on the contract's mandatory fields and skipped the optional graph events, which the guards actually read.
- What I would do differently: emit `graphEvents` from iteration 1 in any run that must stop on convergence.

## Recommended Next Focus
Re-run the stop decision. If it allows the stop, synthesize.
