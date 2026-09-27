<!-- dispatch: pi CL-006; ledger: 2026-09-26T22:17:57Z 2026-09-26T22:19:43Z 0 106 -->

RESULT: PASS | scenario=CL-006 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `skill-advisor.cjs list-tools --format json \| python3 …` | 0 (supplementary run) | `ok 9` | `ok 9` — manifest parity with `TOOL_DEFINITIONS` | ✅ |
| 2 | `skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | `warm-only exit=75` (`backend unavailable`), no spawn, no socket created | ✅ |
| 3 | `skill-advisor.cjs advisor_rebuild --force true --warm-only` (untrusted) | 64 | `untrusted exit=64` + JSON envelope: `"status": "error"`, `"error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1"`, `"exitCode": 64` | `untrusted exit=64` with that trust-grant message in the stderr envelope, refused client-side before IPC | ✅ |
| 4 | `skill-advisor.cjs advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | `trusted exit=75` — gate passed, only absent daemon stopped the call | ✅ |
| 5 | `ls "$SANDBOX/sock" \|\| echo "socket dir empty"` | 0 | no output (empty dir listing, no "socket dir empty" line) | no socket entries / no additional stdout after `trusted exit=75` | ✅ |
| 6 | `rm -rf "$SANDBOX"` | 0 | sandbox removed | cleanup step, no signal specified | ✅ |
DEVIATIONS: The block ran exactly as written, unmodified. Additionally, one supplementary instrumented rerun of the same commands in a fresh `mktemp` sandbox captured the raw exit codes of steps 1 and 5 (and re-confirmed 2–4), because the block as written only echoes exit codes for steps 2–4. No step was skipped or changed.
NOTES: Step 5's `ls` exited 0 with empty output, i.e. the sandbox socket directory existed but held no socket entries — matching the scenario's recorded evidence ("produced no additional stdout") and pass rule ("no socket entries"), not the `socket dir empty` fallback branch. No daemon or live database was touched; all calls used the sandbox `SPECKIT_IPC_SOCKET_DIR`. Run twice (block + instrumented rerun), identical signals both times; not flaky.
