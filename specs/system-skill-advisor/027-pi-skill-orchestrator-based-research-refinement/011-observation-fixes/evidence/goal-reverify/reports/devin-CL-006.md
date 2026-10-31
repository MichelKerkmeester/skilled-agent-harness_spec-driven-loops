<!-- dispatch: devin CL-006; ledger: 2026-09-27T13:39:49Z 2026-09-27T13:40:20Z 0 31 -->

RESULT: PASS | scenario=CL-006 | runtime=Devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `skill-advisor.cjs list-tools --format json` piped to python3 count | 0 | `ok 9` | `ok 9` — manifest parity with `TOOL_DEFINITIONS` | yes |
| 2 | `advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | exit 75 (backend unavailable), no spawn | yes |
| 3 | `advisor_rebuild --force true --warm-only` (untrusted) | 64 | `untrusted exit=64` + JSON envelope `"status": "error"`, `"error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1"`, `"exitCode": 64` | exit 64 with the trust-grant message, refused client-side before IPC | yes |
| 4 | `advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | exit 75 — gate passed, only absent daemon stopped the call | yes |
| 5 | `ls "$SANDBOX/sock"` then `rm -rf "$SANDBOX"` | 0 | no output after `trusted exit=75` | socket-dir listing prints no socket entries | yes |
DEVIATIONS: none — block run verbatim from the repository root.
NOTES: The `ls` produced no stdout and the `|| echo "socket dir empty"` fallback did not fire, meaning the sandbox socket directory exists but is empty — consistent with warm-only no-spawn semantics (no daemon contacted, no socket created). All four contract signals matched; scenario evidence in the file matches this transcript byte-for-byte on the key lines.
