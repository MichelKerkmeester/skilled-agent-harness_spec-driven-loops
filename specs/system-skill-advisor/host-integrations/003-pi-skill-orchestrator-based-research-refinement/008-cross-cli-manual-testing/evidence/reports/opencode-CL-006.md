<!-- dispatch: opencode CL-006; ledger: 2026-09-26T18:31:40Z 2026-09-26T18:38:24Z 0 404 -->

I'll run the scenario. Gate status: Gate 3 pre-resolved (child dispatch, spec folder bound). Gate 1 done (trigger index looked up). SKILL ROUTING: User directed → scenario CL-006 (`skill-advisor-cli-fallback.md`). No writes to the repository — this is test execution only, so Gate 5 does not fire.

STEP 0: scanning my runtime context for a line starting with `Advisor:` — none visible.

Now running the command block exactly as written (plus two `exit=$?` observation lines so every command's exit status can be read, per the verification standard):
All four signals match and the socket listing is empty (no entries, no fallback echo — identical to the scenario's recorded transcript). Now a supplementary stderr read to verify the trust-grant message text from expected signal 3 (the block redirects stderr, so it can't be seen in the authoritative run):
RESULT: PASS | scenario=CL-006 | runtime=opencode
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `skill-advisor.cjs list-tools --format json \| python3 -c ...print status,count` | 0 | `ok 9` | `ok 9` — manifest parity with TOOL_DEFINITIONS | yes |
| 2 | `skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | `warm-only exit=75` (`backend unavailable`), no spawn, no socket created | yes |
| 3 | `skill-advisor.cjs advisor_rebuild --force true --warm-only` (untrusted) | 64 | `untrusted exit=64` | `untrusted exit=64` with `advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`, refused client-side before IPC | yes |
| 4 | `skill-advisor.cjs advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | `trusted exit=75` — gate passed, only the absent daemon stopped the call | yes |
| 5 | `ls "$SANDBOX/sock" 2>/dev/null \|\| echo "socket dir empty"` | 0 (ls) | no output — sock dir existed and empty, no socket entries, no fallback echo | socket-dir listing printed no socket entries (recorded evidence: no additional stdout after `trusted exit=75`) | yes |
| 6 | `rm -rf "$SANDBOX"` | 0 | sandbox removed | — (cleanup step, no scenario expectation) | — |
DEVIATIONS: No scenario step was skipped or altered. Two `echo "... exit=$?"` observation lines were added after the list-tools pipeline and after the `ls` line (commands themselves unchanged) so every command's exit status could be read. The block was run from the repository root as one bash script (heredoc) so the sandbox exports did not leak into the session shell. One supplementary rerun of the untrusted command (fresh sandbox, stderr not redirected) was added purely to observe the trust-grant message the block hides; it reproduced exit 64 and the exact expected string `advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`.
NOTES: Pass/fail rule satisfied on all four signals plus the socket check. The empty-but-present sock dir matches the scenario's recorded evidence exactly (nothing printed after `trusted exit=75`). Both `mktemp` sandboxes were deleted (rm exit=0); repository untouched; live daemon and database untouched (all calls ran with sandboxed `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_DAEMON_REELECTION=0`, and refuse-before-IPC/warm-only paths — nothing spawned). No flakiness observed; single run per command.
