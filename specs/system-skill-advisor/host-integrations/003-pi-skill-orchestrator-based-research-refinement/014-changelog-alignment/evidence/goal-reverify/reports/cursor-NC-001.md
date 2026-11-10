<!-- dispatch: cursor NC-001; ledger: 2026-09-28T13:46:42Z 2026-09-28T13:49:10Z 0 148 -->

RESULT: PASS | scenario=NC-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options topK:1,includeAttribution,includeAbstainReasons --format json | 0 | status ok; workspaceRoot is this checkout; effectiveThresholds 0.8 / 0.35 / confidenceOnly false; freshness live; recommendations[0].skillId system-spec-kit; laneBreakdown has only lane, rawScore, weightedScore, weight, shadowOnly | status ok; workspaceRoot is the absolute repo root; those exact thresholds; freshness live or stale; skillId system-spec-kit; laneBreakdown is lane contribution metadata only | yes |
| 2 | save JSON response under mktemp | 0 | 4314-byte JSON saved, then the temp dir deleted | JSON response saved | yes |
| 3 | inspect workspaceRoot, effectiveThresholds, recommendations[0]; search laneBreakdown, trustState, cache, warnings, abstainReasons for the prompt literal | 0 | prompt literal absent from those fields and from the whole JSON; warnings and abstainReasons absent | raw prompt text absent from laneBreakdown, trustState, cache, warnings, and abstainReasons | yes |
DEVIATIONS: Step 1 was invoked once inside the tool sandbox first. That run returned a 994-byte degraded local-scorer envelope (status ok, three recommendations, no workspaceRoot, freshness, or laneBreakdown) and was discarded because it did not reach the live advisor. The recorded result is the same command rerun with the sandbox disabled. SPECKIT_SKILL_ADVISOR_HOOK_DISABLED was unset.
NOTES: Live response had one recommendation, cache.hit true, trustState.state live, generation 582. Temp dirs /tmp/nc-001-Zcr6UF and /tmp/nc-001-live-tvKRaG were removed after inspection.
