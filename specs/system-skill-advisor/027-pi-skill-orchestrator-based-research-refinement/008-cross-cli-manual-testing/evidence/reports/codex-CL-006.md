<!-- dispatch: codex CL-006; ledger: 2026-09-26T18:35:33Z 2026-09-26T18:36:18Z 0 45 -->

RESULT: BLOCKED | scenario=CL-006 | runtime=Codex
NATIVE: Advisor: live; ambiguous: cli-external-orchestration 0.95/0.20 vs sk-code 0.88/0.16 pass.
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | `list-tools --format json` piped to Python | 0* | `ok 9` | `ok 9` | Yes |
| 2 | `advisor_status --warm-only` | 75 | `warm-only exit=75` | Exit 75 | Yes |
| 3 | untrusted `advisor_rebuild --warm-only` | 64 | `untrusted exit=64`; error text redirected to `/dev/null` | Exit 64 and trust-grant message | Cannot verify message |
| 4 | trusted `advisor_rebuild --trusted --warm-only` | 75 | `trusted exit=75` | Exit 75 | Yes |
| 5 | socket directory listing | 0* | No output; no entries listed | No socket entries | Yes |

\* The block’s final shell exit was 0; individual exit codes for the pipeline and `ls` were not printed. The sandbox was removed with `rmdir`.

DEVIATIONS: Cleanup changed from `rm -rf "$SANDBOX"` to `rmdir "$SANDBOX/sock" "$SANDBOX"` after execution rejected the original command with: `rm -f style commands are not permitted. Use a safer approach`.
NOTES: BLOCKED because the prescribed untrusted-mutation command redirects its error text, so the expected trust-grant message could not be observed.
