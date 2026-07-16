---
title: "AI Council Deliberation — Round 001 (029 Residual Roadmap)"
description: "Round-1 composition, seat comparison, adversarial cross-critique, synthesis, and convergence decision for the 029 residual-backlog closure roadmap."
trigger_phrases:
  - "ai council deliberation round 1 029"
  - "residual roadmap synthesis"
importance_tier: "normal"
contextType: "implementation"
---
# AI Council Deliberation — Round 001

## Composition
| Seat | Lens | Mandate (1-line) | Confidence |
|---|---|---|---|
| seat-001 | Pragmatist / Ship-it (0.3) | Minimize time-to-close; treat residual as follow-on | 82 |
| seat-002 | Correctness / Safety-hawk (0.2) | Protect prompt-safety / daemon / DB invariants | 90 |
| seat-003 | Systems / Maintainability (0.4) | Cluster sequencing + structure the follow-on | 90 |

Dispatch mode: Depth-1 inline `sequentialthinking`. All seats are SIMULATED strategy lenses (no external cli-* / Task dispatch).

## Ground-truth spot-verification (verify-first, current code)
| Item | Disposition says | CURRENT code | Disposition |
|---|---|---|---|
| tri-123 | open (governance flag drift unenforced) | `env-reference-drift.vitest.ts` enumerates SPECKIT_* from runtime source + diffs ENV_REFERENCE | **CLOSED** |
| tri-124 | open (flag-ceiling static array drift) | `flag-ceiling.vitest.ts:195-213` drift guard derives live tokens from search-flags.ts | **CLOSED** |
| tri-142 | open (no non-repo-cwd shim smoke) | `cli-offline-smoke.cjs:105-135 runCwdIndependenceCheck` spawns from temp dir | **CLOSED** |
| tri-080 | open | `structural-indexer.ts:2146` still `continue` with no unsupported-language counter | OPEN (real) |
| tri-104 | open | `getConsumptionStats/Patterns` zero non-test callers | OPEN (trivial doc/retire) |
| tri-105 / tri-010 | open | vector-index-mutations dual-writes; verify_integrity counts only vec_memories | OPEN (storage truth) |
| tri-148 | open | code-index launcher uses createSessionProxy for SECONDARIES only; spec-memory wraps owner at :1651 | OPEN (delicate) |
| tri-007/008/009/011 | open | shadow runtime returns `[]` on clean schema; retention-sweep returns swept:0 in shadow mode | OPEN (honesty/semantics) |

Conclusion: the L9 "Code queue (open)" line is STALE (lists 3 already-closed items). Real open set is value-concentrated, not ~29.

## Seat comparison (5-dimension rubric, /100)
| Dimension | Weight | seat-001 | seat-002 | seat-003 |
|---|---|---|---|---|
| Correctness | 30% | 24 | 29 | 27 |
| Completeness | 20% | 16 | 18 | 19 |
| Elegance | 15% | 13 | 12 | 14 |
| Robustness | 20% | 15 | 20 | 18 |
| Integration | 15% | 14 | 14 | 15 |
| **Pre-critique total** | 100% | **82** | **93** | **93** |
| Post-critique adjustment | +/-10 | -2 | -1 | -2 |
| **Final total** | 100% | **80** | **92** | **91** |

## Adversarial cross-critique
- vs seat-001 (HUNTER/safety): under-specified the honesty-patch boundary (risk of touching runtime) — closed by seat-002's additive/doc fence (-1); missed that tri-010/tri-011 wear P2 labels but are truth/semantics violations (-1). SKEPTIC: the close-027 verdict survives regardless of label. Net -2.
- vs seat-002 (HUNTER/pragmatist): risk of design-first paralysis by routing tri-010 to "design-first" when its fix is small. SKEPTIC: it is STORAGE/health-truth code and seat-002's own "design-first-fast" concedes it is small; verify-first is non-negotiable. Net -1.
- vs seat-003 (HUNTER/both): 4-unit packet risks gold-plating ~20 P2/P3 items (-1); Cluster B "retire-default" assumes no live consumer (-1, requires verify-step). SKEPTIC: interlocks are real and the structure directly answers the dispatch ask. Net -2.

All adjustments within +/-10; no seat disqualified.

## Agreements (3/3 — load-bearing)
1. 029 is done-enough to CLOSE 027 with the remainder as ONE tracked follow-on packet.
2. The pre-existing `:637` test = DOCUMENT-AND-LEAVE (untouched pe-gating.ts, stash-repro proves pre-existing).
3. DO-NOW = doc-wave + tri-080 counter via fenced gpt-5.5-fast xhigh (DO-NOT-COMMIT); storage/launcher/privacy are NOT fenced — design-first / escalate.

## Disagreements (complementary refinements, not contradictions)
- Severity-vs-label: seats 002/003 elevate tri-010 (health-truth) and tri-011 (retention-pause) above their P2 labels; seat-001 underweighted them. Merge: carry both as the highest-priority residuals.
- Follow-on shape: seat-003 adds 4-unit structure; seats 001/002 left it flatter. Merge: adopt seat-003's structure.

## Convergence decision
CONVERGED at 3/3 on the core (clears the 2/3 `two-of-three-agree` threshold). Genuine, not artificial: seats reached agreement via different routes (throughput / invariants / coherence) and the cross-critique produced real refinements rather than collapsing into one voice. No second round required. Proceed to `council-report.md`.

## Synthesis (merged plan)
seat-002 supplies invariant protection + escalation calls (replay-pool auto-reject, launcher blast-radius, tri-010/011 elevation); seat-003 supplies follow-on structure + interlock sequencing; seat-001 supplies the DO-NOW throughput framing + the close-027 default. The merge is additive — no conflict to arbitrate.
