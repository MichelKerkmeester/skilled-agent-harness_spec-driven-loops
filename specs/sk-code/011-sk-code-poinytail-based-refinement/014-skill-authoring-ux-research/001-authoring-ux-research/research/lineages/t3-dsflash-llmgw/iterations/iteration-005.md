# Iteration 5: E3 second half — the reindex gap and the smallest fixes

## Focus
E3, second half: why author vocabulary edits fail to take effect (the served copy versus the source), and the smallest fix per E3 mechanism, ranked by reversal cost, with the battery command that proves each. Also inventory what parent-skill-check 5k and the reach prober already enforce, so the fixes do not duplicate them.

## Actions Taken
- Ran the skill-graph freshness panel (read-only by construction) — it reports staleness without writing.
- Read the freshness panel's contract and checked its wiring in CI and hooks.
- Read parent-skill-check's 5k vocabulary-parity implementation.
- Confirmed where the reach prober is wired (doctor route only).

## Findings
1. [VERIFIED] The advisor routes off THREE representations of the skill graph, and the canonical reindex is operator-gated by design: the compiled scripts/skill-graph.json, the SQLite skill-graph.sqlite the daemon reads, and the on-disk graph-metadata.json source of truth. The freshness panel that diffs them is strictly report-only and always exits 0 so it cannot gate. [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:7-17,39]
2. [VERIFIED] Ran the panel: the compiled skill-graph.json is STALE — generated 2026-10-02, while the newest source stamp is 2026-10-04 (cli-classifier). No zombies, ghosts, missing nodes or family mismatches; the gap is purely the reindex. (ran `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`)
3. [VERIFIED] The panel is not wired into the routing-registry-drift CI job or any hook; its only caller is the doctor route. A stale compiled graph can therefore sit unnoticed while the checks that do run (leaf freshness, derived freshness, guard) all pass. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml:6,60]
4. [VERIFIED] Parent-skill-check 5k enforces lexical agreement, not reach: alias ↔ routerSignal class keywords, mode packet ↔ description.json keywords, and every routerSignals mode routed by a canary case. It reports per-hub warn-only legs for hubs with pre-existing drift, and it never probes the scorer. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1185-1256]
5. [VERIFIED] The only end-to-end reach prober (ci-router-vocabulary-reach) asks the advisor per phrase and is wired only into a doctor route; it is the sole check that can detect "the edit landed but did not take effect", and it is the slowest and least-wired of the set. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:29-41]
6. [INFERRED] E3 root cause, second half: a vocabulary edit must traverse two operator-gated reindexes (compile metadata → rebuild SQLite) before the scorer sees it, and every fast check either compares the author-visible surfaces to each other (5k, intent-signals --check) or requires the operator reindex to already have run (reach probe). Nothing tells the author that the served copy is behind. The observed failure — identical advisor output before and after a keyword addition — is the expected result of that gap, not a scoring defect in itself.
7. [INFERRED] Smallest fix ranked by reversal cost: (a) build nothing fails — the author cannot see the gap; (b) change a value exposes it cheaply: flip the freshness panel from always-exit-0 to non-zero on staleness (or give it a --check strict mode) and add one call in the existing routing-registry-drift CI job; (c) extend an existing function in place is the core fix: give the intent-signals carry generator one more source (description.json keywords → graph-metadata intent_signals) so the file the author already edits becomes effective, and name the reindex command in every failure that requires one; (d) a new counter-signal lane for negatives is costlier than the values alternative — first spend intent signals on the expected winners (sk-doc for doc edits, deep-research for research prompts) and only propose an anti-signal lane if that fails, in which case it must land in the served scorer; (e) a new cross-surface vocabulary linter is rejected — 5k plus the reach prober already cover coherence and reach, and a third checker adds maintenance without new detection. Reindex automation (hook-driven SQLite rebuilds) is rejected for now: the panel says the reindex stays operator-owned, and a gate plus a named command reaches the fix cheaper.
8. [INFERRED] Proof set, with today's state: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (today: STALE COMPILED 2026-10-02 vs 2026-10-04), `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` (today: RESULT FAILED, cli-classifier 23 missing), and the battery replay `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/advisor-battery.cjs` (today: positives 13/17, negatives-false-positive 2/5). A fixed state is all three clean and the battery at ≥14/17 with 0/5.
9. [INFERRED] Audience split: maintainers get the gate + reindex command + carry generator source; external authors get the same carry generator behavior inside sk-create-skill plus failure messages that name the reindex step — their repositories will not run this doctor.

## Ruled Out
- Hook-driven automatic SQLite reindex: contradicts the panel's deliberate operator-gated design and adds a write-heavy step to every commit; a gate plus a named command detects the same gap for a fraction of the cost.
- A third cross-surface vocabulary linter: 5k and the reach prober already cover it; a new checker duplicates detection.
- Reading the advisor in-lineage to prove reach: `skill-advisor.cjs` writes a socket directory under /tmp and spawns a daemon; the packet-recorded 13/17 and 2/5 measurement stands as evidence.

## Dead Ends
- Searching for an existing reach check in the commit path found only the doctor route; the conclusion that reach is unwired at commit time rests on search plus the freshness panel's own description of its role.

## Edge Cases
- Contradictory evidence: none; the panel's comment and its live output agree.
- Missing dependencies: none.
- Partial success: E3's remediation is proposed, not implemented (research-only phase); the recommendation is explicit about the first fix to try.
- Ambiguous input: none.

## Sources Consulted
- .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
- .skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml
- .skilled/commands/doctor/scripts/parent-skill-check.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/after-advisor.txt

## Assessment
- New information ratio: 0.92
- Questions addressed: Q3 (complete)
- Questions answered: Q3

## Reflection
- What worked and why: running the freshness panel converted "the graph may be stale" into a dated, named fact and identified the two-reindex gap as E3's second root cause.
- What did not work and why: none this iteration; the panel is the rare check that is safe to run because it is report-only by explicit design.
- What I would do differently: check every diagnostic's write posture before planning to run it — this one documented its posture in the header and was safe; the advisor's write posture was not, and that shaped the evidence path.

## Recommended Next Focus
Iteration 6, E4: the advisor_recommend caller path — read the handler and tool that implement it, the compiled-route front door's flag contract, and the round-four tie-break's caller paragraph; isolate why --surface-hint is never passed and rank the smallest wiring change with its proof command.
