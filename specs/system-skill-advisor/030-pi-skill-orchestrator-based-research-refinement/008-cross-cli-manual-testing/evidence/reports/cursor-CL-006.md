<!-- dispatch: cursor CL-006; ledger: 2026-09-26T18:33:43Z 2026-09-26T18:35:33Z 0 110 -->

RESULT: PASS | scenario=CL-006 | runtime=cursor
NATIVE: none visible
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | skill-advisor.cjs list-tools --format json \| python3 count | 0 (node=0, python=0) | ok 9 | ok 9 — manifest parity with TOOL_DEFINITIONS | yes |
| 2 | advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 | 75 | warm-only exit=75 | warm-only exit=75 (backend unavailable), no spawn and no socket created | yes |
| 3 | advisor_rebuild --force true --warm-only | 64 | untrusted exit=64 | untrusted exit=64, refused client-side before IPC | yes |
| 4 | advisor_rebuild --trusted --force true --warm-only | 75 | trusted exit=75 | trusted exit=75 — gate passed, absent daemon stopped the call | yes |
| 5 | ls "$SANDBOX/sock" \|\| echo "socket dir empty" | 0 | no stdout | no socket entries; no additional stdout after trusted exit=75 | yes |
| 6 | rm -rf "$SANDBOX" | 0 | sandbox removed | cleanup of the fresh sandbox | yes |
DEVIATIONS: Inserted three echo lines (list-tools PIPESTATUS, ls-or-echo exit, rm exit) to record exits the block does not print. Scenario commands, arguments, redirects, and sandbox exports were unchanged. An earlier zsh run of the same block printed the same four signals before this bash run.
NOTES: Session shell is zsh; the block was executed with bash as written. Cursor sandbox was on (workspace writes, limited network). mktemp under /tmp succeeded, and the socket listing stayed empty. No daemon was stopped or contacted.
