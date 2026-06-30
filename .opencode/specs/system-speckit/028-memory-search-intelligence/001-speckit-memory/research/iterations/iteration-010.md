# Iteration 10: Adversarial Verification — FSRS Reinforcement Preservation under C6-A

## Focus
Round A verification: does C6-A (always-on rank-time decay via caller `nowMs` + reinforcement as a separate explicit event) preserve the FSRS stability/difficulty model, or break it? Read-only.

## Actions Taken
1. Located the REAL reinforcement model: `cognitive/fsrs-scheduler.ts` (the `lib/search/fsrs.ts` I first found is graph-centrality, NOT the scheduler).
2. Read pure decay `calculateRetrievability` (`fsrs-scheduler.ts:80-91`) + mutators `updateStability`/`updateDifficulty` (`:97-156`) + elapsed-from-last_review (`:161-172`).
3. Read the reinforcement write path `applyTestingEffect`/`strengthenOnAccess` (`stage2-fusion.ts:574-618,873-916`).

## Findings (file:line)

**FSRS already separates decay from reinforcement — [CONFIRMED].** Decay is a pure, side-effect-free read: `calculateRetrievability(stability, elapsedDays)` returns R(t)=(1+FACTOR·t/S)^DECAY and mutates nothing [fsrs-scheduler.ts:80-91]. Reinforcement (stability/difficulty bump + `last_review` reset) is a discrete write firing ONLY on the explicit `trackAccess=true` path [stage2-fusion.ts:873-877: "explicit opt-in to avoid unintended write side-effects during read-only searches"]. So reinforcement is already a separable, flag-gated event; default reads decay-only. The seam C6-A wants already exists. [CONFIRMED]

**C6-A's split is FSRS-safe — [CONFIRMED].** Always-on rank-time decay touches only `calculateRetrievability` (pure read, idempotent, writes nothing → no double-count). Splitting reinforcement off matches FSRS's native design (R(t) is queryable anytime; "review" is the discrete graded event) and the existing trackAccess gate. **One guardrail:** the explicit reinforcement event must still recompute R from elapsed-since-`last_review` and reset `last_review`, because `updateStability`'s `retrievabilityBonus=1+(1-R)·0.5` (`:114`) and `strengthenOnAccess`'s `difficultyBonus=(0.9-R)·0.5` (stage2-fusion.ts:593) consume R — freezing R into a constant would break the spacing-effect reward. Threading one `nowMs` through both rank-time decay and reinforcement R is strictly MORE correct than today, where `calculateElapsedDays` independently calls `new Date()` (`:166-168`). [CONFIRMED — C6-A is FSRS-safe, not a model change.]

## Questions Answered
- Is C6-A FSRS-safe? **YES** — FSRS already decouples pure-read decay from trackAccess-gated reinforcement; C6-A formalizes it. Guardrail: keep R tied to elapsed-since-last_review + bump last_review on the reinforcement write.

## Questions Remaining
- (new) Does any rank-time scorer currently consume R(t) on the read-only (non-trackAccess) path, or is `calculateRetrievability` only invoked inside `applyTestingEffect`? Determines whether always-on decay adds a new call site or reroutes the existing one.

## Next Focus
C6-A confirmed FSRS-safe; the clock-unification (thread caller nowMs into both `fsrs-scheduler.ts:166-168` decay and `strengthenOnAccess` `last_review`) is a low-effort net-new sub-candidate that also makes decay deterministic/testable.
