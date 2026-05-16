# Iteration 010 - PATH Integrity + Shadow Binaries

## Summary
PATH contains duplicate entries and shadow binaries (python3, uv) with user-writable directories preceding system paths. No active compromise indicators found, but defensive gaps exist in PATH hygiene and binary version management.

## Files/Commands Reviewed
- `zsh -lic 'echo PATH=$PATH; for c in npm npx node git gh codex claude devin gemini python3 pip uv cargo brew; do echo "=== $c ==="; type -a "$c"; which -a "$c"; done'` (exit code: 0)
- `find ~/.local/bin ~/bin /usr/local/bin /opt/homebrew/bin -maxdepth 1 -type f -perm +111 -print` (exit code: 0, 11 executables found)
- `find ~/.local/bin ~/bin /usr/local/bin /opt/homebrew/bin -maxdepth 1 -type f -perm +111 -newermt "2026-05-15 00:00" -ls` (exit code: 0, no recent modifications)
- `for c in npm npx node git gh codex claude devin gemini python3 pip uv cargo brew; do which -a "$c" 2>/dev/null | xargs -I {} shasum -a 256 {} 2>/dev/null; done` (exit code: 0, 14 hashes computed)
- `ls -la ~/.local/bin/* ~/bin/* /usr/local/bin/xcodeproj` (exit code: 0)
- `ls -ld ~/.local/bin ~/bin ~/.cargo/bin /usr/local/bin /opt/homebrew/bin /usr/bin /bin` (exit code: 0)
- `stat -f "%Sp %u %g %N" ~/.local/bin ~/bin ~/.cargo/bin` (exit code: 0)

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
| PATH-001 | Duplicate PATH entries causing potential confusion | PATH contains 5 duplicate entries: `.antigravity/antigravity/bin` (3x), `.opencode/bin` (3x), `~/bin` (2x), `.bun/bin` (2x), `.local/bin` (2x) | Deduplicate PATH in shell configuration (~/.zshrc, ~/.zprofile) |
| PATH-002 | Shadow binary for python3 with different versions | python3 exists at `/usr/bin/python3` (hash: 12bed4523661307059b879b9b54e77a73176e9d27d27a0e40363271d8f0668ba) and `/opt/homebrew/bin/python3` (hash: 2f474ddf576be46e1ecc940407cbb80728e7ebf7d27a47e05572c970524c0487) | Resolve python3 version conflict; ensure consistent version via PATH ordering or virtual environments |
| PATH-003 | Shadow binary for uv with different versions | uv exists at `/Users/michelkerkmeester/.local/bin/uv` (hash: 6b2d54726e2908ff72aa55822310ed4b5b6555d41ef21cfd742c075e9b3cde5f) and `/opt/homebrew/bin/uv` (hash: 01371ebec50f5225e883713a00ea2312cb664346bf976926b8a0f93231141bc5) | Remove duplicate uv installation; standardize on single source |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| PATH-004 | User-writable bin directories precede system directories | ~/.local/bin, ~/bin, ~/.cargo/bin (owned by uid 501, perms 755) appear before /usr/bin, /bin in PATH | Acceptable for user directories; monitor for unauthorized binary additions |
| PATH-005 | pip not found in PATH | pip not found via which/type despite python3 being present | Install pip via python3 -m ensurepip or Homebrew if needed |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| PATH-006 | VERIFIED-CLEAN: No executable files modified since 2026-05-15 | find command returned no results for files modified after 2026-05-15 00:00 | Continue monitoring for suspicious modifications |
| PATH-007 | 11 executables in user bin directories | chrome-devtools-mcp-wrapper, clode-studio, codebase, codebase-index, coderabbit, codesql, uv, uvx, claude, devin, agent-deck | Review necessity and source of each binary periodically |
| PATH-008 | Developer tools show expected distribution | npm/npx/node/codex/gemini/brew via Homebrew; claude/devin via ~/.local/bin; git via /usr/bin; gh via Homebrew; cargo via ~/.cargo/bin | Maintain current distribution; document tool sourcing decisions |

## Convergence Signal
newInfoRatio=0.65 - PATH hygiene issues identified (duplicates, shadow binaries) but no active compromise indicators. Dimension: INDICATORS-PRESENT (defensive gaps requiring remediation but no immediate threat)
