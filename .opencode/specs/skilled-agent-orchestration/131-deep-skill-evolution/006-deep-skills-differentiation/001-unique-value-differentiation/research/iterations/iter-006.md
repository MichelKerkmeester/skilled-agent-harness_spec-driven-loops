---
executor: cli-devin
model: swe-1.6
iter: 6
started_at: 2026-05-23T08:50:00.000Z
finished_at: 2026-05-23T08:55:00.000Z
target_dimension: convergence-check + boundary-sharpening-strategies
---

# Iter-006: Saturation Check + Boundary-Sharpening Strategy Enumeration

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review contract characterization
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research contract characterization
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-003.md` — deep-council contract characterization (proposed)
4. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md` — overlap-surface inventory
5. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-005.md` — fixture-prompt suite
6. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
7. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/deep-research-state.jsonl` — prior state
8. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/deep-research-config.json` — convergence threshold (0.2)

## Saturation Calculation

### Iter-004 Novelty Rate

- **Total fingerprints before iter-004:** 50 (iter-001: 16 + iter-002: 16 + iter-003: 18)
- **New fingerprints in iter-004:** 12 (F51-F62)
- **Novelty rate:** 12/50 = 0.24 (24%)

### Iter-005 Novelty Rate

- **Total fingerprints before iter-005:** 62 (50 + iter-004: 12)
- **New fingerprints in iter-005:** 8 (F63-F70)
- **Novelty rate:** 8/62 = 0.129 (12.9%)

### Convergence Verdict

**CONVERGED: false**

**Rationale:** Iter-004 novelty rate (0.24) exceeds the convergence threshold of 0.2. Although iter-005 novelty rate (0.129) is below threshold, the iter-004/005 combined novelty rate is (12+8)/50 = 0.40, which is well above threshold. The research has not saturated — iter-004 surfaced significant overlap findings (12 new fingerprints including 2 DANGEROUS severity findings), and iter-005 added fixture-specific routing fingerprints. Continue with planned iter-007 (cost-latency dimension exploration).

## Boundary-Sharpening Strategy Analyses

### Strategy A: Keep-Distinct (Status Quo + Sharpening)

**Description:** Each skill stays separate; advisor rules disambiguate via lexical/structural/prior-art signals. SKILL.md files are updated to clarify trigger phrases and convergence semantics. Advisor routing rules (iter-008 deliverable) encode the disambiguation logic from iter-005 fixture analysis.

**Cost:** Low. Changes are limited to SKILL.md keyword trigger sections and advisor rule configuration. No breaking changes to command surfaces, state file schemas, or runtime infrastructure. The primary work is documentation sharpening (e.g., renaming `findings-registry.json` to `deep-research-findings-registry.json` for consistency with deep-review's prefixed naming pattern [iter-004 F54]) and advisor rule implementation.

**Risk:** Medium. Overlap continues to confuse operators without perfect advisor disambiguation. The 2 DANGEROUS overlap findings from iter-004 (F56: convergence-threshold default divergence, F60: iterate findings until convergence) remain operator-facing risks. If advisor rules fail to disambiguate (e.g., LOW-confidence fixture F-fixture-008), operators may still be routed to the wrong skill. However, risk is bounded because no runtime changes are required — a bad routing decision is recoverable via operator correction.

**When to choose:** If iter-004 overlap surfaces are all <severity:DANGEROUS (which is NOT the case — F56 and F60 are DANGEROUS) OR if iter-005 fixtures show that advisor rules can achieve ≥ 90% routing accuracy with clarifying questions for contested cases. Strategy A is the default fallback if no clear merge case emerges, as it preserves the distinct value propositions (adversarial P0 adjudication for deep-review, negative knowledge for deep-research, multi-seat opinion synthesis for deep-council) identified in iter-001-003.

### Strategy B: Merge Two-of-Three

**Description:** Pick the two most overlapping skills and unify them into a single skill with mode flags. Based on iter-004 overlap analysis, the strongest merge candidates are deep-review + deep-research → unified `deep-investigate` skill, since both share 6 executor kinds [iter-001 F4, iter-002 F20], PRE-BOUND SETUP ANSWERS schema [iter-001 F2, iter-002 F18], and JSONL append-only state pattern [iter-004 F55]. Deep-council remains distinct due to multi-seat deliberation [iter-003 F35] and 3-level state hierarchy [iter-003 F41].

**Cost:** High. Breaking changes to command surface: `/deep:start-review-loop` and `/deep:start-research-loop` commands would be deprecated in favor of `/speckit:deep-investigate :review` and `/speckit:deep-investigate :research`. Packet renames required (e.g., `130-deep-skills-unique-value-differentiation` would need re-scoping). Runtime refactor: YAML workflows would need conditional logic for review vs research mode (different input fields: 7 vs 5 mandatory fields [iter-001 F1, iter-002 F17], different convergence semantics: P0/P1/P2 weighted ratio vs newInfoRatio [iter-001 F11, iter-002 F27]). Migration path for existing sessions (deep-review-state.jsonl → deep-investigate-state.jsonl) required.

**Risk:** High. Loses the adversarial-vs-evidence distinction that is core to deep-review's unique value [iter-001 F15]. Merging would require mode-specific convergence logic in a single runtime, increasing complexity and bug surface. Operators familiar with deep-review's P0/P1/P2 severity tiers would be confused if routed to deep-investigate without mode context. The merge also risks losing deep-research's negative knowledge emphasis [iter-002 F31] if the unified skill defaults to review-style severity tiers.

**When to choose:** Only if iter-004 shows ≥ 3 DANGEROUS overlap points (currently only 2: F56, F60) AND iter-005 fixtures demonstrate that advisor rules cannot achieve ≥ 80% routing accuracy even with clarifying questions. Currently, the overlap severity distribution (2 DANGEROUS, 4 CONFUSING, 4 HELPFUL) does not justify the high cost/risk of a merge. The distinct value propositions (adversarial P0 adjudication, negative knowledge, multi-seat opinion synthesis) are strong arguments against merging.

### Strategy C: Unify-With-Mode-Suffix (`/speckit:deep :review|:research|:council`)

**Description:** Single deep command surface with mode suffixes selecting the skill internally. `/speckit:deep :review` dispatches to deep-review, `/speckit:deep :research` dispatches to deep-research, `/speckit:deep :council` dispatches to deep-council. Advisor rules simplify to mode recommendation rather than skill selection. Existing commands (`/deep:start-review-loop`, `/deep:start-research-loop`) become aliases or deprecation warnings.

**Cost:** Medium. Rename existing commands to mode suffixes (e.g., `deep-review.md` → `deep.md` with `:review` mode logic). Advisor rule simplification: instead of 3-way skill disambiguation, advisor recommends a mode suffix. Migration path: operators on `/deep:start-review-loop` see deprecation warning pointing to `/speckit:deep :review`. No runtime refactor required — each mode still dispatches to the existing YAML workflow and LEAF agent. The primary cost is command entrypoint unification and documentation updates.

**Risk:** Medium. Mode suffix is operator-facing and requires migration. Operators familiar with `/deep:start-review-loop` may be confused by the new `/speckit:deep :review` syntax. The unification could obscure the distinct value propositions if documentation does not clearly explain when to use each mode. However, risk is lower than Strategy B because no runtime changes are required — the underlying skills remain intact, only the command surface changes.

**When to choose:** If iter-004 shows shared substrate but distinct intents (which is true: all three share deep-loop-runtime primitives [iter-003 F49], executor config [iter-004 F57], and JSONL state pattern [iter-004 F55], but have distinct convergence semantics and value propositions). Strategy C is a middle ground between Strategy A (keep distinct) and Strategy B (merge) — it unifies the command surface for discoverability while preserving the underlying skill distinctions. This is particularly appropriate if the advisor's confidence bands (HIGH/MED/LOW from iter-005 fixtures) map cleanly to mode recommendations.

### Strategy D: Hybrid (Extract Shared Primitives, Keep Distinct Entrypoints)

**Description:** Current direction with deep-loop-runtime already extracting shared primitives (loop-lock, jsonl-repair, atomic-state, executor-audit [iter-003 F49]). Sharpen further by extracting more shared primitives if iter-001-003 show additional shared schema (e.g., unify findings-registry schema across all three skills [iter-003 F38 open question], standardize convergence-threshold defaults [iter-004 F56 DANGEROUS]). Keep distinct command entrypoints (`/deep:start-review-loop`, `/deep:start-research-loop`, `/deep:ask-ai-council`) but reduce runtime duplication via shared libraries.

**Cost:** Low-Medium. Extract additional primitives from deep-loop-runtime or create new shared modules (e.g., `convergence-threshold-validator.ts` to surface appropriate defaults per skill). No breaking changes to command surfaces. The primary cost is library refactoring to identify and extract shared logic. Iter-004 F54 (findings-registry naming overlap) suggests a low-cost fix: rename deep-research's `findings-registry.json` to `deep-research-findings-registry.json` for consistency.

**Risk:** Low. No breaking changes to command surfaces or state file schemas. Operators see no disruption. The risk is primarily technical: over-extraction could create tight coupling between skills, making future divergence harder. However, this risk is manageable by keeping shared primitives focused on infrastructure (loop management, state persistence) rather than domain logic (convergence semantics, finding types).

**When to choose:** Default if no clear merge case (Strategy B) or mode-unification case (Strategy C) emerges. Strategy D is the current trajectory (deep-loop-runtime already exists) and aligns with the distinct value propositions identified in iter-001-003. The 2 DANGEROUS overlap findings (F56, F60) can be addressed via low-cost hybrid fixes (standardize threshold defaults, improve advisor disambiguation) without requiring a full merge or command-surface unification.

## Likely-Winner Preview

**Likely strategy: Strategy D (Hybrid)**

**Confidence band: MED-HIGH (0.75-0.85)**

**Rationale:**
1. **Distinct value propositions are strong:** Iter-001-003 identified clear unique value for each skill (adversarial P0 adjudication for deep-review [iter-001 F15], negative knowledge for deep-research [iter-002 F31], multi-seat opinion synthesis for deep-council [iter-003 F48]). Merging (Strategy B) would lose these distinctions.
2. **Overlap severity does not justify merge:** Only 2 DANGEROUS overlap findings (F56, F60) vs 4 CONFUSING and 4 HELPFUL. The DANGEROUS findings can be addressed via low-cost hybrid fixes (threshold default standardization, advisor disambiguation).
3. **Current trajectory is hybrid:** Deep-loop-runtime already extracts shared primitives [iter-003 F49]. Strategy D extends this direction rather than reversing it.
4. **Operator disruption is minimal:** Strategy D requires no command-surface changes, unlike Strategy C (mode suffix migration) or Strategy B (breaking changes).
5. **Fixture routing accuracy is achievable:** Iter-005 fixtures show that lexical/structural/prior-art signals can disambiguate most cases (7/8 fixtures have HIGH or MED confidence). Only F-fixture-008 is genuinely contested (LOW confidence), which can be handled via clarifying questions in advisor rules.

**Caveats:** Confidence is not HIGH because iter-007 (cost-latency dimension) may surface new overlap patterns that could shift the calculus. For example, if cost-latency analysis shows that deep-review and deep-research have identical cost-per-iteration profiles, the argument for keeping them separate weakens. Final verdict deferred to iter-010 synthesis.

## Open Questions for Iter-007

1. **Cost-latency dimension:** What is the cost per dispatch (executor API cost × seats × iterations) for each skill? Do deep-review and deep-research have significantly different cost profiles that justify keeping them separate?
2. **Failure-tail behaviors:** How do the three skills handle failure tails (e.g., executor timeout, partial iteration failure)? Are there shared failure-recovery patterns that could be extracted as primitives?
3. **Convergence-threshold standardization:** Should we standardize convergence-threshold defaults across all three skills (e.g., all use 0.10) to address iter-004 F56 (DANGEROUS)? Or keep divergence but surface defaults explicitly in advisor routing?
4. **Findings-registry schema unification:** Should we unify the findings-registry schema across all three skills (borrow deep-review's directly for deep-council [iter-003 F38 open question])? Or keep schema specialization (evidence-shaped vs opinion-shaped findings)?
5. **Fixture expansion:** Should iter-007 add cost-latency fixtures (e.g., "run a cost-constrained deep-review on the spec folder") to test advisor awareness of cost guards?
6. **Routing rule prototype:** Should iter-007 implement a prototype routing rule set (based on iter-005 lexical/structural/prior-art signals) and test it against the fixture suite to measure accuracy before iter-008 formalization?

## Next Iteration

**Iter-007 target:** Cost-latency dimension exploration (cost per dispatch × seats × iterations, failure-tail behaviors, cost-guard effectiveness). This is the planned next dimension from the deep-research-config.json dimensions list ["cost-latency"].

**Exit condition for synthesis:** If iter-007 novelty rate < 0.2 AND iter-008 routing rule accuracy ≥ 90% on fixture suite, branch to synthesis (iter-009 becomes parity-test invariants, iter-010 synthesizes research.md). Otherwise, continue with iter-008 (routing rule formalization) and iter-009 (parity-test invariants) as planned.
