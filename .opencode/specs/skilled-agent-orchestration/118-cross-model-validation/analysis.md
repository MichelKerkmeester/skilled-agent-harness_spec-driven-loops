# Cross-Model Validation Analysis

**Generated**: 2026-05-17T13:34:02.247Z
**Models tested**: kimi-k2.6
**Variants tested**: 1
**Fixtures per model x variant**: 1
**Total dispatches**: 1

## Per-model x per-variant aggregate scores

| Variant | SWE-1.6 baseline | kimi-k2.6 |
|---------|------------------|------|
| v-004-rcaf-medium | 0.5664 | 0.4250 (n=1) |

## Decision gates — does each SWE-1.6 finding hold cross-model?

### Gate 1: Bundle-gate-aversion (standard > strict)

SWE-1.6 finding: v-004-rcaf-medium (0.5664) > v-005-build-strict-bundle-gate (0.5610). The standard-bundle-gate variant outscored the strict-bundle-gate variant.

| Model | v-004 mean | v-005 mean | Δ (v-004 − v-005) | Hold? |
|-------|-----------|-----------|---------------------|-------|
| kimi-k2.6 | — | — | — | INCONCLUSIVE (missing data) |

### Gate 2: Framework-dominates-anti-hallucination (RCAF without > STAR with)

SWE-1.6 finding: v-004-rcaf-medium (0.5664) > v-003-anti-hallucination-strong (0.5164). RCAF beats STAR + aggressive anti-hallucination wording by 0.05.

| Model | v-004 mean | v-003 mean | Δ (v-004 − v-003) | Hold? |
|-------|-----------|-----------|---------------------|-------|
| kimi-k2.6 | — | — | — | INCONCLUSIVE (missing data) |

## Best variant per model

| Model | Best variant | Score |
|-------|--------------|-------|
| kimi-k2.6 | v-004-rcaf-medium | 0.4250 |

## Verdict + cross-CLI propagation recommendation

**Gate 1 (bundle-gate-aversion)**: 0/0 models confirm (none). 
**Gate 2 (framework-dominates-anti-hallucination)**: 0/0 models confirm (none).

**Gate 1 verdict**: Bundle-gate-aversion does NOT hold cross-model → keep SWE-1.6-specific in cli-devin only.
**Gate 2 verdict**: Framework-dominates-anti-hallucination does NOT hold cross-model → keep SWE-1.6-specific in cli-devin only.

## Surface caveats

- `deepseek-v4` is dispatched via cli-devin's `--model deepseek-v4` preset. This may not be byte-equivalent to `deepseek/deepseek-v4-pro` (originally planned via cli-opencode in ADR-001). Devin's CLI does not expose a `--variant` knob for reasoning effort tier selection. See `decision-record.md` ADR-002.
- `kimi-k2.6` is dispatched via cli-devin's `--model kimi-k2.6` preset.
- Grader: claude-sonnet-4-5 (matches 114/003 baseline). Grader cache shared with prior runs via sha256(swe16_output_text) key, so re-dispatches of identical outputs incur no grader cost.
- Per-fixture seed snapshot/restore is active via 114/003/score-variant.cjs `snapshotDir`+`restoreFromSnapshot` helpers when `EVAL_LOOP_EXTRACT=true`.
