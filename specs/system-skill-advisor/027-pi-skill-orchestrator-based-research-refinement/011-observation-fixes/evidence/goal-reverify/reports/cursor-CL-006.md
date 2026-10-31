<!-- dispatch: cursor CL-006; ledger: 2026-09-27T13:41:18Z 2026-09-27T13:42:44Z 0 86 -->

RESULT: PASS | scenario=CL-006 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | list-tools --format json \| python count | 0 | ok 9 | ok 9 | yes |
| 2 | advisor_status --warm-only --timeout-ms 3000 | 75 | warm-only exit=75 | warm-only exit=75, no spawn, no socket | yes |
| 3 | advisor_rebuild --force true --warm-only | 64 | untrusted exit=64; {"status":"error","error":"advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1","exitCode":64} | untrusted exit=64 with that trust-grant envelope, refused before IPC | yes |
| 4 | advisor_rebuild --trusted --force true --warm-only | 75 | trusted exit=75 | trusted exit=75 (gate passed, daemon absent) | yes |
| 5 | ls "$SANDBOX/sock" | 0 | no stdout, no socket names | no socket entries (recorded evidence: no stdout after trusted exit=75) | yes |
| 6 | rm -rf "$SANDBOX" | 0 | sandbox removed (/tmp/cli-playbook.7WJMo3) | cleanup of the mktemp sandbox | yes |
DEVIATIONS: A read-only env probe ran first (SYSTEM_SKILL_ADVISOR_CLI_TRUSTED, SPECKIT_IPC_SOCKET_DIR, and SPECKIT_DAEMON_REELECTION were unset). Extra echo lines recorded the list-tools pipeline exit, the ls exit, the cleanup exit, and the sandbox path. The scenario commands and flags were unchanged.
NOTES: The command runner applied a workspace write sandbox. mktemp under /tmp succeeded, the socket directory existed and listed empty, and every expected signal matched on the first run.
