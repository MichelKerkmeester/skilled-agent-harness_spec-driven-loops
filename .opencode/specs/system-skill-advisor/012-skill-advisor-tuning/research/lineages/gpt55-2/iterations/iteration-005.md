# Iteration 5: Hub-vs-Mode Ambiguity Set

## Focus

Investigate charter angle 5: routing quality on ambiguous cross-hub prompts.

## Findings

1. The ambiguity gate freezes a 25-row low-margin slice and requires live top-1 to stay at or above baseline [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/ambiguity-slice.vitest.ts:5].
2. The current baseline records ambiguity top-1 as 15/25, accuracy 0.60, tau 0.03 [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:30].
3. Existing rows already include deep-loop vs memory/spec-kit/read-only contested prompts, but they do not fully cover `design-audit vs code-audit` or `deep-loop-runtime vs deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl:1].
4. `classifyAdvisorQuery` currently classifies any `review`, `audit`, or `findings` prompt as `review`, which is too coarse to distinguish design audit, code audit, and review-loop intent by itself [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:121].
5. The next ambiguity set should be hand-labeled by intended skill, not generated from current top-1, then survivors should be merged into the frozen slice only after the metadata fix and baseline recapture.

## Sources Consulted

- `tests/scorer/ambiguity-slice.vitest.ts`
- `scripts/routing-accuracy/scorer-eval-baseline.json`
- `scripts/routing-accuracy/ambiguity-prompts.jsonl`
- `lib/scorer/fusion.ts`

## Assessment

- newInfoRatio: 0.47
- Novelty: connected new parent-hub prompt families to the existing ratchet mechanism.
- Confidence: high on measurement plan; top-1 outcomes require future run.

## Reflection

- Worked: using 007's gate instead of inventing a new metric.
- Failed: no live scoring run was performed because this lineage is read-only proposals only.
- Ruled out: aggregate accuracy as sufficient evidence.

## Recommended Next Focus

Define the reindex, rebuild, rebaseline, and ratchet recapture runbook.
