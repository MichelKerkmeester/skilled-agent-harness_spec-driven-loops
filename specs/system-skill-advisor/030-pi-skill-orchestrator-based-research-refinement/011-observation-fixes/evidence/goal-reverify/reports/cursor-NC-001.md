<!-- dispatch: cursor NC-001; ledger: 2026-09-27T13:43:36Z 2026-09-27T13:45:22Z 0 106 -->

RESULT: PASS | scenario=NC-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options topK 1, attribution and abstain reasons, --format json | 0 | status ok; freshness live; recommendations length 1; skillId system-spec-kit; confidence 0.9268 | status ok; freshness live or stale; first skillId system-spec-kit | yes |
| 2 | save the JSON response | 0 | Wrote the envelope to a temp file, inspected it, then deleted the temp dir | Save the JSON response | yes |
| 3 | inspect workspaceRoot, effectiveThresholds, recommendations[0] | 0 | workspaceRoot is ~/MEGA/Development/Code_Environment/Public; effectiveThresholds confidenceThreshold 0.8, uncertaintyThreshold 0.35, confidenceOnly false; each laneBreakdown entry has only lane, rawScore, weightedScore, weight, shadowOnly; prompt literal absent from laneBreakdown, trustState, cache, and from the whole JSON (warnings and abstainReasons keys absent) | Absolute repo root; those exact thresholds; lane contribution fields only; raw prompt absent from laneBreakdown, trustState, cache, warnings, and abstainReasons | yes |
DEVIATIONS: none
NOTES: SPECKIT_SKILL_ADVISOR_HOOK_DISABLED was unset. The advisor daemon was not stopped, restarted, or rebuilt. The JSON was stored only under a mktemp directory and removed after inspection.
