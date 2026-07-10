# Deep-Review Charter — skill-advisor scorer program

**HARD READ-ONLY.** Findings and reports only. NEVER edit, write, or commit anything under `mcp_server` or the advisor Python — it is a live gated lane with another agent's staged changes. Write only to the review artifacts under this spec folder. Test everything; check spec-vs-code alignment; find issues and refinements.

**Scope:** `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer` and the `012-skill-advisor-tuning` spec subtree it documents (8 workstream children).

## Ranked review angles
1. **Self-recommendation-guard three-way contradiction** — 003's implementation-summary says CUT the guard; `scoring-constants.ts` comment says "removed as redundant"; but `fusion.ts` still carries the full guard (`ADVISOR_SELF_RECOMMENDATION_GUARD_FLAG`, `shouldApplyAdvisorSelfRecommendationGuard`, guard branches in `confidenceFor`/`primaryIntentBonus`).
2. **WS1 "empirically falsified" claim has no evidence trail** — the parent spec asserts it, but packet 001's own docs say "not started / GATED" and contain zero falsification records despite a calibration commit (`e2711fb580`). Reconstruct the experiment, verify the claim, resolve the 001 status contradiction.
3. **The saturation defect is still live** (WS1 reverted) — audit every surviving pre-clamp penalty in `lanes/explicit.ts` (review/webflow/benchmark/resume penalties) for whether it still functions under verbose saturation or is silently absorbed by `Math.min(value.score,1)` + the `Math.max(...,0)` floor in `fusion.ts buildLaneMatchIndex`.
4. **Corpus-number reconciliation** — 136 vs 147 vs 149 of 193 across WS4/WS5/WS6, and the parity gate asserts a different measure (pythonCorrect=105 / tsAlsoCorrect=101 / regressions=4). Produce the definitive regime table and confirm each number reproduces.
5. **WS3 parity ledger has no owning child** — verify REQ-003 landed: 5 named regressions ledgered (now 4?), "197-prompt" renamed to 193, force-local parity in CI, parity evaluated against SQLite/source not `skill-graph.json`.
6. **Executor-delegation override correctness under composition** (`executor-delegation.ts`) — post-abstention resurrection, synthesized recs with empty `laneContributions`/`dominantLane:null`/copied top score, hardcoded `0.95`/`0.88` vs the metadata-driven claim. Thin fixture coverage (11 cases, 4 precedence tiers).
7. **RRF sort comparator soundness** (`fusion.ts scoreAdvisorPrompt`) — the window-conditional rerank inside `Array.sort` is not guaranteed transitive; intent/conflict adjustments apply in the comparator only, so displayed score/confidence never reflect ranking (attribution drift). Default-off but GRADUATE-recommended.
8. **003 GRADUATE verdict never executed** — RRF still default-off; live corpus has zero `conflicts_with` edges, so the "load-bearing" conflict seam demotes nothing in production. Do the GRADUATE/CUT verdicts have an owner, or are they silently parked? Does the 42-prompt benchmark still hold post-WS2/WS4/WS5?
9. **002 subtree status roll-up honesty** — the 012 parent marks 002 "complete" but 002's children read "Partial"/"shadow-only, live NO-GO", and 007's shipped artifact was deleted leaving an orphaned `skill-outcome-fold-tick.mjs`. Verify the orphan is dead and whether "Partial" children block a "complete" parent.
10. **Test-coverage gaps on always-on hardcoded routing** — `primaryIntentBonus` (~15 regex branches), `readOnlyRouteAllowed` allowlists, low-info/Class-C abstention gates, and a dead node id `recommendation.skill === 'deep-review'` at `fusion.ts:597`. Inventory which have direct tests vs ride only on the 193-corpus aggregate.

## Watch-outs
- Do not re-propose **WS1's known-falsified** arithmetic fix — the interesting question is where the falsification evidence lives (angle 2).
- Do not re-report pre-existing suite failures: `compat/shim`, `skill-advisor-cli-parity`, `advisor-graph-health`, `manual-testing-playbook`.
- Verified: WS2/WS4/WS5 committed; 008 freeze measured (149 vs 150, deterministic). Read-only: never mutate `mcp_server`.
