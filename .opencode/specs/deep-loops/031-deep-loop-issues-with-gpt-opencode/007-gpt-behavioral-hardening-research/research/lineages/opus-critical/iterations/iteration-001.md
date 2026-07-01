# Iteration 1 — Establishing the opus-critical lens: verify against code, not against prior syntheses

**Focus:** KQ-OPUS-1 — Set this lineage's discipline (independent source verification, adversarial toward *both* the GPT lineage and the sonnet-critical lineage) and re-derive the phase-005 outcome from its own primary table.

## What was read (this iteration)

- `research/research.md` (consolidated, prior round) — full
- `research/lineages/glm-max/research.md`, `research/lineages/gpt-fast-high/research.md` — full
- `research/lineages/sonnet-critical/research.md` — full (required input per charter §9.5)
- `005-gpt-verification-smoke/verification-smoke.md:110-131` — the command-owned attempts table
- `006-host-hard-identity-fix5/decision-record.md:10-38` — the FIX-5 trigger

## Finding 1 — This lineage's differentiator vs sonnet-critical

`sonnet-critical` already ran a strong 10-iteration critical pass and is on disk. A second critical lineage adds value only if it does something structurally different, not a paraphrase. The differentiator chosen: **verify every load-bearing claim against source code/config directly, and treat `sonnet-critical`'s own highest-confidence claims as adversarial targets** — the charter (§9.3) says to look for "places where the two original lineages agreed with each other for the wrong reason (shared blind spot)"; the same skepticism must apply to the critical round itself, or it just launders one round's blind spots into the next. Concretely, `sonnet-critical` §5 makes a "code-traced… guaranteed" claim about the ai-council validator (its single most assertive finding). That is exactly the kind of claim to re-verify from the emitter code, not accept. (Pursued in iter 2.)

## Finding 2 — Phase 005 outcome, re-derived from the primary table (independent confirmation)

`verification-smoke.md:117-124` records all four command-owned GPT smokes as `FAIL` / `FAIL/BLOCKED` — the word "inconclusive" does not appear in that table. It first enters at the packet's own summary layer (`research-prompt.md` §2) and is then inherited by both prior lineages. This independently reproduces `sonnet-critical` iter 1's re-derivation. I confirm it rather than restate it, and add: the ai-council row (`:122`) is materially different from the other three — it reads "no `round_completed` route-proof record because dispatch stopped at `phase_loop.step_orchestrate_session.pre_dispatch`." That specific detail (no route-proof record was ever emitted for ai-council) becomes load-bearing in iter 2-3 and neither prior lineage nor sonnet-critical used it.

## Finding 3 — The FIX-5 trigger is a two-arm disjunction, only one arm unmet

`decision-record.md:22`: the trigger fires on "a route-mismatched artifact … OR a `dispatch_failure`/`jsonl_wrong_type`/missing-artifact signal fires **while the native/Claude baseline passes**." The dispatch_failure arm literally fired 4/4 in phase 005; what was never run is the native/Claude baseline control. So the honest status is "the control was never run," not "the GPT evidence is ambiguous." Confirms `sonnet-critical` iter 1. I carry this forward as context, not as a novel claim.

## Ruled out this iteration

- Treating a second critical lineage as licensed to re-derive `sonnet-critical`'s findings unchanged — RULED OUT. Value requires source-level re-verification and adversarial pressure on the critical round's own claims (charter §9.3).

## Status

`insight` — no new files beyond those the prior lineages cited, but a committed methodological stance (verify emitter code, pressure the critical round itself) plus the isolation of the ai-council "no record emitted" detail for later use.

newInfoRatio: 0.80 — novelty: reframes the critical round's task from "correct the GPT lineage" to "correct whatever survived un-verified, including sonnet-critical's own code-traced claim," and isolates the ai-council pre_dispatch detail.
