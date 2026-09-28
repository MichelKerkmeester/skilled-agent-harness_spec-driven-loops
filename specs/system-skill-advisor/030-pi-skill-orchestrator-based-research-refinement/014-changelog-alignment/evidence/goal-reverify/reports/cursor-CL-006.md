<!-- dispatch: cursor CL-006; ledger: 2026-09-28T13:35:09Z 2026-09-28T13:37:39Z 0 150 -->

RESULT: PASS | scenario=CL-006 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | mktemp sandbox; export SPECKIT_IPC_SOCKET_DIR and SPECKIT_DAEMON_REELECTION=0 | 0 | Block continued; later ls saw the socket dir | Fresh sandbox; host daemon never contacted | yes |
| 2 | skill-advisor.cjs list-tools --format json \| python count | 0 | ok 9 | ok 9 | yes |
| 3 | advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 | 75 | warm-only exit=75 | warm-only exit=75, no spawn, no socket | yes |
| 4 | advisor_rebuild --force true --warm-only (untrusted) | 64 | untrusted exit=64; {"status":"error","error":"advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1","exitCode":64} | untrusted exit=64 with that stderr envelope, refused before IPC | yes |
| 5 | advisor_rebuild --trusted --force true --warm-only | 75 | trusted exit=75 | trusted exit=75 (gate passed, daemon absent) | yes |
| 6 | ls "$SANDBOX/sock" \|\| echo "socket dir empty" | 0 | no stdout | no socket entries | yes |
| 7 | rm -rf "$SANDBOX" | 0 | block exit=0 | teardown | yes |
DEVIATIONS: none on the authoritative run (bash, repository root, block unchanged). A prior run added three exit-status echoes; that transcript is not the evidence.
NOTES: The exact rerun matched the instrumented run on all four signals. After `trusted exit=75`, `ls` printed nothing, so the socket directory existed and was empty. The sandbox was removed by the block.
