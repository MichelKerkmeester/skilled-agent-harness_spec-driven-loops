# Iteration 019 - Hidden Network Exposure

## Summary
System has multiple services listening on all interfaces (0.0.0.0) including ControlCenter (*:5000, *:7000) and FontBase (*:27715). macOS firewall is disabled. Remote access tools (TeamViewer, Pritunl VPN) are installed as daemons. Ollama auto-starts at login listening on localhost. No evidence of repo scripts exposing public ports or running tunnels.

## Files/Commands Reviewed
- `lsof -nP -iTCP -sTCP:LISTEN` (exit code 0, 33 listeners reviewed)
- `lsof -nP -iTCP -sTCP:ESTABLISHED | grep -Ei "(node|python|npm|npx|uvx|codex|claude|devin|gemini|mcp|ssh|ngrok|cloudflared)"` (exit code 0, 3 connections reviewed)
- `netstat -anv | grep -E "LISTEN|ESTABLISHED" | sed -n "1,240p"` (exit code 0, 240 lines reviewed)
- `ps auxww | grep -Ei "(serve|listen|http-server|vite|next|webpack|ngrok|cloudflared|ssh -R|socat|docker|kubectl|colima|mcp)" | grep -v grep` (exit code 0, processes reviewed)
- `rg -n --hidden --glob "!**/node_modules/**" "(0\.0\.0\.0|listen\(|--host|host 0\.0\.0\.0|ngrok|cloudflared|ssh -R|socat|EXPOSE |ports:|localhost.run|serveo)" .` (exit code 0, matches reviewed)
- `docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"` (exit code 1, daemon not running)
- `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate` (exit code 0, firewall state reviewed)
- `ls -la ~/Library/LaunchAgents/` (exit code 0, 7 agents reviewed)
- `ls -la /Library/LaunchAgents/` (exit code 0, 3 agents reviewed)
- `ls -la /Library/LaunchDaemons/` (exit code 0, 11 daemons reviewed)
- `cat ~/.zshrc` (exit code 0, 100 lines reviewed)
- `/Library/LaunchDaemons/com.pritunl.service.plist` (18 lines reviewed)
- `/Library/LaunchDaemons/com.teamviewer.Helper.plist` (23 lines reviewed)
- `/Users/michelkerkmeester/Library/LaunchAgents/homebrew.mxcl.ollama.plist` (38 lines reviewed)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I019-H001 | macOS firewall is disabled | `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate` returned "Firewall is disabled. (State = 0)" | Enable macOS firewall: System Settings → Network → Firewall → Turn On |
| I019-H002 | ControlCenter listening on all interfaces | `lsof` shows ControlCenter (PID 703) listening on *:5000 and *:7000 (IPv4 and IPv6) | Investigate ControlCenter purpose; if not needed, disable the service or bind to localhost only |
| I019-H003 | FontBase listening on all interfaces | `lsof` shows FontBase (PID 989) listening on *:27715 (IPv6) | Configure FontBase to bind to 127.0.0.1 only or disable if not needed |
| I019-H004 | TeamViewer remote access daemon installed | `/Library/LaunchDaemons/com.teamviewer.Helper.plist` installs privileged helper tool for TeamViewer remote access | Remove TeamViewer if not needed: `/Library/LaunchDaemons/com.teamviewer.*.plist` and uninstall app |
| I019-H005 | Pritunl VPN service daemon installed | `/Library/LaunchDaemons/com.pritunl.service.plist` installs VPN service that can create tunnels | Remove Pritunl if not needed: unload daemon `sudo launchctl unload /Library/LaunchDaemons/com.pritunl.service.plist` and uninstall app |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I019-M001 | Ollama auto-starts at login listening on localhost | `homebrew.mxcl.ollama.plist` runs `ollama serve` at login with KeepAlive=true; `lsof` shows ollama (PID 26086) listening on 127.0.0.1:11434 | If not needed, disable auto-start: `launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.ollama.plist` |
| I019-M002 | Devin CLI has established outbound connections to Google Cloud | `lsof` shows devin (PID 602) with 2 ESTABLISHED connections to 34.160.81.0:443 and 35.223.238.178:443 | Verify these connections are expected for Devin operation; monitor for unusual traffic patterns |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I019-L001 | Docker socket and vmnet daemons installed but daemon not running | `/Library/LaunchDaemons/com.docker.socket.plist` and `com.docker.vmnetd.plist` present; `docker ps` failed with "daemon is not running" | No action needed if Docker is not used; if needed, start Docker daemon manually |
| I019-L002 | Multiple MCP servers running via npm exec | `ps auxww` shows many npm exec processes for MCP servers (chrome-devtools-mcp, clickup-mcp-server, figma-developer-mcp, mcp-server-github, etc.) | Verify these are expected; they appear to be local stdio processes, not network listeners |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| I019-I001 | No repo scripts expose public ports or run tunnels | `rg` search found no 0.0.0.0 bindings, ngrok, cloudflared, ssh -R, or tunnel configurations in active code (only references in archived docker-compose.yml with localhost-only bindings) | No action needed; this is the secure state |
| I019-I002 | Shell startup files don't start listeners or tunnels | `~/.zshrc` contains only PATH exports and function definitions; no network listeners or tunnel commands | No action needed; this is the secure state |
| I019-I003 | All listening processes bound to localhost except known system services | `lsof` shows all developer tools (node, ollama, language servers) bound to 127.0.0.1; only ControlCenter, FontBase, and rapportd bind to all interfaces | Continue monitoring for unexpected 0.0.0.0 bindings |

## Convergence Signal
newInfoRatio: 0.73 - HIGH: Found 5 HIGH-severity issues (disabled firewall, 3 services listening on all interfaces, 2 remote access daemons), 2 MEDIUM issues (auto-starting local service, outbound cloud connections), 2 LOW issues (installed but unused Docker daemons, many MCP processes), 3 INFO findings (verified repo scripts are clean). This dimension has INDICATORS-PRESENT - significant network exposure risks exist at the OS level (firewall disabled, services on all interfaces, remote access tools installed) but the repo itself is clean.
