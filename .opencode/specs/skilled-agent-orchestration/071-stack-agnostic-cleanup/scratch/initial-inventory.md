---
title: "Initial Inventory: Phase 071 Stack-Agnostic Cleanup"
description: "Initial grep inventory for stack-specific references in non-sk-code skills."
---

# Initial Inventory

Date: 2026-05-05

## Command

```bash
grep -rEi "webflow|motion\.dev|motion_dev|a_nobel|anobel|\bGSAP\b|\bLenis\b|\bHLS\b|\bSwiper\b|\bFilePond\b|BEM CSS|snake_case JS" .opencode/skills/ --include='*.md' --include='*.json' --include='*.toml' 2>/dev/null | grep -v "/sk-code/" | grep -v "/changelog/"
```

## Counts

| Scope | Hits |
|-------|------|
| Raw command output | 368 |
| User-facing skill content excluding vendored `.venv/` and `node_modules/` | 363 |

Vendored dependency matches were observed under skill-local dependency directories. They are not authored skill guidance; final user-facing validation should exclude vendored dependency folders while the user-facing skill layer is cleaned to zero.

## Initial Folder Distribution

| Skill or Area | Initial Hits |
|---------------|--------------|
| `mcp-code-mode` | 316 |
| `system-spec-kit` | 16 |
| `sk-code-review` | 14 |
| `mcp-chrome-devtools` | 4 |
| `sk-doc` | 3 |
| `cli-opencode` | 3 |
| `mcp-coco-index` | 2 |
| `cli-copilot` | 2 |
| `sk-git` | 1 |
| `cli-gemini` | 1 |
| `cli-codex` | 1 |
| `cli-claude-code` | 1 |
| root `.opencode/skills/README.md` | 4 |

## Representative Matches

- CLI skills: surface-loading instructions named concrete `sk-code` surface tags.
- MCP skills: Code Mode examples named a specific external CMS and its `tool.tool_*` namespace.
- Review skill: examples used concrete surface tags where `<surface>` placeholders are sufficient.
- System Spec Kit: memory examples and advisor graph signals named a specific frontend stack and library-specific intents.
- Root skill README: high-level summary named the previous stack-specific `sk-code` examples.
