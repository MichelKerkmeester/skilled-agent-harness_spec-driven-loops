# Cross-Model Validation Analysis

**Generated**: 2026-05-17T19:02:15.360Z
**Models tested**: deepseek-v4-pro, kimi-k2.6
**Variants tested**: 5
**Fixtures per model x variant**: 7
**Total dispatches**: 70

## Per-model x per-variant aggregate scores

| Variant | SWE-1.6 baseline | deepseek-v4-pro | kimi-k2.6 |
|---------|------------------|------|------|
| v-001-baseline-star | 0.5235 | 0.6893 (n=7) | — |
| v-002-build-dense-preplan | 0.4468 | 0.7129 (n=7) | — |
| v-003-anti-hallucination-strong | 0.5164 | 0.6871 (n=7) | 0.6933 (n=6) |
| v-004-rcaf-medium | 0.5664 | 0.7604 (n=7) | 0.7689 (n=7) |
| v-005-build-strict-bundle-gate | 0.5610 | 0.7079 (n=7) | 0.7384 (n=6) |

## Decision gates — does each SWE-1.6 finding hold cross-model?

### Gate 1: Bundle-gate-aversion (standard > strict)

SWE-1.6 finding: v-004-rcaf-medium (0.5664) > v-005-build-strict-bundle-gate (0.5610). The standard-bundle-gate variant outscored the strict-bundle-gate variant.

| Model | v-004 mean | v-005 mean | Δ (v-004 − v-005) | Hold? |
|-------|-----------|-----------|---------------------|-------|
| deepseek-v4-pro | 0.7604 | 0.7079 | +0.0525 | YES |
| kimi-k2.6 | 0.7689 | 0.7384 | +0.0305 | YES |

### Gate 2: Framework-dominates-anti-hallucination (RCAF without > STAR with)

SWE-1.6 finding: v-004-rcaf-medium (0.5664) > v-003-anti-hallucination-strong (0.5164). RCAF beats STAR + aggressive anti-hallucination wording by 0.05.

| Model | v-004 mean | v-003 mean | Δ (v-004 − v-003) | Hold? |
|-------|-----------|-----------|---------------------|-------|
| deepseek-v4-pro | 0.7604 | 0.6871 | +0.0732 | YES |
| kimi-k2.6 | 0.7689 | 0.6933 | +0.0756 | YES |

## Best variant per model

| Model | Best variant | Score |
|-------|--------------|-------|
| deepseek-v4-pro | v-004-rcaf-medium | 0.7604 |
| kimi-k2.6 | v-004-rcaf-medium | 0.7689 |

## Verdict + cross-CLI propagation recommendation

**Gate 1 (bundle-gate-aversion)**: 2/2 models confirm (deepseek-v4-pro, kimi-k2.6). 
**Gate 2 (framework-dominates-anti-hallucination)**: 2/2 models confirm (deepseek-v4-pro, kimi-k2.6).

**Gate 1 verdict**: Bundle-gate-aversion holds on all tested models → propagate "standard-over-strict" guidance cross-CLI.
**Gate 2 verdict**: Framework-dominates-anti-hallucination holds on all tested models → propagate "RCAF framework primary lever, anti-hallucination wording secondary" guidance cross-CLI.

## Surface caveats

- `deepseek-v4` is dispatched via cli-devin's `--model deepseek-v4` preset. This may not be byte-equivalent to `deepseek/deepseek-v4-pro` (originally planned via cli-opencode in ADR-001). Devin's CLI does not expose a `--variant` knob for reasoning effort tier selection. See `decision-record.md` ADR-002.
- `kimi-k2.6` is dispatched via cli-devin's `--model kimi-k2.6` preset.
- Grader: claude-sonnet-4-5 (matches 113/003 baseline). Grader cache shared with prior runs via sha256(swe16_output_text) key, so re-dispatches of identical outputs incur no grader cost.
- Per-fixture seed snapshot/restore is active via 113/003/score-variant.cjs `snapshotDir`+`restoreFromSnapshot` helpers when `EVAL_LOOP_EXTRACT=true`.
