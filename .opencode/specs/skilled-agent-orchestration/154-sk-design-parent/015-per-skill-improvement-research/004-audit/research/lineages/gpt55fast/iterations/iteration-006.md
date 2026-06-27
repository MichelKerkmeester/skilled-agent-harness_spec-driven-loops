# Iteration 006 - AI Fingerprint Tells and Score Calibration

## Focus

Determine whether model-specific AI tells are actionable enough and whether their impact on the `/20` score is calibrated.

## Evidence Read

- `references/ai_fingerprint_tells.md` lists concrete Codex, Gemini and 2026-general tells with check rules, owner and severity guidance.
- `references/anti_patterns_production.md` lists broader anti-slop, theming/token, copy, pseudo-element, View Transition and production-readiness checks.

## Findings

1. The AI tell catalog is one of the strongest current assets. Do not replace it with a generic anti-slop essay.
2. The remaining gap is score calibration. The catalog says a gallery of three or more tells is at least P1, but the Anti-Patterns 0-4 score could be easier to apply with a compact ladder.
3. Recommended addition: a small `anti_patterns_score_ladder` section or asset mapping isolated/systemic tells, user-task impact and register posture to Anti-Patterns score 0-4.

## Delta

- New information ratio: 0.28.
- Q2 partly answered; Q5 partly answered.

## Next

Inspect register-gated transform remediation and cross-mode ownership.
