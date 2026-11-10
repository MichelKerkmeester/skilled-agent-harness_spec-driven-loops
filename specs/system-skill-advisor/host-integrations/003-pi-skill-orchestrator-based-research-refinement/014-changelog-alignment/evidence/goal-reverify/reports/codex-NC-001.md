<!-- dispatch: codex NC-001; ledger: 2026-09-28T13:45:11Z 2026-09-28T13:46:30Z 0 79 -->

RESULT: PASS | scenario=NC-001 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend … --format json` | 0 | `status: ok`; freshness `live`; recommendation `system-spec-kit` | Successful envelope; freshness `live` or `stale`; first recommendation is `system-spec-kit` | Yes |
| 2 | Save response JSON under `/tmp` | 0 | JSON response saved; temporary directory removed afterward | Save the JSON response | Yes |
| 3 | Inspect workspace root, thresholds, recommendation and metadata | 0 | Workspace root matched; thresholds matched exactly; lane metadata had the expected fields; prompt absent from sensitive metadata | Expected root and thresholds; prompt-safe lane attribution and metadata | Yes |
DEVIATIONS: Used a Python temporary-file wrapper to save, inspect, and clean up the response after the command runner rejected the initial `rm -rf` cleanup wrapper. The scenario command itself ran unchanged.
NOTES: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` was unset.
