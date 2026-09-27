<!-- dispatch: codex NC-001; ledger: 2026-09-27T13:46:13Z 2026-09-27T13:46:57Z 0 44 -->

RESULT: PASS | scenario=NC-001 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `node .skilled/bin/skill-advisor.cjs advisor_recommend … --format json` | 0 | `status=ok`; workspace root matched; thresholds were `{0.8, 0.35, false}`; freshness `live`; top skill `system-spec-kit`; confidence `0.9268` | Expected envelope, root, thresholds, freshness, and top skill | Yes |
| 2 | Save response JSON in temporary `/tmp` directory | 0 | JSON saved and parsed; temporary directory removed | Save the JSON response | Yes |
| 3 | Inspect response fields and prompt-safe metadata | 0 | Lane entries contain contribution metadata; raw prompt absent from checked metadata fields | Expected lane fields and no raw prompt in sensitive metadata | Yes |
DEVIATIONS: none
NOTES: none
