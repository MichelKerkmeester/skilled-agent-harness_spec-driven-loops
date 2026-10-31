<!-- dispatch: codex NC-001; ledger: 2026-09-26T18:40:39Z 2026-09-26T18:41:38Z 0 59 -->

RESULT: PASS | scenario=NC-001 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend ... --format json` | 0 | `status: ok`; workspace root matched; thresholds matched; freshness `live`; first skill `system-spec-kit` | Successful envelope, expected root and thresholds, live or stale freshness, correct skill | Yes |
| 2 | Save JSON response to a temporary file under `/tmp` | 0 | Response saved and parsed; temporary directory cleaned up | Save the JSON response | Yes |
| 3 | Inspect root, thresholds, and first recommendation | 0 | Lane attribution contained the specified metadata fields; raw prompt absent from checked metadata | Expected recommendation fields and prompt-safe metadata | Yes |
DEVIATIONS: none
NOTES: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset; freshness was `live`.
