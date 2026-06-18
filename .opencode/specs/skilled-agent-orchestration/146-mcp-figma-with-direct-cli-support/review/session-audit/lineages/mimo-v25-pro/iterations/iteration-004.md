# Iteration 4: Maintainability

## Focus
Maintainability dimension review. Assessed code patterns, documentation quality, naming conventions, script modularity, cross-file consistency, and the ease of safe follow-on changes across all 8 scripts, 4 references, SKILL.md, README.md, and INSTALL_GUIDE.md.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 14
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.29

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F008**: install.sh verbose flag has no effect on git operations, `.opencode/skills/mcp-figma/scripts/install.sh:95`. Line 95 uses `${VERBOSE:+}` (empty expansion) instead of `${VERBOSE:+--verbose}` or similar. When `VERBOSE=1`, the git pull command gets no additional verbosity. The `npm_q` function on line 48 correctly handles verbose, but the git operations do not.

- **F009**: _common.sh defines DAEMON_TOKEN_FILE and DAEMON_PID_FILE constants that are never used by any script, `.opencode/skills/mcp-figma/scripts/_common.sh:48-49`. All scripts rely on the CLI's own default paths rather than these constants. Only `doctor.sh` references `DAEMON_TOKEN_FILE`, `DAEMON_PID_FILE`, `DAEMON_PORT`, and `CDP_PORT` (lines 32-43). The other 7 scripts (install, connect-safe, connect-yolo, daemon, unpatch, print-utcp-snippets) do not reference them. This is minor dead code in the shared library.

## Positive Patterns Observed

- **Script modularity**: All 8 scripts source `_common.sh` for shared helpers, use `set -euo pipefail`, and follow a consistent structure (parse args → check prereqs → act → report).
- **Binary resolution**: `figma_bin()` in `_common.sh` provides a single source of truth for binary detection, used consistently across all scripts.
- **Safety gating**: `connect-yolo.sh` requires `--i-understand-this-patches-figma`, `daemon.sh` whitelists verbs, `install.sh` never connects or patches.
- **Documentation structure**: The SKILL.md follows the sibling terminal-control shape. References are well-separated by concern (CLI reference, tool surface, MCP wiring, troubleshooting).
- **Cross-reference integrity**: All internal links between SKILL.md, references, README, and INSTALL_GUIDE resolve correctly.
- **Color-coded output**: Consistent `log/info/ok/warn/err` functions provide clear terminal output across all scripts.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | — | Code patterns follow house conventions |
| checklist_evidence | pass | hard | — | CHK-013 (house patterns) verified |

## Assessment
- New findings ratio: 0.29 (2 P2 findings with weight 1.0 each out of 7 total weighted findings)
- Dimensions addressed: maintainability
- Novelty justification: Code is well-structured; both findings are minor style/quality issues

## Ruled Out
- Documentation duplication between figma_cli_reference.md and tool_surface.md: intentional separation of concerns (reference vs taxonomy), not a maintainability issue

## Dead Ends
- None this iteration

## Recommended Next Focus
All 4 dimensions covered. Evaluate convergence: dimension coverage is 100%, no P0 findings, 2 P1 findings (from iteration 1). The review should proceed to convergence check.

---

Review verdict: PASS
