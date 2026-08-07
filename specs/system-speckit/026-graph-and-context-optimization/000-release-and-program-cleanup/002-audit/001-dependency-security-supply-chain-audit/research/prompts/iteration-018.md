# Deep Research Iteration 18 of 25 - External-Author Plugins/Skills/Agents

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive print mode, dispatched as iteration 18 of a 25-iteration deep-research campaign on the Public repo's security posture. The Public repo is at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. The trigger event: TanStack npm Mini Shai-Hulud supply-chain attack disclosed 2026-05-15.

## TASK

Audit the external-author plugin, skill, and agent dimension. Produce findings at severities CRITICAL (active threat / immediate risk), HIGH (real exposure), MEDIUM (defensive gap), LOW (best-practice deviation), INFO (informational).

## SCOPE (this iteration only)

1. `.opencode/plugins/`, `.opencode/skills/`, `.claude/agents/`, `.codex/agents/`, `.gemini/`, `.devin/`
2. Plugin manifests and executable entrypoints
3. Skill `SKILL.md` allowed tools and shell-command guidance
4. Agents with broad permissions, network dispatch, or secret access
5. Recently modified plugin/skill/agent files
6. References to external repos, curl installs, npx/uvx execution, or remote MCP endpoints

## VERIFICATION COMMANDS

Run these commands exactly or document any command that is unavailable on this host. Each command produces evidence. Redact secret values, but preserve filenames, permissions, line numbers, process names, command exit codes, and safe metadata.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin -maxdepth 4 -type f 2>&1 | sort | sed -n "1,500p"
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && rg -n --hidden --glob "!**/node_modules/**" "(allowed-tools|permission|dangerous|full-auto|curl|wget|npx|uvx|docker|http://|https://|api[_-]?key|token|secret|MCP|mcp|install|postinstall|eval|base64)" .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .opencode/plugins .opencode/skills .claude/agents .codex/agents .gemini .devin -type f -newermt "2026-05-15 00:00" -ls 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .opencode/plugins -maxdepth 4 -type f \( -name "plugin.json" -o -name "package.json" -o -name "*.js" -o -name "*.ts" \) -print 2>&1 | xargs -I {} nl -ba {} 2>&1
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && find .opencode/skills -maxdepth 3 -name SKILL.md -print 2>&1 | xargs -I {} sed -n "1,80p" {} 2>&1
```

## CONSTRAINTS

- READ-ONLY (no file mutations outside the iteration output file).
- Cite file:line for every finding.
- Use absolute paths.
- If a command finds NO matches, that's a VERIFIED-CLEAN finding (positive evidence).
- Keep iteration runtime under 6 minutes; stop adding new probes past minute 5 and start writing output.
- Do not revoke tokens, delete files, unload LaunchAgents, kill processes, or change credential state.
- If a CRITICAL direct IOC is found, finish the iteration output and mark the convergence verdict COMPROMISE-CONFIRMED.

## OUTPUT FORMAT

Write to `research/iterations/iteration-018.md` with EXACT structure:

```markdown
# Iteration 018 - External-Author Plugins/Skills/Agents

## Summary
<2-3 sentence verdict>

## Files/Commands Reviewed
- <path or command> (<lines read OR exit code>)

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
| - | None | - | - |

## Convergence Signal
<newInfoRatio + verdict on whether this dimension is CLEAN / INDICATORS-PRESENT / COMPROMISE-CONFIRMED>
```

Then append to `research/deep-research-state.jsonl`:
`{"type":"iteration","run":18,"focus":"External-Author Plugins/Skills/Agents","findingsCritical":N,"findingsHigh":N,"findingsMedium":N,"findingsLow":N,"findingsInfo":N,"newInfoRatio":0.NN,"executor":"cli-devin","model":"swe-1.6","durationSec":N,"timestamp":"ISO8601"}`
