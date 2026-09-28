<!-- dispatch: pi CL-006; ledger: 2026-09-28T13:17:28Z 2026-09-28T13:21:33Z 0 245 -->

RESULT: **PASS** | scenario=CL-006 | runtime=pi

NATIVE: `Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.`

STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `skill-advisor.cjs list-tools --format json \| python3 …` | 0* | `ok 9` | `ok 9` (manifest parity, count 9) | ✅ |
| 2 | `advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | exit 75 (`backend unavailable`), no spawn, no socket created | ✅ |
| 3 | `advisor_rebuild --force true --warm-only` (untrusted) | 64 | `untrusted exit=64` + JSON envelope: `"status": "error"`, `"error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1"`, `"exitCode": 64` | exit 64 with that trust-grant message in the stderr envelope, refused client-side before IPC | ✅ |
| 4 | `advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | exit 75 — gate passed, absent daemon stopped the call | ✅ |
| 5 | `ls "$SANDBOX/sock" 2>/dev/null \|\| echo "socket dir empty"` | 0 | empty output — `sock` dir exists, zero entries, no socket file | socket-dir listing prints no socket entries (scenario evidence: no additional stdout after `trusted exit=75`) | ✅ |
| 6 | `rm -rf "$SANDBOX"` | 0 | no leftover `/tmp/cli-playbook*` dirs after run | sandbox cleanup | ✅ |

\* The block does not print step 1's exit code (only steps 2–4 echo theirs), so `0` is captured from a supplementary instrumented re-run — see DEVIATIONS.

DEVIATIONS: One supplementary run after the verbatim block: steps 1–4 re-executed in a second fresh `mktemp` sandbox with `echo` of each exit code and an explicit `ls -A "$SB/sock"` state check, solely to capture the step-1 pipeline exit the block never reports. Read-only commands, nothing spawned, sandbox deleted. The scenario's command block itself ran verbatim, unmodified, from the repository root.

NOTES:
- The `sock` sandbox directory **exists but is empty** (`ls` exits 0 with no output, so neither a socket entry nor the `socket dir empty` fallback line prints) — this is byte-identical to the scenario's own recorded evidence and satisfies the pass rule "the socket-dir listing printed no socket entries". A directory was created by the probe, but no socket and no daemon spawn occurred.
- Commands were run from the repository root `~/MEGA/Development/Code_Environment/Public`, as the scenario's evidence block specifies.
- The repository has pre-existing dirty state (e.g. `write-containment.ts`, `specs/agents/graph-metadata.json`, untracked spec dirs including the 014 packet's `evidence/goal-reverify/`) that predates this run; I wrote nothing inside the repository and created no evidence directory (none was named for this task).
- All four pass signals matched on the first run; no flaky reruns. The untrusted envelope matched the scenario's 2026-09-26 rerun capture exactly, including message text and `"exitCode": 64`.
