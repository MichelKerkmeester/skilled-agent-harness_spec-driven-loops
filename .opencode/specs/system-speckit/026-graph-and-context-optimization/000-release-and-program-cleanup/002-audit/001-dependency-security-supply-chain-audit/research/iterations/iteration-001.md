# Iteration 001 - Mini Shai-Hulud IOCs

## Summary
No active Mini Shai-Hulud compromise indicators found. Direct IOC paths (gh-token-monitor payload, persistence mechanisms) are clean. TanStack virtual packages present but in confirmed-clean family and versions predating attack. One transient process match requires monitoring.

## Files/Commands Reviewed
- `~/.local/bin/gh-token-monitor.sh` (exit code 1: No such file)
- `~/Library/LaunchAgents/com.user.gh-token-monitor*` (exit code 1: No such file)
- `~/.config/systemd/user/gh-token-monitor*` (exit code 1: No such file)
- `pgrep -fa "gh-token|token-monitor|api.github.com/user"` (exit code 0: PID 51347 found, process no longer exists on verification)
- `rg -n "@tanstack/" .opencode --glob "*.json"` (exit code 1: No matches)
- `find . -name "package-lock.json"` (exit code 0: 28 files found)
- `launchctl list | grep -iE "gh-token|token-monitor|shai|com\.user"` (exit code 1: No matches)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| IOC-001 | Transient process match for token-monitor pattern | `pgrep` returned PID 51347 matching "gh-token|token-monitor|api.github.com/user" pattern, but `ps -p 51347` showed process no longer exists (exit code 1, empty COMMAND) | Monitor for recurrence; if persistent, investigate process parentage and command lineage |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| PKG-001 | TanStack virtual packages present in confirmed-clean family | `@tanstack/react-virtual` v3.13.22 and `@tanstack/virtual-core` v3.13.22 found in: <br>- `.opencode/specs/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/package-lock.json` lines 6346-6365 <br>- `.opencode/specs/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/package-lock.json` lines 6346-6365 <br>`@tanstack/virtual*` family explicitly confirmed-clean per Snyk analysis; versions 3.13.22 pre-date May 11, 2026 attack | No action required; continue monitoring for TanStack security advisories |

## Convergence Signal
newInfoRatio: 0.15 - LOW. Direct IOC paths CLEAN, TanStack packages in confirmed-clean family. One transient process match requires monitoring but no active compromise indicators. Dimension: CLEAN.
