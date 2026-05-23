# AI Council Critique Round — Round 001

## Methodology

Each seat's proposals were subjected to adversarial cross-critique. Each critique pair uses the HUNTER-SKEPTIC-REFEREE protocol: Hunter wears target seat's lens and asks "what weakness does this seat miss?", Skeptic defends with "is this a real weakness or an intentional trade-off?", Referee adjusts scores.

---

## Critique of RISK-AVERSE (by VELOCITY lens)

**Hunter (VELOCITY):** RISK-AVERSE defers phase 004 (14 P0) to position 7. That means 14 skill-advisor P0 findings remain UNFIXED through 5 extra phases (~4-5 hours). If any intermediate phase touches skill-advisor files (e.g., phase 005 modifies registry.ts which feeds skill-advisor imports), it's building on unfixed P0 ground. Ship the critical fix FIRST.

**Skeptic (RISK-AVERSE):** The intermediate phases (006, 008, 009) are in CocoIndex Python, rerank-sidecar shell, and cascade thresholds — none touch skill-advisor files. The risk of building on unfixed P0 is zero. The risk of phase 004 silently failing and requiring full arc rollback is real. Deferring 004 is an intentional trade-off: accept hours of known-safe state for rollback safety.

**Referee:** RISK-AVERSE's rebuttal is partially valid (intermediate phases are isolated subsystems) but VELOCITY's concern about "P0s remaining unfixed while arc ships around them" is well-taken. 14 P0 findings are live bugs. Every hour they remain unfixed, the arc's own success criteria ("every P0 closed") is violated by the arc itself. **Adjustment: -2 to RISK-AVERSE (84→82).**

---

## Critique of VELOCITY (by FAILURE-MODE lens)

**Hunter (FAILURE-MODE):** VELOCITY wants one atomic 4-wave dispatch. What happens when wave 3 silently reverts wave 1? The git diff will show files changed, but the operator won't know WHICH wave introduced the revert. One atomic dispatch buys speed at the cost of observability. Silent reverts are documented behavior under opencode-go load (per feedback_cli_dispatch_unreliability.md).

**Skeptic (VELOCITY):** The prompt's BUNDLE GATE requires the executor to run typecheck+vitest after each wave and HALT on failure. If wave 3 reverts wave 1, the typecheck or vitest should catch it (the contract import pattern breaks). The operator sees the failure in the output log and can redispatch with adjusted prompt. Four dispatches have 4x the chance of credit-exhaustion or API rate-limit failure — each is a distinct failure surface.

**Referee:** VELOCITY's rebuttal partially holds for deterministic failures (typecheck catches revert) but FAILURE-MODE's concern about SILENT revert (where typecheck passes but behavior changes) is unaddressed. A silent revert could produce valid TypeScript that imports a different constant. FAILURE-MODE's preflight checklist (kill zombie processes, verify RSS) mitigates the root cause but doesn't guarantee detection. **Adjustment: VELOCITY's ordering point is strong (+2 from rebuttal to RISK-AVERSE, 81→83), but VELOCITY's own robustness score stays low (13/20).**

---

## Critique of ARCHITECTURE (by OPERATIONAL lens)

**Hunter (OPERATIONAL):** ARCHITECTURE wants 005+007 BEFORE 004 so 004 conforms to established architectural patterns. But the patterns for 005 (registry consolidation) and 007 (config-defaults extraction) are ALREADY DEFINED in the approved arc plan. The plan specifies exactly what 005 does: "RERANKER_CANONICAL table + getRerankerFallback() in registry.ts." Phase 004's wave 2 (RoutingCalibration completion) doesn't need a shipped registry to exist — it needs the INTERFACE CONTRACT, which is defined in the plan. Delaying 14 P0 closure for patterns already specified is architectural purism over practical delivery.

**Skeptic (ARCHITECTURE):** The plan defines patterns, but shipping code that conforms to shipped patterns is stronger than shipping code that conforms to planned patterns. If 004 ships first and 005 later modifies the registry in a way that 004's contract should have anticipated, we get architectural drift. Doing 005 first means 004's interface design works against the REAL registry, not the plan's description of the registry.

**Referee:** OPERATIONAL's critique is valid. The plan is detailed enough that 004's wave 2 can design against the planned interface without needing the shipped code. ARCHITECTURE's concern about "shipping against real vs planned" is valid for abstract interfaces but weak here — the registry pattern is well-understood (packet 020 already shipped `getCanonicalFallback()`). **Adjustment: -1 to ARCHITECTURE (86→85).**

---

## Critique of FAILURE-MODE (by VELOCITY lens)

**Hunter (VELOCITY):** FAILURE-MODE's interleaved ordering runs 5 devin phases before any opencode dispatch to "test dispatch reliability." This is overcautious. The operator already successfully dispatched cli-devin for prior arc work (phases 001, 002 were main-agent direct, but prior arc phases used cli-devin). The dispatch pattern is PROVEN. Delaying 14 P0 closure to run 5 low-value cleanup phases first is wasteful. Just run `ps aux` before the deepseek dispatch.

