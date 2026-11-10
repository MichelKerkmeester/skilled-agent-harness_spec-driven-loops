<!-- dispatch: pi NC-001; ledger: 2026-09-27T13:40:20Z 2026-09-27T13:41:18Z 0 58 -->

RESULT: PASS | scenario=NC-001 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 0 | Precondition check: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` env | 0 | unset | Scenario contract: flag is unset | YES |
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}' --format json` | 0 | `"status":"ok"`; `data.workspaceRoot`=`~/MEGA/Development/Code_Environment/Public`; `data.effectiveThresholds`=`{confidenceThreshold:0.8, uncertaintyThreshold:0.35, confidenceOnly:false}`; `data.freshness`=`"live"` (trustState generation 528); `data.recommendations[0].skillId`=`"system-spec-kit"` (score 0.756786, confidence 0.9268, uncertainty 0.12); `laneBreakdown` 5 entries, each with exactly `lane, rawScore, weightedScore, weight, shadowOnly` | Envelope `status:"ok"`; `data.workspaceRoot` is absolute repo root; `effectiveThresholds` exactly `{0.8, 0.35, false}`; `freshness` is `live` or `stale`; first recommendation `skillId:"system-spec-kit"`; `laneBreakdown[]` entries carry only `lane, rawScore, weightedScore, weight, shadowOnly` | YES |
| 2 | Save JSON response (to `/tmp/nc001.pJiKND/nc-001.json`, mktemp) | 0 | JSON saved | Save the JSON response | YES |
| 3 | Inspect `data.workspaceRoot`, `data.effectiveThresholds`, `data.recommendations[0]`; grep saved JSON for raw prompt literal `"save this conversation context to memory"` | 1 (grep = no match, as required) | Prompt literal absent from full JSON (grep count 0) and absent from `laneBreakdown`, `trustState`, `cache` (`warnings`/`abstainReasons` not present in response); all three inspected fields present and conformant | Raw prompt text not present in `laneBreakdown`, `trustState`, `cache`, `warnings`, `abstainReasons`; inspect the three fields | YES |
DEVIATIONS: none (the absorbed legacy row's `/tmp/skill-advisor-playbook/sad-001.json` evidence path was substituted with a `mktemp -d` directory per executor hard rules; same content, directory deleted after inspection)
NOTES: none
