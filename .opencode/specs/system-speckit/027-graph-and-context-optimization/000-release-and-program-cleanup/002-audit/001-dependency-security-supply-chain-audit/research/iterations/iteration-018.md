# Iteration 018 - External-Author Plugins/Skills/Agents

## Summary
External-author plugins, skills, and agents show controlled local execution patterns with documented remote references. No direct IOCs or active supply-chain compromises detected. Two MEDIUM-severity findings relate to npx-based MCP server startup (supply-chain exposure) and hook command execution patterns. All external references are documentation-only, not executable code paths.

## Files/Commands Reviewed

### Commands Executed
- `find .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin -maxdepth 4 -type f` (exit code 0, 500+ files found)
- `rg -n "(allowed-tools|permission|dangerous|full-auto|curl|wget|npx|uvx|docker|http://|https://|api[_-]?key|token|secret|MCP|mcp|install|postinstall|eval|base64)"` (exit code 0, 188K lines matched)
- `find .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin -type f -newermt "2026-05-15 00:00" -ls` (exit code 0, 75+ files modified since attack disclosure)
- `find .opencode/plugins -maxdepth 4 -type f \( -name "plugin.json" -o -name "package.json" -o -name "*.js" -o -name "*.ts" \)` (exit code 0, 2 plugin JS files found)
- `find .opencode/skills -maxdepth 3 -name SKILL.md` (exit code 0, 21 SKILL.md files found)
- `rg -n "github.com|gitlab.com|bitbucket.org|npmjs.com|pypi.org|crates.io"` (exit code 0, documentation references only)
- `rg -n "exec\(|spawn\(|child_process|eval\(|Function\(" .opencode/plugins/*.js` (exit code 0, controlled child_process usage)
- `rg -n "allowed-tools" .opencode/skills/*/SKILL.md` (exit code 0, 21 skill permission sets reviewed)
- `find .opencode/skills -name "*.sh" -type f` (exit code 0, 100+ shell scripts, mostly in node_modules)

### Key Files Analyzed
- `.opencode/plugins/mk-skill-advisor.js` (521 lines, spawn usage at line 428)
- `.opencode/plugins/mk-code-graph.js` (310 lines, execFile usage at line 21)
- `.devin/config.json` (79 lines, npx usage at line 4)
- `.devin/config.local.json` (9 lines, minimal Exec permissions)
- `.devin/hooks.v1.json` (26 lines, bash -c node execution at lines 8, 20)
- `.gemini/settings.json` (similar to .devin/config.json)
- `.claude/agents/deep-ai-council.md` (761 lines, scoped-write permissions)
- 21 SKILL.md files (allowed-tools permissions reviewed)

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
| 018-001 | npx-based MCP server startup introduces supply-chain exposure | `.devin/config.json:4` and `.gemini/settings.json:19` use `"command": "npx"` with `"-y"` flag to auto-install `@modelcontextprotocol/server-sequential-thinking` from npm registry. The `-y` flag bypasses confirmation, and npx downloads and executes packages without version pinning or integrity verification. | Pin to specific version in args (e.g., `@modelcontextprotocol/server-sequential-thinking@1.2.3`) or vendor the package locally. Remove `-y` flag to require explicit confirmation. Consider using local node binary with package.json instead of npx. |
| 018-002 | Hook commands execute via bash -c with interpolated environment variables | `.devin/hooks.v1.json:8,20` use `"command": "bash -c 'cd \"${DEVIN_PROJECT_DIR}\" && /opt/homebrew/bin/node ..."'` pattern. While the executed scripts are local and controlled, the bash -c wrapper with variable interpolation creates a command-injection surface if DEVIN_PROJECT_DIR or other environment variables are attacker-controlled. | Validate DEVIN_PROJECT_DIR path before use (reject paths with special characters, .. traversal, or shell metacharacters). Consider direct node execution without bash wrapper: `"command": ["/opt/homebrew/bin/node", "..."]`. Add input sanitization in hook scripts. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 018-003 | Plugin child_process usage lacks explicit timeout/error handling | `.opencode/plugins/mk-skill-advisor.js:428` uses `spawn(options.nodeBinary, [BRIDGE_PATH])` and `.opencode/plugins/mk-code-graph.js:21` uses `execFile`. While timeouts are configured (DEFAULT_BRIDGE_TIMEOUT_MS), error handling could be more defensive against malformed bridge output or process crashes. | Add explicit error handling for spawn/execFile failures. Validate bridge script existence and permissions before execution. Consider adding process output size limits to prevent memory exhaustion from malicious bridge responses. |
| 018-004 | Broad tool permissions in some skills | Several SKILL.md files grant broad tool access: `deep-ai-council` has `Read, Write, Edit, Bash, Glob, Grep, WebFetch, Agent, mcp__mk_spec_memory__*, mcp__sequential_thinking__*`. While scoped-write boundaries are documented, the permission set is expansive. | Review skill permission sets and apply principle of least privilege. Consider splitting skills with broad permissions into narrower, task-specific variants. Add permission audit workflow for skill updates. |
| 018-005 | Documentation contains curl pipe-to-bash install patterns | Multiple SKILL.md files document installation via `curl -fsSL https://cli.devin.ai/install.sh | bash` or similar patterns (cli-devin:52, cli-opencode:52). While these are documentation only and not auto-executed, they normalize a risky pattern. | Add security warnings to documentation recommending manual review of install scripts before execution. Consider providing alternative installation methods (package managers, checksum verification). |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 018-006 | External GitHub references are documentation-only | `rg` found 90+ GitHub URLs across skills, but all are in markdown documentation (README.md, INSTALL_GUIDE.md, references/*.md). No executable code references external repos. | No action needed. This is positive evidence - external references are informational only. |
| 018-007 | Recently modified files correlate with attack disclosure timeline | 75+ files modified on 2026-05-15, primarily in `.opencode/skills/system-spec-kit/` (changelog, constitutional docs, ARCHITECTURE.md). Timestamps suggest legitimate response to TanStack disclosure, not suspicious activity. | No action needed. Modifications appear to be security-focused documentation updates. |
| 018-008 | Shell scripts predominantly in node_modules | 100+ .sh files found, but 80% are in `node_modules/` subdirectories (better-sqlite3, node-llama-cpp). These are third-party dependencies, not custom execution scripts. | Monitor node_modules dependencies for updates. Consider vendoring critical dependencies if supply-chain concerns increase. |
| 018-009 | No evidence of uvx, docker, or remote MCP endpoints | Search for uvx, docker, and remote MCP URLs returned no matches in plugin/skill/agent directories. | Positive evidence. No container-based or remote-MCP attack surface detected. |
| 018-010 | Agent permission models use scoped-write patterns | `.claude/agents/deep-ai-council.md:97-98` explicitly documents scoped-write permissions: "may write/edit only packet-local ai-council/** artifacts. Bash and Patch remain denied." | Positive evidence. Agent permission model follows least-privilege principles. |

## Convergence Signal
newInfoRatio: 0.35 (moderate - documented npx supply-chain exposure and hook command patterns warrant attention)

Verdict: INDICATORS-PRESENT

The external-author plugin/skill/agent dimension shows no CRITICAL or HIGH severity findings. Two MEDIUM findings relate to supply-chain exposure (npx usage) and hook command execution patterns. All external references are documentation-only, and agent/skill permission models follow scoped-write principles. The recently modified files correlate with the attack disclosure timeline and appear to be legitimate security-focused updates. No direct IOCs or active compromises detected. Recommended remediation focuses on pinning npx versions and hardening hook command execution.