**Skeptic (FAILURE-MODE):** Phase 001 and 002 were main-agent direct, NOT cli-devin dispatch. The operator has NOT actually tested cli-devin SWE-1.6 dispatch on this Mac in this arc context. The "proven dispatch pattern" is unproven for this specific combination. And the 5 "low-value" phases are not low-value — they close 4 P0 (002b) + 1 P0 (003) + 2 P1 (006) + 4 P1 (008) + 1 P1 (009). That's 5 P0 + 8 P1. Delaying those to test dispatch reliability is a trade-off, but a reasonable one — the alternative is losing 2-4 hours of opencode work to an undiagnosed Mac issue.

**Referee:** FAILURE-MODE's skepticism is valid: the prior phases WERE main-agent direct, so cli-devin dispatch IS unproven in this arc. But VELOCITY's claim that these phases close real findings is also valid — it's 5 P0 + 8 P1 total. The real question is: is the Mac likely to have an undiagnosed dispatch issue? The operator has been running this Mac for weeks of development — dispatch failures are rare and usually surface immediately. **Adjustment: -1 to FAILURE-MODE for overcautious ordering (89→88).**

---

## Critique of OPERATIONAL (by ARCHITECTURE lens)

**Hunter (ARCHITECTURE):** OPERATIONAL's executor-batched ordering runs 004+005+007 as a single deepseek block. But phase 004 wave 2 (RoutingCalibration completion) and phase 005 (registry consolidation) touch the SAME conceptual space (typed contracts for tuned constants). If both ship in the same executor batch, the executor may apply inconsistent patterns — e.g., 004 uses `SKILL_ADVISOR_COMPAT_CONTRACT` for its contract while 005 uses `RERANKER_CANONICAL` for its registry. Both are correct individually, but the ARC as a whole now has TWO contract patterns with inconsistent naming. Separating them ensures deliberate pattern comparison.

**Skeptic (OPERATIONAL):** The plan ALREADY specifies different contract names for different subsystems — `SKILL_ADVISOR_COMPAT_CONTRACT` for skill-advisor, `RERANKER_CANONICAL` for spec-memory reranker. These are different contracts for different things. Naming consistency across subsystems is a nice-to-have, not a requirement. The operational benefit of batching (2 switches vs 3, saving 15-20 min) outweighs pattern-naming consistency.

**Referee:** ARCHITECTURE raises a valid concern about pattern consistency, but it's a naming issue, not an architectural one. Both contracts can coexist with different names. The plan is explicit about which contract goes where. **No adjustment to OPERATIONAL (stays at 87). But ARCHITECTURE's critique is noted in the convergence report as a design-time consideration for phase 004+005 dispatch.**

---

## Score Adjustments Summary

| Seat | Pre-Critique | Adjustment | Post-Critique | Reason |
|---|---|---|---|---|
| FAILURE-MODE | 89 | -1 | **88** | Overcautious ordering delays P0 closure unnecessarily |
| OPERATIONAL | 87 | +1 | **88** | Executor batching insight adopted by council; critique did not weaken |
| ARCHITECTURE | 86 | -1 | **85** | Architectural prerequisite argument weakened by plan already defining patterns |
| VELOCITY | 81 | +2 | **83** | Strong rebuttal to RISK-AVERSE's deferral; robustness still low |
| RISK-AVERSE | 84 | -2 | **82** | Deferring critical fix too long; intermediate phases isolated from skill-advisor |

## Consensus Check

No convergence sycophancy detected. Seats diverged meaningfully on ordering (4 distinct proposals), dispatch atomicity (2-2-1 split), and ADR-B governance (3-way split). Agreements were evidence-backed (convergence gate additions, failure detection chain). The council achieved genuine diversity.

## Areas of Strong Agreement (all 5 seats concur)

1. **Convergence gate**: Add all three proposed additions (a, b, c).
2. **002b pre-dispatch verification**: Qwen3 footprint verification mandatory before dispatch.
3. **Phase 003 pre-investigation**: `.codex/agents/` intent must be resolved before dispatch.
4. **Phase 010 operator approval**: ADR-B amendment requires operator approval before execution.
5. **Fallback**: Wave 1 can ship as partial 004 if scope creep hits.
6. **Detection chain**: git diff + typecheck + vitest + ban-list grep after each phase.

## Areas of Significant Disagreement (requiring adjudicator resolution)

1. **Phase ordering**: 4 proposals, 2-2-1 split on 004's position.
2. **Phase 004 atomicity**: 2 seats favor 1 call, 2 favor 4 calls, 1 hybrid.
3. **ADR-B governance**: 3 positions (in-place edit, supersession, separate amendment).
