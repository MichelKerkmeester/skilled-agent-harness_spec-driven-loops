<!-- dispatch: opencode CL-006; ledger: 2026-09-26T22:19:43Z 2026-09-26T22:22:17Z 0 154 -->

Read the full scenario (CL-006). Now running its test execution block exactly as written, from the repository root, via a temp script so the block bytes are preserved.
All four signals observed. One quick re-run to observe the first pipeline's exit status (the block does not echo it), still in a fresh sandbox:
RESULT: PASS | scenario=CL-006 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | skill-advisor.cjs list-tools --format json \| python3 parse | 0 | `ok 9` | `ok 9` (manifest parity with TOOL_DEFINITIONS) | yes |
| 2 | advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 | 75 | `warm-only exit=75` | `warm-only exit=75` (backend unavailable), no spawn | yes |
| 3 | advisor_rebuild --force true --warm-only (untrusted, 2>&1 captured) | 64 | `untrusted exit=64` then envelope `{"status":"error","error":"advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1","exitCode":64}` | exit 64 with that trust-grant message and `"exitCode": 64`, refused before IPC | yes |
| 4 | advisor_rebuild --trusted --force true --warm-only | 75 | `trusted exit=75` | `trusted exit=75` (gate passed, daemon absent) | yes |
| 5 | ls "$SANDBOX/sock" \|\| echo "socket dir empty" | 0 | no stdout (dir exists, empty) | no socket entries; evidence notes no additional stdout after `trusted exit=75` | yes |
DEVIATIONS: none
NOTES: Block executed byte-identical to the scenario (written verbatim to a `mktemp` script under /tmp, run with bash from the repo root, temp dir removed). The block's own `rm -rf "$SANDBOX"` ran; a post-block check found no leftover `/tmp/cli-playbook.*` dirs. Step 1's exit code is not echoed by the block, so it was re-observed in a fresh sandbox (`list-tools` pipeline exit=0, output `ok 9`); this did not alter the block. Nothing written in the repository; no daemon, database, or build touched. Live advisor daemon untouched (all calls used the scenario's sandbox `SPECKIT_IPC_SOCKET_DIR`).
