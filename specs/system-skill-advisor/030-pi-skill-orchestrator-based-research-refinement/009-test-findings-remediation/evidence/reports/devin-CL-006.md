<!-- dispatch: devin CL-006; ledger: 2026-09-26T22:22:17Z 2026-09-26T22:22:45Z 0 28 -->

STEP 0 — Advisor line captured: `Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now reading the scenario file.Running the command block exactly as written from the repository root.RESULT: PASS | scenario=CL-006 | runtime=devin-cli
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `mktemp -d` + export `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_DAEMON_REELECTION=0` | 0 | sandbox socket dir exported | sandbox setup, no host daemon contact | yes |
| 2 | `skill-advisor.cjs list-tools --format json \| python3 …count` | 0 | `ok 9` | `ok 9` — manifest parity with `TOOL_DEFINITIONS` | yes |
| 3 | `advisor_status --warm-only --timeout-ms 3000` | 0 (echo) | `warm-only exit=75` | exit 75, no spawn, no socket created | yes |
| 4 | `advisor_rebuild --force true --warm-only` (untrusted) | 0 (echo) | `untrusted exit=64` + JSON envelope `"status":"error"`, `"error":"advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1"`, `"exitCode":64` | exit 64 with the trust-grant message, refused client-side before IPC | yes |
| 5 | `advisor_rebuild --trusted --force true --warm-only` | 0 (echo) | `trusted exit=75` | exit 75 — gate passed, absent daemon stopped the call | yes |
| 6 | `ls "$SANDBOX/sock"` + `rm -rf "$SANDBOX"` | 0 | no stdout after `trusted exit=75` (dir exists, zero entries) | socket-dir listing prints no socket entries | yes |
DEVIATIONS: none
NOTES: `ls` printed nothing rather than `socket dir empty` because `SPECKIT_IPC_SOCKET_DIR` was created but held no socket entries — identical to the recorded 2026-09-26 evidence, which also produced no additional stdout.
