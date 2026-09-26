<!-- dispatch: cursor CL-006; ledger: 2026-09-26T22:22:45Z 2026-09-26T22:24:12Z 0 87 -->

RESULT: PASS | scenario=CL-006 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | skill-advisor.cjs list-tools --format json \| python3 count | (not echoed) | ok 9 | ok 9 — manifest parity with TOOL_DEFINITIONS | yes |
| 2 | advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 | 75 | warm-only exit=75 | warm-only exit=75 (backend unavailable), no spawn, no socket | yes |
| 3 | advisor_rebuild --force true --warm-only (untrusted) | 64 | untrusted exit=64; {"status":"error","error":"advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1","exitCode":64} | untrusted exit=64 with that stderr JSON envelope, refused before IPC | yes |
| 4 | advisor_rebuild --trusted --force true --warm-only | 75 | trusted exit=75 | trusted exit=75 — gate passed, absent daemon stopped the call | yes |
| 5 | ls "$SANDBOX/sock" | 0 | no stdout | no socket entries (evidence: no additional stdout after trusted exit=75) | yes |
| 6 | rm -rf "$SANDBOX" | 0 | cleanup removed the sandbox dir | sandbox removed | yes |
DEVIATIONS: Appended `echo "BLOCK_EXIT=$?"` after `rm -rf "$SANDBOX"` so the cleanup exit was visible. No scenario command was skipped or rewritten.
NOTES: The block ran from the repo root inside the tool sandbox (workspace write, limited network) and finished in 531ms with shell exit 0. No evidence directory was named, so nothing was written in the repo. No rerun.
