# Iteration 1: D1 Correctness — Scripts Logic & Error Handling

## Focus
D1 Correctness: Review the 8 install/safety scripts (`install.sh`, `daemon.sh`, `connect-safe.sh`, `connect-yolo.sh`, `unpatch.sh`, `doctor.sh`, `print-utcp-snippets.sh`, `_common.sh`) for logic errors, broken invariants, incorrect return values, edge-case handling, and behavioral correctness.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F001**: `connect-safe.sh` stdin read without EOF guard may cause script failure in non-interactive agent contexts. `read -r ans` (line 21) triggers `set -euo pipefail` non-zero exit on EOF or closed stdin, preventing graceful fallback. [SOURCE: `.opencode/skills/mcp-figma/scripts/connect-safe.sh:20-22`]
  ```json
  {"findingId":"F001","claim":"connect-safe.sh read -r ans returns non-zero on EOF with set -e, causing script exit before the case statement evaluates.","evidenceRefs":[".opencode/skills/mcp-figma/scripts/connect-safe.sh:20-22"],"counterevidenceSought":"Checked if bash treats read specially under set -e (it does catch non-zero return), checked for stdin check before read (none found).","alternativeExplanation":"In practice, the pipe or tty that invokes the script typically keeps stdin open, so this is a theoretical path only triggered when stdin is /dev/null or closed.","finalSeverity":"P2","confidence":0.65,"downgradeTrigger":"If bash's set -e exception handling for read proves this is safe across bash 3.2-5.x on macOS, downgrade to disproved.","transitions":[{"iteration":1,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

### P2, Suggestion
- **F002**: `daemon.sh` inconsistently writes help/usage to stdout (line 13) vs stderr (line 14), and the `err` call on line 14 already writes to stderr before `echo` sends the verb list to stderr, producing redundant error output. [SOURCE: `.opencode/skills/mcp-figma/scripts/daemon.sh:13-14`]
  ```json
  {"findingId":"F002","claim":"daemon.sh writes usage help to stdout via echo on line 13 and to stderr via echo >&2 on line 14 after an err() call that also writes to stderr, causing redundant stderr output for the same help content.","evidenceRefs":[".opencode/skills/mcp-figma/scripts/daemon.sh:13-14"],"counterevidenceSought":"Checked if the double-stderr pattern exists in other scripts (it doesn't; install.sh uses usage() to stdout). Verified err() writes to stderr in _common.sh:14.","alternativeExplanation":"The extra echo >&2 on line 14 could be intentional to ensure the verb list reaches stderr even if err() is suppressed.","finalSeverity":"P2","confidence":0.70,"downgradeTrigger":"If confirmed this is a cosmetic pattern shared by design, downgrade to disproved.","transitions":[{"iteration":1,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| N/A | - | - | - | Correctness dimension does not execute traceability protocols |

## Assessment
- New findings ratio: 1.00 (all findings are new — expected for first iteration)
- Dimensions addressed: correctness
- Novelty justification: The 8 scripts are all short, well-structured wrappers around `figma-ds-cli`. `_common.sh` provides solid shared logic (binary resolution, node version check, daemon/file path constants). `install.sh` is the most complex at 165 lines, correctly handling the npm vs repo source auto-detection, version comparison via `sort -V`, and stale-version upgrade warning. No P0 or P1 logic errors were found. The two P2 findings are minor: a stdin guard gap in an interactive script, and inconsistent help output formatting. The shared `port_listening()` function uses a subshell-based return value pattern that works correctly but could be simplified.

## Ruled Out
- **Binary collision**: `figma_bin()` in `_common.sh:19-23` correctly avoids the unrelated npm `figma-cli` by never selecting a bare `figma` binary [RULED OUT: script logic is correct]
- **Version comparison edge case**: `version_lt()` in `install.sh:54` handles equal versions correctly (returns false) and uses `sort -V` for proper semver comparison [RULED OUT: algorithm correct]
- **Unsafe `eval`/`raw`/`run` exposure in scripts**: None of the 8 scripts call `eval`, `raw`, or `run` commands directly — they all use explicit verb validation [RULED OUT: no arbitrary code execution path]

## Dead Ends
- **`port_listening` return value pattern**: Uses `$(port_listening "$PORT"; echo $?)` in `doctor.sh:34-43` which is a bit awkward but functionally correct — `port_listening` returns exit codes 0/1/2 and the subshell captures them. No dead-end here; just stylistic.

## Recommended Next Focus
D2 Security: Review `.env` handling, daemon token exposure, script permissions, and the yolo/app-patch security boundary. Focus files: `_common.sh` (token file path), `connect-yolo.sh` (patch consent), `doctor.sh` (token-not-shown guarantee), `mcp_wiring.md` (Figma API key guidance).

Review verdict: PASS
