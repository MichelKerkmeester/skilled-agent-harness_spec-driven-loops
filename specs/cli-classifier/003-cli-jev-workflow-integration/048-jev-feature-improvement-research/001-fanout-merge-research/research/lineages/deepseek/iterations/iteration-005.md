---
title: "Iteration 5: Default-on integration — requirements, cost model, risk register"
trigger_phrases: []
---
# Iteration 5: Default-on integration — requirements, cost model, risk register

## Focus

What turning the measured judgment on by default in the live merge would require: reader and policy constraints, the integration tiers, the places a model call would violate today's contracts, the cost model, and the risk register with measured rates.

## Actions Taken

- Read both live merge steps (`deep-research-auto.yaml`, `deep-review-auto.yaml`) and their bindings into synthesis.
- Re-read the 030 phase's out-of-scope row, reader requirement and verdict-line contract.
- Re-read the publication guard, answer-cache note and requalify path in the scorer.
- Recomputed cost per call, per pair and per run from the recorded calls and label volumes.

## Findings

1. The constraints are already written down: replacing the collapse or making a model the live merge decision is dropped out of scope, a `keep` only holds for the pair/model on its line, and every verdict line ends `reader=none named` until an operator names a reader. Default-on is therefore not a switch flip — it needs a named reader, a phase, and an explicit amendment of the pair/model scope. Candidates named in the record are the synthesis step that reads the merged registry and the `system-deep-loop` owner reviewing the dedup default; neither exists as a reader today. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:93] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:141] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:200]

2. The live merge is a hermetic zero-network step in both workflows. Default-on places a credentialed, network-dependent call inside `phase_synthesis`, in a step that today either succeeds offline or is skipped when `config.fanout` is absent; any failure mode must degrade byte-identically to today's merge output or the fan-out's synthesis is corrupted by an optional judgment. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1945-1953] [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2121-2132]

3. The publication guard makes the arm a no-op on live merges as designed. Only pairs whose two registries exist at `origin/main` are sent; every other pair is recorded `unmeasured_unpublished`. A live run's findings are written in the working tree before commit, so a default-on judge using the current guard would withhold nearly every live pair — the guard is correct for the shadow replay and must be amended or replaced (for example a post-commit second pass, or an explicit redaction policy) before live integration means anything. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:886-911] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:710-717]

4. Determinism is a first-class integration cost. The merge is deterministic and writes the merged registry and attribution atomically; the judgment deliberately re-samples every call with no answer cache, so a model inside the merge makes registry output run-to-run nondeterministic unless answers are cached by pair identity. The requalify check pins the model call (provider, model, version), not the gold or the cache, so a cache would also need its own identity and invalidation rule. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:84-87] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1036-1041] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1366-1381]

5. The cost model is small at the measured scale but unbounded without a cap: ~323 ms and ~65 input tokens per judgment call; three calls per pair, or two under early stop. The tracked corpus holds 124 classed pairs across 104 fan-out runs (~1.2 per run) with a labeled maximum of 10 pairs in one run, so a default shadow pass is seconds per run; a single workspace with large lineages can produce hundreds of cross-lineage pairs, and nothing in the merge caps the pair count or the spend. A default-on pass needs the sheet's per-class cap (60) and the runner-style budget guard transplanted onto pairs. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl] [SOURCE: ~/.skilled/.labels/030-labels.jsonl] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:65]

6. The risk register, with measured rates: 3 of 47 declared-`same` calls were confidently wrong (6.4% false-merge on the labeled corpus), 4 of 48 true `same` pairs were missed (8.3%), and the AB-repeat tiebreak itself created 2 of those 4 misses. Review semantics bound the verdict damage (a collapse keeps the highest severity and any active P0 still forces FAIL) but not the counts: `deep-review-auto.yaml` binds `p0_count/p1_count/p2_count` from the merge output, so collapsing distinct findings changes bound counts even when the verdict class survives. Privacy egress, credentials and a previously hermetic synthesis step are the remaining risks, all avoidable only if the judgment stays outside the authoritative merge path. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:464-470] [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2129-2132] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:902-914]

7. Integration tiers, cheapest first: (T0) default-on zero-call census at merge time — pair classes, oracle decisions, undecidable count written into `fanout-attribution.md`; (T1) default-on shadow judgment with a named reader, off the critical path, recorded outside the registry; (T2) default-on annotation of suspected duplicates inside the merged registry without collapsing; (T3) model as the collapse decision — already dropped. T0 needs no model and no policy change; T1/T2 need the reader, the guard decision, a cache and a cap; T3 should stay dropped until a held-out relabeling and a second rater show the false-merge rate is characterized. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:967-995] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md:158]

## Ruled Out

- "Flip it on as the collapse decision": explicitly out of scope in the record, and the measured false-merge rate is not yet characterized on a clean gold.
- "Default-on with today's publication guard": live pre-commit pairs are withheld, so the pass would measure nothing.

## Next Focus

Synthesis — rank the recommendations across all five questions and assemble `research.md` with the terminal `maxIterationsReached` stop reason.

## Sources

- `.skilled/commands/deep/assets/deep-research-auto.yaml`, `.skilled/commands/deep/assets/deep-review-auto.yaml`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/spec.md`
- `~/.skilled/.labels/030-labels.jsonl`, `~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl`
