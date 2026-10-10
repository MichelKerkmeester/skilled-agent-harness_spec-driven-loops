# Iteration 9: cross-class consolidation, citation audit, and the phase-ranking draft

## Focus
Consolidation work before synthesis: one root-cause statement covering all five classes, the master rejected-ideas list, a draft of the implementation phases ranked by classes prevented per unit of cost, and an audit that every source tag written so far resolves.

## Actions Taken
- Wrote and ran a read-only citation auditor over iterations 1-8: every `[SOURCE: path:line]` and `path:start-end` range is checked for file existence and line-in-range.
- Consolidated the per-class mechanisms into one root-cause frame and re-checked the instance count against the recorded findings.
- Drafted the phase ranking and the uncertainty register that synthesis will finalize.

## Findings
1. [VERIFIED] Citation audit clean: 65 source tag pairs (60 unique) across iterations 1-8 resolve — every file exists and every cited line or range is within the file as it stands now. (ran: node .executor-state/check-citations.cjs over the lineage)
2. [VERIFIED] The same mechanism recurs in every class: a value that should be DERIVED is STORED, and its re-generation is triggered by a check that runs on a different surface or cadence than the edit. Counted instances, each verified in iterations 1-8: leaf-manifest.json, compiled-route manifests, their authored copies, Hermes copies, the trigger index, the compiled skill graph, the SQLite graph, the intent-signals carry, the five version carriers plus changelog name, and the router prose inventory. [SOURCE: .skilled/scripts/git-hooks/pre-commit:352-549] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:7-17]
3. [VERIFIED] Three prevention planes exist and the classes distribute across them: commit-time hook (route-remint, mirror parity, spec metadata), CI (leaf/derived freshness, parent-skill invariants, trigger index rebuild), and doctor/manual (parent-skill-check, skill-graph freshness, the sk-code umbrella). [SOURCE: .skilled/scripts/git-hooks/pre-commit:191-700] [SOURCE: .github/workflows/routing-registry-drift.yml:187-197]
4. [VERIFIED] A fourth split is lexical: the vocabulary the author sees (description.json keywords, ROUTER.md INTENT_SIGNALS) is not the vocabulary the scorer consumes (graph-metadata intent_signals via the compiled graph and SQLite), and counter-signals have no lane at all. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1009-1016] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/trust-lanes.ts:40-51]
5. [INFERRED] One root-cause statement for all five classes: the authoring surfaces and the consumed surfaces are separated by (a) generated copies whose re-mint runs only on a check the author does not run, (b) vocabularies where the obvious authoring file is inert, and (c) check planes that run on a different cadence than the edit; the smallest universal change is to attach each EXISTING check to the surface the author already touches (commit, validator, or the generator's own message) rather than to build a new gate.
6. [INFERRED] Draft phase ranking by classes prevented per unit of cost (one changed file unless noted): P1 extend the pre-commit staged-hub dispatch with the leaf-corpus trigger, the scoped per-hub checker and the sk-code umbrella — prevents E1 (leaf slice) and E5, two classes for one file; P2 wire the intent-signals check and the freshness panel (gateable exit) into the existing routing-drift job, and extend the carry generator to source description.json — prevents E3; P3 extend the changelog command to bump all carriers and allocate against the shared ref, empty the README warn set — prevents E2; P4 thread surfaceHint through the advisor options schema into the front-door spawn — prevents E4; P5 add one validator check entry for standalone leaf freshness plus cadence docs — prevents E1/E2 for external standalone users. P1 first on classes-per-cost; P5 cheapest for the second audience.
7. [INFERRED] Uncertainty register carried to synthesis: the changelog merge collision is packet-stated (spec.md:62) and not reproduced from the checkout; the intent-signals check has no caller found by search (search-based, not proof); the advisor battery was not run live in this lineage (its wrapper writes outside the lineage); the trigger-index staleness is expected mid-branch and healed post-merge by CI; the warn-only lists are deliberate carve-outs, not accidents.

## Ruled Out
- A single "derive everything" program that removes stored projections: the projections are served surfaces (SQLite queries, byte-compare replay, typed leaf keys); the cost lands inside the hot path, and every class already has a cheaper attach point.
- Promoting the draft ranking on new-machinery grounds: every draft phase extends an existing file; anything else failed the reversal-cost order in earlier iterations.

## Dead Ends
- None; the consolidation found no class without a recorded root cause and fix shape.

## Edge Cases
- Ambiguous input: the exact changelog collision mechanics stay ambiguous; recorded as packet-stated evidence rather than reproduced.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: the phase ranking is a draft; synthesis owns the final table.

## Sources Consulted
- lineage iterations 1-8 and their deltas (citation audit input)
- .skilled/scripts/git-hooks/pre-commit
- .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py
- .skilled/skills/system-skill-advisor/runtime/lib/derived/trust-lanes.ts
- .github/workflows/routing-registry-drift.yml

## Assessment
- New information ratio: 0.60
- Questions addressed: consolidation (no new key question)
- Questions answered: none new

## Reflection
- What worked and why: the citation auditor converts the whole evidence base into a machine-checked claim — every carried citation is resolvable now, which is exactly what the packet's completion criteria grep for.
- What did not work and why: the first auditor regex missed dash-ranges and reported only 8 tags; a second pass with range support found 65. The false-clean first run is the reason the audit is recorded with its counts.
- What I would do differently: write the auditor before iteration 2 and run it per iteration; a broken citation found at synthesis time costs a rewrite.

## Recommended Next Focus
Iteration 10: final gap check — walk the five classes against the required answer shape (root cause, why-the-UX-lets-it-happen, smallest fix ranked, proof, audience), confirm the synthesis outline satisfies the packet's completion criteria (three section headings, at least seven Evidence status lines, resolvable SOURCE tags), and evaluate convergence honestly before phase_synthesis.
