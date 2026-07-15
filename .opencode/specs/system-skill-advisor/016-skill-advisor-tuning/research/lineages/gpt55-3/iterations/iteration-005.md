# Iteration 5: Ambiguous Cross-Hub Prompt Measurement

## Focus
Angle 5. Define a labeled ambiguity set for parent-hub compatibility.

## Findings
1. Runtime ambiguity marks a passing top cluster when score or confidence gap is within 0.05. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:7]
2. `advisor-validate` explicitly states its `ambiguity_slice_stable` metric is a synthetic two-skill stability check, not empirical ambiguity false-positive/false-negative coverage. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:548]
3. Packet 007 froze a low-margin ambiguity slice with top-1 baseline 15/25 = 0.60, which is useful as a regression guard but not a semantic ambiguity label set. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]
4. The required new set should include at least: single-pass code audit vs deep review loop, design audit vs code audit, deep-loop-runtime vs deep-loop-workflows, and md-generator/design docs vs sk-doc documentation. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md:14]
5. Measurement should capture top-1, top-2 margin, `ambiguousWith`, and strict abstain/null for deliberately under-specified prompts.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`

## Assessment
newInfoRatio: 0.58. Novelty: separates current ambiguity infrastructure from the missing cross-hub labels. Confidence: high.

## Reflection
What worked: using the handler's own caution prevents overclaiming current metrics.
What failed: the existing 0.60 ambiguity baseline cannot answer parent-hub compatibility by itself.
Ruled out: treating `ambiguity_slice_stable` as an empirical ambiguity metric.

## Recommended Next Focus
Sequence metadata changes with reindex and baseline recapture.
