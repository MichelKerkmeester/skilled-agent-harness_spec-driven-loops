# Review Iteration 4 — seat rv-4 (openai/gpt-5.5-fast, variant high)

- Dimension: doc-rule-additions
- Status: complete | exit=0 | duration=184s | P0=0 P1=1 P2=1 (pre-adversarial)
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only)

## Seat output

**Findings**
1. **P1: `lite` aliases into a non-exact final status path**
Evidence: `.opencode/skills/sk-code-review/SKILL.md#9.3` says `lite` maps to M-2, but M-2 emits `Review status: COMMENTED (skipped: ...)` while §3 requires the absolute final line to be exactly one of three strings.
Recommendation: keep skip rationale outside the final line, and make all M-2/`lite` paths end with exact `Review status: COMMENTED`.

2. **P2: `SK_CODE_REVIEW_DEPTH=lite` has unclear semantics against M-2’s actual enable gate**
Evidence: §9.2 says M-2 only works when `SK_CODE_REVIEW_MIN_CHANGED_LINES > 0`; §9.3 says `SK_CODE_REVIEW_DEPTH=lite` maps to M-2 but does not say whether it sets a threshold or only names behavior.
Recommendation: state that `lite` is prompt-only unless `SK_CODE_REVIEW_MIN_CHANGED_LINES` is also set, or define the wired threshold/config behavior.

**Checked Non-Findings**
- No direct weakening of P0/P1/P2 floors in the added checklist rows; the `ceiling:` downgrade explicitly excludes security/auth/persistence/sandboxing/public-contract/correctness.
- `ceiling:` guidance is internally consistent with comment hygiene: not allow-listing it is correct because allowed patterns short-circuit violation detection.
- A bare `ceiling: ADR-004` would still be caught; a line that also contains an existing allowed token like `CWE-79` can still bypass, but that is an existing checker issue, not introduced by `ceiling:`.
- Design Restraint Ladder placement is consistent with phase flow: after surface/intent routing, before Phase 1 writes, with Iron Law unchanged.
- Anti-stall does not override SCOPE-LOCK/HALT as written; it is limited to cases where a safe minimal implementation satisfies the stated requirement.
- Needed-ness/removal guidance is bounded by current requirement traceability, “would anything break?”, P2 default severity, and removal-plan evidence checks.

```json
{"seat":"rv-4","dimension":"doc-rule-additions","findings":[{"id":"F1","severity":"P1","title":"lite aliases into a non-exact final status path","file":".opencode/skills/sk-code-review/SKILL.md#9.3","line":"518; cross-check 503-507 and 345-372","evidence":"§9.3 maps lite to M-2, while M-2 documents `Review status: COMMENTED (skipped: ...)`; the final-line contract requires exactly `Review status: COMMENTED` with no variation.","recommendation":"Move skip rationale before the verdict and require M-2/lite outputs to end with exact `Review status: COMMENTED`."},{"id":"F2","severity":"P2","title":"lite mapping omits M-2 enable/threshold semantics","file":".opencode/skills/sk-code-review/SKILL.md#9.3","line":"514-518; cross-check 503-510","evidence":"§9.2 only enables M-2 when `SK_CODE_REVIEW_MIN_CHANGED_LINES > 0`; §9.3 says `SK_CODE_REVIEW_DEPTH=lite` maps to M-2 but does not define whether it sets a threshold or merely names the existing gate.","recommendation":"Clarify that lite is advisory unless the min-lines gate is separately configured, or define the concrete wired threshold/config behavior."}],"severityCounts":{"P0":0,"P1":1,"P2":1},"newInfoRatio":0.33}
```