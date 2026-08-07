# Deep Research Dashboard — 007 Gem Team Adoption Matrix

Orchestrator-maintained summary. **Run COMPLETE.**

## STATUS
- **Topic:** Gem Team (mubaidr/gem-team) external-framework adoption matrix vs the live spec-kit
- **Session:** 2026-06-06-027-gem-team-adoption-matrix
- **Status:** COMPLETE (+ MiMo cross-model extension)
- **Iterations:** 24 (001-024) — 13 analysis + 5 adversarial + 1 critic [gpt-5.5-fast] + 5 cross-model [MiMo-V2.5-Pro]
- **Executor:** cli-opencode `openai/gpt-5.5-fast --variant high` (READ-ONLY dispatch; orchestrator-written state, Gate-3-safe)
- **Depth:** Exhaustive (operator-selected)

## PROGRESS — newInfoRatio by round
| Round | Iters | Focus | Ratios |
|---|---|---|---|
| A | 001-005 | orchestration · memory · context-envelope · knowledge · verification | 0.18 / 0.24 / 0.42 / 0.38 / **0.64** |
| B | 006-010 | diagnose-fix · auto-skills · classification · token-eff · resilience | **0.78** / 0.64 / 0.58 / 0.31 / **0.74** |
| C | 011-013 | output-contract · changelog-mine · distribution | **0.83** / 0.46 / 0.72 |
| D | 014-018 | adversarial verify (ALL candidates downgraded) | 0.58 / 0.38 / 0.32 / 0.42 / 0.67 |
| D | 019 | completeness critic | 0.44 |
| MiMo | 020-024 | coverage gaps (specialized-agents · PRD · planner · CHANGELOG) + cross-model validation | 0.05 / 0.15 / 0.25 / 0.25 / 0.15 |

**MiMo cross-model result:** independently **corroborates** the verdict (low new-info throughout); sharpens **P1** → dispatch-INPUT header is the primary gap (output side already typed); surfaces a missed **progressive-vs-snapshot** context architecture fork; reframes **P2** as an honest *downscale* of Gem's machine-checked pre-wave gate; flags the OWASP-coverage claim as unverified.

Trend: high throughout (no convergence-to-zero); convergence achieved via the adversarial round collapsing claims to narrow slices.

## OUTCOME
- **Verdict: validate-and-incrementally-refine.** The spec-kit is mature; Gem Team mostly confirms it. No transformative adoption.
- All 9 top candidates adversarially **downgraded** (ADOPT→ADAPT, strong→narrow) — existing spec-kit coverage found each time (Context Package, escalation classifiers, @debug 5-phase, security checklist, Logic-Sync, evaluator-first skill creation).
- **3 sub-packets proposed** (tentative #s): P1 `001-typed-agent-io-adapter` · P2 `002-scoped-preexec-and-handoff-gates` · P3 `003-planner-review-focus-and-drift-hint` + 6 items deferred to tags/aliases/notes.

## CROSS-PHASE (reconciliation needed)
- This is a **self-contained packet (iterations 001-024)**. Operator-launched sibling packets — **006-peck-source-deep-mining** and **008-caura-memclaw-fleet-memory-teachings** — study other frameworks. Proposed new 027 children are now **RECONCILED (collision-free): 006→`001`, 007→`009` (final), 008→`010`**. Only open item: 006's `009-peck-verification-discipline` overlaps this packet's P2 — check for a merge when planning.

## DELIVERABLES
`research.md` · `sub-packet-proposals.md` · `deep-research-strategy.md` · `deep-research-state.jsonl` (28 lines: config + started + 24 iterations + 2 completion events) · `findings-registry.json` · `iterations/` (24) · `deltas/` (24) · `prompts/` (prompt+out+err per iter)
