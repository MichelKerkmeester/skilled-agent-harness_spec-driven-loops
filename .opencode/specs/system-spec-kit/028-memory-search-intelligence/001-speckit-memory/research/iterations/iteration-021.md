# Iteration 21: Round D Adversarial Verification — Memory Procedural Candidates (all REFUTED)

## Focus
Round D adversarial verification (default-to-refute) of 3 [INFERRED] Memory procedural candidates — specifically whether the real save/reconsolidation infra can HOST them. Read-only.

## Verdicts (newInfoRatio 0.20 — strong refutations)
| Candidate | Verdict | Evidence |
|---|---|---|
| M-bad-pattern-negative-memory | **REFUTED** | A HAS_FAILURE edge is hard-rejected at TWO layers: frozen `RELATION_TYPES` (causal-edges.ts:21-28, 6 values, no HAS_FAILURE) + SQLite `CHECK(relation IN (...6...))` (vector-index-schema.ts:1113-1115,1781-1783) requiring a table-rebuild migration. Net-new schema work, NOT reuse. |
| M-skill-induction-from-repetition | **REFUTED** | `ReconsolidationAction` is a closed 3-way union (merge/conflict/complement, reconsolidation.ts:38); `determineAction` sees only a similarity scalar (:202-210); NO recurrence/frequency counter anywhere. Needs a new action AND a non-existent repetition counter. |
| M-procedural-version-reset | **REFUTED** | Reconsolidation is ALREADY append-only ("F04-001: mark old superseded, create new", :273) with deprecate-never-delete (importance_tier='deprecated' :526/529/575 + insertSupersedesEdge :365 + recordLineageTransition :370), type-agnostic so procedural is covered. The proposed mechanism ALREADY EXISTS. |

## Synthesis
**All 3 REFUTED** — the strongest refutation cluster of the campaign. The procedural-memory candidates (from B14, all marked INFERRED) do NOT survive contact with the real infra: bad-pattern + skill-induction require net-new schema/action/counter work (not the claimed "reuse"), and version-reset already exists. **This removes the procedural cluster from the "low-effort wins" column** — only the trust-gated-quarantine + contiguous-prefix GOs (Round C, confirmed) and the reliability-weighted-recall (needs the 'outcome' emission, Round C) remain viable; the latter still depends on wiring an outcome signal. Procedural memory is mostly an over-reach against this substrate.

## Next Focus
Procedural cluster largely refuted → de-scope in synthesis (keep only trust-quarantine + contiguous-prefix + the 'outcome'-emission-gated reliability recall). Honest correction to B14's optimism.
