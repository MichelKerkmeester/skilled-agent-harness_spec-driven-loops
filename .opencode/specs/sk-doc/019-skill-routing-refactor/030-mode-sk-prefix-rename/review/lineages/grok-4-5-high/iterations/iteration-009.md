# Iteration 9: Advisor dual-vocabulary & description.json

## Focus

Maintainability/advisor angle — phase 009 Lane D additive sk- keywords vs retained bare legacy keywords; scoring-shift risk.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: sk-code/description.json, sk-design/description.json, sk-doc/description.json, sk-prompt/description.json, 009-post-review-remediation/implementation-summary.md
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 0.1

## Findings

### P2, Suggestion

- **F012**: Advisor `description.json` keywords intentionally retain bare pre-rename tokens (e.g. `code-quality`, `prompt-improve`) alongside additive `sk-*` variants. Documented as Lane D design (additive-forward, no removals) to avoid scoring cliffs, but dual vocabulary remains until a later advisor re-baseline packet. [SOURCE: .opencode/skills/sk-code/description.json:41-44] [SOURCE: .opencode/skills/sk-prompt/description.json:12-19] [SOURCE: 009-post-review-remediation/implementation-summary.md:74]

## Assessment

Not a rename defect — an accepted transitional state. Flagged so merge/operator expectations stay honest about advisor daemon timing (“takes effect at merge”).

Review verdict: PASS
