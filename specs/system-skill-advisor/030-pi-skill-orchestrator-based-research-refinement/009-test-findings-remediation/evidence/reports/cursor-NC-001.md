<!-- dispatch: cursor NC-001; ledger: 2026-09-26T22:27:34Z 2026-09-26T22:29:37Z 0 123 -->

RESULT: PASS | scenario=NC-001 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,...}' --format json` | 0 | `status:"ok"`; `workspaceRoot`=`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; `freshness:"live"`; `recommendations[0].skillId:"system-spec-kit"`; one recommendation | Envelope `status:"ok"`; absolute checkout root; freshness `live` or `stale`; top skill `system-spec-kit` | yes |
| 2 | save JSON response to a temp file | 0 | 4313-byte JSON saved, then the temp directory was deleted | Save the JSON response | yes |
| 3 | inspect `workspaceRoot`, `effectiveThresholds`, `recommendations[0]` | 0 | thresholds `{confidenceThreshold:0.8, uncertaintyThreshold:0.35, confidenceOnly:false}`; `laneBreakdown` has only `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly`; prompt literal absent from `laneBreakdown`, `trustState`, `cache`, and from the whole JSON (`warnings` and `abstainReasons` omitted) | Those thresholds exactly; lane metadata only those five keys; raw prompt absent from `laneBreakdown`, `trustState`, `cache`, `warnings`, `abstainReasons` | yes |
DEVIATIONS: none in the scenario steps. An earlier identical invocation inside the tool sandbox returned a degraded `local-scorer` envelope (exit 0) without `workspaceRoot`, `freshness`, or `laneBreakdown`; that run was discarded and the same command was rerun outside the sandbox so it could reach the live advisor.
NOTES: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset. The recorded envelope is the live advisor response (`freshness:"live"`, `trustState.state:"live"`, `cache.hit:true`). Temp files under `/tmp` were deleted.
