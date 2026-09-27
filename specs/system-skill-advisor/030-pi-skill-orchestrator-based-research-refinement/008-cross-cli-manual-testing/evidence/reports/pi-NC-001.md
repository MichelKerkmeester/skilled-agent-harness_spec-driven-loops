<!-- dispatch: pi NC-001; ledger: 2026-09-26T18:36:18Z 2026-09-26T18:37:35Z 0 77 -->

RESULT: PASS | scenario=NC-001 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}' --format json` (run from repo root, output saved) | 0 | JSON saved (4332 bytes), empty stderr; envelope `status: "ok"` | Command runs; envelope `status: "ok"` | ✓ |
| 2 | Save JSON response | 0 | Saved to temp dir `/tmp/skill-advisor-playbook-nc001/nc-001.json`, inspected, deleted at end | Save JSON response (legacy row: to `/tmp/skill-advisor-playbook/sad-001.json`) | ✓ (see DEVIATIONS) |
| 3 | Inspect `data.workspaceRoot` | 0 | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` — equals the actual repo root the command ran from | Absolute repository root for the current checkout | ✓ |
| 3 | Inspect `data.effectiveThresholds` | 0 | `{"confidenceThreshold":0.8,"uncertaintyThreshold":0.35,"confidenceOnly":false}` — exact deep-equality check true | Present and exactly `{"confidenceThreshold":0.8,"uncertaintyThreshold":0.35,"confidenceOnly":false}` | ✓ |
| 3 | Inspect freshness / trustState | 0 | `data.freshness: "live"`, `trustState.state: "live"` (generation 445) | `data.freshness` is `live` or `stale` | ✓ |
| 3 | Inspect `data.recommendations[0]` | 0 | `recommendations.length: 1`; `recommendations[0].skillId: "system-spec-kit"` (score 0.757, confidence 0.927) | Non-empty; first recommendation has `skillId: "system-spec-kit"` | ✓ |
| 3 | Inspect `laneBreakdown[]` keys | 0 | Every entry has exactly `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly` (5 lanes) | Lane contribution metadata only: those five fields | ✓ |
| 3 | Search captured JSON for raw prompt literal ("save this conversation context to memory", case-insensitive), incl. `laneBreakdown`, `trustState`, `cache`, `warnings`, `abstainReasons` | 0 | Not present anywhere in the JSON (fragments "save this", "conversation context", "to memory" also absent) | Raw prompt text absent from metadata (privacy check) | ✓ |
| 0 | Contract check: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` unset | 0 | Variable absent from environment (`env \| grep`) | Scenario contract: flag unset | ✓ |
DEVIATIONS: The legacy row's steps 1 and 3 were changed: evidence was saved to a disposable `/tmp` directory (`/tmp/skill-advisor-playbook-nc001/nc-001.json`) instead of `/tmp/skill-advisor-playbook/sad-001.json`, because my hard rules require temp files in a /tmp scratch directory that is deleted at the end; the JSON was inspected and then removed, so this report is the surviving evidence record. Minor: the scratch dir used a fixed name rather than `mktemp -d`. No scenario test step was skipped; the scenario's steps 1–3 all ran against the live workspace (read-only).
NOTES: Scenario contract precondition "runtime has been built" was assumed as the contract states; I did not run any build (forbidden by my hard rules) — the command succeeded with `freshness: "live"` so the precondition held in practice. `warnings` and `abstainReasons` were absent from the response (normal for a non-abstaining ok response), so the privacy check on those fields trivially passed. No reruns needed; single execution, deterministic.
