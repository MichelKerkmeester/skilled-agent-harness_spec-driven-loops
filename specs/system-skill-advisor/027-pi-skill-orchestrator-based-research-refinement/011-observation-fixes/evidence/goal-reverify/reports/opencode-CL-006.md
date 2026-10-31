<!-- dispatch: opencode CL-006; ledger: 2026-09-27T13:55:43Z 2026-09-27T13:59:56Z 0 253 -->

Reading the scenario done. Running preliminary environment checks (read-only), then the scenario block verbatim.
No trust-grant or live socket env vars are set. Running the scenario block verbatim now.
Block run complete — all four signals printed. One supplementary read-only observation to capture step 1's pipeline exit code explicitly and document sock-dir state, then env restore.
RESULT: PASS | scenario=CL-006 | runtime=opencode
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 0 | env check (SPECKIT_* / SYSTEM_SKILL_ADVISOR_*) | 0 | only SKILL_ADVISOR_DEBUG=1, BARTER_AI_SPECKIT set; no socket/trust/db vars | no pre-set trust grant or live socket that could skew the run | yes |
| 1 | `node .skilled/bin/skill-advisor.cjs list-tools --format json \| python3 …` | 0 (pipeline, observed in supplementary rerun) | `ok 9` | `ok 9` — manifest parity with TOOL_DEFINITIONS | yes |
| 2 | `advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | `warm-only exit=75` (`backend unavailable`), no spawn, no socket created | yes |
| 3 | `advisor_rebuild --force true --warm-only` (untrusted) | 64 | `untrusted exit=64` + stderr envelope `{ "status": "error", "error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1", "exitCode": 64 }` | `untrusted exit=64` with trust-grant message and `"exitCode": 64` in the JSON envelope; refused client-side before IPC | yes |
| 4 | `advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | `trusted exit=75` — gate passed, absent daemon stopped the call | yes |
| 5 | `ls "$SANDBOX/sock" 2>/dev/null \|\| echo "socket dir empty"` | 0 | no stdout after `trusted exit=75` (sock dir exists, empty — confirmed `total 0` in supplementary sandbox) | socket-dir listing printed no socket entries; evidence records no additional stdout after `trusted exit=75` | yes |
| 6 | `rm -rf "$SANDBOX"` | 0 | sandbox removed | cleanup | yes |
DEVIATIONS: none in the scenario run — the block was executed verbatim from repository root in one shell invocation. One supplementary read-only rerun of step 1 in a second `mktemp -d` sandbox was made solely to observe the pipeline exit code explicitly and to inspect sock-dir contents (it showed the CLI creates `$SANDBOX/sock` empty); the verdict rests on the verbatim block run only.
NOTES: Pre-run environment had no `SPECKIT_IPC_SOCKET_DIR`, `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED` or `SYSTEM_SKILL_ADVISOR_DB_DIR`, so the untrusted-refusal test was not masked by a host trust grant. The block's `export`s persisted in the persistent shell and were `unset` afterward to restore pre-run state. No live daemon or database was contacted, stopped, or modified; no repository files were written; both `/tmp/cli-playbook.*` temp dirs were deleted. The empty pre-created `sock` dir is why the final `ls` printed nothing instead of `socket dir empty`, matching the scenario's recorded evidence transcript exactly.
