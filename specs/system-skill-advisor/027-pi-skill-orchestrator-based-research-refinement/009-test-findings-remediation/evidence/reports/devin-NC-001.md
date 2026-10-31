<!-- dispatch: devin NC-001; ledger: 2026-09-26T22:26:45Z 2026-09-26T22:27:34Z 0 49 -->

STEP 0: I have an `Advisor:` line in my context. Now reading the scenario file.Command exited 0. Inspecting the captured JSON.RESULT: PASS | scenario=NC-001 | runtime=Devin CLI (SWE-2 High)
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}' --format json` | 0 | `status:"ok"`; JSON written to `/tmp/skill-advisor-playbook/sad-001.json` | Envelope `status:"ok"` | yes |
| 2 | inspect `data.workspaceRoot` | — | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` | absolute repo root of current checkout | yes |
| 3 | inspect `data.effectiveThresholds` | — | `{"confidenceThreshold":0.8,"uncertaintyThreshold":0.35,"confidenceOnly":false}` | exact same object, no overrides | yes |
| 4 | inspect `data.freshness` / `trustState` | — | `freshness:"live"`, `trustState.state:"live"`, generation 498 | `live` or `stale` | yes |
| 5 | inspect `data.recommendations[0]` | — | `skillId:"system-spec-kit"`, score 0.757192, confidence 0.927, dominantLane `explicit_author`, `status:"active"` | top recommendation `system-spec-kit` | yes |
| 6 | inspect `laneBreakdown[]` keys | — | all 5 entries carry exactly `lane`,`rawScore`,`weightedScore`,`weight`,`shadowOnly` | lane contribution metadata only | yes |
| 7 | `grep -c "save this conversation context to memory" sad-001.json` | 1 | 0 matches anywhere in JSON; `warnings`/`abstainReasons` keys absent | raw prompt text absent from `laneBreakdown`,`trustState`,`cache`,`warnings`,`abstainReasons` | yes |
DEVIATIONS: none — command run verbatim from repo root against the live workspace; evidence saved to the scenario-named path `/tmp/skill-advisor-playbook/sad-001.json` (outside the repo).
NOTES: `why_recommended.topLanes[]` carries extra `evidenceTypes`/`evidenceCount` fields, but the scenario's metadata-only constraint applies to `laneBreakdown[]`, which is clean. A `_shadow` block is present; it contains numeric scores only, no prompt text. Daemon/database untouched; nothing written inside the repository.
