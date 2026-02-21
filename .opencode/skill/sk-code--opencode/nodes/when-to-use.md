---
description: "Activation triggers, keyword matching, and scope boundaries for the OpenCode code standards skill"
---
# When To Use

Defines when to activate this skill, which keyword signals trigger it, and when to use a different skill instead.

## Activation Triggers

**Use this skill when:**
- Writing or modifying OpenCode system code (.opencode/, MCP servers, scripts)
- Creating new JavaScript modules for MCP servers or utilities
- Writing Python scripts (validators, advisors, test utilities)
- Creating Shell scripts (automation, validation, deployment)
- Configuring JSON/JSONC files (manifests, schemas, configs)
- Reviewing code for standards compliance before commit
- Need naming, formatting, or structure guidance

**Keyword triggers:**

| Language   | Keywords                                                                    |
| ---------- | --------------------------------------------------------------------------- |
| JavaScript | `opencode`, `mcp`, `commonjs`, `require`, `module.exports`, `strict`        |
| TypeScript | `typescript`, `ts`, `tsx`, `interface`, `type`, `tsconfig`, `tsc`, `strict` |
| Python     | `python`, `pytest`, `argparse`, `docstring`, `snake_case`                   |
| Shell      | `bash`, `shell`, `shebang`, `set -e`, `pipefail`                            |
| Config     | `json`, `jsonc`, `config`, `schema`, `manifest`                             |

## When NOT to Use

**Do NOT use this skill for:**
- Web/frontend development (use `sk-code--web` instead)
- Browser-specific patterns (DOM, observers, animations)
- CSS styling or responsive design
- CDN deployment or minification workflows
- Full development lifecycle (research/debug/verify phases)

## Skill Comparison

| Aspect        | This Skill (opencode)       | sk-code--web        |
| ------------- | --------------------------- | --------------------- |
| **Target**    | System/backend code         | Web/frontend code     |
| **Languages** | JS, TS, Python, Shell, JSON | HTML, CSS, JavaScript |
| **Phases**    | Standards only              | 4 phases (0-3)        |
| **Browser**   | Not applicable              | Required verification |
| **Focus**     | Internal tooling            | User-facing features  |

**The Standard**: Evidence-based patterns extracted from actual OpenCode codebase files with file:line citations.

## Cross References
- [[smart-routing]] - Language detection and resource routing logic
- [[rules]] - ALWAYS/NEVER/ESCALATE behavioral rules
- [[integration-points]] - Detailed skill differentiation table