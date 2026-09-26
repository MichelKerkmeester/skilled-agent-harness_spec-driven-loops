<!-- dispatch: devin NC-001; ledger: 2026-09-26T18:38:24Z 2026-09-26T18:39:12Z 0 48 -->

Scenario read. STEP 0: the Advisor line in my context is `Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.` Now running the scenario command.Verifying the prompt-safety signal — searching the captured JSON for the raw prompt literal and checking for `warnings`/`abstainReasons`.All signals verified. Result report:

RESULT: PASS | scenario=NC-001 | runtime=devin-cli
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `mkdir -p /tmp/skill-advisor-playbook` + `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}' --format json` | 0 | `status:"ok"`; `workspaceRoot` = `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; `effectiveThresholds` = `{confidenceThreshold:0.8, uncertaintyThreshold:0.35, confidenceOnly:false}`; `freshness:"live"`; `trustState.state:"live"` | Envelope `ok`; workspaceRoot is repo root; thresholds exactly `{0.8, 0.35, false}`; freshness `live` or `stale` | yes |
| 2 | Saved JSON to `/tmp/skill-advisor-playbook/nc-001.json`; inspected `data.recommendations[0]` | — | `recommendations[0].skillId:"system-spec-kit"`, confidence 0.927; `laneBreakdown[]` entries carry only `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly` | First recommendation `skillId:"system-spec-kit"`; laneBreakdown has numeric contribution metadata only | yes |
| 3 | `grep` captured JSON for raw prompt literal and for `warnings`/`abstainReasons` | 1 (no matches, expected) | 0 occurrences of the prompt literal; `warnings` and `abstainReasons` fields absent entirely | Raw prompt text absent from `laneBreakdown`, `trustState`, `cache`, `warnings`, `abstainReasons` | yes |

DEVIATIONS: none — the live CLI invocation covers the absorbed legacy row's `advisor_recommend` call with equivalent options; evidence saved at the legacy-named path `/tmp/skill-advisor-playbook/nc-001.json` instead of `sad-001.json` (same directory, scenario-id filename).
NOTES: Evidence file retained at `/tmp/skill-advisor-playbook/nc-001.json` as the scenario names that directory for evidence. `ambiguous:false`, `cache.hit:false`, shadow block present with `liveWeightsFrozen:true`. No daemon/database interaction needed — freshness was `live`.
