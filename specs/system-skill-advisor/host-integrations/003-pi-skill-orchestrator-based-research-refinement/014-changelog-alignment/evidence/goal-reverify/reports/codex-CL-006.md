<!-- dispatch: codex CL-006; ledger: 2026-09-28T13:37:39Z 2026-09-28T13:38:17Z 0 38 -->

RESULT: PASS | scenario=CL-006 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `list-tools --format json` | 0 | `ok 9` | `ok 9` | Yes |
| 2 | `advisor_status --warm-only` | 75 | `warm-only exit=75` | Exit 75; no spawn or socket | Yes |
| 3 | Untrusted `advisor_rebuild` | 64 | Trust-grant error envelope; `exitCode: 64` | Exit 64 with the trust-grant message | Yes |
| 4 | Trusted `advisor_rebuild --trusted` | 75 | `trusted exit=75` | Exit 75 because the daemon is absent | Yes |
| 5 | List sandbox socket directory | 0 | No entries printed | No socket entries | Yes |

DEVIATIONS: The initial exact block invocation was rejected before execution because the runner disallowed `rm -rf`. Reran the scenario with equivalent cleanup using `rmdir` on the empty socket and sandbox directories.
NOTES: Scenario commands completed with overall exit 0; the sandbox was removed.
