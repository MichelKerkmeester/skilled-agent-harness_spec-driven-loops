Iteration 020 complete. I've synthesized findings from 19 primary iterations and identified significant evidence quality gaps and missing remediation coordination.

**Key findings:**
- **2 CRITICAL**: Devin session token world-readable, npx -y supply chain vector
- **8 HIGH**: Pipe-to-shell patterns, Voyage API key exposure, external MCP servers, disabled firewall, services on 0.0.0.0, remote access daemons, editable dependencies, no pip security hardening
- **12 MEDIUM**: Hardcoded test token, world-readable task files, external dependencies without provenance, multiple package managers, unpinned build-backend, archived postinstall hooks, PATH issues, npx unpinned MCP server, hook command injection, relative MCP paths, apt-get in CI
- **13 LOW**: Documentation verification gaps, unpinned dependencies, Python version conflicts, PATH ordering, daemon logging, updater frequency, error handling, broad permissions
- **7 INFO**: Evidence quality gap (18/19 iterations lack proper citations), remediation coordination gap, token revocation safety undefined, convergence trend analysis, missing iteration 014 completion, state file inconsistency, OS-level vs repo-level scope confusion

**Convergence signal:** INDICATORS-PRESENT (newInfoRatio: 0.85). The synthesis dimension revealed significant process gaps that undermine confidence in the overall security assessment. While the Public repo codebase is largely CLEAN, the lack of proper citations and coordinated remediation planning means real risks may not be systematically addressed.

