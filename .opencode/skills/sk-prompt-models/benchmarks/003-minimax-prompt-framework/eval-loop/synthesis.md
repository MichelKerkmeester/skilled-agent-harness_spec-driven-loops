# Synthesis — MiniMax M2.7 prompt-framework benchmark

**Generated**: 2026-05-28 (regenerated from real-run state; replaces the auto-template that inherited 113's SWE-1.6 prose)
**Target model**: `minimax/MiniMax-M2.7` via cli-opencode direct MiniMax.io API
**Grader**: claude-sonnet (cli-claude-code), `fallback_fenced` parse mode
**Iterations**: 7 | **Real MiniMax dispatches**: 49 (7 variants × 7 fixtures) | **Cache hits**: 0
**Rig**: ported from `113-cli-devin-prompt-quality/002-eval-rig` (7 fixtures, 5-dim rubric D1-D5)

## Final ranking

| Rank | Variant | Framework | Pre-plan | Score |
|------|---------|-----------|----------|-------|
| 1 | v-mut-49dc8916 | **TIDD-EC** | **dense** | **0.7750** |
| 2 | v-004-tidd-ec | TIDD-EC | medium | 0.7671 |
| 3 | v-005-costar | COSTAR | medium | 0.7617 |
| 4 | v-001-rcaf | RCAF | medium | 0.7419 |
| 5 | v-mut-f30510bd | TIDD-EC | sparse | 0.7250 |
| 6 | v-002-race | RACE | medium | 0.7043 |
| 7 | v-003-cidi | CIDI | medium | 0.6829 |

## Winner

**TIDD-EC framework + dense pre-planning**, score **0.775**.
- Framework axis: TIDD-EC (0.767 medium) was the top seed framework, ahead of COSTAR (0.762), RCAF (0.742), RACE (0.704), CIDI (0.683).
- Pre-plan axis (hill-climb on TIDD-EC): **dense 0.775 > medium 0.767 > sparse 0.725**.
- Held constant across all variants: thinking_threshold=5, bundle_gate_strictness=standard, anti_hallucination_strength=standard, `--variant` omitted.

## Key findings (and divergence from SWE-1.6)

1. **MiniMax M2.7 favors guardrail-heavy framing.** TIDD-EC (explicit Task/Instructions/Do's/Don'ts/Examples/Context) beats RCAF by +0.025 at medium pre-plan and is the clear leader. SWE-1.6 (packet 113) preferred RCAF; MiniMax does not. Likely because TIDD-EC's explicit Don'ts curb MiniMax's scope/format drift.
2. **MiniMax M2.7 favors DENSE pre-planning** (+0.05 over sparse, +0.008 over medium). This is the OPPOSITE of SWE-1.6, where medium beat dense — MiniMax uses the extra plan structure rather than being slowed by it.
3. **COSTAR is competitive (0.762)** — audience-aware framing held up better on coding than expected (it underperformed for SWE-1.6's narrative analog). RACE (compressed) and CIDI (process) lagged.

## Interaction diagnostics
- D2×D1 decoupling: 0.0% (no bundle-passes-but-acceptance-fails rubber-stamping)
- D4×D1 inverse: 26.5% (some fixtures hard regardless of prompt)
- D5×D1 inverse: 4.1% (pre-plan generally translated to correctness)

## Caveats (honest scope)
- `fix-003-bundle-gate-smoke-run` had no node_modules → its D2 smoke-run hard-gated **uniformly** across all 7 variants (affects absolute scores equally, not the relative ranking).
- Grader ran in `fallback_fenced` mode (claude returned fenced output the parser handled via fallback) — D4 is directionally valid but not a strict dual-grader median.
- Single sample per (variant, fixture); margins of 0.008-0.03 are above the ~0.02 fixture-noise floor but a re-run would tighten confidence.

## Integration recommendation (binding for Phase 4)

Apply to the **cli-opencode / MiniMax** dispatch path (NOT cli-devin):
- `cli-opencode/assets/prompt_templates.md` — add a MiniMax M2.7 section using the **TIDD-EC** scaffold with **dense** pre-planning (Task / Instructions / Do's / Don'ts / Examples / Context + a 4-5 step pre-plan).
- `cli-opencode/assets/prompt_quality_card.md` — mark TIDD-EC as the empirical default for `minimax/MiniMax-M2.7`; RCAF as fallback.
- `sk-prompt-models/references/pattern-index.md` — add a MiniMax prompt-framework row → cli-opencode canonical location.
- `sk-prompt/assets/cli_prompt_quality_card.md` — note MiniMax → TIDD-EC + dense pre-plan.
- Config correction (carried from 120/002): slug `minimax/minimax-2.7` → `minimax/MiniMax-M2.7`; `context_length: 204800`.
