# Deep-research dashboard - devin-swe-2-max

- Loop: research | Executor: cli-devin model=swe-2-max | Stop policy: max-iterations (15) | Status: complete (stopReason: maxIterationsReached)
- Topic: harden spec-folder tooling + automate healing of legacy/pre-v4 repos (branch 091-consolidate-small-packets + phase-013 repair)

## Iterations

| # | Focus | Findings | New-info | Outcome |
|---|-------|----------|----------|---------|
| 1 | Branch commit inventory + phase-013 baseline | 7 | high | 2,083 failing folders; 6 scripts; corpus commits mapped |
| 2 | Failure-class taxonomy | 6 | high | 11 rule classes ranked; derived-vs-authored split |
| 3 | Q2 producers: archive.sh + create.sh/template | 6 | high | archive path-rewrite gap; template anchor defect found |
| 4 | Existing healing tools audit | 7 | high | repair-derived allow-list; upgrade-legacy pipeline order; baseline mechanism |
| 5 | Q3 detection: staleness, MIGRATION, doctor wiring | 8 | high | upgrade-legacy orphaned from doctor; contract terms extracted |
| 6 | Q1: one-off script -> permanent tool map | 8 | high | specFolder gap in repair-derived; archive semantic conflict |
| 7 | Q1 close: 43-lane manual playbook | 6 | med | identical 9-rule brief; 4 mechanical rules identified |
| 8 | Q3: doctor-update apply battery slot | 8 | high | corpus_drift step design; include-archive widens record not repair |
| 9 | Q3 residual: pre-v4 detection signals | 7 | med | corpus.mjs alias-fold; v3 upgrade refuses .opencode writes |
| 10 | Q4: trigger-index rebuild job + token push | 6 | high | 1-of-4-artifact commit defect; stale-sha race; guard bypass |
| 11 | Q4: cleanup/census, seeder, Gate 3 wording | 7 | med | 9 uncovered add-on doc kinds; 3-way wording divergence |
| 12 | Corpus-commit lessons + Q5 surface map | 8 | med | inert --baseline ratchet; hooks already cover metadata remint |
| 13 | Q5: failure-class -> gate table | 6 | med | verdict-only base-fail comparison confirmed |
| 14 | Adversarial pass on top recommendations | 8 | refute | 4 recs revised; anchor mechanism corrected; specFolder load-bearing |
| 15 | Ranked recommendation table | 3 | consolidate | 18 recommendations ranked across Q1-Q5 |

## Registry state

- Findings: 101 delta rows | 15 curated keyFindings | ruled-out directions: 27
- Questions: 5/5 resolved | Convergence telemetry (not a stop signal): ~0.9
- Terminal synthesis: deep_research.synthesis_complete, stopReason=maxIterationsReached

## Artifacts

- `research.md` - final synthesis + ranked table
- `iterations/iteration-001..015.md` - narratives
- `deltas/iter-001..015.jsonl` - findings + ruled_out rows
- `deep-research-state.jsonl` - projected state (init + 15 iterations + synthesis)
- `findings-registry.json` - this run's curated registry
- `resource-map.md` - evidence index
