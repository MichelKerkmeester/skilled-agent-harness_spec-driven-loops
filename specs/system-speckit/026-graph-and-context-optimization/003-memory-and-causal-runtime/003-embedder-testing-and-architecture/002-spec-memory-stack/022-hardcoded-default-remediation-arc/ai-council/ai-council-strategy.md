# AI Council Strategy: 022 Remediation Arc Remaining Execution Strategy

## Purpose

Multi-seat deliberation to decide the execution strategy for the remaining **8 phases (002b–010) + convergence** of the 022-hardcoded-default-remediation-arc. Phase 001 (3 P0 in profile.ts) and phase 002 (4 embedder doc edits; reranker deferred to 002b) just shipped. Operator directive: continue arc until explicit stop.

## Task Framing

- **Type**: Architecture / Planning
- **Scope**: 8 remaining phases + convergence + outstanding 002b
- **Total findings remaining**: 20 P0 + 31 P1 + 36 P2 (after 001+002 closed 3 P0 + 2 P0 + 2 P1 + 3 P2)
- **Estimated wall-clock remaining**: ~16 hours
- **4 ADRs to author in phase 010**, including ADR-B amendment to shipped ADR-013/014

## Selected Lenses

| Seat | Strategy Lens | Temperature | Distinct Mandate |
|---|---|---|---|
| Seat 001 | RISK-AVERSE | 0.1 | Minimize blast radius per phase; accept more phases for safer rollback |
| Seat 002 | VELOCITY | 0.3 | Close findings fastest; accept larger atomic phases |
| Seat 003 | ARCHITECTURE | 0.2 | Proper interface design; RoutingCalibration + ADR governance |
| Seat 004 | FAILURE-MODE | 0.2 | Detection + recovery; surface silent-failure modes before they happen |
| Seat 005 | OPERATIONAL | 0.3 | Repeatable dispatch pattern; reduce per-phase cognitive load |

## Vantage Targets

All seats deliberated inline via sequential_thinking MCP on the primary agent (deepseek-v4-pro). No external CLI dispatch — single-agent deliberation per operator directive.

## Evidence Inputs

1. Phase parent `spec.md` — 10-phase map, 94 findings, 4 ADR gaps, executor mapping
2. Phase 001 `implementation-summary.md` — ~20 min main-agent direct, bypassed cli-devin
3. Phase 002 `implementation-summary.md` — ~25 min main-agent direct, reranker split to 002b
4. 021 audit `findings-registry.json` + iterations — 94 findings (23 P0 + 33 P1 + 38 P2)
5. Approved arc plan — per-phase dispatch skeletons, ~17 hr estimate

## Convergence Rule

Default `two-of-three-agree`: 3 of 5 seats must endorse the same recommendation per question. Escape hatch: if seats split 2-2-1, adjudicator breaks tie with merged recommendation.

## Known Constraints

- One dispatch at a time (memory `feedback_deep_loop_iter_one_at_a_time.md`)
- No stopping until explicit stop signal (operator directive)
- Overrides per-phase confirmation gates EXCEPT phase 010 ADR-B
- DELETE not archive; stay on main; no feature branches
- cli-opencode canonical pattern specified
