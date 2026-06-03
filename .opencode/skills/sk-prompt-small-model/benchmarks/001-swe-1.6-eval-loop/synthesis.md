# Synthesis — cli-devin SWE 1.6 prompt-optimization run

**Generated**: 2026-05-16T21:11:42.635Z
**Iterations**: 6
**Total SWE 1.6 dispatches**: 42
**Cache hits**: 0
**Final outcome**: BUDGET EXHAUSTED

## Top-ranked variants

| Rank | Variant | Best score | Avg score | Sample count |
|------|---------|------------|-----------|--------------|
| 1 | v-004-rcaf-medium | 0.5796 | 0.5796 | 1 |
| 2 | v-003-anti-hallucination-strong | 0.4961 | 0.4961 | 1 |
| 3 | v-005-build-strict-bundle-gate | 0.4846 | 0.4846 | 1 |

## Winning variant
**v-004-rcaf-medium** with score **0.5796** at iter 4.

**Variant metadata** (the prompt-scaffolding configuration that won):
```json
{
  "id": "v-004-rcaf-medium",
  "framework": "RCAF",
  "preplanning_density": "medium",
  "thinking_threshold": "5",
  "bundle_gate_strictness": "standard",
  "anti_hallucination_strength": "standard",
  "source": "seeded",
  "description": "RCAF (Role/Context/Action/Format) with medium pre-plan. Tests whether a role-based framing improves SWE 1.6 output discipline."
}
```

## Interaction-term diagnostics

- **D2×D1 decoupling rate**: 0.0% (high = bundle passes but acceptance fails; possible rubber-stamp)
- **D4×D1 inverse rate**: 59.5% (high = no hallucination but task too hard regardless of prompt)
- **D5×D1 inverse rate**: 11.9% (high = pre-plan present but scaffold not translating to correctness)

## Fixture coverage

| Fixture | Variants scored |
|---------|-----------------|
| fix-001-hallucinated-cli-flag | 6 |
| fix-002-wrong-cwd-paths | 6 |
| fix-003-bundle-gate-smoke-run | 6 |
| fix-004-multi-file-scope-boundary | 6 |
| fix-005-acceptance-strict | 6 |
| fix-006-adversarial-path-traversal | 6 |
| fix-007-baseline-pure-function | 6 |

## Insights for 004-skill-uplift

- Apply framework **RCAF** as the primary template in `assets/prompt_templates.md` §2 SWE-1.6.
- Set pre-planning density to **medium**.
- Sequential_thinking threshold winning variant used: **5** thoughts.
- Bundle-gate strictness: **standard**.
- Anti-hallucination wording: **standard**.
- **NOTE**: D4×D1 inverse rate is 59.5%. Fixtures may be too hard for SWE 1.6 regardless of prompt. Recommend reviewing fixture difficulty.

## Handoff to 004-skill-uplift

004 reads this file as the BINDING contract. Apply winners to:
- `.opencode/skills/cli-devin/SKILL.md` (§2 SMART ROUTING + §4 RULES)
- `.opencode/skills/cli-devin/assets/prompt_templates.md` (replace winners)
- `.opencode/skills/cli-devin/assets/prompt_quality_card.md` (refine CLEAR cutoffs if needed)
- `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` (new entry)

Strict-validate after each authored doc write. No 4-runtime mirror (skill, not agent per ADR-001 in 004).
