# Iteration 18: Round C Feasibility — Memory Procedural/Consolidation + Episode-Boundary Scope Decision

## Focus
Round C feasibility for M-procedural-reliability-weighted-recall, M-bad-pattern-negative-memory, M-skill-induction-from-repetition, M-trust-gated-quarantine-reconcile-signal, M-contiguous-prefix-stop + the episode-boundary scope decision + the procedural-reliability host. Read-only.

## Feasibility verdicts (newInfoRatio 0.70)
| Candidate | Verdict | Note |
|---|---|---|
| M-trust-gated-quarantine-reconcile-signal | **GO** (best-fit graft) | every primitive present: reconsolidation merge/conflict atomicity + "automated writers never overwrite manual" invariant + provenance + 'correction' adaptive channel; gate before `reconsolidate()` behind a default-OFF flag like `SPECKIT_RECONSOLIDATION` |
| M-contiguous-prefix-stop | **GO** (greenfield, isolated) | pure cursor-durability + additive stop-condition on the C4-C cursor surface; decoupled from save path |
| M-procedural-reliability-weighted-recall | **NEEDS-BENCHMARK** | host EXISTS (`adaptive_signal_events`, weight); wire the under-emitted `'outcome'` signal first, then fold into rank score |
| M-bad-pattern-negative-memory | **CAUTION** | reuse `'deprecated'` tier + the `contradicts` 0.8 dampener precedent; prereq: audit ALL retrieval-filter sites so anti-patterns don't resurface as positive guidance |
| M-skill-induction-from-repetition | **NEEDS-BENCHMARK** (heaviest) | rides merge-event repetition + access_count; adds a distillation WRITE step (like merge creates rows) → write-side corpus-quality risk; needs an induction-precision gate |

## Two scope answers
- **EPISODE-BOUNDARY: GRAFT onto the existing chunk-save path — do NOT adopt an episode model.** Internal Memory is doc/chunk-granular (`memory_index` rows carry chunk_index/parent_id; `reconsolidate()` fires per-save by similarity); the `'episodic'` TYPE is a DECAY class, not a capture boundary. aionforge's immutable-episode capture↔consolidation split has no substrate here — adopting it = invasive rewrite of `handlers/memory-save.ts` with no payoff. All 4 consolidation candidates attach at the reconsolidation-on-save hook + `adaptive_signal_events`/feedback-ledger.
- **PROCEDURAL-RELIABILITY HOST: EXISTS (not a gap), but `'outcome'` is under-emitted.** Host = `adaptive_signal_events` (`signal_type IN ('access','outcome','correction')`) + `recordAdaptiveSignal()` + `ADAPTIVE_SIGNAL_WEIGHTS` + FSRS columns. A read-hit 'access' signal already flows; the recall→task-success **'outcome'** usefulness signal is the missing EMISSION (only 2 call sites), not a missing store. `feedback-ledger.ts` is the candidate emission source.

## Sequencing
Ship the two GOs first/independently: M-contiguous-prefix-stop (isolated) + M-trust-gated-quarantine (strongest graft). Then wire `'outcome'` emission → procedural-reliability (benchmark). Then bad-pattern (audit filter sites). Last: skill-induction (write-side corpus risk).

## Next Focus
Episode-model avoided (graft confirmed). Two clean GOs. Open: does `handlers/checkpoints.ts` emit `'outcome'`? Can `feedback-ledger` FeedbackEventType be the canonical 'outcome' source?
