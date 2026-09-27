<!-- dispatch: opencode NC-001; ledger: 2026-09-26T22:20:56Z 2026-09-26T22:26:45Z 0 349 -->

I'll start with STEP 0 and read the scenario file.
STEP 0 recorded. Now checking scenario preconditions (repo root, hook flag, runtime build state) before running the command.
Preconditions met: repo root is cwd, hook flag unset, runtime `dist/` exists. Running the scenario command and saving the JSON to the scenario-named evidence path.
Command exited 0 with 4332 bytes of JSON. Reading the saved response.
JSON saved. Now running machine checks: literal prompt search and exact expected-signal assertions.
rg confirms the prompt literal is absent (exit 1). The assertion script hit an infinite recursion bug in my deep-equal (array key comparison). Re-running with a fixed comparator.
All expected signals verified. Final evidence record:

RESULT: PASS | scenario=NC-001 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `pwd`; `printenv SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (§2 contract) | 0 / 1 | cwd=`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; flag unset | Repo root is working dir; hook flag unset | yes |
| 2 | `ls .skilled/skills/system-skill-advisor/runtime` (§2 build precondition, read-only) | 0 | `dist/` present | Runtime built with `npm --prefix ... run build` | yes (see DEVIATIONS) |
| 3 | `mkdir -p /tmp/skill-advisor-playbook` (legacy row step 1) | 0 | dir created | Evidence dir exists | yes |
| 4 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}' --format json` (§3 step 1) | 0 | `status:"ok"`; `recommendations` non-empty (1); `rec[0].skillId:"system-spec-kit"` score 0.757194 conf 0.927 unc 0.12; `freshness:"live"`; `trustState.state:"live"` gen 494 | Envelope `status:"ok"`; recs non-empty; top rec `system-spec-kit`; freshness `live`/`stale` | yes |
| 5 | save JSON → `/tmp/skill-advisor-playbook/sad-001.json` (§3 step 2 / legacy step 3) | 0 | 4332 bytes written; stderr empty | JSON saved to evidence path | yes |
| 6 | inspect `data.workspaceRoot`, `data.effectiveThresholds`, `data.recommendations[0]` (§3 step 3) | 0 | `workspaceRoot`=`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; `effectiveThresholds`=`{"confidenceThreshold":0.8,"uncertaintyThreshold":0.35,"confidenceOnly":false}`; `rec[0]`=`system-spec-kit` | workspaceRoot = absolute repo root; thresholds deep-equal the §3 block; first rec `skillId:"system-spec-kit"` | yes |
| 7 | assert `laneBreakdown[]` keys (same run) | 0 | 5 entries (explicit_author, lexical, graph_causal, derived_generated, semantic_shadow); every entry keys exactly `lane,rawScore,shadowOnly,weight,weightedScore`; all numeric/bool | Lane contribution metadata only: `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly` | yes |
| 8 | `rg -i "save this conversation\|conversation context\|memory\|current packet" sad-001.json` (legacy step 4) | 1 | no matches (exit 1 = absent) | Raw prompt text absent from `laneBreakdown`, `trustState`, `cache`, `warnings`, `abstainReasons` (and captured JSON) | yes |

DEVIATIONS: §2 contract "runtime has been built with `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`" was not executed — task hard rules forbid running any build; precondition verified read-only instead (`dist/` present, live command returned a full ok envelope). Legacy row step 2's exact prompt ("Save this conversation context to memory so the next session can resume from the current packet.") differs from §3 step 1's ("save this conversation context to memory"); I ran the §3 TEST EXECUTION command and searched the captured JSON for both literals — both absent.
NOTES: `warnings` and `abstainReasons` keys are entirely absent from the response (undefined) — consistent with "raw prompt text is not present in" them. An extra `_shadow` block (learned-weights shadow scores) is present in `data`; it is outside the expected-signal list and contains no prompt text. `freshness:"live"`, so the failure-mode rebuild triage was not triggered. Evidence left at `/tmp/skill-advisor-playbook/sad-001.json` (scenario-named path, outside the repository); no repository files were written or modified.
