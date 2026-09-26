<!-- dispatch: codex NC-001; ledger: 2026-09-26T22:29:37Z 2026-09-26T22:30:40Z 0 63 -->

RESULT: PASS | scenario=NC-001 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `advisor_recommend --prompt "save this conversation context to memory" --options … --format json` | 0 | `status: ok`; workspace root matched; thresholds were `0.8`, `0.35`, `false`; freshness `live`; first skill `system-spec-kit` | OK envelope, current workspace root, exact thresholds, freshness `live` or `stale`, first skill `system-spec-kit` | Yes |
| 2 | Save JSON response to a temporary file | 0 | Response saved, then temporary file removed | Save the JSON response | Yes |
| 3 | Inspect response fields and prompt-safety metadata | 0 | Lane fields were `lane`, `rawScore`, `weightedScore`, `weight`, `shadowOnly`; no prompt leakage in checked fields | Lane attribution contains only specified contribution metadata; raw prompt absent from `laneBreakdown`, `trustState`, `cache`, `warnings`, and `abstainReasons` | Yes |
DEVIATIONS: none
NOTES: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset.
