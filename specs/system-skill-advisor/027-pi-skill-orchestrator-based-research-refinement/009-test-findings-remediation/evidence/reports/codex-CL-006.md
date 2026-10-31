<!-- dispatch: codex CL-006; ledger: 2026-09-26T22:24:12Z 2026-09-26T22:24:45Z 0 33 -->

RESULT: PASS | scenario=CL-006 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `list-tools --format json` | 0 | `ok 9` | `ok 9` | Yes |
| 2 | `advisor_status --warm-only` | 75 | `warm-only exit=75` | Exit 75; no spawn or socket created | Yes |
| 3 | Untrusted `advisor_rebuild --warm-only` | 64 | Trust-grant error envelope; `exitCode: 64` | Exit 64 with the trust-grant message | Yes |
| 4 | Trusted `advisor_rebuild --trusted --warm-only` | 75 | `trusted exit=75` | Exit 75; daemon absent | Yes |
| 5 | Sandbox socket listing | 0 | No socket entries printed | No socket entries | Yes |

DEVIATIONS: none
NOTES: Scenario block completed with exit code 0.