Output written to `research/iterations/iteration-020.md` and state appended to `research/deep-research-state.jsonl`.
RIFIED-CLEAN)" research/iterations/iteration-0*.md` (exit code 0)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Devin session token world-readable | Iteration 012: `~/.local/share/devin/credentials.toml` with 644 permissions exposes JWT session token to all users | chmod 600 ~/.local/share/devin/credentials.toml; devin auth logout && devin auth login (rotate token) |
| 002 | npx -y supply chain vector | Iteration 011: `npx -y` flag across all MCP configs creates supply chain attack vector without version pinning | Pin exact versions for all npx installations; audit MCP server allowlist; remove -y flag or implement SBOM verification |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Pipe-to-shell patterns in documentation | Iteration 004: curl | bash patterns in documentation without verification steps | Add checksum verification or manual review steps to all install documentation |
| 002 | Voyage API key plaintext in LaunchAgent | Iteration 006/007: `/Users/michelkerkmeester/Library/LaunchAgents/com.michelkerkmeester.session-env.voyage-api-key.plist:12` contains API key in ProgramArguments | Move API key to environment variable or keychain; remove from LaunchAgent plist |
| 003 | External MCP servers outside allowlist | Iteration 011: chrome-devtools-mcp, figma-developer-mcp, clickup-mcp-server, mcp-server-github running outside standard allowlist | Audit external MCP servers; add to centralized allowlist or remove if unused |
| 004 | Firewall disabled | Iteration 019: macOS firewall disabled creating network exposure | Enable macOS firewall; configure application-specific rules |
| 005 | Services listening on 0.0.0.0 | Iteration 019: Multiple services listening on all interfaces instead of localhost | Bind services to 127.0.0.1; configure firewall to block external access |
| 006 | Remote access daemons installed | Iteration 019: TeamViewer and Pritunl VPN daemons present | Audit remote access need; remove if unused or restrict to specific networks |
| 007 | Editable dependency with external path | Iteration 004: Python editable dependency references external path | Use proper package installation from PyPI or verified source |
| 008 | No pip security hardening | Iteration 004: No pip security hardening configured | Enable pip audit; implement dependency pinning; use requirements.txt with hashes |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Hardcoded test token | Iteration 002: `.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts:107` contains hardcoded placeholder token | Use environment variable for test tokens; add to .gitignore if sensitive |
| 002 | World-readable task files | Iteration 002: 100+ world-readable task files in `~/.claude/tasks/` (mode 644) | chmod 600 ~/.claude/tasks/*; review for sensitive information |
| 003 | External dependencies without provenance | Iteration 004: External dependencies lack provenance tracking | Implement SBOM generation; use signed packages where available |
| 004 | Multiple package managers without governance | Iteration 004: npm, pip, cargo, uv, brew without unified security governance | Centralize package management policy; implement unified dependency scanning |
| 005 | Unpinned build-backend | Iteration 004: Python build-backend not pinned | Pin build-backend version in pyproject.toml |
| 006 | External command in archived postinstall | Iteration 005: z_future archived babysitter-gemini postinstall hook executes external commands | Review archived code; remove or quarantine if truly unused |
| 007 | Duplicate PATH entries | Iteration 010: PATH contains duplicate entries for antigravity (3x) and opencode (2x) | Deduplicate PATH in ~/.zshrc |
| 008 | Shadow binaries for python3 and uv | Iteration 010: Different versions of python3 and uv in multiple locations causing shadowing | Resolve version conflicts; use explicit version management (pyenv, uv) |
| 009 | npx -y for MCP server without pinning | Iteration 018: `.devin/config.json` and `.gemini/settings.json` use `npx -y @modelcontextprotocol/server-sequential-thinking` without version pinning | Pin exact version; remove -y flag or implement pre-install audit |
| 010 | Hook command injection surface | Iteration 018: `.devin/hooks.v1.json` executes node scripts via `bash -c` with interpolated environment variables | Sanitize environment variables; use safer execution patterns |
| 011 | Relative paths for local MCP servers | Iteration 011: Relative paths for local MCP servers vulnerable to path manipulation | Use absolute paths for local server configurations |
| 012 | Package installation via apt-get in CI | Iteration 017: Workflow uses apt-get instead of pre-installed runner or cached action | Use GitHub Actions cached runners or pre-installed tools |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Documentation install commands lack verification | Iteration 004: Install commands in documentation lack verification steps | Add checksum or GPG signature verification to documentation |
| 002 | Unpinned development dependencies | Iteration 004: Development dependencies not pinned | Pin all dependencies including devDependencies |
| 003 | Mixed Python version management | Iteration 004: Multiple Python version management tools present | Standardize on single Python version manager |
| 004 | User-writable bin directories precede system paths | Iteration 010: User-writable bin directories appear before system paths in PATH | Reorder PATH to put system paths first |
| 005 | Razer daemon logging to /tmp | Iteration 006: Razer daemon logs to /tmp (symlink attack risk) | Configure Razer daemon to log to secure location |
| 006 | Multiple application updaters | Iteration 007: Multiple application updaters running at frequent intervals | Consolidate updater schedules; review necessity |
| 007 | PATH duplication in ~/.zshrc | Iteration 008: PATH entries duplicated in ~/.zshrc | Deduplicate PATH entries |
| 008 | Plugin child_process error handling | Iteration 018: Plugin child_process usage lacks defensive error handling | Add proper error handling and input validation |
| 009 | Broad skill tool permissions | Iteration 018: Some skills have broad tool permissions that could be narrowed | Review and narrow skill tool permissions to minimum required |
| 010 | Documentation normalizes curl pipe-to-bash | Iteration 018: Documentation normalizes potentially unsafe install patterns | Update documentation to promote safer installation methods |
| 011 | Archived docker-compose.yml with localhost binding | Iteration 015: Archived docker-compose.yml has localhost-only port bindings | Review archived code; remove if truly unused |
| 012 | Unused Docker daemons | Iteration 019: Unused Docker daemons running | Stop unused Docker daemons; review container necessity |
| 013 | MCP processes running | Iteration 019: MCP processes running (need context) | Audit MCP processes; stop if unused |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | Evidence quality gap | Only iteration 016 has structured findings table with proper file:line citations; 18/19 iterations lack detailed evidence columns | Standardize iteration output format to require evidence columns with file:line citations |
| 002 | Remediation coordination gap | No coordinated remediation playbook exists for 20 findings across dimensions | Create prioritized remediation playbook with dependency tracking |
| 003 | Token revocation safety undefined | No sequencing guidance for which tokens to revoke first (Devin JWT vs Voyage API key vs others) | Define token revocation order based on exposure risk and service criticality |
| 004 | Convergence trend analysis | 9 CLEAN, 8 INDICATORS-PRESENT, 1 COMPROMISE-CONFIRMED iterations across 19 dimensions | Document convergence patterns; prioritize INDICATORS-PRESENT dimensions that could escalate |
| 005 | Missing iteration 014 completion | Iteration 014 contains context compaction summary instead of actual workspace trust audit findings | Re-run iteration 014 to complete workspace trust file audit |
| 006 | State file inconsistency | Iteration 16 has duplicate state entries in deep-research-state.jsonl | Clean up duplicate state entries; ensure one entry per iteration |
| 007 | OS-level vs repo-level scope confusion | Iteration 019 findings (firewall, services) are OS-level, not repo-level | Clarify scope boundaries; separate OS security audit from repo security audit |

## Convergence Signal
newInfoRatio: 0.85 - INDICATORS-PRESENT. The synthesis dimension reveals significant process gaps (evidence quality, remediation coordination) that undermine confidence in the overall security assessment. While no direct TanStack Mini Shai-Hulud compromise indicators were found in the repo codebase, the lack of proper citations and coordinated remediation planning means real risks (credential exposure, network exposure, supply chain vectors) may not be systematically addressed. The evidence quality gap represents a meta-security issue that could mask or delay detection of actual threats.
