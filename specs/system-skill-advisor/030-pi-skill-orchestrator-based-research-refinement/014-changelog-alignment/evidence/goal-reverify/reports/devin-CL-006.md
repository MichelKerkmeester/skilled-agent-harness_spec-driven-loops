<!-- dispatch: devin CL-006; ledger: 2026-09-28T13:34:35Z 2026-09-28T13:35:09Z 0 34 -->

I'll run scenario CL-006. First, STEP 0: the `Advisor:` line visible in this prompt's context is:

`Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

Now reading the scenario file.Read the scenario. Now running the command block exactly as written, from the repo root.RESULT: PASS | scenario=CL-006 | runtime=devin
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
| 1 | `skill-advisor.cjs list-tools --format json \| python3 …` | 0 | `ok 9` | `ok 9` — manifest parity with `TOOL_DEFINITIONS` | yes |
| 2 | `advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | `warm-only exit=75` (backend unavailable), no spawn | yes |
| 3 | `advisor_rebuild --force true --warm-only` (untrusted) | 64 | `untrusted exit=64` + JSON envelope `"status": "error"`, `"error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1"`, `"exitCode": 64` | exit 64 with the trust-grant message envelope, refused before IPC | yes |
| 4 | `advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | `trusted exit=75` — gate passed, absent daemon stopped the call | yes |
| 5 | `ls "$SANDBOX/sock"` | 0 | no stdout after `trusted exit=75` | socket-dir listing prints no socket entries | yes |
DEVIATIONS: none
NOTES: `ls` exited 0 with no output, meaning the sandbox socket dir exists but is empty — consistent with warm-only refusing before IPC and never creating a socket. Sandbox `mktemp` dir removed by the block's final `rm -rf`. Host daemon and database were never contacted.
