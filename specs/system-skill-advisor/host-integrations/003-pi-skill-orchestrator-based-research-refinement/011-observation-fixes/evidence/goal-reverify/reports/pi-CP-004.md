<!-- dispatch: pi CP-004; ledger: 2026-09-27T13:05:01Z 2026-09-27T13:06:21Z 0 80 -->

RESULT: PASS | scenario=CP-004 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 0 | (context inspection) | n/a | `Advisor: live; ambiguous: cli-external-orchestration 0.95/0.18 vs sk-code 0.88/0.16 pass.` | Copy first `Advisor:` line verbatim, or `none visible` | yes |
| 1 | `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 …/skill_advisor.py "help me commit my changes"` | 0 | Fallback notice, `Skill graph: loaded from SQLite`, then a JSON array with one `sk-git` entry (`"source": "local"`, confidence 0.95) | Forced-local shim returns a JSON array from the Python scorer | yes |
| 2 | `SANDBOX=$(mktemp -d /tmp/cp004.XXXXXX)` + 4 exports + `GEN_BEFORE=$(shasum $GEN)` | 0 | `SANDBOX=/tmp/cp004.xaDXVD`; `GEN_BEFORE=1622c51d… skill-graph-generation.json` | Sandbox under `/tmp/cp004.*`, socket/DB dirs exported, generation checksum recorded | yes |
| 3 | `node .skilled/bin/skill-advisor.cjs advisor_recommend … --warm-only --timeout-ms 3000` | 75 | `{"status":"error","error":"backend unavailable: connect ENOENT /tmp/cp004.xaDXVD/sock/daemon-ipc.sock","exitCode":75}` then `warm-only exit=75`; `$SANDBOX/db` not created after the run | Retryable error envelope `"status":"error"` with `"error":"backend unavailable: connect ENOENT $SANDBOX/sock/daemon-ipc.sock"`, `"exitCode":75`, `warm-only exit=75`; nothing spawned, `$SANDBOX/db` never created | yes |
| 4 | `node .skilled/bin/skill-advisor.cjs advisor_recommend … --timeout-ms 30000` | 0 | `{"status":"ok", … "freshness":"live", "trustState":{"state":"live",…,"generation":1}, recommendations:[sk-git …]}` then `cold-start exit=0` | `cold-start exit=0` after `"status":"ok"` from the sandbox daemon with `freshness:"live"` | yes |
| 5 | teardown: read `$SANDBOX/db/.system-skill-advisor-launcher.json`, conditional `kill -TERM` of sandbox launcher only, generation check, `rm -rf $SANDBOX` | 0 | lease socket inside sandbox → `sandbox launcher 53527 stopped`; `live generation file unchanged`; sandbox removed | `sandbox launcher <pid> stopped` and `live generation file unchanged`; only a launcher whose lease socket is inside the sandbox is stopped | yes |
| 5b | `sha256sum` of the two live-state files after teardown | 0 | gen: `f778b8c8…` before = `f778b8c8…` after; launcher: `fe980720…` before = `fe980720…` after | Both pairs unchanged by the run (task requirement) | yes |

DEVIATIONS: none. Steps 2–5 ran in one shell session (the scenario's own failure-mode table requires the exports to persist in the same shell) and the teardown ran exactly as written, including its socket-inside-sandbox guard.

NOTES:
- sha256 pairs (task-required): `.skilled/skills/.state/advisor/skill-graph-generation.json` = `f778b8c86a39947c8355c87b5a3cb5c6334770739397cd2f107cb0b2846f2645` before and after; `.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json` = `fe9807205037e21515500c2ee6276b50218a771b7d2ca2cb48190d1e862f74df` before and after. Unchanged.
- The scenario file's embedded §6/§7 evidence is from an earlier run recorded as BLOCKED (`freshness: "unavailable"` under a prior code state); this run against current code produced the expected signals (`freshness: "live"` from the sandbox daemon), so the verdict here is based solely on this run's observations.
- Two additive diagnostics (not scenario steps, no command altered): `$SANDBOX/db` existence check after step 3 (result: absent, as expected) and a sandbox-removal check after `rm -rf` (result: removed).
- Expected-signal sentence "The absence path does not throw and does not block prompt handling" is corroborated by steps 3 and 4 both returning JSON envelopes with no thrown error and prompt handling proceeding (step 4 answered); it is inference from those envelopes rather than a separate measurement.
