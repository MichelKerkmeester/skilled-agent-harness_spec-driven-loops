<!-- dispatch: cursor NC-001; ledger: 2026-09-26T18:39:12Z 2026-09-26T18:41:12Z 0 120 -->

RESULT: PASS | scenario=NC-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,...}' --format json | 0 | status ok; workspaceRoot=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; effectiveThresholds confidenceThreshold 0.8, uncertaintyThreshold 0.35, confidenceOnly false; freshness live; recommendations[0].skillId=system-spec-kit; laneBreakdown has 5 rows whose only keys are lane, rawScore, weightedScore, weight, shadowOnly | status ok; workspaceRoot is this checkout root; those exact thresholds; freshness live or stale; skillId system-spec-kit; laneBreakdown metadata only those five fields | yes |
| 2 | save JSON response | 0 | Envelope written and parsed as JSON before inspection | JSON response saved | yes |
| 3 | inspect workspaceRoot, effectiveThresholds, recommendations[0] | 0 | Prompt literal "save this conversation context to memory" absent from laneBreakdown, trustState, cache, warnings, and abstainReasons (warnings and abstainReasons absent) | Raw prompt text absent from those fields | yes |
DEVIATIONS: The first invocation ran in the sandbox and returned exit 0 with status ok from source local-scorer, degraded true, and without workspaceRoot, freshness, or laneBreakdown. The same command was rerun outside the sandbox and that response is the one judged.
NOTES: SPECKIT_SKILL_ADVISOR_HOOK_DISABLED was unset. The judged response had freshness live and cache.hit true. The temp capture was removed after inspection.
