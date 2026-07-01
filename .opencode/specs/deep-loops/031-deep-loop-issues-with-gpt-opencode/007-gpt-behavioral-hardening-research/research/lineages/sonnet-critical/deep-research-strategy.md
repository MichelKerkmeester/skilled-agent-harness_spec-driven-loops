---
title: Deep Research Strategy - GPT Behavioral Hardening (sonnet-critical lineage) - SYNTHESIZED
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy — GPT Behavioral Hardening Critical Re-Review (sonnet-critical lineage) — SYNTHESIZED

> Reducer-refreshed after 10 iterations. Status: complete (synthesized). Fresh lineage for the operator-directed critical re-review round (`research-prompt.md` §9). Sibling lineage: `glm-critical`. Stop policy: `max-iterations` (10) — convergence signals throughout were treated as telemetry only, per charter.

## 1. TOPIC

Critical re-review of GPT behavioral hardening research (packet 031) — operator-confirmed symptoms, correct for GPT-self-assessment bias, find concrete fixes. See init strategy (§1 Known Context, preserved below) and `research-prompt.md` §9.

### Known Context (from init)

- Predecessor research (`../001-deep-agent-router-and-orchestration/research/research.md`) established the mis-route taxonomy (modes A/B/C) as operator-asserted axioms (§0), the `subagent_type: "general"` soft-identity root cause (§1), the FIX-5 false-negative (§5), and the host-hard-identity architectural spec (§8b).
- Phase 005 (`005-gpt-verification-smoke/verification-smoke.md`) ran 4 command-owned GPT smokes: all 4 recorded FAIL/FAIL-BLOCKED before real leaf dispatch. No native/Claude baseline was run in that session.
- Phase 006 decision record sets the FIX-5 unpark trigger: route-mismatched artifact OR a dispatch_failure-class signal firing while the native/Claude baseline passes. The baseline-comparison clause was never exercised.
- Both prior lineages (glm-max, gpt-fast-high) ran 30/30 iterations, answered all 9 KQs, converged on: do not unpark FIX-5 yet; keep ai-council `mode: all`; orchestrate delegates deep-dispatch to `deep.md`; a detection-only enforcement plugin is feasible; build a GPT-vs-Claude benchmark. They diverge on phase ordering and glm-max uniquely proposes "Mode D."
- Operator ground truth (CONFIRMED first-hand, 2026-07-01): GPT is slow as `@orchestrate`, invokes wrong sub-agent, gets stuck on pre-defined flows, overthinks/needs literal instructions.
- Known conflict of interest: `gpt-fast-high` is GPT researching GPT's own failure modes.

<!-- ANCHOR:key-questions -->
## 2. KEY QUESTIONS (remaining)

All KQ-CRIT-1 through KQ-CRIT-9 resolved. See §5.
<!-- /ANCHOR:key-questions -->

## 3. NON-GOALS

Did not re-litigate whether the operator's symptoms exist (CONFIRMED). Did not implement code. Did not over-constrain Claude.

## 4. STOP CONDITIONS

Met: 10 iterations reached (stop policy max-iterations); all 9 KQ-CRIT questions answered with citations.

<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS

- **KQ-CRIT-1** (iter 1, iter 6): gpt-fast-high's framing is self-protective in specific, named places (Executive Summary's "not yet a route-proof failure artifact" gate), but the KQ9 "wait" verdict itself is NOT primarily bias-driven — glm-max independently converges on it.
- **KQ-CRIT-2** (iter 1, iter 2): Phase 005's "inconclusive" label undersells a 4/4 FAIL result; the real gap is an unexercised baseline-comparison clause, not ambiguous GPT-side evidence. Partial baseline is runnable now (native/cli-claude-code, no external shell required).
- **KQ-CRIT-3** (iter 2): KQ5's plugin claim is real (`tool.execute.before` hook confirmed) and stronger than either prior lineage's cited analogy-based evidence; fail-closed capability is an unresolved technical gap.
- **KQ-CRIT-4** (iter 4, iter 8): The ai-council "naming drift" is a code-traced, deterministic emitter/validator self-contradiction inside one YAML file, not a registry-vs-YAML drift; it is a precondition for KQ1/KQ6 benchmark validity.
- **KQ-CRIT-5** (iter 3, iter 9): Mode D is CONFIRMED-in-at-least-one-instance (the Phase 0 self-check, verbatim-matched to phase 005's failure string), upgraded from glm-max's inferred hypothesis; causation is very likely, not certain (no transcript available).
- **KQ-CRIT-6** (iter 5, iter 9): The literal "dispatch @deep and STOP" reading of KQ4 violates orchestrate's own NDP depth cap; a corrected registry-reuse fix preserves the intent. An alternative session-handoff reading may not violate NDP — ambiguity is itself a finding.
- **KQ-CRIT-7** (iter 6): KQ9's "wait" survives the self-assessment-bias check; reinforced by a coverage argument (FIX-5 doesn't fix Mode D or latency); the "gate cannot fire indefinitely" residual is less severe than characterized.
- **KQ-CRIT-8** (iter 7): 4 implementation-ready diffs delivered (Mode D self-check rewrite, ai-council validator fix, orchestrate NDP-safe routing rule, sequencing correction) with precedence ordering.
- **KQ-CRIT-9** (iter 8): Citation accuracy across both prior lineages is high; corrections in this round come from incomplete cross-referencing, not fabricated evidence.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED

- Re-deriving primary-source verdicts (phase 005's own FAIL table) instead of trusting downstream reframing language (iter 1).
- Cross-referencing two citations each prior lineage had independently but never connected to each other (Phase-0 self-check text + phase-005 failure string; ai-council emitter block + validator block) (iter 3, iter 4).
- Reading the actual code (`validateRouteProofRecord`) behind a cited validator rather than trusting the config-level description of what it does (iter 8).
- Applying this round's own earlier findings as premises for later iterations rather than treating each KQ-CRIT as independent (iter 6 building on iter 2/3).
- Running an adversarial self-check pass against this round's own findings, symmetric to the pressure applied to the prior round (iter 9).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED

- (none: every iteration produced evidence; no approach exhausted without a documented ruling)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)

- (none)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS

See `deep-research-findings-registry.json` `ruledOutDirections` (14 entries across iterations 1-9).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS

None — lineage complete. Next step is the cross-lineage merge (`research-prompt.md` §9.5): merge with `glm-critical`, re-run `fanout-merge.cjs` across all 4 lineages, rewrite `research/research.md` marking which prior conclusions were confirmed/sharpened/overturned per this lineage's §5 verdict table (`iterations/iteration-010.md`).
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
