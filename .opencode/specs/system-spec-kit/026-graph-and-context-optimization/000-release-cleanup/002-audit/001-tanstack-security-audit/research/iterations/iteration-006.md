# Iteration 006 - LaunchAgents + LaunchDaemons

## Summary
LaunchAgents and LaunchDaemons audit reveals one HIGH-severity exposure (API key in plaintext) and one LOW-severity finding (logging to /tmp). No files modified after 2026-05-15, no direct IOCs for TanStack Shai-Hulud attack. Overall persistence surface appears clean with defensive gaps in credential handling.

## Files/Commands Reviewed
- `find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons -maxdepth 1 -type f -name "*.plist" -print 2>&1 | sort` (exit code 0, 18 plist files found)
- `find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons -type f -newermt "2026-05-15 00:00" -ls 2>&1` (exit code 0, no matches)
- `launchctl list 2>&1 | sort | grep -Ei "(token|monitor|update|agent|helper|github|npm|shai|user)" 2>&1` (exit code 0, filtered services)
- `find ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons -maxdepth 1 -type f -name "*.plist" -print 2>&1 | xargs -I {} plutil -p {} 2>&1` (exit code 0, plist contents)
- `rg -n "(~/.local|/tmp|/private/tmp|curl|wget|bash|sh|python|node|rm -rf|api.github.com)" ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons 2>&1` (exit code 0, 3 matches)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | API key exposed in plaintext LaunchAgent | `/Users/michelkerkmeester/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist:3` contains `VOYAGE_API_KEY=pa-[REDACTED_FOR_REPO_SAFETY]` in ProgramArguments array | Move API key to secure credential store (Keychain) or environment file with restricted permissions (600), rotate the exposed key |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Third-party daemon logging to /tmp | `/Library/LaunchDaemons/com.razer.elevationservice.plist:12-14` writes stdout/stderr to `/tmp/com.razer.elevationservice.daemon.{out,err}` | Configure logging to `/var/log` or `/Library/Logs` with proper permissions; /tmp is world-writable and prone to symlink attacks |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | No persistence artifacts modified post-2026-05-15 | `find ... -newermt "2026-05-15 00:00" -ls` returned no matches (exit code 0) | Continue monitoring for new LaunchAgents/Daemons |
| 002 | No suspicious program arguments patterns | `rg` for curl|wget|bash|sh|python|node|rm -rf|api.github.com returned only benign Adobe flag and Razer log paths | Maintain current baseline |
| 003 | 18 LaunchAgents/Daemons present, all appear legitimate | Plist analysis shows known vendors: Adobe, Bitdefender, Docker, TeamViewer, Razer, Google, CleanMyMac, MEGA, Ollama, Elgato, plus custom session-env agent | Periodic review of third-party persistence mechanisms recommended |

## Convergence Signal
newInfoRatio: 0.35. LaunchAgents + LaunchDaemons dimension is INDICATORS-PRESENT - no direct compromise indicators, but HIGH-severity credential exposure requires immediate remediation.
