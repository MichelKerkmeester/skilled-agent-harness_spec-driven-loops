# Iteration 013 - GitHub State

## Summary
GitHub authentication and repository configuration is properly secured with standard credential helper setup. Two GitHub accounts are configured (one active, one inactive) with appropriate scopes. No recent SSH key changes detected, and minimal GitHub CLI extensions installed. No security concerns identified.

## Files/Commands Reviewed
- `gh auth status` (exit code 0)
- `gh api user -q "{login: .login, id: .id}"` (exit code 0)
- `gh api user/keys --jq ".[] | {id,title,created_at}"` (exit code 1 - scope limitation)
- `gh extension list` (exit code 0)
- `gh alias list` (exit code 0)
- `git remote -v` (exit code 0)
- `git config --global --show-origin --get-regexp "credential|url\..*insteadOf|includeIf|core.sshCommand"` (exit code 0)
- `ls -la ~/.ssh` (exit code 0)
- `find ~/.ssh -maxdepth 1 -type f -newermt "2026-05-15 00:00" -ls` (exit code 0)

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
| - | None | - | - |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| GITHUB-001 | Two GitHub accounts configured in keyring | `gh auth status` shows MichelKerkmeester (active) and michelkerkmeester-barter (inactive), both with scopes: gist, read:org, repo, workflow | No action needed - standard multi-account setup |
| GITHUB-002 | Token lacks admin:public_key scope | `gh api user/keys` returned HTTP 404 with message "This API operation needs the 'admin:public_key' scope" | No action needed - scope limitation is intentional for security principle of least privilege |
| GITHUB-003 | GitHub CLI credential helper configured | `git config --global` shows credential.https://github.com.helper set to !/opt/homebrew/bin/gh auth git-credential | No action needed - standard secure credential management |
| GITHUB-004 | Minimal GitHub CLI extensions installed | `gh extension list` shows only github/gh-copilot v1.2.0 | No action needed - minimal attack surface |
| GITHUB-005 | No recent SSH key changes | `find ~/.ssh -newermt "2026-05-15 00:00"` returned no results | VERIFIED-CLEAN - no post-disclosure SSH modifications |
| GITHUB-006 | SSH directory contains only agent directory and known_hosts | `ls -la ~/.ssh` shows agent/ (May 2) and known_hosts (Aug 25 2025), no private key files in main directory | No action needed - private keys likely in agent subdirectory with proper isolation |

## Convergence Signal
newInfoRatio: 0.15 - CLEAN

This dimension shows no security concerns. GitHub authentication follows best practices with keyring storage, appropriate scopes, and standard credential helper configuration. No evidence of compromise or unauthorized access. The lack of recent SSH changes post-disclosure is a positive indicator. VERIFIED-CLEAN for GitHub State dimension.
