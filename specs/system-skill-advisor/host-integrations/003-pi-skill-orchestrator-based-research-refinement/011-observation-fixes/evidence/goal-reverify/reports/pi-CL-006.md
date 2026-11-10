<!-- dispatch: pi CL-006; ledger: 2026-09-27T13:32:46Z 2026-09-27T13:33:55Z 0 69 -->

RESULT: PASS | scenario=CL-006 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `skill-advisor.cjs list-tools --format json \| python3 …` | 0 | `ok 9` | `ok 9` — manifest parity with `TOOL_DEFINITIONS` | ✅ |
| 2 | `skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75`, no stdout/stderr, no socket created | `warm-only exit=75` (`backend unavailable`), no spawn, no socket | ✅ |
| 3 | `skill-advisor.cjs advisor_rebuild --force true --warm-only` | 64 | `untrusted exit=64` + JSON envelope: `"status": "error"`, `"error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1"`, `"exitCode": 64` | `untrusted exit=64` with the trust-grant message in the stderr JSON envelope, refused client-side before IPC | ✅ |
| 4 | `skill-advisor.cjs advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | `trusted exit=75` — gate passed, only the absent daemon stopped the call | ✅ |
| 5 | `ls "$SANDBOX/sock" 2>/dev/null \|\| echo "socket dir empty"` | 0 | no additional stdout after `trusted exit=75` (dir existed, empty — no socket entries, no `socket dir empty` line) | socket-dir listing printed no socket entries; evidence records no additional stdout | ✅ |
| 6 | `rm -rf "$SANDBOX"` | 0 | sandbox removed | cleanup step | ✅ |

DEVIATIONS: none. The block was run exactly as written (sandbox socket dir, `SPECKIT_DAEMON_REELECTION=0`, single bash invocation from the repository root). No files were written to the repository; the block's own `rm -rf` removed the mktemp sandbox.

NOTES: The overview/description also names a dist-freshness guard (exit 69), but §3 TEST EXECUTION and §2 Pass/Fail define only the four signals plus the empty socket listing — the verdict is scoped to those, per the file. All four matched the recorded evidence transcript byte-for-byte, including the empty-`ls` behavior (dir exists but is empty, so neither socket entries nor the `socket dir empty` fallback print). No daemon contact and no spawn occurred: the sandbox socket directory stayed empty. No reruns needed; not flaky. Nothing is left for the operator.
