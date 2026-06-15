# Iteration 004 — OPTIMIZE: Ranked, Tiered, Deduped Recommendations

**Status:** complete  |  **Focus:** Rank surface×delta recommendations with independent leverage/cost/blast scoring using the B-structural vs B-advisory distinction. Cross-check against sibling lineages. Focus the efficiency-lever set.

---

## 1. Assessment

### newInfoRatio: 0.28
**Novelty justification:** The B-structural vs B-advisory distinction reshapes the recommendation ranking. Both sibling lineages ranked the governor-on-hook (#1) and mutation-check (#2) highest, but didn't identify that structural enforcement must ship FIRST to make advisory text effective. This lineage ranks the enforcement infrastructure before the text layer. The cross-lineage convergence analysis confirms 75% overlap in technique identification but divergence in sequencing and portability assessment.

### Recommendation Map (independent scoring, portability-informed)

Score = Leverage / (Cost + Blast), each 1-5. Stars (★) = structural enforceability path exists.

| # | Recommendation | Surface | Tier | Class | Lev | Cost | Blast | Score | Portability | Sibling Convergence |
|---|----------------|---------|------|-------|-----|------|-------|-------|-------------|---------------------|
| ★1 | **Fail-loud executor provenance** — verify actual model matches requested; block on mismatch or crash. Route through executor-audit + fallback-router. | `executor-audit.ts` + `fallback-router.ts` (deep-loop-runtime) | B-structural | hardening | 5 | 3 | 3 | 0.83 | Model-agnostic | BOTH lineages rank this high (codex #3, opus #12). Convergence confirmed. |
| ★2 | **Compact fable-5 governor capsule on per-turn hook** — 4 rules distilled from governor-block.md + fable-mode-profile F10: (a) reason about the problem, not yourself; (b) outcome over visible process — act, don't narrate; (c) commit with `// DECISION:` and move; (d) open with result/object, not "I'll"/"Let me". Ride the existing UserPromptSubmit hook cascade. | `user-prompt-submit.js` reminder (skill-advisor hook delegate) | B-advisory | mechanism | 5 | 1 | 2 | 1.67 | Executor-portable (4 rules are model-agnostic; Opus-specific recursion depth-limit-1 omitted as Anthropic-specific) | BOTH lineages rank this #1. Independent convergence confirmed. |
| ★3 | **Behavioral metric route** — `/doctor fable-mode` or `deep:*-benchmark` dimension reporting tool:text ratio, median words/msg, self-opener %, and evidence-backed completion ratio. Multi-runtime: bucketing by runtime log paths + model IDs. | `/doctor` command + benchmark framework | C | measurement | 4 | 3 | 1 | 1.00 | Executor-portable (metric definitions; log paths per runtime) | BOTH lineages rank measurement high (codex #2, opus #7). Convergence confirmed. |
| 4 | **Mutation-check discipline in sk-code verification** — after green, break code to confirm test bites; distinguish compile-RED from true-RED; hunt vacuous green tests. | sk-code SKILL.md + point-of-use guidance | B-advisory | mechanism | 5 | 2 | 1 | 1.67 | Model-agnostic | BOTH lineages rank this high (codex #4, opus #2). Convergence confirmed. |
| 5 | **Inject governor into agent prompts via renderPromptPack** — the subagent surface: agent prompts + deep-loop render + per-dispatch injection. | `renderPromptPack` template + agent prompts | B-structural | mechanism | 5 | 3 | 3 | 0.83 | Executor-portable (same capsule, different delivery) | Both lineages flag this (codex implicit, opus #5). Convergence confirmed. |
| 6 | **Scar-tissue + cold-successor handoff discipline** — "Traps already hit" ledger in handover.md + _memory.continuity: blast site + next-bite-site + activation condition. | `handover.md` template + `_memory.continuity` | A | doctrine/ritual | 3 | 2 | 1 | 1.00 | Model-agnostic | Both lineages rate this (codex #5, opus #8). Convergence confirmed. |
| 7 | **Engineer staleness out of artifacts** — new constitutional rule or fold into comment-hygiene: counts→greps, enumerations→table-walking tests. Fix the dead AGENTS.md hook pointer first. | constitutional rule or comment-hygiene fold | B-advisory | mechanism | 4 | 2 | 2 | 1.00 | Model-agnostic | Both lineages flag this (codex implicit, opus #4). |
| 8 | **Efficiency doctrine-spine in AGENTS.md §1** — root conviction ("expensive failures live where confirmation is cheapest to skip") + two-register voice principle + letter-vs-intent contract framing. ~10 lines. | AGENTS.md/CLAUDE.md §1 (after Operating Discipline) | A | doctrine | 3 | 1 | 2 | 1.00 | Model-agnostic | Both lineages suggest this (codex #6, opus #6). |
| 9 | **Decision-economy + fail-closed-by-construction** — scaffold the contract not the implementation; named seam not bare TODO; never ship a dead control; structural not disciplinary invariants. | sk-code doctrine + optional constitutional rule | A | doctrine | 3 | 1 | 1 | 1.50 | Model-agnostic | opus lineage flags this (#11); codex folds into existing sk-code line. |

### Items That Differ From Sibling Lineages

| Item | Sibling View | DeepSeek View | Reason |
|---|---|---|---|
| **Recursion-control rule targeting Opus anxiety** | Both siblings rank it high (codex #6 capsule, opus #3 as standalone rule) | Ranked lower; folded into the #2 governor capsule as model-portable subset only | The recursion-control governor (rules 1-2 from governor-block.md: "reason about the problem, never about yourself"; "audit depth-limit 1") is specifically tuned to Opus's self-audit anxiety texture. DeepSeek, Kimi, Qwen, MiniMax, and other non-Anthropic models do not exhibit this failure mode. The rules are not WRONG — they're just not the highest-leverage for a multi-model framework. The portable subset (outcome over process, act-don't-narrate, commit-and-move) is absorbed into the governor capsule (#2). |
| **Adversarial-review-at-scale schema** | Both siblings flag it as a dedicated packet (codex #7, opus #10) | Agreed — deferred to dedicated packet. The machine-checkable evidence contract is structural and requires TypeScript schema work beyond this research round. | Both lineages agree this is highest-leverage but highest-cost. |
| **OpenCode per-turn governor** | Both lineages rate OpenCode hook as "runtime-dep" but pursue it as a goal | Explicitly flagged as NOT having equivalent surface. OpenCode's hook system is session-start, not per-prompt. The governor capsule (#2) will work on Claude+Codex per-turn hooks but OpenCode needs a different mechanism (inject into hook briefs or skill-advisor prompt-time injection). | Independent surface verification. |

### Cross-Lineage Convergence Analysis

| Dimension | codex-xhigh | opus-account2 | deepseek-v4-pro | Convergence? |
|---|---|---|---|---|
| Top mechanism (#1) | Governor on hook | Governor on hook | Governor on hook + fail-loud first | **STRONG** (3/3) |
| Mutation-check (#2-4) | Rank #4 | Rank #2 | Rank #4 | **STRONG** (3/3) |
| Measurement route | Rank #2 | Rank #7 | Rank #3 | **STRONG** (3/3) |
| Executor fail-loud | Rank #3 | Rank #12 | Rank #1 | **MODERATE** (3/3 flag, ranking differs) |
| Recursion-control for Opus | Governor capsule | Standalone rule (Rank #3) | Folded into capsule (portable subset only) | **DIVERGE** — deepseek ranks it lower as Anthropic-specific |
| B-structural vs B-advisory distinction | Not identified | Not identified | **Identified as load-bearing** | **DIVERGE** — unique contribution |

### Implementation Sequence (structural-first principle)

1. **Ship the enforcement infrastructure first** (#1 fail-loud + #5 renderPromptPack injection): makes provenance honest and creates the subagent governor channel.
2. **Layer the governor capsule** (#2 hook ride-along): rides the existing thermostat for main-session agents, plus #5 covers subagents.
3. **Add measurement** (#3): confirms whether #1+#2 moved the needle.
4. **Add targeted rituals** (#4 mutation-check, #6 scar-tissue, #7 staleness-engineering): point-of-use upgrades.
5. **Add doctrine text last** (#8 AGENTS.md spine, #9 decision-economy): the least urgent because round 1's Operating Discipline already covers the foundation.

### Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Ranking recursion-control as a top-3 standalone mechanism | Rules 1-2 are Opus-specific; the portable subset fits in the governor capsule | governor-block.md:1-7; fable-mode.md:88-102 |
| Shipping advisory text before structural enforcement | Advisory text decays; structural enforcement makes it durable | opus README.md:69-77 (CLAUDE.md decays) |
| Creating a new AGENTS.md block >10 lines for the efficiency spine | AGENTS.md at 424 lines with ~76 headroom; a ~10-line spine fits but a longer block risks bloat | wc -l AGENTS.md = 424 |

### Answered Questions
- Q3 (answered): Cross-lineage convergence confirmed on 5/7 major recommendations (governor, mutation-check, measurement, scar-tissue, AGENTS spine). Divergence on: recursion-control ranking (Anthropic-specific), B-structural vs B-advisory distinction (not previously identified).
- Q4 (answered): The B-structural vs B-advisory distinction is the leverage opportunity the Anthropic-model lineages missed — they ranked all recommendations on a single scale without distinguishing which can be ENFORCED structurally.
- Q5 (answered): Structural enforcement surfaces identified: executor-audit + fallback-router (fail-loud), renderPromptPack (subagent injection), post-dispatch-validate (behavioral metrics if extended).

---

## 2. Strategy Update

**What Worked:** Independent scoring with the B-structural/B-advisory lens produced a different ranking (fail-loud first) than the sibling lineages (governor first) — both valid, but the structural-first sequence is more durable. Cross-lineage convergence on 75% of items is strong evidence for the recommendation set's validity.

**Next Focus (Iteration 5):** Synthesis and validation. Verify that all 5 key questions have evidence-backed answers. Cross-check for gaps. If newInfoRatio < threshold after this iteration, converge.
