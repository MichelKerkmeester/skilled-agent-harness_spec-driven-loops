<!-- dispatch: pi CL-006; ledger: 2026-09-26T18:31:40Z 2026-09-26T18:32:39Z 0 59 -->

RESULT: PASS | scenario=CL-006 | runtime=pi
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---|---|---|---|
| 1 | `skill-advisor.cjs list-tools --format json \| python3 …` | 0 | `ok 9` | `ok 9` (manifest parity with TOOL_DEFINITIONS) | ✅ |
| 2 | `advisor_status --workspaceRoot . --warm-only --timeout-ms 3000` | 75 | `warm-only exit=75` | `warm-only exit=75` (backend unavailable, no spawn, no socket) | ✅ |
| 3 | `advisor_rebuild --force true --warm-only` | 64 | `untrusted exit=64` (supplementary stderr capture: `"advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1", exitCode: 64`) | `untrusted exit=64` with trust-grant message, refused client-side | ✅ |
| 4 | `advisor_rebuild --trusted --force true --warm-only` | 75 | `trusted exit=75` | `trusted exit=75` (gate passed, daemon absent) | ✅ |
| 5 | `ls "$SANDBOX/sock" 2>/dev/null \|\| echo "socket dir empty"` | 0 | no output after `trusted exit=75` (dir existed, empty; no "socket dir empty" line) | socket-dir listing printed no socket entries | ✅ |
| 6 | `rm -rf "$SANDBOX"` | 0 | sandbox `/tmp/cli-playbook.ipenlB` removed | cleanup | ✅ |
DEVIATIONS: Step 3's expected signal includes the trust-grant message text, but the block as written redirects stderr to /dev/null. I ran the block exactly as written first (all results above are from that run), then ran one supplementary `advisor_rebuild --force true --warm-only` in a fresh sandbox with stderr captured to verify the message verbatim. No step of the written block was skipped or changed.
NOTES: Socket dir was created (empty) by the probe rather than absent; this matches the scenario's own evidence note ("no additional stdout after trusted exit=75"). The full JSON error object for step 3 is `{ "status": "error", "error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1", "exitCode": 64 }`. Exit 69 (dist-freshness guard) is named in the scenario description but has no test step in the block and was not exercised. Both mktemp sandboxes were deleted; nothing in the repository was written or modified.
