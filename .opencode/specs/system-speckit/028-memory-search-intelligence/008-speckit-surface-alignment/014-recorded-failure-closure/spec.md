# 014 — Recorded-Failure Closure ("detector fired, nobody acted")

## METADATA
- **Status:** Partial — 014(a) exemplar (cap reconcile) done; 014(b) closure route + constitutional rule remains a focused follow-up
- **Level:** 2
- **Parent:** `008-speckit-surface-alignment`
- **Source:** `../../research/fable-5-review-synthesis.md` §(a)

## 1. FINDING — a failure CLASS distinct from "no detector exists"
Several of the audit's own findings were about detectors that **fired and were recorded, but nobody acted**:
- Governance scenario 063 already *caught and wrote down* the feature-flag-catalog drift, then sat unactioned.
- Deep-research iteration-017 logged a live control-file cap contradiction "for reducer/operator follow-up," never closed.

This is different from "no detector exists" (which phase `001`'s validation gate addresses). Here the detector works; the closure route is missing.

## 2. EXEMPLAR (fix as proof-of-concept)
The deep-research packet's iteration-cap is contradictory across its own control files: `deep-research-config.json` was set to `20` (operator), `deep-research-strategy.md` still states "Hard cap: 40 iterations" / "Max iterations: 40", and the run actually stopped at 20. Note this specific instance is partly an artifact of this run's operator intervention (a manual stop at 20 against a 40-configured loop) — so the exemplar fix is reconciling the recorded cap to a single truthful source, not asserting 40 was wrong.

## 3. FIX APPROACH
1. **Fix the exemplar:** reconcile the deep-research cap to one source of truth (config/strategy agree, and reflect the actual stop reason).
2. **Build the closure route (the real value):** (a) a lightweight `unactioned-recorded-failure` surfacer — a check that scans recorded scenario transcripts + loop-state flags for `FAIL` / `follow-up` / `contradiction` markers that have no linked remediation; (b) a constitutional rule (via `/memory:learn`): a detector that fires without a routed follow-up is a HALT-and-record. The goal is that a route *exists*, not perfect coverage.

## 4. ACCEPTANCE
- Cap contradiction resolves to one source across config + strategy.
- A documented, demonstrable path turns a recorded scenario-fail / loop-flag into a tracked follow-up item.

## 5. WHY DEFERRED
This is a governance/process design task (a constitutional rule + a new surfacer), not a mechanical edit — it warrants a deliberate decision-record, not an autonomous dispatch. Captured here so it is buildable.
