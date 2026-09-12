---
title: "Deep Research Dashboard — swe-2-research lineage"
trigger_phrases: []
---
# Deep Research Dashboard — swe-2-research

| Field | Value |
|---|---|
| Session | `fanout-swe-2-research-1789189288280-etmi20` |
| Executor | cli-devin model=swe-2-max (inline; no nested dispatch) |
| Loop type | research |
| Stop policy | max-iterations (convergence telemetry only) |
| Status | **COMPLETE — 5/5 iterations, synthesis written** |
| Stop reason | `maxIterationsReached` |

## Iteration ledger

| Iter | Focus | Findings | newInfoRatio | Status |
|---|---|---|---|---|
| 1 | Packet archaeology — shipped surface + ordering invariants | inventory frozen `6012ec5c7d`; prove→rewire→delete→rename order; D1/D7 amendment | 1.00 | complete |
| 2 | Q1 latent failures | 8 defects/exposures at file+mechanism; 3 harness-level latents; "faster = defect signature" | 0.95 | complete |
| 3 | Q2 residue taxonomy | 11 classes + bucketing rule; missed classes named; live-tree re-verification | 0.85 | complete |
| 4 | Q3 ordered checklist | 21 steps, 5 phases, ordered by cost-of-failure-prevented | 0.70 | complete |
| 5 | Adversarial completeness | 3 citations corrected; sibling corroboration; containment audit clean; honest limits | 0.55 | complete |

## Question coverage

| Question | Status | Answered in |
|---|---|---|
| Q1 latent failures | answered | iter 2 |
| Q2 residue classes + missed class | answered | iter 3 |
| Q3 ordered checklist | answered | iter 4 |
| Q4 shipped surface + invariants | answered | iter 1 |
| Q5 historical-vs-live bucketing | answered | iter 3 |

## Integrity checks

- Write containment: `git status --porcelain` — zero tracked files modified repo-wide; all writes inside the lineage dir.
- Phase 010 output: not read (independence preserved).
- Suite/timing claims: cited as packet-document claims only; zero executions by this lineage.
- Terminal record: synthesis event appended with `stopReason: "maxIterationsReached"`.
